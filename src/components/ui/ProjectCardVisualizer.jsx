import React, { useEffect, useRef, useState } from 'react';

const ProjectCardVisualizer = ({ projectId }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    containerRef.current = container;

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse inputs
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = {
        x: x,
        y: y,
        rx: x / rect.width, // relative coordinate [0, 1]
        ry: y / rect.height
      };
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Setup visualizer animation states depending on project ID
    let animationFrameId;
    let time = 0;

    // 1. CPI Network Dynamics Setup
    const nodes = [];
    const nodeCount = 18;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * 200 + 50,
        y: Math.random() * 120 + 40,
        ox: Math.random() * 200 + 50,
        oy: Math.random() * 120 + 40,
        vx: 0,
        vy: 0,
        size: Math.random() * 2.5 + 1.5,
        centrality: Math.random()
      });
    }

    // 2. Gradient Descent saddle mesh setup
    let gdPoint = { u: 0.1, v: 0.8 };

    // 4. Bouncing SFML colliders setup
    const gameEntities = [];
    for (let i = 0; i < 12; i++) {
      gameEntities.push({
        x: Math.random() * 260 + 20,
        y: Math.random() * 140 + 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: 3,
        flash: 0
      });
    }

    // 5. Vacuum platformer particles setup
    const debris = [];
    for (let i = 0; i < 35; i++) {
      debris.push({
        x: Math.random() * 300,
        y: Math.random() * 200,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
        dist: Math.random() * 120 + 20,
        color: Math.random() > 0.5 ? '#06B6D4' : '#7C3AED'
      });
    }

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.015;
      const w = canvas.width;
      const h = canvas.height;
      const mouse = mouseRef.current;

      // Adjust opacity based on hover state smoothly
      ctx.globalAlpha = isHovered ? 0.35 : 0.12;

      if (projectId === 'economic-network-dynamics') {
        // CPI dynamics force directed graph simulation
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.fillStyle = '#06B6D4';

        // Gravitational force pull to mouse on hover
        const targetX = isHovered ? mouse.x : w / 2;
        const targetY = isHovered ? mouse.y : h / 2;

        nodes.forEach((n, idx) => {
          let fx = (n.ox - n.x) * 0.02;
          let fy = (n.oy - n.y) * 0.02;

          if (isHovered) {
            const dx = targetX - n.x;
            const dy = targetY - n.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 130) {
              const pull = (1 - dist / 130) * 0.28;
              fx += (dx / dist) * pull;
              fy += (dy / dist) * pull;
            }
          }

          // Inter-node repulsion
          for (let j = idx + 1; j < nodes.length; j++) {
            const o = nodes[j];
            const dx = o.x - n.x;
            const dy = o.y - n.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 40 && dist > 1) {
              const rep = (1 - dist / 40) * 0.4;
              fx -= (dx / dist) * rep;
              fy -= (dy / dist) * rep;
            }
          }

          n.vx = (n.vx + fx) * 0.85;
          n.vy = (n.vy + fy) * 0.85;
          n.x += n.vx;
          n.y += n.vy;

          // Draw node similarity vectors
          nodes.forEach((o, oidx) => {
            if (idx === oidx) return;
            const dist = Math.sqrt((o.x - n.x)**2 + (o.y - n.y)**2);
            if (dist < 55) {
              ctx.lineWidth = (1 - dist / 55) * 0.6;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(o.x, o.y);
              ctx.stroke();
            }
          });

          // Draw node centrality size
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size + (n.centrality * 1.5), 0, Math.PI * 2);
          ctx.fill();
        });

      } else if (projectId === 'student-performance-prediction') {
        // Gradient descent saddle mesh visualizer
        const cols = 16;
        const rows = 12;
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 0.55;

        // Rotation angles driven by scroll/mouse sway
        const rotationY = (mouse.rx - 0.5) * 0.45;
        const rotationX = 0.5 + (mouse.ry - 0.5) * 0.2;

        const projectPoint = (u, v) => {
          // Normalize coordinates
          const x = (u - 0.5) * (w * 0.65);
          const y = (v - 0.5) * (h * 0.5);
          // Mathematical saddle function z = x^2 - y^2
          const z = ((u - 0.5) * (u - 0.5) - (v - 0.5) * (v - 0.5)) * (h * 0.4);

          // Standard isometric projection math
          const cosY = Math.cos(rotationY);
          const sinY = Math.sin(rotationY);
          const cosX = Math.cos(rotationX);
          const sinX = Math.sin(rotationX);

          // Rotate around axes
          const xRot = x * cosY - z * sinY;
          const zRot = x * sinY + z * cosY;
          const yRot = y * cosX - zRot * sinX;

          return {
            x: w / 2 + xRot,
            y: h / 2 - 10 + yRot
          };
        };

        // Draw mathematical 3D saddle curve lines
        for (let r = 0; r < rows; r++) {
          ctx.beginPath();
          for (let c = 0; c < cols; c++) {
            const pt = projectPoint(c / (cols - 1), r / (rows - 1));
            if (c === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          for (let r = 0; r < rows; r++) {
            const pt = projectPoint(c / (cols - 1), r / (rows - 1));
            if (r === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        // Animate descent optimization dot
        gdPoint.u += (0.5 - gdPoint.u) * 0.012;
        gdPoint.v += (0.5 - gdPoint.v) * 0.012;

        // Reset if reached convergence
        if (Math.abs(gdPoint.u - 0.5) < 0.01 && Math.abs(gdPoint.v - 0.5) < 0.01) {
          gdPoint = { u: Math.random() > 0.5 ? 0.05 : 0.95, v: Math.random() > 0.5 ? 0.05 : 0.95 };
        }

        const descentPt = projectPoint(gdPoint.u, gdPoint.v);
        ctx.fillStyle = '#06B6D4';
        ctx.beginPath();
        ctx.arc(descentPt.x, descentPt.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

      } else if (projectId === 'network-latency-optimization') {
        // Network delay routing nodes simulator
        const nodeCount = 6;
        const cy = h / 2;
        
        // Horizontal spacing stretches dynamically based on cursor proximity
        const cursorRatio = isHovered ? mouse.rx : 0.5;
        const spacing = (w * 0.7) / (nodeCount - 1) * (0.6 + cursorRatio * 0.8);
        const startX = (w - spacing * (nodeCount - 1)) / 2;

        ctx.strokeStyle = 'rgba(124, 58, 237, 0.25)';
        ctx.fillStyle = '#7C3AED';
        ctx.lineWidth = 1;

        // Draw network link pathways
        ctx.beginPath();
        for (let i = 0; i < nodeCount; i++) {
          const nx = startX + i * spacing;
          if (i === 0) ctx.moveTo(nx, cy);
          else ctx.lineTo(nx, cy);
        }
        ctx.stroke();

        // Draw individual nodes
        for (let i = 0; i < nodeCount; i++) {
          const nx = startX + i * spacing;
          const oscY = cy + Math.sin(time * 3.5 + i) * 6; // oscillate vertically to look alive
          
          ctx.fillStyle = i === 2 || i === 3 ? '#06B6D4' : '#7C3AED';
          ctx.beginPath();
          ctx.arc(nx, oscY, 5, 0, Math.PI * 2);
          ctx.fill();

          if (isHovered && i === 2) {
            ctx.font = '7px monospace';
            ctx.fillStyle = '#06B6D4';
            ctx.fillText('OPTIMAL_N', nx - 18, oscY - 10);
          }
        }

      } else if (projectId === 'metal-slug-2d-engine') {
        // SFML Game engine colliders bouncing check
        ctx.strokeStyle = '#7C3AED';
        ctx.fillStyle = '#7C3AED';

        // Custom cursor boundary collider
        const cursorR = 35;
        if (isHovered) {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, cursorR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Update bouncing sprites
        gameEntities.forEach(ent => {
          ent.x += ent.vx;
          ent.y += ent.vy;

          // Border bounce checks
          if (ent.x < 10 || ent.x > w - 10) ent.vx *= -1;
          if (ent.y < 10 || ent.y > h - 10) ent.vy *= -1;

          // Cursor barrier collision logic
          if (isHovered) {
            const dx = ent.x - mouse.x;
            const dy = ent.y - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < cursorR + ent.size) {
              ent.flash = 20; // Trigger collision flash frames
              // Vector rebound velocity calculation
              const rx = dx / dist;
              const ry = dy / dist;
              ent.vx = rx * 1.5;
              ent.vy = ry * 1.5;
            }
          }

          if (ent.flash > 0) {
            ctx.fillStyle = `rgba(239, 68, 68, ${ent.flash / 20})`; // flash red on collision
            ent.flash--;
            ctx.beginPath();
            ctx.arc(ent.x, ent.y, ent.size + 1.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = '#7C3AED';
            ctx.beginPath();
            ctx.arc(ent.x, ent.y, ent.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });

      } else if (projectId === 'tumble-pop-2d-platformer') {
        // Platformer vacuum cleaner vortex particle physics
        const tX = isHovered ? mouse.x : w / 2;
        const tY = isHovered ? mouse.y : h / 2;

        debris.forEach(d => {
          d.angle += 0.025 * d.speed;
          
          if (isHovered) {
            // Sucked toward center spiral coordinate
            d.dist -= 1.25;
            if (d.dist < 5) {
              d.dist = Math.random() * 100 + 40;
              d.angle = Math.random() * Math.PI * 2;
            }
          } else {
            // Natural ambient orbit relax
            d.dist += Math.sin(time + d.angle) * 0.1;
            if (d.dist > 130) d.dist = 100;
          }

          const dx = tX + Math.cos(d.angle) * d.dist;
          const dy = tY + Math.sin(d.angle) * d.dist;
          
          ctx.fillStyle = d.color;
          ctx.beginPath();
          ctx.arc(dx, dy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [projectId, isHovered]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none select-none rounded-md transition-opacity duration-300 opacity-60"
    />
  );
};

export default ProjectCardVisualizer;
