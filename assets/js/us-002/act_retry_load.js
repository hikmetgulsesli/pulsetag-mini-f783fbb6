/**
 * US-002 Action: ACT_RETRY_LOAD
 *
 * Handles clicks on elements with data-action-id="ACT_RETRY_LOAD" by asking
 * the storage adapter to reload the fixture data while preserving any
 * recoverable state.
 */
(function () {
  'use strict';

  function getStateApi() {
    return window.PulseTagMiniState;
  }

  function getStorageApi() {
    return window.PulseTagMiniStorage;
  }

  function onClick(e) {
    const trigger = e.target.closest('[data-action-id="ACT_RETRY_LOAD"]');
    if (!trigger) return;
    e.preventDefault();
    const stateApi = getStateApi();
    const storageApi = getStorageApi();
    if (!stateApi || !storageApi) return;
    storageApi.load(stateApi, 'assets/data/pulsetag-mini.json');
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
