// Show the 3D eyewear in the hero as soon as the page is ready.
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
      await load('experience.js?v=20260924-model-only');
    } catch (error) {
      const stage = document.querySelector('.hero-photo');
      if (stage) {
        stage.innerHTML = '';
        const message = document.createElement('p');
        message.className = 'scene-fallback-message';
        message.textContent = '3D көзілдірікті жүктеу мүмкін болмады. Бетті қайта жүктеп көріңіз.';
        stage.append(message);
      }
      document.querySelectorAll('.product-3d-status').forEach(status => {
        status.textContent = '3D көрініс қолжетімсіз';
      });
      console.error('3D eyewear failed to load', error);
      return;
    }
    try {
      await load('catalog-3d.js?v=20260924-catalog3d');
    } catch (error) {
      document.querySelectorAll('.product-3d-status').forEach(status => {
        status.textContent = '3D көрініс қолжетімсіз';
      });
      console.error('3D collection failed to load', error);
    }
  };
  addEventListener('DOMContentLoaded', () => {
    start();
  }, {once: true});
})();
