// ── Home page ─────────────────────────────────────────────────────────────────

function renderHomeAlerts(visibleVideos) {
  el.homeAlerts.innerHTML = "";

  if (!visibleVideos.length) {
    const info = document.createElement("div");
    info.className = "alert info";
    info.textContent = "No media found. Adjust your search or simulate a rescan.";
    el.homeAlerts.appendChild(info);
  }

  if (state.scan.running) {
    const scanAlert = document.createElement("div");
    scanAlert.className = "alert warn";
    scanAlert.textContent = `Scan running: ${state.scan.progress}% complete.`;
    el.homeAlerts.appendChild(scanAlert);
  }
}

function renderHomeRows(visibleVideos) {
  el.homeRows.innerHTML = "";

  const continueWatching = getContinueWatching();

  if (state.role === "admin") {
    const continueRow = createMediaRow("Continue Watching", continueWatching, {
      showProgress: true,
      isLoading: false,
      emptyMessage: "Nothing to continue.",
      enableRemove: true
    });
    if (continueRow) el.homeRows.appendChild(continueRow);
  }

  const recentAdditions = visibleVideos.slice(2, 10);
  const recentRow = createMediaRow("Recent Additions", recentAdditions, {
    emptyMessage: "No recent additions available."
  });
  if (recentRow) el.homeRows.appendChild(recentRow);

  const genreMap = new Map();
  visibleVideos.forEach((video) => {
    video.genres.forEach((genre) => {
      if (!genreMap.has(genre)) genreMap.set(genre, []);
      genreMap.get(genre).push(video);
    });
  });

  Array.from(genreMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8)
    .forEach(([genre, list]) => {
      const row = createMediaRow(genre, list.slice(0, 12), {
        emptyMessage: `No titles in ${genre} yet.`
      });
      if (row) el.homeRows.appendChild(row);
    });

  if (!el.homeRows.children.length) {
    const emptyRow = createMediaRow("Library", [], {
      emptyMessage: "Set media location or run a rescan to populate your library."
    });
    if (emptyRow) el.homeRows.appendChild(emptyRow);
  }
}

function renderHomePage() {
  const visibleVideos = getVisibleVideos();
  const featured = getFeaturedVideo(visibleVideos);

  if (featured) {
    el.heroBackdrop.src = featured.backdropUrl;
    el.heroTitle.textContent = featured.title;
    el.heroRating.textContent = `Rating ${featured.voteAverage.toFixed(1)}`;
    el.heroYear.textContent = String(featured.releaseYear);
    el.heroRuntime.textContent = formatDuration(featured.runtimeMinutes);
    el.heroOverview.textContent = featured.overview;
    el.heroPlayBtn.setAttribute("data-video-id", String(featured.id));
    el.heroListBtn.setAttribute("data-video-id", String(featured.id));
    el.heroPlayBtn.disabled = false;
    el.heroListBtn.disabled = false;

    el.heroGenres.innerHTML = "";
    featured.genres.slice(0, 3).forEach((genre) => {
      el.heroGenres.appendChild(createChip(genre));
    });

    const inMyList = state.myList.has(featured.id);
    el.heroListBtn.innerHTML = `<span class="btn-icon">${inMyList ? "IN" : "+"}</span>${
      inMyList ? "In My List" : "My List"
    }`;
  } else {
    el.heroBackdrop.src = "https://picsum.photos/id/1011/1600/900";
    el.heroTitle.textContent = "No Matching Titles";
    el.heroRating.textContent = "Rating --";
    el.heroYear.textContent = "----";
    el.heroRuntime.textContent = "--";
    el.heroOverview.textContent = "Try a broader search or run a rescan to refresh the media library.";
    el.heroGenres.innerHTML = "";
    el.heroPlayBtn.removeAttribute("data-video-id");
    el.heroListBtn.removeAttribute("data-video-id");
    el.heroPlayBtn.disabled = true;
    el.heroListBtn.disabled = true;
    el.heroListBtn.innerHTML = "<span class=\"btn-icon\">+</span>My List";
  }

  renderHomeAlerts(visibleVideos);
  renderHomeRows(visibleVideos);
}

// ── Genres page ───────────────────────────────────────────────────────────────

function renderGenresPage() {
  const videos = getVisibleVideos();
  const genres = ["All", ...new Set(videos.flatMap((video) => video.genres))];

  if (!genres.includes(state.selectedGenre)) {
    state.selectedGenre = "All";
  }

  const filtered =
    state.selectedGenre === "All"
      ? videos
      : videos.filter((video) =>
          video.genres.some((genre) => genre.toLowerCase() === state.selectedGenre.toLowerCase())
        );

  el.genresPageTitle.textContent = state.selectedGenre === "All" ? "All Movies" : `${state.selectedGenre} Movies`;
  el.genresResultCount.textContent = `Showing ${filtered.length} results`;

  el.genreChips.innerHTML = "";
  genres.forEach((genre) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `genre-chip ${genre === state.selectedGenre ? "active" : ""}`;
    chip.textContent = genre;
    chip.setAttribute("data-action", "select-genre");
    chip.setAttribute("data-genre", genre);
    el.genreChips.appendChild(chip);
  });

  el.genreGrid.innerHTML = "";

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "genre-empty";
    empty.textContent = "No content found for this genre.";
    el.genreGrid.appendChild(empty);
    return;
  }

  filtered.forEach((video) => {
    const item = document.createElement("div");
    item.className = "genre-item";
    item.appendChild(createVideoCard(video));
    el.genreGrid.appendChild(item);
  });
}

// ── Video page ────────────────────────────────────────────────────────────────

function renderVideoPage() {
  const video = MOCK_VIDEOS.find((entry) => entry.id === state.selectedVideoId) || MOCK_VIDEOS[0];
  if (!video) return;

  el.videoBackdrop.src = video.backdropUrl;
  el.videoTitle.textContent = video.title;
  el.videoMeta.innerHTML = `<span>${video.releaseYear}</span><span>${formatDuration(video.runtimeMinutes)}</span><span>${video.genres.join(" | ")}</span>`;

  el.videoPlayer.src = SAMPLE_VIDEO_URL;
  el.videoPlayer.poster = video.posterUrl;
  el.videoOverview.textContent =
    video.overview || "No overview available for this media in the static prototype.";

  el.videoDebugInfo.innerHTML = `
    <div class="debug-line"><span class="debug-label">Analysis</span><span class="debug-value success">${video.analysisStatus}</span></div>
    <div class="debug-line"><span class="debug-label">Metadata</span><span class="debug-value ${
      video.metadataStatus === "needs_review" ? "warn" : "success"
    }">${video.metadataStatus}</span></div>
    <div class="debug-path">${video.filePath}</div>
  `;
}

// ── Settings page ─────────────────────────────────────────────────────────────

function renderSettingsPage() {
  el.mediaRootInput.value = state.mediaRoot;
  el.mediaRootSource.textContent = state.mediaRootSource;
  el.tmdbInput.value = "";
  setFormMessage(
    el.tmdbVerifyMessage,
    state.tmdbKey ? "TMDB key configured." : "TMDB key not configured.",
    state.tmdbKey ? "success" : "warn"
  );
}

// ── Search modal ──────────────────────────────────────────────────────────────

function renderSearchModalBody() {
  const term = state.searchTerm.trim().toLowerCase();
  el.searchModalBody.innerHTML = "";

  if (term) {
    const filtered = getVisibleVideos()
      .filter((video) => {
        const title = video.title.toLowerCase();
        const genreText = video.genres.join(" ").toLowerCase();
        return title.includes(term) || genreText.includes(term);
      })
      .slice(0, 10);

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "empty-note";
      empty.textContent = `No results found for "${state.searchTerm}".`;
      el.searchModalBody.appendChild(empty);
      return;
    }

    filtered.forEach((video) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-result";
      button.setAttribute("data-action", "search-open-video");
      button.setAttribute("data-video-id", String(video.id));
      button.innerHTML = `
        <img src="${video.posterUrl}" alt="${video.title} poster" />
        <span>
          <p class="search-result-title">${video.title}</p>
          <p class="search-result-meta">Library | ${video.releaseYear} | Rating ${video.voteAverage.toFixed(1)} | ${video.genres[0]}</p>
        </span>
      `;
      el.searchModalBody.appendChild(button);
    });

    return;
  }

  const top = document.createElement("div");
  top.style.display = "flex";
  top.style.alignItems = "center";
  top.style.justifyContent = "space-between";
  top.style.gap = "0.6rem";

  const eyebrow = document.createElement("p");
  eyebrow.className = "search-eyebrow";
  eyebrow.textContent = "Recent Searches";
  top.appendChild(eyebrow);

  if (state.recentSearches.length) {
    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "btn btn-secondary";
    clearButton.style.padding = "0.3rem 0.6rem";
    clearButton.style.fontSize = "0.72rem";
    clearButton.setAttribute("data-action", "clear-recent-searches");
    clearButton.textContent = "Clear";
    top.appendChild(clearButton);
  }

  el.searchModalBody.appendChild(top);

  if (!state.recentSearches.length) {
    const empty = document.createElement("p");
    empty.className = "empty-note";
    empty.textContent = "No recent searches yet.";
    el.searchModalBody.appendChild(empty);
    return;
  }

  state.recentSearches.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-recent";
    button.setAttribute("data-action", "search-recent");
    button.setAttribute("data-term", entry);
    button.innerHTML = `<span class="clock">R</span><span>${entry}</span>`;
    el.searchModalBody.appendChild(button);
  });
}

// ── My List modal ─────────────────────────────────────────────────────────────

function renderMyListModal() {
  const savedItems = Array.from(state.myList)
    .map((id) => MOCK_VIDEOS.find((video) => video.id === id))
    .filter(Boolean);

  el.myListCountText.textContent = `${savedItems.length} title${savedItems.length === 1 ? "" : "s"} saved`;
  el.myListContent.innerHTML = "";

  if (!savedItems.length) {
    const empty = document.createElement("p");
    empty.className = "empty-note";
    empty.textContent = "Nothing in My List yet.";
    el.myListContent.appendChild(empty);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "my-list-grid";

  savedItems.forEach((video) => {
    const item = document.createElement("article");
    item.className = "my-list-item";
    item.setAttribute("data-action", "open-video");
    item.setAttribute("data-video-id", String(video.id));

    item.innerHTML = `
      <img src="${video.posterUrl}" alt="${video.title} poster" />
      <div class="item-meta">
        <p class="my-list-title">${video.title}</p>
        <p class="my-list-year">${video.releaseYear}</p>
      </div>
    `;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "my-list-remove";
    remove.textContent = "x";
    remove.setAttribute("data-action", "toggle-list");
    remove.setAttribute("data-video-id", String(video.id));
    item.appendChild(remove);

    grid.appendChild(item);
  });

  el.myListContent.appendChild(grid);
}

// ── Stats modal ───────────────────────────────────────────────────────────────

function getStatsCards() {
  const visibleVideos = getVisibleVideos();
  const continueWatching = getContinueWatching();
  const cards = [
    {
      icon: "MOV",
      value: String(visibleVideos.length),
      label: "Movies",
      trend: "In library",
      meta: "Total",
      alert: false
    },
    {
      icon: "TV",
      value: "0",
      label: "TV Shows",
      trend: "Coming soon",
      meta: "Upcoming",
      alert: false
    }
  ];

  if (state.role === "admin") {
    cards.push({
      icon: "CW",
      value: String(continueWatching.length),
      label: "Continue Watching",
      trend: "In progress",
      meta: "Active",
      alert: false
    });
  }

  cards.push({
    icon: "DSK",
    value: state.storageGb,
    label: "Media Folder Size",
    trend: "Used capacity",
    meta: "Storage",
    alert: true
  });

  return cards;
}

function renderStatsGrid() {
  const cards = getStatsCards();
  el.statsGrid.innerHTML = "";

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "stat-card";
    article.innerHTML = `
      <div class="stat-head">
        <span class="stat-icon ${card.alert ? "alert" : ""}">${card.icon}</span>
        <span class="stat-meta">${card.meta}</span>
      </div>
      <p class="stat-value">${card.value}</p>
      <p class="stat-label">${card.label}</p>
      <p class="stat-trend">${card.trend}</p>
    `;
    el.statsGrid.appendChild(article);
  });
}
