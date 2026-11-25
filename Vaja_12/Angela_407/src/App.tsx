import { useEffect, useMemo, useState } from 'react'
import AddCouponModal from './components/AddCouponModal'
import CouponDetailsModal from './components/CouponDetailsModal'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import SavingsModal from './components/SavingsModal'
import Sidebar from './components/Sidebar'
import { couponCategories } from './types'
import type {
  Coupon,
  CouponFormData,
  CouponSortOption,
  PageName,
} from './types'
import './App.css'

const STORAGE_KEY = 'shopwallet-coupons'

function getBrandKey(store: string): string {
  return store.trim().toLowerCase()
}

const initialCoupons: Coupon[] = [
  {
    id: 1,
    store: 'Zara',
    description: 'Discount on your next purchase',
    discount: '20%',
    category: 'Fashion',
    expires: '10 Nov 2026',
    daysLeft: 2,
    favorite: true,
    used: false,
  },
  {
    id: 2,
    store: 'dm',
    description: 'Discount on selected products',
    discount: '€5',
    category: 'Beauty',
    expires: '12 Nov 2026',
    daysLeft: 4,
    favorite: true,
    used: false,
  },
  {
    id: 3,
    store: 'Nike',
    description: 'Special online shopping offer',
    discount: '15%',
    category: 'Sports',
    expires: '20 Nov 2026',
    daysLeft: 12,
    favorite: false,
    used: false,
  },
]

function isCoupon(value: unknown): value is Coupon {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'id' in value &&
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    value.id > 0 &&
    'store' in value &&
    typeof value.store === 'string' &&
    value.store.trim().length > 0 &&
    'description' in value &&
    typeof value.description === 'string' &&
    'discount' in value &&
    typeof value.discount === 'string' &&
    'category' in value &&
    couponCategories.some(category => category === value.category) &&
    'expires' in value &&
    typeof value.expires === 'string' &&
    getDaysLeftFromExpiration(value.expires) !== undefined &&
    'daysLeft' in value &&
    typeof value.daysLeft === 'number' &&
    Number.isFinite(value.daysLeft) &&
    'favorite' in value &&
    typeof value.favorite === 'boolean' &&
    'used' in value &&
    typeof value.used === 'boolean' &&
    (!('savings' in value) ||
      (typeof value.savings === 'number' &&
        Number.isFinite(value.savings) &&
        value.savings >= 0)) &&
    (!('code' in value) || typeof value.code === 'string')
  )
}

function formatExpirationDate(dateValue: string): string {
  const [year, month, day] = dateValue.split('-').map(Number)

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function getDaysLeft(dateValue: string): number {
  const [year, month, day] = dateValue.split('-').map(Number)
  const expirationDay = Date.UTC(year, month - 1, day)
  const today = new Date()
  const todayDay = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  return Math.round((expirationDay - todayDay) / 86_400_000)
}

function getDaysLeftFromExpiration(expires: string): number | undefined {
  const match = /^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/.exec(expires)

  if (!match) {
    return undefined
  }

  const [, dayText, monthName, yearText] = match
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ].indexOf(monthName)

  if (month < 0) {
    return undefined
  }

  const day = Number(dayText)
  const year = Number(yearText)
  const expirationDay = new Date(Date.UTC(year, month, day))

  if (
    expirationDay.getUTCFullYear() !== year ||
    expirationDay.getUTCMonth() !== month ||
    expirationDay.getUTCDate() !== day
  ) {
    return undefined
  }

  const today = new Date()
  const todayDay = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  return Math.round((expirationDay.getTime() - todayDay) / 86_400_000)
}

function refreshCouponExpiry(coupons: Coupon[]): Coupon[] {
  return coupons.map(coupon => {
    const daysLeft = getDaysLeftFromExpiration(coupon.expires)
    return daysLeft === undefined ? coupon : { ...coupon, daysLeft }
  })
}

function sortCoupons(
  coupons: Coupon[],
  sortBy: CouponSortOption
): Coupon[] {
  return [...coupons].sort((first, second) => {
    if (sortBy === 'store-asc' || sortBy === 'store-desc') {
      const storeOrder = first.store.localeCompare(second.store, undefined, {
        sensitivity: 'base',
      })
      const orderedStoreResult =
        sortBy === 'store-asc' ? storeOrder : -storeOrder

      return orderedStoreResult || first.id - second.id
    }

    const firstDaysLeft =
      getDaysLeftFromExpiration(first.expires) ?? first.daysLeft
    const secondDaysLeft =
      getDaysLeftFromExpiration(second.expires) ?? second.daysLeft
    const firstIsExpired = firstDaysLeft <= 0
    const secondIsExpired = secondDaysLeft <= 0

    if (firstIsExpired !== secondIsExpired) {
      return firstIsExpired ? 1 : -1
    }

    const expirationOrder = firstDaysLeft - secondDaysLeft

    if (expirationOrder === 0) {
      return first.id - second.id
    }

    return sortBy === 'expiration-soonest'
      ? expirationOrder
      : -expirationOrder
  })
}

function loadCoupons(): Coupon[] {
  const fallbackCoupons = () => refreshCouponExpiry(initialCoupons)

  if (typeof window === 'undefined') {
    return fallbackCoupons()
  }

  let savedCoupons: string | null

  try {
    savedCoupons = window.localStorage.getItem(STORAGE_KEY)
  } catch (error) {
    console.error('Unable to read ShopWallet coupons from localStorage.', error)
    return fallbackCoupons()
  }

  if (savedCoupons === null) {
    return fallbackCoupons()
  }

  try {
    const parsed: unknown = JSON.parse(savedCoupons)

    if (Array.isArray(parsed)) {
      const validCoupons = parsed.filter(isCoupon)
      const hasUniqueIds =
        new Set(validCoupons.map(coupon => coupon.id)).size ===
        validCoupons.length

      if (validCoupons.length === parsed.length && hasUniqueIds) {
        return refreshCouponExpiry(validCoupons)
      }
    }

    console.warn('Saved ShopWallet coupons were invalid; using initial coupons.')
  } catch (error) {
    console.warn('Saved ShopWallet coupons could not be parsed.', error)
  }

  return fallbackCoupons()
}

function App() {
  const [coupons, setCoupons] = useState<Coupon[]>(loadCoupons)
  const [search, setSearch] = useState('')
  const [activePage, setActivePage] = useState<PageName>('Dashboard')
  const [sortBy, setSortBy] =
    useState<CouponSortOption>('expiration-soonest')
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false)
  const [couponToMarkUsed, setCouponToMarkUsed] = useState<Coupon | null>(null)
  const [couponForDetails, setCouponForDetails] = useState<Coupon | null>(null)
  const [selectedFavouriteBrandKey, setSelectedFavouriteBrandKey] = useState<
    string | null
  >(null)
  const [couponBeingEdited, setCouponBeingEdited] = useState<Coupon | null>(
    null
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons))
    } catch (error) {
      console.error('Unable to save ShopWallet coupons to localStorage.', error)
    }
  }, [coupons])

  const unusedCoupons = useMemo(
    () => coupons.filter(coupon => !coupon.used),
    [coupons]
  )

  const totalSavings = useMemo(
    () =>
      coupons.reduce(
        (total, coupon) =>
          coupon.used ? total + (coupon.savings ?? 0) : total,
        0
      ),
    [coupons]
  )

  const pageCoupons = useMemo(() => {
    if (activePage === 'Archive') {
      return coupons.filter(coupon => coupon.used)
    }

    if (activePage === 'Favourite Stores') {
      return coupons.filter(coupon => coupon.favorite)
    }

    return unusedCoupons
  }, [activePage, unusedCoupons, coupons])

  const orderedCoupons = useMemo(
    () => sortCoupons(coupons, sortBy),
    [coupons, sortBy]
  )

  const filteredCoupons = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return sortCoupons(
      pageCoupons.filter(coupon =>
        `${coupon.store} ${coupon.description}`
          .toLowerCase()
          .includes(searchTerm)
      ),
      sortBy
    )
  }, [pageCoupons, search, sortBy])

  function toggleFavorite(id: number): void {
    const coupon = coupons.find(item => item.id === id)

    if (
      coupon?.favorite &&
      selectedFavouriteBrandKey === getBrandKey(coupon.store) &&
      !coupons.some(
        item =>
          item.id !== id &&
          item.favorite &&
          getBrandKey(item.store) === selectedFavouriteBrandKey
      )
    ) {
      setSelectedFavouriteBrandKey(null)
    }

    setCoupons(current =>
      current.map(coupon =>
        coupon.id === id
          ? { ...coupon, favorite: !coupon.favorite }
          : coupon
      )
    )
  }

  function markAsUsed(id: number): void {
    const coupon = coupons.find(item => item.id === id)

    if (coupon && !coupon.used) {
      setCouponToMarkUsed(coupon)
    }
  }

  function viewCouponDetails(coupon: Coupon): void {
    setCouponForDetails(coupon)
  }

  function confirmSavings(savings: number): void {
    if (!couponToMarkUsed) {
      return
    }

    const couponId = couponToMarkUsed.id
    setCoupons(current =>
      current.map(coupon =>
        coupon.id === couponId && !coupon.used
          ? { ...coupon, used: true, savings }
          : coupon
      )
    )
    setCouponToMarkUsed(null)
  }

  function addCoupon(formData: CouponFormData): void {
    setCoupons(current => {
      const id =
        current.reduce((highestId, coupon) => Math.max(highestId, coupon.id), 0) +
        1
      const coupon: Coupon = {
        id,
        store: formData.store,
        description: formData.description,
        discount: formData.discount,
        category: formData.category,
        expires: formatExpirationDate(formData.expirationDate),
        daysLeft: getDaysLeft(formData.expirationDate),
        favorite: false,
        used: false,
        ...(formData.code ? { code: formData.code } : {}),
      }

      return [...current, coupon]
    })
    setSearch('')
    setActivePage('My Coupons')
    setIsAddCouponOpen(false)
  }

  function changePage(page: PageName): void {
    if (page !== 'Favourite Stores') {
      setSelectedFavouriteBrandKey(null)
    }

    setActivePage(page)
  }

  function editCoupon(coupon: Coupon): void {
    setIsAddCouponOpen(false)
    setCouponBeingEdited(coupon)
  }

  function saveCoupon(formData: CouponFormData): void {
    if (couponBeingEdited) {
      const editedCouponId = couponBeingEdited.id

      if (
        selectedFavouriteBrandKey &&
        !coupons.some(
          coupon =>
            coupon.favorite &&
            getBrandKey(
              coupon.id === editedCouponId ? formData.store : coupon.store
            ) === selectedFavouriteBrandKey
        )
      ) {
        setSelectedFavouriteBrandKey(null)
      }

      setCoupons(current =>
        current.map(coupon => {
          if (coupon.id !== editedCouponId) {
            return coupon
          }

          const updatedCoupon: Coupon = {
            ...coupon,
            store: formData.store,
            description: formData.description,
            discount: formData.discount,
            category: formData.category,
            expires: formatExpirationDate(formData.expirationDate),
            daysLeft: getDaysLeft(formData.expirationDate),
          }

          if (formData.code) {
            updatedCoupon.code = formData.code
          } else {
            delete updatedCoupon.code
          }

          return updatedCoupon
        })
      )
      setCouponBeingEdited(null)
      return
    }

    addCoupon(formData)
  }

  function deleteCoupon(id: number): void {
    const coupon = coupons.find(item => item.id === id)

    if (
      coupon &&
      window.confirm(`Permanently delete the ${coupon.store} coupon?`)
    ) {
      if (
        selectedFavouriteBrandKey === getBrandKey(coupon.store) &&
        !coupons.some(
          item =>
            item.id !== id &&
            item.favorite &&
            getBrandKey(item.store) === selectedFavouriteBrandKey
        )
      ) {
        setSelectedFavouriteBrandKey(null)
      }

      setCoupons(current => current.filter(item => item.id !== id))
    }
  }

  function closeCouponModal(): void {
    setIsAddCouponOpen(false)
    setCouponBeingEdited(null)
  }

  return (
    <div className="app">
      <Sidebar activePage={activePage} onPageChange={changePage} />

      <main className="main-content">
        <Header pageTitle={activePage} />
        <Dashboard
          activePage={activePage}
          coupons={filteredCoupons}
          allCoupons={coupons}
          orderedCoupons={orderedCoupons}
          activeCouponCount={
            unusedCoupons.filter(coupon => coupon.daysLeft > 0).length
          }
          totalSavings={totalSavings}
          expiringCouponCount={
            unusedCoupons.filter(
              coupon => coupon.daysLeft > 0 && coupon.daysLeft <= 3
            ).length
          }
          search={search}
          onAddCoupon={() => setIsAddCouponOpen(true)}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          selectedBrandKey={selectedFavouriteBrandKey}
          onSelectedBrandChange={setSelectedFavouriteBrandKey}
          onToggleFavorite={toggleFavorite}
          onMarkAsUsed={markAsUsed}
          onEditCoupon={editCoupon}
          onDeleteCoupon={deleteCoupon}
          onViewDetails={viewCouponDetails}
        />
      </main>

      {(isAddCouponOpen || couponBeingEdited !== null) && (
        <AddCouponModal
          key={couponBeingEdited?.id ?? 'new-coupon'}
          coupon={couponBeingEdited ?? undefined}
          onSave={saveCoupon}
          onCancel={closeCouponModal}
        />
      )}

      {couponToMarkUsed && (
        <SavingsModal
          onConfirm={confirmSavings}
          onCancel={() => setCouponToMarkUsed(null)}
        />
      )}

      {couponForDetails && (
        <CouponDetailsModal
          coupon={couponForDetails}
          onClose={() => setCouponForDetails(null)}
        />
      )}
    </div>
  )
}

export default App
