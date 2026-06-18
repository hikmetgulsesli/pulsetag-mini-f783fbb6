/**
 * US-003 Action: ACT_EXPORT_SUMMARY
 *
 * Handles clicks on elements with data-action-id="ACT_EXPORT_SUMMARY" by
 * exporting the current application state as a downloadable JSON file.
 */
(function () {
  'use strict';

  function getStateApi() {
    return window.PulseTagMiniState;
  }

  function exportSummary() {
    const stateApi = getStateApi();
    if (!stateApi) return;

    const payload = stateApi.exportPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pulsetag-mini-' + Date.now() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function onClick(e) {
    const trigger = e.target.closest('[data-action-id="ACT_EXPORT_SUMMARY"]');
    if (!trigger) return;
    e.preventDefault();
    exportSummary();
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
