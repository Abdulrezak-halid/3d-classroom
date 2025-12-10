import * as THREE from "three";
import { LightingSystem } from "./Lighting.js";
import { Classroom } from "./Classroom.js";
import { Furniture } from "./Furniture.js";
import { Characters } from "./Characters.js";
import { PDFViewer } from "./PDFViewer.js";
import { CameraControls } from "./Controls.js";
import { ParticleEffects } from "./Particles.js";
import { FPSCounter } from "./Utils.js";

class VirtualClassroom {
  constructor() {
    // Core Three.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Application components
    this.lighting = null;
    this.classroom = null;
    this.furniture = null;
    this.characters = null;
    this.pdfViewer = null;
    this.cameraControls = null;
    this.particles = null;

    // Animation
    this.clock = new THREE.Clock();
    this.fpsCounter = null;

    // State
    this.isRunning = false;

    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log("Initializing Virtual Classroom...");

    // Show loading screen
    this.showLoading(true);

    try {
      this.createScene();

      this.createCamera();

      this.createRenderer();

      this.lighting = new LightingSystem(this.scene);
      console.log("✓ Lighting system created");

      // Create classroom environment
      this.classroom = new Classroom(this.scene);
      console.log("✓ Classroom environment created");

      // Create furniture
      this.furniture = new Furniture(this.scene);
      console.log("✓ Furniture created");

      // Create characters
      this.characters = new Characters(this.scene);
      console.log("✓ Characters created");

      // Create PDF viewer
      const blackboard = this.furniture.getBlackboard();
      this.pdfViewer = new PDFViewer(this.scene, blackboard);
      console.log("✓ PDF viewer initialized");

      // Setup camera controls
      this.cameraControls = new CameraControls(
        this.camera,
        this.renderer,
        this.scene
      );
      console.log("✓ Camera controls setup");

      // Create particle effects
      this.particles = new ParticleEffects(this.scene);
      console.log("✓ Particle effects created");

      // Setup UI
      this.setupUI();

      // Setup FPS counter
      this.setupFPSCounter();

      // Handle window resize
      this.setupResizeHandler();

      // Start animation loop
      this.isRunning = true;
      this.animate();

      console.log("✓ Virtual Classroom initialized successfully!");

      // Hide loading screen after a short delay
      setTimeout(() => {
        this.showLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error initializing application:", error);
      alert("Error loading application. Please refresh the page.");
    }
  }

  /**
   * Create Three.js scene
   */
  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
    this.scene.fog = new THREE.Fog(0x87ceeb, 20, 50); // Atmospheric fog
  }

  /**
   * Create camera
   */
  createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    this.camera.position.set(0, 4, 12);
  }

  /**
   * Create renderer
   */
  createRenderer() {
    const canvas = document.getElementById("canvas3d");

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

    // Enable shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;

    // Tone mapping for better colors
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Output encoding
    this.renderer.outputEncoding = THREE.sRGBEncoding;
  }

  /**
   * Setup UI event handlers
   */
  setupUI() {
    // Shadows toggle
    const shadowsCheckbox = document.getElementById("show-shadows");
    if (shadowsCheckbox) {
      shadowsCheckbox.addEventListener("change", (e) => {
        this.renderer.shadowMap.enabled = e.target.checked;
        this.lighting.setShadows(e.target.checked);
      });
    }

    // Helpers toggle
    const helpersCheckbox = document.getElementById("show-helpers");
    if (helpersCheckbox) {
      helpersCheckbox.addEventListener("change", (e) => {
        this.lighting.setHelpersVisible(e.target.checked);
      });
    }

    // Particle effects toggle
    const particlesCheckbox = document.getElementById("show-particles");
    if (particlesCheckbox && this.particles) {
      particlesCheckbox.addEventListener("change", (e) => {
        this.particles.particles.forEach((p) => {
          p.visible = e.target.checked;
        });
      });
    }

    // PDF Brightness control
    const pdfBrightness = document.getElementById("pdf-brightness");
    const pdfBrightnessValue = document.getElementById("pdf-brightness-value");
    if (pdfBrightness && this.pdfViewer) {
      pdfBrightness.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);
        pdfBrightnessValue.textContent = value.toFixed(1);
        if (this.pdfViewer.pdfPlane && this.pdfViewer.pdfPlane.material) {
          this.pdfViewer.pdfPlane.material.emissiveIntensity = value;
        }
      });
    }

    // Camera speed control
    const cameraSpeed = document.getElementById("camera-speed");
    const cameraSpeedValue = document.getElementById("camera-speed-value");
    if (cameraSpeed && this.cameraControls) {
      cameraSpeed.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);
        cameraSpeedValue.textContent = value.toFixed(1) + "x";
        if (this.cameraControls.controls) {
          this.cameraControls.controls.rotateSpeed = value;
          this.cameraControls.controls.panSpeed = value;
        }
      });
    }

    // Zoom speed control
    const zoomSpeed = document.getElementById("zoom-speed");
    const zoomSpeedValue = document.getElementById("zoom-speed-value");
    if (zoomSpeed && this.cameraControls) {
      zoomSpeed.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);
        zoomSpeedValue.textContent = value.toFixed(1) + "x";
        if (this.cameraControls.controls) {
          this.cameraControls.controls.zoomSpeed = value;
        }
      });
    }

    // Focus Teacher button
    const focusTeacherBtn = document.getElementById("focus-teacher");
    if (focusTeacherBtn && this.cameraControls && this.characters) {
      focusTeacherBtn.addEventListener("click", () => {
        const teacher = this.characters.getTeacher();
        if (teacher) {
          this.cameraControls.focusOnObject(teacher, 0.8);
        }
      });
    }
  }

  /**
   * Setup FPS counter
   */
  setupFPSCounter() {
    const fpsElement = document.getElementById("fps-value");
    this.fpsCounter = new FPSCounter((fps) => {
      if (fpsElement) {
        fpsElement.textContent = fps.toString();

        // Color based on performance
        if (fps >= 50) {
          fpsElement.style.color = "#50C878"; // Green
        } else if (fps >= 30) {
          fpsElement.style.color = "#FFA500"; // Orange
        } else {
          fpsElement.style.color = "#FF6B6B"; // Red
        }
      }
    });
  }

  /**
   * Setup window resize handler
   */
  setupResizeHandler() {
    window.addEventListener("resize", () => {
      this.onWindowResize();
    });
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  /**
   * Show/hide loading screen
   * @param {boolean} show - Show or hide
   */
  showLoading(show) {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      if (show) {
        loadingScreen.classList.remove("hidden");
      } else {
        loadingScreen.classList.add("hidden");
      }
    }
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.isRunning) return;

    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // ✅ قلل تحديث FPS (مرة كل 10 frames)
    this.frameCount = (this.frameCount || 0) + 1;
    if (this.fpsCounter && this.frameCount % 10 === 0) {
      this.fpsCounter.update();
    }

    // ✅ حدّث الـ controls دائماً
    if (this.cameraControls) {
      this.cameraControls.update();
    }

    // ✅ حدّث الأشياء الثقيلة بشكل أقل
    if (this.frameCount % 2 === 0) {
      // كل frame ثاني
      if (this.characters) {
        this.characters.update(elapsedTime);
      }

      if (this.particles) {
        this.particles.update(elapsedTime);
      }
    }

    // ✅ الـ lighting والـ PDF أقل أهمية
    if (this.frameCount % 3 === 0) {
      if (this.lighting) {
        this.lighting.update(deltaTime);
      }

      if (this.pdfViewer) {
        this.pdfViewer.update(deltaTime);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Dispose of all resources
   */
  dispose() {
    this.isRunning = false;

    if (this.particles) this.particles.dispose();
    if (this.pdfViewer) this.pdfViewer.dispose();
    if (this.characters) this.characters.dispose();
    if (this.furniture) this.furniture.dispose();
    if (this.classroom) this.classroom.dispose();
    if (this.lighting) this.lighting.dispose();
    if (this.cameraControls) this.cameraControls.dispose();
    if (this.renderer) this.renderer.dispose();

    console.log("Virtual Classroom disposed");
  }
}

// Initialize application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.virtualClassroom = new VirtualClassroom();
  });
} else {
  window.virtualClassroom = new VirtualClassroom();
}

// Expose for debugging
window.THREE = THREE;

console.log("Virtual Classroom 3D - BST Project");
console.log("Built with Three.js and PDF.js");
