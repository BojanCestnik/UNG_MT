import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type SavingsModalProps = {
  onConfirm: (savings: number) => void
  onCancel: () => void
}

function SavingsModal({ onConfirm, onCancel }: SavingsModalProps) {
  const [amount, setAmount] = useState('')
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

    const savings = Number(amount)

    if (!amount.trim() || !Number.isFinite(savings) || savings < 0) {
      setError('Enter a valid non-negative amount.')
      return
    }

    onConfirm(savings)
  }

  return (
    <div className="modal-backdrop">
      <section
        className="coupon-modal savings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="savings-modal-title"
      >
        <div className="modal-heading">
          <h2 id="savings-modal-title">Record your savings</h2>
          <p>How much did you save using this coupon?</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="coupon-form-field">
            <span>Amount saved (€)</span>
            <input
              autoFocus
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={amount}
              onChange={event => {
                setAmount(event.target.value)
                setError('')
              }}
              aria-describedby={error ? 'savings-form-error' : undefined}
              required
            />
          </label>

          {error && (
            <p id="savings-form-error" className="coupon-form-error" role="alert">
              {error}
            </p>
          )}

          <div className="modal-actions">
            <button className="cancel-button" type="button" onClick={onCancel}>
              Cancel
            </button>
            <button className="primary-button" type="submit">
              Confirm
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default SavingsModal
