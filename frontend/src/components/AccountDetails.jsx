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

function Row({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm text-slate-700 font-medium">{value || '—'}</p>
    </div>
  )
}

export default function AccountDetails({ account }) {
  const [open, setOpen] = useState(false)
  const [reveal, setReveal] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-brand-ink">KYC & Nominee Details</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-600">
            {TYPE_LABELS[account.accountType] || account.accountType}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Account Holder
            </p>
            <button
              onClick={() => setReveal((r) => !r)}
              className="text-xs font-medium text-brand hover:text-brand-dark"
            >
              {reveal ? 'Hide NID' : 'Show full NID'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Row label="Account Holder Name" value={account.accountHolderName} />
            <Row label="NID Number" value={reveal ? account.nid : maskNid(account.nid)} />
            <Row label="Father's Name" value={account.fatherName} />
            <Row label="Mother's Name" value={account.motherName} />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3 pt-3 border-t border-slate-100">
            Nominee
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Row label="Nominee Name" value={account.nomineeName} />
            <Row label="Relation" value={account.nomineeRelation} />
            <Row label="Nominee NID Number" value={reveal ? account.nomineeNid : maskNid(account.nomineeNid)} />
          </div>
        </div>
      )}
    </div>
  )
}
