export const LAUNCH_AT = Date.parse("2026-10-26T12:00:00-07:00");

export function getCountdownState(nowMs) {
  if (nowMs >= LAUNCH_AT) {
    return { isHatched: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let remaining = Math.ceil((LAUNCH_AT - nowMs) / 1_000);
  const days = Math.floor(remaining / 86_400);
  remaining -= days * 86_400;
  const hours = Math.floor(remaining / 3_600);
  remaining -= hours * 3_600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining - minutes * 60;

  return { isHatched: false, days, hours, minutes, seconds };
}

function getPointerOffset(pointerX, pointerY, rect, limits) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const normalizedX = (pointerX - centerX) / (rect.width / 2);
  const normalizedY = (pointerY - centerY) / (rect.height / 2);
  const clamp = (value, maximum) => Math.max(-maximum, Math.min(maximum, value));

  return {
    x: Math.round(clamp(normalizedX * limits.x, limits.x)),
    y: Math.round(clamp(normalizedY * limits.y, limits.y)),
    rotate: Math.round(clamp(normalizedX * limits.rotate, limits.rotate))
  };
}

export function getRabbitOffset(pointerX, pointerY, rect) {
  return getPointerOffset(pointerX, pointerY, rect, { x: 30, y: 20, rotate: 5 });
}

export function getRabbitHeadOffset(pointerX, pointerY, rect) {
  return getPointerOffset(pointerX, pointerY, rect, { x: 18, y: 10, rotate: 8 });
}
