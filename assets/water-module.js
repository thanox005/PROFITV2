(function () {
  'use strict';

  const WATER_STORAGE_KEY = 'nutri_agua';
  const WATER_GOAL_KEY = 'nutri_meta_agua';

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      console.warn('[PROFIT WATER] Falha ao ler storage:', error);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('[PROFIT WATER] Falha ao salvar storage:', error);
      return false;
    }
  }

  function normalizeNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function formatLiters(value) {
    return (Number(value) || 0).toFixed(1).replace(/\.0$/, '');
  }

  function getTodayKey() {
    return window.dataAtual || new Date().toISOString().slice(0, 10);
  }

  function getWaterState() {
    const state = readJSON(WATER_STORAGE_KEY, {});
    if (!state || typeof state !== 'object') return {};
    return state;
  }

  function getWaterGoal() {
    const saved = Number(localStorage.getItem(WATER_GOAL_KEY) || 2);
    return Number.isFinite(saved) && saved > 0 ? saved : 2;
  }

  function renderHydrationModule() {
    const waterStatus = document.getElementById('waterStatus');
    const waterGlasses = document.getElementById('waterGlasses');
    const waterGoalInput = document.getElementById('waterGoalInput');

    if (!waterStatus && !waterGlasses && !waterGoalInput) return;

    const todayKey = getTodayKey();
    const storage = getWaterState();
    const totalMl = normalizeNumber(storage[todayKey], 0);
    const goalLiters = getWaterGoal();
    const goalMl = Math.max(500, Math.round(goalLiters * 1000));
    const totalCups = Math.max(1, Math.ceil(goalMl / 250));
    const filledCups = Math.min(totalCups, Math.floor(totalMl / 250));

    if (waterStatus) {
      waterStatus.textContent = `${formatLiters(totalMl / 1000)} / ${formatLiters(goalLiters)} L`;
    }

    if (waterGoalInput && document.activeElement !== waterGoalInput) {
      waterGoalInput.value = goalLiters;
    }

    if (waterGlasses) {
      waterGlasses.innerHTML = '';
      for (let index = 0; index < Math.min(totalCups, 24); index += 1) {
        const glass = document.createElement('div');
        glass.className = 'water-glass' + (index < filledCups ? ' filled' : '');
        glass.textContent = index < filledCups ? '💧' : '○';
        waterGlasses.appendChild(glass);
      }
    }
  }

  function addWater(delta) {
    const todayKey = getTodayKey();
    const state = getWaterState();
    const currentValue = normalizeNumber(state[todayKey], 0);
    const nextValue = Math.max(0, currentValue + delta);
    state[todayKey] = nextValue;
    writeJSON(WATER_STORAGE_KEY, state);
    if (typeof window.renderAgua === 'function') {
      window.renderAgua();
    }
    renderHydrationModule();
    if (typeof window.atualizarGamificacao === 'function') {
      window.atualizarGamificacao();
    }
  }

  function saveGoal() {
    const input = document.getElementById('waterGoalInput');
    if (!input) return;

    const rawValue = String(input.value || '').replace(',', '.');
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed < 0.5) {
      if (typeof window.toast === 'function') {
        window.toast('Informe uma meta de água de pelo menos 0,5 L.');
      }
      return;
    }

    const goal = Math.max(0.5, parsed);
    localStorage.setItem(WATER_GOAL_KEY, String(goal));
    if (typeof window.renderAgua === 'function') {
      window.renderAgua();
    }
    renderHydrationModule();
    if (typeof window.atualizarGamificacao === 'function') {
      window.atualizarGamificacao();
    }
    if (typeof window.toast === 'function') {
      window.toast('Meta de água atualizada! 💧');
    }
  }

  function bindHydrationButtons() {
    const addBtn = document.getElementById('addWaterBtn');
    const removeBtn = document.getElementById('removeWaterBtn');
    const saveBtn = document.getElementById('saveWaterGoalBtn');

    if (addBtn && !addBtn.dataset.profitHydrationBound) {
      addBtn.dataset.profitHydrationBound = '1';
      addBtn.addEventListener('click', function () {
        addWater(250);
      });
    }

    if (removeBtn && !removeBtn.dataset.profitHydrationBound) {
      removeBtn.dataset.profitHydrationBound = '1';
      removeBtn.addEventListener('click', function () {
        addWater(-250);
      });
    }

    if (saveBtn && !saveBtn.dataset.profitHydrationBound) {
      saveBtn.dataset.profitHydrationBound = '1';
      saveBtn.addEventListener('click', saveGoal);
    }
  }

  window.PROFIT_WATER = {
    renderHydrationModule,
    addWater,
    saveGoal,
    getWaterGoal,
    getWaterState
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindHydrationButtons();
      renderHydrationModule();
    });
  } else {
    bindHydrationButtons();
    renderHydrationModule();
  }
})();
