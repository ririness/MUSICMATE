# MusicMate 🎵

MusicMate is a sleek, modern, web-based music streaming dashboard and audio player. It allows users to upload local audio tracks, read and parse ID3 metadata tags (including embedded album art and synced lyrics), organize songs into custom playlists, and manage a favorites list. 

The application features a clean view-switching layout, responsive sidebars, dynamic sorting, and local data persistence for recent tracks and custom lyric edits.

---

## 🚀 Features

* **Dual View Navigation:** Seamlessly toggle between a structured **Home Dashboard** overview and a fully immersive **Now Playing Interface**.
* **Local File Parsing:** Upload multiple audio tracks simultaneously. The app parses ID3 tags (Title, Artist, Genre, Album Art, and Lyrics) on the fly using `jsmediatags`.
* **Interactive Controls:** Smooth progress bar seeking, interactive volume slider dropdown, and built-in **Shuffle** toggle mechanics.
* **Custom Lyrics Editor:** View embedded lyrics or use the interactive edit mode to type, update, and save your own lyrics directly to your local web storage.
* **Playlist & Favorites Engine:** Create custom playlist folders, add/remove songs on the fly, and toggle a dedicated quick-access Favorites list.
* **Persistent Tracking:** Automatically records recently played tracks and saves custom lyrics using browser `localStorage`.
* **Responsive Architecture:** Collapsible left and right control sidebars for a clean workspace, paired with an integrated **Dark / Light Mode** theme switch.

---

## 📖 How to Use the Playlist System

The application comes with a dynamic, folder-based playlist manager that synchronizes across both the Dashboard and Player views. Here is how to use it:

### 1. Creating a Playlist
* Navigate to the **Now Playing** view using the top menu.
* Look at the left sidebar panel under the **Playlists** header.
* Click the maroon **Create** button.
* Type your desired name in the browser prompt (e.g., *"Chill Vibes"* or *"Study Session"*) and hit OK. Your new playlist folder will instantly appear in the sidebar and on your Home Dashboard.

### 2. Adding Tracks to a Playlist
* Ensure you have added tracks to the app using the **+ Add Tracks** button in the top navigation bar.
* In the right sidebar (**Songs** list), find the song you want to organize.
* Click the **+ Add** button next to that song's name to open the drop-down menu of your available playlists.
* Click on the target playlist name. The song is now instantly linked to that folder!

### 3. Managing and Playing Playlist Folders
* **Collapse/Expand:** Click anywhere on a playlist's header in the left sidebar to open or close its contents smoothly.
* **Play from Sidebar:** Expand the playlist folder in the left sidebar and click directly on a song title to load and play it immediately.
* **Play from Dashboard:** Go to the **Home** view. Your custom playlists will display as styled music cards showing their first track's album artwork and total song count. Clicking a playlist card will automatically jump you to the player and begin playing the first song in that list.
* **Removing a Track:** To remove a single song from a folder, expand it in the left sidebar and click the trash bin icon (`🗑️`) next to the song title.
* **Deleting a Playlist:** To delete an entire playlist folder entirely, click the close icon (`✕`) on the right side of the playlist's header.

---

## 📂 File Architecture

For proper compilation and deployment, ensure your directory layout is structured exactly as follows:

```plaintext
MusicMate/
│
├── index.html       # Structural layout and CDN dependencies
├── style.css        # Core interface styling, theme logic, and animations
├── app.js           # Media engine, system logic, and data tracking
└── README.md        # Documentation and project manual