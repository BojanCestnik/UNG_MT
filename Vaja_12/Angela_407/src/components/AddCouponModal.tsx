import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { couponCategories } from '../types'
import type { Coupon, CouponFormData } from '../types'

type AddCouponModalProps = {
  coupon?: Coupon
  onSave: (coupon: CouponFormData) => void
  onCancel: () => void
}

const emptyForm: CouponFormData = {
  store: '',
  category: 'Fashion',
  discount: '',
  description: '',
  expirationDate: '',
  code: '',
}

function getExpirationDateInputValue(expires: string): string {
  const match = /^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/.exec(expires)

  if (!match) {
    return ''
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
  const day = Number(dayText)
  const year = Number(yearText)
  const date = new Date(Date.UTC(year, month, day))

  if (
    month < 0 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    return ''
  }

  return `${yearText}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getInitialForm(coupon?: Coupon): CouponFormData {
  if (!coupon) {
    return { ...emptyForm }
  }

  return {
    store: coupon.store,
    category: coupon.category,
    discount: coupon.discount,
    description: coupon.description,
    expirationDate: getExpirationDateInputValue(coupon.expires),
    code: coupon.code ?? '',
  }
}

function AddCouponModal({
  coupon,
  onSave,
  onCancel,
}: AddCouponModalProps) {
  const [form, setForm] = useState<CouponFormData>(() => getInitialForm(coupon))
  const [error, setError] = useState('')

  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onCancel])

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (!form.store.trim()) {
      setError('Enter a store name.')
      return
    }

    if (!form.expirationDate) {
      setError('Choose an expiration date.')
      return
    }

    onSave({
      ...form,
      store: form.store.trim(),
      discount: form.discount.trim(),
      description: form.description.trim(),
      code: form.code.trim(),
    })
  }

  return (
    <div className="modal-backdrop">
      <section
        className="coupon-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-modal-title"
      >
        <div className="modal-heading">
          <h2 id="coupon-modal-title">
            {coupon ? 'Edit Coupon' : 'Add a coupon'}
          </h2>
          <p>
            {coupon
              ? 'Update the details of this coupon.'
              : 'Save a new discount to your wallet.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="coupon-form-grid">
            <label className="coupon-form-field full-width">
              <span>Store name</span>
              <input
                autoFocus
                type="text"
                value={form.store}
                onChange={event => {
                  setForm({ ...form, store: event.target.value })
                  setError('')
                }}
                required
              />
            </label>

            <label className="coupon-form-field">
              <span>Category</span>
              <select
                value={form.category}
                onChange={event => {
                  const category = couponCategories.find(
                    option => option === event.target.value
                  )

                  if (category) {
                    setForm({ ...form, category })
                  }
                }}
                required
              >
                {couponCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="coupon-form-field">
              <span>Discount amount</span>
              <input
                type="text"
                placeholder="20% or €5"
                value={form.discount}
                onChange={event =>
                  setForm({ ...form, discount: event.target.value })
                }
              />
            </label>

            <label className="coupon-form-field full-width">
              <span>Coupon description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={event =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </label>

            <label className="coupon-form-field">
              <span>Expiration date</span>
              <input
                type="date"
                value={form.expirationDate}
                onChange={event => {
                  setForm({ ...form, expirationDate: event.target.value })
                  setError('')
                }}
                required
              />
            </label>

            <label className="coupon-form-field">
              <span>Coupon code (optional)</span>
              <input
                type="text"
                value={form.code}
                onChange={event =>
                  setForm({ ...form, code: event.target.value })
                }
              />
            </label>
          </div>

          {error && (
            <p className="coupon-form-error" role="alert">
              {error}
            </p>
          )}

          <div className="modal-actions">
            <button
              className="cancel-button"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button className="primary-button" type="submit">
              {coupon ? 'Save Changes' : 'Save Coupon'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddCouponModal
