import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const Invoice = mongoose.model('Invoice');
  const Client = mongoose.model('Client');
  const Project = mongoose.model('Project');
  const Task = mongoose.model('Task');
  const Lead = mongoose.model('Lead');
  const Ticket = mongoose.model('Ticket');
  const Expense = mongoose.model('Expense');
  const Payment = mongoose.model('Payment');

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalClients,
    totalInvoices,
    totalRevenue,
    totalOutstanding,
    activeProjects,
    openTasks,
    openLeads,
    openTickets,
    monthlyRevenue,
    monthlyExpenses,
    recentInvoices,
    recentProjects,
    recentTickets,
    monthlyRevenueChart,
    monthlyExpenseChart,
    taskStatusBreakdown,
    leadStatusBreakdown,
  ] = await Promise.all([
    Client.countDocuments({ active: 1 }),
    Invoice.countDocuments(),
    Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    Invoice.aggregate([{ $match: { status: { $in: [1, 3, 4] } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Project.countDocuments({ status: 1 }),
    Task.countDocuments({ status: { $ne: 5 } }),
    Lead.countDocuments({ dateconverted: null, lost: 0 }),
    Ticket.countDocuments({}),
    Payment.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Invoice.find().sort({ datecreated: -1 }).limit(5).populate('client', 'company').lean(),
    Project.find({ status: 1 }).sort({ createdAt: -1 }).limit(5).populate('client', 'company').lean(),
    Ticket.find().sort({ date: -1 }).limit(5).populate('client', 'company').lean(),

    // 6-month revenue chart
    Payment.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),

    // 6-month expense chart
    Expense.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          expenses: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),

    // Task status breakdown
    Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // Lead status breakdown
    Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $lookup: { from: 'leadstatuses', localField: '_id', foreignField: '_id', as: 'statusInfo' } },
      { $unwind: { path: '$statusInfo', preserveNullAndEmptyArrays: true } },
      { $project: { name: { $ifNull: ['$statusInfo.name', 'Unknown'] }, color: { $ifNull: ['$statusInfo.color', '#6b7280'] }, count: 1 } },
    ]),
  ]);

  // Build 6-month chart data (merge revenue + expense by month)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartMonths: Record<string, { month: string; revenue: number; expenses: number }> = {};

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    chartMonths[key] = { month: monthNames[d.getMonth()], revenue: 0, expenses: 0 };
  }

  monthlyRevenueChart.forEach((m: { _id: { year: number; month: number }; revenue: number }) => {
    const key = `${m._id.year}-${m._id.month}`;
    if (chartMonths[key]) chartMonths[key].revenue = m.revenue;
  });

  monthlyExpenseChart.forEach((m: { _id: { year: number; month: number }; expenses: number }) => {
    const key = `${m._id.year}-${m._id.month}`;
    if (chartMonths[key]) chartMonths[key].expenses = m.expenses;
  });

  const revenueExpenseChart = Object.values(chartMonths);

  // Task status breakdown
  const taskStatusLabels: Record<number, string> = { 1: 'Not Started', 2: 'In Progress', 3: 'Testing', 4: 'Awaiting', 5: 'Complete' };
  const taskChart = taskStatusBreakdown.map((t: { _id: number; count: number }) => ({
    name: taskStatusLabels[t._id] || 'Unknown',
    count: t.count,
  }));

  return NextResponse.json({
    stats: {
      totalClients,
      totalInvoices,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOutstanding: totalOutstanding[0]?.total || 0,
      activeProjects,
      openTasks,
      openLeads,
      openTickets,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      monthlyExpenses: monthlyExpenses[0]?.total || 0,
    },
    recentInvoices,
    recentProjects,
    recentTickets,
    charts: {
      revenueExpense: revenueExpenseChart,
      taskStatus: taskChart,
      leadStatus: leadStatusBreakdown,
    },
  });
}
