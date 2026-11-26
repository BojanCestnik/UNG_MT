import React from 'react';
import { formatDisplayDate, formatPastDaysAgo } from '../utils/dateUtils.js';

const DOT_COLORS = {
  peach: 'var(--card-peach-bg)',
  mint: 'var(--card-mint-bg)',
  sky: 'var(--card-sky-bg)',
  taupe: 'var(--card-taupe-bg)',
  lavender: 'var(--card-lavender-bg)'
};

export default function PastEventsList({ events, onDelete }) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <p>Ni preteklih dogodkov. Ko se prihajajoči dogodek izteče, se samodejno premakne sem.</p>
      </div>
    );
  }

  return (
    <div className="past-list">
      {events.map((ev) => (
        <div key={ev.id} className="past-item">
          <div className="past-item__info">
            <span
              className="past-item__dot"
              style={{ backgroundColor: DOT_COLORS[ev.color] || DOT_COLORS.taupe }}
            />
            <div>
              <div className="past-item__title">
                {ev.emoji ? `${ev.emoji} ` : ''}
                {ev.title}
                {ev.subtitle ? ` – ${ev.subtitle}` : ''}
              </div>
              <div className="past-item__date">{formatDisplayDate(ev.date)}</div>
            </div>
          </div>

          <div className="past-item__right">
            <span className="past-item__ago">{formatPastDaysAgo(ev.daysAgo)}</span>
            <button
              type="button"
              className="card-action-btn"
              onClick={() => onDelete(ev.id)}
              title="Odstrani iz zgodovine"
              aria-label={`Odstrani ${ev.title}`}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
