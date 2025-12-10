import * as THREE from "three";

export class LightingSystem {
  constructor(scene) {
    this.scene = scene;
    this.lights = {};
    this.helpers = [];
    this.shadowsEnabled = true;
    this.bulbs = [];

    this.init();
  }

  init() {
    this.createAmbientLight();
    this.createDirectionalLight();
    this.createCeilingLights();
    this.createBoardSpotlight();
  }

  createAmbientLight() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    ambient.name = "AmbientLight";
    this.lights.ambient = ambient;
    this.scene.add(ambient);
  }

  createDirectionalLight() {
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 15, 5);
    dirLight.castShadow = true;

    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;

    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0001;

    dirLight.name = "DirectionalLight";
    this.lights.directional = dirLight;
    this.scene.add(dirLight);

    // Helper
    const helper = new THREE.DirectionalLightHelper(dirLight, 1);
    helper.visible = false;
    this.helpers.push(helper);
    this.scene.add(helper);
  }

  createCeilingLights() {
    this.lights.ceiling = [];

    const positions = [
      { x: -5, z: -3 },
      { x: 0, z: -3 },
      { x: 5, z: -3 },
      { x: -5, z: 3 },
      { x: 0, z: 3 },
      { x: 5, z: 3 },
    ];

    positions.forEach((pos, index) => {
      const pointLight = new THREE.PointLight(0xfff5e6, 0.5, 15);
      pointLight.position.set(pos.x, 3.8, pos.z);

      if (index < 2) {
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 256;
        pointLight.shadow.mapSize.height = 256;
        pointLight.shadow.camera.near = 0.5;
        pointLight.shadow.camera.far = 10;
      } else {
        pointLight.castShadow = false;
      }

      pointLight.name = `CeilingLight${index}`;
      this.lights.ceiling.push(pointLight);
      this.scene.add(pointLight);

      // Visual bulb
      const bulbGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const bulbMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffee,
      });
      const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
      bulb.position.copy(pointLight.position);
      this.bulbs.push(bulb);
      this.scene.add(bulb);

      if (index < 2) {
        const helper = new THREE.PointLightHelper(pointLight, 0.3);
        helper.visible = false;
        this.helpers.push(helper);
        this.scene.add(helper);
      }
    });
  }

  createBoardSpotlight() {
    const spotlight = new THREE.SpotLight(0xffffff, 0.8);
    spotlight.position.set(0, 3.5, -6);
    spotlight.target.position.set(0, 2, -9.5);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.3;
    spotlight.decay = 2;
    spotlight.distance = 10;
    spotlight.castShadow = true;

    spotlight.shadow.mapSize.width = 512;
    spotlight.shadow.mapSize.height = 512;
    spotlight.shadow.camera.near = 1;
    spotlight.shadow.camera.far = 10;

    spotlight.name = "BoardSpotlight";
    this.lights.boardSpot = spotlight;
    this.scene.add(spotlight);
    this.scene.add(spotlight.target);

    const helper = new THREE.SpotLightHelper(spotlight);
    helper.visible = false;
    this.helpers.push(helper);
    this.scene.add(helper);
  }

  setShadows(enabled) {
    this.shadowsEnabled = enabled;

    if (this.lights.directional) {
      this.lights.directional.castShadow = enabled;
    }

    if (this.lights.ceiling) {
      this.lights.ceiling.forEach((light, index) => {
        if (index < 2) {
          light.castShadow = enabled;
        }
      });
    }

    if (this.lights.boardSpot) {
      this.lights.boardSpot.castShadow = enabled;
    }
  }

  setHelpersVisible(visible) {
    this.helpers.forEach((helper) => {
      helper.visible = visible;
    });
  }

  update(deltaTime) {
    if (!this.lastFlickerTime) this.lastFlickerTime = 0;

    const now = Date.now();
    if (now - this.lastFlickerTime < 100) return;
    this.lastFlickerTime = now;

    if (this.lights.ceiling) {
      const time = now * 0.001;
      this.lights.ceiling.forEach((light, index) => {
        const flicker = 0.5 + Math.sin(time + index) * 0.02;
        light.intensity = flicker;
      });
    }
  }

  setTimeOfDay(hour) {
    const normalizedHour = hour / 24;

    if (this.lights.directional) {
      const intensity = Math.sin(normalizedHour * Math.PI) * 0.8;
      this.lights.directional.intensity = Math.max(0.2, intensity);

      if (hour < 12) {
        this.lights.directional.color.setHex(0xfff5e6);
      } else if (hour < 18) {
        this.lights.directional.color.setHex(0xffffff);
      } else {
        this.lights.directional.color.setHex(0xffdbac);
      }
    }

    if (this.lights.ceiling) {
      const ceilingIntensity =
        0.3 + (1 - Math.sin(normalizedHour * Math.PI)) * 0.5;
      this.lights.ceiling.forEach((light) => {
        light.intensity = ceilingIntensity;
      });
    }
  }

  dispose() {
    Object.values(this.lights).forEach((light) => {
      if (Array.isArray(light)) {
        light.forEach((l) => {
          this.scene.remove(l);
          if (l.dispose) l.dispose();
        });
      } else {
        this.scene.remove(light);
        if (light.dispose) light.dispose();
      }
    });

    this.helpers.forEach((helper) => {
      this.scene.remove(helper);
      if (helper.dispose) helper.dispose();
    });

    this.bulbs.forEach((bulb) => {
      this.scene.remove(bulb);
      bulb.geometry.dispose();
      bulb.material.dispose();
    });

    this.lights = {};
    this.helpers = [];
    this.bulbs = [];
  }
}
