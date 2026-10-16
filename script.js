import { getCountdownState, getRabbitOffset } from "./lib/moog-motion.js";

export function formatCountdownUnit(value) {
  return String(value).padStart(2, "0");
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
  const rabbitStage = rabbit?.closest(".rabbit-stage");
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia?.("(pointer: fine)").matches;

  if (rabbit && rabbitStage && finePointer && !reducedMotion) {
    const resetRabbit = () => {
      rabbit.classList.remove("is-tracking");
      rabbit.style.removeProperty("transform");
    };

    rabbitStage.addEventListener("pointermove", (event) => {
      const offset = getRabbitOffset(event.clientX, event.clientY, rabbit.getBoundingClientRect());
      rabbit.classList.add("is-tracking");
      rabbit.style.transform = `translate(${offset.x}px, ${offset.y}px) rotate(${offset.rotate}deg)`;
    });
    rabbitStage.addEventListener("pointerleave", resetRabbit);
  }

  const heroVideo = document.querySelector("#hero-video");
  heroVideo?.addEventListener("error", () => hero?.classList.add("is-video-fallback"));
}
