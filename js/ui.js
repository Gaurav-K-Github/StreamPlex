function initializeElements() {
  el.loadingScreen = byId("loadingScreen");
  el.loginView = byId("loginView");
  el.loginCard = byId("loginCard");
  el.loginGrid = byId("loginGrid");
  el.loginNetworkLabel = byId("loginNetworkLabel");
  el.loginHeading = byId("loginHeading");
  el.loginError = byId("loginError");
  el.loginForm = byId("loginForm");
  el.guestTab = byId("guestTab");
  el.adminTab = byId("adminTab");
  el.guestFields = byId("guestFields");
  el.adminFields = byId("adminFields");
  el.loginEmail = byId("loginEmail");
  el.loginPassword = byId("loginPassword");
  el.loginPin = byId("loginPin");
  el.loginSubmit = byId("loginSubmit");

  el.appView = byId("appView");
  el.desktopNav = byId("desktopNav");
  el.mobileHeader = document.querySelector(".mobile-header");
  el.mobileNav = document.querySelector(".mobile-nav");
  el.profileButton = byId("profileButton");
  el.profileRoleLabel = byId("profileRoleLabel");
  el.networkLabelDesktop = byId("networkLabelDesktop");
  el.networkLabelMobile = byId("networkLabelMobile");

  el.homePage = byId("homePage");
  el.heroBackdrop = byId("heroBackdrop");
  el.heroTitle = byId("heroTitle");
  el.heroRating = byId("heroRating");
  el.heroYear = byId("heroYear");
  el.heroRuntime = byId("heroRuntime");
  el.heroGenres = byId("heroGenres");
  el.heroOverview = byId("heroOverview");
  el.heroPlayBtn = byId("heroPlayBtn");
  el.heroListBtn = byId("heroListBtn");
  el.homeAlerts = byId("homeAlerts");
  el.homeRows = byId("homeRows");

  el.genresPage = byId("genresPage");
  el.genresPageTitle = byId("genresPageTitle");
  el.genresResultCount = byId("genresResultCount");
  el.genreChips = byId("genreChips");
  el.genreGrid = byId("genreGrid");

  el.videoPage = byId("videoPage");
  el.videoBackdrop = byId("videoBackdrop");
  el.videoTitle = byId("videoTitle");
  el.videoMeta = byId("videoMeta");
  el.videoPlayer = byId("videoPlayer");
  el.videoOverview = byId("videoOverview");
  el.videoDebugInfo = byId("videoDebugInfo");

  el.settingsPage = byId("settingsPage");
  el.mediaRootSource = byId("mediaRootSource");
  el.mediaForm = byId("mediaForm");
  el.mediaRootInput = byId("mediaRootInput");
  el.mediaFormMessage = byId("mediaFormMessage");
  el.pinForm = byId("pinForm");
  el.guestPinInput = byId("guestPinInput");
  el.pinFormMessage = byId("pinFormMessage");
  el.tmdbForm = byId("tmdbForm");
  el.tmdbInput = byId("tmdbInput");
  el.tmdbVerifyMessage = byId("tmdbVerifyMessage");
  el.clearTmdbButton = byId("clearTmdbButton");
  el.passwordForm = byId("passwordForm");
  el.currentPasswordInput = byId("currentPasswordInput");
  el.newPasswordInput = byId("newPasswordInput");
  el.confirmPasswordInput = byId("confirmPasswordInput");
  el.passwordFormMessage = byId("passwordFormMessage");

  el.searchModal = byId("searchModal");
  el.searchInput = byId("searchInput");
  el.searchForm = byId("searchForm");
  el.searchModalBody = byId("searchModalBody");
  el.clearSearchButton = byId("clearSearchButton");

  el.myListModal = byId("myListModal");
  el.myListCountText = byId("myListCountText");
  el.myListContent = byId("myListContent");

  el.statsModal = byId("statsModal");
  el.scanPercentLabel = byId("scanPercentLabel");
  el.scanProgressBar = byId("scanProgressBar");
  el.discoverCount = byId("discoverCount");
  el.analyzeCount = byId("analyzeCount");
  el.enrichCount = byId("enrichCount");
  el.rescanButton = byId("rescanButton");
  el.statsGrid = byId("statsGrid");

  el.qrModal = byId("qrModal");
  el.qrCanvas = byId("qrCanvas");
  el.qrUrl = byId("qrUrl");

  el.toastRoot = byId("toastRoot");
}

function updateAdminVisibility() {
  const isAdmin = state.role === "admin";

  document.querySelectorAll(".admin-only").forEach((node) => {
    node.classList.toggle("hidden", !isAdmin);
  });

  if (el.profileRoleLabel) {
    el.profileRoleLabel.textContent = isAdmin ? "Admin" : "Guest";
  }

  if (el.profileButton) {
    el.profileButton.classList.toggle("hidden", !isAdmin);
  }
}

function hideLoadingScreen() {
  if (!el.loadingScreen) return;
  el.loadingScreen.classList.add("fade-out");
  setTimeout(() => {
    el.loadingScreen.classList.add("hidden");
  }, 320);
}

function showLoginView() {
  closeAllModals();
  el.appView.classList.add("hidden");
  el.loginView.classList.remove("hidden");
  setTimeout(() => {
    el.loginCard.classList.add("visible");
  }, 60);
  renderLoginMode();
}

function showAppView() {
  el.loginView.classList.add("hidden");
  el.appView.classList.remove("hidden");
  el.loginCard.classList.remove("visible");
  updateAdminVisibility();
  setPage(state.activePage || "home");
}

function setPage(pageName) {
  if (pageName === "settings" && state.role !== "admin") {
    showToast("Settings are only available for admin.", "warn");
    pageName = "home";
  }

  state.activePage = pageName;

  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active", page.id === `${pageName}Page`);
  });

  const hideMobileNav = pageName === "video";
  el.mobileHeader.classList.toggle("hidden", hideMobileNav);
  el.mobileNav.classList.toggle("hidden", hideMobileNav);

  document.querySelectorAll("[data-mobile-nav]").forEach((node) => {
    const isActive = node.getAttribute("data-mobile-nav") === pageName;
    node.classList.toggle("active", isActive);
  });

  if (pageName === "home") {
    renderHomePage();
  } else if (pageName === "genres") {
    renderGenresPage();
  } else if (pageName === "video") {
    renderVideoPage();
  } else if (pageName === "settings") {
    renderSettingsPage();
  }
}

function openModal(modalElement) {
  if (!modalElement) return;
  modalElement.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeModal(modalElement) {
  if (!modalElement) return;
  modalElement.classList.add("hidden");

  const stillOpen = [el.searchModal, el.myListModal, el.statsModal, el.qrModal].some(
    (node) => node && !node.classList.contains("hidden")
  );

  if (!stillOpen) {
    document.body.classList.remove("modal-open");
  }
}

function closeAllModals() {
  closeModal(el.searchModal);
  closeModal(el.myListModal);
  closeModal(el.statsModal);
  closeModal(el.qrModal);
}

function showToast(message, tone = "info") {
  if (!message) return;

  const toast = document.createElement("div");
  toast.className = `toast ${tone}`;
  toast.textContent = message;
  el.toastRoot.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(6px)";
    setTimeout(() => toast.remove(), 220);
  }, 3000);
}

function updateNetworkLabels() {
  const host = window.location.hostname || "127.0.0.1";
  const port = window.location.port || (window.location.protocol === "https:" ? "443" : "80");
  const fullLabel = `${host}:${port}`;

  if (el.loginNetworkLabel) el.loginNetworkLabel.textContent = `${host} - local network`;
  if (el.networkLabelDesktop) el.networkLabelDesktop.textContent = `${fullLabel} - local network`;
  if (el.networkLabelMobile) el.networkLabelMobile.textContent = fullLabel;
  if (el.qrUrl) {
    const protocol = window.location.protocol || "http:";
    const url = `${protocol}//${fullLabel}`;
    el.qrUrl.href = url;
    el.qrUrl.textContent = url;
  }
}

function setFormMessage(node, message, tone = "") {
  if (!node) return;
  node.textContent = message || "";
  node.classList.remove("success", "error", "warn");
  if (tone) node.classList.add(tone);
}
