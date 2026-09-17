// ResizeObserver includes font and content-driven changes to the track geometry.
export function observeProgress(host: Window, track: Element, update: () => void) {
  let frame: number | undefined;
  let stopped = false;
  const schedule = () => {
    if (stopped || frame !== undefined) return;
    frame = host.requestAnimationFrame(() => {
      frame = undefined;
      if (!stopped) update();
    });
  };
  host.addEventListener("scroll", schedule, { passive: true });
  host.addEventListener("resize", schedule);
  host.addEventListener("pageshow", schedule);
  const observer = new ResizeObserver(schedule);
  observer.observe(track);
  schedule();
  return () => {
    stopped = true;
    if (frame !== undefined) host.cancelAnimationFrame(frame);
    host.removeEventListener("scroll", schedule);
    host.removeEventListener("resize", schedule);
    host.removeEventListener("pageshow", schedule);
    observer.disconnect();
  };
}
