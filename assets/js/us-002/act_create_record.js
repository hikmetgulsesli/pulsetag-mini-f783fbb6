/**
 * US-002 action: ACT_CREATE_RECORD
 *
 * Handles the Create New Tag button by starting a new tag edit session and
 * navigating to the editor page.
 */
(function () {
  'use strict';

  function init() {
    document.body.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action-id="ACT_CREATE_RECORD"]');
      if (!target) return;
      e.preventDefault();

      const stateApi = window.PulseTagMiniState;
      const storageApi = window.PulseTagMiniStorage;
      if (!stateApi) return;

      // Passing null clears both selectedTagId and editingTagId so the editor
      // starts a new tag session instead of loading a previously edited tag.
      stateApi.selectTag(null);
      if (storageApi) storageApi.save(stateApi);
      window.location.href = 'four-editor-pulsetag-mini.html';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
