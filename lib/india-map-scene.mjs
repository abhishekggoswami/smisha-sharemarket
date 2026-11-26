import * as THREE from 'three';

export const MAP_DEPTH = 22;

export function locationPoint(artwork, longitude, latitude, height = MAP_DEPTH + 4) {
  const p = artwork.projection;
  const x = p.offsetX + (longitude * Math.PI / 180 - p.minX) * p.scale;
  const y = artwork.height - p.offsetY - (Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360)) - p.minY) * p.scale;
  return new THREE.Vector3(x - artwork.width / 2, artwork.height / 2 - y, height);
}

export function createIndiaMapScene(artwork) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-360, 360, 420, -420, 1, 2500);
  camera.position.set(-180, -610, 1100);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  scene.add(new THREE.HemisphereLight(0xe5fff0, 0x12322e, 2));
  const key = new THREE.DirectionalLight(0xfff3ce, 3.2);
  key.position.set(-350, 450, 650);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -450, right: 450, top: 450, bottom: -450, near: 1, far: 1800 });
  key.shadow.normalBias = 1.2;
  key.shadow.bias = -.0002;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x80d8c7, 1.4);
  rim.position.set(400, -100, 280);
  scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1100, 1100), new THREE.ShadowMaterial({ opacity: .27 }));
  floor.position.z = -8;
  floor.receiveShadow = true;
  scene.add(floor);
  const states = new Map();
  const side = new THREE.MeshStandardMaterial({ color: 0x0d413d, roughness: .62, metalness: .18 });
  const point = ([x, y]) => new THREE.Vector2(x - artwork.width / 2, artwork.height / 2 - y);
  const cleanRing = (ring) => {
    const points = ring.map(point).filter((p, index, all) => index === 0 || !p.equals(all[index - 1]));
    if (points.length > 1 && points[0].equals(points[points.length - 1])) points.pop();
    return points.length >= 3 && Math.abs(THREE.ShapeUtils.area(points)) > .02 ? points : null;
  };

  for (const state of artwork.states) {
    if (state.id === 'IN-LD') continue; // This source polygon represents water.
    const group = new THREE.Group();
    const surface = new THREE.MeshStandardMaterial({ color: 0x347e72, roughness: .48, metalness: .25 });
    const border = new THREE.LineBasicMaterial({ color: 0xa6c9ad, transparent: true, opacity: .42 });
    for (const rings of state.polygons) {
      const contour = cleanRing(rings[0]);
      if (!contour) continue;
      const shape = new THREE.Shape(contour);
      shape.holes = rings.slice(1).map(cleanRing).filter(Boolean).map(ring => new THREE.Path(ring));
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: MAP_DEPTH, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .38, bevelThickness: .65, curveSegments: 1 });
      const mesh = new THREE.Mesh(geometry, [surface, side]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      for (const ring of rings) {
        const line = new THREE.BufferGeometry().setFromPoints(ring.map(([x, y]) => new THREE.Vector3(x - artwork.width / 2, artwork.height / 2 - y, MAP_DEPTH + .8)));
        group.add(new THREE.LineLoop(line, border));
      }
    }
    scene.add(group);
    states.set(state.id, { group, surface, border });
  }

  return {
    scene, camera, states,
    resize(width, height) {
      const halfHeight = 405;
      const halfWidth = halfHeight * width / height;
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
    },
    select(id) {
      states.forEach((state, key) => {
        const selected = key === id;
        state.surface.color.set(selected ? 0xd4af37 : 0x347e72);
        state.border.color.set(selected ? 0xffe5a1 : 0xa6c9ad);
        state.border.opacity = selected ? .85 : .42;
        state.group.position.z = selected ? 8 : 0;
      });
      scene.updateMatrixWorld(true);
    },
    dispose() {
      const geometries = new Set();
      const materials = new Set();
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      key.shadow.dispose();
    },
  };
}

export function createMapRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0);
  return renderer;
}
