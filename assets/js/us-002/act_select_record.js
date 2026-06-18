/**
 * US-002 Action: ACT_SELECT_RECORD
 *
 * Handles selection of an existing record. The action looks for a tag-id
 * identifier on the triggering element or an ancestor row, selects it in
 * shared state, and surfaces the inline editor on the operations screen.
 */
(function () {
  'use strict';

  function getStateApi() {
    return window.PulseTagMiniState;
  }

  function findTagId(trigger) {
    if (trigger.dataset.tagId) return trigger.dataset.tagId;
    const row = trigger.closest('[data-tag-id]');
    return row ? row.dataset.tagId : null;
  }

  function onClick(e) {
    const trigger = e.target.closest('[data-action-id="ACT_SELECT_RECORD"]');
    if (!trigger) return;
    e.preventDefault();
    e.stopPropagation();
    const stateApi = getStateApi();
    if (!stateApi) return;
    const tagId = findTagId(trigger);
    if (!tagId) {
      stateApi.setLastError(new Error('No record identifier found for selection.'));
      return;
    }
    stateApi.selectTag(tagId);
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
