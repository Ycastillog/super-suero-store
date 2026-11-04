import * as THREE from "three";

const HEIGHT = 1.3;
const TAU = Math.PI * 2;
const profile = (h) => Math.sqrt(Math.max(0, 1 - Math.pow(h, 2.8)));
const rearAngle = (theta) =>
  Math.atan2(Math.sin(theta - Math.PI), Math.cos(theta - Math.PI));
const opening = (theta) => {
  const t = rearAngle(theta) / 0.45;
  return Math.abs(t) < 1 ? 0.29 * Math.sqrt(1 - t * t) : 0;
};
const crownPoint = (theta, h, offset = 0) => {
  const r = profile(h);
  return new THREE.Vector3(
    Math.sin(theta) * (r + offset),
    HEIGHT * h,
    Math.cos(theta) * (1.045 * r + offset),
  );
};

function surface(columns, rows, point, reverse = false) {
  const positions = [],
    uv = [],
    indices = [];
  for (let y = 0; y <= rows; y += 1) {
    for (let x = 0; x <= columns; x += 1) {
      const p = point(x / columns, y / rows);
      positions.push(p.x, p.y, p.z);
      uv.push(x / columns, y / rows);
    }
  }
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const a = y * (columns + 1) + x,
        b = a + 1,
        c = a + columns + 1,
        d = c + 1;
      indices.push(...(reverse ? [a, c, b, b, c, d] : [a, b, c, b, d, c]));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function fabricTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(128, 128);
  for (let y = 0; y < 128; y += 1) {
    for (let x = 0; x < 128; x += 1) {
      const value =
        125 +
        (x % 4 < 2 ? 22 : -12) +
        (y % 4 < 2 ? 18 : -13) +
        ((x * 17 + y * 29) % 9);
      const index = (y * 128 + x) * 4;
      image.data[index] = image.data[index + 1] = image.data[index + 2] = value;
      image.data[index + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 5);
  texture.anisotropy = 4;
  return texture;
}

export async function createCapModel({
  crownColor = "#e9e3d2",
  brimColor = "#111216",
  logoColor = "#121317",
  logoTextureUrl,
} = {}) {
  const group = new THREE.Group();
  group.name = "Signature cap — illustrative reconstruction";
  const logo = logoTextureUrl
    ? await new THREE.TextureLoader().loadAsync(logoTextureUrl)
    : null;
  if (logo) {
    logo.colorSpace = THREE.SRGBColorSpace;
    logo.anisotropy = 4;
  }
  const weave = fabricTexture();
  const crown = new THREE.MeshStandardMaterial({
    color: crownColor,
    roughness: 0.9,
    metalness: 0,
    bumpMap: weave,
    bumpScale: 0.0045,
  });
  const brim = new THREE.MeshStandardMaterial({
    color: brimColor,
    roughness: 0.88,
    metalness: 0,
    bumpMap: weave,
    bumpScale: 0.003,
  });
  const lining = new THREE.MeshStandardMaterial({
    color: "#393a38",
    roughness: 0.96,
    side: THREE.BackSide,
  });
  const bandMaterial = new THREE.MeshStandardMaterial({
    color: "#252628",
    roughness: 0.95,
    side: THREE.DoubleSide,
  });
  const crownSeam = new THREE.MeshStandardMaterial({
    color: new THREE.Color(crownColor).multiplyScalar(0.87),
    roughness: 1,
  });
  const crownThread = new THREE.LineBasicMaterial({
    color: new THREE.Color(crownColor).multiplyScalar(0.85),
    transparent: true,
    opacity: 0.28,
  });
  const brimThread = new THREE.LineBasicMaterial({
    color: new THREE.Color(brimColor).lerp(new THREE.Color("#ffffff"), 0.08),
    transparent: true,
    opacity: 0.35,
  });
  const holeMaterial = new THREE.MeshStandardMaterial({
    color: "#171819",
    roughness: 1,
  });

  const mesh = (geometry, material, name) => {
    const item = new THREE.Mesh(geometry, material);
    item.name = name;
    item.castShadow = true;
    item.receiveShadow = true;
    group.add(item);
    return item;
  };
  const tube = (points, radius, material, name, closed = false) =>
    mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points, closed),
        Math.max(32, points.length * 2),
        radius,
        5,
        closed,
      ),
      material,
      name,
    );
  const stitches = (points, material, name) => {
    const vertices = [];
    for (let i = 0; i < points.length - 1; i += 2)
      vertices.push(...points[i].toArray(), ...points[i + 1].toArray());
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    const line = new THREE.LineSegments(geometry, material);
    line.name = name;
    group.add(line);
  };

  // Two shells keep the bottom open. The rear edge rises to form the snapback cutout.
  const shell = (inset = 0) =>
    surface(192, 48, (u, v) => {
      const theta = u * TAU;
      const base = opening(theta);
      const h = base + (1 - base) * v;
      const p = crownPoint(theta, h, inset);
      if (inset < 0) p.y -= 0.012 * v;
      return p;
    });
  mesh(shell(), crown, "Six-panel fabric crown");
  mesh(shell(-0.014), lining, "Dark inner crown lining");

  const rimPoints = [];
  for (let i = 0; i <= 120; i += 1) {
    const theta = -Math.PI + 0.45 + ((TAU - 0.9) * i) / 120;
    rimPoints.push(crownPoint(theta, 0.012, 0.003));
  }
  tube(rimPoints, 0.011, crownSeam, "Rolled lower fabric edge");
  mesh(
    surface(120, 1, (u, v) => {
      const theta = -Math.PI + 0.45 + u * (TAU - 0.9);
      const p = crownPoint(theta, 0.016 + v * 0.065, -0.023);
      return p;
    }),
    bandMaterial,
    "Inner sweatband",
  );

  const rearEdge = [];
  for (let i = 0; i <= 48; i += 1) {
    const theta = Math.PI - 0.45 + (i / 48) * 0.9;
    rearEdge.push(crownPoint(theta, opening(theta), 0.003));
  }
  tube(rearEdge, 0.012, crownSeam, "Bound rear opening");

  // A curved visor has a fabric top, an underside and a rounded, closed edge.
  const visorPoint = (u, v, thickness = 0) => {
    const s = u * 2 - 1;
    const x = s * (0.89 + 0.17 * v) * (1 - 0.065 * Math.pow(s, 4) * v);
    const back = 0.94 * Math.sqrt(Math.max(0, 1 - s * s));
    const front = 1.28 + 0.51 * Math.sqrt(Math.max(0, 1 - s * s));
    const z = THREE.MathUtils.lerp(back, front, v);
    const y =
      0.035 -
      0.12 * v -
      0.12 * s * s * (0.3 + 0.7 * v) +
      0.018 * Math.sin(v * Math.PI) -
      thickness;
    return new THREE.Vector3(x, y, z);
  };
  mesh(
    surface(64, 24, (u, v) => visorPoint(u, v), true),
    brim,
    "Curved visor fabric top",
  );
  const underside = brim.clone();
  underside.side = THREE.BackSide;
  mesh(
    surface(64, 24, (u, v) => visorPoint(u, v, 0.033), true),
    underside,
    "Visor underside",
  );
  const edge = [];
  for (let i = 0; i < 65; i += 1) edge.push(visorPoint(i / 64, 1, 0.016));
  for (let i = 1; i < 33; i += 1) edge.push(visorPoint(1, 1 - i / 32, 0.016));
  for (let i = 63; i >= 0; i -= 1) edge.push(visorPoint(i / 64, 0, 0.016));
  for (let i = 1; i < 32; i += 1) edge.push(visorPoint(0, i / 32, 0.016));
  tube(edge, 0.017, brim, "Fabric visor binding", true);
  for (let row = 0; row < 6; row += 1) {
    const points = [];
    for (let i = 0; i <= 200; i += 1) {
      const p = visorPoint(0.03 + (i / 200) * 0.94, 0.92 - row * 0.09);
      p.y += 0.004;
      points.push(p);
    }
    stitches(points, brimThread, `Visor stitch row ${row + 1}`);
  }

  // Narrow seams and paired stitch lines follow the actual dome surface.
  for (let panel = 0; panel < 6; panel += 1) {
    const theta = (panel * TAU) / 6;
    const base = Math.max(opening(theta), 0.025);
    const points = [];
    for (let i = 0; i <= 44; i += 1)
      points.push(crownPoint(theta, base + (i / 44) * (0.975 - base), 0.003));
    tube(points, 0.0035, crownSeam, `Panel seam ${panel + 1}`);
    for (const side of [-1, 1]) {
      const stitchPoints = [];
      for (let i = 0; i <= 130; i += 1) {
        const h = base + (i / 130) * (0.975 - base);
        const angularOffset = (side * 0.011) / Math.max(0.22, profile(h));
        stitchPoints.push(crownPoint(theta + angularOffset, h, 0.005));
      }
      stitches(
        stitchPoints,
        crownThread,
        `Panel ${panel + 1} topstitch ${side}`,
      );
    }
  }

  // Embroidered eyelets are tangent to the crown, with dark central openings.
  for (let panel = 0; panel < 6; panel += 1) {
    const theta = ((panel + 0.5) * TAU) / 6;
    const h = 0.68;
    const center = crownPoint(theta, h, 0.008);
    const tangent = crownPoint(theta + 0.001, h).sub(
      crownPoint(theta - 0.001, h),
    );
    const vertical = crownPoint(theta, h + 0.001).sub(
      crownPoint(theta, h - 0.001),
    );
    const normal = tangent.cross(vertical).normalize();
    const rotation = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal,
    );
    const eyelet = mesh(
      new THREE.TorusGeometry(0.022, 0.007, 6, 18),
      crownSeam,
      `Eyelet embroidery ${panel + 1}`,
    );
    eyelet.position.copy(center);
    eyelet.quaternion.copy(rotation);
    const hole = mesh(
      new THREE.CircleGeometry(0.014, 16),
      holeMaterial,
      `Eyelet opening ${panel + 1}`,
    );
    hole.position.copy(center).addScaledVector(normal, -0.002);
    hole.quaternion.copy(rotation);
  }
  const topButton = mesh(
    new THREE.SphereGeometry(0.081, 24, 12),
    brim,
    "Fabric-covered top button",
  );
  topButton.scale.set(1, 0.38, 1);
  topButton.position.y = HEIGHT + 0.012;

  const closureMaterial = new THREE.MeshStandardMaterial({
    color: brimColor,
    roughness: 0.75,
  });
  for (const side of [-1, 1]) {
    const strap = mesh(
      new THREE.BoxGeometry(0.46, 0.105, 0.028, 1, 1, 1),
      closureMaterial,
      "Adjustable snapback strap",
    );
    strap.position.set(side * 0.18, 0.065, -1.025 - (side === 1 ? 0.017 : 0));
    strap.rotation.y = side * 0.09;
  }
  for (let index = 0; index < 5; index += 1) {
    const hole = mesh(
      new THREE.CircleGeometry(0.013, 14),
      holeMaterial,
      "Adjustment hole",
    );
    hole.rotation.y = Math.PI;
    hole.position.set(-0.34 + index * 0.063, 0.065, -1.049);
  }
  for (let index = 0; index < 4; index += 1) {
    const nub = mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.013, 12),
      closureMaterial,
      "Closure stud",
    );
    nub.rotation.x = Math.PI / 2;
    nub.position.set(0.09 + index * 0.065, 0.065, -1.067);
  }

  if (logo) {
    const decal = surface(32, 32, (u, v) => {
      const x = (u - 0.5) * 0.59;
      const y = 0.31 + v * 0.72;
      const radius = profile(y / HEIGHT);
      const z = 1.045 * radius * Math.sqrt(Math.max(0, 1 - (x / radius) ** 2));
      return new THREE.Vector3(x, y, z + 0.012);
    });
    const embroidery = new THREE.MeshStandardMaterial({
      map: logo,
      color: logoColor,
      roughness: 0.93,
      transparent: true,
      alphaTest: 0.12,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      bumpMap: logo,
      bumpScale: 0.003,
    });
    const mark = mesh(
      decal,
      embroidery,
      "Signature S embroidered surface decal",
    );
    mark.castShadow = false;
  }

  const dispose = () => {
    const geometries = new Set(),
      materials = new Set(),
      textures = new Set([weave]);
    if (logo) textures.add(logo);
    group.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      const source = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of source) if (material) materials.add(material);
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    group.clear();
  };
  return { group, dispose };
}
