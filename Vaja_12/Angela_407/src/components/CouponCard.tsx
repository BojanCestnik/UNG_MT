import type { Coupon } from '../types'

type CouponCardProps = {
  coupon: Coupon
  onToggleFavorite: (id: number) => void
  onMarkAsUsed: (id: number) => void
  onEditCoupon: (coupon: Coupon) => void
  onDeleteCoupon: (id: number) => void
  onViewDetails: (coupon: Coupon) => void
}

function CouponCard({
  coupon,
  onToggleFavorite,
  onMarkAsUsed,
  onEditCoupon,
  onDeleteCoupon,
  onViewDetails,
}: CouponCardProps) {
  const isExpired = !coupon.used && coupon.daysLeft <= 0
  const isExpiringSoon =
    !coupon.used && coupon.daysLeft > 0 && coupon.daysLeft <= 3

  return (
    <article
      className={`coupon-card${coupon.used ? ' is-used' : ''}${isExpired ? ' is-expired' : ''}`}
    >
      <div className="coupon-top">
        <span className="category">{coupon.category}</span>
        <button
          type="button"
          className={`favorite ${coupon.favorite ? 'is-favorite' : ''}`}
          onClick={() => onToggleFavorite(coupon.id)}
          aria-label={
            coupon.favorite
              ? `Remove ${coupon.store} from favourites`
              : `Add ${coupon.store} to favourites`
          }
          aria-pressed={coupon.favorite}
        >
          {coupon.favorite ? '♥' : '♡'}
        </button>
      </div>

      <h3>{coupon.store}</h3>
      <p className="coupon-description">{coupon.description}</p>

      {coupon.code && (
        <div className="coupon-code">
          <span>CODE</span>
          <strong>{coupon.code}</strong>
        </div>
      )}

      {coupon.discount && (
        <div className="discount">
          {coupon.discount} <span>OFF</span>
        </div>
      )}

      <div className="coupon-footer">
        <div>
          <span className="expiry-label">EXPIRES</span>
          <p>{coupon.expires}</p>
        </div>
        <span
          className={`expiry-badge${coupon.used ? ' used' : ''}${isExpired ? ' expired' : ''}${isExpiringSoon ? ' warning' : ''}`}
        >
          {coupon.used
            ? 'Used'
            : isExpired
              ? 'Expired'
              : `${coupon.daysLeft} days left`}
        </span>
      </div>

      <div className="coupon-actions">
        <button
          type="button"
          className="coupon-action-button edit-coupon-button"
          onClick={() => onEditCoupon(coupon)}
          aria-label={`Edit ${coupon.store} coupon`}
        >
          Edit
        </button>
        <button
          type="button"
          className="coupon-action-button delete-coupon-button"
          onClick={() => onDeleteCoupon(coupon.id)}
          aria-label={`Delete ${coupon.store} coupon`}
        >
          Delete
        </button>
        <button
          type="button"
          className="coupon-action-button view-details-button"
          onClick={() => onViewDetails(coupon)}
          aria-label={`View details for ${coupon.store} coupon`}
        >
          View Details
        </button>
      </div>

      <button
        type="button"
        className="used-button"
        onClick={() => onMarkAsUsed(coupon.id)}
        disabled={coupon.used}
      >
        {coupon.used ? 'Already used' : 'Mark as used'}
      </button>
    </article>
  )
}

export default CouponCard
