const TYPE_LABELS = {
  SAVINGS: 'Savings',
  CURRENT: 'Current',
  BUSINESS: 'Business',
}

function NewAccountButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white text-xs font-semibold rounded-lg pl-2.5 pr-3 py-2 transition-colors shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      New Account
    </button>
  )
}

export default function AccountList({ accounts, selectedAccountId, onSelect, onCreateClick }) {
  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-brand-ink">Accounts</h2>
          <NewAccountButton onClick={onCreateClick} />
        </div>
        <p className="text-sm text-slate-500">No accounts yet. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-brand-ink">Accounts</h2>
        <NewAccountButton onClick={onCreateClick} />
      </div>
      <ul className="flex flex-col gap-2">
        {accounts.map((account) => {
          const isSelected = account.id === selectedAccountId
          return (
            <li key={account.id}>
              <button
                onClick={() => onSelect(account.id)}
                className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                  isSelected
                    ? 'border-brand bg-red-50/60 ring-1 ring-brand/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {account.accountHolderName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-brand">A/C</span>{' '}
                      <span className="tracking-wide">{account.accountNumber}</span>
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-600">
                      {TYPE_LABELS[account.accountType] || account.accountType}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-semibold whitespace-nowrap ${
                      account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    ৳{Number(account.balance).toFixed(2)}
                  </p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
