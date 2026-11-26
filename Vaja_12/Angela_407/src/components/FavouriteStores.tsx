import { useMemo } from 'react'
import type { Coupon } from '../types'
import CouponCard from './CouponCard'

type FavouriteStoresProps = {
  coupons: Coupon[]
  orderedCoupons: Coupon[]
  search: string
  selectedBrandKey: string | null
  onSelectedBrandChange: (brandKey: string | null) => void
  onToggleFavorite: (id: number) => void
  onMarkAsUsed: (id: number) => void
  onEditCoupon: (coupon: Coupon) => void
  onDeleteCoupon: (id: number) => void
  onViewDetails: (coupon: Coupon) => void
}

type BrandGroup = {
  key: string
  name: string
  coupons: Coupon[]
}

function getBrandKey(store: string): string {
  return store.trim().toLowerCase()
}

function FavouriteStores({
  coupons,
  orderedCoupons,
  search,
  selectedBrandKey,
  onSelectedBrandChange,
  onToggleFavorite,
  onMarkAsUsed,
  onEditCoupon,
  onDeleteCoupon,
  onViewDetails,
}: FavouriteStoresProps) {
  const brandGroups = useMemo(() => {
    const groups = new Map<string, BrandGroup>()

    coupons.forEach(coupon => {
      const name = coupon.store.trim()
      const key = getBrandKey(name)
      const group = groups.get(key)

      if (group) {
        group.coupons.push(coupon)
      } else {
        groups.set(key, { key, name, coupons: [coupon] })
      }
    })

    return Array.from(groups.values())
  }, [coupons])

  const favouriteBrands = useMemo(
    () => brandGroups.filter(brand => brand.coupons.some(coupon => coupon.favorite)),
    [brandGroups]
  )

  function toggleFavorite(id: number): void {
    onToggleFavorite(id)
  }

  const selectedBrand = favouriteBrands.find(
    brand => brand.key === selectedBrandKey
  )
  const searchTerm = search.trim().toLowerCase()

  if (selectedBrand) {
    const filteredCoupons = orderedCoupons.filter(
      coupon =>
        getBrandKey(coupon.store) === selectedBrand.key &&
        `${coupon.store} ${coupon.description}`
          .toLowerCase()
          .includes(searchTerm)
    )

    return (
      <>
        <section className="section-heading">
          <div>
            <h2>{selectedBrand.name}</h2>
            <p>
              {selectedBrand.coupons.length}{' '}
              {selectedBrand.coupons.length === 1 ? 'coupon' : 'coupons'}
            </p>
          </div>
          <button
            type="button"
            className="brand-back-button"
            onClick={() => onSelectedBrandChange(null)}
          >
            Back to Favourite Stores
          </button>
        </section>

        <section className="coupon-grid">
          {filteredCoupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onToggleFavorite={toggleFavorite}
              onMarkAsUsed={onMarkAsUsed}
              onEditCoupon={onEditCoupon}
              onDeleteCoupon={onDeleteCoupon}
              onViewDetails={onViewDetails}
            />
          ))}
          {filteredCoupons.length === 0 && (
            <p className="empty-message">
              No coupons from this brand match your search.
            </p>
          )}
        </section>
      </>
    )
  }

  const filteredBrands = favouriteBrands.filter(
    brand =>
      brand.name.toLowerCase().includes(searchTerm) ||
      brand.coupons.some(coupon =>
        coupon.description.toLowerCase().includes(searchTerm)
      )
  )

  return (
    <section className="coupon-grid">
      {filteredBrands.map(brand => (
        <button
          key={brand.key}
          type="button"
          className="brand-card"
          onClick={() => onSelectedBrandChange(brand.key)}
        >
          <span className="brand-card-name">{brand.name}</span>
          <span className="brand-card-count">
            {brand.coupons.length}{' '}
            {brand.coupons.length === 1 ? 'coupon' : 'coupons'}
          </span>
        </button>
      ))}
      {filteredBrands.length === 0 && (
        <p className="empty-message">
          {searchTerm
            ? 'No favourite stores match your search.'
            : 'No favourite stores yet. Favourite a coupon to add its brand.'}
        </p>
      )}
    </section>
  )
}

export default FavouriteStores
