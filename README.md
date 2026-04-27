# StreamPlex
> **⚠️ Prototype Notice**  
> This is a front-end prototype demonstrating the UI/UX design of the StreamPlex platform. The full production version with backend integration and actual media streaming capabilities is currently under development.

---

## 📋 Overview

StreamPlex is a front-end prototype for a modern, self-hosted media server designed to deliver a polished, responsive interface for browsing and streaming media from a local network. Built to replicate the experience of popular streaming platforms, this prototype showcases sophisticated UI/UX implementation using vanilla web technologies.

**Built with:** HTML5, CSS3, and Vanilla JavaScript (ES6+) — no frameworks required.

---

## ✨ Key Features

### 🔐 Dual-Mode Authentication
- **Admin Access**: Secure login with email and password for full system control
- **Guest Access**: PIN-based authentication for easy friend and family access on the local network

### 📱 Responsive Design
A fluid, adaptive interface providing seamless experiences across:
- Desktop computers
- Tablets
- Mobile devices

### 🏠 Dynamic Home Page
- **Hero Section**: Full-screen featured media showcase
- **Content Rows**: Horizontally scrolling categories including:
  - Continue Watching
  - Recent Additions
  - Genre-specific collections
- **Skeleton Loaders**: Smooth loading transitions

### 🎬 Comprehensive Media Browsing

#### Genres Page
- Filterable grid view of entire library
- Browse by specific genres

#### My List
- Admin-only feature
- Save and quickly access favorite titles

#### Search Functionality
- Powerful search modal
- Search by title or genre
- Recent search history tracking

### 🎥 Video Player Page
- Dedicated page for each video
- Large backdrop imagery
- Complete metadata display (rating, year, runtime)
- Detailed overview
- Integrated HTML5 video player
- Debug information showing media file processing status

### ⚙️ Admin Dashboard & Settings

#### Library Statistics
Modal displaying:
- Total movies count
- Storage usage metrics
- Continue Watching queue status

#### Simulated Library Scan
Visual simulation of media scanning with:
- **Discover Phase**: Find media files
- **Analyze Phase**: Process file information
- **Enrich Phase**: Fetch metadata
- Real-time progress tracking

#### Configuration Panel
Secure admin settings for:
- Media folder path configuration
- Guest Access PIN management
- TMDB API key setup and management
- Admin password updates

### 🎨 Enhanced User Experience
- **Toast Notifications**: Interactive feedback for user actions (login, settings updates, list additions)
- **Connect Device**: QR code generation with server's local URL for easy multi-device access

---

## 🔧 How It Works

This is a **client-side prototype** that simulates a complete media server experience:

| Component | Implementation |
|-----------|----------------|
| **Data Source** | Mock dataset (`MOCK_VIDEOS` in `js/config.js`) |
| **Authentication** | Client-side simulation using `localStorage` |
| **Video Playback** | Placeholder video demonstrating player controls |
| **Library Scan** | Timed simulation with visual progress updates |
| **Settings** | Persisted to browser `localStorage` |
| **State Management** | Client-side JavaScript with no backend |

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure and video player |
| **CSS3** | Modern styling with Flexbox, Grid, custom properties, and animations |
| **Vanilla JavaScript (ES6+)** | Application logic, state management, and DOM manipulation |

**No build tools or frameworks required** — runs directly in the browser.

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: Local web server for optimal experience

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/Gaurav-K-Github/StreamPlex.git
```

2. **Navigate to the project directory**
```bash
   cd StreamPlex
```

3. **Launch the application**
   
   **Option A**: Direct file access
   - Open `index.html` in your browser
   
   **Option B**: Local server (recommended)
   - Use VS Code Live Server extension, or
   - Run: `python -m http.server 8000` (Python 3), or
   - Run: `npx serve`
   - Navigate to `http://localhost:8000`

---

## 🔑 Default Credentials

### Admin Login
- Email:    admin@streamplex.local 
- Password: admin123

### Guest Access
- PIN: 1234

---

## ⚠️ Prototype Limitations

This front-end prototype has the following constraints:

| Limitation | Description |
|------------|-------------|
| ❌ No Backend | All functionality is client-side simulation |
| ❌ Mock Data | Uses hardcoded sample data instead of real media files |
| ❌ No Persistence | Data stored only in browser `localStorage` |
| ❌ Simulated Scanning | Media processing is a visual simulation |
| ❌ Client Auth Only | Authentication is not secure (demonstration purposes) |
| ❌ No Real Streaming | Video playback uses placeholder content |

---

## 🗺️ Roadmap to Production

The main StreamPlex platform will include:

### Backend Infrastructure
- ✅ Node.js/Express server implementation
- ✅ RESTful API architecture
- ✅ PostgreSQL/MongoDB database integration
- ✅ Real-time WebSocket support

### Media Processing
- ✅ Actual media file discovery and scanning
- ✅ Video transcoding and optimization
- ✅ Thumbnail generation
- ✅ Metadata extraction

### Enhanced Features
- ✅ TMDB API integration for rich metadata
- ✅ Multi-user support with role-based access control
- ✅ Secure authentication with JWT tokens
- ✅ Network-wide media streaming protocols
- ✅ Mobile applications (iOS/Android)
- ✅ Advanced search with filters and recommendations
- ✅ Watch history and progress tracking
- ✅ Subtitle support and multiple audio tracks

---

## 📄 License

This project is currently unlicensed. License information will be added for the main project release.

---

## 👤 Author

**Gaurav Kumar**  
[![GitHub](https://img.shields.io/badge/GitHub-Gaurav--K--Github-181717?logo=github)](https://github.com/Gaurav-K-Github)

---

## 🎯 Status

**Current Phase:** 🚧 Front-End Prototype  
**Main Project:** 🔨 Under Active Development  
**Expected Release:** TBA

---

<div align="center">

**Built by Gaurav**

[Report Bug](https://github.com/Gaurav-K-Github/StreamPlex/issues) · [Request Feature](https://github.com/Gaurav-K-Github/StreamPlex/issues)

</div>
