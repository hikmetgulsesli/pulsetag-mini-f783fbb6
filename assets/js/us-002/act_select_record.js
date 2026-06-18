/**
 * US-002 action: ACT_SELECT_RECORD
 *
 * Handles per-row edit buttons in the operations list by selecting the tag and
 * navigating to the editor page.
 */
(function () {
  'use strict';

  function init() {
    document.body.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action-id="ACT_SELECT_RECORD"]');
      if (!target) return;
      e.preventDefault();

      const stateApi = window.PulseTagMiniState;
      const storageApi = window.PulseTagMiniStorage;
      if (!stateApi) return;

      const row = target.closest('[data-tag-id]');
      const tagId = row ? row.getAttribute('data-tag-id') : null;
      if (!tagId) return;

      // PulseTagMiniState.selectTag updates both selectedTagId and editingTagId,
      // which is what the editor page reads to load the tag being edited.
      stateApi.selectTag(tagId);
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
