import axios from 'axios'

const AUTH_BASE = 'http://89.169.177.64:8080/api/v1/auth'
const CUSTOM_BASE = 'http://89.169.177.64:8089/api/v1/customizer'
const STORE_BASE = 'http://89.169.177.64:8085/api/v1'

const client = axios.create({
  headers: { 'Content-Type': 'application/json' }
})

export const authLogin = (email) => client.post(`${AUTH_BASE}/login`, { email })
export const authRegister = (email) => client.post(`${AUTH_BASE}/register`, { email })
export const authVerify = (email, code) => client.post(`${AUTH_BASE}/code/verify`, { email, code })
export const authResend = (email) => client.post(`${AUTH_BASE}/code/resend`, { email })

export const getCustomizations = (type) => client.get(`${CUSTOM_BASE}/customization?customizationType=${type}`)
export const putSiteName = (siteName) => client.put(`${CUSTOM_BASE}/customization/site?siteName=${encodeURIComponent(siteName)}`)
export const putCustomizationChoice = (id, type) => client.put(`${CUSTOM_BASE}/customization/${id}?customizationType=${type}`)

// Store API endpoints
export const getPaidItems = (limit = 20, offset = 0) => client.get(`${STORE_BASE}/baskets/items/paid?limit=${limit}&offset=${offset}`)
export const getGood = (goodId) => client.get(`${STORE_BASE}/goods/${goodId}`)
export const getCategory = (categoryId) => client.get(`${STORE_BASE}/categories/${categoryId}`)
export const getCategories = () => client.get(`${STORE_BASE}/categories`)
export const getBrand = (brandId) => client.get(`${STORE_BASE}/brands/${brandId}`)
export const getBrands = () => client.get(`${STORE_BASE}/brands`)

export default client
