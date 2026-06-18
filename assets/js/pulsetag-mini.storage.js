/**
 * PulseTag Mini — localStorage persistence adapter.
 *
 * Persists tags, events, and preferences. Corrupted data surfaces
 * a recoverable error in shared state and falls back to fixture data.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'pulsetag.mini.state.v1';

  function isStorageAvailable() {
    try {
      const test = '__pt_storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  function readRaw() {
    if (!isStorageAvailable()) return null;
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function parse(raw) {
    if (raw === null || raw === undefined || raw === '') return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      if (!Array.isArray(parsed.tags)) return null;
      return parsed;
    } catch (e) {
      return { corrupted: true, raw };
    }
  }

  function load(stateApi, fixtureUrl, onReady) {
    if (!window.PulseTagMiniState) {
      stateApi.setLastError(new Error('PulseTagMiniState is not loaded'));
      stateApi.setStorageStatus('error');
      if (onReady) onReady();
      return;
    }

    stateApi.setStorageStatus('loading');

    const raw = readRaw();
    const parsed = parse(raw);

    if (parsed && parsed.corrupted) {
      stateApi.setLastError(new Error('Persisted data is corrupted; reset to fixture defaults.'));
      stateApi.setStorageStatus('corrupted');
      loadFixture(stateApi, fixtureUrl, onReady, true);
      return;
    }

    if (parsed) {
      stateApi.loadFromData(parsed);
      stateApi.setStorageStatus('loaded');
      if (onReady) onReady();
      return;
    }

    loadFixture(stateApi, fixtureUrl, onReady, false);
  }

  function loadFixture(stateApi, fixtureUrl, onReady, preserveCorruptedError) {
    const fallback = function (data) {
      stateApi.bootstrap(data.tags || [], data.events || [], data.preferences || {});
      if (!preserveCorruptedError) {
        stateApi.clearLastError();
      }
      stateApi.setStorageStatus('loaded');
      if (onReady) onReady();
    };

    if (!fixtureUrl) {
      fallback({ tags: [], events: [], preferences: {} });
      return;
    }

    fetch(fixtureUrl)
      .then(function (res) {
        if (!res.ok) throw new Error(`Fixture fetch failed: ${res.status}`);
        return res.json();
      })
      .then(function (data) {
        fallback(data);
      })
      .catch(function (err) {
        stateApi.setLastError(err);
        stateApi.setStorageStatus('error');
        fallback({ tags: [], events: [], preferences: {} });
      });
  }

  function save(stateApi) {
    if (!isStorageAvailable()) {
      stateApi.setLastError(new Error('localStorage is unavailable'));
      stateApi.setStorageStatus('unavailable');
      return false;
    }
    try {
      const payload = stateApi.getSerializableState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      stateApi.setStorageStatus('saved');
      return true;
    } catch (e) {
      stateApi.setLastError(new Error(`Save failed: ${e.message || e}`));
      stateApi.setStorageStatus('error');
      return false;
    }
  }

  function clear() {
    if (!isStorageAvailable()) return false;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  window.PulseTagMiniStorage = {
    STORAGE_KEY,
    isStorageAvailable,
    load,
    save,
    clear,
    readRaw
  };
})();
