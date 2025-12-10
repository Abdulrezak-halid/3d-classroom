import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { createWoodTexture, createBlackboardTexture } from "./Utils.js";

export class Furniture {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = "Furniture";

    // Grid configuration for desks
    this.rows = 5;
    this.columns = 4;
    this.deskSpacing = 2.2;
    this.rowSpacing = 2.0;

    this.blackboard = null;
    this.bstText = null;

    this.build();
    this.scene.add(this.group);
  }

  /**
   * Build all furniture
   */
  build() {
    this.createDesksAndChairs();
    this.createBlackboard();
    this.createTeacherDesk();
  }

  /**
   * Create a single desk
   * @returns {THREE.Group} - Desk group
   */
  createDesk() {
    const deskGroup = new THREE.Group();

    const woodTexture = createWoodTexture();

    // Desktop
    const topGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.8);
    const topMaterial = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.6,
      metalness: 0.1,
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.7;
    top.castShadow = true;
    top.receiveShadow = true;
    deskGroup.add(top);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.08, 0.7, 0.08);
    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.7,
      metalness: 0.1,
    });

    const legPositions = [
      [-0.5, 0.35, -0.35],
      [0.5, 0.35, -0.35],
      [-0.5, 0.35, 0.35],
      [0.5, 0.35, 0.35],
    ];

    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(...pos);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Storage compartment
    const storageGeometry = new THREE.BoxGeometry(1.0, 0.15, 0.6);
    const storage = new THREE.Mesh(storageGeometry, topMaterial);
    storage.position.set(0, 0.45, 0);
    storage.castShadow = true;
    deskGroup.add(storage);

    return deskGroup;
  }

  /**
   * Create a single chair
   * @returns {THREE.Group} - Chair group
   */
  createChair() {
    const chairGroup = new THREE.Group();

    const chairMaterial = new THREE.MeshStandardMaterial({
      color: 0x4169e1,
      roughness: 0.7,
      metalness: 0.2,
    });

    // Seat
    const seatGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.5);
    const seat = new THREE.Mesh(seatGeometry, chairMaterial);
    seat.position.y = 0.45;
    seat.castShadow = true;
    chairGroup.add(seat);

    // Backrest
    const backGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.05);
    const back = new THREE.Mesh(backGeometry, chairMaterial);
    back.position.set(0, 0.65, -0.225);
    back.castShadow = true;
    chairGroup.add(back);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8);
    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x696969,
      roughness: 0.5,
      metalness: 0.5,
    });

    const legPositions = [
      [-0.2, 0.225, -0.2],
      [0.2, 0.225, -0.2],
      [-0.2, 0.225, 0.2],
      [0.2, 0.225, 0.2],
    ];

    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(...pos);
      leg.castShadow = true;
      chairGroup.add(leg);
    });

    return chairGroup;
  }

  /**
   * Create grid of desks and chairs for students
   */
  createDesksAndChairs() {
    const desksGroup = new THREE.Group();
    desksGroup.name = "StudentDesks";

    // Starting position (back of classroom)
    const startX = (-(this.columns - 1) * this.deskSpacing) / 2;
    const startZ = 3; // Start from back

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        // Create desk
        const desk = this.createDesk();
        const x = startX + col * this.deskSpacing;
        const z = startZ - row * this.rowSpacing;
        desk.position.set(x, 0, z);
        desksGroup.add(desk);

        // Create chair
        const chair = this.createChair();
        chair.position.set(x, 0, z + 0.5); // Behind the desk
        desksGroup.add(chair);
      }
    }

    this.group.add(desksGroup);
  }

  /**
   * Create the blackboard with frame
   */
  createBlackboard() {
    const boardGroup = new THREE.Group();
    boardGroup.name = "Blackboard";

    const blackboardTexture = createBlackboardTexture();

    // Blackboard surface
    const boardGeometry = new THREE.BoxGeometry(6, 2.5, 0.1);
    const boardMaterial = new THREE.MeshStandardMaterial({
      map: blackboardTexture,
      roughness: 0.8,
      metalness: 0.0,
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.set(0, 2, -7.4);
    board.castShadow = true;
    board.receiveShadow = true;
    boardGroup.add(board);

    this.blackboard = board; // Store reference

    // Frame
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.6,
      metalness: 0.1,
    });

    // Top frame
    const topFrameGeometry = new THREE.BoxGeometry(6.2, 0.15, 0.15);
    const topFrame = new THREE.Mesh(topFrameGeometry, frameMaterial);
    topFrame.position.set(0, 3.3, -7.35);
    topFrame.castShadow = true;
    boardGroup.add(topFrame);

    // Bottom frame
    const bottomFrame = new THREE.Mesh(topFrameGeometry, frameMaterial);
    bottomFrame.position.set(0, 0.7, -7.35);
    bottomFrame.castShadow = true;
    boardGroup.add(bottomFrame);

    // Left frame
    const sideFrameGeometry = new THREE.BoxGeometry(0.15, 2.8, 0.15);
    const leftFrame = new THREE.Mesh(sideFrameGeometry, frameMaterial);
    leftFrame.position.set(-3.1, 2, -7.35);
    leftFrame.castShadow = true;
    boardGroup.add(leftFrame);

    // Right frame
    const rightFrame = new THREE.Mesh(sideFrameGeometry, frameMaterial);
    rightFrame.position.set(3.1, 2, -7.35);
    rightFrame.castShadow = true;
    boardGroup.add(rightFrame);

    // Chalk tray
    const trayGeometry = new THREE.BoxGeometry(6, 0.1, 0.2);
    const tray = new THREE.Mesh(trayGeometry, frameMaterial);
    tray.position.set(0, 0.65, -7.3);
    tray.castShadow = true;
    boardGroup.add(tray);

    this.group.add(boardGroup);

    // Add "BST" text
    this.create3DText();
  }

  /**
   * Create 3D text "BST" on left wall and "Bilgisayar Grafikleri" on back wall
   */
  create3DText() {
    const loader = new FontLoader();

    // Use default font data (embedded)
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        // Create "BST" text on left wall
        const bstGeometry = new TextGeometry("BST", {
          font: font,
          size: 1.2,
          height: 0.3,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.03,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        bstGeometry.computeBoundingBox();
        const bstCenterOffset =
          -0.5 *
          (bstGeometry.boundingBox.max.x - bstGeometry.boundingBox.min.x);

        const bstMaterial = new THREE.MeshStandardMaterial({
          color: 0xffd700,
          roughness: 0.3,
          metalness: 0.7,
          emissive: 0xffd700,
          emissiveIntensity: 0.3,
        });

        const bstMesh = new THREE.Mesh(bstGeometry, bstMaterial);
        bstMesh.position.set(-9.8, 2.5, 0);
        bstMesh.rotation.y = Math.PI / 2; // Face into the room
        bstMesh.castShadow = true;

        this.bstText = bstMesh;
        this.group.add(bstMesh);

        // Create "Bilgisayar Grafikleri" text next to blackboard (right side)
        const bgGeometry = new TextGeometry("Bilgisayar\nGrafikleri", {
          font: font,
          size: 0.6, // Smaller to fit nicely
          height: 0.15,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        bgGeometry.computeBoundingBox();
        const bgHeight =
          bgGeometry.boundingBox.max.y - bgGeometry.boundingBox.min.y;

        const bgMaterial = new THREE.MeshStandardMaterial({
          color: 0x4a90e2,
          roughness: 0.3,
          metalness: 0.6,
          emissive: 0x4a90e2,
          emissiveIntensity: 0.3,
        });

        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        // Position to the right of blackboard, vertically centered
        bgMesh.position.set(3.5, 2 - bgHeight / 2, -7.3);
        bgMesh.castShadow = true;

        this.group.add(bgMesh);
      },
      undefined,
      (error) => {
        console.warn("Could not load font, using fallback");
        this.createFallbackText();
      }
    );
  }

  /**
   * Create fallback text if font loading fails
   */
  createFallbackText() {
    // BST on left wall
    const bstMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.4,
      metalness: 0.6,
    });

    const letterGeometry = new THREE.BoxGeometry(0.7, 1.0, 0.3);

    const b = new THREE.Mesh(letterGeometry, bstMaterial);
    b.position.set(-9.8, 3, -1);
    b.rotation.y = Math.PI / 2;
    b.castShadow = true;
    this.group.add(b);

    const s = new THREE.Mesh(letterGeometry, bstMaterial);
    s.position.set(-9.8, 3, 0);
    s.rotation.y = Math.PI / 2;
    s.castShadow = true;
    this.group.add(s);

    const t = new THREE.Mesh(letterGeometry, bstMaterial);
    t.position.set(-9.8, 3, 1);
    t.rotation.y = Math.PI / 2;
    t.castShadow = true;
    this.group.add(t);

    // Simple "BG" on back wall
    const bgMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      roughness: 0.4,
      metalness: 0.6,
    });

    const bg = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 0.2), bgMaterial);
    bg.position.set(0, 2.5, 7.4);
    bg.rotation.y = Math.PI;
    bg.castShadow = true;
    this.group.add(bg);
  }

  /**
   * Create teacher's desk at the front
   */
  createTeacherDesk() {
    const teacherDeskGroup = new THREE.Group();
    teacherDeskGroup.name = "TeacherDesk";

    const woodTexture = createWoodTexture();

    // Larger desk for teacher
    const topGeometry = new THREE.BoxGeometry(2.0, 0.08, 1.2);
    const topMaterial = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.6,
      metalness: 0.1,
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.8;
    top.castShadow = true;
    top.receiveShadow = true;
    teacherDeskGroup.add(top);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.7,
      metalness: 0.1,
    });

    const legPositions = [
      [-0.9, 0.4, -0.5],
      [0.9, 0.4, -0.5],
      [-0.9, 0.4, 0.5],
      [0.9, 0.4, 0.5],
    ];

    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(...pos);
      leg.castShadow = true;
      teacherDeskGroup.add(leg);
    });

    // Position in front, slightly to the side
    teacherDeskGroup.position.set(-3.5, 0, -6);

    this.group.add(teacherDeskGroup);
  }

  /**
   * Get blackboard mesh for PDF texture application
   * @returns {THREE.Mesh} - Blackboard mesh
   */
  getBlackboard() {
    return this.blackboard;
  }

  /**
   * Dispose of furniture
   */
  dispose() {
    this.group.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      }
    });

    this.scene.remove(this.group);
  }
}
