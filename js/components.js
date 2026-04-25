function createChip(label) {
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = label;
  return chip;
}

function createIconButton(symbol, title, action, data = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "icon-ghost";
  button.title = title;
  button.setAttribute("data-action", action);

  Object.entries(data).forEach(([key, value]) => {
    button.setAttribute(`data-${key}`, String(value));
  });

  button.innerHTML = symbol;
  return button;
}

function createVideoCard(video, options = {}) {
  const card = document.createElement("article");
  card.className = "video-card";

  const media = document.createElement("div");
  media.className = "video-card-media";

  const image = document.createElement("img");
  image.className = "video-card-image";
  image.src = video.posterUrl;
  image.alt = `${video.title} poster`;
  media.appendChild(image);

  if (video.durationSeconds) {
    const hdBadge = document.createElement("span");
    hdBadge.className = "card-badge right";
    hdBadge.textContent = "HD";
    media.appendChild(hdBadge);
  }

  if (options.showProgress && video.progressSeconds > 0) {
    const resumeBadge = document.createElement("span");
    resumeBadge.className = "card-badge left";
    resumeBadge.textContent = "Resume";
    media.appendChild(resumeBadge);

    const progressTrack = document.createElement("div");
    progressTrack.className = "card-progress-track";
    const progressValue = document.createElement("div");
    progressValue.className = "card-progress-value";
    progressValue.style.width = `${formatProgress(video.progressSeconds, video.durationSeconds)}%`;
    progressTrack.appendChild(progressValue);
    media.appendChild(progressTrack);
  }

  const hover = document.createElement("div");
  hover.className = "video-card-hover";

  const hoverActions = document.createElement("div");
  hoverActions.className = "video-card-actions";

  if (state.role === "admin") {
    const listBtn = createIconButton(
      state.myList.has(video.id) ? "IN" : "+",
      "Toggle My List",
      "toggle-list",
      { videoId: video.id }
    );
    if (state.myList.has(video.id)) {
      listBtn.classList.add("active");
    }
    hoverActions.appendChild(listBtn);
  } else {
    const empty = document.createElement("span");
    empty.className = "icon-ghost";
    empty.style.visibility = "hidden";
    hoverActions.appendChild(empty);
  }

  if (options.enableRemove) {
    const removeBtn = createIconButton("x", "Remove from Continue Watching", "remove-continue", {
      videoId: video.id
    });
    hoverActions.appendChild(removeBtn);
  } else {
    const empty = document.createElement("span");
    empty.className = "icon-ghost";
    empty.style.visibility = "hidden";
    hoverActions.appendChild(empty);
  }

  hover.appendChild(hoverActions);

  const playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.className = "card-play-btn";
  playBtn.setAttribute("data-action", "play-video");
  playBtn.setAttribute("data-video-id", String(video.id));
  playBtn.textContent = options.showProgress && video.progressSeconds > 0 ? "Resume" : "Play";
  hover.appendChild(playBtn);

  const title = document.createElement("p");
  title.className = "card-title";
  title.textContent = video.title;
  hover.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "card-meta";
  meta.textContent = `${video.releaseYear} | ${formatDuration(video.runtimeMinutes)}`;
  hover.appendChild(meta);

  media.appendChild(hover);

  media.setAttribute("data-action", "open-video");
  media.setAttribute("data-video-id", String(video.id));

  card.appendChild(media);

  const footer = document.createElement("div");
  footer.className = "video-card-footer";
  footer.innerHTML = `<h4>${video.title}</h4><p>${video.releaseYear}</p>`;
  card.appendChild(footer);

  return card;
}

function createSkeletonCard() {
  const wrapper = document.createElement("div");
  wrapper.className = "skeleton-card";
  wrapper.innerHTML = `
    <div class="skeleton-media"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line short"></div>
  `;
  return wrapper;
}

function createMediaRow(title, items, options = {}) {
  const row = document.createElement("section");
  row.className = "media-row";

  const header = document.createElement("div");
  header.className = "media-row-header";

  const titleEl = document.createElement("h2");
  titleEl.className = "media-row-title";
  titleEl.textContent = title;

  const nav = document.createElement("div");
  nav.className = "row-nav";

  const leftBtn = document.createElement("button");
  leftBtn.type = "button";
  leftBtn.innerHTML = "<";

  const rightBtn = document.createElement("button");
  rightBtn.type = "button";
  rightBtn.innerHTML = ">";

  nav.append(leftBtn, rightBtn);
  header.append(titleEl, nav);
  row.appendChild(header);

  if (options.isLoading) {
    const loadingScroller = document.createElement("div");
    loadingScroller.className = "row-scroll";
    for (let i = 0; i < 5; i += 1) {
      const item = document.createElement("div");
      item.className = "row-item";
      item.appendChild(createSkeletonCard());
      loadingScroller.appendChild(item);
    }
    row.appendChild(loadingScroller);
    return row;
  }

  if (!items || items.length === 0) {
    if (!options.emptyMessage) return null;
    const empty = document.createElement("p");
    empty.className = "empty-row-note";
    empty.textContent = options.emptyMessage;
    row.appendChild(empty);
    return row;
  }

  const scroller = document.createElement("div");
  scroller.className = "row-scroll";

  items.forEach((video) => {
    const item = document.createElement("div");
    item.className = "row-item";
    item.appendChild(
      createVideoCard(video, {
        showProgress: Boolean(options.showProgress),
        enableRemove: Boolean(options.enableRemove)
      })
    );
    scroller.appendChild(item);
  });

  row.appendChild(scroller);

  leftBtn.addEventListener("click", () => {
    scroller.scrollBy({ left: -Math.round(scroller.clientWidth * 0.75), behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    scroller.scrollBy({ left: Math.round(scroller.clientWidth * 0.75), behavior: "smooth" });
  });

  return row;
}
