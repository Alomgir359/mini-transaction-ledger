

import { useState } from 'react'

const TYPE_LABELS = {
  SAVINGS: 'Savings',
  CURRENT: 'Current',
  BUSINESS: 'Business',
}

// Masks all but the last 4 digits, e.g. 1234567890 -> ••••••7890
function maskNid(nid) {
  if (!nid) return '—'
  if (nid.length <= 4) return nid
  return '•'.repeat(nid.length - 4) + nid.slice(-4)
}

function Row({ label, value, mono }) {
  return (
    <div className="bg-slate-50/80 border border-slate-100 rounded-lg px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`text-sm text-slate-700 font-semibold mt-0.5 ${mono ? 'tabular-nums tracking-wide' : ''}`}>
        {value || '—'}
      </p>
    </div>
  )
}

function SectionLabel({ icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
    </div>
  )
}

const icons = {
  kyc: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a3 3 0 100-6 3 3 0 000 6zM4.5 20.25a4.5 4.5 0 019 0M15 12.75h5.25M15 15.75h3.5" />
    </svg>
  ),
  nominee: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75a4.5 4.5 0 00-9 0M12 11.25a3 3 0 100-6 3 3 0 000 6zM19.5 8.25v3m1.5-1.5h-3" />
    </svg>
  ),
}

function EyeIcon({ open }) {
  return open ? (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function AccountDetails({ account }) {
  const [open, setOpen] = useState(false)
  const [reveal, setReveal] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left px-5 py-4 hover:bg-slate-50/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-brand-ink leading-tight">KYC &amp; Nominee Details</h2>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Identity and beneficiary information on file</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-600 ml-1">
            {TYPE_LABELS[account.accountType] || account.accountType}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1 border-t border-slate-100 flex flex-col gap-5">

            {/* Account holder / KYC */}
            <div className="flex flex-col gap-2.5 pt-4">
              <div className="flex items-center justify-between">
                <SectionLabel icon={icons.kyc} title="Account Holder" />
                <button
                  onClick={() => setReveal((r) => !r)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand hover:text-brand-dark bg-brand/5 hover:bg-brand/10 rounded-full px-2.5 py-1 transition-colors"
                >
                  <EyeIcon open={reveal} />
                  {reveal ? 'Hide NID' : 'Show full NID'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Row label="Account Holder Name" value={account.accountHolderName} />
                <Row label="NID Number" value={reveal ? account.nid : maskNid(account.nid)} mono />
                <Row label="Father's Name" value={account.fatherName} />
                <Row label="Mother's Name" value={account.motherName} />
              </div>
            </div>

            {/* Nominee */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
              <SectionLabel icon={icons.nominee} title="Nominee" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Row label="Nominee Name" value={account.nomineeName} />
                <Row label="Relation" value={account.nomineeRelation} />
                <Row
                  label="Nominee NID Number"
                  value={reveal ? account.nomineeNid : maskNid(account.nomineeNid)}
                  mono
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}