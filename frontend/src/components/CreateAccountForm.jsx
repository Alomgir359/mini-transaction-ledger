import { useEffect, useState } from 'react'
import { createAccount } from '../api/api'

const ACCOUNT_TYPES = [
  { value: 'SAVINGS', label: 'Savings Account' },
  { value: 'CURRENT', label: 'Current Account' },
  { value: 'BUSINESS', label: 'Business Account' },
]

const RELATIONS = [
  'Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Brother', 'Sister', 'Other',
]

const initialForm = {
  accountHolderName: '',
  accountType: 'SAVINGS',
  nid: '',
  fatherName: '',
  motherName: '',
  nomineeName: '',
  nomineeNid: '',
  nomineeRelation: 'Father',
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-shadow'

function SelectField({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputClass} appearance-none bg-white pr-9`}
      >
        {options.map((o) =>
          typeof o === 'string' ? (
            <option key={o} value={o}>{o}</option>
          ) : (
            <option key={o.value} value={o.value}>{o.label}</option>
          )
        )}
      </select>
      <svg
        className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

function SectionHeading({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-brand-ink leading-tight">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 leading-tight">{subtitle}</p>}
      </div>
    </div>
  )
}

const icons = {
  account: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h18M3 7.5v9a2 2 0 002 2h14a2 2 0 002-2v-9M3 7.5l2.5-4h13l2.5 4M9 14h6" />
    </svg>
  ),
  kyc: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a3 3 0 100-6 3 3 0 000 6zM4.5 20.25a4.5 4.5 0 019 0M15 12.75h5.25M15 15.75h3.5" />
    </svg>
  ),
  nominee: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75a4.5 4.5 0 00-9 0M12 11.25a3 3 0 100-6 3 3 0 000 6zM19.5 8.25v3m1.5-1.5h-3" />
    </svg>
  ),
}

export default function CreateAccountForm({ isOpen, onClose, onAccountCreated, onError }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Reset the form state whenever the modal is (re)opened
  useEffect(() => {
    if (isOpen) {
      setForm(initialForm)
      setError('')
      setSubmitting(false)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose && onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    if (!form.accountHolderName.trim()) return 'Account holder name is required.'
    if (!/^\d{10}$|^\d{13}$|^\d{17}$/.test(form.nid.trim()))
      return 'NID must be a valid 10, 13, or 17 digit number.'
    if (!form.fatherName.trim()) return "Father's name is required."
    if (!form.motherName.trim()) return "Mother's name is required."
    if (!form.nomineeName.trim()) return 'Nominee name is required.'
    if (!/^\d{10}$|^\d{13}$|^\d{17}$/.test(form.nomineeNid.trim()))
      return "Nominee NID must be a valid 10, 13, or 17 digit number."
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    setError('')
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setSubmitting(true)
      const response = await createAccount(form)
      onAccountCreated(response.data)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create account.'
      setError(msg)
      onError && onError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !submitting) onClose && onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/60 backdrop-blur-[2px] px-4 py-6 overflow-y-auto"
      onMouseDown={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-[fadeIn_0.15s_ease-out]">
        {/* Modal header */}
        <div className="relative bg-red-900 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-200/80">
                Millennium Information Solution Ltd.
              </p>
              <h2 className="text-lg font-bold text-white mt-0.5">Open a New Account</h2>
              <p className="text-xs text-red-100/80 mt-1">
                Provide holder, KYC and nominee details to generate an account instantly.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red to-brand-orange" />
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto">
          <div className="px-6 py-5 flex flex-col gap-6">

            {/* Account basics */}
            <section className="flex flex-col gap-3.5">
              <SectionHeading
                icon={icons.account}
                title="Account Details"
                subtitle="Basic information used to open the account"
              />
              <div className="pl-10.5 flex flex-col gap-3.5 sm:pl-[42px]">
                <Field label="Account Holder Name">
                  <input
                    type="text"
                    value={form.accountHolderName}
                    onChange={update('accountHolderName')}
                    placeholder="e.g. Md. Alomgir"
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field label="Account Type">
                    <SelectField
                      value={form.accountType}
                      onChange={update('accountType')}
                      options={ACCOUNT_TYPES}
                    />
                  </Field>
                  <Field
                    label="National ID (NID) Number"
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.nid}
                      onChange={update('nid')}
                      placeholder="10 / 13 / 17 digit NID"
                      className={inputClass}
                    />
                  </Field>
                </div>
                <p className="text-xs text-slate-400 -mt-1.5">
                  A unique account number will be generated automatically upon submission.
                </p>
              </div>
            </section>

            {/* KYC / family info */}
            <section className="flex flex-col gap-3.5 pt-5 border-t border-slate-100">
              <SectionHeading
                icon={icons.kyc}
                title="KYC &amp; Family Information"
                subtitle="Required for identity verification and compliance"
              />
              <div className="pl-10.5 sm:pl-[42px] grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field label="Father's Name">
                  <input
                    type="text"
                    value={form.fatherName}
                    onChange={update('fatherName')}
                    placeholder="Father's full name"
                    className={inputClass}
                  />
                </Field>
                <Field label="Mother's Name">
                  <input
                    type="text"
                    value={form.motherName}
                    onChange={update('motherName')}
                    placeholder="Mother's full name"
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* Nominee info */}
            <section className="flex flex-col gap-3.5 pt-5 border-t border-slate-100">
              <SectionHeading
                icon={icons.nominee}
                title="Nominee Details"
                subtitle="Person entitled to the account in case of emergency"
              />
              <div className="pl-10.5 sm:pl-[42px] flex flex-col gap-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field label="Nominee Name">
                    <input
                      type="text"
                      value={form.nomineeName}
                      onChange={update('nomineeName')}
                      placeholder="Nominee's full name"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Relation with Nominee">
                    <SelectField
                      value={form.nomineeRelation}
                      onChange={update('nomineeRelation')}
                      options={RELATIONS}
                    />
                  </Field>
                </div>
                <Field label="Nominee NID Number">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.nomineeNid}
                    onChange={update('nomineeNid')}
                    placeholder="10 / 13 / 17 digit NID"
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3.5 py-2.5">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Modal footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-colors disabled:opacity-60 shadow-sm"
            >
              {submitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
