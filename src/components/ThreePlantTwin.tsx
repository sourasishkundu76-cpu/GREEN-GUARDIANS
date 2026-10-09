import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Plant } from '../types';
import { RotateCw, Maximize2, Sparkles, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ThreePlantTwinProps {
  plant: Plant;
  isDarkMode?: boolean;
  interactive?: boolean;
}

export const ThreePlantTwin: React.FC<ThreePlantTwinProps> = ({
  plant,
  isDarkMode = true,
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4.5, 9);
    camera.lookAt(0, 2.0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(
      isDarkMode ? 0x1f3829 : 0xf0fdf4,
      isDarkMode ? 1.4 : 1.8
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xa7f3d0, 2.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const accentLight = new THREE.PointLight(0x10b981, 2.5, 15);
    accentLight.position.set(-3, 4, 3);
    scene.add(accentLight);

    const soilProbeGlow = new THREE.PointLight(0x06b6d4, 3, 6);
    soilProbeGlow.position.set(1.4, 0.8, 0.8);
    scene.add(soilProbeGlow);

    // Plant group
    const plantGroup = new THREE.Group();
    scene.add(plantGroup);

    // 1. Soil Pot Base (High-tech geometric planter)
    const potGeo = new THREE.CylinderGeometry(2.3, 1.8, 1.8, 32);
    const potMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x0f2317 : 0xe2e8f0,
      metalness: 0.3,
      roughness: 0.4,
      wireframe: false,
    });
    const potMesh = new THREE.Mesh(potGeo, potMat);
    potMesh.position.y = 0;
    potMesh.receiveShadow = true;
    plantGroup.add(potMesh);

    // Pot rim accent ring (Glowing IoT ring)
    const ringGeo = new THREE.TorusGeometry(2.32, 0.05, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: plant.healthScore > 80 ? 0x10b981 : plant.healthScore > 60 ? 0xf59e0b : 0xef4444,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.9;
    plantGroup.add(ringMesh);

    // 2. Rich Soil Surface
    const soilGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.2, 32);
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x271910,
      roughness: 0.95,
      metalness: 0.05,
    });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.y = 0.85;
    plantGroup.add(soilMesh);

    // 3. ESP32 Smart Soil Probe inserted into soil
    const probeGroup = new THREE.Group();
    const probeBodyGeo = new THREE.BoxGeometry(0.35, 1.2, 0.15);
    const probeMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2,
    });
    const probeMesh = new THREE.Mesh(probeBodyGeo, probeMat);
    probeMesh.position.set(1.2, 1.2, 0.6);
    probeGroup.add(probeMesh);

    // Probe LED beacon
    const ledGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(1.2, 1.7, 0.68);
    probeGroup.add(ledMesh);

    // Antenna & probe prongs in soil
    const prongGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8);
    const prongMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    const prong1 = new THREE.Mesh(prongGeo, prongMat);
    prong1.position.set(1.1, 0.3, 0.6);
    const prong2 = new THREE.Mesh(prongGeo, prongMat);
    prong2.position.set(1.3, 0.3, 0.6);
    probeGroup.add(prong1, prong2);

    plantGroup.add(probeGroup);

    // 4. Plant Stem & Foliage
    // Wilt factor based on moisture/health
    const healthFactor = Math.max(0.4, plant.healthScore / 100);
    const waterFactor = Math.max(0.5, plant.waterStatus / 100);
    const stemCurveFactor = (1 - waterFactor) * 0.35;

    // Main Stem
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.85, 0),
      new THREE.Vector3(stemCurveFactor * 0.4, 2.0, stemCurveFactor * 0.2),
      new THREE.Vector3(-stemCurveFactor * 0.3, 3.2, 0),
      new THREE.Vector3(0, 4.4, 0),
    ]);
    const stemGeo = new THREE.TubeGeometry(curve, 32, 0.14, 12, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: healthFactor > 0.8 ? 0x2e7d32 : healthFactor > 0.6 ? 0x558b2f : 0x827717,
      roughness: 0.6,
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.castShadow = true;
    plantGroup.add(stemMesh);

    // Foliage & Leaves generator
    const leafGeo = new THREE.SphereGeometry(0.65, 12, 12);
    leafGeo.scale(1.2, 0.15, 0.7);

    // Leaf Color adapts to plant health (vibrant green vs chlorotic yellowish)
    const leafColor = healthFactor > 0.8
      ? new THREE.Color(0x15803d)
      : healthFactor > 0.6
      ? new THREE.Color(0x65a30d)
      : new THREE.Color(0xa16207);

    const leafMat = new THREE.MeshStandardMaterial({
      color: leafColor,
      roughness: 0.3,
      metalness: 0.1,
    });

    // Generate balanced botanical canopy
    const leafBranches: THREE.Mesh[] = [];
    const leafPositions = [
      { y: 1.8, angle: 0.3, scale: 0.9, droop: (1 - waterFactor) * 0.5 },
      { y: 2.2, angle: 2.1, scale: 1.0, droop: (1 - waterFactor) * 0.5 },
      { y: 2.7, angle: 3.8, scale: 1.1, droop: (1 - waterFactor) * 0.4 },
      { y: 3.1, angle: 5.4, scale: 1.2, droop: (1 - waterFactor) * 0.4 },
      { y: 3.6, angle: 1.2, scale: 1.1, droop: (1 - waterFactor) * 0.3 },
      { y: 4.0, angle: 2.9, scale: 0.9, droop: (1 - waterFactor) * 0.2 },
      { y: 4.3, angle: 4.7, scale: 0.8, droop: (1 - waterFactor) * 0.1 },
      { y: 4.6, angle: 0.8, scale: 0.6, droop: 0 },
    ];

    leafPositions.forEach((pos, idx) => {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const rad = 0.9 * pos.scale;
      const x = Math.cos(pos.angle) * rad;
      const z = Math.sin(pos.angle) * rad;
      leaf.position.set(x, pos.y, z);
      leaf.rotation.y = pos.angle;
      leaf.rotation.z = Math.PI * 0.12 + pos.droop;
      leaf.scale.set(pos.scale, pos.scale, pos.scale);
      leaf.castShadow = true;
      plantGroup.add(leaf);
      leafBranches.push(leaf);
    });

    // If Tomato or Flowering, add flower/fruit buds!
    if (plant.name.toLowerCase().includes('tomato')) {
      const fruitGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const fruitMat = new THREE.MeshStandardMaterial({
        color: plant.stage === 'Fruiting' ? 0xdc2626 : 0x84cc16,
        roughness: 0.3,
      });
      const fruit1 = new THREE.Mesh(fruitGeo, fruitMat);
      fruit1.position.set(0.6, 3.2, 0.4);
      const fruit2 = new THREE.Mesh(fruitGeo, fruitMat);
      fruit2.position.set(-0.5, 2.6, -0.4);
      fruit2.scale.set(0.8, 0.8, 0.8);
      plantGroup.add(fruit1, fruit2);
    } else if (plant.name.toLowerCase().includes('rose')) {
      const bloomGeo = new THREE.SphereGeometry(0.42, 16, 16);
      const bloomMat = new THREE.MeshStandardMaterial({
        color: 0xe11d48,
        roughness: 0.4,
      });
      const bloom = new THREE.Mesh(bloomGeo, bloomMat);
      bloom.position.set(0, 4.6, 0);
      bloom.scale.set(1.2, 0.9, 1.2);
      plantGroup.add(bloom);
    }

    // 5. Glowing Ambient IoT Particles (Representing Moisture & Nutrients)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 4;
      particlePositions[i + 1] = 0.8 + Math.random() * 3.8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    plantGroup.add(particleSystem);

    // Mouse interaction for rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      plantGroup.rotation.y += deltaX * 0.008;
      camera.position.y = Math.max(2, Math.min(7, camera.position.y - deltaY * 0.02));
      camera.lookAt(0, 2.0, 0);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation
      if (autoRotate && !isDragging) {
        plantGroup.rotation.y += 0.004;
      }

      // Subtle biological breathing sway
      const sway = Math.sin(elapsedTime * 1.5) * 0.02;
      leafBranches.forEach((leaf, i) => {
        leaf.rotation.z += Math.sin(elapsedTime * 1.8 + i) * 0.001;
      });

      // Pulse probe beacon
      ledMesh.scale.setScalar(1 + Math.sin(elapsedTime * 6) * 0.2);
      soilProbeGlow.intensity = 2.5 + Math.sin(elapsedTime * 4) * 1.0;

      // Particle float up
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.008;
        if (positions[i] > 4.8) {
          positions[i] = 0.9;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [plant, isDarkMode, autoRotate, interactive]);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-2xl overflow-hidden bg-gradient-to-b from-emerald-950/40 via-black/40 to-emerald-950/20 border border-emerald-500/20 backdrop-blur-md">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Futuristic HUD Overlays */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[11px] font-mono font-medium text-emerald-300 flex items-center gap-1.5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          DIGITAL PLANT TWIN 3D
        </div>
        <div className="px-2 py-0.5 rounded-md bg-black/60 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
          NODE-01 SYNCD
        </div>
      </div>

      {/* Floating telemetry pills */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-black/70 border border-emerald-500/30 backdrop-blur-md text-right">
          <div className="text-[10px] text-emerald-400/80 uppercase tracking-wider font-mono">Biomass Vigor</div>
          <div className="text-sm font-bold text-emerald-300 font-mono">+{plant.growthRate}%</div>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-black/70 border border-cyan-500/30 backdrop-blur-md text-right">
          <div className="text-[10px] text-cyan-400/80 uppercase tracking-wider font-mono">Soil Saturation</div>
          <div className="text-sm font-bold text-cyan-300 font-mono">{plant.sensors.moisture}%</div>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto bg-black/60 backdrop-blur-md border border-emerald-500/20 px-3 py-2 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-emerald-300/90 hidden sm:inline">
            Drag to inspect 360° • IoT telemetry mapped
          </span>
          <span className="font-mono text-[11px] text-emerald-300/90 sm:hidden">
            Drag 360°
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1 ${
              autoRotate
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            {autoRotate ? 'Auto' : 'Paused'}
          </button>
        </div>
      </div>
    </div>
  );
};
