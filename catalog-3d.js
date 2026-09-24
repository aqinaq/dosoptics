// Render the same real 3D frames used in the hero inside the collection cards.
(() => {
  'use strict';
  const T = window.THREE;
  if (!T || !window.createDosEyewear) return;

  const previews = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const preview = previews.get(entry.target);
      if (preview) preview.visible = entry.isIntersecting;
    });
  }, {rootMargin: '100px'});

  const errorText = () => ({
    kk: '3D көрініс қолжетімсіз',
    ru: '3D-просмотр недоступен',
    en: '3D view unavailable'
  })[document.documentElement.lang] || '3D view unavailable';

  function dispose(canvas, preview) {
    observer.unobserve(canvas);
    preview.glasses.model.traverse(object => object.geometry?.dispose());
    const materials = new Set();
    preview.glasses.model.traverse(object => {
      if (object.material) [].concat(object.material).forEach(material => materials.add(material));
    });
    materials.forEach(material => { material.map?.dispose(); material.dispose(); });
    preview.renderer.dispose();
    previews.delete(canvas);
  }

  function create(canvas) {
    const host = canvas.parentElement;
    const status = host.querySelector('.product-3d-status');
    try {
      const renderer = new T.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;

      const scene = new T.Scene();
      scene.add(new T.HemisphereLight(0xffffff, 0x465b68, 2.2));
      const key = new T.DirectionalLight(0xffffff, 3);
      key.position.set(-3, 4, 6);
      scene.add(key);
      const rim = new T.DirectionalLight(0xd9f378, 2);
      rim.position.set(3, 1, -4);
      scene.add(rim);

      const glasses = window.createDosEyewear(T, scene);
      glasses.build(Number(canvas.dataset.shape));
      const camera = new T.PerspectiveCamera(38, 1, .1, 50);
      camera.position.set(0, .15, 6.8);
      camera.lookAt(0, 0, 0);
      const preview = {renderer, scene, glasses, camera, host, status, visible: true, lastWidth: 0, lastHeight: 0};
      previews.set(canvas, preview);
      observer.observe(canvas);
      return preview;
    } catch (error) {
      status.textContent = errorText();
      console.error('3D product preview failed', error);
      return null;
    }
  }

  window.syncDosCatalog3d = () => {
    for (const [canvas, preview] of previews) {
      if (!canvas.isConnected) dispose(canvas, preview);
    }
    document.querySelectorAll('.product-3d-canvas').forEach(canvas => {
      if (!previews.has(canvas)) create(canvas);
    });
  };

  let previousFrame = 0;
  function animate(time) {
    requestAnimationFrame(animate);
    if (document.hidden || time - previousFrame < 50) return;
    previousFrame = time;
    for (const [canvas, preview] of previews) {
      if (!canvas.isConnected) { dispose(canvas, preview); continue; }
      if (!preview.visible || !preview.host.getClientRects().length) continue;
      const width = preview.host.clientWidth;
      const height = preview.host.clientHeight;
      if (!width || !height) continue;
      if (width !== preview.lastWidth || height !== preview.lastHeight) {
        preview.renderer.setSize(width, height, false);
        preview.camera.aspect = width / height;
        preview.camera.updateProjectionMatrix();
        preview.lastWidth = width;
        preview.lastHeight = height;
      }
      preview.glasses.model.rotation.set(.15, -.32 + Math.sin(time * .00035) * .3, -.02);
      preview.renderer.render(preview.scene, preview.camera);
      preview.status.hidden = true;
    }
  }
  window.syncDosCatalog3d();
  requestAnimationFrame(animate);
})();
