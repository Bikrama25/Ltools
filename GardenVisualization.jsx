// GardenVisualization.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GardenVisualization = ({ userProgress }) => {
    const mountRef = useRef(null);
    
    useEffect(() => {
        // Set up Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);
        
        // Add garden elements based on user progress
        const addPlant = (type, x, z, size) => {
            let geometry, material;
            
            switch(type) {
                case 'flower':
                    geometry = new THREE.ConeGeometry(size, size*2, 8);
                    material = new THREE.MeshBasicMaterial({ color: 0xff69b4 });
                    break;
                case 'tree':
                    geometry = new THREE.ConeGeometry(size*0.5, size*3, 5);
                    material = new THREE.MeshBasicMaterial({ color: 0x2e8b57 });
                    break;
                default:
                    geometry = new THREE.SphereGeometry(size);
                    material = new THREE.MeshBasicMaterial({ color: 0x8bc34a });
            }
            
            const plant = new THREE.Mesh(geometry, material);
            plant.position.set(x, size, z);
            scene.add(plant);
            return plant;
        };
        
        // Create garden based on user data
        const plants = [];
        userProgress.plants.forEach((plant, index) => {
            const spacing = 2;
            const x = (index % 3 - 1) * spacing;
            const z = Math.floor(index / 3) * spacing;
            const size = 0.5 + (plant.growthStage / 100);
            plants.push(addPlant(plant.type, x, z, size));
        });
        
        // Add ground
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x9ccc65,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Math.PI / 2;
        scene.add(ground);
        
        // Position camera
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Simple animation
            plants.forEach((plant, index) => {
                plant.rotation.y += 0.01 * (index + 1);
            });
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Cleanup
        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [userProgress]);
    
    return <div ref={mountRef} className="garden-visualization" />;
};

export default GardenVisualization;
