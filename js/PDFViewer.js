import * as THREE from "three";

export class PDFViewer {
  constructor(scene, targetMesh) {
    this.scene = scene;
    this.targetMesh = targetMesh;

    this.pdfDoc = null;
    this.currentPage = 1;
    this.totalPages = 0;
    this.pageRendering = false;

    // Canvas for rendering PDF - INCREASED RESOLUTION for clarity
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = 1920;
    this.canvas.height = 1440;

    this.ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false,
    });

    // Create texture from canvas
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.anisotropy = 4;

    this.createPDFPlane();

    this.setupUI();

    this.renderBlankCanvas();
  }

  /**
   * Create a 3D plane to display PDF
   */
  createPDFPlane() {
    const planeGeometry = new THREE.PlaneGeometry(5.8, 4.2);
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: this.texture,
      roughness: 0.1,
      metalness: 0.0,
      emissive: 0xffffff,
      emissiveMap: this.texture,
      emissiveIntensity: 0.7,
      side: THREE.FrontSide,
      toneMapped: false,
    });

    this.pdfPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.pdfPlane.position.set(0, 2.3, -7.2);
    this.pdfPlane.name = "PDFPlane";

    // Add a professional frame around the PDF
    const frameGeometry = new THREE.BoxGeometry(6.0, 4.4, 0.08);
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a, // Dark gray/black
      roughness: 0.3,
      metalness: 0.6,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 2.3, -7.25);
    frame.castShadow = false;
    frame.name = "PDFFrame";

    // Add a dedicated light for the PDF display
    const pdfLight = new THREE.SpotLight(0xffffff, 1.5);
    pdfLight.position.set(0, 3, -6);
    pdfLight.target.position.set(0, 2.3, -7.2);
    pdfLight.angle = Math.PI / 8;
    pdfLight.penumbra = 0.2;
    pdfLight.distance = 5;
    pdfLight.decay = 1;
    pdfLight.name = "PDFSpotlight";

    this.scene.add(frame);
    this.scene.add(this.pdfPlane);
    this.scene.add(pdfLight);
    this.scene.add(pdfLight.target);
  }

  /**
   * Render blank canvas with instructions
   */
  renderBlankCanvas() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#333333";
    this.ctx.font = "bold 48px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      "Upload a PDF to view",
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );

    this.ctx.font = "32px Arial";
    this.ctx.fillStyle = "#666666";
    this.ctx.fillText(
      'Click "Upload PDF" button',
      this.canvas.width / 2,
      this.canvas.height / 2 + 30
    );

    this.texture.needsUpdate = true;
  }

  /**
   * Setup UI event listeners
   */
  setupUI() {
    this.fileInput = document.getElementById("pdf-upload");
    this.fileInput.addEventListener("change", (e) => this.handleFileSelect(e));

    this.prevButton = document.getElementById("prev-page");
    this.nextButton = document.getElementById("next-page");
    this.pageInfo = document.getElementById("page-info");
    this.pdfInfoPanel = document.getElementById("pdf-info");
    this.pdfFilename = document.getElementById("pdf-filename");

    this.prevButton.addEventListener("click", () => this.previousPage());
    this.nextButton.addEventListener("click", () => this.nextPage());

    document.addEventListener("keydown", (e) => {
      if (this.pdfDoc) {
        if (e.key === "ArrowLeft") this.previousPage();
        if (e.key === "ArrowRight") this.nextPage();
      }
    });
  }

  /**
   * Handle file selection
   * @param {Event} event - File input change event
   */
  async handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }

    this.renderLoadingCanvas();

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
        cMapPacked: true,
        disableAutoFetch: true,
        disableStream: true,
      });
      this.pdfDoc = await loadingTask.promise;
      this.totalPages = this.pdfDoc.numPages;
      this.currentPage = 1;

      this.pdfFilename.textContent = file.name;
      this.pdfInfoPanel.classList.remove("hidden");
      this.updatePageInfo();

      await this.renderPage(this.currentPage);
    } catch (error) {
      console.error("Error loading PDF:", error);
      alert("Error loading PDF file");
      this.renderBlankCanvas();
    }
  }

  /**
   * Render loading canvas
   */
  renderLoadingCanvas() {
    this.ctx.fillStyle = "#F0F0F0";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#333333";
    this.ctx.font = "bold 60px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      "Loading PDF...",
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    this.texture.needsUpdate = true;
  }

  /**
   * Render a specific page
   * @param {number} pageNum - Page number to render
   */
  async renderPage(pageNum) {
    if (this.pageRendering) return;
    this.pageRendering = true;

    try {
      const page = await this.pdfDoc.getPage(pageNum);

      const viewport = page.getViewport({ scale: 1.0 });
      const scale = Math.min(
        this.canvas.width / viewport.width,
        this.canvas.height / viewport.height
      );

      const scaledViewport = page.getViewport({ scale });

      const offsetX = (this.canvas.width - scaledViewport.width) / 2;
      const offsetY = (this.canvas.height - scaledViewport.height) / 2;

      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const renderContext = {
        canvasContext: this.ctx,
        viewport: scaledViewport,
        transform: [1, 0, 0, 1, offsetX, offsetY],
      };

      await page.render(renderContext).promise;

      this.texture.needsUpdate = true;

      this.pageRendering = false;
    } catch (error) {
      console.error("Error rendering page:", error);
      this.pageRendering = false;
    }
  }

  /**
   * Go to previous page
   */
  async previousPage() {
    if (this.currentPage <= 1) return;
    this.currentPage--;
    this.updatePageInfo();
    await this.renderPage(this.currentPage);
  }

  /**
   * Go to next page
   */
  async nextPage() {
    if (this.currentPage >= this.totalPages) return;
    this.currentPage++;
    this.updatePageInfo();
    await this.renderPage(this.currentPage);
  }

  /**
   * Update page information in UI
   */
  updatePageInfo() {
    if (this.pdfDoc) {
      this.pageInfo.textContent = `Page ${this.currentPage} / ${this.totalPages}`;
      this.prevButton.disabled = this.currentPage <= 1;
      this.nextButton.disabled = this.currentPage >= this.totalPages;
    }
  }

  /**
   * Get PDF plane mesh
   * @returns {THREE.Mesh} - PDF plane mesh
   */
  getPlane() {
    return this.pdfPlane;
  }

  /**
   * Show/hide PDF plane
   * @param {boolean} visible - Visibility state
   */
  setVisible(visible) {
    this.pdfPlane.visible = visible;
  }

  /**
   * Update PDF viewer (for animations, etc.)
   * @param {number} deltaTime - Time since last frame
   */
  update(deltaTime) {
    // Can add animations here, e.g., floating effect
    // this.pdfPlane.position.y = 2.5 + Math.sin(Date.now() * 0.001) * 0.05;
  }

  /**
   * Dispose of PDF viewer
   */
  dispose() {
    if (this.pdfDoc) {
      this.pdfDoc.destroy();
    }

    if (this.texture) {
      this.texture.dispose();
    }

    if (this.pdfPlane) {
      if (this.pdfPlane.geometry) this.pdfPlane.geometry.dispose();
      if (this.pdfPlane.material) this.pdfPlane.material.dispose();
      this.scene.remove(this.pdfPlane);
    }

    if (this.fileInput) {
      this.fileInput.removeEventListener("change", this.handleFileSelect);
    }
    if (this.prevButton) {
      this.prevButton.removeEventListener("click", this.previousPage);
    }
    if (this.nextButton) {
      this.nextButton.removeEventListener("click", this.nextPage);
    }
  }
}
