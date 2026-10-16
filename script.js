import { getCountdownState, getRabbitHeadOffset } from "./lib/moog-motion.js";

export function formatCountdownUnit(value) {
  return String(value).padStart(2, "0");
}

export function enableVideoFallback(hero) {
  hero?.classList.add("is-video-fallback");
}

export function enableRabbitTracking({ rabbit, rabbitHead = rabbit, rabbitStage, motionQuery, pointerQuery }) {
  if (!rabbit || !rabbitHead || !rabbitStage) return () => {};

  let canTrack = false;
  const resetRabbit = () => {
    rabbitHead.classList.remove("is-tracking");
    rabbitHead.style.removeProperty("transform");
  };
  const updateTrackingState = () => {
    canTrack = Boolean(pointerQuery?.matches) && !motionQuery?.matches;
    if (!canTrack) resetRabbit();
  };
  const moveRabbit = (event) => {
    if (!canTrack) return;
    const offset = getRabbitHeadOffset(event.clientX, event.clientY, rabbit.getBoundingClientRect());
    rabbitHead.classList.add("is-tracking");
    rabbitHead.style.transform = `translate(${offset.x}px, ${offset.y}px) rotate(${offset.rotate}deg)`;
  };
  const addQueryListener = (query) => {
    if (query?.addEventListener) {
      query.addEventListener("change", updateTrackingState);
      return () => query.removeEventListener("change", updateTrackingState);
    }
    if (query?.addListener) {
      query.addListener(updateTrackingState);
      return () => query.removeListener(updateTrackingState);
    }
    return () => {};
  };

  rabbitStage.addEventListener("pointermove", moveRabbit);
  rabbitStage.addEventListener("pointerleave", resetRabbit);
  const removeMotionListener = addQueryListener(motionQuery);
  const removePointerListener = addQueryListener(pointerQuery);
  updateTrackingState();

  return () => {
    rabbitStage.removeEventListener("pointermove", moveRabbit);
    rabbitStage.removeEventListener("pointerleave", resetRabbit);
    removeMotionListener();
    removePointerListener();
    resetRabbit();
  };
}

if (typeof document !== "undefined") {
  const hero = document.querySelector(".hero");
  const countdown = document.querySelector("#countdown");
  const launchCopy = document.querySelector("[data-launch-copy]");
  const units = Object.fromEntries(
    ["days", "hours", "minutes", "seconds"].map((unit) => [
      unit,
      countdown?.querySelector(`[data-unit="${unit}"]`)
    ])
  );

  const renderCountdown = () => {
    const state = getCountdownState(Date.now());
    if (launchCopy) launchCopy.textContent = state.isHatched ? "MOOG HAS HATCHED" : "MOOG IS HATCHING IN";
    for (const [unit, value] of Object.entries(units)) {
      if (value) value.textContent = formatCountdownUnit(state[unit]);
    }
  };

  renderCountdown();
  window.setInterval(renderCountdown, 1_000);

  const rabbit = document.querySelector("#rabbit");
  const rabbitHead = document.querySelector("#rabbit-head");
  const rabbitStage = rabbit?.closest(".rabbit-stage");
  const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const pointerQuery = window.matchMedia?.("(pointer: fine)");

  enableRabbitTracking({ rabbit, rabbitHead, rabbitStage, motionQuery, pointerQuery });

  const heroVideo = document.querySelector("#hero-video");
  heroVideo?.addEventListener("error", () => enableVideoFallback(hero));
}
