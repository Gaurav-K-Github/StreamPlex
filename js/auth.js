function setSession(isLoggedIn, role) {
  state.isLoggedIn = isLoggedIn;
  state.role = role;
  persistSession();
  updateAdminVisibility();
}

function renderLoginMode() {
  const isGuest = state.authMode === "guest";
  el.guestTab.classList.toggle("active", isGuest);
  el.adminTab.classList.toggle("active", !isGuest);

  el.guestTab.setAttribute("aria-selected", String(isGuest));
  el.adminTab.setAttribute("aria-selected", String(!isGuest));

  el.guestFields.classList.toggle("hidden", !isGuest);
  el.adminFields.classList.toggle("hidden", isGuest);

  if (isGuest) {
    el.loginHeading.textContent = "WELCOME BACK";
    el.loginSubmit.textContent = "Sign In";
  } else {
    el.loginHeading.textContent = "ADMIN AUTH";
    el.loginSubmit.textContent = "Sign In";
  }

  el.loginError.classList.add("hidden");
  el.loginError.textContent = "";
}

function handleLoginSubmit(event) {
  event.preventDefault();
  el.loginError.classList.add("hidden");

  if (state.authMode === "guest") {
    const enteredPin = el.loginPin.value.trim();
    if (!enteredPin) {
      el.loginError.textContent = "Guest PIN is required.";
      el.loginError.classList.remove("hidden");
      return;
    }

    if (enteredPin !== state.guestPin) {
      el.loginError.textContent = "Invalid guest PIN.";
      el.loginError.classList.remove("hidden");
      return;
    }

    setSession(true, "guest");
    state.activePage = "home";
    showAppView();
    showToast("Logged in as guest.", "success");
    return;
  }

  const email = el.loginEmail.value.trim().toLowerCase();
  const password = el.loginPassword.value;

  if (!email || !password) {
    el.loginError.textContent = "Email and password are required.";
    el.loginError.classList.remove("hidden");
    return;
  }

  if (email !== state.adminEmail.toLowerCase() || password !== state.adminPassword) {
    el.loginError.textContent = "Invalid admin credentials.";
    el.loginError.classList.remove("hidden");
    return;
  }

  setSession(true, "admin");
  state.activePage = "home";
  showAppView();
  showToast("Welcome back, admin.", "success");
}

function createLoginGrid() {
  if (!el.loginGrid) return;

  const tilePalettes = [
    ["#1a0a2e", "#6b21a8"],
    ["#0a1628", "#1d4ed8"],
    ["#0d2818", "#15803d"],
    ["#2d0a0a", "#b91c1c"],
    ["#1a1a0a", "#a16207"],
    ["#0f172a", "#4338ca"],
    ["#1a0d2e", "#7c3aed"],
    ["#0a2020", "#0f766e"],
    ["#2a0d1a", "#be185d"],
    ["#0d1a0d", "#166534"],
    ["#200a28", "#86198f"],
    ["#0a1a28", "#0369a1"]
  ];

  const badgeColors = ["#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#818cf8", "#a78bfa"];

  const columnCount = 7;
  const rowCount = 24;

  el.loginGrid.innerHTML = "";

  for (let col = 0; col < columnCount; col += 1) {
    const column = document.createElement("div");
    column.className = `grid-column ${col % 2 === 0 ? "up" : "down"}`;
    column.style.setProperty("--duration", `${18 + col * 3}s`);

    for (let row = 0; row < rowCount; row += 1) {
      const tile = document.createElement("div");
      tile.className = "media-tile";

      const palette = tilePalettes[(col * 5 + row) % tilePalettes.length];
      tile.style.height = `${106 + ((col + row) % 3) * 16}px`;
      tile.style.background = `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`;

      const play = document.createElement("div");
      play.className = "tile-play";
      play.innerHTML = "<div class=\"tile-play-dot\">&gt;</div>";
      tile.appendChild(play);

      if ((col + row) % 2 === 0) {
        const badge = document.createElement("span");
        badge.className = "tile-badge";
        badge.style.background = badgeColors[(col + row) % badgeColors.length];
        tile.appendChild(badge);
      }

      column.appendChild(tile);
    }

    el.loginGrid.appendChild(column);
  }
}
