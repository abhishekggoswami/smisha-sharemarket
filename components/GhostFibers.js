'use client';

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';

const hexToRgb = (hex) => {
  const value = hex.trim().replace(/^#/, '');
  const normalized = value.length === 3 ? value.replace(/./g, (channel) => channel + channel) : value;
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  return match ? [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255] : [1, 1, 1];
};

const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime, uSpeed, uScale, uRotation, uRotationSpeed, uLayers;
uniform float uWaveAmplitude, uWaveFrequency, uWaveSpeed, uLayerSpeed;
uniform float uTwist, uTwistFrequency, uTwistSpeed, uLineFrequency, uLineSpacing;
uniform float uLineSharpness, uGlowFalloff, uGlowIntensity, uBrightness, uBlueBoost;
uniform float uVignette, uGrain, uLightMode;
uniform vec3 uLineColor, uGlowColor, uBackdropColor;
out vec4 fragColor;

#define MAX_LAYERS 10
mat2 rotate2d(float angle) { float s = sin(angle), c = cos(angle); return mat2(c, -s, s, c); }
float hash(vec2 p) { return fract(sin(dot(floor(p), vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 resolution = max(uResolution, vec2(1.0));
  vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
  float time = uTime * uSpeed;
  vec2 p = rotate2d(radians(uRotation) + time * uRotationSpeed) * (uv / max(uScale, .05));
  vec3 color = vec3(0.0);
  float fiberField = 0.0;

  for (int index = 0; index < MAX_LAYERS; index++) {
    float fi = float(index) + 1.0;
    if (fi > uLayers) break;
    vec2 q = p + uWaveAmplitude * sin(p.yx * fi * uWaveFrequency + time * (uWaveSpeed + fi * uLayerSpeed));
    float radius = length(q);
    float angle = atan(q.y, q.x) + sin(radius * uTwistFrequency - time * uTwistSpeed + fi) * uTwist;
    q = vec2(cos(angle), sin(angle)) * radius;
    float line = pow(max(0.0, 1.0 - abs(sin(q.x * (uLineFrequency + fi * uLineSpacing) + sin(q.y * 3.0 + time)))), uLineSharpness);
    float glow = exp(-uGlowFalloff * abs(sin(q.x * 3.0 + time + fi)));
    fiberField += line / fi;
    color += uLineColor * line / fi + uGlowColor * glow * uGlowIntensity / (fi * 2.0);
  }

  float center = exp(-2.2 * dot(uv, uv));
  color += (uLineColor * .78 + uGlowColor * .15) * center;
  float vignette = 1.0 - smoothstep(.35, 1.45, length(uv));
  color *= mix(1.0 - uVignette, 1.0, vignette);
  color = 1.0 - exp(-color * uBrightness);
  color.b *= uBlueBoost;
  float noise = (hash(gl_FragCoord.xy + uTime * 20.0) - .5) * uGrain;
  vec3 backdrop = uLightMode > .5 ? vec3(1.0) : uBackdropColor;
  vec3 outputColor = uLightMode > .5 ? mix(backdrop, uLineColor, pow(fiberField * vignette, 1.5) * .28) : backdrop + color;
  fragColor = vec4(clamp(outputColor + noise, 0.0, 1.0), 1.0);
}
`;

export default function GhostFibers({
  lineColor = '#140E35', glowColor = '#3437A0', speed = .2, scale = 2, rotation = 0,
  rotationSpeed = .25, layers = 4, waveAmplitude = .015, waveFrequency = 3, waveSpeed = .15,
  layerSpeed = .08, twist = .1, twistFrequency = 5, twistSpeed = 1.2, lineFrequency = 5,
  lineSpacing = 2, lineSharpness = 16, glowFalloff = 10, glowIntensity = 1.6, brightness = 2,
  blueBoost = 1.25, vignette = .8, grain = .05, lightMode = false, dpr = 1, fps = 60,
  paused = false, className = '', backdropColor = '#070a24',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // The shader uses GLSL 300 ES, which requires WebGL2.  OGL will otherwise
    // fall back to WebGL1 and then report a shader error in the browser.
    // Leave the existing hero gradient in place when WebGL2 is unavailable.
    const canvas = document.createElement('canvas');
    const webgl2 = canvas.getContext('webgl2');
    if (!webgl2) return undefined;

    let renderer;
    let gl;
    try {
      renderer = new Renderer({ canvas, webgl: 2, alpha: false, antialias: false, dpr: Math.min(Math.max(dpr, .5), 2) });
      gl = renderer.gl;
      if (!renderer.isWebgl2) return undefined;
    } catch {
      return undefined;
    }

    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'display:block;height:100%;width:100%';
    container.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: new Float32Array([1, 1]) }, uTime: { value: 0 }, uSpeed: { value: speed }, uScale: { value: scale }, uRotation: { value: rotation }, uRotationSpeed: { value: rotationSpeed },
        uLayers: { value: Math.min(Math.max(Math.round(layers), 1), 10) }, uWaveAmplitude: { value: waveAmplitude }, uWaveFrequency: { value: waveFrequency }, uWaveSpeed: { value: waveSpeed }, uLayerSpeed: { value: layerSpeed },
        uTwist: { value: twist }, uTwistFrequency: { value: twistFrequency }, uTwistSpeed: { value: twistSpeed }, uLineFrequency: { value: lineFrequency }, uLineSpacing: { value: lineSpacing }, uLineSharpness: { value: lineSharpness },
        uGlowFalloff: { value: glowFalloff }, uGlowIntensity: { value: glowIntensity }, uBrightness: { value: brightness }, uBlueBoost: { value: blueBoost }, uVignette: { value: vignette }, uGrain: { value: grain }, uLightMode: { value: lightMode ? 1 : 0 },
        uLineColor: { value: new Float32Array(hexToRgb(lineColor)) }, uGlowColor: { value: new Float32Array(hexToRgb(glowColor)) }, uBackdropColor: { value: new Float32Array(hexToRgb(backdropColor)) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    // OGL 1.0.11 can return an undefined render list in its scene renderer
    // under Turbopack. This is a full-screen mesh, so draw it directly and
    // avoid the scene graph path entirely.
    const render = () => {
      renderer.bindFramebuffer();
      renderer.setViewport(renderer.width * renderer.dpr, renderer.height * renderer.dpr);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      mesh.draw();
    };
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(width)), Math.max(1, Math.floor(height)));
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      render();
    };

    let frameId = 0;
    let lastFrame = 0;
    const frameLength = 1000 / Math.min(Math.max(fps, 1), 120);
    const loop = (now) => {
      if (!paused && !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (now - lastFrame >= frameLength) { program.uniforms.uTime.value = now / 1000; render(); lastFrame = now; }
        frameId = requestAnimationFrame(loop);
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    if (!paused) frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [lineColor, glowColor, speed, scale, rotation, rotationSpeed, layers, waveAmplitude, waveFrequency, waveSpeed, layerSpeed, twist, twistFrequency, twistSpeed, lineFrequency, lineSpacing, lineSharpness, glowFalloff, glowIntensity, brightness, blueBoost, vignette, grain, lightMode, dpr, fps, paused]);

  return <div ref={containerRef} className={className} />;
}
