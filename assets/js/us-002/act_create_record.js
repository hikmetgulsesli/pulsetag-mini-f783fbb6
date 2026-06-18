/**
 * US-002 Action: ACT_CREATE_RECORD
 *
 * Handles clicks on elements with data-action-id="ACT_CREATE_RECORD" by
 * clearing the selected tag and opening the editor surface.
 */
(function () {
  'use strict';

  function getStateApi() {
    return window.PulseTagMiniState;
  }

  function onClick(e) {
    const trigger = e.target.closest('[data-action-id="ACT_CREATE_RECORD"]');
    if (!trigger) return;
    e.preventDefault();
    const stateApi = getStateApi();
    if (!stateApi) return;
    stateApi.selectTag(null);
    stateApi.navigateTo(stateApi.SURFACES.EDITOR);
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
