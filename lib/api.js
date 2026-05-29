// lib/api.js
// ============================================================
// كل طلبات HTTP للسيرفر في مكان واحد
// تُستخدم مع useQuery و useMutation من TanStack Query
// ============================================================
import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── قائمة الطعام ────────────────────────────────────────────
export const getMenu = async () => {
  const { data } = await http.get('/menu')
  return data
}

// ── الطلبات ─────────────────────────────────────────────────
export const createOrder = async (orderData) => {
  const { data } = await http.post('/orders', orderData)
  return data
}

export const getTableOrders = async (tableNumber) => {
  const { data } = await http.get(`/orders?table=${tableNumber}`)
  return data
}

// ── النداءات ─────────────────────────────────────────────────
export const sendCall = async (callData) => {
  const { data } = await http.post('/calls', callData)
  return data
}

export const getPendingCalls = async () => {
  const { data } = await http.get('/calls?status=pending')
  return data
}

export const updateCall = async ({ callId, status }) => {
  const { data } = await http.patch(`/calls/${callId}`, { status })
  return data
}

// ── الفواتير ─────────────────────────────────────────────────
export const getTableBill = async (tableNumber) => {
  const { data } = await http.get(`/bills?table=${tableNumber}`)
  return data
}

export const payBill = async (billId, paymentMethod) => {
  const { data } = await http.post('/bills', { billId, paymentMethod })
  return data
}

// ── التقييمات ───────────────────────────────────────────────
export const submitReview = async (reviewData) => {
  const { data } = await http.post('/reviews', reviewData)
  return data
}

// ── الأدمن ──────────────────────────────────────────────────
export const getDashboard = async () => {
  const { data } = await http.get('/admin/dashboard')
  return data
}

export const getTablesStatus = async () => {
  const { data } = await http.get('/admin/tables')
  return data
}
