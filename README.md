# 🎓 Virtual Classroom 3D - BST Project

A professional, interactive 3D virtual classroom built with Three.js, featuring an integrated PDF viewer, realistic lighting, and animated characters.

![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=flat-square&logo=three.js)
![PDF.js](https://img.shields.io/badge/PDF.js-3.11-red?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)

## ✨ Features

### 🏫 Complete 3D Classroom Environment
- Fully modeled classroom with walls, floor, ceiling, and windows
- Realistic lighting system with ambient, directional, point, and spot lights
- Professional shadow rendering for depth and realism
- Procedurally generated textures (wood, floor tiles, walls, blackboard)

### 👥 Characters
- **20 Students** seated at desks with diverse appearances
- **1 Teacher** standing at the front of the classroom
- Subtle animations: students swaying, teacher gesturing
- Simple geometric models with varied skin tones and clothing colors

### 🪑 Furniture
- **20 Student Desks** with chairs arranged in a 5×4 grid
- **Teacher's Desk** at the front
- **Blackboard** with wooden frame and chalk tray
- **3D "BST" Text** displayed prominently above the board

### 📄 PDF Viewer Integration
- Upload PDF files and view them directly in the 3D scene
- PDF rendered as a texture on a plane in front of the blackboard
- Page navigation with buttons or keyboard arrows
- Maintains aspect ratio and quality
- Real-time page updates

### 🎮 Interactive Controls
- **OrbitControls**: Smooth camera rotation, pan, and zoom
- **Keyboard Shortcuts**:
  - `Space` - Reset camera to default view
  - `F` - Focus on the blackboard
  - `R` - Toggle auto-rotation
  - `Arrow Keys` - Navigate PDF pages
- **UI Buttons**: Reset view, focus board, toggle settings
- **Auto-rotate** option for presentations

### ⚡ Performance
- Optimized rendering with shadows and anti-aliasing
- Real-time FPS counter with color-coded performance indicator
- Responsive design for different screen sizes
- Smooth 60 FPS on modern hardware

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Local web server (for loading ES modules)

### Installation

1. **Clone or download** this project to your local machine

2. **Start a local web server** in the project directory:

   **Option 1: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option 2: Using Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```

   **Option 3: Using VS Code**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

## 📖 Usage

### Basic Navigation
1. **Rotate Camera**: Left-click and drag
2. **Pan Camera**: Right-click and drag
3. **Zoom**: Scroll wheel
4. **Reset View**: Click "Reset View" button or press `Space`
5. **Focus Board**: Click "Focus Board" button or press `F`

### PDF Viewing
1. Click the **"Upload PDF"** button in the control panel
2. Select a PDF file from your computer
3. Use **"Previous"** and **"Next"** buttons to navigate pages
4. Alternatively, use **Arrow Keys** (← →) for navigation
5. The PDF appears on a plane in front of the blackboard

### Settings
- **Shadows**: Toggle shadow rendering for performance
- **Auto-Rotate**: Enable automatic camera rotation
- **Show Helpers**: Display light helpers (debugging)

## 🏗️ Project Structure

```
classrom-3d-Game/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Application styles
├── js/
│   ├── main.js            # Application entry point
│   ├── Classroom.js       # Classroom environment
│   ├── Furniture.js       # Desks, chairs, blackboard
│   ├── Characters.js      # Students and teacher
│   ├── PDFViewer.js       # PDF integration
│   ├── Controls.js        # Camera controls
│   ├── Lighting.js        # Lighting system
│   └── Utils.js           # Helper functions
├── assets/                # Assets directory (optional)
│   ├── textures/
│   └── fonts/
└── README.md             # This file
```

## 🛠️ Technology Stack

- **[Three.js](https://threejs.org/)** (r160) - 3D rendering engine
- **[PDF.js](https://mozilla.github.io/pdf.js/)** (3.11) - PDF rendering
- **OrbitControls** - Camera navigation
- **FontLoader & TextGeometry** - 3D text rendering
- **Vanilla JavaScript** (ES6+ modules)
- **HTML5 & CSS3** - UI and styling

## 🎨 Customization

### Changing Classroom Dimensions
Edit `js/Classroom.js`:
```javascript
this.width = 20;  // Classroom width
this.depth = 15;  // Classroom depth
this.height = 4;  // Classroom height
```

### Modifying Desk Layout
Edit `js/Furniture.js`:
```javascript
this.rows = 5;        // Number of rows
this.columns = 4;     // Number of columns
this.deskSpacing = 2.2;
this.rowSpacing = 2.0;
```

### Adjusting Lighting
Edit `js/Lighting.js` - modify intensities, colors, or add more lights

### Changing Colors
Edit student/teacher colors in `js/Characters.js`:
```javascript
this.skinTones = ['#FFE0BD', '#F1C27D', ...];
this.shirtColors = ['#FF6B6B', '#4ECDC4', ...];
```

## 🔮 Future Enhancements

### Planned Features
- [ ] **Realistic 3D Models**: Replace geometric shapes with GLTF models
- [ ] **Interactive Whiteboard**: Draw and annotate on the board
- [ ] **Multiplayer Support**: Real-time collaboration
- [ ] **VR Mode**: WebXR integration for VR headsets
- [ ] **Audio**: Ambient classroom sounds and effects
- [ ] **Day/Night Cycle**: Dynamic lighting based on time
- [ ] **Screen Sharing**: Display live presentations
- [ ] **Quiz Mode**: Interactive questions and answers
- [ ] **Physics Engine**: Realistic object interactions
- [ ] **Weather Effects**: Rain/snow visible through windows

### Advanced Ideas
- **AI-Powered Teacher**: Animated teacher with speech
- **Student Avatars**: Customizable student appearances
- **Classroom Builder**: Drag-and-drop furniture arrangement
- **Analytics Dashboard**: Track presentation metrics
- **Mobile Support**: Touch controls for tablets/phones
- **Export/Share**: Save classroom configurations

## 🐛 Troubleshooting

### PDF Upload Not Working
- Ensure you're running a local web server (required for ES modules)
- Check browser console for errors
- Verify PDF file is valid and not corrupted

### Performance Issues
- Disable shadows in settings
- Reduce browser window size
- Close other browser tabs
- Update graphics drivers
- Use a modern browser

### Textures Not Loading
- Clear browser cache
- Ensure JavaScript is enabled
- Check browser console for errors

### Camera Controls Not Responding
- Click on the 3D canvas to focus
- Ensure browser window is active
- Try resetting camera view

## 📝 Development Notes

### Code Style
- ES6+ modules for clean organization
- JSDoc comments for documentation
- Descriptive variable and function names
- Consistent indentation (4 spaces)

### Performance Optimization
- Instancing for repeated objects (future)
- Procedural textures (lightweight)
- Efficient material reuse
- Shadow map optimization
- Proper disposal of resources

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

## 🤝 Contributing

This is a student project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## 📄 License

This project is created for educational purposes as part of the BST (Bilgisayar Grafikleri) course.

## 👨‍💻 Author

**BST 4th Year Student**
- Course: Bilgisayar Grafikleri
- Project: Virtual Classroom 3D
- Built with: Three.js & PDF.js

## 🙏 Acknowledgments

- [Three.js Team](https://threejs.org/) - Amazing 3D library
- [Mozilla PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering
- [Three.js Examples](https://threejs.org/examples/) - Inspiration and learning

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify web server is running
4. Ensure all files are properly loaded

---

**Made with ❤️ using Three.js**

*Virtual Classroom 3D - Bringing Education to the Third Dimension*
