'use client';

import { useState, useEffect } from 'react';
import { Save, Building2, Mail, DollarSign, Settings2 } from 'lucide-react';

interface SettingsMap { [key: string]: string; }

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [activeTab, setActiveTab] = useState('company');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.data || {}));
  }, []);

  const set = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { key: 'company', label: 'Company', icon: Building2 },
    { key: 'finance', label: 'Finance', icon: DollarSign },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'system', label: 'System', icon: Settings2 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your CRM preferences</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-52 shrink-0 space-y-1">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === t.key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Form Panel */}
        <div className="flex-1 card">
          <div className="card-body space-y-6">

            {/* COMPANY */}
            {activeTab === 'company' && (
              <>
                <h3 className="font-semibold text-gray-800 border-b pb-3">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="form-label">Company Name</label>
                    <input className="form-input" value={settings.companyname || ''} onChange={e => set('companyname', e.target.value)} placeholder="Swastik Industries" />
                  </div>
                  <div>
                    <label className="form-label">Company Email</label>
                    <input type="email" className="form-input" value={settings.email || ''} onChange={e => set('email', e.target.value)} placeholder="info@company.com" />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" value={settings.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="form-label">Website</label>
                    <input className="form-input" value={settings.website || ''} onChange={e => set('website', e.target.value)} placeholder="https://www.company.com" />
                  </div>
                  <div>
                    <label className="form-label">VAT / Tax Number</label>
                    <input className="form-input" value={settings.vat_number || ''} onChange={e => set('vat_number', e.target.value)} placeholder="GSTIN / VAT No." />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Address</label>
                    <textarea className="form-input resize-none h-20" value={settings.address || ''} onChange={e => set('address', e.target.value)} placeholder="Street address" />
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    <input className="form-input" value={settings.city || ''} onChange={e => set('city', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">State / Province</label>
                    <input className="form-input" value={settings.state || ''} onChange={e => set('state', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">ZIP / Postal Code</label>
                    <input className="form-input" value={settings.zip || ''} onChange={e => set('zip', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Country</label>
                    <select className="form-select" value={settings.country || 'India'} onChange={e => set('country', e.target.value)}>
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Canada</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Singapore</option>
                      <option>UAE</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* FINANCE */}
            {activeTab === 'finance' && (
              <>
                <h3 className="font-semibold text-gray-800 border-b pb-3">Finance Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Default Currency</label>
                    <select className="form-select" value={settings.currency || 'INR'} onChange={e => set('currency', e.target.value)}>
                      <option value="INR">INR - Indian Rupee (₹)</option>
                      <option value="USD">USD - US Dollar ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                      <option value="AUD">AUD - Australian Dollar (A$)</option>
                      <option value="CAD">CAD - Canadian Dollar (C$)</option>
                      <option value="SGD">SGD - Singapore Dollar (S$)</option>
                      <option value="AED">AED - UAE Dirham (د.إ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Default Tax Rate (%)</label>
                    <input type="number" min="0" max="100" step="0.01" className="form-input" value={settings.tax_rate || ''} onChange={e => set('tax_rate', e.target.value)} placeholder="18" />
                  </div>
                  <div>
                    <label className="form-label">Invoice Prefix</label>
                    <input className="form-input" value={settings.invoice_prefix || 'INV'} onChange={e => set('invoice_prefix', e.target.value)} placeholder="INV" />
                  </div>
                  <div>
                    <label className="form-label">Invoice Starting Number</label>
                    <input type="number" min="1" className="form-input" value={settings.invoice_starting_number || '1'} onChange={e => set('invoice_starting_number', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Estimate Prefix</label>
                    <input className="form-input" value={settings.estimate_prefix || 'EST'} onChange={e => set('estimate_prefix', e.target.value)} placeholder="EST" />
                  </div>
                  <div>
                    <label className="form-label">Invoice Due After (days)</label>
                    <input type="number" min="0" className="form-input" value={settings.invoice_due_after || '30'} onChange={e => set('invoice_due_after', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Default Invoice Notes</label>
                    <textarea className="form-input resize-none h-20" value={settings.invoice_notes || ''} onChange={e => set('invoice_notes', e.target.value)} placeholder="Thank you for your business." />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Default Invoice Terms</label>
                    <textarea className="form-input resize-none h-20" value={settings.invoice_terms || ''} onChange={e => set('invoice_terms', e.target.value)} placeholder="Payment is due within 30 days." />
                  </div>
                </div>
              </>
            )}

            {/* EMAIL */}
            {activeTab === 'email' && (
              <>
                <h3 className="font-semibold text-gray-800 border-b pb-3">Email / SMTP Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">SMTP Host</label>
                    <input className="form-input" value={settings.smtp_host || ''} onChange={e => set('smtp_host', e.target.value)} placeholder="smtp.gmail.com" />
                  </div>
                  <div>
                    <label className="form-label">SMTP Port</label>
                    <input type="number" className="form-input" value={settings.smtp_port || ''} onChange={e => set('smtp_port', e.target.value)} placeholder="587" />
                  </div>
                  <div>
                    <label className="form-label">SMTP Username</label>
                    <input className="form-input" value={settings.smtp_username || ''} onChange={e => set('smtp_username', e.target.value)} placeholder="user@gmail.com" />
                  </div>
                  <div>
                    <label className="form-label">SMTP Password</label>
                    <input type="password" className="form-input" value={settings.smtp_password || ''} onChange={e => set('smtp_password', e.target.value)} placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="form-label">From Email</label>
                    <input type="email" className="form-input" value={settings.from_email || ''} onChange={e => set('from_email', e.target.value)} placeholder="noreply@company.com" />
                  </div>
                  <div>
                    <label className="form-label">From Name</label>
                    <input className="form-input" value={settings.from_name || ''} onChange={e => set('from_name', e.target.value)} placeholder="Swastik CRM" />
                  </div>
                  <div>
                    <label className="form-label">Encryption</label>
                    <select className="form-select" value={settings.smtp_encryption || 'tls'} onChange={e => set('smtp_encryption', e.target.value)}>
                      <option value="tls">TLS (STARTTLS)</option>
                      <option value="ssl">SSL</option>
                      <option value="">None</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* SYSTEM */}
            {activeTab === 'system' && (
              <>
                <h3 className="font-semibold text-gray-800 border-b pb-3">System Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="form-label">Application Name</label>
                    <input className="form-input" value={settings.app_name || ''} onChange={e => set('app_name', e.target.value)} placeholder="Swastik CRM" />
                  </div>
                  <div>
                    <label className="form-label">Date Format</label>
                    <select className="form-select" value={settings.date_format || 'DD/MM/YYYY'} onChange={e => set('date_format', e.target.value)}>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="D MMM YYYY">D MMM YYYY</option>
                      <option value="MMM D, YYYY">MMM D, YYYY</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Time Format</label>
                    <select className="form-select" value={settings.time_format || '24'} onChange={e => set('time_format', e.target.value)}>
                      <option value="24">24-hour (14:30)</option>
                      <option value="12">12-hour (2:30 PM)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Timezone</label>
                    <select className="form-select" value={settings.timezone || 'Asia/Kolkata'} onChange={e => set('timezone', e.target.value)}>
                      <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST/EDT)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                      <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                      <option value="Europe/London">Europe/London (GMT/BST)</option>
                      <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT, UTC+8)</option>
                      <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
