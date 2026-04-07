import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    const Invoice = mongoose.model('Invoice');
    const Project = mongoose.model('Project');
    const Ticket = mongoose.model('Ticket');
    const Payment = mongoose.model('Payment');

    const [invoiceStats, projectStats, ticketStats, paymentStats, recentInvoices, recentTickets] = await Promise.all([
      Invoice.aggregate([
        { $match: { client: new mongoose.Types.ObjectId(clientId) } },
        { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$total' } } },
      ]),
      Project.aggregate([
        { $match: { client: new mongoose.Types.ObjectId(clientId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Ticket.aggregate([
        { $match: { userid: new mongoose.Types.ObjectId(clientId) } },
        { $group: { _id: null, total: { $sum: 1 } } },
      ]),
      Payment.aggregate([
        { $match: { client: new mongoose.Types.ObjectId(clientId) } },
        { $group: { _id: null, total: { $sum: 1 }, amount: { $sum: '$amount' } } },
      ]),
      Invoice.find({ client: new mongoose.Types.ObjectId(clientId) })
        .sort({ datecreated: -1 })
        .limit(3)
        .select('prefix number total status date due_date')
        .lean(),
      Ticket.find({ userid: new mongoose.Types.ObjectId(clientId) })
        .sort({ date: -1 })
        .limit(3)
        .select('ticketid subject status priority date')
        .lean(),
    ]);

    // Process invoice stats
    let totalInvoices = 0, unpaidInvoices = 0, overdueInvoices = 0;
    invoiceStats.forEach((s: { _id: number; count: number }) => {
      totalInvoices += s.count;
      if (s._id === 1) unpaidInvoices = s.count;
      if (s._id === 4) overdueInvoices = s.count;
    });

    // Process project stats
    let totalProjects = 0, activeProjects = 0;
    projectStats.forEach((s: { _id: number; count: number }) => {
      totalProjects += s.count;
      if (s._id === 1) activeProjects = s.count;
    });

    // Ticket count
    const openTickets = await Ticket.countDocuments({ userid: new mongoose.Types.ObjectId(clientId) });

    return NextResponse.json({
      stats: {
        invoices: { total: totalInvoices, unpaid: unpaidInvoices, overdue: overdueInvoices },
        projects: { total: totalProjects, active: activeProjects },
        tickets: { total: openTickets, open: openTickets },
        payments: {
          total: paymentStats[0]?.total || 0,
          amount: paymentStats[0]?.amount || 0,
        },
      },
      recentInvoices,
      recentTickets,
    });
  } catch (err) {
    console.error('Portal dashboard error:', err);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
