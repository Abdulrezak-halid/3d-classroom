import * as THREE from 'three';

export class ParticleEffects {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];

        this.createDustParticles();
        this.createFloatingBooks();
    }

    /**
     * Create ambient dust particles floating in sunlight
     */
    createDustParticles() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = Math.random() * 4;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

            velocities.push({
                x: (Math.random() - 0.5) * 0.002,
                y: Math.random() * 0.01 + 0.005,
                z: (Math.random() - 0.5) * 0.002
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.03,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        const dustParticles = new THREE.Points(geometry, material);
        dustParticles.name = 'DustParticles';
        dustParticles.userData.velocities = velocities;

        this.particles.push(dustParticles);
        this.scene.add(dustParticles);
    }

    /**
     * Create floating book particles for decorative effect
     */
    createFloatingBooks() {
        const bookGroup = new THREE.Group();
        bookGroup.name = 'FloatingBooks';

        for (let i = 0; i < 5; i++) {
            const bookGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.05);
            const bookMaterial = new THREE.MeshStandardMaterial({
                color: this.getRandomBookColor(),
                roughness: 0.7,
                metalness: 0.1
            });

            const book = new THREE.Mesh(bookGeometry, bookMaterial);
            book.position.set(
                (Math.random() - 0.5) * 18,
                2 + Math.random() * 1.5,
                (Math.random() - 0.5) * 14
            );
            book.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            book.castShadow = true;

            book.userData = {
                speed: 0.2 + Math.random() * 0.3,
                radius: 0.3 + Math.random() * 0.2,
                offset: Math.random() * Math.PI * 2
            };

            bookGroup.add(book);
        }

        this.particles.push(bookGroup);
        this.scene.add(bookGroup);
    }

    /**
     * Get random book color
     */
    getRandomBookColor() {
        const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFFEAA7, 0xDDA15E];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Update particle animations
     */
    update(elapsedTime) {
        this.particles.forEach(particle => {
            if (particle.name === 'DustParticles') {
                const positions = particle.geometry.attributes.position.array;
                const velocities = particle.userData.velocities;

                for (let i = 0; i < positions.length / 3; i++) {
                    positions[i * 3] += velocities[i].x;
                    positions[i * 3 + 1] += velocities[i].y;
                    positions[i * 3 + 2] += velocities[i].z;

                    // Reset particles that go too high
                    if (positions[i * 3 + 1] > 4) {
                        positions[i * 3 + 1] = 0;
                    }

                    // Keep particles in bounds
                    if (Math.abs(positions[i * 3]) > 10) {
                        velocities[i].x *= -1;
                    }
                    if (Math.abs(positions[i * 3 + 2]) > 7.5) {
                        velocities[i].z *= -1;
                    }
                }

                particle.geometry.attributes.position.needsUpdate = true;
            } else if (particle.name === 'FloatingBooks') {
                particle.children.forEach((book, index) => {
                    const { speed, radius, offset } = book.userData;

                    // Circular floating motion
                    book.position.y += Math.sin(elapsedTime * speed + offset) * 0.001;

                    // Rotation
                    book.rotation.x += 0.002;
                    book.rotation.y += 0.003;
                });
            }
        });
    }

    /**
     * Dispose of particles
     */
    dispose() {
        this.particles.forEach(particle => {
            if (particle.geometry) particle.geometry.dispose();
            if (particle.material) particle.material.dispose();
            this.scene.remove(particle);
        });
        this.particles = [];
    }
}
