/* L7 TEST – embedded Tilda account widget, v1. No secret/service_role keys here. */
(() => {
  'use strict';
  const root = document.getElementById('l7-accounts');
  if (!root || root.dataset.ready === '1') return;
  root.dataset.ready = '1';
  const config = window.L7_ACCOUNTS_CONFIG || {};
  const demo = config.demo === true;
  const classCode = '5A';
  const state = { client:null, profile:null, user:null, view:'login', busy:false,
    msg:'', error:false, recovery:false, teacherClasses:[], students:[], chosenClass:'5A',
    demoRole:null, demoName:'', demoStudents:[
      {id:'demo-a', display_name:'Student A',class_code:'5A',role:'student',status:'pending'},
      {id:'demo-b', display_name:'Student B',class_code:'5A',role:'student',status:'approved'},
      {id:'demo-c', display_name:'Student C',class_code:'5A',role:'student',status:'pending'}
    ]};
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tr = {'pending':'Pending approval','approved':'Approved','rejected':'Not approved'};
  function note(msg, error=false){state.msg=msg;state.error=error;render();}
  function statusMarkup(){return state.msg ? `<div class="l7-status show ${state.error?'error':'success'}" role="status">${esc(state.msg)}</div>`:'';}
  function input(label,name,type='text',autofill='',extra=''){
    return `<div class="l7-field"><label for="l7-${name}">${label}</label><input id="l7-${name}" name="${name}" type="${type}" ${autofill?`autocomplete="${autofill}"`:''} ${extra} required></div>`;
  }
  function formMarkup(){
    const tabs = `<div class="l7-nav"><button type="button" class="l7-btn ${state.view==='login'?'':'l7-ghost'}" data-action="view-login">Sign in</button><button type="button" class="l7-btn ${state.view==='signup'?'':'l7-ghost'}" data-action="view-signup">Create account</button></div>`;
    if(state.view==='reset') return `<div class="l7-card"><h3>Set a new password</h3><form data-form="reset">${input('New password','password','password','new-password','minlength="10"')}<button class="l7-btn">Save password</button></form></div>`;
    if(state.view==='recover') return `<div class="l7-card"><h3>Reset password</h3><p class="l7-muted">Enter the email address for your account.</p><form data-form="recover">${input('Email address','email','email','email')}<button class="l7-btn">Send reset link</button> <button type="button" class="l7-btn l7-ghost" data-action="view-login">Back</button></form></div>`;
    if(state.view==='signup') return `<div class="l7-card">${tabs}<h3>Join class 5A</h3><p class="l7-muted">Students register first. A teacher must approve the account. Teachers are added only by the site administrator.</p><form data-form="signup">${input('Your name','name','text','name','minlength="2" maxlength="70"')}${input('Email address','email','email','email')}${input('Password (at least 10 characters)','password','password','new-password','minlength="10"')}<p class="l7-note">This is a test system for a class of children. Do not create real student accounts until the school has arranged the required permissions and privacy information.</p><button class="l7-btn l7-wide" type="submit">Request account</button></form></div>`;
    return `<div class="l7-card">${tabs}<h3>Welcome back</h3><p class="l7-muted">Sign in with your registered account.</p><form data-form="login">${input('Email address','email','email','email')}${input('Password','password','password','current-password')}<button class="l7-btn l7-wide" type="submit">Sign in</button></form><p><button type="button" class="l7-btn l7-ghost" data-action="view-recover">Forgot password?</button></p></div>`;
  }
  function welcome(){
    const name = esc(state.profile?.display_name || state.demoName || 'Student');
    const role = state.profile?.role || state.demoRole;
    const status = state.profile?.status || (demo?'pending':'pending');
    if(role==='teacher'){
      const rows = state.students.map(s=>`<div class="l7-user-row"><div><strong>${esc(s.display_name)}</strong> <span class="l7-badge ${esc(s.status)}">${esc(tr[s.status]||s.status)}</span><div class="l7-muted">${esc(s.class_code)}</div></div><div class="l7-actions">${s.status!=='approved'?`<button class="l7-btn" data-action="approve" data-id="${esc(s.id)}">Approve</button>`:''}${s.status!=='rejected'?`<button class="l7-btn l7-danger" data-action="reject" data-id="${esc(s.id)}">Reject</button>`:''}</div></div>`).join('') || '<p class="l7-muted">No student requests yet.</p>';
      const options = state.teacherClasses.map(c=>`<option ${state.chosenClass===c?'selected':''} value="${esc(c)}">${esc(c)}</option>`).join('');
      return `<div class="l7-card"><div class="l7-top"><div><span class="l7-badge approved">Teacher Mode</span><h3>${name}</h3></div><button class="l7-btn l7-ghost" data-action="signout">Sign out</button></div><p>Student registration requests and access control.</p><p><label for="l7-class">Class</label><select id="l7-class" style="font:inherit;padding:10px;border:1px solid #cad5e4;border-radius:10px;min-width:120px">${options}</select></p><div class="l7-count">${state.students.length}</div><p class="l7-muted">Students and requests</p>${rows}<p class="l7-note">This page manages registration approval only. Test grades and secured exam access are the next stage.</p></div>`;
    }
    return `<div class="l7-card"><div class="l7-top"><div><span class="l7-badge ${esc(status)}">${esc(tr[status]||status)}</span><h3>Hello, ${name}!</h3></div><button class="l7-btn l7-ghost" data-action="signout">Sign out</button></div><p>Class: <strong>5A</strong></p>${status==='approved'?'<p>Your account is approved. Your personal test page will appear here when tests are connected to secure accounts.</p>':status==='rejected'?'<p>Please contact your teacher about this request.</p>':'<p>Your registration request has been sent. You can sign in, but your teacher must approve your account before access is granted.</p>'}<p class="l7-note">Existing public HTML tests are not yet protected by this login. Do not treat results from public test pages as authenticated grades.</p></div>`;
  }
  function render(){
    const missing = !demo && (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl||'') || !String(config.publishableKey||'').trim() || /REPLACE|YOUR_KEY/i.test(config.publishableKey||''));
    const header = `<div class="l7-head"><div class="l7-kicker">L7 TEST · English Learning Platform</div><h2>Accounts & Classroom</h2><p>Student registration · Teacher approval · Class 5A</p></div>`;
    let content = '';
    if (missing) content=`<div class="l7-card l7-setup"><h3>Supabase connection needed</h3><p>The account interface is ready, but a Supabase project has not been connected yet.</p><p>Fill in <code>supabaseUrl</code> and <code>publishableKey</code> in the Tilda installation code and run <code>setup.sql</code> first.</p></div>`;
    else if (!state.user && !state.demoRole) content=formMarkup();
    else content=welcome();
    const demobar = demo?'<div class="l7-demo">DEMO ONLY — no real accounts or passwords are created. <button class="l7-btn l7-ghost" data-action="demo-teacher">Teacher demo</button> <button class="l7-btn l7-ghost" data-action="demo-student">Student demo</button></div>':'';
    root.innerHTML=`<div class="l7-shell">${header}${demobar}${statusMarkup()}${content}<p class="l7-muted" style="font-size:12px;margin:18px 0 0">L7 TEST · Prototype of secure account management</p></div>`;
  }
  async function loadStudents(){
    if(demo){state.teacherClasses=['5A'];state.chosenClass='5A';state.students=[...state.demoStudents];return;}
    const res=await state.client.from('teacher_classes').select('class_code').eq('teacher_id',state.user.id);
    if(res.error)throw res.error;
    state.teacherClasses=res.data.map(x=>x.class_code);
    if(!state.teacherClasses.includes(state.chosenClass)) state.chosenClass=state.teacherClasses[0]||'';
    if(!state.chosenClass){state.students=[];return;}
    const q=await state.client.from('profiles').select('id,display_name,role,status,class_code,created_at')
      .eq('class_code',state.chosenClass).eq('role','student').order('display_name');
    if(q.error)throw q.error;state.students=q.data;
  }
  async function refreshUser(){
    if(demo)return render();
    const {data,error}=await state.client.auth.getUser();
    if(error || !data?.user){state.user=null;state.profile=null;return render();}
    state.user=data.user;
    const p=await state.client.from('profiles').select('id,display_name,role,status,class_code').eq('id',state.user.id).single();
    if(p.error){state.msg='Account created, but profile is not available yet. Try signing in again.';state.error=true;state.user=null;return render();}
    state.profile=p.data;
    if(p.data.role==='teacher' && p.data.status==='approved')await loadStudents();
    render();
  }
  async function action(a, button){
    if(a.startsWith('view-')){state.view=a.slice(5);state.msg='';return render();}
    if(a==='demo-teacher'){state.demoRole='teacher';state.demoName='Teacher Demo';state.msg='';await loadStudents();return render();}
    if(a==='demo-student'){state.demoRole='student';state.demoName='Student Demo';state.msg='';return render();}
    if(a==='signout'){
      if(demo){state.demoRole=null;state.profile=null;state.user=null;state.view='login';return render();}
      const r=await state.client.auth.signOut();if(r.error)return note(r.error.message,true);
      state.user=null;state.profile=null;state.view='login';return note('You have signed out.');
    }
    if(a==='approve'||a==='reject'){
      if(button.disabled)return;button.disabled=true;
      const id=button.dataset.id;const status=a==='approve'?'approved':'rejected';
      if(demo){const s=state.demoStudents.find(s=>s.id===id);if(s)s.status=status;await loadStudents();return render();}
      const r=await state.client.from('profiles').update({status}).eq('id',id).eq('role','student').eq('class_code',state.chosenClass).select('id,status');
      if(r.error || !r.data?.length)return note(r.error?.message||'Permission denied or account not found.',true);
      await loadStudents();return note('Student status updated.');
    }
  }
  root.addEventListener('click', async e=>{
    const target=e.target.closest('[data-action]');if(!target)return;
    try{await action(target.dataset.action,target)}catch(err){note(err.message||'Something went wrong.',true)}
  });
  root.addEventListener('change',async e=>{
    if(e.target.id!=='l7-class')return;
    state.chosenClass=e.target.value;
    try{await loadStudents();render()}catch(err){note(err.message,true)}
  });
  root.addEventListener('submit',async e=>{
    const form=e.target.closest('[data-form]');if(!form)return;e.preventDefault();
    if(state.busy)return;state.busy=true;
    const submit=form.querySelector('button[type=submit],button:not([type])');if(submit)submit.disabled=true;
    const data=new FormData(form);const email=String(data.get('email')||'').trim();const password=String(data.get('password')||'');
    try{
      if(demo){
        if(form.dataset.form==='signup')return note('Demo request received. This is not a real account.');
        return note('Use the Teacher demo or Student demo buttons above to explore.');
      }
      if(form.dataset.form==='signup'){
        const name=String(data.get('name')||'').trim();
        if(name.length<2)throw Error('Enter your name.');
        const r=await state.client.auth.signUp({email,password,options:{data:{display_name:name},emailRedirectTo:location.origin+location.pathname}});
        if(r.error)throw r.error;
        state.view='login';state.msg='Check your email to confirm your account (if confirmation is enabled). A teacher must then approve your request.';state.error=false;
        render();
        if(r.data?.session)await refreshUser();
      } else if(form.dataset.form==='login'){
        const r=await state.client.auth.signInWithPassword({email,password});if(r.error)throw r.error;
        state.msg='';await refreshUser();
      } else if(form.dataset.form==='recover'){
        const r=await state.client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});if(r.error)throw r.error;
        state.view='login';note('If the address is registered, a password reset email will be sent.');
      } else if(form.dataset.form==='reset'){
        if(password.length<10)throw Error('Password must be at least 10 characters.');
        const r=await state.client.auth.updateUser({password});if(r.error)throw r.error;
        state.view='login';note('Password updated.');
      }
    }catch(err){note(err.message||'Request failed.',true)}finally{state.busy=false;if(submit&&submit.isConnected)submit.disabled=false;}
  });
  async function init(){
    if(demo)return render();
    render();
    if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl||'') || !config.publishableKey || /REPLACE|YOUR_KEY/i.test(config.publishableKey))return;
    try{
      if(!window.supabase?.createClient){
        await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=resolve;s.onerror=()=>reject(new Error('Supabase library could not be loaded.'));document.head.appendChild(s)});
      }
      state.client=window.supabase.createClient(config.supabaseUrl,config.publishableKey);
      state.client.auth.onAuthStateChange((event)=>{
        if(event==='PASSWORD_RECOVERY'){state.view='reset';state.msg='';render();}
        if(event==='SIGNED_OUT'){state.user=null;state.profile=null;state.view='login';render();}
      });
      await refreshUser();
    }catch(err){note('Connection error: '+(err.message||'Unknown error'),true)}
  }
  init();
})();
