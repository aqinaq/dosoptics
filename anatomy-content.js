(() => {
  const tap='https://dosoptics.taplink.kz/';
  const copy={
    kk:{serviceTitle:'DOS-та не бар?',facts:[['20 / 7','20 салон · 7 қала'],['7 995 ₸','Акциялық пакеттердің бастапқы бағасы'],['≈15 мин','Алдын ала жазылу арқылы тегін тексеру'],['20%','Бірінші сатып алудан бонус; 6 ай жарамды']],terms:'Бағалар мен ұсыныс шарттарын DOS-тан нақтылаңыз.',contactTitle:'Жанаспалы линзалар да бар.',contactText:'Күнделікті, екі апталық және айлық линзалар; астигматикалық және арнайы түрлері — тапсырыспен.',social:'DOS Instagram-да ↗',official:'Бағалар мен қызметтер ↗'},
    ru:{serviceTitle:'Что есть в DOS?',facts:[['20 / 7','20 салонов · 7 городов'],['7 995 ₸','Стартовая цена акционных пакетов'],['≈15 мин','Бесплатная проверка по записи'],['20%','Бонусы за первую покупку; действуют 6 месяцев']],terms:'Цены и условия предложений уточняйте в DOS.',contactTitle:'Есть и контактные линзы.',contactText:'Однодневные, двухнедельные и месячные; астигматические и специальные варианты — под заказ.',social:'DOS в Instagram ↗',official:'Цены и услуги ↗'}
  };
  const services=document.createElement('section');services.className='section dos-facts';services.id='dos-services';document.querySelector('#salons').before(services);
  function render(){const l=document.documentElement.lang==='ru'?'ru':'kk',c=copy[l];
    services.innerHTML=`<div class="section-heading"><h2>${c.serviceTitle}</h2><a href="https://www.instagram.com/dos_optica/" target="_blank" rel="noopener">${c.social}</a></div><div class="fact-grid">${c.facts.map(f=>`<div><strong>${f[0]}</strong><p>${f[1]}</p></div>`).join('')}</div><div class="contact-lens-info"><div><h3>${c.contactTitle}</h3><p>${c.contactText}</p></div><a class="button navy" href="${tap}" target="_blank" rel="noopener">${c.official}</a></div><p class="anatomy-note">${c.terms} <a href="${tap}" target="_blank" rel="noopener">Taplink ↗</a></p>`;
  }
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();
})();
