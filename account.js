const accountText = {
  kk: {authTitle:'Тіркелу немесе аккаунтқа кіру',register:'Тіркелу',login:'Аккаунтқа кіру',password:'Құпиясөз',confirmPassword:'Құпиясөзді қайталаңыз',createAccount:'Тіркелу ↗',signIn:'Кіру ↗',logout:'Шығу ↗',authNote:'Бұл — тек осы браузерде жұмыс істейтін прототип. Нақты DOS аккаунты жасалмайды.',mismatch:'Құпиясөздер сәйкес келмейді.',exists:'Бұл браузерде аккаунт бар. Кіру бөлімін пайдаланыңыз.',invalid:'Электрондық пошта немесе құпиясөз қате.',unavailable:'Браузер деректерді сақтай алмады.',welcome:name=>`Қош келдіңіз, ${name}.`,saved:'Деректер сақталды.'},
  ru: {authTitle:'Регистрация или вход',register:'Регистрация',login:'Войти в аккаунт',password:'Пароль',confirmPassword:'Повторите пароль',createAccount:'Зарегистрироваться ↗',signIn:'Войти ↗',logout:'Выйти ↗',authNote:'Это прототип, который работает только в этом браузере. Аккаунт DOS не создаётся.',mismatch:'Пароли не совпадают.',exists:'В этом браузере уже есть аккаунт. Войдите в него.',invalid:'Неверная почта или пароль.',unavailable:'Браузер не смог сохранить данные.',welcome:name=>`Здравствуйте, ${name}.`,saved:'Данные сохранены.'},
  en: {authTitle:'Register or sign in',register:'Register',login:'Sign in',password:'Password',confirmPassword:'Confirm password',createAccount:'Create account ↗',signIn:'Sign in ↗',logout:'Sign out ↗',authNote:'This prototype works only in this browser. It does not create a DOS account.',mismatch:'Passwords do not match.',exists:'An account already exists in this browser. Please sign in.',invalid:'Incorrect email or password.',unavailable:'The browser could not save your details.',welcome:name=>`Welcome, ${name}.`,saved:'Details saved.'}
};
const accountKey='dos-prototype-account-v1';
const sessionKey='dos-prototype-session-v1';
const accountCopy=()=>accountText[document.documentElement.lang]||accountText.kk;
function readAccount(){try{return JSON.parse(localStorage.getItem(accountKey)||'null')}catch{return null}}
function isSignedIn(){try{return sessionStorage.getItem(sessionKey)==='yes'&&!!readAccount()}catch{return false}}
function bytesToBase64(bytes){return btoa(String.fromCharCode(...bytes))}
function base64ToBytes(value){return Uint8Array.from(atob(value),char=>char.charCodeAt(0))}
async function passwordHash(password,salt){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},key,256);
  return bytesToBase64(new Uint8Array(bits));
}
document.addEventListener('DOMContentLoaded',()=>{
  const authView=document.querySelector('#authView');
  if(!authView)return;
  const profileView=document.querySelector('#profileView');
  const registerForm=document.querySelector('#registerForm');
  const loginForm=document.querySelector('#loginForm');
  const profileForm=document.querySelector('#profileForm');
  const authStatus=document.querySelector('#authStatus');
  const profileStatus=document.querySelector('#profileStatus');
  const registerTab=document.querySelector('#registerTab');
  const loginTab=document.querySelector('#loginTab');
  let mode=readAccount()?'login':'register';
  function translate(){
    const c=accountCopy();
    document.querySelectorAll('[data-a]').forEach(el=>{el.textContent=c[el.dataset.a]});
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
  function showView(){
    const signedIn=isSignedIn();
    authView.hidden=signedIn;
    profileView.hidden=!signedIn;
    if(signedIn){
      const account=readAccount();
      for(const field of ['name','email','phone'])profileForm.elements[field].value=account[field]||'';
    }
    translate();
  }
  try{
    if(!readAccount()){
      const old=JSON.parse(localStorage.getItem('dos-prototype-profile')||'null');
      if(old)for(const field of ['name','email','phone'])registerForm.elements[field].value=old[field]||'';
    }
  }catch{}
  registerTab.addEventListener('click',()=>setMode('register'));
  loginTab.addEventListener('click',()=>setMode('login'));
  registerForm.addEventListener('submit',async event=>{
    event.preventDefault();
    const c=accountCopy();
    if(readAccount()){authStatus.textContent=c.exists;setMode('login');authStatus.textContent=c.exists;return}
    const form=new FormData(registerForm);
    if(form.get('password')!==form.get('confirmPassword')){authStatus.textContent=c.mismatch;return}
    try{
      const salt=crypto.getRandomValues(new Uint8Array(16));
      const account={name:form.get('name').trim(),email:form.get('email').trim().toLowerCase(),phone:form.get('phone').trim(),salt:bytesToBase64(salt),hash:await passwordHash(form.get('password'),salt)};
      localStorage.setItem(accountKey,JSON.stringify(account));
      localStorage.removeItem('dos-prototype-profile');
      sessionStorage.setItem(sessionKey,'yes');
      registerForm.reset();
      showView();
      profileStatus.textContent=c.saved;
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
    try{localStorage.setItem(accountKey,JSON.stringify(account));profileStatus.textContent=accountCopy().saved;translate()}
    catch{profileStatus.textContent=accountCopy().unavailable}
  });
  document.querySelector('#logoutButton').addEventListener('click',()=>{
    try{sessionStorage.removeItem(sessionKey)}catch{}
    profileStatus.textContent='';
    setMode('login');
    showView();
  });
  document.addEventListener('dos:language',translate);
  setMode(mode);
  showView();
});
