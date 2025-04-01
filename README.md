 Electron Music Player

A lightweight music player built with Electron. Play local MP3 files, view album art, and enjoy listening.
Features

✔️ Play local MP3 files from your computer
🖼️ Display album art extracted from MP3 metadata
📊 Progress bar with click-to-seek functionality
🔊 Volume control slider
🔄 Shuffle feature for randomized playback
▶️ Automatic next song playback
📱 Responsive design for different window sizes
📋 Playlist view with currently playing indicator
Prerequisites

Before you begin, ensure you have the following installed:

    Node.js (v14 or newer)

    npm (comes with Node.js)

Setup
1. Clone or Download the Repository

git clone https://github.com/DottedBlaNK/Electron-Music-Player.git
cd Electron-Music-Player

2. Install Dependencies

npm install

3. Run the Application

npm start

For Linux users: If you encounter sandbox errors, run:

npm start -- --no-sandbox

Building for Distribution

To create packaged applications for Windows, macOS, and Linux, run:

npx electron-packager . --overwrite --platform=win32,darwin,linux --arch=x64 --prune=true --out=release-builds

Usage

    Launch the application

    Click "Open Music Folder" to select a folder containing MP3 files

    Use the playback controls to manage your music:

        ▶ Play/Pause button toggles playback

        ⏮️ Previous / ⏭️ Next buttons change tracks

        ⏳ Click on the progress bar to seek

        🔊 Adjust volume with the slider

        🔀 Enable shuffle with the shuffle button

        📋 Click on a playlist item to play that song

Project Structure

📂 Electron-Music-Player
├── 📜 main.js          # Electron main process
├── 📜 index.html       # Application HTML layout
├── 🎨 styles.css       # Application styling
├── 🛠️ renderer.js      # Application logic and user interactions
├── 📜 package.json     # Project configuration
└── 📂 assets           # Static files (icons, images, etc.)

Dependencies

    Electron - Framework for building desktop apps

    jsmediatags - JavaScript library for reading MP3 metadata

    Font Awesome - Icon library
