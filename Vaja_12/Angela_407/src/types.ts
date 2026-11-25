export type PageName =
  | 'Dashboard'
  | 'My Coupons'
  | 'Favourite Stores'
  | 'Archive'

export const couponSortOptions = [
  {
    value: 'expiration-soonest',
    label: 'Expiration date - soonest first',
  },
  {
    value: 'expiration-latest',
    label: 'Expiration date - latest first',
  },
  { value: 'store-asc', label: 'Store name - A to Z' },
  { value: 'store-desc', label: 'Store name - Z to A' },
] as const

export type CouponSortOption = (typeof couponSortOptions)[number]['value']

export const couponCategories = [
  'Fashion',
  'Beauty',
  'Sports',
  'Electronics',
  'Food',
  'Other',
] as const

export type CouponCategory = (typeof couponCategories)[number]

export type Coupon = {
  id: number
  store: string
  description: string
  discount: string
  category: CouponCategory
  expires: string
  daysLeft: number
  favorite: boolean
  used: boolean
  savings?: number
  code?: string
}

export type CouponFormData = {
  store: string
  category: CouponCategory
  discount: string
  description: string
  expirationDate: string
  code: string
}
