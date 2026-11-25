/* L7 TEST — header v2. Client-side display, not an access-control barrier. */
(() => {
  'use strict';
  const root = document.getElementById('l7-account-header');
  if (!root || root.dataset.initialized === '1') return;
  root.dataset.initialized = '1';

  const config = window.L7_HEADER_CONFIG || {};
  const accountUrl = config.accountPage || '/5a-accounts';
  const navItems = Array.isArray(config.navItems) && config.navItems.length
    ? config.navItems : [
      { label: 'Home', href: '/' },
      ...['4','5','6','8','10','11'].map(n => ({label:n, href:'/'+n}))
    ];
  const state = { loading:true, client:null, user:null, profile:null, classes:[], error:'', signingOut:false };
  let sequence = 0;

  function node(tag, cls, content) {
    const element=document.createElement(tag);
    if (cls) element.className=cls;
    if (content !== undefined) element.textContent=String(content);
    return element;
  }
  function a(label, href, cls='l7h-action') {
    const link=node('a',cls,label);
    link.href=href;
    return link;
  }
  function badge(t,style='') { return node('span','l7h-badge '+style,t); }

  function render() {
    const bar=node('div','l7h-bar');
    const brand=a('','/','l7h-brand');
    const logo=node('span','l7h-logo','L7');
    const brandText=node('span','l7h-brand-name','L7 TEST');
    brand.append(logo,brandText);
    bar.append(brand);

    const nav=node('nav','l7h-nav');
    nav.setAttribute('aria-label','Class navigation');
    const current=location.pathname.replace(/\/+$/,'') || '/';
    for (const item of navItems) {
      if (!item || !item.label || !item.href) continue;
      const link=a(item.label, item.href, 'l7h-nav-link');
      try {
        if (new URL(item.href,location.origin).pathname.replace(/\/+$/,'') === current) {
          link.classList.add('l7h-active');
          link.setAttribute('aria-current','page');
        }
      } catch (_) { /* Ignore invalid custom link; browser handles navigation. */ }
      nav.append(link);
    }
    bar.append(nav);

    const account=node('div','l7h-account');
    if (state.loading) {
      account.append(node('span','l7h-status','Checking account…'));
    } else if (state.error) {
      const err=node('span','l7h-status l7h-error',state.error);
      err.setAttribute('role','status');
      account.append(err,a('Sign in',accountUrl,'l7h-action l7h-main-action'));
    } else if (!state.user) {
      account.append(node('span','l7h-status','Not signed in'),a('Sign in',accountUrl,'l7h-action l7h-main-action'));
    } else {
      const p=state.profile;
      const displayName=p?.display_name?.trim() || 'Signed in';
      const person=node('div','l7h-person');
      const avatar=node('span','l7h-avatar',Array.from(displayName)[0]?.toUpperCase() || '?');
      avatar.setAttribute('aria-hidden','true');
      const detail=node('div','l7h-detail');
      const name=node('div','l7h-person-name',displayName);
      name.title=displayName;
      const meta=node('div','l7h-meta');
      if (p?.role === 'teacher') meta.append(badge('Teacher','l7h-teacher'));
      else if (p?.role === 'student') meta.append(badge('Student'));
      else meta.append(badge('Account'));
      const classText=p?.role==='teacher' ? state.classes.join(', ') : p?.class_code;
      if (classText) meta.append(node('span','l7h-class',classText));
      if (p?.status==='pending') meta.append(badge('Pending','l7h-pending'));
      if (p?.status==='rejected') meta.append(badge('Not approved','l7h-rejected'));
      detail.append(name,meta);
      person.append(avatar,detail);
      account.append(person,a('My account',accountUrl,'l7h-action l7h-my-account'));
      const out=node('button','l7h-action l7h-signout','Sign out');
      out.type='button';out.disabled=state.signingOut;
      out.addEventListener('click',async () => {
        if (!state.client || state.signingOut) return;
        state.signingOut=true;render();
        try {
          const result=await state.client.auth.signOut();
          if (result.error) throw result.error;
          state.user=null;state.profile=null;state.classes=[];
          state.error='';
        } catch (_) {state.error='Sign out failed';}
        state.signingOut=false;state.loading=false;render();
      });
      account.append(out);
    }
    bar.append(account);
    root.replaceChildren(bar);
  }

  function credentials() {
    const other=window.L7_ACCOUNTS_CONFIG || {};
    const test=window.L7_TEST_CONFIG || {};
    const url=String(config.supabaseUrl || other.supabaseUrl || test.url || '').trim();
    const key=String(config.publishableKey || other.publishableKey || test.publishableKey || '').trim();
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url) ||
        !key.startsWith('sb_publishable_') || /YOUR|REPLACE|PLACEHOLDER/i.test(key)) return null;
    return {url:url.replace(/\/$/,''),key};
  }

  async function update() {
    if (!state.client) return;
    const token=++sequence;
    try {
      const res=await state.client.auth.getUser();
      if (token!==sequence) return;
      if (res.error || !res.data?.user) {
        state.user=null;state.profile=null;state.classes=[];state.error='';state.loading=false;render();return;
      }
      const user=res.data.user;
      const result=await state.client.from('profiles')
        .select('display_name,role,status,class_code')
        .eq('id',user.id).maybeSingle();
      if (token!==sequence) return;
      state.user=user;
      state.profile=result.error?null:result.data;
      state.classes=[];
      if (state.profile?.role==='teacher' && state.profile?.status==='approved') {
        const classResult=await state.client.from('teacher_classes')
          .select('class_code').eq('teacher_id',user.id).order('class_code');
        if (token!==sequence) return;
        if (!classResult.error) state.classes=(classResult.data || []).map(x=>x.class_code);
      }
      state.error='';state.loading=false;render();
    } catch (_) {
      if (token!==sequence) return;
      state.loading=false;state.error='Unable to check account';render();
    }
  }

  async function init() {
    render();
    const creds=credentials();
    if (!creds) {state.loading=false;state.error='Supabase setup needed';render();return;}
    try {
      if (!window.supabase?.createClient) {
        await new Promise((resolve,reject) => {
          const script=document.createElement('script');
          script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
          script.async=true;script.onload=resolve;script.onerror=()=>reject(new Error('SDK unavailable'));
          document.head.append(script);
        });
      }
      state.client=window.supabase.createClient(creds.url,creds.key);
      state.client.auth.onAuthStateChange(event => {
        if (event==='SIGNED_OUT') {
          sequence++;
          state.user=null;state.profile=null;state.classes=[];
          state.loading=false;state.error='';render();
        } else if (['SIGNED_IN','TOKEN_REFRESHED','USER_UPDATED'].includes(event)) {
          setTimeout(update,0);
        }
      });
      await update();
      document.addEventListener('visibilitychange',()=>{if (!document.hidden) update();});
      window.addEventListener('pageshow', event=>{if(event.persisted)update();});
      window.L7HeaderRefresh=update;
    } catch (_) {state.loading=false;state.error='Connection unavailable';render();}
  }
  init();
})();
