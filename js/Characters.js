import * as THREE from "three";
import { randomColor } from "./Utils.js";

export class Characters {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = "Characters";

    // Color palettes for diversity
    this.skinTones = [
      "#FFE0BD",
      "#F1C27D",
      "#E0AC69",
      "#C68642",
      "#8D5524",
      "#6B4423",
    ];
    this.shirtColors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA15E",
      "#BC6C25",
    ];

    this.students = [];
    this.teacher = null;

    this.build();
    this.scene.add(this.group);
  }

  //Build all characters
  build() {
    this.createStudents();
    this.createTeacher();
  }

  /**
   * Create a simple character model
   * @param {string} skinColor - Skin color (hex)
   * @param {string} shirtColor - Shirt color (hex)
   * @param {boolean} isSeated - Whether character is seated
   * @returns {THREE.Group} - Character group
   */
  createCharacterModel(skinColor, shirtColor, isSeated = true) {
    const character = new THREE.Group();

    // Head
    const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.8,
      metalness: 0.0,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = isSeated ? 0.95 : 1.55;
    head.castShadow = true;
    character.add(head);

    // Torso
    const torsoGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.4, 16);
    const torsoMaterial = new THREE.MeshStandardMaterial({
      color: shirtColor,
      roughness: 0.7,
      metalness: 0.0,
    });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = isSeated ? 0.65 : 1.2;
    torso.castShadow = true;
    character.add(torso);

    if (isSeated) {
      // Arms (seated position)
      const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8);
      const armMaterial = new THREE.MeshStandardMaterial({
        color: shirtColor,
        roughness: 0.7,
        metalness: 0.0,
      });

      // Left arm
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.18, 0.65, 0.1);
      leftArm.rotation.z = Math.PI / 6;
      leftArm.castShadow = true;
      character.add(leftArm);

      // Right arm
      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.18, 0.65, 0.1);
      rightArm.rotation.z = -Math.PI / 6;
      rightArm.castShadow = true;
      character.add(rightArm);

      // Hands on desk
      const handGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const handMaterial = new THREE.MeshStandardMaterial({
        color: skinColor,
        roughness: 0.8,
        metalness: 0.0,
      });

      const leftHand = new THREE.Mesh(handGeometry, handMaterial);
      leftHand.position.set(-0.25, 0.75, 0.3);
      leftHand.castShadow = true;
      character.add(leftHand);

      const rightHand = new THREE.Mesh(handGeometry, handMaterial);
      rightHand.position.set(0.25, 0.75, 0.3);
      rightHand.castShadow = true;
      character.add(rightHand);

      // Legs (seated - not visible, but added for completeness)
      const legGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.3, 8);
      const pantsMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        roughness: 0.8,
        metalness: 0.0,
      });

      const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
      leftLeg.position.set(-0.08, 0.35, 0);
      leftLeg.castShadow = true;
      character.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
      rightLeg.position.set(0.08, 0.35, 0);
      rightLeg.castShadow = true;
      character.add(rightLeg);
    } else {
      // Arms
      const armGeometry = new THREE.CylinderGeometry(0.05, 0.04, 0.5, 8);
      const armMaterial = new THREE.MeshStandardMaterial({
        color: shirtColor,
        roughness: 0.7,
        metalness: 0.0,
      });

      // Left arm
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.2, 1.15, 0);
      leftArm.rotation.z = Math.PI / 12;
      leftArm.castShadow = true;
      character.add(leftArm);

      // Right arm
      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.2, 1.15, 0);
      rightArm.rotation.z = -Math.PI / 12;
      rightArm.castShadow = true;
      character.add(rightArm);

      // Hands
      const handGeometry = new THREE.SphereGeometry(0.06, 8, 8);
      const handMaterial = new THREE.MeshStandardMaterial({
        color: skinColor,
        roughness: 0.8,
        metalness: 0.0,
      });

      const leftHand = new THREE.Mesh(handGeometry, handMaterial);
      leftHand.position.set(-0.23, 0.88, 0);
      leftHand.castShadow = true;
      character.add(leftHand);

      const rightHand = new THREE.Mesh(handGeometry, handMaterial);
      rightHand.position.set(0.23, 0.88, 0);
      rightHand.castShadow = true;
      character.add(rightHand);

      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.8, 8);
      const pantsMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        roughness: 0.8,
        metalness: 0.0,
      });

      const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
      leftLeg.position.set(-0.1, 0.5, 0);
      leftLeg.castShadow = true;
      character.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
      rightLeg.position.set(0.1, 0.5, 0);
      rightLeg.castShadow = true;
      character.add(rightLeg);

      // Feet
      const footGeometry = new THREE.BoxGeometry(0.12, 0.05, 0.2);
      const footMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c2c2c,
        roughness: 0.6,
        metalness: 0.2,
      });

      const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
      leftFoot.position.set(-0.1, 0.05, 0.05);
      leftFoot.castShadow = true;
      character.add(leftFoot);

      const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
      rightFoot.position.set(0.1, 0.05, 0.05);
      rightFoot.castShadow = true;
      character.add(rightFoot);
    }

    const hairGeometry = new THREE.SphereGeometry(
      0.16,
      16,
      16,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: Math.random() > 0.5 ? 0x2c2c2c : 0x654321,
      roughness: 0.9,
      metalness: 0.0,
    });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = isSeated ? 1.02 : 1.62;
    hair.castShadow = true;
    character.add(hair);

    return character;
  }

  /**
   * Create all student characters
   */
  createStudents() {
    const studentsGroup = new THREE.Group();
    studentsGroup.name = "Students";

    const rows = 5;
    const columns = 4;
    const deskSpacing = 2.2;
    const rowSpacing = 2.0;

    const startX = (-(columns - 1) * deskSpacing) / 2;
    const startZ = 3;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const skinColor = randomColor(this.skinTones);
        const shirtColor = randomColor(this.shirtColors);

        const student = this.createCharacterModel(skinColor, shirtColor, true);

        const x = startX + col * deskSpacing;
        const z = startZ - row * rowSpacing;

        student.position.set(x, 0.45, z + 0.3); // On chair

        student.rotation.y = (Math.random() - 0.5) * 0.3;

        student.userData = {
          baseY: 0.45,
          swaySpeed: 0.5 + Math.random() * 0.5,
          swayAmount: 0.005 + Math.random() * 0.005,
          swayOffset: Math.random() * Math.PI * 2,
        };

        this.students.push(student);
        studentsGroup.add(student);
      }
    }

    this.group.add(studentsGroup);
  }

  /**
   * Create teacher character
   */
  createTeacher() {
    const teacherGroup = new THREE.Group();
    teacherGroup.name = "Teacher";

    const skinColor = this.skinTones[2];
    const shirtColor = "#3498DB"; // Professional blue

    const teacher = this.createCharacterModel(skinColor, shirtColor, false);

    teacher.position.set(2, 0, -6.5);
    teacher.rotation.y = Math.PI / 8; // Slight angle toward class

    teacher.userData = {
      baseRotation: Math.PI / 8,
      gestureSpeed: 0.8,
      gestureAmount: 0.2,
    };

    this.teacher = teacher;
    teacherGroup.add(teacher);

    this.group.add(teacherGroup);
  }

  /**
   * Animate characters
   * @param {number} time - Current time in seconds
   */
  update(time) {
    this.students.forEach((student) => {
      const { baseY, swaySpeed, swayAmount, swayOffset } = student.userData;

      student.position.y =
        baseY + Math.sin(time * swaySpeed + swayOffset) * swayAmount;

      if (student.children[0]) {
        // Head
        student.children[0].rotation.x =
          Math.sin(time * swaySpeed * 0.7 + swayOffset) * 0.05;
      }
    });

    if (this.teacher) {
      const { baseRotation, gestureSpeed, gestureAmount } =
        this.teacher.userData;

      this.teacher.rotation.y =
        baseRotation + Math.sin(time * gestureSpeed) * gestureAmount;

      if (this.teacher.children[3]) {
        // Right arm
        this.teacher.children[3].rotation.x =
          Math.sin(time * gestureSpeed * 1.2) * 0.3;
      }
    }
  }

  /**
   * Get all student characters
   * @returns {Array<THREE.Group>} - Array of student groups
   */
  getStudents() {
    return this.students;
  }

  /**
   * Get teacher character
   * @returns {THREE.Group} - Teacher group
   */
  getTeacher() {
    return this.teacher;
  }

  /**
   * Dispose of characters
   */
  dispose() {
    this.group.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      }
    });

    this.students = [];
    this.teacher = null;
    this.scene.remove(this.group);
  }
}
