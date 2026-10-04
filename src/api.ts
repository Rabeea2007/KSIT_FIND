import { Capacitor } from '@capacitor/core'

const DEFAULT_API_BASE_URL = Capacitor.getPlatform() === 'android'
  ? 'http://10.0.2.2:8080/api'
  : 'http://localhost:8080/api'
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL).replace(/\/+$/, '')
const API_ORIGIN = new URL(API_BASE_URL).origin

export type UserDto = {
  id: string
  name: string
  email: string
  phone?: string | null
  role: 'STUDENT' | 'STAFF' | 'ADMIN'
  profileImage?: string | null
  createdAt?: string
  updatedAt?: string
}

export type ItemDto = {
  id: string
  title: string
  description: string
  category: string
  brand?: string | null
  color?: string | null
  location: string
  custodyLocation?: string
  itemDate?: string
  itemType: 'LOST' | 'FOUND'
  status: 'LOST' | 'FOUND' | 'CLAIMED' | 'RESOLVED'
  imageUrls: string[]
  createdAt?: string
  updatedAt?: string
  reporter?: UserDto
}

export type ClaimDto = {
  id: string
  itemId: string
  userId: string
  itemTitle: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  evidence?: string
  createdAt?: string
  updatedAt?: string
}

export type ClaimMessageDto = {
  id: string
  senderId: string
  content: string
  createdAt: string
  mine: boolean
}

export function getAuthToken() {
  return localStorage.getItem('ksit_jwt')
}

export function resolveMediaUrl(url: string) {
  if (/^(https?:|data:)/i.test(url)) return url
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const headers = new Headers(options.headers ?? {})
  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `The KSIT FIND API at ${API_BASE_URL} could not be reached. Check that Spring Boot is running and reachable from this device; browser requests may also be blocked if the backend CORS allow-list does not include this app's origin.`,
      )
    }
    throw error
  }

  const contentType = response.headers.get('content-type') ?? ''
  const data = response.status === 204
    ? undefined
    : contentType.includes('application/json')
      ? await response.json()
      : await response.text()

  if (!response.ok) {
    if (response.status === 401) clearAuthToken()
    const details = data && typeof data === 'object' && 'details' in data
      ? Object.entries((data as { details?: Record<string, string> }).details ?? {})
          .map(([field, message]) => `${field}: ${message}`)
          .join('; ')
      : ''
    const message = typeof data === 'string'
      ? data
      : data?.message ?? data?.error ?? `Request failed (${response.status})`
    throw new Error(details ? `${message}: ${details}` : message)
  }

  return data as T
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('ksit_jwt', token)
  } else {
    localStorage.removeItem('ksit_jwt')
  }
}

export function clearAuthToken() {
  setAuthToken(null)
}

export async function loginUser(email: string, password: string) {
  return request<{ token: string; user: UserDto }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function registerUser(payload: { name: string; email: string; password: string; phone?: string }) {
  return request<{ token: string; user: UserDto }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getCurrentUser() {
  return request<UserDto>('/auth/me')
}

export async function getUserProfile() {
  return request<UserDto>('/users/me')
}

export async function updateUserProfile(payload: { name?: string; phone?: string; profileImage?: string }) {
  return request<UserDto>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function getItems(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams()
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
  return request<{ content: ItemDto[]; totalElements: number; totalPages: number }>(`/items${query}`)
}

export async function getMyItems(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams()
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
  return request<{ content: ItemDto[]; totalElements: number; totalPages: number }>(`/items/mine${query}`)
}

export async function getItemById(id: string) {
  return request<ItemDto>(`/items/${id}`)
}

export async function createItem(payload: Record<string, unknown>) {
  return request<ItemDto>('/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function reportItem(id: string, reason: string) {
  return request<void>(`/items/${id}/reports`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

export async function uploadImage(file: File) {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Choose an image smaller than 10 MB.')
  }
  const form = new FormData()
  form.append('file', file)
  return request<{ url: string }>('/files', {
    method: 'POST',
    body: form,
  })
}

export async function getMyClaims() {
  return request<ClaimDto[]>('/claims/my')
}

export async function getClaimById(id: string) {
  return request<ClaimDto>(`/claims/${id}`)
}

export async function getClaimMessages(id: string) {
  return request<ClaimMessageDto[]>(`/claims/${id}/messages`)
}

export async function sendClaimMessage(id: string, content: string) {
  return request<ClaimMessageDto>(`/claims/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export async function submitClaim(itemId: string, payload: Record<string, unknown>) {
  return request<ClaimDto>(`/items/${itemId}/claims`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getNotifications() {
  return request<Array<{ id: string; itemId?: string; type: string; message: string; read: boolean; createdAt: string }>>('/notifications')
}

export async function getUnreadNotificationCount() {
  return request<number>('/notifications/unread-count')
}

export async function markNotificationRead(id: string) {
  return request<any>(`/notifications/${id}/read`, {
    method: 'PUT',
  })
}

export async function markAllNotificationsRead() {
  return request<void>('/notifications/read-all', {
    method: 'PUT',
  })
}

export async function getAdminStats() {
  return request<{ totalUsers: number; totalItems: number; activeClaims: number; resolvedItems: number; lostItems: number; foundItems: number }>('/admin/stats')
}

export async function getAdminItems() {
  return request<ItemDto[]>('/admin/items')
}

export async function getAdminUsers() {
  return request<UserDto[]>('/admin/users')
}

export async function updateAdminUserRole(userId: string, role: UserDto['role']) {
  return request<UserDto>(`/admin/users/${userId}/role?role=${encodeURIComponent(role)}`, {
    method: 'PUT',
  })
}

export async function getAdminClaims() {
  return request<ClaimDto[]>('/admin/claims')
}

export async function updateClaimStatus(id: string, status: ClaimDto['status']) {
  return request<ClaimDto>(`/claims/${id}?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
  })
}

export async function completeHandover(id: string) {
  return request<void>(`/claims/${id}/handover`, { method: 'POST' })
}

export async function setAdminItemStatus(itemId: string, status: string) {
  return request<ItemDto>(`/admin/items/${itemId}/status?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
  })
}
