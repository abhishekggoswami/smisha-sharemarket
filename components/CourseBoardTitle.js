'use client';

import { gsap } from 'gsap';
import { useId, useLayoutEffect, useRef } from 'react';

const BOARD_HOLD = .16;
const PEN_ENTRY = .32;
const DRAWING_BUDGET = 4.65;
const LIFT_TIME = .025;
const PEN_EXIT = .3;
// Keep the descender of "Investing" within the live title's line box. The
// previous expanded mapping reached the bottom edge and clipped the final g.
const MASK_HEIGHT_SCALE = 1;
const MASK_TOP_OFFSET = 0;
// Extra mask breadth covers the browser's anti-aliased live font edges so
// strokes remain whole during the reveal rather than ending in clipped caps.
const MASK_PAD = 270;
const PEN_VIEWBOX = { width: 280, height: 56, nibX: 8, nibY: 28 };

function pointOn(path, distance) {
  const point = path.getPointAtLength(distance);
  const next = path.getPointAtLength(Math.min(path.getTotalLength(), distance + 2));
  return {
    x: point.x,
    y: point.y,
    angle: Math.atan2(next.y - point.y, next.x - point.x) * 180 / Math.PI,
  };
}

export default function CourseBoardTitle({ slug = 'smart-investing-fundamentals', title = 'Smart Investing', outline }) {
  const maskId = 'course-ink-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const maskPathRefs = useRef([]);
  const inkRef = useRef(null);
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const penRef = useRef(null);
  const penLayerRef = useRef(null);
  const penImageRef = useRef(null);
  const pathRefs = useRef([]);
  const writingGuides = outline.trajectories;
  const titleLines = title.split('\n');

  useLayoutEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    const pen = penRef.current;
    const penLayer = penLayerRef.current;
    const penImage = penImageRef.current;
    const paths = pathRefs.current.filter(Boolean);
    if (!root || !title || !pen || !penLayer || !penImage || paths.length !== writingGuides.length) return undefined;

    delete root.dataset.complete;
    inkRef.current?.setAttribute('mask', `url(#${maskId})`);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      inkRef.current?.removeAttribute('mask');
      title.style.webkitMaskImage = 'none';
      title.style.maskImage = 'none';
      return undefined;
    }

    const width = title.offsetWidth;
    const paintHeight = title.offsetHeight;
    const bottomPaintAllowance = 0;
    const height = paintHeight - bottomPaintAllowance;
    if (!width || !height) return undefined;
    const markerPadding = slug === 'smart-investing-fundamentals' ? MASK_PAD : 0;

    penLayer.setAttribute('viewBox', `0 0 ${width} ${height}`);
    penLayer.style.height = `${height}px`;
    const penLength = Math.max(115, Math.min(140, width * .28));
    const penHeight = penLength * PEN_VIEWBOX.height / PEN_VIEWBOX.width;
    penImage.setAttribute('x', `${-penLength * PEN_VIEWBOX.nibX / PEN_VIEWBOX.width}`);
    penImage.setAttribute('y', `${-penHeight * PEN_VIEWBOX.nibY / PEN_VIEWBOX.height}`);
    penImage.setAttribute('width', `${penLength}`);
    penImage.setAttribute('height', `${penHeight}`);
    const lengths = paths.map((path) => path.getTotalLength());
    const totalLength = lengths.reduce((sum, length) => sum + length, 0);
    const minimumStrokeTime = .08;
    const distributableTime = DRAWING_BUDGET - minimumStrokeTime * paths.length;
    const strokeDurations = lengths.map((length) => minimumStrokeTime + distributableTime * (length / totalLength));
    const writingDuration = PEN_ENTRY + DRAWING_BUDGET + LIFT_TIME * (paths.length - 1);
    const state = { progress: 0 };
    const first = pointOn(paths[0], 0);
    const schedule = [];
    let cursor = PEN_ENTRY;
    let markerAngle = -28;

    paths.forEach((path, index) => {
      schedule.push({ type: 'draw', index, path, start: cursor, end: cursor + strokeDurations[index] });
      cursor += strokeDurations[index];
      if (index < paths.length - 1) {
        schedule.push({ type: 'lift', index, from: path, to: paths[index + 1], start: cursor, end: cursor + LIFT_TIME });
        cursor += LIFT_TIME;
      }
    });

    const toLocal = (point) => ({
      x: (point.x - outline.viewBox.x) / outline.viewBox.width * width,
      y: height * (MASK_TOP_OFFSET + (point.y - outline.viewBox.y) / outline.viewBox.height * MASK_HEIGHT_SCALE),
    });
    const stabilizeAngle = (pathAngle) => {
      const normalized = ((pathAngle + 180) % 360) - 180;
      const target = Math.max(-58, Math.min(22, normalized - 28));
      const delta = ((target - markerAngle + 540) % 360) - 180;
      markerAngle += Math.max(-6, Math.min(6, delta));
      return markerAngle;
    };
    const positionPen = (point, angle, opacity = 1) => {
      const local = toLocal(point);
      // The supplied SVG points left; its documented nib at (8, 28) is moved
      // to this origin before rotation. The pen body never owns the anchor.
      pen.setAttribute('transform', `translate(${local.x} ${local.y}) rotate(${angle})`);
      pen.style.opacity = `${opacity}`;
      return local;
    };
    const drawSegments = schedule.filter(entry => entry.type === 'draw');
    maskPathRefs.current.slice(0, writingGuides.length).forEach((path, index) => {
      path.setAttribute('stroke-dasharray', `${lengths[index]} ${lengths[index]}`);
    });
    const setMask = time => {
      drawSegments.forEach((segment, index) => {
        const amount = Math.max(0, Math.min(1, (time - segment.start) / (segment.end - segment.start)));
        const path = maskPathRefs.current[index];
        path.setAttribute('stroke-opacity', amount > 0 ? '1' : '0');
        path.setAttribute('stroke-dashoffset', String(lengths[index] * (1 - amount)));
      });
    };
    const render = () => {
      const time = state.progress * writingDuration;
      setMask(time);
      if (time < PEN_ENTRY) {
        const amount = time / PEN_ENTRY;
        positionPen({ x: first.x + 300 * (1 - amount), y: first.y + 260 * (1 - amount) }, -38 + amount * 10, Math.min(1, amount * 1.45));
        return;
      }
      const active = schedule.find((entry) => time >= entry.start && time <= entry.end) ?? schedule[schedule.length - 1];
      if (active.type === 'draw') {
        const amount = Math.max(0, Math.min(1, (time - active.start) / (active.end - active.start)));
        const point = pointOn(active.path, lengths[active.index] * amount);
        positionPen(point, stabilizeAngle(point.angle));
      } else {
        const amount = Math.max(0, Math.min(1, (time - active.start) / (active.end - active.start)));
        const from = pointOn(active.from, active.from.getTotalLength());
        const to = pointOn(active.to, 0);
        positionPen({ x: from.x + (to.x - from.x) * amount, y: from.y + (to.y - from.y) * amount - Math.sin(amount * Math.PI) * 115 }, stabilizeAngle(from.angle), .8);
      }
    };

    // Development-only deterministic capture mode, e.g. ?boardProgress=.5.
    // It intentionally has no visible UI and is stripped from production.
    const requestedProgressValue = process.env.NODE_ENV === 'development'
      ? new URLSearchParams(window.location.search).get('boardProgress')
      : null;
    const requestedProgress = requestedProgressValue === null ? Number.NaN : Number(requestedProgressValue);
    if (Number.isFinite(requestedProgress)) {
      state.progress = Math.max(0, Math.min(1, requestedProgress));
      render();
      return undefined;
    }

    setMask(0);
    positionPen({ x: first.x + 300, y: first.y + 260 }, -43, 0);
    const context = gsap.context(() => {
      gsap.to(state, {
        delay: BOARD_HOLD,
        duration: writingDuration,
        ease: 'none',
        progress: 1,
        onUpdate: render,
        onComplete: () => {
          const last = pointOn(paths[paths.length - 1], lengths[paths.length - 1]);
          const exit = { progress: 0 };
          gsap.to(exit, {
            duration: PEN_EXIT,
            ease: 'power1.inOut',
            progress: 1,
            onUpdate: () => positionPen({ x: last.x + 190 * exit.progress, y: last.y - 150 * exit.progress }, stabilizeAngle(last.angle), 1 - exit.progress),
            onComplete: () => {
              pen.style.opacity = '0';
              inkRef.current?.removeAttribute('mask');
              title.style.webkitMaskImage = 'none';
              title.style.maskImage = 'none';
              root.dataset.complete = 'true';
            },
          });
        },
      });
    }, root);
    return () => context.revert();
  }, [slug, writingGuides.length]);

  return <span className="board-title-writing" style={{width: '100%'}} ref={rootRef} aria-label={titleLines.join(' ')}>
    <strong ref={titleRef} className="board-title-writing-live" style={{paddingBottom: 0, width: '100%', maskImage: 'none', WebkitMaskImage: 'none'}} aria-hidden="true">{<svg viewBox={`${outline.viewBox.x} ${outline.viewBox.y} ${outline.viewBox.width} ${outline.viewBox.height}`} style={{display: 'block', width: '100%', height: 'auto'}}><defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x={outline.viewBox.x} y={outline.viewBox.y} width={outline.viewBox.width} height={outline.viewBox.height}>
        {writingGuides.map((guide, index) => <g key={index} clipPath={guide.glyphPath ? `url(#${maskId}-glyph-${index})` : undefined}>
          <path ref={node => { maskPathRefs.current[index] = node; }} d={guide.d} fill="none" stroke="white" strokeWidth={guide.width} strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0" />
        </g>)}
      </mask>
      {writingGuides.map((guide, index) => guide.glyphPath && <clipPath key={index} id={`${maskId}-glyph-${index}`} clipPathUnits="userSpaceOnUse"><path d={guide.glyphPath} /></clipPath>)}
    </defs><path ref={inkRef} mask={`url(#${maskId})`} fill="currentColor" d={outline.outlinePath} /></svg>}</strong>
    <svg className="board-title-trajectory-source" viewBox={`${outline.viewBox.x} ${outline.viewBox.y} ${outline.viewBox.width} ${outline.viewBox.height}`} aria-hidden="true">
      {writingGuides.map((trajectory, index) => <path key={trajectory.d} ref={(node) => { pathRefs.current[index] = node; }} d={trajectory.d} />)}
    </svg>
    <svg ref={penLayerRef} className="board-title-pen-layer" preserveAspectRatio="none" aria-hidden="true">
      <g ref={penRef} className="board-title-pen">
        <image ref={penImageRef} href="/assets/smisha-premium-fineline-pen.svg" preserveAspectRatio="none" />
      </g>
    </svg>
  </span>;
}
