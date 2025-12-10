import * as THREE from 'three';

/**
 * Creates a procedural texture for materials
 * @param {number} width - Texture width
 * @param {number} height - Texture height
 * @param {Function} drawCallback - Function to draw on canvas context
 * @returns {THREE.CanvasTexture}
 */
export function createProceduralTexture(width, height, drawCallback) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    drawCallback(ctx, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
}

/**
 * Creates a wood texture
 * @param {number} width - Texture width
 * @param {number} height - Texture height
 * @returns {THREE.CanvasTexture}
 */
export function createWoodTexture(width = 512, height = 512) {
    return createProceduralTexture(width, height, (ctx, w, h) => {
        // Base wood color
        const gradient = ctx.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(0.5, '#A0522D');
        gradient.addColorStop(1, '#8B4513');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Wood grain lines
        ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
        ctx.lineWidth = 2;

        for (let i = 0; i < 20; i++) {
            const y = Math.random() * h;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.bezierCurveTo(
                w * 0.25, y + Math.random() * 10 - 5,
                w * 0.75, y + Math.random() * 10 - 5,
                w, y
            );
            ctx.stroke();
        }
    });
}

/**
 * Creates a floor tile texture
 * @param {number} width - Texture width
 * @param {number} height - Texture height
 * @returns {THREE.CanvasTexture}
 */
export function createFloorTexture(width = 512, height = 512) {
    return createProceduralTexture(width, height, (ctx, w, h) => {
        // Base floor color (light gray)
        ctx.fillStyle = '#D3D3D3';
        ctx.fillRect(0, 0, w, h);

        // Tile grid
        const tileSize = w / 4;
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 2;

        for (let x = 0; x <= w; x += tileSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        for (let y = 0; y <= h; y += tileSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Add some noise/variation
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * 3;

            ctx.fillStyle = `rgba(150, 150, 150, ${Math.random() * 0.1})`;
            ctx.fillRect(x, y, size, size);
        }
    });
}

/**
 * Creates a wall texture
 * @param {number} width - Texture width
 * @param {number} height - Texture height
 * @returns {THREE.CanvasTexture}
 */
export function createWallTexture(width = 512, height = 512) {
    return createProceduralTexture(width, height, (ctx, w, h) => {
        // Base wall color (light beige)
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(0, 0, w, h);

        // Add subtle noise for texture
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * 2;

            ctx.fillStyle = `rgba(230, 230, 210, ${Math.random() * 0.3})`;
            ctx.fillRect(x, y, size, size);
        }
    });
}

/**
 * Creates a blackboard texture
 * @param {number} width - Texture width
 * @param {number} height - Texture height
 * @returns {THREE.CanvasTexture}
 */
export function createBlackboardTexture(width = 1024, height = 512) {
    return createProceduralTexture(width, height, (ctx, w, h) => {
        // Dark green blackboard
        ctx.fillStyle = '#2C5F2D';
        ctx.fillRect(0, 0, w, h);

        // Chalk dust effect
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * 1.5;

            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
            ctx.fillRect(x, y, size, size);
        }
    });
}

/**
 * Smoothly animate a value over time
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @param {number} speed - Animation speed (0-1)
 * @returns {number} - New value
 */
export function lerp(current, target, speed) {
    return current + (target - current) * speed;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random value
 */
export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random color from a palette
 * @param {Array<string>} palette - Array of hex colors
 * @returns {string} - Random color
 */
export function randomColor(palette) {
    return palette[Math.floor(Math.random() * palette.length)];
}

/**
 * Dispose of Three.js object and its children
 * @param {THREE.Object3D} object - Object to dispose
 */
export function disposeObject(object) {
    if (!object) return;

    // Dispose geometry
    if (object.geometry) {
        object.geometry.dispose();
    }

    // Dispose material
    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach(material => disposeMaterial(material));
        } else {
            disposeMaterial(object.material);
        }
    }

    // Recursively dispose children
    if (object.children) {
        object.children.forEach(child => disposeObject(child));
    }
}

/**
 * Dispose of a material and its textures
 * @param {THREE.Material} material - Material to dispose
 */
function disposeMaterial(material) {
    if (!material) return;

    // Dispose textures
    Object.keys(material).forEach(key => {
        if (material[key] && material[key].isTexture) {
            material[key].dispose();
        }
    });

    material.dispose();
}

/**
 * FPS counter utility
 */
export class FPSCounter {
    constructor(updateCallback) {
        this.fps = 60;
        this.frames = 0;
        this.lastTime = performance.now();
        this.updateCallback = updateCallback;
    }

    update() {
        this.frames++;
        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;

        if (elapsed >= 1000) {
            this.fps = Math.round((this.frames * 1000) / elapsed);
            this.frames = 0;
            this.lastTime = currentTime;

            if (this.updateCallback) {
                this.updateCallback(this.fps);
            }
        }
    }
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
