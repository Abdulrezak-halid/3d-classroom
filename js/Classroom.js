import * as THREE from "three";
import { createFloorTexture, createWallTexture } from "./Utils.js";

export class Classroom {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = "Classroom";

    // Classroom dimensions
    this.width = 20;
    this.depth = 15;
    this.height = 4;

    this.build();
    this.scene.add(this.group);
  }

  /**
   * Build the complete classroom
   */
  build() {
    this.createFloor();
    this.createCeiling();
    this.createWalls();
    this.createWindows();
  }

  //Create the floor
  createFloor() {
    const floorTexture = createFloorTexture();
    floorTexture.repeat.set(4, 3);

    const floorGeometry = new THREE.PlaneGeometry(this.width, this.depth);
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.8,
      metalness: 0.1,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    floor.name = "Floor";

    this.group.add(floor);
  }

  //Create the ceiling
  createCeiling() {
    const ceilingGeometry = new THREE.PlaneGeometry(this.width, this.depth);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f8f8,
      roughness: 0.9,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = this.height;
    ceiling.receiveShadow = true;
    ceiling.name = "Ceiling";

    this.group.add(ceiling);
  }

  //Create all walls
  createWalls() {
    this.createFrontWall();
    this.createBackWall();
    this.createLeftWall();
    this.createRightWall();
  }

  //Create front wall (where the board is)
  createFrontWall() {
    const wallTexture = createWallTexture();
    wallTexture.repeat.set(4, 2);

    const wallGeometry = new THREE.PlaneGeometry(this.width, this.height);
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.9,
      metalness: 0.0,
    });

    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(0, this.height / 2, -this.depth / 2);
    wall.receiveShadow = true;
    wall.name = "FrontWall";

    this.group.add(wall);
  }

  //Create back wall (opposite to board)
  createBackWall() {
    const wallTexture = createWallTexture();
    wallTexture.repeat.set(4, 2);

    const wallGeometry = new THREE.PlaneGeometry(this.width, this.height);
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.9,
      metalness: 0.0,
    });

    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(0, this.height / 2, this.depth / 2);
    wall.rotation.y = Math.PI;
    wall.receiveShadow = true;
    wall.name = "BackWall";

    this.group.add(wall);
  }

  //Create left wall
  createLeftWall() {
    const wallTexture = createWallTexture();
    wallTexture.repeat.set(3, 2);

    const wallGeometry = new THREE.PlaneGeometry(this.depth, this.height);
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.9,
      metalness: 0.0,
    });

    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(-this.width / 2, this.height / 2, 0);
    wall.rotation.y = Math.PI / 2;
    wall.receiveShadow = true;
    wall.name = "LeftWall";

    this.group.add(wall);
  }

  //Create right wall (with windows)
  createRightWall() {
    const wallTexture = createWallTexture();
    wallTexture.repeat.set(3, 2);

    const wallGeometry = new THREE.PlaneGeometry(this.depth, this.height);
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.9,
      metalness: 0.0,
    });

    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(this.width / 2, this.height / 2, 0);
    wall.rotation.y = -Math.PI / 2;
    wall.receiveShadow = true;
    wall.name = "RightWall";

    this.group.add(wall);
  }

  //Create windows on the right wall
  createWindows() {
    const windowGroup = new THREE.Group();
    windowGroup.name = "Windows";

    // create 3 windows
    const windowPositions = [-4, 0, 4];

    windowPositions.forEach((z, index) => {
      // window frame
      const frameGeometry = new THREE.BoxGeometry(0.1, 1.8, 1.5);
      const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.7,
        metalness: 0.1,
      });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.set(this.width / 2 - 0.05, 2.3, z);
      frame.castShadow = true;
      windowGroup.add(frame);

      // Window glass
      const glassGeometry = new THREE.PlaneGeometry(1.3, 1.6);
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.0,
        transmission: 0.9,
        ior: 1.5,
      });
      const glass = new THREE.Mesh(glassGeometry, glassMaterial);
      glass.position.set(this.width / 2 + 0.01, 2.3, z);
      glass.rotation.y = -Math.PI / 2;
      windowGroup.add(glass);

      // window cross bars
      const crossBarMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.7,
        metalness: 0.1,
      });

      // horizontal bar
      const hBarGeometry = new THREE.BoxGeometry(0.05, 0.05, 1.3);
      const hBar = new THREE.Mesh(hBarGeometry, crossBarMaterial);
      hBar.position.set(this.width / 2, 2.3, z);
      windowGroup.add(hBar);

      // vertical bar
      const vBarGeometry = new THREE.BoxGeometry(0.05, 1.6, 0.05);
      const vBar = new THREE.Mesh(vBarGeometry, crossBarMaterial);
      vBar.position.set(this.width / 2, 2.3, z);
      windowGroup.add(vBar);
    });

    this.group.add(windowGroup);
  }

  /**
   * Get classroom bounds
   * @returns {Object} - Bounds {width, depth, height}
   */
  getBounds() {
    return {
      width: this.width,
      depth: this.depth,
      height: this.height,
    };
  }

  //Dispose of classroom
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
