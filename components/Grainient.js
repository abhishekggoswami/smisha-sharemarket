'use client';

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';

const rgb = (hex) => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match ? [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255] : [1, 1, 1];
};

const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime, uTimeSpeed, uWarpStrength, uWarpFrequency, uWarpSpeed;
uniform float uWarpAmplitude, uNoiseScale, uGrainAmount, uGrainScale, uContrast;
uniform float uSaturation, uZoom, uBlendAngle;
uniform vec3 uColor1, uColor2, uColor3;
out vec4 fragColor;

mat2 rotate2d(float angle) { float s = sin(angle), c = cos(angle); return mat2(c, -s, s, c); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float value = 0.0, amplitude = .5;
  for (int i = 0; i < 4; i++) { value += amplitude * noise(p); p = p * 2.03 + 19.17; amplitude *= .5; }
  return value;
}
void main() {
  vec2 resolution = max(uResolution, vec2(1.0));
  vec2 uv = gl_FragCoord.xy / resolution;
  float time = uTime * uTimeSpeed;
  vec2 p = (uv - .5) / max(uZoom, .01);
  p.x *= resolution.x / resolution.y;
  p = rotate2d(radians(uBlendAngle)) * p;
  float field = fbm(p * uNoiseScale + vec2(time * .09, -time * .06));
  float warp = max(uWarpAmplitude, .01);
  p.x += sin(p.y * uWarpFrequency + time * uWarpSpeed + field * 6.0) * (uWarpStrength / warp);
  p.y += cos(p.x * uWarpFrequency * 1.27 - time * uWarpSpeed) * (uWarpStrength / (warp * .72));
  float blend = smoothstep(-.72, .72, p.x + (field - .5) * .72);
  float lift = smoothstep(-.65, .8, p.y - (field - .5) * .65);
  vec3 color = mix(uColor1, uColor2, blend);
  color = mix(color, uColor3, lift * .53);
  float grain = hash(gl_FragCoord.xy * max(uGrainScale, .01) + time) - .5;
  color += grain * uGrainAmount;
  color = (color - .5) * uContrast + .5;
  float luminance = dot(color, vec3(.2126, .7152, .0722));
  color = mix(vec3(luminance), color, uSaturation);
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

/* A JavaScript, OGL-backed adaptation of React Bits' Grainient. */
export default function Grainient({
  color1 = '#e9f7ff', color2 = '#b6e4ff', color3 = '#7196e8',
  timeSpeed = .16, warpStrength = .65, warpFrequency = 3.5, warpSpeed = .35,
  warpAmplitude = 36, blendAngle = -22, noiseScale = 1.45, grainAmount = .025,
  grainScale = 1.6, contrast = 1.06, saturation = .78, zoom = 1.04, className = '',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const canvas = document.createElement('canvas');
    if (!canvas.getContext('webgl2')) return undefined;

    let renderer;
    try {
      renderer = new Renderer({ canvas, webgl: 2, alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
      if (!renderer.isWebgl2) return undefined;
    } catch { return undefined; }

    const gl = renderer.gl;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    container.appendChild(canvas);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: new Float32Array([1, 1]) }, uTime: { value: 0 }, uTimeSpeed: { value: timeSpeed },
        uWarpStrength: { value: warpStrength }, uWarpFrequency: { value: warpFrequency }, uWarpSpeed: { value: warpSpeed },
        uWarpAmplitude: { value: warpAmplitude }, uNoiseScale: { value: noiseScale }, uGrainAmount: { value: grainAmount },
        uGrainScale: { value: grainScale }, uContrast: { value: contrast }, uSaturation: { value: saturation }, uZoom: { value: zoom },
        uBlendAngle: { value: blendAngle }, uColor1: { value: new Float32Array(rgb(color1)) }, uColor2: { value: new Float32Array(rgb(color2)) }, uColor3: { value: new Float32Array(rgb(color3)) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const render = () => {
      renderer.bindFramebuffer();
      renderer.setViewport(renderer.width * renderer.dpr, renderer.height * renderer.dpr);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      mesh.draw();
    };
    const resize = () => {
      const bounds = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(bounds.width)), Math.max(1, Math.floor(bounds.height)));
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      render();
    };

    let frame = 0;
    let visible = true;
    const loop = (now) => {
      if (visible && !document.hidden) { program.uniforms.uTime.value = now / 1000; render(); }
      frame = requestAnimationFrame(loop);
    };
    const sizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
    sizeObserver.observe(container);
    visibilityObserver.observe(container);
    resize();
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color1, color2, color3, timeSpeed, warpStrength, warpFrequency, warpSpeed, warpAmplitude, blendAngle, noiseScale, grainAmount, grainScale, contrast, saturation, zoom]);

  return <div className={className} ref={containerRef} />;
}
