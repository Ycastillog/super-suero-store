import React, { useEffect, useMemo, useRef, useState } from "react";
import "./motion-preview.css";

const FRAME_INTERVAL = 4800;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function MotionPreview({
  images,
  alt,
  playing,
  className = "",
  priority = false,
}) {
  const stageRef = useRef(null);
  const imageRefs = useRef([]);
  const [activeSource, setActiveSource] = useState(null);
  const [documentVisible, setDocumentVisible] = useState(false);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const sources = useMemo(
    () =>
      [...new Set(Array.isArray(images) ? images : [])].filter(
        (source) => typeof source === "string" && source.trim().length > 0,
      ),
    [images],
  );
  const activeIndex = Math.max(0, sources.indexOf(activeSource));
  // A single supplied photo still has two layers, without inventing a view.
  const layers = sources.length === 1 ? [sources[0], sources[0]] : sources;
  const running = Boolean(playing && documentVisible && inView && !reducedMotion);

  useEffect(() => {
    const updateVisibility = () => {
      setDocumentVisible(document.visibilityState === "visible");
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    const motionPreference = window.matchMedia?.(REDUCED_MOTION_QUERY);
    const updateMotionPreference = () => {
      setReducedMotion(motionPreference?.matches ?? false);
    };
    updateMotionPreference();
    if (motionPreference?.addEventListener) {
      motionPreference.addEventListener("change", updateMotionPreference);
    } else {
      motionPreference?.addListener?.(updateMotionPreference);
    }

    let observer;
    if (typeof window.IntersectionObserver === "function") {
      observer = new window.IntersectionObserver(
        ([entry]) => {
          setInView(
            Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.01),
          );
        },
        { threshold: 0.01 },
      );
      if (stageRef.current) observer.observe(stageRef.current);
    } else {
      setInView(true);
    }

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      if (motionPreference?.removeEventListener) {
        motionPreference.removeEventListener("change", updateMotionPreference);
      } else {
        motionPreference?.removeListener?.(updateMotionPreference);
      }
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running || sources.length < 2) return;

    let cancelled = false;
    let timer;
    const advance = async () => {
      if (cancelled || document.visibilityState !== "visible") return;

      // Skip failed photos and keep the current frame visible during decoding.
      for (let offset = 1; offset < sources.length; offset += 1) {
        const nextIndex = (activeIndex + offset) % sources.length;
        const nextImage = imageRefs.current[nextIndex];
        if (!nextImage) continue;

        try {
          if (typeof nextImage.decode === "function") await nextImage.decode();
        } catch {
          // Some browsers reject decode() for an otherwise usable loaded image.
        }

        if (cancelled || document.visibilityState !== "visible") return;
        if (nextImage.complete && nextImage.naturalWidth > 0) {
          setActiveSource(sources[nextIndex]);
          return;
        }
      }

      timer = window.setTimeout(advance, FRAME_INTERVAL);
    };

    timer = window.setTimeout(advance, FRAME_INTERVAL);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeIndex, running, sources]);

  return (
    <div
      ref={stageRef}
      className={`rt-motion-preview ${className}`.trim()}
      data-motion={running ? "playing" : "paused"}
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <div className="rt-motion-preview__camera">
        {layers.map((source, index) => {
          const active = index === activeIndex;
          return (
            <img
              key={`${index}:${source}`}
              ref={(image) => {
                imageRefs.current[index] = image;
              }}
              className="rt-motion-preview__image"
              src={source}
              alt={active ? alt : ""}
              aria-hidden={active ? undefined : true}
              data-active={active ? "true" : "false"}
              width={1254}
              height={1254}
              loading={priority && active ? "eager" : "lazy"}
              fetchPriority={
                priority && active ? "high" : active ? "auto" : "low"
              }
              decoding="async"
              draggable={false}
            />
          );
        })}
      </div>
    </div>
  );
}
