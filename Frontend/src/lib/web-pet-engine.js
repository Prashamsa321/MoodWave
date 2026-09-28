export const EDGE_MARGIN_PX = 16;
const WANDER_MIN_RATIO = 0.2;
const WANDER_MAX_RATIO = 0.55;

export const DEFAULT_PET_BEHAVIOR = {
  speed: 4.5,
  followMouse: false,
  idleDist: 48,
  hoverAction: "swipe",
  hoverDist: 50,
  idlePauseMs: { min: 1500, max: 2200 },
  actions: ["idle", "run", "swipe", "walk", "walk_fast", "with_ball"],
  idleActions: [
    { name: "idle", baseDuration: 2500, extraDuration: 2000 },
    { name: "swipe", baseDuration: 1200, extraDuration: 800 },
  ],
  movementActions: [
    { name: "walk", speedMultiplier: 1.0 },
    { name: "walk_fast", speedMultiplier: 1.35 },
    { name: "run", speedMultiplier: 1.8 },
  ],
};

export function resolveAction(behavior, action) {
  if (behavior.actions.includes(action)) return action;
  return behavior.actions[0] ?? action;
}

export function defaultIdleAction(behavior) {
  return resolveAction(behavior, behavior.idleActions[0]?.name ?? "idle");
}

export function createPetState(behavior, initialX = EDGE_MARGIN_PX) {
  const idle = defaultIdleAction(behavior);
  return {
    x: initialX,
    facing: 1,
    mode: "idle",
    action: idle,
    idleAction: idle,
    idleActionUntil: 0,
    idleCooldownUntil: 0,
    movementAction: behavior.movementActions[0]?.name ?? "walk",
    movementSpeedMultiplier: behavior.movementActions[0]?.speedMultiplier ?? 1,
    targetX: null,
    pauseUntil: 0,
  };
}

function clampX(x, boundsWidth) {
  const max = Math.max(EDGE_MARGIN_PX, boundsWidth - EDGE_MARGIN_PX);
  return Math.min(max, Math.max(EDGE_MARGIN_PX, x));
}

function pickWanderTarget(x, boundsWidth, random) {
  const maxX = Math.max(EDGE_MARGIN_PX, boundsWidth - EDGE_MARGIN_PX);
  const roomLeft = Math.max(0, x - EDGE_MARGIN_PX);
  const roomRight = Math.max(0, maxX - x);
  const minDist = boundsWidth * WANDER_MIN_RATIO;
  const maxDist = boundsWidth * WANDER_MAX_RATIO;
  const dist = minDist + random() * Math.max(0, maxDist - minDist);

  const canLeft = roomLeft >= dist;
  const canRight = roomRight >= dist;
  let dir;
  if (canLeft && canRight) dir = random() < 0.5 ? -1 : 1;
  else if (canLeft) dir = -1;
  else if (canRight) dir = 1;
  else dir = roomLeft > roomRight ? -1 : 1;

  return clampX(x + dir * dist, boundsWidth);
}

function pickMovement(behavior, random) {
  const options = behavior.movementActions;
  const choice = options[Math.floor(random() * options.length)];
  return {
    movementAction: choice?.name ?? "walk",
    movementSpeedMultiplier: choice?.speedMultiplier ?? 1,
  };
}

function pickIdle(behavior, ts, random) {
  const options = behavior.idleActions;
  const choice = options[Math.floor(random() * options.length)];
  if (!choice) return null;
  const until = ts + choice.baseDuration + random() * choice.extraDuration;
  return {
    idleAction: choice.name,
    idleActionUntil: until,
    idleCooldownUntil: until + behavior.idlePauseMs.min / 8,
  };
}

function schedulePause(behavior, ts, random) {
  const { min, max } = behavior.idlePauseMs;
  return ts + min + random() * Math.max(0, max - min);
}

function isHovered(state, input, behavior) {
  if (!input.mouse) return false;
  const centerX = state.x;
  const centerY = -input.sprite.height / 2;
  const dist = Math.hypot(input.mouse.x - centerX, input.mouse.y - centerY);
  return dist <= behavior.hoverDist;
}

export function stepPet(prev, input, behavior, random = Math.random) {
  const { ts, boundsWidth } = input;
  const next = { ...prev };

  let targetX;
  if (behavior.followMouse) {
    targetX = input.mouse?.x ?? next.x;
    next.targetX = null;
  } else if (ts < next.pauseUntil) {
    targetX = next.x;
  } else {
    if (next.targetX === null) {
      Object.assign(next, pickMovement(behavior, random));
      next.targetX = pickWanderTarget(next.x, boundsWidth, random);
    }
    targetX = next.targetX;
  }

  const diffX = targetX - next.x;
  const distX = Math.abs(diffX);
  if (distX > 0.5) next.facing = diffX < 0 ? -1 : 1;

  const arrived = distX < behavior.idleDist;
  if (arrived && next.targetX !== null) {
    next.targetX = null;
    next.pauseUntil = schedulePause(behavior, ts, random);
  }

  if (isHovered(next, input, behavior)) {
    next.mode = "hover";
    next.action = resolveAction(behavior, behavior.hoverAction);
    return next;
  }

  if (arrived) {
    next.mode = "idle";
    if (ts > next.idleCooldownUntil && ts > next.idleActionUntil) {
      Object.assign(next, pickIdle(behavior, ts, random) ?? {});
    }
    next.action = resolveAction(behavior, next.idleAction);
    return next;
  }

  next.mode = "walking";
  const step = behavior.speed * next.movementSpeedMultiplier;
  next.x = clampX(next.x + Math.sign(diffX) * Math.min(step, distX), boundsWidth);
  next.idleAction = defaultIdleAction(behavior);
  next.idleActionUntil = 0;
  next.idleCooldownUntil = 0;
  next.action = resolveAction(behavior, next.movementAction);
  return next;
}
