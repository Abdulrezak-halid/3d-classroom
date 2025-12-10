import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class CameraControls {
  constructor(camera, renderer, scene) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;

    // Default camera position
    this.defaultPosition = new THREE.Vector3(0, 4, 12);
    this.defaultTarget = new THREE.Vector3(0, 2, -5);

    // Board focus position
    this.boardPosition = new THREE.Vector3(0, 2.5, -2);
    this.boardTarget = new THREE.Vector3(0, 2.5, -7.3);

    this.init();
    this.setupUI();
    this.setupKeyboardControls();
  }

  /**
   * Initialize OrbitControls
   */
  init() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Control settings
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;

    // Zoom limits
    this.controls.minDistance = 3;
    this.controls.maxDistance = 18;

    // Vertical rotation limits (prevent flipping)
    this.controls.maxPolarAngle = Math.PI / 2 + 0.3;
    this.controls.minPolarAngle = 0.1;

    // Classroom is 20m wide, 15m deep, 4m high
    this.cameraBounds = {
      minX: -9,
      maxX: 9,
      minY: 0.5,
      maxY: 3.5,
      minZ: -7,
      maxZ: 7,
    };

    // Set initial position
    this.camera.position.copy(this.defaultPosition);
    this.controls.target.copy(this.defaultTarget);
    this.controls.update();

    // Auto-rotate (disabled by default)
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.5;
  }

  /**
   * Setup UI controls
   */
  setupUI() {
    const resetButton = document.getElementById("reset-camera");
    if (resetButton) {
      resetButton.addEventListener("click", () => this.resetCamera());
    }

    const focusButton = document.getElementById("focus-board");
    if (focusButton) {
      focusButton.addEventListener("click", () => this.focusBoard());
    }

    const autoRotateCheckbox = document.getElementById("auto-rotate");
    if (autoRotateCheckbox) {
      autoRotateCheckbox.addEventListener("change", (e) => {
        this.controls.autoRotate = e.target.checked;
      });
    }

    const toggleInstructionsBtn = document.getElementById(
      "toggle-instructions"
    );
    const instructionsContent = document.getElementById("instructions-content");
    if (toggleInstructionsBtn && instructionsContent) {
      toggleInstructionsBtn.addEventListener("click", () => {
        instructionsContent.classList.toggle("hidden");
      });
    }
  }

  /**
   * Setup keyboard controls
   */
  setupKeyboardControls() {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.resetCamera();
      }

      if (e.code === "KeyF") {
        e.preventDefault();
        this.focusBoard();
      }

      if (e.code === "KeyR") {
        e.preventDefault();
        this.controls.autoRotate = !this.controls.autoRotate;
        const checkbox = document.getElementById("auto-rotate");
        if (checkbox) checkbox.checked = this.controls.autoRotate;
      }
    });
  }

  /**
   * Reset camera to default position
   * @param {boolean} animate - Whether to animate the transition
   */
  resetCamera(animate = true) {
    if (animate) {
      this.animateCamera(this.defaultPosition, this.defaultTarget);
    } else {
      this.camera.position.copy(this.defaultPosition);
      this.controls.target.copy(this.defaultTarget);
      this.controls.update();
    }
  }

  /**
   * Focus camera on the board
   * @param {boolean} animate - Whether to animate the transition
   */
  focusBoard(animate = true) {
    if (animate) {
      this.animateCamera(this.boardPosition, this.boardTarget);
    } else {
      this.camera.position.copy(this.boardPosition);
      this.controls.target.copy(this.boardTarget);
      this.controls.update();
    }
  }

  /**
   * Animate camera to a position and target
   * @param {THREE.Vector3} targetPosition - Target camera position
   * @param {THREE.Vector3} targetLookAt - Target look-at point
   */
  animateCamera(targetPosition, targetLookAt) {
    const startPosition = this.camera.position.clone();
    const startTarget = this.controls.target.clone();

    const duration = 1500; // milliseconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      this.camera.position.lerpVectors(startPosition, targetPosition, eased);
      this.controls.target.lerpVectors(startTarget, targetLookAt, eased);
      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  /**
   * Focus on a specific object
   * @param {THREE.Object3D} object - Object to focus on
   * @param {number} distance - Distance from object
   */
  focusOnObject(object, distance = 5) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * distance;

    const direction = new THREE.Vector3(0, 0.3, 1).normalize();
    const targetPosition = center
      .clone()
      .add(direction.multiplyScalar(cameraDistance));

    this.animateCamera(targetPosition, center);
  }

  /**
   * Enable/disable controls
   * @param {boolean} enabled - Enable or disable
   */
  setEnabled(enabled) {
    this.controls.enabled = enabled;
  }

  /**
   * Update controls (call in animation loop)
   */
  update() {
    this.controls.update();

    // Enforce camera boundaries
    if (this.cameraBounds) {
      this.camera.position.x = Math.max(
        this.cameraBounds.minX,
        Math.min(this.cameraBounds.maxX, this.camera.position.x)
      );
      this.camera.position.y = Math.max(
        this.cameraBounds.minY,
        Math.min(this.cameraBounds.maxY, this.camera.position.y)
      );
      this.camera.position.z = Math.max(
        this.cameraBounds.minZ,
        Math.min(this.cameraBounds.maxZ, this.camera.position.z)
      );
    }
  }

  /**
   * Handle window resize
   * @param {number} width - New width
   * @param {number} height - New height
   */
  onWindowResize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Get controls instance
   * @returns {OrbitControls} - OrbitControls instance
   */
  getControls() {
    return this.controls;
  }

  /**
   * Dispose of controls
   */
  dispose() {
    this.controls.dispose();

    // Remove event listeners
    const resetButton = document.getElementById("reset-camera");
    if (resetButton) {
      resetButton.removeEventListener("click", this.resetCamera);
    }

    const focusButton = document.getElementById("focus-board");
    if (focusButton) {
      focusButton.removeEventListener("click", this.focusBoard);
    }
  }
}
