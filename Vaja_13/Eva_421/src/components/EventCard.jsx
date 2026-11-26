import React from 'react';
import { formatDisplayDate, formatCardCountdown } from '../utils/dateUtils.js';
import { PinIcon, EditIcon, TrashIcon } from './Icons.jsx';

export default function EventCard({ event, isPinned, onTogglePin, onEdit, onDelete }) {
  return (
    <article className={`moment-card theme-${event.color}`}>
      <div>
        <div className="moment-card__top">
          <div className="moment-card__icon-box" aria-hidden="true">
            {event.emoji || '📅'}
          </div>

          <div className="moment-card__actions">
            <button
              type="button"
              className={`moment-action-btn ${isPinned ? 'is-pinned' : ''}`}
              onClick={() => onTogglePin(event.id)}
              title={isPinned ? 'Odpni z vrha' : 'Pripni kot glavni odštevalnik'}
              aria-label={isPinned ? 'Odpni dogodek' : 'Pripni dogodek'}
            >
              <PinIcon filled={isPinned} />
            </button>

            <button
              type="button"
              className="moment-action-btn"
              onClick={() => onEdit(event)}
              title="Uredi dogodek"
              aria-label={`Uredi ${event.title}`}
            >
              <EditIcon />
            </button>

            <button
              type="button"
              className="moment-action-btn"
              onClick={() => onDelete(event.id)}
              title="Izbriši dogodek"
              aria-label={`Izbriši ${event.title}`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <h3 className="moment-card__title">{event.title}</h3>
        {event.subtitle && <p className="moment-card__subtitle">{event.subtitle}</p>}
      </div>

      <div className="moment-card__footer">
        <span className="moment-card__countdown">{formatCardCountdown(event.daysRemaining)}</span>
        <span className="moment-card__date">{formatDisplayDate(event.date)}</span>
      </div>
    </article>
  );
}
