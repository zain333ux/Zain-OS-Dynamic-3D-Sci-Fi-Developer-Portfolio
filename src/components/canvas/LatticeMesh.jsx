import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LatticeMesh = ({ shouldReduceMotion }) => {
  const groupRef = useRef();
  const pointsGeomRef = useRef(null);
  const linesGeomRef = useRef(null);
  const pointsMatRef = useRef(null);
  const linesMatRef = useRef(null);
  const frameCountRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor global scrolling ratios
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate stable procedural points once (useMemo)
  const positions = useMemo(() => {
    const pts = [];
    const bounds = 3.6;
    const count = 48; // Moderate density
    for (let i = 0; i < count; i++) {
      pts.push({
        x: (Math.random() - 0.5) * bounds,
        y: (Math.random() - 0.5) * bounds,
        z: (Math.random() - 0.5) * bounds,
      });
    }
    return pts;
  }, []);

  // Set up spring physics particle state
  const pointsState = useRef(
    positions.map((p) => ({
      x: p.x,
      y: p.y,
      z: p.z,
      ox: p.x, // original coordinates
      oy: p.y,
      oz: p.z,
      vx: 0, // velocity
      vy: 0,
      vz: 0,
    }))
  );

  // Pre-allocate buffer arrays for Three.js geometries
  const { pointPositions, linePositions } = useMemo(() => {
    const ptPos = [];
    const lnPos = [];

    positions.forEach((p) => {
      ptPos.push(p.x, p.y, p.z);
    });

    // Allocate connection lines space for up to 300 segments (600 vertices)
    const maxLineVertices = 600;
    for (let i = 0; i < maxLineVertices * 3; i++) {
      lnPos.push(0);
    }

    return {
      pointPositions: new Float32Array(ptPos),
      linePositions: new Float32Array(lnPos),
    };
  }, [positions]);

  // Framer render loop running at 60 FPS
  useFrame(({ clock, mouse, camera }) => {
    const time = clock.getElapsedTime();
    const isMobileViewport = window.innerWidth < 768;

    // Rate-limited CSS theme synchronization
    frameCountRef.current++;
    if (frameCountRef.current % 10 === 0) {
      try {
        const rootStyle = getComputedStyle(document.documentElement);
        const accentPrimary = rootStyle.getPropertyValue('--accent-dynamic').trim();
        const accentSecondary = rootStyle.getPropertyValue('--accent-dynamic-secondary').trim();

        if (accentPrimary && pointsMatRef.current) {
          pointsMatRef.current.color.set(accentPrimary);
        }
        if (accentSecondary && linesMatRef.current) {
          linesMatRef.current.color.set(accentSecondary);
        }
      } catch (err) {
        console.warn("WebGL Theme Sync Error:", err);
      }
    }

    if (groupRef.current && !shouldReduceMotion) {
      // Slow background rotations driven by clock + scroll position
      groupRef.current.rotation.y = time * 0.025 + scrollProgress * Math.PI * 0.5;
      groupRef.current.rotation.z = time * 0.005;

      // Mouse coordinate parallax
      groupRef.current.rotation.x = mouse.y * 0.06;
      groupRef.current.rotation.y += mouse.x * 0.06;

      // Dolly zoom + camera parallax offsets: Camera shifts positions based on scroll progression
      const targetZ = 4.6 + Math.sin(scrollProgress * Math.PI) * 0.9;
      const targetY = -scrollProgress * 2.2;
      const targetX = Math.cos(scrollProgress * Math.PI) * 0.4;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, scrollProgress * 0.12, 0.08);
    }

    // Spring physics mouse attraction (active on desktop viewports)
    if (!shouldReduceMotion && !isMobileViewport) {
      const aspect = window.innerWidth / window.innerHeight;
      
      // Map mouse coordinates to 3D space at Z=0
      const mX = mouse.x * 2.3 * aspect;
      const mY = mouse.y * 2.3;
      const mZ = 0;

      const pts = pointsState.current;
      const springK = 0.04;    // spring back tension
      const damping = 0.86;    // momentum decay
      const pullForce = 0.07;  // cursor magnet pull strength
      const pullRadius = 1.8;  // attraction distance

      pts.forEach((p) => {
        // Distance to cursor
        const dx = mX - p.x;
        const dy = mY - p.y;
        const dz = mZ - p.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        let fx = 0, fy = 0, fz = 0;

        // Pull toward mouse if within radius
        if (dist < pullRadius && dist > 0.01) {
          const force = (1 - dist / pullRadius) * pullForce;
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
          fz += (dz / dist) * force;
        }

        // Pull back to original coordinate
        fx += (p.ox - p.x) * springK;
        fy += (p.oy - p.y) * springK;
        fz += (p.oz - p.z) * springK;

        // Apply velocity & updates
        p.vx = (p.vx + fx) * damping;
        p.vy = (p.vy + fy) * damping;
        p.vz = (p.vz + fz) * damping;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
      });

      // Update geometry buffers
      const ptGeom = pointsGeomRef.current;
      const lnGeom = linesGeomRef.current;

      if (ptGeom && lnGeom) {
        const ptAttr = ptGeom.getAttribute('position');
        const lnAttr = lnGeom.getAttribute('position');
        const lnArr = lnAttr.array;

        pts.forEach((p, idx) => {
          ptAttr.setXYZ(idx, p.x, p.y, p.z);
        });
        ptAttr.needsUpdate = true;

        // Recalculate node connections on-the-fly based on animated positions
        let lineIdx = 0;
        const threshold = 1.5;

        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const dz = pts[i].z - pts[j].z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < threshold && lineIdx < lnArr.length - 6) {
              lnArr[lineIdx++] = pts[i].x;
              lnArr[lineIdx++] = pts[i].y;
              lnArr[lineIdx++] = pts[i].z;
              lnArr[lineIdx++] = pts[j].x;
              lnArr[lineIdx++] = pts[j].y;
              lnArr[lineIdx++] = pts[j].z;
            }
          }
        }

        // Clean out index remnants
        while (lineIdx < lnArr.length) {
          lnArr[lineIdx++] = 0;
        }
        lnAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connected Lines segments */}
      <lineSegments>
        <bufferGeometry ref={linesGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          ref={linesMatRef}
          color="#618764" 
          transparent 
          opacity={0.16} 
          linewidth={1}
        />
      </lineSegments>

      {/* Nodes points segment */}
      <points>
        <bufferGeometry ref={pointsGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[pointPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMatRef}
          color="#9CB080"
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.5}
        />
      </points>
    </group>
  );
};

// Canvas Wrapper Component - Fixed globally behind all elements
const LatticeCanvas = ({ shouldReduceMotion }) => {
  return (
    <div className="fixed inset-0 z-[-1] opacity-25 select-none pointer-events-none bg-bgDark" aria-hidden="true">
      <Canvas 
        camera={{ position: [0, 0, 4.6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <LatticeMesh shouldReduceMotion={shouldReduceMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default LatticeCanvas;
