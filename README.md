# 🎵 Async Jam - Spectacles AR Music Creation

> XR Hackathon 2025 Project  
> Creating collaborative music experiences in AR, one voice at a time.

## 📝 Project Overview

**Async Jam** combines Voice Playback and Connected Lenses to enable collaborative music creation in augmented reality. Users can leave audio tracks and build upon others' contributions, with a limit of 5 simultaneous voices to create harmonious compositions.

The name "Async Jam" reflects the asynchronous nature of collaboration - musicians can contribute their parts at different times, building layers of sound that come together in a shared AR space.


## 🛠️ Tech Stack

- **Platform**: Snap Spectacles
- **IDE**: Lens Studio 5.x
- **Language**: TypeScript
- **Key APIs**:
  - Connected Lenses (Multiplayer sync)
  - Audio API (Voice recording & playback)
  - Spectacles Interaction Kit (Hand gestures)
  - Spectacles Sync Kit (Real-time synchronization)

## 👥 Team

- Angela, JR, Baidi, Yohan

## ✨ Features

### MVP (Minimum Viable Product)
- [ ] Voice recording (single track)
- [ ] Voice playback
- [ ] Basic Connected Lens setup (2+ users)
- [ ] Simple UI for record/play controls
- [ ] Track limit enforcement (max 5 voices)

### Stretch Goals
- [ ] Spatial audio positioning
- [ ] Visual feedback for each voice track
- [ ] Volume/mix controls per track
- [ ] Export/share functionality
- [ ] Gesture-based controls

## 📂 Project Structure
```
community-chorus-spectacles/
├── LensStudio/           # Lens Studio project files
├── docs/                 # Documentation
│   ├── design/          # Design specs & wireframes
│   └── screenshots/     # Progress screenshots
├── presentation/         # Demo materials
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- [Lens Studio](https://ar.snap.com/lens-studio) (Latest version)

### Installation
1. Clone this repository
```bash
   git clone https://github.com/baidiwang/async-jam.git
   cd async-jam
```

2. Open Lens Studio and load the project from `LensStudio/` folder

3. Set up external editor (VS Code recommended)
   - Lens Studio > Preferences > Editors
   - Check TypeScript and JavaScript boxes


## 🎯 Hackathon Goals

- Create a functional multi-user voice collaboration experience
- Demonstrate proficiency with Spectacles APIs
- Deliver polished demo for presentation

## 📱 Demo

[Demo video/screenshots coming soon]

## 📄 License

MIT License - see LICENSE file for details
