import React from 'react';
import {
  formatDisplayDate,
  formatHeroCountdown,
  formatRemainingDays,
  calculateProgressPercent
} from '../utils/dateUtils.js';

export default function PinnedCard({ event, onUnpin, onEdit }) {
  if (!event) {
    return (
      <div className="empty-state">
        <p>Trenutno nimaš pripetega nobenega prihajajočega dogodka.</p>
        <p>
          Pripni katerega koli izmed spodnjih dogodkov z gumbom <strong>Pripni</strong> ali dodaj novega.
        </p>
      </div>
    );
  }

  const progress = calculateProgressPercent(event.createdAt, event.date);

  return (
    <article className={`pinned-card theme-${event.color}`}>
      <div className="pinned-card__top">
        <span className="pinned-card__label">📌 Pripet odštevalnik</span>
        <div className="event-card__actions">
          <button
            type="button"
            className="card-action-btn"
            onClick={() => onEdit(event)}
          >
            Uredi
          </button>
          <button
            type="button"
            className="card-action-btn"
            onClick={onUnpin}
          >
            Odpni
          </button>
        </div>
      </div>

      <div className="pinned-card__center">
        <h3 className="pinned-card__title">
          {event.emoji && <span aria-hidden="true">{event.emoji}</span>}
          <span>{event.title}</span>
        </h3>
        {event.subtitle && <p className="pinned-card__subtitle">{event.subtitle}</p>}
        <p className="pinned-card__countdown">{formatHeroCountdown(event.daysRemaining)}</p>
      </div>

      <div className="pinned-card__meta">
        <span>{formatDisplayDate(event.date)}</span>
        <span>{formatRemainingDays(event.daysRemaining)}</span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </article>
  );
}
