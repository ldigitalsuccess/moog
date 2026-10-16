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

export function getRabbitOffset(pointerX, pointerY, rect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const normalizedX = (pointerX - centerX) / (rect.width / 2);
  const normalizedY = (pointerY - centerY) / (rect.height / 2);
  const clamp = (value, maximum) => Math.max(-maximum, Math.min(maximum, value));

  return {
    x: Math.round(clamp(normalizedX * 30, 30)),
    y: Math.round(clamp(normalizedY * 20, 20)),
    rotate: Math.round(clamp(normalizedX * 5, 5))
  };
}
