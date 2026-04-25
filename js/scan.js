// ── Scan simulation ───────────────────────────────────────────────────────────

function updateScanPhaseCards() {
  const discover = byId("phase-discover");
  const analyze = byId("phase-analyze");
  const enrich = byId("phase-enrich");

  [discover, analyze, enrich].forEach((node) => {
    node.classList.remove("active", "complete");
  });

  if (state.scan.currentPhase === "discover") {
    discover.classList.add("active");
  } else if (state.scan.currentPhase === "analyze") {
    discover.classList.add("complete");
    analyze.classList.add("active");
  } else if (state.scan.currentPhase === "enrich") {
    discover.classList.add("complete");
    analyze.classList.add("complete");
    enrich.classList.add("active");
  } else {
    discover.classList.add("complete");
    analyze.classList.add("complete");
    enrich.classList.add("complete");
  }
}

function renderScanProgress() {
  el.scanPercentLabel.textContent = `${Math.round(state.scan.progress)}% Complete`;
  el.scanProgressBar.style.width = `${state.scan.progress}%`;
  el.discoverCount.textContent = `${state.scan.filesDiscovered} files discovered`;
  el.analyzeCount.textContent = `${state.scan.filesAnalyzed} files analyzed`;
  el.enrichCount.textContent = `${state.scan.filesEnriched} metadata fetched`;

  el.rescanButton.disabled = state.scan.running;
  el.rescanButton.textContent = state.scan.running ? "Scanning..." : "Rescan";

  updateScanPhaseCards();
}

function tickScanProgress() {
  if (!state.scan.running) return;

  const increment = 1.5 + Math.random() * 4;
  state.scan.progress = Math.min(100, state.scan.progress + increment);

  state.scan.filesAnalyzed = Math.min(
    state.scan.totalFiles,
    Math.round((state.scan.progress / 100) * state.scan.totalFiles)
  );

  state.scan.filesEnriched = Math.min(
    state.scan.filesAnalyzed,
    Math.round(state.scan.filesAnalyzed * 0.76)
  );

  if (state.scan.progress < 28) {
    state.scan.currentPhase = "discover";
  } else if (state.scan.progress < 74) {
    state.scan.currentPhase = "analyze";
  } else if (state.scan.progress < 99) {
    state.scan.currentPhase = "enrich";
  } else {
    state.scan.currentPhase = "complete";
    state.scan.progress = 100;
    state.scan.running = false;
    clearInterval(state.scan.timer);
    state.scan.timer = null;
    showToast("Scan completed successfully.", "success");
    renderHomePage();
  }

  renderScanProgress();
}

function startScanSimulation() {
  if (state.scan.running) return;

  state.scan.running = true;
  state.scan.progress = 0;
  state.scan.currentPhase = "discover";
  state.scan.filesAnalyzed = 0;
  state.scan.filesEnriched = 0;

  renderScanProgress();
  renderHomePage();

  state.scan.timer = setInterval(tickScanProgress, 140);
}

// ── QR code ───────────────────────────────────────────────────────────────────

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededBoolean(seed, x, y) {
  let value = seed ^ (x * 374761393) ^ (y * 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) & 1) === 1;
}

function drawFinder(ctx, cell, offsetX, offsetY) {
  ctx.fillStyle = "#f4f4f5";
  ctx.fillRect(offsetX, offsetY, cell * 7, cell * 7);
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(offsetX + cell, offsetY + cell, cell * 5, cell * 5);
  ctx.fillStyle = "#f4f4f5";
  ctx.fillRect(offsetX + cell * 2, offsetY + cell * 2, cell * 3, cell * 3);
}

function drawPseudoQr(text) {
  const canvas = el.qrCanvas;
  const ctx = canvas.getContext("2d");
  const size = 29;
  const cell = Math.floor(canvas.width / size);
  const seed = hashString(text);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawFinder(ctx, cell, cell, cell);
  drawFinder(ctx, cell, cell * (size - 8), cell);
  drawFinder(ctx, cell, cell, cell * (size - 8));

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const inTopLeft = x < 8 && y < 8;
      const inTopRight = x > size - 9 && y < 8;
      const inBottomLeft = x < 8 && y > size - 9;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      if (seededBoolean(seed, x, y)) {
        ctx.fillStyle = "#f4f4f5";
        ctx.fillRect(cell * x, cell * y, cell, cell);
      }
    }
  }
}
