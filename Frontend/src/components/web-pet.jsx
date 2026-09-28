import { useEffect, useRef, useState } from "react";
import { PET_MANIFEST } from "../lib/pet-manifest";
import {
  createPetState,
  defaultIdleAction,
  DEFAULT_PET_BEHAVIOR,
  resolveAction,
  stepPet,
} from "../lib/web-pet-engine";

const SPRITE_SIZE_PX = 100;
const TICK_MS = 125;
const DEFAULT_SCALE = 0.5;
const DEFAULT_Z_INDEX = 9999;
const DEFAULT_MEDIA_BASE_URL = "/media";

const cursor = { x: 0, y: 0, known: false };
let cursorSubscribers = 0;

function onPointerMove(event) {
  cursor.x = event.clientX;
  cursor.y = event.clientY;
  cursor.known = true;
}

function subscribeCursor() {
  if (cursorSubscribers === 0) {
    document.addEventListener("pointermove", onPointerMove, { passive: true });
  }
  cursorSubscribers += 1;
  return () => {
    cursorSubscribers -= 1;
    if (cursorSubscribers === 0) {
      document.removeEventListener("pointermove", onPointerMove);
    }
  };
}

function resolveConfig(props) {
  const manifest = PET_MANIFEST[props.animal];
  const overrides = props.behavior ?? {};
  const colors = manifest?.colors ?? [];
  const color =
    props.color && (colors.length === 0 || colors.includes(props.color))
      ? props.color
      : (colors[0] ?? "brown");
  const base = (props.mediaBaseUrl ?? DEFAULT_MEDIA_BASE_URL).replace(/\/$/, "");

  const behavior = {
    ...DEFAULT_PET_BEHAVIOR,
    ...overrides,
    actions: overrides.actions ?? manifest?.actions ?? DEFAULT_PET_BEHAVIOR.actions,
    speed: props.speed ?? manifest?.speed ?? DEFAULT_PET_BEHAVIOR.speed,
    followMouse: props.followMouse ?? DEFAULT_PET_BEHAVIOR.followMouse,
  };

  return {
    behavior,
    scale: props.scale ?? DEFAULT_SCALE,
    paused: props.paused ?? false,
    gifUrl: (action) =>
      `${base}/${props.animal}/${color}_${resolveAction(behavior, action)}_8fps.gif`,
  };
}

function readBounds(wrapper, position) {
  const rect = wrapper.getBoundingClientRect();
  const left = rect.left - (parseFloat(wrapper.style.left) || 0);
  const bottom = rect.bottom;
  const atViewportBottom = Math.abs(bottom - window.innerHeight) < 1;
  const container =
    position === "absolute"
      ? (wrapper.offsetParent ?? wrapper.parentElement)
      : atViewportBottom
        ? null
        : wrapper.parentElement;
  const width = container ? container.getBoundingClientRect().width : window.innerWidth;
  return { left, bottom, width };
}

function paint(wrapper, sprite, state, config, painted) {
  const width = SPRITE_SIZE_PX * config.scale;
  wrapper.style.left = `${state.x - width / 2}px`;

  const src = config.gifUrl(state.action);
  if (painted.src !== src) {
    painted.src = src;
    sprite.style.backgroundImage = `url("${src}")`;
  }
  if (painted.facing !== state.facing) {
    painted.facing = state.facing;
    sprite.style.transform = `scaleX(${state.facing})`;
  }
}

export function WebPet({
  animal,
  color,
  position = "fixed",
  speed,
  scale,
  followMouse,
  zIndex = DEFAULT_Z_INDEX,
  style,
  mediaBaseUrl,
  behavior,
  paused,
}) {
  const wrapperRef = useRef(null);
  const spriteRef = useRef(null);
  const [, setMode] = useState("idle");
  const config = resolveConfig({
    animal,
    color,
    speed,
    scale,
    followMouse,
    mediaBaseUrl,
    behavior,
    paused,
  });
  const configRef = useRef(config);
  const positionRef = useRef(position);

  useEffect(() => {
    configRef.current = config;
    positionRef.current = position;
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sprite = spriteRef.current;
    if (!wrapper || !sprite) return undefined;

    let state = createPetState(configRef.current.behavior);
    const painted = { src: null, facing: null };
    let lastMode = null;
    let lastTick = 0;
    let frame = null;

    const tick = (ts) => {
      frame = requestAnimationFrame(tick);
      if (ts - lastTick < TICK_MS) return;
      lastTick = ts;

      const current = configRef.current;
      if (current.paused) return;
      const bounds = readBounds(wrapper, positionRef.current);
      const size = SPRITE_SIZE_PX * current.scale;

      state = stepPet(
        state,
        {
          ts,
          boundsWidth: bounds.width,
          mouse: cursor.known
            ? { x: cursor.x - bounds.left, y: cursor.y - bounds.bottom }
            : null,
          sprite: { width: size, height: size },
        },
        current.behavior,
      );

      paint(wrapper, sprite, state, current, painted);
      if (state.mode !== lastMode) {
        lastMode = state.mode;
        setMode(state.mode);
      }
    };

    paint(wrapper, sprite, state, configRef.current, painted);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const unsubscribe = subscribeCursor();
    frame = requestAnimationFrame(tick);

    return () => {
      unsubscribe();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const sizePx = SPRITE_SIZE_PX * config.scale;
  const idleGif = config.gifUrl(defaultIdleAction(config.behavior));

  return (
    <div
      ref={wrapperRef}
      className="moodwave-web-pet"
      aria-hidden="true"
      style={{
        position,
        bottom: 0,
        left: 0,
        height: `${sizePx}px`,
        width: `${sizePx}px`,
        zIndex,
        pointerEvents: "none",
        ...style,
      }}
    >
      <div
        ref={spriteRef}
        style={{
          height: "100%",
          width: "100%",
          backgroundImage: `url("${idleGif}")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          backgroundSize: "contain",
          imageRendering: "pixelated",
          transformOrigin: "bottom center",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
