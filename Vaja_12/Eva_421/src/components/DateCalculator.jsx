import React from 'react';
import { calculateDateDifference } from '../utils/dateUtils.js';

export default function DateCalculator({ calculator, onChange }) {
  const { startDate, endDate, includeEndDay } = calculator;

  const handleSwap = () => {
    onChange({
      ...calculator,
      startDate: endDate,
      endDate: startDate
    });
  };

  const result = calculateDateDifference(startDate, endDate, includeEndDay);

  let directionText = 'Izbrana datuma sta enaka.';
  if (result) {
    if (result.direction > 0) {
      directionText = 'Datum 2 je po Datumu 1 (odštevanje naprej).';
    } else if (result.direction < 0) {
      directionText = 'Datum 2 je pred Datumom 1 (razlika nazaj v času).';
    }
  }

  const weeksDisplay =
    result && result.remainderDays > 0
      ? `${result.fullWeeks} ted. + ${result.remainderDays} d.`
      : result
        ? `${result.fullWeeks}`
        : '0';

  return (
    <section className="section card-surface" id="kalkulator" aria-labelledby="calc-heading">
      <div className="section__header">
        <h2 id="calc-heading" className="section__title">
          Kalkulator razlike med datumoma
        </h2>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={handleSwap}
          title="Zamenjaj datuma"
        >
          ⇄ Zamenjaj
        </button>
      </div>

      <div className="calc-form">
        <div className="calc-form__inputs">
          <div className="form-group">
            <label htmlFor="calc-start-date">Datum 1 (začetni)</label>
            <input
              type="date"
              id="calc-start-date"
              value={startDate}
              onChange={(e) => onChange({ ...calculator, startDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="calc-end-date">Datum 2 (končni)</label>
            <input
              type="date"
              id="calc-end-date"
              value={endDate}
              onChange={(e) => onChange({ ...calculator, endDate: e.target.value })}
            />
          </div>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={includeEndDay}
            onChange={(e) => onChange({ ...calculator, includeEndDay: e.target.checked })}
          />
          <span>Vključi končni dan (+1 dan pri štetju razpona)</span>
        </label>
      </div>

      <div className="calc-results" aria-live="polite">
        {!result ? (
          <p className="calc-direction">Izberi oba veljavna datuma za izračun razlike.</p>
        ) : (
          <>
            <p className="calc-direction">
              {directionText}{' '}
              <strong>
                {result.includeEndDay
                  ? 'Končni dan je vključen v štetje.'
                  : 'Končni dan ni vključen v štetje.'}
              </strong>
            </p>

            <div className="calc-metrics">
              <div className="metric-box">
                <span className="metric-box__value">{result.totalDays}</span>
                <span className="metric-box__label">Koledarskih dni</span>
              </div>
              <div className="metric-box">
                <span className="metric-box__value">{weeksDisplay}</span>
                <span className="metric-box__label">Tednov</span>
              </div>
              <div className="metric-box">
                <span className="metric-box__value">{result.workdays}</span>
                <span className="metric-box__label">Delovnih dni (Pon–Pet)</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
