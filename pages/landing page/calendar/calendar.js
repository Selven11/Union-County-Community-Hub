
import { getEvents } from '../../../tile/data/items.js';
import { MONTHS } from './constants.js';
import { renderCalendarGrid, updateCalendarTitle } from './renderCalendar.js';
import { buildEventMap, getMonthEvents } from './eventData.js';
import { startTimer, stopTimer, pauseTimer } from './advance.js';
import { createEventCard, createPanelHeader, createEmptyMessage } from './templates.js';

export function initCalendar() {
  const eventMap = buildEventMap(getEvents());

  let yr = 2026;
  let mo = 3; 
  let eventIndex = 0;
  let selectedDay = null; 

  function render() {
    const grid  = document.getElementById('calGrid');
    const title = document.getElementById('calTitle');
    if (!grid) return;

    updateCalendarTitle(title, yr, mo);
    renderCalendarGrid(grid, yr, mo, eventMap, onDayClick);


    const today = new Date();
    const todayKey = (today.getFullYear() === yr && today.getMonth() === mo)
      ? `${yr}-${mo}-${today.getDate()}`
      : null;

    const firstEventKey = todayKey && eventMap[todayKey]
      ? todayKey
      : getMonthEvents(eventMap, yr, mo)[0] || null;

    if (firstEventKey) {
      selectedDay = firstEventKey;
      highlightDay(firstEventKey);
      renderDayPanel(firstEventKey);
    } else {
      selectedDay = null;
      renderDayPanel(`${yr}-${mo}-1`); 
    }

    startAutoAdvance();
  }

  function onDayClick(dateKey) {
    selectedDay = dateKey;
    highlightDay(dateKey);
    renderDayPanel(dateKey);
    pauseTimer();
  }

 
  function highlightDay(dateKey) {
    const grid = document.getElementById('calGrid');
    if (!grid) return;

    clearSelection(grid);

    const cell = grid.querySelector(`[data-date-key="${dateKey}"]`);
    if (!cell) return;

    cell.classList.add('selected');
  }

  function clearSelection(grid) {
    if (!grid) return;
    grid.querySelectorAll('.cal-day').forEach(cell => {
      cell.classList.remove('selected');
      cell.querySelector('.cal-event-popup')?.remove();
    });
  }


  function startAutoAdvance() {
    const keys = getMonthEvents(eventMap, yr, mo);
    if (!keys.length) return;


    eventIndex = selectedDay ? Math.max(keys.indexOf(selectedDay), 0) : 0;

    startTimer(() => {
      eventIndex = (eventIndex + 1) % keys.length;
      selectedDay = keys[eventIndex];
      highlightDay(selectedDay);
      renderDayPanel(selectedDay);
    });
  }



  function renderDayPanel(dateKey) {
    const panel = document.getElementById('eventsPanel');
    if (!panel) return;
    panel.innerHTML = '';

    const events = eventMap[dateKey] || [];
    const [, , day] = dateKey.split('-');
    const date = new Date(yr, mo, +day);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    panel.appendChild(createPanelHeader(dayName));

    if (!events.length) {
      panel.appendChild(createEmptyMessage());
      return;
    }

    const mon = MONTHS[mo].substring(0, 3);
    const dow = ['SUN','MON','TUE','WED','THU','FRI','SAT'][date.getDay()];

    events.forEach(ev => {
      panel.appendChild(createEventCard({
        month: mon, day, dow,
        cat: ev.cat, name: ev.name, desc: ev.desc, time: ev.time, loc: ev.loc,
      }));
    });
  }

  function navigate(dir) {
    stopTimer();
    mo += dir;
    if (mo < 0) { mo = 11; yr--; }
    if (mo > 11) { mo = 0; yr++; }
    render();
  }

  document.getElementById('prevMonth')?.addEventListener('click', () => navigate(-1));
  document.getElementById('nextMonth')?.addEventListener('click', () => navigate(1));

  render();
}
