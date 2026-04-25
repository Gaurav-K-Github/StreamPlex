// Storage key constants
const STORAGE_KEYS = {
  session: "sp.session.active",
  role: "sp.session.role",
  myList: "streamplex.myList",
  recentSearches: "streamplex.recentSearches",
  guestPin: "sp.auth.guestPin",
  mediaRoot: "sp.settings.mediaRoot",
  mediaRootSource: "sp.settings.mediaRootSource",
  tmdbKey: "sp.settings.tmdbKey",
  adminEmail: "sp.settings.adminEmail",
  adminPassword: "sp.settings.adminPassword"
};

const SAMPLE_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";
const DEFAULT_GUEST_PIN = "1234";
const DEFAULT_MEDIA_ROOT = "D:/Media/Movies";

const MOCK_VIDEOS = [
  {
    id: 1,
    title: "Blade Runner 2049",
    releaseYear: 2017,
    runtimeMinutes: 164,
    voteAverage: 8.0,
    overview:
      "Thirty years after the events of the first film, a new blade runner uncovers a secret with the power to reshape what remains of society.",
    genres: ["Sci-Fi", "Drama", "Action"],
    posterUrl: "https://picsum.photos/id/1011/400/600",
    backdropUrl: "https://picsum.photos/id/1011/1600/900",
    durationSeconds: 9840,
    progressSeconds: 4100,
    completed: false,
    lastWatchedAt: "2026-04-24T18:20:00Z",
    analysisStatus: "complete",
    metadataStatus: "complete",
    filePath: "D:/Media/Movies/Blade_Runner_2049.mkv",
    addedAt: "2026-03-11T12:00:00Z"
  },
  {
    id: 2,
    title: "Moonlight Protocol",
    releaseYear: 2025,
    runtimeMinutes: 126,
    voteAverage: 7.6,
    overview:
      "A covert analyst decrypts a rogue satellite signal that predicts political assassinations before they happen.",
    genres: ["Thriller", "Sci-Fi"],
    posterUrl: "https://picsum.photos/id/1012/400/600",
    backdropUrl: "https://picsum.photos/id/1012/1600/900",
    durationSeconds: 7560,
    progressSeconds: 1350,
    completed: false,
    lastWatchedAt: "2026-04-25T09:40:00Z",
    analysisStatus: "complete",
    metadataStatus: "complete",
    filePath: "D:/Media/Movies/Moonlight_Protocol.mp4",
    addedAt: "2026-03-25T08:00:00Z"
  },
  {
    id: 3,
    title: "Neon District",
    releaseYear: 2024,
    runtimeMinutes: 118,
    voteAverage: 7.3,
    overview:
      "In a flooded megacity, a courier discovers a memory chip that can expose the architecture controlling every citizen.",
    genres: ["Action", "Sci-Fi"],
    posterUrl: "https://picsum.photos/id/1013/400/600",
    backdropUrl: "https://picsum.photos/id/1013/1600/900",
    durationSeconds: 7080,
    progressSeconds: 0,
    completed: false,
    lastWatchedAt: "2026-04-20T20:15:00Z",
    analysisStatus: "complete",
    metadataStatus: "complete",
    filePath: "D:/Media/Movies/Neon_District.mkv",
    addedAt: "2026-04-10T12:30:00Z"
  },
  {
    id: 4,
    title: "Atlas Zero",
    releaseYear: 2023,
    runtimeMinutes: 141,
    voteAverage: 7.8,
    overview:
      "A deep-space navigator is forced to return to Earth when an AI colony starts rewriting mission logs in real time.",
    genres: ["Adventure", "Sci-Fi", "Drama"],
    posterUrl: "https://picsum.photos/id/1014/400/600",
    backdropUrl: "https://picsum.photos/id/1014/1600/900",
    durationSeconds: 8460,
    progressSeconds: 0,
    completed: false,
    lastWatchedAt: "2026-04-19T14:45:00Z",
    analysisStatus: "complete",
    metadataStatus: "needs_review",
    filePath: "D:/Media/Movies/Atlas_Zero.mp4",
    addedAt: "2026-02-09T17:00:00Z"
  },
  {
    id: 5,
    title: "Silent Harbor",
    releaseYear: 2021,
    runtimeMinutes: 102,
    voteAverage: 7.1,
    overview:
      "After a naval blackout, a salvage team enters an abandoned port where sonar maps reveal moving structures underwater.",
    genres: ["Thriller", "Mystery"],
    posterUrl: "https://picsum.photos/id/1015/400/600",
    backdropUrl: "https://picsum.photos/id/1015/1600/900",
    durationSeconds: 6120,
    progressSeconds: 0,
    completed: false,
    lastWatchedAt: "2026-04-18T11:10:00Z",
    analysisStatus: "complete",
    metadataStatus: "complete",
    filePath: "D:/Media/Movies/Silent_Harbor.mkv",
    addedAt: "2026-01-18T09:00:00Z"
  },
  {
    id: 6,
    title: "Vanta Fields",
    releaseYear: 2022,
    runtimeMinutes: 95,
    voteAverage: 6.9,
    overview:
      "A climate technician in the desert monitors crops that bloom only under synthetic eclipses.",
    genres: ["Drama", "Sci-Fi"],
    posterUrl: "https://picsum.photos/id/1016/400/600",
    backdropUrl: "https://picsum.photos/id/1016/1600/900",
    durationSeconds: 5700,
    progressSeconds: 0,
    completed: false,
    lastWatchedAt: "2026-04-14T16:00:00Z",
    analysisStatus: "complete",
    metadataStatus: "complete",
    filePath: "D:/Media/Movies/Vanta_Fields.mkv",
    addedAt: "2026-02-22T10:00:00Z"
  },
  {
    id: 7,
    title: "Orbital Echo",
    releaseYear: 2020,
    runtimeMinutes: 109,
    voteAverage: 7.4,
    overview:
      "A forgotten orbital station transmits one final distress loop from a crew that disappeared twelve years earlier.",
    genres: ["Sci-Fi", "Mystery"],
    posterUrl: "https://picsum.photos/id/1018/400/600",
    backdropUrl: "https://picsum.photos/id/1018/1600/900",
    durationSeconds: 6540,
    progressSeconds: 0,
    completed: false,
    lastWatchedAt: "2026-04-13T07:25:00Z",
    analysisStatus: "complete",
    metadataStatus: "complete",
    filePath: "D:/Media/Movies/Orbital_Echo.mp4",
    addedAt: "2026-03-03T09:15:00Z"
  },
  {
    id: 8,
    title: "Copper Rain",
    releaseYear: 2024,
    runtimeMinutes: 113,
    voteAverage: 7.2,
    overview:
      "A former detective returns to a rain-battered district where every camera feed loops exactly six minutes.",
    genres: ["Noir", "Thriller", "Drama"],
    posterUrl: "https://picsum.photos/id/1019/400/600",
    backdropUrl: "https://picsum.photos/id/1019/1600/900",
    durationSeconds: 6780,
    progressSeconds: 2980,
    completed: false,
    lastWatchedAt: "2026-04-26T08:10:00Z",
    analysisStatus: "complete",
    metadataStatus: "needs_review",
    filePath: "D:/Media/Movies/Copper_Rain.mp4",
    addedAt: "2026-04-17T10:00:00Z"
  },
  {
    id: 9,
    title: "Signal North",
    releaseYear: 2019,
    runtimeMinutes: 121,
    voteAverage: 6.8,
    overview:
      "A rescue pilot follows an encrypted beacon through polar storms and into an abandoned weather citadel.",
    genres: ["Adventure", "Thriller"],
    posterUrl: "https://picsum.photos/id/1020/400/600",
    backdropUrl: "https://picsum.photos/id/1020/1600/900",
    durationSeconds: 7260,
    progressSeconds: 0,
    completed: false,
    lastWatchedAt: "2026-04-12T06:35:00Z",
    analysisStatus: "complete",
    metadataStatus: "complete",
    filePath: "D:/Media/Movies/Signal_North.mkv",
    addedAt: "2026-03-14T13:00:00Z"
  },
  {
    id: 10,
    title: "Parallax Garden",
    releaseYear: 2023,
    runtimeMinutes: 107,
    voteAverage: 7.5,
    overview:
      "A botanical architect designs memory-reactive plants that reveal hidden versions of their caretakers.",
    genres: ["Drama", "Fantasy"],
    posterUrl: "https://picsum.photos/id/1021/400/600",
    backdropUrl: "https://picsum.photos/id/1021/1600/900",
    durationSeconds: 6420,
    progressSeconds: 0,
    completed: false,
    lastWatchedAt: "2026-04-11T09:50:00Z",
    analysisStatus: "complete",
    metadataStatus: "complete",
    filePath: "D:/Media/Movies/Parallax_Garden.mkv",
    addedAt: "2026-02-27T16:45:00Z"
  },
  {
    id: 11,
    title: "Obsidian Current",
    releaseYear: 2022,
    runtimeMinutes: 99,
    voteAverage: 6.7,
    overview:
      "An offshore energy colony faces an impossible tide pattern that appears to follow one engineer's heartbeat.",
    genres: ["Thriller", "Sci-Fi"],
    posterUrl: "https://picsum.photos/id/1022/400/600",
    backdropUrl: "https://picsum.photos/id/1022/1600/900",
    durationSeconds: 5940,
    progressSeconds: 0,
    completed: false,
    lastWatchedAt: "2026-04-10T18:12:00Z",
    analysisStatus: "complete",
    metadataStatus: "complete",
    filePath: "D:/Media/Movies/Obsidian_Current.mp4",
    addedAt: "2026-01-15T08:22:00Z"
  },
  {
    id: 12,
    title: "Paper Skies",
    releaseYear: 2024,
    runtimeMinutes: 116,
    voteAverage: 7.0,
    overview:
      "A city archivist discovers hand-drawn maps that update themselves whenever new surveillance zones are deployed.",
    genres: ["Mystery", "Drama"],
    posterUrl: "https://picsum.photos/id/1023/400/600",
    backdropUrl: "https://picsum.photos/id/1023/1600/900",
    durationSeconds: 6960,
    progressSeconds: 0,
    completed: false,
    lastWatchedAt: "2026-04-07T05:20:00Z",
    analysisStatus: "complete",
    metadataStatus: "complete",
    filePath: "D:/Media/Movies/Paper_Skies.mkv",
    addedAt: "2026-04-01T10:35:00Z"
  }
];

// Shared application state
const state = {
  isLoggedIn: false,
  role: "guest",
  activePage: "home",
  selectedGenre: "All",
  selectedVideoId: null,
  query: "",
  searchTerm: "",
  myList: new Set(),
  recentSearches: [],
  authMode: "guest",
  scan: {
    running: false,
    progress: 0,
    currentPhase: "discover",
    filesDiscovered: 156,
    filesAnalyzed: 0,
    filesEnriched: 0,
    totalFiles: 156,
    timer: null
  },
  storageGb: "742 GB",
  guestPin: DEFAULT_GUEST_PIN,
  mediaRoot: DEFAULT_MEDIA_ROOT,
  mediaRootSource: "database",
  tmdbKey: "",
  adminEmail: "admin@streamplex.local",
  adminPassword: "admin123"
};

// Shared DOM element cache (populated in ui.js)
const el = {};
