/**
 * US-002 Action: ACT_SAVE_RECORD
 *
 * Handles form submission for the editor surface and the operations inline
 * editor. Validates required fields, persists the tag, and returns to the
 * operations surface on the full editor or clears selection inline.
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
    const form = e.target.closest('[data-testid="editor-form"], [data-testid="inline-editor-form"], form');
    if (!form) return;
    const saveTrigger = form.querySelector('[data-action-id="ACT_SAVE_RECORD"]');
    if (!saveTrigger) return;
    e.preventDefault();

    const stateApi = getStateApi();
    if (!stateApi) return;

    const isInline = form.dataset.testid === 'inline-editor-form';
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    if (!name) {
      stateApi.setLastError(new Error('Name is required.'));
      return;
    }

    if (isInline) {
      const state = stateApi.getState();
      const selectedId = state.selectedTagId;
      const selectedTag = state.tags.find((t) => t.id === selectedId);
      if (!selectedTag) {
        stateApi.setLastError(new Error('No record selected for inline edit.'));
        return;
      }
      stateApi.updateTag(selectedId, {
        name: name,
        status: String(fd.get('status') || 'active')
      });
      stateApi.selectTag(null);
      debouncedSave();
      return;
    }

    const tagData = {
      name: name,
      code: String(fd.get('code') || '').trim(),
      note: String(fd.get('note') || '').trim(),
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
    window.location.href = 'four-operations-pulsetag-mini.html';
  }

  function init() {
    document.addEventListener('submit', onSubmit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
