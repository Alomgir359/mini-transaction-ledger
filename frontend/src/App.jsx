import { useEffect, useState, useCallback } from 'react'
import { getAccounts, getLedger } from './api/api'
import AccountList from './components/AccountList'
import CreateAccountForm from './components/CreateAccountForm'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import AccountDetails from './components/AccountDetails'
import Toast from './components/Toast'

function App() {
  const [accounts, setAccounts] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [toast, setToast] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const showToast = (t) => setToast({ ...t, key: Date.now() })

  const loadAccounts = useCallback(async () => {
    try {
      const response = await getAccounts()
      setAccounts(response.data)
      return response.data
    } catch (err) {
      setFetchError('Could not reach the backend API. Is it running?')
      return []
    }
  }, [])

  const loadLedger = useCallback(async (accountId) => {
    if (!accountId) {
      setTransactions([])
      return
    }
    try {
      const response = await getLedger(accountId)
      setTransactions(response.data)
    } catch (err) {
      setFetchError('Failed to load ledger for the selected account.')
    }
  }, [])

  // Initial load
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const data = await loadAccounts()
      if (data.length > 0) {
        setSelectedAccountId(data[0].id)
      }
      setLoading(false)
    })()
  }, [loadAccounts])

  // Reload ledger whenever the selected account changes
  useEffect(() => {
    loadLedger(selectedAccountId)
  }, [selectedAccountId, loadLedger])

  const refreshAccountsAndLedger = async () => {
    const data = await loadAccounts()
    await loadLedger(selectedAccountId)
    return data
  }

  const handleAccountCreated = async (newAccount) => {
    await loadAccounts()
    setSelectedAccountId(newAccount.id)
    setShowCreateModal(false)
    showToast({
      type: 'success',
      title: 'Account created successfully',
      message: `A/C ${newAccount.accountNumber} is ready to use.`,
    })
  }

  const handleTransactionPosted = async ({ type, amount }) => {
    await refreshAccountsAndLedger()
    showToast({
      type: 'success',
      title: type === 'CREDIT' ? 'Credit posted successfully' : 'Debit posted successfully',
      message: `৳${Number(amount).toFixed(2)} has been recorded to the ledger.`,
    })
  }

  const handleError = (message) => {
    showToast({ type: 'error', title: 'Something went wrong', message })
  }

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId)

  return (
    <div className="min-h-screen bg-slate-100">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <CreateAccountForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAccountCreated={handleAccountCreated}
        onError={handleError}
      />

      <header className="bg-red-900">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-black text-3xl italic">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Mini Transaction Ledger
            </h1>
            <p className="text-slate-300 text-sm mt-0.5">
              Millennium Information Solution Ltd. &middot; Create accounts, record entries, track balances.
            </p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-brand-red to-brand-orange" />
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {fetchError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-brand text-sm rounded-lg px-4 py-3">
            {fetchError}
          </div>
        )}

        {loading ? (
          <p className="text-slate-500 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: accounts */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <AccountList
                accounts={accounts}
                selectedAccountId={selectedAccountId}
                onSelect={setSelectedAccountId}
                onCreateClick={() => setShowCreateModal(true)}
              />
            </div>

            {/* Right column: selected account detail + ledger */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {selectedAccount ? (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-red to-brand-orange" />
                    <div className="flex justify-between items-center pl-2">
                      <div>
                        <p className="text-sm text-slate-500">Selected Account</p>
                        <h2 className="text-lg font-semibold text-brand-ink">
                          {selectedAccount.accountHolderName}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-semibold text-brand">A/C</span>{' '}
                          {selectedAccount.accountNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Current Balance</p>
                        <p className="text-2xl font-bold text-brand">
                          ৳{Number(selectedAccount.balance).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <TransactionForm
                    accountId={selectedAccount.id}
                    onTransactionPosted={handleTransactionPosted}
                    onError={handleError}
                  />

                  <AccountDetails account={selectedAccount} />

                  <TransactionList transactions={transactions} />
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-sm text-slate-500">
                  Select or create an account to view its ledger.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
