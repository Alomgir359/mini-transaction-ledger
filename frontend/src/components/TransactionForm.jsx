import { useState } from 'react'
import { postTransaction } from '../api/api'

export default function TransactionForm({ accountId, onTransactionPosted, onError }) {
  const [type, setType] = useState('CREDIT')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const numericAmount = parseFloat(amount)
    if (!numericAmount || numericAmount <= 0) {
      setError('Enter a valid amount greater than 0.')
      return
    }

    try {
      setSubmitting(true)
      const postedType = type
      const postedAmount = numericAmount
      await postTransaction(accountId, {
        type,
        amount: numericAmount,
        description,
      })
      setAmount('')
      setDescription('')
      onTransactionPosted({ type: postedType, amount: postedAmount })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to record transaction.'
      setError(msg)
      onError && onError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-lg font-semibold text-brand-ink mb-4">Record Entry</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('CREDIT')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold border transition-colors ${
              type === 'CREDIT'
                ? 'bg-brand text-white border-brand'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Credit (+)
          </button>
          <button
            type="button"
            onClick={() => setType('DEBIT')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold border transition-colors ${
              type === 'DEBIT'
                ? 'bg-brand text-white border-brand'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Debit (-)
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Salary, Grocery, Rent"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg py-2.5 transition-colors shadow-sm disabled:opacity-60"
        >
          {submitting ? 'Posting...' : 'Post Entry'}
        </button>
      </form>
    </div>
  )
}
