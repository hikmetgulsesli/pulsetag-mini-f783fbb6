/**
 * US-002 Action: ACT_CANCEL_EDIT
 *
 * Handles clicks on elements with data-action-id="ACT_CANCEL_EDIT" by closing
 * the editor and returning to the operations surface without persisting.
 */
(function () {
  'use strict';

  function getStateApi() {
    return window.PulseTagMiniState;
  }

  function onClick(e) {
    const trigger = e.target.closest('[data-action-id="ACT_CANCEL_EDIT"]');
    if (!trigger) return;
    e.preventDefault();
    const stateApi = getStateApi();
    if (!stateApi) return;
    stateApi.navigateTo(stateApi.SURFACES.OPERATIONS);
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
