// Start the heavier WebGL preview only when the visitor asks for it.
(() => {
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
  const start = async () => {
    try {
      await load('assets/three.min.js?v=20260912-clean');
      await load('eyewear-model.js?v=20260912-clean');
      await load('experience.js?v=20260924-fixes2');
    } catch (error) {
      // The local eyewear illustration remains available when 3D cannot load.
      console.warn('3D preview unavailable', error);
    }
  };
  addEventListener('DOMContentLoaded', () => {
    const preview = document.querySelector('.scene-start');
    if (!preview) return;
    if (matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)').matches) {
      preview.hidden = true;
      return;
    }
    preview.addEventListener('click', () => {
      preview.disabled = true;
      start();
    }, {once: true});
  }, {once: true});
})();
