(function () {
  "use strict";

  var STORAGE_KEY = "pei-photo-settings-v1";
  var MIN_ZOOM = 0.5;
  var MAX_ZOOM = 4;
  var ZOOM_STEP = 0.1;
  var frames = Array.from(document.querySelectorAll("[data-photo-frame]"));
  var toggle = document.querySelector("[data-photo-editor-toggle]");
  var bar = document.querySelector("[data-photo-editor-bar]");
  var closeButton = document.querySelector("[data-photo-editor-close]");
  var resetAllButton = document.querySelector("[data-photo-reset-all]");
  var exportButton = document.querySelector("[data-photo-export]");
  var toast = document.querySelector("[data-photo-editor-toast]");
  var defaults = {};
  var settings = {};
  var editing = false;
  var saveTimer = null;
  var toastTimer = null;

  if (!frames.length || !toggle || !bar) return;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function round(value, places) {
    var factor = Math.pow(10, places || 0);
    return Math.round(value * factor) / factor;
  }

  function normalize(value, fallback) {
    var source = value || {};
    return {
      x: clamp(Number.isFinite(Number(source.x)) ? Number(source.x) : fallback.x, 0, 100),
      y: clamp(Number.isFinite(Number(source.y)) ? Number(source.y) : fallback.y, 0, 100),
      zoom: clamp(Number.isFinite(Number(source.zoom)) ? Number(source.zoom) : fallback.zoom, MIN_ZOOM, MAX_ZOOM)
    };
  }

  frames.forEach(function (frame) {
    var id = frame.dataset.photoId;
    defaults[id] = {
      x: Number(frame.dataset.defaultX || 50),
      y: Number(frame.dataset.defaultY || 50),
      zoom: Number(frame.dataset.defaultZoom || 1)
    };
  });

  function applyFrame(frame) {
    var id = frame.dataset.photoId;
    var value = settings[id] || defaults[id];
    var image = frame.querySelector("[data-photo]");
    var output = frame.querySelector("[data-zoom-value]");
    var imageSource = image.currentSrc || image.src;

    frame.style.setProperty("--photo-x", round(value.x, 2) + "%");
    frame.style.setProperty("--photo-y", round(value.y, 2) + "%");
    frame.style.setProperty("--photo-bg-image", 'url("' + imageSource.replace(/"/g, "%22") + '")');
    image.style.setProperty("--photo-x", round(value.x, 2) + "%");
    image.style.setProperty("--photo-y", round(value.y, 2) + "%");
    image.style.setProperty("--photo-zoom", round(value.zoom, 2));
    if (output) output.textContent = Math.round(value.zoom * 100) + "%";
  }

  function applyAll() {
    frames.forEach(applyFrame);
  }

  function saveNow() {
    window.clearTimeout(saveTimer);
    saveTimer = null;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, photos: settings }));
    } catch (error) {
      showToast("Não foi possível salvar neste navegador.");
    }
  }

  function scheduleSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveNow, 100);
  }

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(function () {
      toast.hidden = true;
    }, 2800);
  }

  function updatePhoto(id, nextValue, saveImmediately) {
    settings[id] = normalize(nextValue, defaults[id]);
    var frame = document.querySelector('[data-photo-id="' + id + '"]');
    if (frame) applyFrame(frame);
    if (saveImmediately) saveNow();
    else scheduleSave();
  }

  function changeZoom(id, delta) {
    var value = settings[id];
    updatePhoto(id, {
      x: value.x,
      y: value.y,
      zoom: round(value.zoom + delta, 2)
    });
  }

  function setEditing(nextEditing) {
    editing = Boolean(nextEditing);
    document.body.classList.toggle("photo-editing", editing);
    toggle.setAttribute("aria-pressed", String(editing));
    bar.hidden = !editing;

    if (editing) {
      document.getElementById("equipe").scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("Arraste qualquer foto e use os botões + e −.");
    }
  }

  frames.forEach(function (frame) {
    var id = frame.dataset.photoId;
    var drag = null;
    var zoomOut = frame.querySelector("[data-zoom-out]");
    var zoomIn = frame.querySelector("[data-zoom-in]");
    var reset = frame.querySelector("[data-photo-reset]");

    zoomOut.addEventListener("click", function () {
      changeZoom(id, -ZOOM_STEP);
    });

    zoomIn.addEventListener("click", function () {
      changeZoom(id, ZOOM_STEP);
    });

    reset.addEventListener("click", function () {
      updatePhoto(id, defaults[id], true);
      showToast("Foto restaurada.");
    });

    frame.addEventListener("pointerdown", function (event) {
      if (!editing || event.target.closest(".photo-controls")) return;
      var value = settings[id];
      drag = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        x: value.x,
        y: value.y
      };
      frame.setPointerCapture(event.pointerId);
      frame.classList.add("is-dragging");
      event.preventDefault();
    });

    frame.addEventListener("pointermove", function (event) {
      if (!drag || drag.pointerId !== event.pointerId) return;
      var rect = frame.getBoundingClientRect();
      var value = settings[id];
      var deltaX = ((event.clientX - drag.clientX) / Math.max(rect.width, 1)) * (100 / value.zoom);
      var deltaY = ((event.clientY - drag.clientY) / Math.max(rect.height, 1)) * (100 / value.zoom);
      updatePhoto(id, {
        x: drag.x - deltaX,
        y: drag.y - deltaY,
        zoom: value.zoom
      });
    });

    function finishDrag(event) {
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag = null;
      frame.classList.remove("is-dragging");
      saveNow();
    }

    frame.addEventListener("pointerup", finishDrag);
    frame.addEventListener("pointercancel", finishDrag);

    frame.addEventListener("keydown", function (event) {
      if (!editing) return;
      var value = settings[id];
      var step = event.shiftKey ? 5 : 1;
      var next = { x: value.x, y: value.y, zoom: value.zoom };

      if (event.key === "ArrowLeft") next.x += step;
      else if (event.key === "ArrowRight") next.x -= step;
      else if (event.key === "ArrowUp") next.y += step;
      else if (event.key === "ArrowDown") next.y -= step;
      else if (event.key === "+" || event.key === "=") next.zoom += ZOOM_STEP;
      else if (event.key === "-") next.zoom -= ZOOM_STEP;
      else return;

      event.preventDefault();
      updatePhoto(id, next);
    });
  });

  toggle.addEventListener("click", function () {
    setEditing(!editing);
  });

  closeButton.addEventListener("click", function () {
    saveNow();
    setEditing(false);
    showToast("Enquadramentos salvos neste navegador.");
  });

  resetAllButton.addEventListener("click", function () {
    settings = JSON.parse(JSON.stringify(defaults));
    applyAll();
    saveNow();
    showToast("Todas as fotos foram restauradas.");
  });

  exportButton.addEventListener("click", function () {
    saveNow();
    var payload = {
      version: 1,
      generatedAt: new Date().toISOString(),
      photos: settings
    };
    var blob = new Blob([JSON.stringify(payload, null, 2) + "\n"], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "photo-settings.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Configuração baixada. Use esse arquivo na pasta do site.");
  });

  async function loadSettings() {
    var fileDefaults = {};
    try {
      var response = await fetch("photo-settings.json", { cache: "no-store" });
      if (response.ok) {
        var payload = await response.json();
        fileDefaults = payload.photos || payload;
      }
    } catch (error) {
      fileDefaults = {};
    }

    Object.keys(defaults).forEach(function (id) {
      defaults[id] = normalize(fileDefaults[id], defaults[id]);
    });

    var localSettings = {};
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localSettings = saved.photos || saved;
    } catch (error) {
      localSettings = {};
    }

    Object.keys(defaults).forEach(function (id) {
      settings[id] = normalize(localSettings[id], defaults[id]);
    });

    applyAll();
  }

  loadSettings();
})();
