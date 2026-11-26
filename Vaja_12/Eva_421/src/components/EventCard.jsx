import React from 'react';
import { formatDisplayDate, formatHeroCountdown } from '../utils/dateUtils.js';

export default function EventCard({ event, isPinned, onTogglePin, onEdit, onDelete }) {
  return (
    <article className={`event-card theme-${event.color}`}>
      <div>
        <div className="event-card__header">
          <div className="event-card__title-wrap">
            {event.emoji && (
              <span className="event-card__emoji" aria-hidden="true">
                {event.emoji}
              </span>
            )}
            <h3 className="event-card__title">{event.title}</h3>
          </div>

          <div className="event-card__actions">
            <button
              type="button"
              className={`card-action-btn ${isPinned ? 'is-pinned' : ''}`}
              onClick={() => onTogglePin(event.id)}
              title={isPinned ? 'Trenutno pripeto' : 'Pripni na vrh'}
            >
              {isPinned ? 'Pripeto' : 'Pripni'}
            </button>
            <button
              type="button"
              className="card-action-btn"
              onClick={() => onEdit(event)}
              title="Uredi dogodek"
              aria-label={`Uredi ${event.title}`}
            >
              ✎
            </button>
            <button
              type="button"
              className="card-action-btn"
              onClick={() => onDelete(event.id)}
              title="Izbriši dogodek"
              aria-label={`Izbriši ${event.title}`}
            >
              ✕
            </button>
          </div>
        </div>

        {event.subtitle && <p className="event-card__subtitle">{event.subtitle}</p>}
      </div>

      <div className="event-card__body">
        <div className="event-card__days">{formatHeroCountdown(event.daysRemaining)}</div>
        <div className="event-card__footer-row">
          <span className="event-card__date">{formatDisplayDate(event.date)}</span>
          {event.category && <span className="event-card__category">{event.category}</span>}
        </div>
      </div>
    </article>
  );
}
