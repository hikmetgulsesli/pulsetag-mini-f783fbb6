/**
 * US-002 action: ACT_SEARCH_RECORDS
 *
 * Handles the operations search input by updating the shared search query.
 */
(function () {
  'use strict';

  function init() {
    document.body.addEventListener('input', function (e) {
      if (e.target.getAttribute('data-action-id') === 'ACT_SEARCH_RECORDS') {
        const stateApi = window.PulseTagMiniState;
        if (!stateApi) return;
        stateApi.setSearchQuery(e.target.value);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
