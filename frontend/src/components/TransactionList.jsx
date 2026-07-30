export default function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-sm text-slate-500">
        No entries recorded yet for this account.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-lg font-semibold text-brand-ink mb-4">Ledger History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Date</th>
              <th className="py-2 pr-3">Type</th>
              <th className="py-2 pr-3">Description</th>
              <th className="py-2 pr-3 text-right">Amount</th>
              <th className="py-2 text-right">Balance After</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-3 text-slate-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
                <td className="py-2 pr-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      tx.type === 'CREDIT'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-brand'
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="py-2 pr-3 text-slate-700">{tx.description || '—'}</td>
                <td
                  className={`py-2 pr-3 text-right font-medium ${
                    tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-brand'
                  }`}
                >
                  {tx.type === 'CREDIT' ? '+' : '-'}৳{Number(tx.amount).toFixed(2)}
                </td>
                <td className="py-2 text-right font-semibold text-brand-ink">
                  ৳{Number(tx.balanceAfter).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
