import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SensorData } from '../types';
import { Layers, Droplets, FlaskConical, Thermometer, Zap } from 'lucide-react';

interface ThreeSoilCrossSectionProps {
  sensors: SensorData;
  isDarkMode?: boolean;
}

export const ThreeSoilCrossSection: React.FC<ThreeSoilCrossSectionProps> = ({
  sensors,
  isDarkMode = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedDepth, setSelectedDepth] = useState<'surface' | 'rhizosphere' | 'deep'>('rhizosphere');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(4, 2.8, 6.5);
    camera.lookAt(0, -0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.9 : 1.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 2, 20);
    pointLight.position.set(2, 4, 3);
    scene.add(pointLight);

    const probeCyanLight = new THREE.PointLight(0x06b6d4, 2.5, 8);
    probeCyanLight.position.set(-0.5, 0.5, 1.2);
    scene.add(probeCyanLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Soil Strata Cross-Section Cubes
    // Layer 1: Organic Topsoil / Humus (0 to -5cm)
    const topGeo = new THREE.BoxGeometry(4.2, 0.8, 2.6);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x2e1a12,
      roughness: 0.9,
      metalness: 0.1,
    });
    const topLayer = new THREE.Mesh(topGeo, topMat);
    topLayer.position.y = 0.8;
    mainGroup.add(topLayer);

    // Layer 2: Rhizosphere active root & moisture zone (-5 to -15cm)
    const midGeo = new THREE.BoxGeometry(4.2, 1.4, 2.6);
    const moistureColor = new THREE.Color(0x3d2b1f).lerp(
      new THREE.Color(0x163529),
      sensors.moisture / 100
    );
    const midMat = new THREE.MeshStandardMaterial({
      color: moistureColor,
      roughness: 0.85,
    });
    const midLayer = new THREE.Mesh(midGeo, midMat);
    midLayer.position.y = -0.3;
    mainGroup.add(midLayer);

    // Layer 3: Subsoil / Mineral Bed (-15 to -25cm)
    const botGeo = new THREE.BoxGeometry(4.2, 1.0, 2.6);
    const botMat = new THREE.MeshStandardMaterial({
      color: 0x4a3728,
      roughness: 0.95,
    });
    const botLayer = new THREE.Mesh(botGeo, botMat);
    botLayer.position.y = -1.5;
    mainGroup.add(botLayer);

    // 2. Glass Cutaway edge frame with holographic measurement grid
    const frameGeo = new THREE.BoxGeometry(4.22, 3.22, 2.62);
    const frameMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.y = -0.1;
    mainGroup.add(frameMesh);

    // 3. Root network mesh strands running through soil
    const rootMat = new THREE.MeshStandardMaterial({
      color: 0xe2d9c8,
      roughness: 0.5,
    });

    const createRootStrand = (points: THREE.Vector3[], radius: number) => {
      const path = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(path, 16, radius, 8, false);
      return new THREE.Mesh(geo, rootMat);
    };

    const root1 = createRootStrand([
      new THREE.Vector3(0.3, 1.2, 0.4),
      new THREE.Vector3(0.5, 0.5, 0.6),
      new THREE.Vector3(0.8, -0.4, 0.7),
      new THREE.Vector3(1.2, -1.0, 0.5),
    ], 0.05);
    const root2 = createRootStrand([
      new THREE.Vector3(0.3, 1.2, 0.4),
      new THREE.Vector3(-0.2, 0.4, 0.5),
      new THREE.Vector3(-0.6, -0.2, 0.8),
      new THREE.Vector3(-1.0, -0.8, 0.6),
    ], 0.04);
    const root3 = createRootStrand([
      new THREE.Vector3(0.5, 0.5, 0.6),
      new THREE.Vector3(0.2, -0.2, 0.9),
      new THREE.Vector3(0.4, -0.8, 0.8),
    ], 0.03);
    mainGroup.add(root1, root2, root3);

    // 4. ESP32 Stainless Steel Industrial Soil Probe inserted vertically
    const probeBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 2.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
    );
    probeBody.position.set(-0.8, 0.2, 0.7);
    mainGroup.add(probeBody);

    // Probe Sensors Rings (Top, Middle, Tip)
    const ringGeo = new THREE.TorusGeometry(0.09, 0.02, 8, 24);
    const ringActiveMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });

    const ring1 = new THREE.Mesh(ringGeo, ringActiveMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.set(-0.8, 0.8, 0.7);

    const ring2 = new THREE.Mesh(ringGeo, ringActiveMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.set(-0.8, -0.1, 0.7);

    const ring3 = new THREE.Mesh(ringGeo, ringActiveMat);
    ring3.rotation.x = Math.PI / 2;
    ring3.position.set(-0.8, -0.9, 0.7);

    mainGroup.add(ring1, ring2, ring3);

    // Probe Top Transmitter Housing with pulsing antenna
    const topHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.5, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x022c22, metalness: 0.7 })
    );
    topHousing.position.set(-0.8, 1.5, 0.7);
    mainGroup.add(topHousing);

    // 5. Floating NPK and Hydration Ions (Interactive particle cloud)
    const ionCount = 60;
    const ionGeo = new THREE.BufferGeometry();
    const ionPos = new Float32Array(ionCount * 3);
    const ionColors = new Float32Array(ionCount * 3);

    for (let i = 0; i < ionCount * 3; i += 3) {
      ionPos[i] = (Math.random() - 0.5) * 3.6;
      ionPos[i + 1] = -1.8 + Math.random() * 2.8;
      ionPos[i + 2] = (Math.random() - 0.5) * 2.0;

      // Color coding: Blue (Moisture/N), Green (P), Gold (K)
      const type = Math.random();
      if (type < 0.4) {
        ionColors[i] = 0.0; ionColors[i + 1] = 0.8; ionColors[i + 2] = 1.0; // Cyan/Water
      } else if (type < 0.7) {
        ionColors[i] = 0.2; ionColors[i + 1] = 0.9; ionColors[i + 2] = 0.4; // Emerald/N
      } else {
        ionColors[i] = 0.9; ionColors[i + 1] = 0.7; ionColors[i + 2] = 0.1; // Gold/P-K
      }
    }

    ionGeo.setAttribute('position', new THREE.BufferAttribute(ionPos, 3));
    ionGeo.setAttribute('color', new THREE.BufferAttribute(ionColors, 3));

    const ionMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const ionParticles = new THREE.Points(ionGeo, ionMat);
    mainGroup.add(ionParticles);

    // Gentle oscillation animation
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Subtle slow turn for depth inspection
      mainGroup.rotation.y = Math.sin(time * 0.4) * 0.15 + 0.4;

      // Pulse probe rings
      ring1.scale.setScalar(1 + Math.sin(time * 4) * 0.1);
      ring2.scale.setScalar(1 + Math.sin(time * 4 + 1) * 0.1);
      ring3.scale.setScalar(1 + Math.sin(time * 4 + 2) * 0.1);

      // Jiggle ion particles
      const pos = ionGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < ionCount * 3; i += 3) {
        pos[i + 1] += Math.sin(time * 2 + i) * 0.002;
      }
      ionGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [sensors, isDarkMode]);

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a1811] via-[#08130d] to-[#040a06] border border-emerald-500/20 shadow-2xl">
      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-pointer" />

      {/* Top Left Depth Badge */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
        <div className="px-2.5 py-1 rounded-full bg-black/70 border border-emerald-500/30 text-[11px] font-mono font-medium text-emerald-300 flex items-center gap-1.5 backdrop-blur-md">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          3D SOIL STRATA CROSS-SECTION
        </div>
        <div className="text-[10px] text-emerald-400/80 font-mono pl-1">
          Capacitive & NPK Depth Spectrum (-25 cm)
        </div>
      </div>

      {/* Strata Layer Selector pills */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/70 backdrop-blur-md border border-emerald-500/20 px-3 py-2 rounded-xl text-xs">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSelectedDepth('surface')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
              selectedDepth === 'surface'
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            0–5cm Topsoil
          </button>
          <button
            onClick={() => setSelectedDepth('rhizosphere')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
              selectedDepth === 'rhizosphere'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            5–15cm Rootzone
          </button>
          <button
            onClick={() => setSelectedDepth('deep')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
              selectedDepth === 'deep'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            15–25cm Subsoil
          </button>
        </div>

        <div className="text-right font-mono text-[11px] text-emerald-400 hidden sm:block">
          Probe Depth: <span className="font-bold text-white">-18 cm active</span>
        </div>
      </div>
    </div>
  );
};
