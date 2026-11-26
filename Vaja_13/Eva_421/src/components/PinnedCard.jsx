import React from 'react';
import {
  formatDisplayDate,
  formatHeroCountdown,
  calculateProgressPercent
} from '../utils/dateUtils.js';
import { ArrowRightIcon } from './Icons.jsx';

export default function PinnedCard({ event, onEdit }) {
  if (!event) {
    return (
      <div className="empty-state">
        <p>Trenutno nimaš pripetega nobenega prihajajočega dogodka.</p>
        <p>
          Pripni katerega koli izmed spodnjih dogodkov z ikono žebljička ali dodaj novega.
        </p>
      </div>
    );
  }

  const progress = calculateProgressPercent(event.createdAt, event.date);

  return (
    <article className={`hero-card theme-${event.color}`}>
      <div className="hero-card__decor-circle" aria-hidden="true" />

      <div className="hero-card__header">
        <div className="hero-card__title-row">
          {event.emoji && (
            <span className="hero-card__emoji" aria-hidden="true">
              {event.emoji}
            </span>
          )}
          <h2 className="hero-card__title">{event.title}</h2>
          <span className="hero-card__badge">📌 Glavni odštevalnik</span>
        </div>

        {event.subtitle && <p className="hero-card__subtitle">{event.subtitle}</p>}
      </div>

      <div className="hero-card__countdown">{formatHeroCountdown(event.daysRemaining)}</div>

      <div className="hero-card__bottom">
        <div className="hero-card__meta-row">
          <span className="hero-card__date">{formatDisplayDate(event.date)}</span>
          <span className="hero-card__encouragement">
            {event.daysRemaining === 0 ? 'Danes je ta dan!' : 'Še malo, pa bo tu'}
          </span>
        </div>

        <div className="hero-card__progress-row">
          <div
            className="hero-progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="hero-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <button
            type="button"
            className="hero-card__action-circle"
            onClick={() => onEdit(event)}
            title="Uredi glavni dogodek"
            aria-label={`Uredi ${event.title}`}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </article>
  );
}
