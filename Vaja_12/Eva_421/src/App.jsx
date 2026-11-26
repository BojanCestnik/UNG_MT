import React, { useState, useEffect, useMemo } from 'react';
import {
  parseLocalDate,
  getTodayLocal,
  toISODateString,
  getCalendarDaysDiff
} from './utils/dateUtils.js';
import { loadState, saveState } from './utils/storage.js';
import PinnedCard from './components/PinnedCard.jsx';
import EventCard from './components/EventCard.jsx';
import DateCalculator from './components/DateCalculator.jsx';
import PastEventsList from './components/PastEventsList.jsx';
import EventModal from './components/EventModal.jsx';

export default function App() {
  const [appState, setAppState] = useState(() => loadState());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Trajno shranjevanje ob vsaki spremembi stanja
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  // Razdelitev dogodkov na prihajajoče in pretekle ter razvrščanje
  const { upcomingEvents, pastEvents, pinnedEvent } = useMemo(() => {
    const today = getTodayLocal();
    const upcoming = [];
    const past = [];

    for (const ev of appState.events) {
      const targetDate = parseLocalDate(ev.date);
      if (!targetDate) continue;

      const diff = getCalendarDaysDiff(today, targetDate);
      if (diff >= 0) {
        upcoming.push({ ...ev, daysRemaining: diff });
      } else {
        past.push({ ...ev, daysAgo: Math.abs(diff) });
      }
    }

    // Razvrščanje prihajajočih dogodkov
    if (appState.sortMode === 'category') {
      upcoming.sort((a, b) => {
        const catCompare = (a.category || '').localeCompare(b.category || '', 'sl');
        return catCompare !== 0 ? catCompare : a.daysRemaining - b.daysRemaining;
      });
    } else if (appState.sortMode === 'recent') {
      upcoming.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else {
      // Privzeto: Najbližje (po najbližjem datumu)
      upcoming.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }

    // Pretekli dogodki: od najbolj nedavnega naprej
    past.sort((a, b) => a.daysAgo - b.daysAgo);

    const pinned = upcoming.find((ev) => ev.id === appState.pinnedEventId) || null;

    return {
      upcomingEvents: upcoming,
      pastEvents: past,
      pinnedEvent: pinned
    };
  }, [appState.events, appState.pinnedEventId, appState.sortMode]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleSaveEvent = (formData) => {
    setAppState((prev) => {
      if (formData.id) {
        const updatedEvents = prev.events.map((ev) =>
          ev.id === formData.id
            ? {
                ...ev,
                title: formData.title,
                subtitle: formData.subtitle,
                category: formData.category,
                date: formData.date,
                emoji: formData.emoji,
                color: formData.color
              }
            : ev
        );

        let nextPinned = prev.pinnedEventId;
        if (formData.pinOnTop) {
          nextPinned = formData.id;
        } else if (prev.pinnedEventId === formData.id) {
          nextPinned = null;
        }

        return {
          ...prev,
          events: updatedEvents,
          pinnedEventId: nextPinned
        };
      }

      const newId = `evt-${Date.now()}`;
      const newEvent = {
        id: newId,
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        date: formData.date,
        emoji: formData.emoji,
        color: formData.color,
        createdAt: toISODateString(getTodayLocal())
      };

      return {
        ...prev,
        events: [...prev.events, newEvent],
        pinnedEventId: formData.pinOnTop ? newId : prev.pinnedEventId
      };
    });

    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleTogglePin = (eventId) => {
    setAppState((prev) => ({
      ...prev,
      pinnedEventId: prev.pinnedEventId === eventId ? null : eventId
    }));
  };

  const handleUnpin = () => {
    setAppState((prev) => ({
      ...prev,
      pinnedEventId: null
    }));
  };

  const handleDeleteEvent = (eventId) => {
    setAppState((prev) => ({
      ...prev,
      events: prev.events.filter((ev) => ev.id !== eventId),
      pinnedEventId: prev.pinnedEventId === eventId ? null : prev.pinnedEventId
    }));
  };

  const handleSortChange = (mode) => {
    setAppState((prev) => ({
      ...prev,
      sortMode: mode
    }));
  };

  const handleCalculatorChange = (nextCalc) => {
    setAppState((prev) => ({
      ...prev,
      calculator: nextCalc
    }));
  };

  return (
    <>
      {/* Zgornja navigacijska vrstica v slogu zasnove */}
      <header className="topbar">
        <div className="topbar__inner">
          <a href="#domov" className="brand">
            Odštevalnik
          </a>

          <nav className="nav" aria-label="Glavna navigacija">
            <a href="#domov" className="nav__link">
              Domov
            </a>
            <a href="#dogodki" className="nav__link">
              Prihajajoče
            </a>
            <a href="#kalkulator" className="nav__link">
              Kalkulator
            </a>
            <a href="#pretekli" className="nav__link">
              Preteklo
            </a>
          </nav>
        </div>
      </header>

      <main className="container">
        {/* Pozdravni uvod */}
        <section className="intro" id="domov">
          <h1 className="intro__title">Pozdravljeni! 👋</h1>
          <p className="intro__subtitle">Tvoji pomembni trenutki so na dosegu roke.</p>
        </section>

        {/* 1. Pripet glavni odštevalnik */}
        <section className="section" aria-label="Glavni pripeti odštevalnik">
          <PinnedCard event={pinnedEvent} onUnpin={handleUnpin} onEdit={handleOpenEdit} />
        </section>

        {/* 2. Filter gumbi in mreža prihajajočih dogodkov */}
        <section className="section" id="dogodki" aria-labelledby="upcoming-heading">
          <div className="section__toolbar">
            <div className="filter-pills" role="group" aria-label="Razvrščanje dogodkov">
              <button
                type="button"
                className={`pill-btn ${appState.sortMode === 'nearest' ? 'is-active' : ''}`}
                onClick={() => handleSortChange('nearest')}
              >
                Najbližje
              </button>
              <button
                type="button"
                className={`pill-btn ${appState.sortMode === 'category' ? 'is-active' : ''}`}
                onClick={() => handleSortChange('category')}
              >
                Kategorija
              </button>
              <button
                type="button"
                className={`pill-btn ${appState.sortMode === 'recent' ? 'is-active' : ''}`}
                onClick={() => handleSortChange('recent')}
              >
                Nedavno dodano
              </button>
            </div>

            <button type="button" className="btn btn--primary btn--sm" onClick={handleOpenCreate}>
              + Nov dogodek
            </button>
          </div>

          <h2 id="upcoming-heading" className="sr-only">
            Prihajajoči dogodki
          </h2>

          {upcomingEvents.length === 0 ? (
            <div className="empty-state">
              <p>Nimaš še shranjenih prihajajočih dogodkov.</p>
              <button type="button" className="btn btn--primary" onClick={handleOpenCreate}>
                + Dodaj prvi dogodek
              </button>
            </div>
          ) : (
            <div className="events-grid">
              {upcomingEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isPinned={ev.id === appState.pinnedEventId}
                  onTogglePin={handleTogglePin}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. Kalkulator razlike med datumoma */}
        <DateCalculator calculator={appState.calculator} onChange={handleCalculatorChange} />

        {/* 4. Pretekli dogodki */}
        <section className="section" id="pretekli" aria-labelledby="past-heading">
          <div className="section__header">
            <h2 id="past-heading" className="section__title">
              Pretekli dogodki
            </h2>
          </div>
          <PastEventsList events={pastEvents} onDelete={handleDeleteEvent} />
        </section>
      </main>

      {/* Plavajoči gumb (+) */}
      <button
        type="button"
        className="fab"
        onClick={handleOpenCreate}
        aria-label="Dodaj nov dogodek"
        title="Dodaj nov dogodek"
      >
        +
      </button>

      {/* Modalno okno za dodajanje/urejanje */}
      <EventModal
        isOpen={modalOpen}
        editingEvent={editingEvent}
        isPinnedDefault={
          editingEvent
            ? editingEvent.id === appState.pinnedEventId
            : appState.pinnedEventId === null
        }
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
      />
    </>
  );
}
