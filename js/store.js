function hydrateState() {
  state.isLoggedIn = localStorage.getItem(STORAGE_KEYS.session) === "1";
  state.role = localStorage.getItem(STORAGE_KEYS.role) || "guest";

  const savedList = safeJSONParse(localStorage.getItem(STORAGE_KEYS.myList), []);
  state.myList = new Set(Array.isArray(savedList) ? savedList : []);

  const savedRecent = safeJSONParse(localStorage.getItem(STORAGE_KEYS.recentSearches), []);
  state.recentSearches = Array.isArray(savedRecent) ? savedRecent.slice(0, 6) : [];

  state.guestPin = localStorage.getItem(STORAGE_KEYS.guestPin) || DEFAULT_GUEST_PIN;
  state.mediaRoot = localStorage.getItem(STORAGE_KEYS.mediaRoot) || DEFAULT_MEDIA_ROOT;
  state.mediaRootSource = localStorage.getItem(STORAGE_KEYS.mediaRootSource) || "database";
  state.tmdbKey = localStorage.getItem(STORAGE_KEYS.tmdbKey) || "";
  state.adminEmail = localStorage.getItem(STORAGE_KEYS.adminEmail) || "admin@streamplex.local";
  state.adminPassword = localStorage.getItem(STORAGE_KEYS.adminPassword) || "admin123";
}

function persistList() {
  localStorage.setItem(STORAGE_KEYS.myList, JSON.stringify(Array.from(state.myList)));
}

function persistRecentSearches() {
  localStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(state.recentSearches.slice(0, 6)));
}

function persistSession() {
  localStorage.setItem(STORAGE_KEYS.session, state.isLoggedIn ? "1" : "0");
  localStorage.setItem(STORAGE_KEYS.role, state.role);
}

function addRecentSearch(term) {
  if (!term) return;
  state.recentSearches = [
    term,
    ...state.recentSearches.filter((entry) => entry.toLowerCase() !== term.toLowerCase())
  ].slice(0, 6);
  persistRecentSearches();
}

function toggleMyList(videoId) {
  if (state.role !== "admin") {
    showToast("Only admin can modify My List.", "warn");
    return;
  }

  if (state.myList.has(videoId)) {
    state.myList.delete(videoId);
    showToast("Removed from My List", "info");
  } else {
    state.myList.add(videoId);
    showToast("Added to My List", "success");
  }

  persistList();
  renderHomePage();
  renderGenresPage();
  if (!el.myListModal.classList.contains("hidden")) {
    renderMyListModal();
  }
}

function removeContinueWatching(videoId) {
  const video = MOCK_VIDEOS.find((entry) => entry.id === videoId);
  if (!video) return;

  video.progressSeconds = 0;
  video.completed = true;
  showToast("Removed from Continue Watching", "info");

  renderHomePage();
  renderStatsGrid();
}

function setQuery(query) {
  state.query = query.trim();
  renderHomePage();
  renderGenresPage();
}
