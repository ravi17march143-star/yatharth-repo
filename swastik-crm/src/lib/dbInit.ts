/**
 * Database Initialization
 * Auto-creates all MongoDB collections and default data on first run
 * Equivalent to SQL installer - runs automatically when app starts
 */

import connectDB from './mongodb';
import bcrypt from 'bcryptjs';

// Import all models to register schemas
import '../models/Staff';
import '../models/Client';
import '../models/Contact';
import '../models/Invoice';
import '../models/Payment';
import '../models/PaymentMode';
import '../models/Expense';
import '../models/ExpenseCategory';
import '../models/Project';
import '../models/Task';
import '../models/Lead';
import '../models/LeadStatus';
import '../models/LeadSource';
import '../models/Estimate';
import '../models/Proposal';
import '../models/Contract';
import '../models/ContractType';
import '../models/Subscription';
import '../models/Ticket';
import '../models/TicketPriority';
import '../models/TicketStatus';
import '../models/TicketReply';
import '../models/KnowledgeBase';
import '../models/KnowledgeBaseGroup';
import '../models/CreditNote';
import '../models/Tax';
import '../models/Currency';
import '../models/Department';
import '../models/Role';
import '../models/Announcement';
import '../models/Notification';
import '../models/ActivityLog';
import '../models/Note';
import '../models/Reminder';
import '../models/CustomField';
import '../models/EmailTemplate';
import '../models/Settings';
import '../models/Country';
import '../models/Tag';
import '../models/Item';
import '../models/Milestone';
import '../models/ClientGroup';
import '../models/Newsfeed';
import '../models/Todo';
import '../models/Goal';

import mongoose from 'mongoose';

let isInitialized = false;

export async function initializeDatabase(): Promise<{ initialized: boolean; message: string }> {
  if (isInitialized) {
    return { initialized: true, message: 'Already initialized' };
  }

  await connectDB();

  const Settings = mongoose.model('Settings');
  const existing = await Settings.findOne({ key: 'app_initialized' });

  if (existing && existing.value === 'true') {
    isInitialized = true;
    return { initialized: true, message: 'Database already initialized' };
  }

  console.log('🚀 Initializing Swastik CRM database for first time...');

  try {
    await Promise.all([
      seedSettings(),
      seedCountries(),
      seedCurrencies(),
      seedTaxes(),
      seedPaymentModes(),
      seedTicketPriorities(),
      seedTicketStatuses(),
      seedLeadStatuses(),
      seedLeadSources(),
      seedDepartments(),
      seedRoles(),
      seedEmailTemplates(),
      seedContractTypes(),
      seedExpenseCategories(),
    ]);

    await seedAdminStaff();

    const Settings2 = mongoose.model('Settings');
    await Settings2.findOneAndUpdate(
      { key: 'app_initialized' },
      { key: 'app_initialized', value: 'true', group: 'system' },
      { upsert: true }
    );

    isInitialized = true;
    console.log('✅ Database initialization complete!');
    return { initialized: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

async function seedSettings() {
  const Settings = mongoose.model('Settings');
  const defaults = [
    { key: 'companyname', value: 'Swastik CRM', group: 'company' },
    { key: 'email', value: 'admin@swastikcrm.com', group: 'company' },
    { key: 'phone', value: '', group: 'company' },
    { key: 'country', value: '101', group: 'company' },
    { key: 'city', value: '', group: 'company' },
    { key: 'state', value: '', group: 'company' },
    { key: 'zip', value: '', group: 'company' },
    { key: 'address', value: '', group: 'company' },
    { key: 'currency', value: 'INR', group: 'company' },
    { key: 'default_language', value: 'english', group: 'company' },
    { key: 'date_format', value: 'DD/MM/YYYY', group: 'general' },
    { key: 'time_format', value: '24', group: 'general' },
    { key: 'timezone', value: 'Asia/Kolkata', group: 'general' },
    { key: 'invoice_prefix', value: 'INV', group: 'invoice' },
    { key: 'invoice_number_format', value: '1', group: 'invoice' },
    { key: 'invoice_starting_number', value: '1', group: 'invoice' },
    { key: 'invoice_due_after', value: '30', group: 'invoice' },
    { key: 'invoice_notes', value: '', group: 'invoice' },
    { key: 'estimate_prefix', value: 'EST', group: 'estimate' },
    { key: 'estimate_number_format', value: '1', group: 'estimate' },
    { key: 'estimate_starting_number', value: '1', group: 'estimate' },
    { key: 'proposal_prefix', value: 'PRO', group: 'proposal' },
    { key: 'credit_note_prefix', value: 'CN', group: 'credit_note' },
    { key: 'ticket_prefix', value: 'TKT', group: 'ticket' },
    { key: 'smtp_email', value: '', group: 'email' },
    { key: 'smtp_password', value: '', group: 'email' },
    { key: 'smtp_host', value: 'smtp.gmail.com', group: 'email' },
    { key: 'smtp_port', value: '587', group: 'email' },
    { key: 'smtp_encryption', value: 'tls', group: 'email' },
  ];

  for (const setting of defaults) {
    await Settings.findOneAndUpdate({ key: setting.key }, setting, { upsert: true });
  }
}

async function seedCountries() {
  const Country = mongoose.model('Country');
  const count = await Country.countDocuments();
  if (count > 0) return;

  const countries = [
    { countryid: 1, short_name: 'AF', name: 'Afghanistan', iso3: 'AFG', numcode: 4, phonecode: 93 },
    { countryid: 101, short_name: 'IN', name: 'India', iso3: 'IND', numcode: 356, phonecode: 91 },
    { countryid: 232, short_name: 'US', name: 'United States', iso3: 'USA', numcode: 840, phonecode: 1 },
    { countryid: 233, short_name: 'GB', name: 'United Kingdom', iso3: 'GBR', numcode: 826, phonecode: 44 },
    { countryid: 13, short_name: 'AU', name: 'Australia', iso3: 'AUS', numcode: 36, phonecode: 61 },
    { countryid: 38, short_name: 'CA', name: 'Canada', iso3: 'CAN', numcode: 124, phonecode: 1 },
    { countryid: 83, short_name: 'DE', name: 'Germany', iso3: 'DEU', numcode: 276, phonecode: 49 },
    { countryid: 75, short_name: 'FR', name: 'France', iso3: 'FRA', numcode: 250, phonecode: 33 },
    { countryid: 107, short_name: 'IT', name: 'Italy', iso3: 'ITA', numcode: 380, phonecode: 39 },
    { countryid: 110, short_name: 'JP', name: 'Japan', iso3: 'JPN', numcode: 392, phonecode: 81 },
    { countryid: 37, short_name: 'CN', name: 'China', iso3: 'CHN', numcode: 156, phonecode: 86 },
    { countryid: 176, short_name: 'RU', name: 'Russia', iso3: 'RUS', numcode: 643, phonecode: 7 },
    { countryid: 30, short_name: 'BR', name: 'Brazil', iso3: 'BRA', numcode: 76, phonecode: 55 },
    { countryid: 202, short_name: 'ZA', name: 'South Africa', iso3: 'ZAF', numcode: 710, phonecode: 27 },
    { countryid: 147, short_name: 'MX', name: 'Mexico', iso3: 'MEX', numcode: 484, phonecode: 52 },
  ];
  await Country.insertMany(countries);
}

async function seedCurrencies() {
  const Currency = mongoose.model('Currency');
  const count = await Currency.countDocuments();
  if (count > 0) return;

  const currencies = [
    { symbol: '₹', name: 'Indian Rupee', decimal_separator: '.', thousand_separator: ',', placement: 'before', isdefault: 1, currencycode: 'INR' },
    { symbol: '$', name: 'US Dollar', decimal_separator: '.', thousand_separator: ',', placement: 'before', isdefault: 0, currencycode: 'USD' },
    { symbol: '€', name: 'Euro', decimal_separator: ',', thousand_separator: '.', placement: 'before', isdefault: 0, currencycode: 'EUR' },
    { symbol: '£', name: 'British Pound', decimal_separator: '.', thousand_separator: ',', placement: 'before', isdefault: 0, currencycode: 'GBP' },
    { symbol: '¥', name: 'Japanese Yen', decimal_separator: '.', thousand_separator: ',', placement: 'before', isdefault: 0, currencycode: 'JPY' },
    { symbol: 'A$', name: 'Australian Dollar', decimal_separator: '.', thousand_separator: ',', placement: 'before', isdefault: 0, currencycode: 'AUD' },
    { symbol: 'C$', name: 'Canadian Dollar', decimal_separator: '.', thousand_separator: ',', placement: 'before', isdefault: 0, currencycode: 'CAD' },
    { symbol: 'Fr', name: 'Swiss Franc', decimal_separator: '.', thousand_separator: ',', placement: 'before', isdefault: 0, currencycode: 'CHF' },
    { symbol: 'د.إ', name: 'UAE Dirham', decimal_separator: '.', thousand_separator: ',', placement: 'before', isdefault: 0, currencycode: 'AED' },
    { symbol: 'S$', name: 'Singapore Dollar', decimal_separator: '.', thousand_separator: ',', placement: 'before', isdefault: 0, currencycode: 'SGD' },
  ];
  await Currency.insertMany(currencies);
}

async function seedTaxes() {
  const Tax = mongoose.model('Tax');
  const count = await Tax.countDocuments();
  if (count > 0) return;

  await Tax.insertMany([
    { name: 'GST 5%', taxrate: 5 },
    { name: 'GST 12%', taxrate: 12 },
    { name: 'GST 18%', taxrate: 18 },
    { name: 'GST 28%', taxrate: 28 },
    { name: 'VAT 5%', taxrate: 5 },
    { name: 'VAT 10%', taxrate: 10 },
    { name: 'VAT 20%', taxrate: 20 },
    { name: 'No Tax', taxrate: 0 },
  ]);
}

async function seedPaymentModes() {
  const PaymentMode = mongoose.model('PaymentMode');
  const count = await PaymentMode.countDocuments();
  if (count > 0) return;

  await PaymentMode.insertMany([
    { name: 'Bank Transfer', description: 'Direct bank transfer', active: true, invoices: true, expenses: true },
    { name: 'Cash', description: 'Cash payment', active: true, invoices: true, expenses: true },
    { name: 'Cheque', description: 'Cheque payment', active: true, invoices: true, expenses: true },
    { name: 'UPI', description: 'UPI payment', active: true, invoices: true, expenses: true },
    { name: 'Credit Card', description: 'Credit card payment', active: true, invoices: true, expenses: true },
    { name: 'Debit Card', description: 'Debit card payment', active: true, invoices: true, expenses: true },
    { name: 'Stripe', description: 'Online payment via Stripe', active: false, invoices: true, expenses: false },
    { name: 'PayPal', description: 'Online payment via PayPal', active: false, invoices: true, expenses: false },
  ]);
}

async function seedTicketPriorities() {
  const TicketPriority = mongoose.model('TicketPriority');
  const count = await TicketPriority.countDocuments();
  if (count > 0) return;

  await TicketPriority.insertMany([
    { name: 'Low', color: '#28a745' },
    { name: 'Medium', color: '#ffc107' },
    { name: 'High', color: '#dc3545' },
    { name: 'Urgent', color: '#721c24' },
  ]);
}

async function seedTicketStatuses() {
  const TicketStatus = mongoose.model('TicketStatus');
  const count = await TicketStatus.countDocuments();
  if (count > 0) return;

  await TicketStatus.insertMany([
    { name: 'Open', color: '#007bff', isdefault: 1, order: 1 },
    { name: 'In Progress', color: '#17a2b8', isdefault: 0, order: 2 },
    { name: 'Answered', color: '#28a745', isdefault: 0, order: 3 },
    { name: 'On Hold', color: '#ffc107', isdefault: 0, order: 4 },
    { name: 'Closed', color: '#6c757d', isdefault: 0, order: 5 },
  ]);
}

async function seedLeadStatuses() {
  const LeadStatus = mongoose.model('LeadStatus');
  const count = await LeadStatus.countDocuments();
  if (count > 0) return;

  await LeadStatus.insertMany([
    { name: 'New', color: '#0087B0', order: 1 },
    { name: 'Contacted', color: '#4da1f5', order: 2 },
    { name: 'In Progress', color: '#f5a623', order: 3 },
    { name: 'Lost', color: '#d9534f', order: 4 },
    { name: 'Converted', color: '#5cb85c', order: 5 },
  ]);
}

async function seedLeadSources() {
  const LeadSource = mongoose.model('LeadSource');
  const count = await LeadSource.countDocuments();
  if (count > 0) return;

  await LeadSource.insertMany([
    { name: 'Cold Call' },
    { name: 'Existing Customer' },
    { name: 'Self Generated' },
    { name: 'Employee' },
    { name: 'Partner' },
    { name: 'Public Relations' },
    { name: 'Direct Mail' },
    { name: 'Conference' },
    { name: 'Trade Show' },
    { name: 'Website' },
    { name: 'Word of Mouth' },
    { name: 'Email' },
    { name: 'Social Media' },
    { name: 'Other' },
  ]);
}

async function seedDepartments() {
  const Department = mongoose.model('Department');
  const count = await Department.countDocuments();
  if (count > 0) return;

  await Department.insertMany([
    { name: 'Management', color: '#007bff' },
    { name: 'Development', color: '#28a745' },
    { name: 'Sales', color: '#ffc107' },
    { name: 'Support', color: '#17a2b8' },
    { name: 'Marketing', color: '#e83e8c' },
    { name: 'Finance', color: '#6f42c1' },
    { name: 'HR', color: '#fd7e14' },
  ]);
}

async function seedRoles() {
  const Role = mongoose.model('Role');
  const count = await Role.countDocuments();
  if (count > 0) return;

  await Role.insertMany([
    {
      name: 'Administrator',
      permissions: {},
      isdefault: 1
    },
    {
      name: 'Sales Manager',
      permissions: { leads: true, clients: true, invoices: true, estimates: true, proposals: true },
      isdefault: 0
    },
    {
      name: 'Project Manager',
      permissions: { projects: true, tasks: true, clients: true },
      isdefault: 0
    },
    {
      name: 'Support Staff',
      permissions: { tickets: true, clients: true },
      isdefault: 0
    },
  ]);
}

async function seedEmailTemplates() {
  const EmailTemplate = mongoose.model('EmailTemplate');
  const count = await EmailTemplate.countDocuments();
  if (count > 0) return;

  await EmailTemplate.insertMany([
    {
      slug: 'invoice-send-to-client',
      subject: 'Invoice {invoice_number} from {company_name}',
      message: '<p>Dear {client_name},</p><p>Please find attached invoice {invoice_number} for {invoice_amount}.</p><p>Due Date: {invoice_due_date}</p><p>Thank you for your business.</p><p>Regards,<br>{company_name}</p>',
      type: 'invoice',
      active: true,
    },
    {
      slug: 'estimate-send-to-client',
      subject: 'Estimate {estimate_number} from {company_name}',
      message: '<p>Dear {client_name},</p><p>Please find attached estimate {estimate_number}.</p><p>Valid Until: {estimate_expiry_date}</p><p>Thank you.</p><p>Regards,<br>{company_name}</p>',
      type: 'estimate',
      active: true,
    },
    {
      slug: 'proposal-send-to-client',
      subject: 'Proposal {proposal_subject} from {company_name}',
      message: '<p>Dear {client_name},</p><p>We are pleased to submit our proposal for your review.</p><p>Please click the link below to view the proposal.</p><p>Regards,<br>{company_name}</p>',
      type: 'proposal',
      active: true,
    },
    {
      slug: 'ticket-created-to-client',
      subject: 'Support Ticket #{ticket_id} - {ticket_subject}',
      message: '<p>Dear {client_name},</p><p>Your support ticket has been created successfully.</p><p>Ticket ID: #{ticket_id}</p><p>Subject: {ticket_subject}</p><p>We will get back to you shortly.</p><p>Regards,<br>{company_name}</p>',
      type: 'ticket',
      active: true,
    },
    {
      slug: 'new-account-registered',
      subject: 'Welcome to {company_name} Client Portal',
      message: '<p>Dear {client_name},</p><p>Your account has been created successfully.</p><p>Email: {client_email}</p><p>Password: {client_password}</p><p>Please login at: {client_portal_url}</p><p>Regards,<br>{company_name}</p>',
      type: 'account',
      active: true,
    },
    {
      slug: 'contract-send-to-client',
      subject: 'Contract: {contract_subject}',
      message: '<p>Dear {client_name},</p><p>Please find the contract for your review and signature.</p><p>Contract: {contract_subject}</p><p>Valid Until: {contract_dateend}</p><p>Regards,<br>{company_name}</p>',
      type: 'contract',
      active: true,
    },
    {
      slug: 'payment-recorded',
      subject: 'Payment Confirmation - Invoice #{invoice_number}',
      message: '<p>Dear {client_name},</p><p>We have received your payment of {payment_amount} for Invoice #{invoice_number}.</p><p>Thank you for your payment.</p><p>Regards,<br>{company_name}</p>',
      type: 'payment',
      active: true,
    },
  ]);
}

async function seedContractTypes() {
  const ContractType = mongoose.model('ContractType');
  const count = await ContractType.countDocuments();
  if (count > 0) return;

  await ContractType.insertMany([
    { name: 'Fixed Price' },
    { name: 'Time & Material' },
    { name: 'Retainer' },
    { name: 'Service Agreement' },
    { name: 'Non-Disclosure Agreement' },
    { name: 'Partnership Agreement' },
  ]);
}

async function seedExpenseCategories() {
  const ExpenseCategory = mongoose.model('ExpenseCategory');
  const count = await ExpenseCategory.countDocuments();
  if (count > 0) return;

  await ExpenseCategory.insertMany([
    { name: 'Office Supplies' },
    { name: 'Travel' },
    { name: 'Software & Tools' },
    { name: 'Marketing' },
    { name: 'Utilities' },
    { name: 'Salaries' },
    { name: 'Equipment' },
    { name: 'Rent' },
    { name: 'Insurance' },
    { name: 'Professional Services' },
    { name: 'Miscellaneous' },
  ]);
}

async function seedAdminStaff() {
  const Staff = mongoose.model('Staff');
  const existing = await Staff.findOne({ email: process.env.ADMIN_EMAIL || 'admin@swastikcrm.com' });
  if (existing) return;

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);

  await Staff.create({
    firstname: 'Super',
    lastname: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@swastikcrm.com',
    password: hashedPassword,
    admin: 1,
    role: null,
    active: 1,
    isadmin: 1,
    default_language: 'english',
    datejoined: new Date(),
    profile_image: null,
    phonenumber: '',
    facebook: '',
    linkedin: '',
    skype: '',
    directions: null,
    email_signature: '',
    two_factor_auth_enabled: 0,
    hourly_rate: 0,
    is_not_staff: 0,
    last_activity: new Date(),
    last_ip: '127.0.0.1',
    last_login: null,
    last_password_change: null,
    new_pass_key: null,
    new_pass_key_requested: null,
  });

  console.log(`✅ Admin user created: ${process.env.ADMIN_EMAIL || 'admin@swastikcrm.com'}`);
}
