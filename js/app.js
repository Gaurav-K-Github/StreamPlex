function initializeApp() {
  initializeElements();
  createLoginGrid();
  hydrateState();
  updateNetworkLabels();
  bindStaticEvents();

  renderStatsGrid();
  renderScanProgress();

  setTimeout(() => {
    hideLoadingScreen();

    if (state.isLoggedIn) {
      showAppView();
    } else {
      showLoginView();
    }
  }, 750);
}

initializeApp();
