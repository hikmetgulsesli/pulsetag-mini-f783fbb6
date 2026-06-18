/**
 * US-002 action: ACT_CANCEL_EDIT
 *
 * Handles the editor Cancel button by returning to the operations page.
 */
(function () {
  'use strict';

  function init() {
    document.body.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action-id="ACT_CANCEL_EDIT"]');
      if (!target) return;
      e.preventDefault();
      window.location.href = 'four-operations-pulsetag-mini.html';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
