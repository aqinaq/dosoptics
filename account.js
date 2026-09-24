const accountText = {
  kk: {authTitle:'Тіркелу немесе аккаунтқа кіру',register:'Тіркелу',login:'Аккаунтқа кіру',password:'Құпиясөз',confirmPassword:'Құпиясөзді қайталаңыз',createAccount:'Тіркелу ↗',signIn:'Кіру ↗',logout:'Шығу ↗',authNote:'Бұл — тек осы браузерде жұмыс істейтін прототип. Нақты DOS аккаунты жасалмайды.',mismatch:'Құпиясөздер сәйкес келмейді.',exists:'Бұл браузерде аккаунт бар. Кіру бөлімін пайдаланыңыз.',invalid:'Электрондық пошта немесе құпиясөз қате.',unavailable:'Браузер деректерді сақтай алмады.',welcome:name=>`Қош келдіңіз, ${name}.`,saved:'Деректер сақталды.'},
  ru: {authTitle:'Регистрация или вход',register:'Регистрация',login:'Войти в аккаунт',password:'Пароль',confirmPassword:'Повторите пароль',createAccount:'Зарегистрироваться ↗',signIn:'Войти ↗',logout:'Выйти ↗',authNote:'Это прототип, который работает только в этом браузере. Аккаунт DOS не создаётся.',mismatch:'Пароли не совпадают.',exists:'В этом браузере уже есть аккаунт. Войдите в него.',invalid:'Неверная почта или пароль.',unavailable:'Браузер не смог сохранить данные.',welcome:name=>`Здравствуйте, ${name}.`,saved:'Данные сохранены.'},
  en: {authTitle:'Register or sign in',register:'Register',login:'Sign in',password:'Password',confirmPassword:'Confirm password',createAccount:'Create account ↗',signIn:'Sign in ↗',logout:'Sign out ↗',authNote:'This prototype works only in this browser. It does not create a DOS account.',mismatch:'Passwords do not match.',exists:'An account already exists in this browser. Please sign in.',invalid:'Incorrect email or password.',unavailable:'The browser could not save your details.',welcome:name=>`Welcome, ${name}.`,saved:'Details saved.'}
};
Object.assign(accountText.kk,{intro:'Деректеріңізді басқарып, DOS мүмкіндіктерін қарап шығыңыз.',authNote:'Бұл демо аккаунт тек ашық браузер сессиясында жұмыс істейді. DOS жүйесіне ештеңе жіберілмейді.',dashboardEyebrow:'01 / АККАУНТ',dashboardTitle:'Аккаунтты басқару',overview:'Шолу',details:'Жеке деректер',security:'Қауіпсіздік',accountSummary:'АККАУНТ АҚПАРАТЫ',editDetails:'Деректерді өзгерту',changePassword:'Құпиясөзді өзгерту',sessionNote:'Бұл демо деректері браузер жабылғанша ғана қолданылады.',securityTitle:'Құпиясөзді өзгерту',currentPassword:'Қазіргі құпиясөз',newPassword:'Жаңа құпиясөз',updatePassword:'Құпиясөзді жаңарту ↗',wrongPassword:'Қазіргі құпиясөз қате.',passwordChanged:'Құпиясөз жаңартылды.',resetTitle:'Демо аккаунт',resetNote:'Аккаунтты осы сессиядан өшірсеңіз, қайта тіркеле аласыз.',resetAccount:'Аккаунтты өшіру',resetConfirm:'Осы сессиядағы демо аккаунтты өшіресіз бе?'});
Object.assign(accountText.ru,{intro:'Управляйте данными аккаунта и возможностями DOS.',authNote:'Демо аккаунт работает только в текущей сессии браузера. Данные не отправляются в DOS.',dashboardEyebrow:'01 / АККАУНТ',dashboardTitle:'Управление аккаунтом',overview:'Обзор',details:'Личные данные',security:'Безопасность',accountSummary:'ДАННЫЕ АККАУНТА',editDetails:'Изменить данные',changePassword:'Изменить пароль',sessionNote:'Демо данные доступны только до закрытия браузера.',securityTitle:'Изменить пароль',currentPassword:'Текущий пароль',newPassword:'Новый пароль',updatePassword:'Обновить пароль ↗',wrongPassword:'Неверный текущий пароль.',passwordChanged:'Пароль обновлён.',resetTitle:'Демо аккаунт',resetNote:'Удалите аккаунт из этой сессии, чтобы зарегистрироваться снова.',resetAccount:'Удалить аккаунт',resetConfirm:'Удалить демо аккаунт из этой сессии?'});
Object.assign(accountText.en,{intro:'Manage your details and explore DOS features.',authNote:'This demo account works only in the current browser session. Nothing is sent to DOS.',dashboardEyebrow:'01 / ACCOUNT',dashboardTitle:'Manage account',overview:'Overview',details:'Personal details',security:'Security',accountSummary:'ACCOUNT DETAILS',editDetails:'Edit details',changePassword:'Change password',sessionNote:'Demo details are available only until you close the browser.',securityTitle:'Change password',currentPassword:'Current password',newPassword:'New password',updatePassword:'Update password ↗',wrongPassword:'Incorrect current password.',passwordChanged:'Password updated.',resetTitle:'Demo account',resetNote:'Remove the account from this session to register again.',resetAccount:'Remove account',resetConfirm:'Remove this demo account from the session?'});
const accountKey='dos-prototype-session-account-v2';
const sessionKey='dos-prototype-session-v2';
Object.assign(accountText.kk,{showPassword:'Құпиясөзді көрсету',hidePassword:'Құпиясөзді жасыру'});
Object.assign(accountText.ru,{showPassword:'Показать пароль',hidePassword:'Скрыть пароль'});
Object.assign(accountText.en,{showPassword:'Show password',hidePassword:'Hide password'});
const accountCopy=()=>accountText[document.documentElement.lang]||accountText.kk;
function readAccount(){try{return JSON.parse(sessionStorage.getItem(accountKey)||'null')}catch{return null}}
function isSignedIn(){try{return sessionStorage.getItem(sessionKey)==='yes'&&!!readAccount()}catch{return false}}
function bytesToBase64(bytes){return btoa(String.fromCharCode(...bytes))}
function base64ToBytes(value){return Uint8Array.from(atob(value),char=>char.charCodeAt(0))}
async function passwordHash(password,salt){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},key,256);
  return bytesToBase64(new Uint8Array(bits));
}
document.addEventListener('DOMContentLoaded',()=>{
  // Carry an existing prototype login into the current tab, then clear its older persistent copy.
  try{
    const old=localStorage.getItem('dos-prototype-account-v1');
    if(old&&JSON.parse(old)?.hash){
      if(!readAccount())sessionStorage.setItem(accountKey,old);
      if(sessionStorage.getItem('dos-prototype-session-v1')==='yes')sessionStorage.setItem(sessionKey,'yes');
      localStorage.removeItem('dos-prototype-account-v1');
      sessionStorage.removeItem('dos-prototype-session-v1');
    }
  }catch{}
  const authView=document.querySelector('#authView');
  if(!authView)return;
  const profileView=document.querySelector('#profileView');
  const registerForm=document.querySelector('#registerForm');
  const loginForm=document.querySelector('#loginForm');
  const profileForm=document.querySelector('#profileForm');
  const passwordForm=document.querySelector('#passwordForm');
  const authStatus=document.querySelector('#authStatus');
  const profileStatus=document.querySelector('#profileStatus');
  const passwordStatus=document.querySelector('#passwordStatus');
  const registerTab=document.querySelector('#registerTab');
  const loginTab=document.querySelector('#loginTab');
  const passwordToggles=[];
  document.querySelectorAll('.account-card input[type="password"]').forEach(input=>{
    const field=document.createElement('span');
    field.className='password-field';
    input.before(field);
    field.append(input);
    const button=document.createElement('button');
    button.type='button';
    button.className='password-toggle';
    button.setAttribute('aria-pressed','false');
    button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/><path class="password-hide-line" d="M3 21 21 3"/></svg>';
    field.append(button);
    const update=()=>{
      const visible=input.type==='text';
      button.setAttribute('aria-pressed',String(visible));
      button.setAttribute('aria-label',accountCopy()[visible?'hidePassword':'showPassword']);
    };
    button.addEventListener('click',()=>{input.type=input.type==='password'?'text':'password';update()});
    input.form.addEventListener('reset',()=>{input.type='password';update()});
    passwordToggles.push(update);
  });
  let mode=readAccount()?'login':'register';
  let panel='overview';
  function translate(){
    const c=accountCopy();
    document.querySelectorAll('[data-a]').forEach(el=>{el.textContent=c[el.dataset.a]});
    passwordToggles.forEach(update=>update());
    if(isSignedIn())document.querySelector('#profileWelcome').textContent=c.welcome(readAccount().name);
  }
  function setMode(next){
    mode=next;
    registerForm.hidden=next!=='register';
    loginForm.hidden=next!=='login';
    registerTab.setAttribute('aria-pressed',String(next==='register'));
    loginTab.setAttribute('aria-pressed',String(next==='login'));
    authStatus.textContent='';
  }
  function showPanel(next){
    panel=next;
    for(const name of ['overview','details','security'])document.querySelector(`#${name}Panel`).hidden=name!==next;
    document.querySelectorAll('[data-panel]').forEach(button=>{
      if(button.dataset.panel===next)button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
  }
  function showView(){
    const signedIn=isSignedIn();
    authView.hidden=signedIn;
    profileView.hidden=!signedIn;
    if(signedIn){
      const account=readAccount();
      for(const field of ['name','email','phone'])profileForm.elements[field].value=account[field]||'';
      document.querySelector('#summaryName').textContent=account.name;
      document.querySelector('#summaryEmail').textContent=account.email;
      showPanel(panel);
    }
    translate();
  }
  registerTab.addEventListener('click',()=>setMode('register'));
  loginTab.addEventListener('click',()=>setMode('login'));
  document.querySelectorAll('[data-panel],[data-open-panel]').forEach(button=>button.addEventListener('click',()=>showPanel(button.dataset.panel||button.dataset.openPanel)));
  registerForm.addEventListener('submit',async event=>{
    event.preventDefault();
    const c=accountCopy();
    if(readAccount()){authStatus.textContent=c.exists;setMode('login');authStatus.textContent=c.exists;return}
    const form=new FormData(registerForm);
    if(form.get('password')!==form.get('confirmPassword')){authStatus.textContent=c.mismatch;return}
    try{
      const salt=crypto.getRandomValues(new Uint8Array(16));
      const account={name:form.get('name').trim(),email:form.get('email').trim().toLowerCase(),phone:form.get('phone').trim(),salt:bytesToBase64(salt),hash:await passwordHash(form.get('password'),salt)};
      sessionStorage.setItem(accountKey,JSON.stringify(account));
      sessionStorage.setItem(sessionKey,'yes');
      registerForm.reset();
      panel='overview';
      showView();
    }catch{authStatus.textContent=c.unavailable}
  });
  loginForm.addEventListener('submit',async event=>{
    event.preventDefault();
    const account=readAccount();
    const form=new FormData(loginForm);
    try{
      if(!account||form.get('email').trim().toLowerCase()!==account.email||await passwordHash(form.get('password'),base64ToBytes(account.salt))!==account.hash){authStatus.textContent=accountCopy().invalid;return}
      sessionStorage.setItem(sessionKey,'yes');
      loginForm.reset();
      panel='overview';
      showView();
    }catch{authStatus.textContent=accountCopy().unavailable}
  });
  profileForm.addEventListener('submit',event=>{
    event.preventDefault();
    const account=readAccount();
    if(!isSignedIn()||!account){showView();return}
    const form=new FormData(profileForm);
    for(const field of ['name','email','phone'])account[field]=form.get(field).trim();
    account.email=account.email.toLowerCase();
    try{sessionStorage.setItem(accountKey,JSON.stringify(account));profileStatus.textContent=accountCopy().saved;showView()}
    catch{profileStatus.textContent=accountCopy().unavailable}
  });
  passwordForm.addEventListener('submit',async event=>{
    event.preventDefault();
    const account=readAccount();
    if(!isSignedIn()||!account){showView();return}
    const form=new FormData(passwordForm);
    const c=accountCopy();
    if(form.get('newPassword')!==form.get('confirmPassword')){passwordStatus.textContent=c.mismatch;return}
    try{
      if(await passwordHash(form.get('currentPassword'),base64ToBytes(account.salt))!==account.hash){passwordStatus.textContent=c.wrongPassword;return}
      const salt=crypto.getRandomValues(new Uint8Array(16));
      account.salt=bytesToBase64(salt);
      account.hash=await passwordHash(form.get('newPassword'),salt);
      sessionStorage.setItem(accountKey,JSON.stringify(account));
      passwordForm.reset();
      passwordStatus.textContent=c.passwordChanged;
    }catch{passwordStatus.textContent=c.unavailable}
  });
  document.querySelector('#logoutButton').addEventListener('click',()=>{
    try{sessionStorage.removeItem(sessionKey)}catch{}
    profileStatus.textContent='';
    passwordStatus.textContent='';
    passwordForm.reset();
    setMode('login');
    showView();
  });
  document.querySelector('#resetAccountButton').addEventListener('click',()=>{
    if(!window.confirm(accountCopy().resetConfirm))return;
    try{sessionStorage.removeItem(sessionKey);sessionStorage.removeItem(accountKey)}catch{}
    profileStatus.textContent='';
    passwordStatus.textContent='';
    passwordForm.reset();
    setMode('register');
    showView();
  });
  document.addEventListener('dos:language',translate);
  setMode(mode);
  showView();
});
