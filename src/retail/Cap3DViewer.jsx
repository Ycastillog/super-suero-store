import React, { useEffect, useId, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  ArrowLeft,
  ArrowRight,
  Move,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import { createCapModel } from "./createCapModel";
import "./cap3d.css";

const target = new THREE.Vector3(0, 0.47, 0.45);
const presets = {
  front: [0, 1.13, 6.1],
  side: [Math.PI / 2, 1.25, 6.1],
  back: [Math.PI, 1.24, 6.1],
  inside: [0.35, 2.35, 6.1],
  reset: [0.61, 1.12, 6.1],
};

export default function Cap3DViewer({ spec, name, poster }) {
  const hostRef = useRef(null);
  const apiRef = useRef(null);
  const instructions = useId();
  const [status, setStatus] = useState("loading");
  const [view, setView] = useState("reset");

  useEffect(() => {
    if (status !== "error") return;
    const canvas = hostRef.current?.querySelector("canvas");
    if (canvas) {
      canvas.tabIndex = -1;
      canvas.hidden = true;
    }
  }, [status]);

  useEffect(() => {
    const host = hostRef.current;
    let disposed = false;
    let frame = 0;
    let model;
    let renderer;
    let controls;
    let resizeObserver;
    let environmentTarget;
    let scene;
    let floor;
    let contactShadow;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const cleanup = () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onPreference);
      controls?.dispose();
      model?.dispose();
      floor?.geometry.dispose();
      floor?.material.dispose();
      contactShadow?.material.map.dispose();
      contactShadow?.material.dispose();
      contactShadow?.geometry.dispose();
      environmentTarget?.dispose();
      scene?.traverse((object) => {
        if (object.isLight && object.shadow) object.shadow.dispose();
      });
      renderer?.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer?.domElement.remove();
      apiRef.current = null;
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") invalidate();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const onPreference = () => {
      if (controls) controls.enableDamping = !reduced.matches;
      invalidate();
    };
    const onContextLost = (event) => {
      event.preventDefault();
      if (!disposed) setStatus("error");
    };
    const invalidate = () => {
      if (!frame && !disposed && document.visibilityState === "visible") {
        frame = requestAnimationFrame(render);
      }
    };
    const render = () => {
      frame = 0;
      if (disposed || !renderer || !controls) return;
      const changed = controls.update();
      renderer.render(scene, controls.object);
      if (changed) invalidate();
    };

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.9;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      const canvas = renderer.domElement;
      canvas.tabIndex = 0;
      canvas.setAttribute("role", "img");
      canvas.setAttribute(
        "aria-label",
        `Modelo 3D de ${name}. Usa las flechas para girar y los signos más y menos para acercar.`,
      );
      canvas.setAttribute("aria-describedby", instructions);
      canvas.addEventListener("webglcontextlost", onContextLost);
      host.appendChild(canvas);

      scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 60);
      controls = new OrbitControls(camera, canvas);
      controls.target.copy(target);
      controls.enablePan = false;
      controls.enableDamping = !reduced.matches;
      controls.dampingFactor = 0.1;
      controls.minDistance = 2.65;
      controls.maxDistance = 7.5;
      controls.minPolarAngle = 0.15;
      controls.maxPolarAngle = 2.8;
      controls.rotateSpeed = 0.75;
      controls.zoomSpeed = 0.8;
      controls.addEventListener("change", invalidate);
      controls.addEventListener("start", () => setView("free"));

      const setOrbit = (theta, phi, radius) => {
        const spherical = new THREE.Spherical(
          THREE.MathUtils.clamp(
            radius,
            controls.minDistance,
            controls.maxDistance,
          ),
          THREE.MathUtils.clamp(
            phi,
            controls.minPolarAngle,
            controls.maxPolarAngle,
          ),
          theta,
        );
        camera.position.setFromSpherical(spherical).add(target);
        controls.target.copy(target);
        controls.update();
        invalidate();
      };
      const rotate = (thetaDelta, phiDelta = 0) => {
        setView("free");
        setOrbit(
          controls.getAzimuthalAngle() + thetaDelta,
          controls.getPolarAngle() + phiDelta,
          controls.getDistance(),
        );
      };
      const zoom = (factor) => {
        setOrbit(
          controls.getAzimuthalAngle(),
          controls.getPolarAngle(),
          controls.getDistance() * factor,
        );
      };
      apiRef.current = {
        preset: (next) => {
          setOrbit(...presets[next]);
          setView(next);
        },
        rotate,
        zoom,
      };
      const keydown = (event) => {
        const actions = {
          ArrowLeft: () => rotate(-Math.PI / 12),
          ArrowRight: () => rotate(Math.PI / 12),
          ArrowUp: () => rotate(0, -Math.PI / 18),
          ArrowDown: () => rotate(0, Math.PI / 18),
          "+": () => zoom(0.85),
          "=": () => zoom(0.85),
          "-": () => zoom(1.15),
          Home: () => apiRef.current?.preset("reset"),
        };
        if (actions[event.key]) {
          event.preventDefault();
          actions[event.key]();
        }
      };
      canvas.addEventListener("keydown", keydown);
      // Canvas is removed during cleanup, including its keyboard listener.

      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      environmentTarget = pmrem.fromScene(room, 0.04);
      scene.environment = environmentTarget.texture;
      scene.environmentIntensity = 0.35;
      room.dispose();
      pmrem.dispose();
      scene.add(new THREE.HemisphereLight(0xffffff, 0xb3b4b6, 0.7));
      const key = new THREE.DirectionalLight(0xfff6e8, 1.7);
      key.position.set(-3.5, 5, 4);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -3;
      key.shadow.camera.right = 3;
      key.shadow.camera.top = 3;
      key.shadow.camera.bottom = -3;
      key.shadow.normalBias = 0.025;
      key.shadow.bias = -0.0001;
      key.shadow.radius = 4;
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xdce7ff, 0.7);
      fill.position.set(4, 2.5, -2);
      scene.add(fill);
      floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.ShadowMaterial({ opacity: 0.045 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.23;
      floor.receiveShadow = true;
      scene.add(floor);
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = shadowCanvas.height = 128;
      const shadowContext = shadowCanvas.getContext("2d");
      const gradient = shadowContext.createRadialGradient(
        64,
        64,
        4,
        64,
        64,
        63,
      );
      gradient.addColorStop(0, "rgba(20,24,30,.18)");
      gradient.addColorStop(0.5, "rgba(20,24,30,.09)");
      gradient.addColorStop(1, "rgba(20,24,30,0)");
      shadowContext.fillStyle = gradient;
      shadowContext.fillRect(0, 0, 128, 128);
      contactShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(3.5, 3.2),
        new THREE.MeshBasicMaterial({
          map: new THREE.CanvasTexture(shadowCanvas),
          transparent: true,
          depthWrite: false,
        }),
      );
      contactShadow.rotation.x = -Math.PI / 2;
      contactShadow.position.set(0, -0.22, 0.35);
      scene.add(contactShadow);
      setOrbit(...presets.reset);

      const resize = () => {
        if (disposed) return;
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        invalidate();
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();
      document.addEventListener("visibilitychange", onVisibility);
      reduced.addEventListener("change", onPreference);

      createCapModel(spec)
        .then((result) => {
          if (disposed) {
            result.dispose();
            return;
          }
          model = result;
          scene.add(model.group);
          setStatus("ready");
          invalidate();
        })
        .catch(() => {
          if (!disposed) setStatus("error");
        });
    } catch {
      setStatus("error");
    }
    return cleanup;
  }, [spec, name, instructions]);

  return (
    <div className="rt-cap3d" data-status={status}>
      <div className="rt-cap3d-stage" ref={hostRef}>
        {status === "loading" && (
          <div className="rt-cap3d-loading" role="status">
            Preparando tu vista 3D…
          </div>
        )}
        {status === "error" && (
          <div className="rt-cap3d-error" role="status">
            <img src={poster} alt={name} />
            <p>
              No pudimos abrir el visor 3D en este dispositivo. Puedes seguir
              viendo las fotos de la pieza.
            </p>
          </div>
        )}
        {status === "ready" && (
          <span className="rt-cap3d-badge">
            <Move size={13} /> ARRASTRA PARA GIRAR
          </span>
        )}
      </div>
      <div
        className="rt-cap3d-presets"
        role="group"
        aria-label="Ángulos de la gorra"
      >
        {[
          ["front", "Frente"],
          ["side", "Perfil"],
          ["back", "Atrás"],
          ["inside", "Interior"],
        ].map(([key, label]) => (
          <button
            type="button"
            key={key}
            aria-pressed={view === key}
            disabled={status !== "ready"}
            onClick={() => apiRef.current?.preset(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        className="rt-cap3d-tools"
        role="group"
        aria-label="Controles de la vista 3D"
      >
        <button
          type="button"
          disabled={status !== "ready"}
          aria-label="Girar gorra a la izquierda"
          onClick={() => apiRef.current?.rotate(-Math.PI / 6)}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          disabled={status !== "ready"}
          aria-label="Girar gorra a la derecha"
          onClick={() => apiRef.current?.rotate(Math.PI / 6)}
        >
          <ArrowRight size={18} />
        </button>
        <span />
        <button
          type="button"
          disabled={status !== "ready"}
          aria-label="Alejar gorra"
          onClick={() => apiRef.current?.zoom(1.18)}
        >
          <Minus size={18} />
        </button>
        <button
          type="button"
          disabled={status !== "ready"}
          aria-label="Acercar gorra"
          onClick={() => apiRef.current?.zoom(0.85)}
        >
          <Plus size={18} />
        </button>
        <button
          type="button"
          disabled={status !== "ready"}
          aria-label="Restablecer vista de la gorra"
          onClick={() => apiRef.current?.preset("reset")}
        >
          <RotateCcw size={17} />
        </button>
      </div>
      <p id={instructions} className="rt-cap3d-help">
        Arrastra con el dedo o el ratón. Usa + y − para acercar.
      </p>
      <p className="rt-cap3d-note">
        Representación 3D ilustrativa. Consulta las fotos para los detalles
        exactos del producto.
      </p>
    </div>
  );
}
