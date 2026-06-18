/**
 * US-002 action: ACT_SAVE_RECORD
 *
 * Handles the editor Save Changes button / form submit. Validates the form,
 * creates a new tag or updates the existing one, persists state, and returns
 * to the operations page.
 */
(function () {
  'use strict';

  function saveRecord(form) {
    const stateApi = window.PulseTagMiniState;
    const storageApi = window.PulseTagMiniStorage;
    if (!stateApi || !storageApi) return;

    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    if (!name) {
      stateApi.setLastError(new Error('Name is required.'));
      return false;
    }

    const tagData = {
      name: name,
      note: String(fd.get('note') || '').trim(),
      details: String(fd.get('details') || '').trim(),
      status: String(fd.get('status') || 'active')
    };

    const state = stateApi.getState();
    const isNew = state.editingTagId === null;
    if (isNew) {
      stateApi.createTag(tagData);
    } else {
      stateApi.updateTag(state.editingTagId, tagData);
    }

    storageApi.save(stateApi);
    window.location.href = 'four-operations-pulsetag-mini.html';
    return true;
  }

  function init() {
    document.body.addEventListener('submit', function (e) {
      const submitter = e.submitter;
      const action = submitter && submitter.getAttribute('data-action-id');
      const formAction = e.target.getAttribute('data-action-id');
      if (action === 'ACT_SAVE_RECORD' || formAction === 'ACT_SAVE_RECORD') {
        e.preventDefault();
        saveRecord(e.target);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
