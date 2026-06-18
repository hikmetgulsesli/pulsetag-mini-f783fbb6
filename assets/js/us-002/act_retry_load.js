/**
 * US-002 action: ACT_RETRY_LOAD
 *
 * Handles the Retry Load button by reloading the fixture data into shared state.
 */
(function () {
  'use strict';

  function init() {
    document.body.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action-id="ACT_RETRY_LOAD"]');
      if (!target) return;
      e.preventDefault();

      const stateApi = window.PulseTagMiniState;
      const storageApi = window.PulseTagMiniStorage;
      if (!stateApi || !storageApi) return;

      storageApi.load(stateApi, 'assets/data/pulsetag-mini.json');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
