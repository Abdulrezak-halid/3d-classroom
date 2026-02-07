# 🎓 Virtual Classroom 3D - BST Project

A professional, interactive 3D virtual classroom built with Three.js, featuring an integrated PDF viewer, realistic lighting, and animated characters.

![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=flat-square&logo=three.js)
![PDF.js](https://img.shields.io/badge/PDF.js-3.11-red?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)

## Features

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

## Getting Started

### 📸 Screenshot
<img width="1919" height="961" alt="image" src="https://github.com/user-attachments/assets/c11426d7-e1e1-4f7f-bba9-219402a5a046" />

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

## Usage

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

## Technology Stack

- **[Three.js](https://threejs.org/)** (r160) - 3D rendering engine
- **[PDF.js](https://mozilla.github.io/pdf.js/)** (3.11) - PDF rendering
- **OrbitControls** - Camera navigation
- **FontLoader & TextGeometry** - 3D text rendering
- **Vanilla JavaScript** (ES6+ modules)
- **HTML5 & CSS3** - UI and styling

## Development Notes

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

## Contributing

This is a student project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is created for educational purposes as part of the BST (Bilgisayar Grafikleri) course.

## Author

**Abdulrezak Halit**
- Course: Bilgisayar Grafikleri
- Project: Virtual Classroom 3D
- Built with: Three.js & PDF.js

---

*Virtual Classroom 3D - Bringing Education to the Third Dimension*
