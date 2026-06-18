/**
 * US-002 Action: ACT_SAVE_RECORD
 *
 * Handles form submission for the editor surface. Validates required fields,
 * persists the tag, and returns to the operations surface on success.
 */
(function () {
  'use strict';

  function getStateApi() {
    return window.PulseTagMiniState;
  }

  function getStorageApi() {
    return window.PulseTagMiniStorage;
  }

  function debouncedSave() {
    const storageApi = getStorageApi();
    const stateApi = getStateApi();
    if (storageApi && stateApi) storageApi.save(stateApi);
  }

  function onSubmit(e) {
    const form = e.target.closest('[data-testid="editor-form"], form');
    if (!form) return;
    const saveTrigger = form.querySelector('[data-action-id="ACT_SAVE_RECORD"]');
    if (!saveTrigger) return;
    e.preventDefault();

    const stateApi = getStateApi();
    if (!stateApi) return;

    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    if (!name) {
      stateApi.setLastError(new Error('Name is required.'));
      return;
    }

    const tagData = {
      name: name,
      note: String(fd.get('details') || '').trim() || String(fd.get('note') || '').trim(),
      status: String(fd.get('status') || 'active')
    };

    const state = stateApi.getState();
    const isNew = state.editingTagId === null;
    const existingTag = state.tags.find((t) => t.id === state.editingTagId);

    if (isNew) {
      stateApi.createTag(tagData);
    } else if (existingTag) {
      stateApi.updateTag(state.editingTagId, tagData);
    } else {
      stateApi.setLastError(new Error('The record being edited no longer exists.'));
      return;
    }

    debouncedSave();
    stateApi.navigateTo(stateApi.SURFACES.OPERATIONS);
  }

  function onClick(e) {
    const trigger = e.target.closest('[data-action-id="ACT_SAVE_RECORD"]');
    if (!trigger) return;
    const form = trigger.closest('form');
    if (!form) return;
    e.preventDefault();
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  function init() {
    document.addEventListener('submit', onSubmit);
    document.addEventListener('click', onClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
