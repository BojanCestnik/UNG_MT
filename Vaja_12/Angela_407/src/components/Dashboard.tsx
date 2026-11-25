import { couponSortOptions } from '../types'
import type { Coupon, CouponSortOption, PageName } from '../types'
import CouponCard from './CouponCard'
import FavouriteStores from './FavouriteStores'

function getEmptyMessage(activePage: PageName, search: string): string {
  if (search.trim()) {
    return 'No coupons match your search.'
  }

  if (activePage === 'Favourite Stores') {
    return 'No favourite coupons yet. Mark one as a favourite to see it here.'
  }

  if (activePage === 'Archive') {
    return 'No used coupons yet.'
  }

  return 'No coupons yet. Add one to get started.'
}

type DashboardProps = {
  activePage: PageName
  coupons: Coupon[]
  allCoupons: Coupon[]
  orderedCoupons: Coupon[]
  activeCouponCount: number
  totalSavings: number
  expiringCouponCount: number
  search: string
  onAddCoupon: () => void
  onSearchChange: (value: string) => void
  sortBy: CouponSortOption
  onSortByChange: (sortBy: CouponSortOption) => void
  selectedBrandKey: string | null
  onSelectedBrandChange: (brandKey: string | null) => void
  onToggleFavorite: (id: number) => void
  onMarkAsUsed: (id: number) => void
  onEditCoupon: (coupon: Coupon) => void
  onDeleteCoupon: (id: number) => void
  onViewDetails: (coupon: Coupon) => void
}

function Dashboard({
  activePage,
  coupons,
  allCoupons,
  orderedCoupons,
  activeCouponCount,
  totalSavings,
  expiringCouponCount,
  search,
  onAddCoupon,
  onSearchChange,
  sortBy,
  onSortByChange,
  selectedBrandKey,
  onSelectedBrandChange,
  onToggleFavorite,
  onMarkAsUsed,
  onEditCoupon,
  onDeleteCoupon,
  onViewDetails,
}: DashboardProps) {
  return (
    <>
      {activePage === 'Dashboard' && (
        <>
          <section className="welcome">
            <div>
              <p className="eyebrow light">WELCOME TO YOUR WALLET</p>
              <h2>Save more. Shop smarter.</h2>
              <p>All your shopping discounts, organised in one place.</p>
            </div>
            <div className="welcome-symbol">%</div>
          </section>

          <section className="stats">
            <div className="stat-card">
              <span className="stat-icon blue">▤</span>
              <p>Active coupons</p>
              <h3>{activeCouponCount}</h3>
            </div>

            <div className="stat-card">
              <span className="stat-icon orange">◷</span>
              <p>Expiring soon</p>
              <h3>{expiringCouponCount}</h3>
            </div>

            <div className="stat-card">
              <span className="stat-icon green">€</span>
              <p>Total savings</p>
              <h3>€{totalSavings.toFixed(2)}</h3>
            </div>
          </section>
        </>
      )}

      <section className="section-heading">
        <div>
          {activePage === 'Dashboard' && <h2>Your coupons</h2>}
          <p>Keep track of your available discounts.</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={onAddCoupon}
        >
          + Add coupon
        </button>
      </section>

      <div className="coupon-toolbar">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            aria-label="Search coupons"
            placeholder="Search by store or coupon description..."
            value={search}
            onChange={event => onSearchChange(event.target.value)}
          />
        </div>
        {activePage === 'My Coupons' && (
          <label className="sort-control">
            <span>Sort by</span>
            <select
              aria-label="Sort by"
              value={sortBy}
              onChange={event => {
                const selectedOption = couponSortOptions.find(
                  option => option.value === event.target.value
                )

                if (selectedOption) {
                  onSortByChange(selectedOption.value)
                }
              }}
            >
              {couponSortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {activePage === 'Favourite Stores' ? (
        <FavouriteStores
          coupons={allCoupons}
          orderedCoupons={orderedCoupons}
          search={search}
          selectedBrandKey={selectedBrandKey}
          onSelectedBrandChange={onSelectedBrandChange}
          onToggleFavorite={onToggleFavorite}
          onMarkAsUsed={onMarkAsUsed}
          onEditCoupon={onEditCoupon}
          onDeleteCoupon={onDeleteCoupon}
          onViewDetails={onViewDetails}
        />
      ) : (
        <section className="coupon-grid">
          {coupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onToggleFavorite={onToggleFavorite}
              onMarkAsUsed={onMarkAsUsed}
              onEditCoupon={onEditCoupon}
              onDeleteCoupon={onDeleteCoupon}
              onViewDetails={onViewDetails}
            />
          ))}
          {coupons.length === 0 && (
            <p className="empty-message">
              {getEmptyMessage(activePage, search)}
            </p>
          )}
        </section>
      )}
    </>
  )
}

export default Dashboard
