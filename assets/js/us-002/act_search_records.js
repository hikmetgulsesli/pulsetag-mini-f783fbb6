/**
 * US-002 Action: ACT_SEARCH_RECORDS
 *
 * Wires search inputs with data-action-id="ACT_SEARCH_RECORDS" to the shared
 * app state so the visible result set updates as the user types.
 */
(function () {
  'use strict';

  function getStateApi() {
    return window.PulseTagMiniState;
  }

  function onInput(e) {
    const input = e.target.closest('[data-action-id="ACT_SEARCH_RECORDS"]');
    if (!input) return;
    const stateApi = getStateApi();
    if (!stateApi) return;
    stateApi.setSearchQuery(input.value);
  }

  function init() {
    document.addEventListener('input', onInput);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
