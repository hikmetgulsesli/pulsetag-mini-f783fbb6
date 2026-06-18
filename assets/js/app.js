/**
 * PulseTag Mini — application shell and product behavior.
 *
 * Implements the shared app shell, surface navigation, tag CRUD,
 * search/filter, JSON export, and persistence wiring.
 */
(function () {
  'use strict';

  const stateApi = window.PulseTagMiniState;
  const storageApi = window.PulseTagMiniStorage;

  if (!stateApi || !storageApi) {
    document.addEventListener('DOMContentLoaded', function () {
      const root = document.querySelector('[data-setfarm-root]');
      if (root) root.innerHTML = '<p class="error-banner">PulseTag Mini failed to initialize required modules.</p>';
    });
    return;
  }

  const SURF = stateApi.SURFACES;
  const PANEL = stateApi.PANELS;

  let autoSaveTimer = null;

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'className') node.className = attrs[key];
        else if (key === 'dataset') Object.assign(node.dataset, attrs[key]);
        else if (key.startsWith('data-')) node.setAttribute(key, attrs[key]);
        else node[key] = attrs[key];
      });
    }
    (children || []).forEach(function (child) {
      if (typeof child === 'string') node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    });
    return node;
  }

  function debouncedSave() {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(function () {
      storageApi.save(stateApi);
    }, 120);
  }

  function statusClass(status) {
    return `status-${status}`;
  }

  function renderAppShell() {
    const root = $('[data-setfarm-root]');
    if (!root) return;

    root.innerHTML = '';
    root.className = 'app-shell';

    const header = el('header', { className: 'app-header' }, [
      el('div', { className: 'brand' }, [el('span', { className: 'brand-mark' }, '◆'), 'PulseTag Mini']),
      el('nav', { className: 'app-nav', role: 'tablist', 'aria-label': 'Primary' }, [
        navLink('Operations', PANEL.OPERATIONS, SURF.OPERATIONS),
        navLink('Editor', PANEL.EDITOR, SURF.EDITOR),
        navLink('Insights', PANEL.INSIGHTS, SURF.INSIGHTS)
      ]),
      el('div', { className: 'header-actions' }, [
        el('button', {
          className: 'btn btn-secondary',
          type: 'button',
          'data-action-id': 'ACT_EXPORT_SUMMARY'
        }, 'JSON Export'),
        el('button', {
          className: 'btn btn-ghost',
          type: 'button',
          'data-action-id': 'ACT_SYNC_STORAGE',
          title: 'sync'
        }, 'sync')
      ])
    ]);

    const main = el('main', { className: 'app-main', 'data-testid': 'app-main' });
    const footer = el('footer', { className: 'app-footer' }, [
      el('span', { 'data-testid': 'storage-status' }, 'Storage: —'),
      el('span', { 'data-testid': 'item-counts' }, 'Tags: 0')
    ]);

    root.appendChild(header);
    root.appendChild(main);
    root.appendChild(footer);
  }

  function navLink(label, panel, surface) {
    const a = el('a', {
      href: '#',
      className: 'nav-link',
      role: 'tab',
      'data-panel': panel,
      'data-surface': surface,
      'aria-selected': 'false'
    }, label);
    a.addEventListener('click', function (e) {
      e.preventDefault();
      stateApi.navigateTo(surface);
    });
    return a;
  }

  function renderErrorBanner(state) {
    const existing = $('.error-banner');
    if (existing) existing.remove();
    if (!state.lastError) return;
    const banner = el('div', { className: 'error-banner', 'data-testid': 'last-error' }, [
      el('strong', null, 'Error: '),
      state.lastError.message,
      ' ',
      el('button', {
        className: 'btn btn-ghost',
        type: 'button',
        'data-action-id': 'ACT_CLEAR_ERROR'
      }, 'Dismiss')
    ]);
    const main = $('.app-main');
    if (main) main.parentNode.insertBefore(banner, main);
  }

  function renderOperations(state) {
    const main = $('.app-main');
    if (!main) return;

    const tags = stateApi.filteredTags();
    const selectedTag = state.tags.find((t) => t.id === state.selectedTagId) || null;

    const toolbar = el('div', { className: 'toolbar' }, [
      el('input', {
        type: 'text',
        className: 'input',
        placeholder: 'Search records...',
        'data-action-id': 'ACT_SEARCH_RECORDS',
        value: state.searchQuery
      }),
      el('button', { className: 'btn btn-secondary', type: 'button', 'data-action-id': 'ACT_FILTER_STATUS' }, `Status: ${capitalize(state.filter)}`),
      el('button', { className: 'btn btn-secondary', type: 'button', 'data-action-id': 'ACT_RETRY_LOAD' }, 'Retry Load'),
      el('button', { className: 'btn btn-primary', type: 'button', 'data-action-id': 'ACT_CREATE_RECORD' }, 'Create New Tag')
    ]);

    const listContainer = el('div', { className: 'tag-list' });
    if (tags.length === 0) {
      listContainer.appendChild(el('p', { className: 'empty-state' }, 'No tags match the current filter.'));
    } else {
      tags.forEach((tag) => {
        const row = el('div', {
          className: `tag-row ${selectedTag && selectedTag.id === tag.id ? 'is-selected' : ''}`,
          'data-tag-id': tag.id
        }, [
          el('span', { className: `status-dot ${statusClass(tag.status)}` }),
          el('span', { className: 'tag-name' }, tag.name || '(unnamed)'),
          el('span', { className: `status-badge ${statusClass(tag.status)}` }, capitalize(tag.status)),
          el('button', {
            className: 'btn btn-ghost',
            type: 'button',
            'data-action-id': 'ACT_SELECT_RECORD'
          }, 'edit')
        ]);
        row.addEventListener('click', function (e) {
          if (e.target.closest('button')) {
            e.stopPropagation();
            stateApi.selectTag(tag.id);
            stateApi.navigateTo(SURF.EDITOR);
          } else {
            stateApi.selectTag(tag.id);
          }
        });
        listContainer.appendChild(row);
      });
    }

    const preview = el('aside', { className: 'preview-panel' }, [
      el('h2', { className: 'panel-title' }, 'Selected'),
      selectedTag
        ? el('div', { className: 'preview-content' }, [
            el('p', null, [el('strong', null, 'Name: '), selectedTag.name || '(unnamed)']),
            el('p', null, [el('strong', null, 'Status: '), capitalize(selectedTag.status)]),
            el('p', null, [el('strong', null, 'Note: '), selectedTag.note || '—'])
          ])
        : el('p', { className: 'empty-state' }, 'Select a tag to preview details.')
    ]);

    main.innerHTML = '';
    main.appendChild(toolbar);
    const layout = el('div', { className: 'operations-layout' }, [listContainer, preview]);
    main.appendChild(layout);
  }

  function renderEditor(state) {
    const main = $('.app-main');
    if (!main) return;

    const isNew = state.editingTagId === null;
    const existingTag = state.tags.find((t) => t.id === state.editingTagId) || null;
    const tag = isNew ? { name: '', status: 'active', note: '' } : (existingTag || { name: '', status: 'active', note: '' });

    const form = el('form', { className: 'editor-form', 'data-testid': 'editor-form' }, [
      el('label', { className: 'field' }, [
        'Name',
        el('input', {
          type: 'text',
          className: 'input',
          name: 'name',
          required: true,
          value: tag.name
        })
      ]),
      el('label', { className: 'field' }, [
        'Note',
        el('input', {
          type: 'text',
          className: 'input',
          name: 'note',
          value: tag.note
        })
      ]),
      el('label', { className: 'field' }, [
        'Status',
        el('select', { className: 'input', name: 'status' }, [
          el('option', { value: 'active' }, 'Active'),
          el('option', { value: 'warn' }, 'Warning'),
          el('option', { value: 'fail' }, 'Fail')
        ])
      ]),
      el('label', { className: 'field' }, [
        'Details',
        el('textarea', { className: 'input', name: 'details', rows: 4 }, tag.note || '')
      ]),
      el('div', { className: 'form-actions' }, [
        el('button', { className: 'btn btn-secondary', type: 'button', 'data-action-id': 'ACT_CANCEL_EDIT' }, 'Cancel'),
        el('button', { className: 'btn btn-primary', type: 'submit', 'data-action-id': 'ACT_SAVE_RECORD' }, 'Save Changes')
      ])
    ]);

    form.querySelector('[name="status"]').value = tag.status;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get('name') || '').trim();
      if (!name) {
        stateApi.setLastError(new Error('Name is required.'));
        renderErrorBanner(stateApi.getState());
        return;
      }
      const tagData = {
        name: name,
        note: String(fd.get('details') || '').trim() || String(fd.get('note') || '').trim(),
        status: String(fd.get('status') || 'active')
      };
      if (isNew) {
        stateApi.createTag(tagData);
      } else if (existingTag) {
        stateApi.updateTag(state.editingTagId, tagData);
      }
      debouncedSave();
      stateApi.navigateTo(SURF.OPERATIONS);
    });

    form.querySelector('[data-action-id="ACT_CANCEL_EDIT"]').addEventListener('click', function () {
      stateApi.navigateTo(SURF.OPERATIONS);
    });

    main.innerHTML = '';
    main.appendChild(el('h2', { className: 'panel-title' }, 'Four Editor'));
    main.appendChild(form);
  }

  function renderInsights(state) {
    const main = $('.app-main');
    if (!main) return;

    const counts = state.counts;
    const recentEvents = (state.events || []).slice(0, 6);

    const metrics = el('div', { className: 'metrics' }, [
      metricCard('Total', counts.total),
      metricCard('Active', counts.active, 'active'),
      metricCard('Warning', counts.warn, 'warn'),
      metricCard('Fail', counts.fail, 'fail')
    ]);

    const eventsList = el('div', { className: 'events-list' }, [
      el('h3', { className: 'section-title' }, 'Recent Activity')
    ]);
    if (recentEvents.length === 0) {
      eventsList.appendChild(el('p', { className: 'empty-state' }, 'No recent activity.'));
    } else {
      recentEvents.forEach((evt) => {
        eventsList.appendChild(
          el('div', { className: 'event-row' }, [
            el('span', { className: 'event-time' }, fmtTime(evt.timestamp)),
            el('span', { className: 'event-message' }, evt.message)
          ])
        );
      });
      eventsList.appendChild(
        el('button', { className: 'btn btn-secondary', type: 'button', 'data-action-id': 'ACT_LOAD_MORE_EVENTS' }, 'Load More Events')
      );
    }

    main.innerHTML = '';
    main.appendChild(el('h2', { className: 'panel-title' }, 'Insights'));
    main.appendChild(metrics);
    main.appendChild(eventsList);
    main.appendChild(
      el('button', { className: 'btn btn-secondary', type: 'button', 'data-action-id': 'ACT_GOTO_OPERATIONS' }, 'Go to Operations')
    );
  }

  function metricCard(label, value, status) {
    return el('div', { className: `metric-card ${status ? statusClass(status) : ''}` }, [
      el('span', { className: 'metric-value' }, String(value)),
      el('span', { className: 'metric-label' }, label)
    ]);
  }

  function capitalize(s) {
    return String(s || '').replace(/^\w/, (c) => c.toUpperCase());
  }

  function fmtTime(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return String(iso);
    }
  }

  function updateChrome(state) {
    $$('.nav-link').forEach(function (link) {
      const active = link.dataset.surface === state.activeSurface;
      link.classList.toggle('is-active', active);
      link.setAttribute('aria-selected', String(active));
    });

    const storageEl = $('[data-testid="storage-status"]');
    if (storageEl) storageEl.textContent = `Storage: ${state.storageStatus}`;

    const countEl = $('[data-testid="item-counts"]');
    if (countEl) {
      countEl.textContent = `Tags: ${state.counts.total} (active ${state.counts.active}, warn ${state.counts.warn}, fail ${state.counts.fail})`;
    }

    renderErrorBanner(state);

    if (state.activeSurface === SURF.OPERATIONS) renderOperations(state);
    else if (state.activeSurface === SURF.EDITOR) renderEditor(state);
    else if (state.activeSurface === SURF.INSIGHTS) renderInsights(state);
  }

  function exportJson() {
    const payload = stateApi.exportPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulsetag-mini-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function bindGlobalActions() {
    document.body.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action-id]');
      if (!target) return;
      const action = target.dataset.actionId;

      switch (action) {
        case 'ACT_EXPORT_SUMMARY':
          e.preventDefault();
          exportJson();
          break;
        case 'ACT_SYNC_STORAGE':
          e.preventDefault();
          storageApi.save(stateApi);
          break;
        case 'ACT_CREATE_RECORD':
          e.preventDefault();
          stateApi.selectTag(null);
          stateApi.navigateTo(SURF.EDITOR);
          break;
        case 'ACT_RETRY_LOAD':
          e.preventDefault();
          storageApi.load(stateApi, 'assets/data/pulsetag-mini.json');
          break;
        case 'ACT_CLEAR_ERROR':
          e.preventDefault();
          stateApi.clearLastError();
          break;
        case 'ACT_FILTER_STATUS':
          e.preventDefault();
          {
            const order = ['all', 'active', 'warn', 'fail'];
            const idx = order.indexOf(stateApi.getState().filter);
            stateApi.setFilter(order[(idx + 1) % order.length]);
          }
          break;
        case 'ACT_GOTO_OPERATIONS':
          e.preventDefault();
          stateApi.navigateTo(SURF.OPERATIONS);
          break;
        case 'ACT_LOAD_MORE_EVENTS':
          e.preventDefault();
          break;
      }
    });

    document.body.addEventListener('input', function (e) {
      if (e.target.dataset.actionId === 'ACT_SEARCH_RECORDS') {
        stateApi.setSearchQuery(e.target.value);
      }
    });
  }

  function init() {
    renderAppShell();
    bindGlobalActions();

    stateApi.subscribe(function (state, reason) {
      updateChrome(state);
      if (reason !== 'load' && reason !== 'bootstrap' && reason !== 'storage') {
        debouncedSave();
      }
    });

    storageApi.load(stateApi, 'assets/data/pulsetag-mini.json', function () {
      window.setfarmStaticReady = true;
      if (window.__SETFARM_TEST_BRIDGE__) {
        window.__SETFARM_TEST_BRIDGE__.ready = true;
        window.__SETFARM_TEST_BRIDGE__.state = stateApi.getState();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
