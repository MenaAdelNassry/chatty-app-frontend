// -------------------------------------------------------------------------
// 📚 STUDY TOPIC: WEBPACK ASSET OPTIMIZATION (Why use 'src' vs 'public'?)
//
// TODO: 🧠 CONCEPT 1: CACHE BUSTING (File Hashing)
// The Build tool renames files based on content (e.g., 'logo.png' -> 'logo.5f4d2a.png').
// WHY? To force browsers to download the new version if the file changes, preventing stale cache issues.
// NOTE: Files in 'public' keep their original names, causing potential caching problems on updates.
//
// TODO: ⚡ CONCEPT 2: DATA URI ENCODING (Base64)
// Small images (< 10KB) imported in 'src' are converted into text strings inside the JS bundle.
// WHY? To reduce the number of HTTP requests (Network round-trips), making the app load faster.
// -------------------------------------------------------------------------