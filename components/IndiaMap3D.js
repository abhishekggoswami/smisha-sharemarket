'use client';

import { useEffect, useRef, useState } from 'react';
import artwork from '../lib/india-map-artwork.json';

export default function IndiaMap3D({ activeIndex, locations, onActivate, children }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const controllerRef = useRef(null);
  const activeRef = useRef(activeIndex);
  const [ready, setReady] = useState(false);
  const [markers, setMarkers] = useState([]);
  activeRef.current = activeIndex;

  useEffect(() => {
    let disposed = false;
    let renderer, model, observer;
    const canvas = canvasRef.current;
    const onContextLost = (event) => { event.preventDefault(); setReady(false); };
    canvas.addEventListener('webglcontextlost', onContextLost);
    import('../lib/india-map-scene.mjs').then(({ createIndiaMapScene, createMapRenderer, locationPoint }) => {
      if (disposed) return;
      renderer = createMapRenderer(canvas);
      model = createIndiaMapScene(artwork);
      const draw = () => {
        if (disposed || renderer.getContext().isContextLost()) return;
        const { width, height } = stageRef.current.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        model.resize(width, height);
        model.select(locations[activeRef.current].stateId);
        renderer.render(model.scene, model.camera);
        setMarkers(locations.map((location, index) => {
          const point = locationPoint(artwork, location.longitude, location.latitude, index === activeRef.current ? 34 : 26).project(model.camera);
          return { x: (point.x + 1) * 50, y: (1 - point.y) * 50 };
        }));
        setReady(true);
      };
      controllerRef.current = draw;
      observer = new ResizeObserver(draw);
      observer.observe(stageRef.current);
      draw();
    }).catch(() => {
      // Keep the interactive SVG when WebGL is unavailable.
      if (!disposed) setReady(false);
    });
    return () => {
      disposed = true;
      controllerRef.current = null;
      observer?.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      model?.dispose();
      renderer?.dispose();
    };
  }, [locations]);

  useEffect(() => { controllerRef.current?.(); }, [activeIndex]);

  return <div className={`india-model-stage india-state-map${ready ? ' is-rendered' : ''}`} ref={stageRef}>
    <canvas className="india-model-canvas" ref={canvasRef} aria-hidden="true" />
    {!ready && <div className="india-model-fallback">{children}</div>}
    {ready && <div className="india-model-pins" role="group" aria-label="Choose a city to read a student review">{locations.map((location, index) => <button key={location.id} type="button" className={`india-model-pin${index === activeIndex ? ' is-active' : ''}`} style={{ left: `${markers[index]?.x || 0}%`, top: `${markers[index]?.y || 0}%` }} onClick={() => onActivate(index)} aria-label={`Show ${location.studentName}'s ${location.city} review`} aria-pressed={index === activeIndex}><span className="india-model-pin-dot" />{index === activeIndex && <span className="india-model-pin-label">{location.city}</span>}</button>)}</div>}
  </div>;
}
