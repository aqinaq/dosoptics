(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const stage = document.querySelector('.hero-photo');
  const copy = {
    kk:{concept:'КОНЦЕПТ / 01',drag:'Сүйреп бұрыңыз',rotate:'Айналдыру',pause:'Тоқтату',kind:'Дизайн прототипі',colors:['Түнгі көк','Піл сүйегі','Кәріптас'],names:['DOS / LINE 01','DOS / LINE 02','DOS / SUN 03'],types:['Ацетат пішіні','Жұқа металл пішіні','Күннен қорғайтын пішін'],fallback:'3D бұл құрылғыда қолжетімсіз. Фото нұсқасы көрсетілді.',canvas:'Көзілдіріктің 3D көрінісі. Бұру үшін сүйреңіз немесе бағыт пернелерін басыңыз. Бастапқы көрініс үшін Home.'},
    ru:{concept:'КОНЦЕПТ / 01',drag:'Перетаскивайте для вращения',rotate:'Вращать',pause:'Остановить',kind:'Дизайн-прототип',colors:['Ночной синий','Слоновая кость','Янтарь'],names:['DOS / LINE 01','DOS / LINE 02','DOS / SUN 03'],types:['Ацетатная форма','Тонкая металлическая форма','Солнцезащитная форма'],fallback:'3D недоступно на этом устройстве. Показана фотография.',canvas:'3D-модель очков. Перетаскивайте или используйте стрелки для вращения. Home возвращает исходный ракурс.'}
  };
  const words = () => copy[document.documentElement.lang === 'ru' ? 'ru' : 'kk'];
  stage.innerHTML = `<div class="scene-watermark" aria-hidden="true">DOS</div><div class="scene-orbit" aria-hidden="true"></div><div class="scene-label"><span>THE DOS PERSPECTIVE</span><span data-scene="concept"></span></div><canvas class="scene-canvas" tabindex="0" role="img"></canvas><div class="scene-bottom"><div class="scene-tools"><span class="scene-hint"><span class="drag-icon" aria-hidden="true">↔</span><span data-scene="drag"></span></span><button class="spin-button" aria-pressed="false"><span aria-hidden="true">⟳</span><span data-spin-label></span></button></div><div class="scene-config"><div><div class="frame-name">DOS / LINE 02</div><div class="frame-kind" data-scene="kind"></div></div><div class="swatches" role="group"><button data-color="0" aria-pressed="true"></button><button data-color="1" aria-pressed="false"></button><button data-color="2" aria-pressed="false"></button></div></div><div class="shape-switch" role="group"><button data-shape="0" aria-pressed="false">LINE / 01</button><button data-shape="1" aria-pressed="true">LINE / 02</button><button data-shape="2" aria-pressed="false">SUN / 03</button></div></div><span class="scene-status" aria-live="polite"></span>`;
  document.querySelectorAll('a.wordmark').forEach(el => { el.classList.add('brand-image');el.innerHTML='<img src="assets/dos-logo.png" alt="DOS Optics" width="94" height="44">'; });
  let spin=false,shape=1,color=0,explosion=1,currentExplosion=reduced.matches?1:0;
  stage.id='eyewear-studio';
  const partNames={kk:{lenses:'Линзалар',frame:'Жақтау',hinges:'Топсалар',temples:'Құлақшалар',bridge:'Көпір'},ru:{lenses:'Линзы',frame:'Оправа',hinges:'Шарниры',temples:'Дужки',bridge:'Мост'}};
  const partKeys=['lenses','frame','hinges','temples','bridge'];
  stage.insertAdjacentHTML('beforeend',`<div class="disassembly-controls"><button class="explode-toggle" aria-pressed="true"></button><input class="explode-slider" type="range" min="0" max="100" value="100"><output class="explode-readout">100%</output></div><svg class="callout-lines" aria-hidden="true">${partKeys.map(k=>`<line data-line="${k}"></line><circle r="3" data-dot="${k}"></circle>`).join('')}</svg><div class="part-hotspots">${partKeys.map((k,i)=>`<span class="part-hotspot" data-part="${k}"><span>${String(i+1).padStart(2,'0')}</span><b></b></span>`).join('')}</div>`);
  const canvas = stage.querySelector('canvas');
  const refreshCopy=()=>{
    const w=words(),ru=document.documentElement.lang==='ru';stage.querySelectorAll('[data-part]').forEach(a=>{a.querySelector('b').textContent=partNames[ru?'ru':'kk'][a.dataset.part];});
    stage.querySelector('.explode-toggle').textContent=explosion>.5?(ru?'Собрать очки':'Көзілдірікті жинау'):(ru?'Разобрать очки':'Бөлшектерді ашу');stage.querySelector('.explode-toggle').setAttribute('aria-pressed',String(explosion>.5));stage.querySelector('.explode-slider').setAttribute('aria-label',ru?'Раздвинуть детали':'Бөлшектерді ажырату');stage.querySelectorAll('[data-scene]').forEach(el=>el.textContent=w[el.dataset.scene]);
    canvas.setAttribute('aria-label',w.canvas);stage.querySelector('[data-spin-label]').textContent=spin?w.pause:w.rotate;
    stage.querySelector('.frame-name').textContent=w.names[shape];
    stage.querySelectorAll('[data-color]').forEach((b,i)=>{b.setAttribute('aria-label',w.colors[i]);b.title=w.colors[i];});
    stage.querySelectorAll('[data-shape]').forEach((b,i)=>b.setAttribute('aria-label',w.types[i]));
    const fallback=stage.querySelector('.scene-fallback-message');if(fallback)fallback.textContent=w.fallback;
  };
  refreshCopy();
  new MutationObserver(refreshCopy).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  // Animate language changes using the same existing language actions.
  document.querySelectorAll('.languages button').forEach(button=>button.addEventListener('click',event=>{
    if(!document.startViewTransition||reduced.matches||button.dataset.transitioning)return;
    event.stopImmediatePropagation();button.dataset.transitioning='1';
    document.startViewTransition(()=>{button.click();delete button.dataset.transitioning;});
  },true));
  const progress=document.createElement('div');progress.className='progress-line';document.body.append(progress);
  let scrollPending=false;
  addEventListener('scroll',()=>{if(scrollPending)return;scrollPending=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;scrollPending=false;});},{passive:true});
  const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.section-heading,.vision-intro,.steps>div,.salon-layout').forEach((el,i)=>{el.classList.add('reveal-ready');el.style.transitionDelay=`${i%3*60}ms`;reveal.observe(el);});
  const fallback=()=>{canvas.hidden=true;stage.querySelector('.scene-tools').hidden=true;stage.querySelector('.disassembly-controls').hidden=true;stage.querySelector('.callout-lines').hidden=true;stage.querySelector('.part-hotspots').style.position='relative';stage.querySelectorAll('[data-part]').forEach(a=>a.style.position='relative');stage.querySelector('.swatches').hidden=true;stage.querySelector('.shape-switch').hidden=true;const img=document.createElement('img');img.src='assets/hero.jpg';img.alt='DOS Optics';img.className='scene-fallback';stage.prepend(img);const msg=document.createElement('p');msg.className='scene-fallback-message';msg.textContent=words().fallback;stage.append(msg);};
  if(!window.THREE){fallback();return;}
  const T=window.THREE;
  let renderer;
  try{renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});}catch{fallback();return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  const scene=new T.Scene();const camera=new T.PerspectiveCamera(37,1,.1,80);camera.position.set(0,.45,8.9);camera.lookAt(0,0,-.4);
  scene.add(new T.HemisphereLight(0xe8edf0,0x282c30,1.3));
  const key=new T.DirectionalLight(0xffffff,2.6);key.position.set(-3,5,5);scene.add(key);
  const rimLight=new T.DirectionalLight(0xe1edf4,2.3);rimLight.position.set(4,2,-3);scene.add(rimLight);
  const fill=new T.DirectionalLight(0xffffff,.8);fill.position.set(1,-2,4);scene.add(fill);
  // Soft studio strips reflected in the acetate and lens surfaces.
  const envCanvas=document.createElement('canvas');envCanvas.width=1024;envCanvas.height=512;const ec=envCanvas.getContext('2d');
  const gradient=ec.createLinearGradient(0,0,0,512);gradient.addColorStop(0,'#aabfd3');gradient.addColorStop(.5,'#233d57');gradient.addColorStop(1,'#617484');ec.fillStyle=gradient;ec.fillRect(0,0,1024,512);
  ec.fillStyle='#ffffff';ec.fillRect(110,80,60,340);ec.fillRect(640,60,140,280);ec.fillStyle='#a7c4e3';ec.fillRect(870,0,35,512);
  const env=new T.CanvasTexture(envCanvas);env.mapping=T.EquirectangularReflectionMapping;env.colorSpace=T.SRGBColorSpace;const pmrem=new T.PMREMGenerator(renderer);const envRT=pmrem.fromEquirectangular(env);scene.environment=envRT.texture;env.dispose();pmrem.dispose();
  const studioCanvas=document.createElement('canvas');studioCanvas.width=512;studioCanvas.height=512;const sc=studioCanvas.getContext('2d');const sg=sc.createRadialGradient(256,200,20,256,256,360);sg.addColorStop(0,'#617984');sg.addColorStop(.55,'#304c5b');sg.addColorStop(1,'#0c223d');sc.fillStyle=sg;sc.fillRect(0,0,512,512);const studioTex=new T.CanvasTexture(studioCanvas);studioTex.colorSpace=T.SRGBColorSpace;const studioPlane=new T.Mesh(new T.PlaneGeometry(32,32),new T.MeshBasicMaterial({map:studioTex}));studioPlane.position.z=-9;scene.add(studioPlane);
  const glasses=window.createDosEyewear(T,scene);const {model,frameMat,metalMat,lensMat}=glasses;
  const colorways=[0x162632,0xd6c8b2,0x6f381c];
  const buildGlasses=type=>glasses.build(type);
  buildGlasses(shape);
  const updateCallouts=()=>{const r=stage.getBoundingClientRect();model.updateWorldMatrix(true,true);for(const id of partKeys){const p=glasses.anchor(id).project(camera),a=stage.querySelector('[data-part='+id+']').getBoundingClientRect();const x=(p.x*.5+.5)*r.width,y=(-p.y*.5+.5)*r.height;const line=stage.querySelector('[data-line='+id+']'),dot=stage.querySelector('[data-dot='+id+']');line.setAttribute('x1',a.left-r.left+a.width/2);line.setAttribute('y1',a.top-r.top+a.height/2);line.setAttribute('x2',x);line.setAttribute('y2',y);dot.setAttribute('cx',x);dot.setAttribute('cy',y);}};
  const target={x:.25,y:-.58};let current={...target};let dragging=false,pointer=null,last={x:0,y:0},startPointer={x:0,y:0},moved=0;let visible=true,lastTime=0,animationId=0;
  const fit=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=Math.max(10.5,9.4/camera.aspect);camera.updateProjectionMatrix();draw(0);};
  function draw(time){const dt=Math.min((time-lastTime)/1000||0,.05);lastTime=time;
    if(spin&&!dragging)target.y+=dt*.34;
    const easing=reduced.matches?1:.08;current.x+=(target.x-current.x)*easing;current.y+=(target.y-current.y)*easing;
    currentExplosion+=(explosion-currentExplosion)*(reduced.matches?1:.075);glasses.explode(currentExplosion);camera.position.z=Math.max(9.7,9/camera.aspect)*(1+currentExplosion*.44);camera.updateProjectionMatrix();model.rotation.set(current.x,current.y,-.025);model.position.y=.65+(reduced.matches?0:Math.sin(time*.0007)*.025);
    renderer.render(scene,camera);updateCallouts();
  }
  const tick=time=>{if(visible&&!document.hidden)draw(time);animationId=requestAnimationFrame(tick);};
  new ResizeObserver(fit).observe(stage);new IntersectionObserver(([e])=>{visible=e.isIntersecting;},{threshold:0}).observe(stage);
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;pointer=e.pointerId;last={x:e.clientX,y:e.clientY};startPointer={...last};moved=0;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(dragging&&pointer===e.pointerId){moved=Math.max(moved,Math.hypot(e.clientX-startPointer.x,e.clientY-startPointer.y));target.y+=(e.clientX-last.x)*.009;target.x=Math.max(-.85,Math.min(.85,target.x+(e.clientY-last.y)*.005));last={x:e.clientX,y:e.clientY};}});
  const release=()=>{dragging=false;pointer=null;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('keydown',e=>{const moves={ArrowLeft:[0,-.2],ArrowRight:[0,.2],ArrowUp:[-.1,0],ArrowDown:[.1,0]};if(moves[e.key]){e.preventDefault();target.x=Math.max(-.85,Math.min(.85,target.x+moves[e.key][0]));target.y+=moves[e.key][1];}else if(e.key==='Home'){e.preventDefault();target.x=.25;target.y=-.58;}});
  stage.querySelector('.spin-button').addEventListener('click',()=>{spin=!spin;stage.querySelector('.spin-button').setAttribute('aria-pressed',String(spin));refreshCopy();});
  stage.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{color=Number(b.dataset.color);frameMat.color.setHex(colorways[color]);metalMat.color.setHex([0x9daab7,0xd7c7a1,0xc48b54][color]);stage.querySelectorAll('[data-color]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));stage.querySelector('.scene-status').textContent=words().colors[color];}));
  stage.querySelectorAll('[data-shape]').forEach(b=>b.addEventListener('click',()=>{shape=Number(b.dataset.shape);buildGlasses(shape);stage.querySelectorAll('[data-shape]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));refreshCopy();stage.querySelector('.scene-status').textContent=words().types[shape];}));
  const setExplosion=value=>{explosion=Math.max(0,Math.min(1,value));stage.querySelector('.explode-slider').value=Math.round(explosion*100);stage.querySelector('.explode-readout').value=Math.round(explosion*100)+'%';refreshCopy();};
  stage.querySelector('.explode-toggle').addEventListener('click',()=>setExplosion(explosion>.5?0:1));stage.querySelector('.explode-slider').addEventListener('input',e=>setExplosion(Number(e.target.value)/100));
  reduced.addEventListener('change',()=>{if(reduced.matches){spin=false;stage.querySelector('.spin-button').setAttribute('aria-pressed','false');refreshCopy();}});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(animationId);fallback();},{once:true});
  fit();tick(0);
  // Catalogue previews are rendered from these same concept models, not stock inventory.
  const thumbnails=[];const oldAspect=camera.aspect,oldZ=camera.position.z;
  renderer.setSize(720,480,false);camera.aspect=1.5;camera.position.z=7.5;camera.updateProjectionMatrix();
  for(let i=0;i<3;i++){buildGlasses(i);model.rotation.set(.25,-.38,-.07);model.position.y=0;glasses.explode(0);studioPlane.visible=false;renderer.render(scene,camera);thumbnails.push(canvas.toDataURL('image/png'));}
  studioPlane.visible=true;buildGlasses(shape);camera.aspect=oldAspect;camera.position.z=oldZ;fit();
  const patchCards=()=>{document.querySelectorAll('.product').forEach(b=>{const index=['atelier','linea','sol'].indexOf(b.dataset.product);if(index<0)return;const img=b.querySelector('img');if(img.src!==thumbnails[index])img.src=thumbnails[index];img.alt=words().names[index];b.querySelector('h3').textContent=words().names[index];b.querySelector('p').textContent=words().types[index];if(!b.dataset.motionBound){b.dataset.motionBound='1';b.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const r=b.getBoundingClientRect();b.style.setProperty('--rx',`${-(e.clientY-r.top-r.height/2)/r.height*7}deg`);b.style.setProperty('--ry',`${(e.clientX-r.left-r.width/2)/r.width*7}deg`);});b.addEventListener('pointerleave',()=>{b.style.setProperty('--rx','0deg');b.style.setProperty('--ry','0deg');});b.addEventListener('click',()=>{const detail=document.querySelector('#detailContent');const image=detail.querySelector('img');if(image)image.src=thumbnails[index];const heading=detail.querySelector('h2');if(heading)heading.textContent=words().names[index];const p=detail.querySelector('p');if(p)p.textContent=words().types[index];});}});};
  patchCards();new MutationObserver(()=>patchCards()).observe(document.querySelector('#cards'),{childList:true});
  addEventListener('pagehide',()=>cancelAnimationFrame(animationId));
  addEventListener('pageshow',e=>{if(e.persisted)tick(0);});
})();
