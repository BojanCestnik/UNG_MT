import { useEffect, useState } from 'react'
import type { Coupon } from '../types'

type CouponDetailsModalProps = {
  coupon: Coupon
  onClose: () => void
}

function CouponDetailsModal({ coupon, onClose }: CouponDetailsModalProps) {
  const [copyMessage, setCopyMessage] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)
  const hasCode = Boolean(coupon.code?.trim())
  const isExpired = coupon.daysLeft <= 0
  const isExpiringSoon = coupon.daysLeft > 0 && coupon.daysLeft <= 3
  const expirationStatus = isExpired
    ? 'Expired'
    : isExpiringSoon
      ? `Expiring soon (${coupon.daysLeft} days left)`
      : `Active (${coupon.daysLeft} days left)`
  const expirationStatusClass = isExpired
    ? 'expired'
    : isExpiringSoon
      ? 'warning'
      : ''

  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  async function copyCode(): Promise<void> {
    setCopyMessage('')

    if (!coupon.code || !navigator.clipboard?.writeText) {
      setCopyFailed(true)
      setCopyMessage('Unable to copy code. Please copy it manually.')
      return
    }

    try {
      await navigator.clipboard.writeText(coupon.code)
      setCopyFailed(false)
      setCopyMessage('Coupon code copied to clipboard.')
    } catch (error) {
      console.error('Unable to copy coupon code to the clipboard.', error)
      setCopyFailed(true)
      setCopyMessage('Unable to copy code. Please copy it manually.')
    }
  }

  return (
    <div className="modal-backdrop">
      <section
        className="coupon-modal coupon-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-details-title"
      >
        <div className="modal-heading">
          <h2 id="coupon-details-title">{coupon.store} Coupon Details</h2>
          <p>Complete information for this coupon.</p>
        </div>

        <dl className="coupon-details-list">
          <div className="coupon-detail">
            <dt>Store name</dt>
            <dd>{coupon.store}</dd>
          </div>
          <div className="coupon-detail">
            <dt>Category</dt>
            <dd>{coupon.category}</dd>
          </div>
          <div className="coupon-detail">
            <dt>Discount</dt>
            <dd>{coupon.discount || 'Not provided'}</dd>
          </div>
          <div className="coupon-detail">
            <dt>Expiration date</dt>
            <dd>{coupon.expires}</dd>
          </div>
          <div className="coupon-detail">
            <dt>Expiration status</dt>
            <dd>
              <span className={`expiry-badge ${expirationStatusClass}`}>
                {expirationStatus}
              </span>
            </dd>
          </div>
          <div className="coupon-detail">
            <dt>Used status</dt>
            <dd>
              <span className={`expiry-badge${coupon.used ? ' used' : ''}`}>
                {coupon.used ? 'Used' : 'Unused'}
              </span>
            </dd>
          </div>
          <div className="coupon-detail">
            <dt>Favourite status</dt>
            <dd>{coupon.favorite ? 'Favourited' : 'Not favourited'}</dd>
          </div>
          <div className="coupon-detail coupon-detail-full-width">
            <dt>Description</dt>
            <dd>{coupon.description || 'No description provided.'}</dd>
          </div>
          <div className="coupon-detail coupon-detail-full-width">
            <dt>Coupon code</dt>
            {hasCode ? (
              <dd className="coupon-detail-code">
                <code className="coupon-code-value">{coupon.code}</code>
                <button
                  type="button"
                  className="copy-code-button"
                  onClick={copyCode}
                >
                  Copy Code
                </button>
                <span
                  className={`copy-code-message${copyFailed ? ' is-error' : ''}`}
                  role="status"
                  aria-live="polite"
                >
                  {copyMessage}
                </span>
              </dd>
            ) : (
              <dd>No coupon code available.</dd>
            )}
          </div>
        </dl>

        <div className="modal-actions">
          <button className="cancel-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </section>
    </div>
  )
}

export default CouponDetailsModal
