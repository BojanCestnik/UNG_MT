import React, { useState, useEffect, useMemo } from 'react';
import {
  parseLocalDate,
  getTodayLocal,
  toISODateString,
  getCalendarDaysDiff
} from './utils/dateUtils.js';
import { loadState, saveState } from './utils/storage.js';
import {
  BrandCalendarIcon,
  HomeIcon,
  CalculatorIcon,
  SparkleIcon,
  ClockIcon
} from './components/Icons.jsx';
import PinnedCard from './components/PinnedCard.jsx';
import EventCard from './components/EventCard.jsx';
import DateCalculator from './components/DateCalculator.jsx';
import PastEventsList from './components/PastEventsList.jsx';
import EventModal from './components/EventModal.jsx';

export default function App() {
  const [appState, setAppState] = useState(() => loadState());
  const [activeNav, setActiveNav] = useState('domov');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    saveState(appState);
  }, [appState]);

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

    if (appState.sortMode === 'recent') {
      upcoming.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else {
      upcoming.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }

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
        category: 'Osebno',
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
    <div className="app-shell">
      {/* Svetla zgornja navigacijska vrstica */}
      <header className="topbar">
        <div className="topbar__inner">
          <a
            href="#domov"
            className="brand"
            onClick={() => setActiveNav('domov')}
          >
            <span className="brand__badge" aria-hidden="true">
              <BrandCalendarIcon />
            </span>
            <span className="brand__name">Odštevalnik</span>
          </a>

          <nav className="top-nav" aria-label="Glavna navigacija">
            <a
              href="#domov"
              className={`top-nav__item ${activeNav === 'domov' ? 'is-active' : ''}`}
              onClick={() => setActiveNav('domov')}
            >
              <HomeIcon />
              <span>Domov</span>
            </a>

            <a
              href="#kalkulator"
              className={`top-nav__item ${activeNav === 'kalkulator' ? 'is-active' : ''}`}
              onClick={() => setActiveNav('kalkulator')}
            >
              <CalculatorIcon />
              <span>Kalkulator</span>
            </a>

            <button
              type="button"
              className="top-nav__item top-nav__item--btn"
              onClick={handleOpenCreate}
            >
              <SparkleIcon />
              <span>Ujemi trenutek</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        {/* Pozdravni uvod z nadnaslovom in desnim gumbom + Nov dogodek */}
        <section className="hero-header" id="domov">
          <div className="hero-header__text">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow__dot" aria-hidden="true" />
              <span>TVOJ PROSTOR ZA PRIČAKOVANJA</span>
            </div>
            <h1 className="hero-title">Živjo, lepo te je videti.</h1>
            <p className="hero-subtitle">Pomembni trenutki so na dosegu roke.</p>
          </div>

          <button
            type="button"
            className="btn btn--coral"
            onClick={handleOpenCreate}
          >
            + Nov dogodek
          </button>
        </section>

        {/* 1. Glavni pripeti odštevalnik */}
        <section className="section" aria-label="Glavni pripeti odštevalnik">
          <PinnedCard event={pinnedEvent} onEdit={handleOpenEdit} />
        </section>

        {/* 2. Prihajajoči trenutki (mreža 2x2) */}
        <section className="section" id="dogodki" aria-labelledby="upcoming-heading">
          <div className="section-eyebrow">TVOJI DOGODKI</div>

          <div className="section-bar">
            <div className="section-bar__left">
              <h2 id="upcoming-heading" className="section-heading">
                Prihajajoči trenutki
              </h2>
              <span className="count-badge">{upcomingEvents.length}</span>
            </div>

            <div className="segmented-control" role="group" aria-label="Razvrščanje dogodkov">
              <button
                type="button"
                className={`segment-btn ${appState.sortMode === 'nearest' ? 'is-active' : ''}`}
                onClick={() => handleSortChange('nearest')}
              >
                <ClockIcon />
                <span>Najbližje</span>
              </button>

              <button
                type="button"
                className={`segment-btn ${appState.sortMode === 'recent' ? 'is-active' : ''}`}
                onClick={() => handleSortChange('recent')}
              >
                <SparkleIcon />
                <span>Nedavno dodano</span>
              </button>
            </div>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="empty-state">
              <p>Nimaš še shranjenih prihajajočih dogodkov.</p>
              <button type="button" className="btn btn--coral" onClick={handleOpenCreate}>
                + Dodaj prvi dogodek
              </button>
            </div>
          ) : (
            <div className="moments-grid">
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
          <div className="section-eyebrow">ZGODOVINA</div>
          <div className="section-bar">
            <div className="section-bar__left">
              <h2 id="past-heading" className="section-heading">
                Pretekli dogodki
              </h2>
              <span className="count-badge">{pastEvents.length}</span>
            </div>
          </div>
          <PastEventsList events={pastEvents} onDelete={handleDeleteEvent} />
        </section>
      </main>

      {/* Plavajoči gumb (+) spodaj desno */}
      <button
        type="button"
        className="fab"
        onClick={handleOpenCreate}
        aria-label="Dodaj nov dogodek"
        title="Dodaj nov dogodek"
      >
        +
      </button>

      {/* Modalno okno za dodajanje/urejanje dogodka */}
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
    </div>
  );
}
