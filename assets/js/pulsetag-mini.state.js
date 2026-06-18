/**
 * PulseTag Mini — shared application state.
 *
 * Owns app shell state, navigation state, selected entity, storage status,
 * last error, active panel, and item counts. Exposes a deterministic
 * `window.app` surface for tests and the test bridge.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'pulsetag.mini.state.v1';

  const STATUS_ORDER = ['active', 'warn', 'fail'];

  const SURFACES = {
    OPERATIONS: 'SURF_FOUR_OPERATIONS',
    EDITOR: 'SURF_FOUR_EDITOR',
    INSIGHTS: 'SURF_INSIGHTS'
  };

  const PANELS = {
    OPERATIONS: 'operations',
    EDITOR: 'editor',
    INSIGHTS: 'insights'
  };

  const DEFAULT_STATE = {
    activeSurface: SURFACES.OPERATIONS,
    activePanel: PANELS.OPERATIONS,
    tags: [],
    events: [],
    preferences: {
      activePanel: PANELS.OPERATIONS,
      filter: 'all',
      searchQuery: ''
    },
    selectedTagId: null,
    editingTagId: null,
    storageStatus: 'empty',
    lastError: null,
    counts: {
      total: 0,
      active: 0,
      warn: 0,
      fail: 0
    },
    filter: 'all',
    searchQuery: ''
  };

  let state = structuredClone ? structuredClone(DEFAULT_STATE) : JSON.parse(JSON.stringify(DEFAULT_STATE));
  const listeners = [];

  function generateId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function computeCounts(tags) {
    return {
      total: tags.length,
      active: tags.filter((t) => t.status === 'active').length,
      warn: tags.filter((t) => t.status === 'warn').length,
      fail: tags.filter((t) => t.status === 'fail').length
    };
  }

  function emit(reason) {
    state.counts = computeCounts(state.tags);
    listeners.forEach((fn) => {
      try {
        fn(state, reason);
      } catch (err) {
        // eslint-disable-next-line no-console
        if (typeof console !== 'undefined') console.error('State listener error', err);
      }
    });
  }

  function setLastError(error) {
    state.lastError = error ? { message: String(error.message || error), at: new Date().toISOString() } : null;
  }

  function clearLastError() {
    state.lastError = null;
  }

  function loadFromData(data) {
    state.tags = Array.isArray(data.tags) ? data.tags : [];
    state.events = Array.isArray(data.events) ? data.events : [];
    state.preferences = data.preferences || { activePanel: PANELS.OPERATIONS, filter: 'all', searchQuery: '' };
    state.activePanel = state.preferences.activePanel || PANELS.OPERATIONS;
    state.filter = state.preferences.filter || 'all';
    state.searchQuery = state.preferences.searchQuery || '';
    state.selectedTagId = null;
    state.editingTagId = null;
    state.storageStatus = 'loaded';
    state.counts = computeCounts(state.tags);
    setLastError(null);
    emit('load');
  }

  function bootstrap(tags, events, preferences) {
    clearLastError();
    loadFromData({ tags: tags || [], events: events || [], preferences: preferences || {} });
    state.activeSurface = SURFACES.OPERATIONS;
    state.activePanel = PANELS.OPERATIONS;
    emit('bootstrap');
  }

  function navigateTo(surfaceId) {
    if (!Object.values(SURFACES).includes(surfaceId)) {
      setLastError(new Error(`Unknown surface: ${surfaceId}`));
      emit('error');
      return;
    }
    state.activeSurface = surfaceId;
    state.activePanel =
      surfaceId === SURFACES.EDITOR ? PANELS.EDITOR : surfaceId === SURFACES.INSIGHTS ? PANELS.INSIGHTS : PANELS.OPERATIONS;
    state.preferences.activePanel = state.activePanel;
    clearLastError();
    emit('navigate');
  }

  function selectTag(tagId) {
    state.selectedTagId = tagId;
    state.editingTagId = tagId;
    clearLastError();
    emit('select');
  }

  function createTag(overrides) {
    const tag = {
      id: generateId('tag'),
      name: '',
      status: 'active',
      note: '',
      ...(overrides || {})
    };
    state.tags.push(tag);
    state.events.unshift({
      id: generateId('evt'),
      tagId: tag.id,
      type: 'created',
      message: `Created ${tag.name || 'new tag'}`,
      timestamp: new Date().toISOString()
    });
    state.selectedTagId = tag.id;
    state.editingTagId = tag.id;
    clearLastError();
    emit('create');
    return tag;
  }

  function updateTag(tagId, patch) {
    const idx = state.tags.findIndex((t) => t.id === tagId);
    if (idx === -1) {
      setLastError(new Error(`Tag not found: ${tagId}`));
      emit('error');
      return null;
    }
    const previous = state.tags[idx].status;
    state.tags[idx] = { ...state.tags[idx], ...patch };
    if (patch.status && patch.status !== previous) {
      state.events.unshift({
        id: generateId('evt'),
        tagId: tagId,
        type: 'status_changed',
        message: `${state.tags[idx].name || tagId} set to ${patch.status}`,
        timestamp: new Date().toISOString()
      });
    }
    clearLastError();
    emit('update');
    return state.tags[idx];
  }

  function deleteTag(tagId) {
    const before = state.tags.length;
    state.tags = state.tags.filter((t) => t.id !== tagId);
    if (state.tags.length === before) {
      setLastError(new Error(`Tag not found: ${tagId}`));
      emit('error');
      return false;
    }
    state.events.unshift({
      id: generateId('evt'),
      tagId: tagId,
      type: 'deleted',
      message: `Deleted ${tagId}`,
      timestamp: new Date().toISOString()
    });
    if (state.selectedTagId === tagId) state.selectedTagId = null;
    if (state.editingTagId === tagId) state.editingTagId = null;
    clearLastError();
    emit('delete');
    return true;
  }

  function setFilter(filterValue) {
    state.filter = filterValue;
    state.preferences.filter = filterValue;
    emit('filter');
  }

  function setSearchQuery(query) {
    state.searchQuery = String(query || '').trim();
    state.preferences.searchQuery = state.searchQuery;
    emit('search');
  }

  function setStorageStatus(status) {
    state.storageStatus = status;
    emit('storage');
  }

  function filteredTags() {
    let tags = state.tags;
    if (state.filter && state.filter !== 'all') {
      tags = tags.filter((t) => t.status === state.filter);
    }
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      tags = tags.filter((t) => (t.name || '').toLowerCase().includes(q) || (t.note || '').toLowerCase().includes(q));
    }
    return tags;
  }

  function exportPayload() {
    return {
      exportedAt: new Date().toISOString(),
      activeSurface: state.activeSurface,
      activePanel: state.activePanel,
      selectedTagId: state.selectedTagId,
      counts: state.counts,
      storageStatus: state.storageStatus,
      lastError: state.lastError,
      tags: state.tags,
      events: state.events,
      preferences: state.preferences
    };
  }

  function subscribe(fn) {
    listeners.push(fn);
    return function unsubscribe() {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  function getSerializableState() {
    return {
      tags: state.tags,
      events: state.events,
      preferences: state.preferences
    };
  }

  window.PulseTagMiniState = {
    SURFACES,
    PANELS,
    STORAGE_KEY,
    bootstrap,
    loadFromData,
    navigateTo,
    selectTag,
    createTag,
    updateTag,
    deleteTag,
    setFilter,
    setSearchQuery,
    setStorageStatus,
    setLastError,
    clearLastError,
    filteredTags,
    exportPayload,
    subscribe,
    getState,
    getSerializableState,
    computeCounts
  };

  window.app = {
    schema: 'pulsetag-mini.app.v1',
    get state() {
      return getState();
    },
    actions: {
      navigate: navigateTo,
      selectTag,
      createTag,
      updateTag,
      deleteTag,
      setFilter,
      setSearchQuery,
      exportPayload,
      bootstrap
    },
    SURFACES,
    PANELS,
    subscribe
  };
})();
