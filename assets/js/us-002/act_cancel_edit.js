/**
 * US-002 Action: ACT_CANCEL_EDIT
 *
 * Handles clicks on elements with data-action-id="ACT_CANCEL_EDIT" by closing
 * the editor and returning to the operations surface without persisting, or by
 * clearing the inline selection on the operations surface.
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

    const isEditorPage = /four-editor-pulsetag-mini\.html/.test(window.location.pathname);
    if (isEditorPage) {
      stateApi.navigateTo(stateApi.SURFACES.OPERATIONS);
      const storageApi = window.PulseTagMiniStorage;
      if (storageApi) {
        storageApi.save(stateApi);
      }
      window.location.href = 'four-operations-pulsetag-mini.html';
      return;
    }

    stateApi.selectTag(null);
    const storageApi = window.PulseTagMiniStorage;
    if (storageApi) {
      storageApi.save(stateApi);
    }
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
