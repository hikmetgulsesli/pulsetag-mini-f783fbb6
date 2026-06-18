/**
 * US-003 Action: ACT_FILTER_INSIGHTS
 *
 * Cycles the insights event filter across event types. Emits a custom event
 * so the insights surface can re-render the recent activity list.
 */
(function () {
  'use strict';

  const FILTERS = ['all', 'created', 'status_changed', 'deleted'];
  let currentFilter = 'all';

  function getStateApi() {
    return window.PulseTagMiniState;
  }

  function emitFilterChanged() {
    document.dispatchEvent(new CustomEvent('pulsetag:insights:filter', {
      detail: { filter: currentFilter },
      bubbles: true
    }));
  }

  function onClick(e) {
    const trigger = e.target.closest('[data-action-id="ACT_FILTER_INSIGHTS"]');
    if (!trigger) return;
    e.preventDefault();

    const idx = FILTERS.indexOf(currentFilter);
    currentFilter = FILTERS[(idx + 1) % FILTERS.length];
    emitFilterChanged();
  }

  function init() {
    document.addEventListener('click', onClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
