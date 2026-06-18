/**
 * PulseTag Mini — deterministic test bridge.
 *
 * Exposes the current app state and key identifiers so automated
 * verification can read active surface, selected record, counts,
 * storage status, last error, and active panel without relying on
 * implementation-specific DOM selectors.
 */
(function () {
  'use strict';

  window.__SETFARM_TEST_BRIDGE__ = {
    stack: 'static-html',
    ready: false,
    appId: 'pulsetag-mini',
    get state() {
      return window.PulseTagMiniState ? window.PulseTagMiniState.getState() : null;
    },
    get actions() {
      return window.PulseTagMiniState ? window.PulseTagMiniState : null;
    },
    surfaces: {
      OPERATIONS: 'SURF_FOUR_OPERATIONS',
      EDITOR: 'SURF_FOUR_EDITOR',
      INSIGHTS: 'SURF_INSIGHTS'
    }
  };
})();
