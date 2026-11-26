"""Build compact SVG geometry from the locally attributed OSM state dataset.

Requires Shapely. The original GeoJSON remains the source of truth; this is a
rendered presentation asset, not a replacement geographic database.
"""
import json
import math
from pathlib import Path
from shapely.geometry import shape, Polygon, MultiPolygon
from shapely.ops import unary_union, transform
from shapely import make_valid

ROOT = Path(__file__).resolve().parents[1]
source = json.loads((ROOT / 'public/assets/maps/india-states.geojson').read_text())
WIDTH, HEIGHT, PADDING = 650, 720, 34

def mercator(x, y, z=None):
    return x * math.pi / 180, math.log(math.tan(math.pi / 4 + y * math.pi / 360))

shapes = [(feature['properties'], transform(mercator, make_valid(shape(feature['geometry']))))
          for feature in source['features']]
# The source's Lakshadweep feature encloses administrative waters, not island
# coastlines. Keep it as a dashed maritime boundary instead of filling it as land.
land = unary_union([geometry for props, geometry in shapes if props['code'] != 'IN-LD'])
min_x, min_y, max_x, max_y = land.bounds
scale = min((WIDTH - 2 * PADDING) / (max_x - min_x), (HEIGHT - 2 * PADDING) / (max_y - min_y))
offset_x = (WIDTH - (max_x - min_x) * scale) / 2
offset_y = (HEIGHT - (max_y - min_y) * scale) / 2

def project(x, y, z=None):
    return offset_x + (x - min_x) * scale, HEIGHT - offset_y - (y - min_y) * scale

def line_path(coords, close=False):
    return ' '.join(('M' if i == 0 else 'L') + f'{x:.1f},{y:.1f}' for i, (x, y) in enumerate(coords)) + ('Z' if close else '')

def svg_path(geometry):
    if geometry.is_empty:
        return ''
    if geometry.geom_type == 'Polygon':
        return line_path(geometry.exterior.coords, True) + ''.join(line_path(ring.coords, True) for ring in geometry.interiors)
    if geometry.geom_type in ('LineString', 'LinearRing'):
        return line_path(geometry.coords)
    return ''.join(svg_path(part) for part in geometry.geoms)

def polygon_rings(geometry):
    if geometry.geom_type == 'Polygon':
        return [[[round(x, 2), round(y, 2)] for x, y in ring.coords]
                for ring in [geometry.exterior, *geometry.interiors]]
    return None

states = []
for props, geometry in shapes:
    projected = transform(project, geometry).simplify(1.0, preserve_topology=True)
    polygons = [projected] if projected.geom_type == 'Polygon' else list(projected.geoms)
    states.append({'id': props['code'], 'name': props['name'], 'd': svg_path(projected),
                   'polygons': [polygon_rings(polygon) for polygon in polygons if polygon.geom_type == 'Polygon']})

outline = transform(project, land).simplify(1.0, preserve_topology=True)
output = {'width': WIDTH, 'height': HEIGHT,
          'projection': {'minX': min_x, 'minY': min_y, 'scale': scale, 'offsetX': offset_x, 'offsetY': offset_y},
          'outline': svg_path(outline), 'states': states}
destination = ROOT / 'lib/india-map-artwork.json'
destination.write_text(json.dumps(output, separators=(',', ':')), encoding='utf-8')
print(f'Built {len(states)} state paths ({destination.stat().st_size:,} bytes).')
