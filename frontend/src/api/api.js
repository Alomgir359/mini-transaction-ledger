import axios from 'axios'

// In Docker, VITE_API_BASE_URL is baked in at build time (see Dockerfile).
// For local dev without Docker, it falls back to localhost:8080.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ---- Accounts ----

export const getAccounts = () => api.get('/accounts')

export const getAccount = (accountId) => api.get(`/accounts/${accountId}`)

export const createAccount = (payload) => api.post('/accounts', payload)

// ---- Transactions (ledger entries) ----

export const getLedger = (accountId) => api.get(`/accounts/${accountId}/transactions`)

export const postTransaction = (accountId, payload) =>
  api.post(`/accounts/${accountId}/transactions`, payload)

export default api
