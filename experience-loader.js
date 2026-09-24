// Let the page paint and its navigation become interactive before starting WebGL.
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
      await load('experience.js?v=20260924-language-menu');
    } catch (error) {
      // The local eyewear illustration remains available when 3D cannot load.
      console.warn('3D preview unavailable', error);
    }
  };
  addEventListener('load', () => {
    if ('requestIdleCallback' in window) requestIdleCallback(start, {timeout: 1500});
    else setTimeout(start, 200);
  }, {once: true});
})();
