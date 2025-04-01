Electron Music Player



Features

🎵 Play local MP3 files from your computer
🖼️ Display album art extracted from MP3 metadata
📊 Progress bar with click-to-seek functionality
🔊 Volume control slider
🔄 Shuffle feature for randomized playback
▶️ Automatic playback of the next song
📱 Responsive design for different window sizes
📋 Playlist view with currently playing indicator

Prerequisites

Node.js (v14 or newer)
npm (comes with Node.js)

Setup

Clone or download this repository

git clone https://github.com/DottedBlaNK/Electron-Music-Player.git

Install dependencies

npm install

Run the application

npm start



To start the application with sandbox disabled (if you encounter sandbox errors on Linux):

npm start -- --no-sandbox



Building for distribution
Create packaged applications for Windows, macOS, and Linux:

npx electron-packager . --overwrite --platform=win32,darwin,linux --arch=x64 --prune=true --out=release-builds


Usage

Launch the application
Click "Open Music Folder" to select a folder containing MP3 files
Use the playback controls to manage your music:

Play/Pause button toggles playback
Previous/Next buttons change tracks
Click on the progress bar to seek
Adjust volume with the slider
Enable shuffle with the shuffle button
Click on a playlist item to play that song


Project Structure

main.js - Electron main process
index.html - Application HTML layout
styles.css - Application styling
renderer.js - Application logic and user interactions
package.json - Project configuration


Dependencies

Electron - Framework for creating native applications with web technologies
jsmediatags - Pure JavaScript library to read metadata from audio files
Font Awesome - Icon library




