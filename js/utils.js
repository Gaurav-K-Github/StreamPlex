function byId(id) {
  return document.getElementById(id);
}

function safeJSONParse(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatProgress(secs, totalSecs) {
  if (!totalSecs) return 0;
  return Math.max(0, Math.min(100, Math.round((secs / totalSecs) * 100)));
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getVisibleVideos() {
  const q = state.query.trim().toLowerCase();
  if (!q) return MOCK_VIDEOS.slice();

  return MOCK_VIDEOS.filter((video) => {
    const title = video.title.toLowerCase();
    const genreText = video.genres.join(" ").toLowerCase();
    return title.includes(q) || genreText.includes(q);
  });
}

function getContinueWatching() {
  return MOCK_VIDEOS.filter((video) => !video.completed && video.progressSeconds > 0).sort(
    (a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime()
  );
}

function getFeaturedVideo(videos) {
  if (!videos.length) return null;
  const seed = new Date().getDate();
  return videos[seed % videos.length];
}
