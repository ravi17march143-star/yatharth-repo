import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

function getPeriodDates(period: string): { start: Date; end: Date } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (period) {
    case 'this_month':
      return { start: new Date(year, month, 1), end: new Date(year, month + 1, 0, 23, 59, 59) };
    case 'last_month':
      return { start: new Date(year, month - 1, 1), end: new Date(year, month, 0, 23, 59, 59) };
    case 'this_quarter': {
      const q = Math.floor(month / 3);
      return { start: new Date(year, q * 3, 1), end: new Date(year, q * 3 + 3, 0, 23, 59, 59) };
    }
    case 'this_year':
      return { start: new Date(year, 0, 1), end: new Date(year, 11, 31, 23, 59, 59) };
    case 'last_year':
      return { start: new Date(year - 1, 0, 1), end: new Date(year - 1, 11, 31, 23, 59, 59) };
    case 'all':
      return { start: new Date(2000, 0, 1), end: new Date(2099, 11, 31) };
    default:
      return { start: new Date(year, 0, 1), end: new Date(year, 11, 31, 23, 59, 59) };
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'income';
  const period = searchParams.get('period') || 'this_year';
  const { start, end } = getPeriodDates(period);

  let data = {};

  try {
    if (type === 'income') {
      const Payment = mongoose.model('Payment');

      const totalResult = await Payment.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]);

      const byMonth = await Payment.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: { year: { $year: '$date' }, month: { $month: '$date' } },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            month: {
              $concat: [
                { $toString: '$_id.year' }, '-',
                { $toString: '$_id.month' },
              ],
            },
            total: 1,
            count: 1,
          },
        },
      ]);

      data = {
        income: {
          total: totalResult[0]?.total || 0,
          count: totalResult[0]?.count || 0,
          byMonth,
        },
      };
    }

    else if (type === 'expense') {
      const Expense = mongoose.model('Expense');

      const totalResult = await Expense.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]);

      const byCategory = await Expense.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'expensecategories',
            localField: '_id',
            foreignField: '_id',
            as: 'cat',
          },
        },
        { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
        { $sort: { total: -1 } },
        {
          $project: {
            name: { $ifNull: ['$cat.name', 'Uncategorized'] },
            total: 1,
            count: 1,
          },
        },
      ]);

      data = {
        expense: {
          total: totalResult[0]?.total || 0,
          count: totalResult[0]?.count || 0,
          byCategory,
        },
      };
    }

    else if (type === 'leads') {
      const Lead = mongoose.model('Lead');

      const total = await Lead.countDocuments({});
      const converted = await Lead.countDocuments({ dateconverted: { $ne: null } });
      const lost = await Lead.countDocuments({ lost: 1 });

      const byStatus = await Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'leadstatuses',
            localField: '_id',
            foreignField: '_id',
            as: 'status',
          },
        },
        { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            name: { $ifNull: ['$status.name', 'Unknown'] },
            color: { $ifNull: ['$status.color', '#6b7280'] },
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]);

      data = {
        leads: { total, converted, lost, byStatus },
      };
    }

    else if (type === 'tickets') {
      const Ticket = mongoose.model('Ticket');

      const total = await Ticket.countDocuments({});

      const byStatus = await Ticket.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'ticketstatuses',
            localField: '_id',
            foreignField: '_id',
            as: 'status',
          },
        },
        { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            name: { $ifNull: ['$status.name', 'Unknown'] },
            color: { $ifNull: ['$status.color', '#6b7280'] },
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]);

      const open = byStatus
        .filter((s: { name: string; count: number }) => !['Closed', 'Resolved'].includes(s.name))
        .reduce((sum: number, s: { count: number }) => sum + s.count, 0);
      const closed = total - open;

      data = {
        tickets: { total, open, closed, byStatus },
      };
    }

    else if (type === 'invoices') {
      const Invoice = mongoose.model('Invoice');
      // status: 1=Unpaid, 2=Paid, 3=Partial, 4=Overdue, 5=Cancelled, 6=Draft

      const totals = await Invoice.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { $sum: '$total' },
          },
        },
      ]);

      const statusMap: Record<number, string> = { 1: 'unpaid', 2: 'paid', 3: 'partial', 4: 'overdue', 5: 'cancelled', 6: 'draft' };
      let total = 0, paid = 0, unpaid = 0, overdue = 0, revenue = 0;

      totals.forEach((t: { _id: number; count: number; revenue: number }) => {
        total += t.count;
        const key = statusMap[t._id];
        if (key === 'paid') { paid = t.count; revenue = t.revenue; }
        if (key === 'unpaid') unpaid = t.count;
        if (key === 'overdue') overdue = t.count;
      });

      data = {
        invoices: { total, paid, unpaid, overdue, revenue },
      };
    }

    else if (type === 'projects') {
      const Project = mongoose.model('Project');

      const total = await Project.countDocuments({});
      const active = await Project.countDocuments({ status: 1 });
      const completed = await Project.countDocuments({ status: 4 });

      data = {
        projects: { total, active, completed },
      };
    }

  } catch (err) {
    console.error('Reports error:', err);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }

  return NextResponse.json({ data });
}
