import React, { useState, useEffect } from 'react';
import { getTodayLocal, toISODateString, parseLocalDate } from '../utils/dateUtils.js';
import { VALID_COLORS } from '../utils/storage.js';

const EMOJI_PRESETS = ['🏖️', '🎓', '🎂', '🎄', '✈️', '🎯', '💼'];

export default function EventModal({ isOpen, editingEvent, isPinnedDefault, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Osebno');
  const [date, setDate] = useState(toISODateString(getTodayLocal()));
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState('peach');
  const [pinOnTop, setPinOnTop] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingEvent) {
      setTitle(editingEvent.title || '');
      setSubtitle(editingEvent.subtitle || '');
      setCategory(editingEvent.category || 'Osebno');
      setDate(editingEvent.date || toISODateString(getTodayLocal()));
      setEmoji(editingEvent.emoji || '');
      setColor(editingEvent.color || 'peach');
      setPinOnTop(isPinnedDefault);
    } else {
      setTitle('');
      setSubtitle('');
      setCategory('Osebno');
      setDate(toISODateString(getTodayLocal()));
      setEmoji('');
      setColor('peach');
      setPinOnTop(isPinnedDefault);
    }
  }, [isOpen, editingEvent, isPinnedDefault]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !parseLocalDate(date)) return;

    onSave({
      id: editingEvent ? editingEvent.id : null,
      title: trimmedTitle,
      subtitle: subtitle.trim(),
      category: category.trim() || 'Splošno',
      date,
      emoji: emoji.trim(),
      color,
      pinOnTop
    });
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <form onSubmit={handleSubmit} className="modal__form">
          <div className="modal__header">
            <h3 id="modal-title">{editingEvent ? 'Uredi dogodek' : 'Nov dogodek'}</h3>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Zapri">
              ✕
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="event-title">Ime dogodka *</label>
            <input
              type="text"
              id="event-title"
              placeholder="npr. Počitnice, Izpit, Rojstni dan..."
              maxLength={60}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event-subtitle">Opis (opcijsko)</label>
              <input
                type="text"
                id="event-subtitle"
                placeholder="npr. Izpit iz matematike"
                maxLength={80}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-category">Kategorija</label>
              <input
                type="text"
                id="event-category"
                placeholder="npr. Študij, Osebno"
                maxLength={30}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row form-row--date-emoji">
            <div className="form-group">
              <label htmlFor="event-date">Datum dogodka *</label>
              <input
                type="date"
                id="event-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-emoji">Emoji</label>
              <input
                type="text"
                id="event-emoji"
                placeholder="🏖️"
                maxLength={4}
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
              />
            </div>
          </div>

          <div className="emoji-presets" aria-label="Hitra izbira ikone">
            {EMOJI_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className="emoji-chip"
                onClick={() => setEmoji(preset)}
              >
                {preset}
              </button>
            ))}
            <button type="button" className="emoji-chip" onClick={() => setEmoji('')}>
              Brez
            </button>
          </div>

          <div className="form-group">
            <span className="field-label">Barvna oznaka</span>
            <div className="color-picker" role="radiogroup" aria-label="Barva kartice">
              {VALID_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${color === c ? 'is-selected' : ''}`}
                  data-color={c}
                  aria-label={`Barva ${c}`}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={pinOnTop}
              onChange={(e) => setPinOnTop(e.target.checked)}
            />
            <span>Pripni kot glavni odštevalnik na vrhu</span>
          </label>

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Prekliči
            </button>
            <button type="submit" className="btn btn--primary">
              Shrani dogodek
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
