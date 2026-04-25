function bindStaticEvents() {
  // Global click delegation
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;

    const action = trigger.getAttribute("data-action");
    const videoIdAttr = trigger.getAttribute("data-video-id");
    const videoId = videoIdAttr ? Number(videoIdAttr) : Number.NaN;

    switch (action) {
      case "go-home":
        closeAllModals();
        setPage("home");
        break;

      case "go-genres":
        closeAllModals();
        setPage("genres");
        break;

      case "go-settings":
        closeAllModals();
        setPage("settings");
        break;

      case "logout":
        setSession(false, "guest");
        state.activePage = "home";
        showLoginView();
        showToast("Session locked.", "info");
        break;

      case "open-search":
        state.searchTerm = state.query;
        el.searchInput.value = state.searchTerm;
        renderSearchModalBody();
        openModal(el.searchModal);
        setTimeout(() => el.searchInput.focus(), 20);
        break;

      case "close-search":
        closeModal(el.searchModal);
        break;

      case "open-my-list":
        if (state.role !== "admin") {
          showToast("My List is available for admin only.", "warn");
          break;
        }
        renderMyListModal();
        openModal(el.myListModal);
        break;

      case "close-my-list":
        closeModal(el.myListModal);
        break;

      case "open-stats":
        renderStatsGrid();
        renderScanProgress();
        openModal(el.statsModal);
        break;

      case "close-stats":
        closeModal(el.statsModal);
        break;

      case "open-qr": {
        updateNetworkLabels();
        drawPseudoQr(el.qrUrl.textContent || window.location.href);
        openModal(el.qrModal);
        break;
      }

      case "close-qr":
        closeModal(el.qrModal);
        break;

      case "play-featured": {
        const id = Number(
          trigger.getAttribute("data-video-id") || el.heroListBtn.getAttribute("data-video-id")
        );
        if (id) {
          state.selectedVideoId = id;
          setPage("video");
        }
        break;
      }

      case "toggle-featured-list": {
        const id = Number(
          trigger.getAttribute("data-video-id") || el.heroListBtn.getAttribute("data-video-id")
        );
        if (id) toggleMyList(id);
        break;
      }

      case "open-video":
      case "play-video":
        if (Number.isFinite(videoId)) {
          state.selectedVideoId = videoId;
          closeAllModals();
          setPage("video");
        }
        break;

      case "toggle-list":
        if (Number.isFinite(videoId)) {
          toggleMyList(videoId);
          if (!el.myListModal.classList.contains("hidden")) {
            renderMyListModal();
          }
        }
        break;

      case "remove-continue":
        if (Number.isFinite(videoId)) {
          removeContinueWatching(videoId);
        }
        break;

      case "select-genre":
        state.selectedGenre = trigger.getAttribute("data-genre") || "All";
        renderGenresPage();
        break;

      case "search-open-video":
        if (Number.isFinite(videoId)) {
          addRecentSearch(state.searchTerm.trim());
          setQuery(state.searchTerm);
          closeModal(el.searchModal);
          state.selectedVideoId = videoId;
          setPage("video");
        }
        break;

      case "search-recent": {
        const term = trigger.getAttribute("data-term") || "";
        state.searchTerm = term;
        el.searchInput.value = term;
        renderSearchModalBody();
        break;
      }

      case "clear-recent-searches":
        state.recentSearches = [];
        persistRecentSearches();
        renderSearchModalBody();
        break;

      default:
        break;
    }
  });

  // Keyboard
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });

  // Auth
  el.loginForm.addEventListener("submit", handleLoginSubmit);

  el.guestTab.addEventListener("click", () => {
    state.authMode = "guest";
    renderLoginMode();
  });

  el.adminTab.addEventListener("click", () => {
    state.authMode = "admin";
    renderLoginMode();
  });

  // Search
  el.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const term = state.searchTerm.trim();
    setQuery(term);
    if (term) addRecentSearch(term);
    closeModal(el.searchModal);
    setPage("home");
    showToast(term ? `Search applied: ${term}` : "Search cleared", "info");
  });

  el.searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    renderSearchModalBody();
  });

  el.clearSearchButton.addEventListener("click", () => {
    state.searchTerm = "";
    el.searchInput.value = "";
    renderSearchModalBody();
    el.searchInput.focus();
  });

  // Stats / Scan
  el.rescanButton.addEventListener("click", () => {
    startScanSimulation();
  });

  // Settings forms
  el.mediaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = el.mediaRootInput.value.trim();
    if (!value) {
      setFormMessage(el.mediaFormMessage, "Media folder path is required.", "error");
      return;
    }

    const hasChanged = value !== state.mediaRoot;
    if (hasChanged) {
      const confirmed = window.confirm(
        "Changing media folder will clear existing library data and immediately start a new scan. Continue?"
      );
      if (!confirmed) return;
    }

    state.mediaRoot = value;
    state.mediaRootSource = "database";
    localStorage.setItem(STORAGE_KEYS.mediaRoot, state.mediaRoot);
    localStorage.setItem(STORAGE_KEYS.mediaRootSource, state.mediaRootSource);
    el.mediaRootSource.textContent = state.mediaRootSource;
    setFormMessage(el.mediaFormMessage, "Media folder updated successfully.", "success");
    showToast("Media folder updated.", "success");
    if (hasChanged) startScanSimulation();
  });

  el.pinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const pin = el.guestPinInput.value.trim();

    if (pin.length < 4) {
      setFormMessage(el.pinFormMessage, "PIN must be at least 4 characters.", "error");
      return;
    }

    state.guestPin = pin;
    localStorage.setItem(STORAGE_KEYS.guestPin, pin);
    el.guestPinInput.value = "";
    setFormMessage(el.pinFormMessage, "PIN updated successfully.", "success");
    showToast("Guest PIN updated.", "success");
  });

  el.tmdbForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const key = el.tmdbInput.value.trim();

    if (!key) {
      setFormMessage(el.tmdbVerifyMessage, "Please provide an API key or use clear.", "warn");
      return;
    }

    if (key.length < 16) {
      setFormMessage(el.tmdbVerifyMessage, "TMDB key validation failed. Use a longer key.", "error");
      return;
    }

    state.tmdbKey = key;
    localStorage.setItem(STORAGE_KEYS.tmdbKey, key);
    el.tmdbInput.value = "";
    setFormMessage(el.tmdbVerifyMessage, "TMDB API key updated successfully.", "success");
    showToast("TMDB key saved.", "success");
    renderHomePage();
  });

  el.clearTmdbButton.addEventListener("click", () => {
    state.tmdbKey = "";
    localStorage.removeItem(STORAGE_KEYS.tmdbKey);
    el.tmdbInput.value = "";
    setFormMessage(el.tmdbVerifyMessage, "TMDB API key cleared.", "warn");
    showToast("TMDB key cleared.", "info");
    renderHomePage();
  });

  el.passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const current = el.currentPasswordInput.value;
    const next = el.newPasswordInput.value;
    const confirm = el.confirmPasswordInput.value;

    if (!current || !next || !confirm) {
      setFormMessage(el.passwordFormMessage, "All password fields are required.", "error");
      return;
    }

    if (current !== state.adminPassword) {
      setFormMessage(el.passwordFormMessage, "Current password is invalid.", "error");
      return;
    }

    if (next !== confirm) {
      setFormMessage(el.passwordFormMessage, "New password and confirm password do not match.", "error");
      return;
    }

    state.adminPassword = next;
    localStorage.setItem(STORAGE_KEYS.adminPassword, state.adminPassword);
    el.currentPasswordInput.value = "";
    el.newPasswordInput.value = "";
    el.confirmPasswordInput.value = "";
    setFormMessage(el.passwordFormMessage, "Admin password updated successfully.", "success");
    showToast("Admin password updated.", "success");
  });
}
