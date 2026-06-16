# Task List

- [x] Fix blank white page & slow load performance
  - [x] Remove unused blocking `model-viewer` script in `index.html`
  - [x] Show `LoadingScreen` in `AuthContext.jsx` while initializing
- [x] Optimize hero section image loading
  - [x] Update hero background image path to WebP in `HomePage.jsx`
  - [x] Preload optimized WebP background image in `index.html`
- [x] Refactor Comprehensive Demo Report display in `HomePage.jsx`
  - [x] Remove custom headers, download, and open-in-tab buttons
  - [x] Increase container height to 900px for full A4 display
  - [x] Add PDF toolbar suppression parameter `#toolbar=0&navpanes=0&scrollbar=0` to source
- [x] Integrate backend APIs into Patient Portal pages
  - [x] Fetch real appointments and handle status changes/cancels in `AppointmentsPage.jsx`
  - [x] Fetch real reports and implement HTML viewer/download in `ReportsPage.jsx`
- [x] Verify build and functionality
