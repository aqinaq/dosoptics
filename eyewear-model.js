/* Parametric concept eyewear. Dimensions illustrate construction, not a prescription. */
window.createDosEyewear = (T, scene) => {
  const model=new T.Group();scene.add(model);
  const frame=new T.MeshPhysicalMaterial({color:0x172c38,metalness:.025,roughness:.19,clearcoat:1,clearcoatRoughness:.09,envMapIntensity:.9});
  const metal=new T.MeshStandardMaterial({color:0xc9b994,metalness:.94,roughness:.24,envMapIntensity:1});
  const screw=new T.MeshStandardMaterial({color:0xb9c3c6,metalness:1,roughness:.21});
  const dark=new T.MeshStandardMaterial({color:0x20272b,metalness:.5,roughness:.4});
  const lens=new T.MeshPhysicalMaterial({color:0xe9f3f2,metalness:0,roughness:.035,transmission:.97,thickness:.065,ior:1.5,reflectivity:.38,clearcoat:1,clearcoatRoughness:.035,envMapIntensity:.75,side:T.DoubleSide});
  const silicone=new T.MeshPhysicalMaterial({color:0xe5ded2,roughness:.28,transmission:.5,thickness:.08,ior:1.4});
  const parts=[];
  function part(id,base,offset){const g=new T.Group();g.userData={part:id,base:new T.Vector3(...base),offset:new T.Vector3(...offset)};g.position.copy(g.userData.base);model.add(g);parts.push(g);return g;}
  function add(parent,geometry,material,position=[0,0,0]){const m=new T.Mesh(geometry,material);m.position.set(...position);parent.add(m);return m;}
  function contour(w,h,n=3.4){return Array.from({length:96},(_,i)=>{const a=i/96*Math.PI*2,c=Math.cos(a),s=Math.sin(a);return new T.Vector2(Math.sign(c)*Math.abs(c)**(2/n)*w,Math.sign(s)*Math.abs(s)**(2/n)*h);});}
  function tube(parent,points,r,material){return add(parent,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),40,r,12,false),material);}
  function bow(geometry,cx){const p=geometry.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,p.getZ(i)-.026*(p.getX(i)+cx)**2);p.needsUpdate=true;geometry.computeVertexNormals();return geometry;}
  // Closed meniscus lens, with curved front/back surfaces and a continuous edge.
  function lensGeometry(w,h,n,cx){const outer=contour(w,h,n),vertices=[],indices=[],segments=outer.length,rings=20;
    for(let side=0;side<2;side++)for(let r=0;r<=rings;r++)for(let i=0;i<segments;i++){const radius=r/rings,x=outer[i].x*radius,y=outer[i].y*radius;const z=(side===0?.055:-.013)+(side===0?.105:.087)*(1-radius*radius)-.026*(x+cx)**2;vertices.push(x,y,z);}
    const layer=(rings+1)*segments;
    for(let side=0;side<2;side++)for(let r=0;r<rings;r++)for(let i=0;i<segments;i++){const a=side*layer+r*segments+i,b=side*layer+r*segments+(i+1)%segments,c=a+segments,d=b+segments;indices.push(...(side===0?[a,c,b,b,c,d]:[a,b,c,b,d,c]));}
    for(let i=0;i<segments;i++){const a=rings*segments+i,b=rings*segments+(i+1)%segments;indices.push(a,b,a+layer,b,b+layer,a+layer);}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return g;
  }
  // Flat, softened temples instead of round wires; taper into the curved earpiece.
  function templeGeometry(sign,thin){const curve=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(sign*.01,-.015,-.6),new T.Vector3(-sign*.07,-.07,-2.0),new T.Vector3(-sign*.18,-.17,-2.8),new T.Vector3(-sign*.32,-.5,-3.15)]);const frames=curve.computeFrenetFrames(48,false),v=[],ix=[];const cross=contour(thin?.024:.047,thin?.036:.105,3.2);
    for(let i=0;i<=48;i++){const point=curve.getPointAt(i/48),taper=1-i/48*.25;for(let j=0;j<cross.length;j++){const pos=point.clone().addScaledVector(frames.normals[i],cross[j].x*taper).addScaledVector(frames.binormals[i],cross[j].y*taper);v.push(pos.x,pos.y,pos.z);}}
    const n=cross.length;for(let i=0;i<48;i++)for(let j=0;j<n;j++){const a=i*n+j,b=i*n+(j+1)%n;ix.push(a,b,a+n,b,b+n,a+n);}for(let j=1;j<n-1;j++){ix.push(0,j+1,j);ix.push(48*n,48*n+j,48*n+j+1);}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(ix);g.computeVertexNormals();return g;
  }
  const textCanvas=document.createElement('canvas');textCanvas.width=256;textCanvas.height=64;const ctx=textCanvas.getContext('2d');ctx.fillStyle='#c8b995';ctx.font='bold 44px Arial';ctx.textAlign='center';ctx.fillText('DOS',128,49);const logo=new T.CanvasTexture(textCanvas);logo.colorSpace=T.SRGBColorSpace;
  const logoMat=new T.MeshBasicMaterial({map:logo,transparent:true,depthWrite:false,side:T.DoubleSide});
  let currentShape=0;
  function build(type=0){currentShape=type;while(model.children.length){const g=model.children[0];g.traverse(o=>o.geometry?.dispose());model.remove(g);}parts.length=0;
    const thin=type===1,n=thin?2.15:3.5,w=thin?.94:.99,h=thin?.67:.65,t=thin?.033:.105;
    lens.color.setHex(type===2?0x537067:0xeaf4f3);lens.transmission=type===2?.37:.97;lens.roughness=type===2?.06:.035;
    const front=part('frame',[0,0,0],[0,-.27,-.18]);
    for(const sign of [-1,1]){
      const cx=sign*1.15;const outer=new T.Shape(contour(w,h,n));outer.holes.push(new T.Path(contour(w-t,h-t,n).reverse()));
      const rimGeo=new T.ExtrudeGeometry(outer,{depth:thin?.06:.16,bevelEnabled:true,bevelSegments:5,bevelSize:thin?.012:.035,bevelThickness:thin?.012:.035,steps:1,curveSegments:40});bow(rimGeo,cx);add(front,rimGeo,thin?metal:frame,[cx,0,0]);
      const edge=new T.Shape(contour(w-t+.015,h-t+.015,n));edge.holes.push(new T.Path(contour(w-t-.009,h-t-.009,n).reverse()));add(front,bow(new T.ExtrudeGeometry(edge,{depth:.018,bevelEnabled:false}),cx),thin?metal:dark,[cx,0,.076]);
      const lg=part('lenses',[cx,0,.07],[sign*.18,.66,1.46]);add(lg,lensGeometry(w-t-.012,h-t-.012,n,cx),lens);
      const arm=part('temples',[sign*2.18,.28,-.19],[sign*.6,-.44,-.47]);add(arm,templeGeometry(sign,thin),thin?metal:frame);
      if(!thin){const branding=add(arm,new T.PlaneGeometry(.37,.093),logoMat,[sign*.052,-.01,-.8]);branding.rotation.y=sign*Math.PI/2;branding.rotation.z=0;}
      const hg=part('hinges',[sign*2.145,.275,-.155],[sign*.6,.66,.13]);
      for(let k=0;k<3;k++)add(hg,new T.CylinderGeometry(.056,.056,.085,24),metal,[0,(k-1)*.09,0]);
      add(hg,new T.BoxGeometry(.18,.06,.1),metal,[-sign*.09,0,0]);
      const sg=part('hinges',[sign*2.145,.275,-.155],[sign*.6,1.17,.13]);add(sg,new T.CylinderGeometry(.019,.019,.29,16),screw);
      add(sg,new T.CylinderGeometry(.046,.043,.026,24),screw,[0,.155,0]);add(sg,new T.BoxGeometry(.063,.006,.01),dark,[0,.17,0]);
      if(!thin)for(let j=0;j<2;j++){const pin=add(front,new T.SphereGeometry(.022,12,8),metal,[sign*(1.96+j*.06),.29,.16-.026*(1.96+j*.06)**2]);pin.scale.z=.35;}
    }
    const bridge=part('bridge',[0,0,0],[0,1.15,.25]);tube(bridge,[[-.2,.26,.095],[0,.4,.14],[.2,.26,.095]],thin?.036:.063,thin?metal:frame);
    if(thin){for(const s of [-1,1]){tube(bridge,[[s*.27,.13,0],[s*.3,-.03,-.15],[s*.35,-.09,-.21]],.018,metal);const pad=add(bridge,new T.SphereGeometry(1,20,12),silicone,[s*.35,-.13,-.23]);pad.scale.set(.065,.15,.035);pad.rotation.z=s*.18;}}
    if(type===2)tube(bridge,[[-.2,.51,.055],[0,.54,.085],[.2,.51,.055]],.025,metal);
    explode(0);
  }
  function explode(value){for(const p of parts){p.position.copy(p.userData.base).addScaledVector(p.userData.offset,value);if(p.userData.part==='temples')p.rotation.y=Math.sign(p.userData.base.x)*.11*value;}}
  const anchor=(id)=>{const groups=parts.filter(p=>p.userData.part===id);if(!groups.length)return new T.Vector3();let group=groups[0],local=new T.Vector3();if(id==='frame')local.set(-1.15,-.55,.06);if(id==='temples'){group=groups[1]||group;local.set(0,-.05,-1.6);}if(id==='hinges')group=groups[2]||group;if(id==='bridge')local.set(0,.4,.08);if(id==='lenses')local.set(0,0,.12);return group.localToWorld(local);};
  build(0);return {model,frameMat:frame,metalMat:metal,lensMat:lens,build,explode,anchor,parts};
};
