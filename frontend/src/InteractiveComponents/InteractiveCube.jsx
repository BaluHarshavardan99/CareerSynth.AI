import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const InteractiveCube = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // Create Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    if (container) {
      container.appendChild(renderer.domElement);
    }

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Add Cube
    const geometry = new THREE.BoxGeometry(3, 4.5, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x0078d7 }); // Match button color
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Camera Position
    camera.position.z = 7;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };

    // Handle Resize
    const handleResize = () => {
      if (container) {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      // Properly dispose of resources
      geometry.dispose();
      material.dispose();
      controls.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="interactive-cube"></div>;
};

export default InteractiveCube;
