/* L7 TEST Accounts v3 — students: Username + Password, teachers: Email + Password.
   This is Tilda page code. NO secret key / password list appears in this file.
   Students are provisioned by their APPROVED 5A teacher through a verified
   Supabase Edge Function. Existing tests use the same Supabase session. */
(() => {
  'use strict';
  const root = document.getElementById('l7-accounts');
  if (!root || root.dataset.ready === '1') return;
  root.dataset.ready = '1';
  const cfg = window.L7_ACCOUNTS_CONFIG || {};
  const INTERNAL_DOMAIN = 'students.l7-test.online';
  const LOGIN_PATTERN = /^[a-z0-9][a-z0-9_-]{2,18}[a-z0-9]$/;
  const state = {
    client:null, user:null, profile:null, students:[], teacherClasses:[],
    view:'student', teacherForm:'login', busy:false, notice:'', isError:false,
    importRows:[], importErrors:[], resettingId:null, importStatus:'', importStatusError:false
  };
  const $ = s => root.querySelector(s);
  const esc = x => String(x ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalizedLogin = x => String(x || '').trim().toLowerCase();
  const emailFor = username => `${username}@${INTERNAL_DOMAIN}`;
  const statusLabel = {pending:'Pending',approved:'Approved',rejected:'Rejected'};

  function notice(text, error=false) {state.notice=String(text);state.isError=error;render();}
  function banner(){return state.notice ? `<div class="l7-status show ${state.isError?'error':'success'}" role="status">${esc(state.notice)}</div>` : '';}
  function field(label,name,type='text',autofill='',extra='') {
    return `<div class="l7-field"><label for="l7-${esc(name)}">${esc(label)}</label><input id="l7-${esc(name)}" name="${esc(name)}" type="${esc(type)}" ${autofill?`autocomplete="${esc(autofill)}"`:''} ${extra} required></div>`;
  }
  function tabs(){return `<div class="l7-nav l7-auth-tabs" role="group" aria-label="Account type">
      <button class="l7-btn ${state.view==='student'?'':'l7-ghost'}" data-act="tab-student" type="button">Student · Username</button>
      <button class="l7-btn ${state.view==='teacher'?'':'l7-ghost'}" data-act="tab-teacher" type="button">Teacher · Email</button>
    </div>`;}
  function signinScreen(){
    if(state.view==='teacher'){
      const f = state.teacherForm;
      let content;
      if(f==='recover') content = `<h3>Teacher password recovery</h3><p class="l7-muted">A reset link will be sent to your teacher email.</p><form data-form="teacher-recover">${field('Teacher email','email','email','email')}<button class="l7-btn">Send reset link</button></form>`;
      else if(f==='signup') content=`<h3>Create a teacher email account</h3><p class="l7-muted">New accounts start as students/pending. Only the site administrator can grant a teacher role.</p><form data-form="teacher-signup">${field('Your name','name','text','name','minlength="2" maxlength="70"')}${field('Email','email','email','email')}${field('Password (12+ characters)','password','password','new-password','minlength="12"')}<button class="l7-btn l7-wide">Request email account</button></form>`;
      else if(f==='reset') content=`<h3>Set a new teacher password</h3><form data-form="teacher-reset">${field('New password (12+ characters)','password','password','new-password','minlength="12"')}<button class="l7-btn">Save password</button></form>`;
      else content=`<h3>Teacher sign in</h3><p class="l7-muted">Teachers keep their existing email accounts.</p><form data-form="teacher-login">${field('Email address','email','email','email')}${field('Password','password','password','current-password')}<button class="l7-btn l7-wide">Sign in</button></form>`;
      const options=`<div class="l7-row l7-links"><button type="button" class="l7-text-btn" data-act="teacher-login">Sign in</button><button type="button" class="l7-text-btn" data-act="teacher-recover">Forgot password?</button><button type="button" class="l7-text-btn" data-act="teacher-signup">Create account</button></div>`;
      return `<div class="l7-card">${tabs()}${content}${options}</div>`;
    }
    return `<div class="l7-card">${tabs()}<h3>Student sign in</h3><p class="l7-muted">Use the personal username and password given by your teacher. No email is needed.</p>
      <form data-form="student-login">${field('Username','username','text','username','autocapitalize="none" spellcheck="false" minlength="4" maxlength="20" placeholder="5a-rizwan"')}${field('Password','password','password','current-password','minlength="12"')}
      <button class="l7-btn l7-wide">Sign in</button></form><p class="l7-note">Forgot your password? Ask your teacher to reset it. Never share your password with classmates.</p></div>`;
  }
  function teacherScreen(){
    const pending = state.students.filter(s=>s.status==='pending');
    const lines=state.students.map(s=>`<div class="l7-user-row">
      <div><strong>${esc(s.display_name)}</strong> <span class="l7-badge ${esc(s.status)}">${esc(statusLabel[s.status]||s.status)}</span>
        <div class="l7-muted"><code>${esc(s.username||'Email account')}</code> · ${esc(s.class_code)}</div></div>
      <div class="l7-actions">${s.status!=='approved'?`<button type="button" class="l7-btn" data-act="approve" data-id="${esc(s.id)}">Approve</button>`:''}
        ${s.status!=='rejected'?`<button type="button" class="l7-btn l7-danger" data-act="reject" data-id="${esc(s.id)}">Reject</button>`:''}
        ${s.username?`<button type="button" class="l7-btn l7-ghost" data-act="reset" data-id="${esc(s.id)}">Reset password</button>`:''}
      </div></div>`).join('') || '<p class="l7-muted">No student accounts yet.</p>';
    const preview = state.importRows.length ? `<div class="l7-preview"><p><strong>${state.importRows.length} students ready to create</strong> (passwords hidden)</p>
      <div class="l7-preview-list">${state.importRows.map(s=>`<div>${esc(s.name)} · <code>${esc(s.username)}</code></div>`).join('')}</div>
      ${state.importStatus?`<div class="l7-import-message ${state.importStatusError?'error':'working'}" role="status" aria-live="polite">${esc(state.importStatus)}</div>`:''}
      <button type="button" class="l7-btn" data-act="create-batch" ${state.busy?'disabled':''}>${state.busy?'Creating accounts…':'Create these accounts'}</button>
      <button type="button" class="l7-btn l7-ghost" data-act="clear-batch" ${state.busy?'disabled':''}>Cancel</button></div>` : '';
    const resetStudent=state.students.find(s=>s.id===state.resettingId);
    const resetBlock=resetStudent?`<div class="l7-reset-panel"><h3>New password for ${esc(resetStudent.display_name)}</h3>
        <form data-form="reset-student">${field('New password (12+ characters)','newPassword','password','new-password','minlength="12"')}<button class="l7-btn">Save new password</button>
        <button type="button" class="l7-btn l7-ghost" data-act="cancel-reset">Cancel</button></form>
        <p class="l7-muted">Write the password down securely before submitting: it cannot be read back from Supabase.</p></div>`:'';
    return `<div class="l7-card"><div class="l7-top"><div><span class="l7-badge approved">Approved teacher · 5A</span><h3>${esc(state.profile?.display_name||'Teacher')}</h3></div>
      <button class="l7-btn l7-ghost" data-act="signout" type="button">Sign out</button></div>
      <div class="l7-section"><h3>Create student accounts</h3><p class="l7-muted">Import the private CSV given by L7 TEST. New students will be Pending until you approve them.</p>
      <label for="l7-csv">Choose the private CSV file</label><input id="l7-csv" type="file" accept=".csv,text/csv,text/plain">
      <p class="l7-muted l7-small">Required columns: name, username, password. The passwords are sent only to the Supabase student administration function, never to GitHub.</p>${preview}</div>
      ${resetBlock}
      <div class="l7-section"><div class="l7-top"><h3>Students (${state.students.length})</h3>${pending.length?`<button type="button" class="l7-btn l7-ghost" data-act="approve-all">Approve all pending (${pending.length})</button>`:''}</div>
        <p class="l7-muted">Newly created accounts do not get test access until Approved.</p>${lines}</div>
      </div>`;
  }
  function studentScreen(){
    const p=state.profile||{};
    return `<div class="l7-card"><div class="l7-top"><div><span class="l7-badge ${esc(p.status)}">${esc(statusLabel[p.status]||p.status||'Student')}</span><h3>Hello, ${esc(p.display_name||'Student')}!</h3></div>
      <button type="button" class="l7-btn l7-ghost" data-act="signout">Sign out</button></div>
      <p>Class: <strong>${esc(p.class_code||'5A')}</strong>${p.username?` · Username: <strong>${esc(p.username)}</strong>`:''}</p>
      ${p.status==='approved'?'<p>Your account is approved. You may now open Unit 0.1, 0.2 and 0.3 from the class page.</p>':p.status==='pending'?'<p>Your account has been created. Please wait for your teacher to approve it before starting a test.</p>':'<p>Your account is not approved. Contact your teacher.</p>'}</div>`;
  }
  function render(){
    const setup = !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(String(cfg.supabaseUrl||'')) || !String(cfg.publishableKey||'').trim() || /REPLACE|YOUR_KEY/i.test(String(cfg.publishableKey||''));
    const content = setup?`<div class="l7-card l7-setup">The existing Supabase URL and publishable key must remain in the Tilda T123 configuration.</div>`:
      !state.user?signinScreen():state.profile?.role==='teacher'?
      ((state.profile?.status==='approved' && state.teacherClasses.includes('5A'))
       ?teacherScreen()
       :`<div class="l7-card"><h3>Teacher account</h3><p class="l7-muted">Only an approved teacher assigned to class 5A can create or approve students. Ask the site administrator to check your teacher account.</p><button class="l7-btn l7-ghost" data-act="signout" type="button">Sign out</button></div>`)
      :studentScreen();
    root.innerHTML=`<div class="l7-shell"><div class="l7-head"><div class="l7-kicker">L7 TEST · Accounts</div><h2>Welcome to L7 TEST</h2><p>Class 5A · Secure student accounts</p></div>${banner()}${content}</div>`;
  }
  function parseCSV(text){
    const table=[];let row=[],cell='',inside=false;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(inside){if(c==='"' && text[i+1]==='"'){cell+='"';i++;}else if(c==='"')inside=false;else cell+=c;}
      else if(c==='"')inside=true;
      else if(c===','){row.push(cell);cell='';}
      else if(c==='\n'){row.push(cell);table.push(row);row=[];cell='';}
      else if(c!=='\r')cell+=c;
    }
    if(inside) throw new Error('CSV has an unclosed quote.');
    if(cell||row.length){row.push(cell);table.push(row);}
    if(!table.length) throw new Error('CSV is empty.');
    const keys=table.shift().map(k=>k.replace(/^\uFEFF/,'').trim().toLowerCase());
    const ix={name:keys.indexOf('name'),username:keys.indexOf('username'),password:keys.indexOf('password')};
    if(Object.values(ix).some(n=>n<0))throw new Error('CSV needs: name,username,password columns.');
    const entries=table.filter(r=>r.some(v=>v.trim())).map(r=>({name:(r[ix.name]||'').trim(),username:normalizedLogin(r[ix.username]),password:r[ix.password]||''}));
    if(!entries.length||entries.length>15)throw new Error('Please import 1–15 students at a time.');
    if(entries.some(r=>r.name.length<2||r.name.length>70||!LOGIN_PATTERN.test(r.username)||r.password.length<12||r.password.length>72))
      throw new Error('Check student names, usernames (4–20) and passwords (12+).');
    if(new Set(entries.map(r=>r.username)).size!==entries.length)throw new Error('Duplicate username in CSV.');
    return entries;
  }
  async function getStudents(){
    if(!state.client||!state.user||state.profile?.role!=='teacher')return;
    const c=await state.client.from('teacher_classes').select('class_code').eq('teacher_id',state.user.id);
    if(c.error)throw c.error;
    state.teacherClasses=(c.data||[]).map(x=>x.class_code);
    if(!state.teacherClasses.includes('5A')){state.students=[];return;}
    const q=await state.client.from('profiles').select('id,display_name,role,status,class_code,username')
      .eq('class_code','5A').eq('role','student').order('display_name');
    if(q.error)throw q.error;
    state.students=q.data||[];
  }
  async function refreshUser(){
    const r=await state.client.auth.getUser();
    if(r.error || !r.data?.user){state.user=null;state.profile=null;render();return;}
    state.user=r.data.user;
    state.teacherClasses=[];
    state.students=[];
    const p=await state.client.from('profiles').select('id,display_name,role,status,class_code,username')
      .eq('id',state.user.id).single();
    if(p.error){state.user=null;state.profile=null;notice('Profile is not available. Please sign in again.',true);return;}
    state.profile=p.data;
    if(p.data.role==='teacher' && p.data.status==='approved') await getStudents();
    render();
  }
  async function callTeacher(payload){
    if(!state.client||state.profile?.role!=='teacher')throw new Error('Teacher account required.');
    const session=await state.client.auth.getSession();
    if(!session.data?.session)throw new Error('Teacher session expired. Please sign in again.');
    const r=await state.client.functions.invoke('l7-student-admin-v2',{body:payload});
    if(r.error){
      const ctx=r.error.context;
      const code=Number(ctx?.status||0);
      let reason='The student administration request failed.';
      if(code===404) reason='HTTP 404: Supabase Edge Function l7-student-admin-v2 was not found. Check that it was deployed.';
      else if(code===401) reason='HTTP 401: Teacher session was rejected. Sign out and sign in again; check Verify JWT with legacy secret = OFF.';
      else if(code===403) reason='HTTP 403: Teacher permission or the website origin was rejected. Check teacher approval and Edge Function settings.';
      else if(code>=500) reason=`HTTP ${code}: Server error. Check Supabase Edge Function logs.`;
      else if(!code) reason='Network/CORS error: cannot reach Supabase Edge Function. Check its deployment and browser connection.';
      try {
        const detail=await ctx?.clone?.().json?.();
        if(detail?.error)reason=`${code?'HTTP '+code+': ':''}${detail.error}`;
      } catch(_){}
      throw new Error(reason);
    }
    if(r.data?.error)throw new Error(r.data.error);
    if(r.data?.ok!==true)throw new Error('Unexpected response from the student administration function. Check Supabase logs.');
    return r.data;
  }
  async function doAction(action,button){
    if(action==='tab-student'||action==='tab-teacher'){
      state.view=action.split('-')[1];state.notice='';state.teacherForm='login';render();return;
    }
    if(action.startsWith('teacher-')){state.teacherForm=action.slice(8);state.notice='';render();return;}
    if(action==='signout'){
      const r=await state.client.auth.signOut();if(r.error)throw r.error;
      state.user=null;state.profile=null;state.students=[];state.teacherClasses=[];state.view='student';state.importRows=[];
      notice('Signed out successfully.');return;
    }
    if(action==='clear-batch'){state.importRows=[];state.importStatus='';notice('Student import cancelled.');return;}
    if(action==='cancel-reset'){state.resettingId=null;render();return;}
    if(action==='reset'){state.resettingId=button.dataset.id;state.notice='';render();return;}
    if(action==='create-batch'){
      if(state.busy)return;
      if(!state.importRows.length){notice('Please select the CSV file first.',true);return;}
      state.busy=true;
      state.importStatus='Creating accounts… Do not click again or close the page.';
      state.importStatusError=false;
      render();
      try{
        const r=await callTeacher({action:'createStudents',students:state.importRows});
        state.importRows=[];
        state.importStatus='';
        let refreshWarning='';
        try { await getStudents(); }
        catch (_) { refreshWarning=' The accounts were processed, but the Students list could not refresh. Reload before attempting any further imports.'; }
        const failures=(r.results||[]).filter(x=>!x.ok).map(x=>`${x.username}: ${x.error}`).join('\n');
        notice(`Created: ${r.created||0}. Failed: ${r.failed||0}. ${failures}${refreshWarning}`,(r.failed||0)>0||!!refreshWarning);
        root.querySelector('.l7-status')?.scrollIntoView({block:'center',behavior:'smooth'});
      }catch(e){
        state.importStatus=`${e?.message||'Request failed.'} Check the Students list before clicking again, in case the server created the account.`;
        state.importStatusError=true;
      } finally {
        state.busy=false;
        if(state.importRows.length){
          render();
          root.querySelector('.l7-import-message')?.scrollIntoView({block:'center',behavior:'smooth'});
        }
      }
      return;
    }
    if(action==='approve'||action==='reject'||action==='approve-all'){
      const next=action==='reject'?'rejected':'approved';
      const ids=action==='approve-all'?state.students.filter(x=>x.status==='pending').map(x=>x.id):[button.dataset.id];
      if(!ids.length)return;
      if(action==='approve-all' && !window.confirm(`Approve ${ids.length} pending student accounts?`))return;
      const q=await state.client.from('profiles').update({status:next}).in('id',ids).eq('role','student').eq('class_code','5A').select('id');
      if(q.error || (q.data||[]).length!==ids.length)throw new Error(q.error?.message||'Status was not updated for all students.');
      await getStudents();notice('Student access updated.');return;
    }
  }
  root.addEventListener('click',async event=>{
    const btn=event.target.closest('[data-act]');if(!btn||!root.contains(btn))return;
    if(btn.disabled)return;
    try{await doAction(btn.dataset.act,btn);}catch(e){notice(e?.message||'Request failed.',true);}
  });
  root.addEventListener('change',async event=>{
    if(event.target.id!=='l7-csv')return;
    const file=event.target.files?.[0];if(!file)return;
    try{
      if(file.size>15000)throw new Error('CSV file is too large.');
      state.importRows=parseCSV(await file.text());
      state.importStatus='';state.importStatusError=false;
      state.notice='Review the names and usernames below before creating accounts.';state.isError=false;render();
    }catch(e){state.importRows=[];notice(e.message,true);}
  });
  root.addEventListener('submit',async event=>{
    const form=event.target.closest('[data-form]');if(!form)return;
    event.preventDefault();if(state.busy)return;
    state.busy=true;
    const btn=form.querySelector('[type="submit"],button:not([type])');if(btn)btn.disabled=true;
    const data=new FormData(form);
    const email=String(data.get('email')||'').trim();
    const pw=String(data.get('password')||'');
    try{
      let r;
      switch(form.dataset.form){
        case 'student-login': {
          const username=normalizedLogin(data.get('username'));
          if(!LOGIN_PATTERN.test(username))throw new Error('Username format is incorrect.');
          r=await state.client.auth.signInWithPassword({email:emailFor(username),password:pw});
          if(r.error)throw new Error('Incorrect username or password.');
          state.view='student';state.notice='';await refreshUser();break;
        }
        case 'teacher-login': {
          r=await state.client.auth.signInWithPassword({email,password:pw});
          if(r.error)throw r.error;
          state.view='teacher';state.notice='';await refreshUser();break;
        }
        case 'teacher-signup': {
          const name=String(data.get('name')||'').trim();
          if(name.length<2)throw new Error('Enter your name.');
          r=await state.client.auth.signUp({email,password:pw,options:{data:{display_name:name},emailRedirectTo:location.origin+location.pathname}});
          if(r.error)throw r.error;
          state.teacherForm='login';notice('Check your teacher email. A site administrator must assign and approve the teacher role.');break;
        }
        case 'teacher-recover': {
          r=await state.client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
          if(r.error)throw r.error;
          state.teacherForm='login';notice('If the email exists, a password reset link will be sent.');break;
        }
        case 'teacher-reset': {
          if(pw.length<12)throw new Error('Password must have at least 12 characters.');
          r=await state.client.auth.updateUser({password:pw});if(r.error)throw r.error;
          state.teacherForm='login';notice('Password updated.');break;
        }
        case 'reset-student': {
          const newPassword=String(data.get('newPassword')||'');
          if(newPassword.length<12)throw new Error('Password needs 12 characters.');
          await callTeacher({action:'resetStudentPassword',studentId:state.resettingId,password:newPassword});
          state.resettingId=null;notice('Password changed. Give the NEW password privately to the student.');break;
        }
      }
    }catch(e){notice(e?.message||'Request failed.',true)}
    finally{state.busy=false;if(btn&&btn.isConnected)btn.disabled=false;}
  });
  async function init(){
    render();
    if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(String(cfg.supabaseUrl||'')) || !cfg.publishableKey)return;
    try {
      if(!window.supabase?.createClient)await new Promise((resolve,reject)=>{
        const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        s.onload=resolve;s.onerror=()=>reject(new Error('Cannot load Supabase SDK.'));document.head.appendChild(s);
      });
      state.client=window.supabase.createClient(cfg.supabaseUrl,cfg.publishableKey);
      state.client.auth.onAuthStateChange(event=>{
        if(event==='PASSWORD_RECOVERY'){state.view='teacher';state.teacherForm='reset';render();}
        if(event==='SIGNED_OUT'){state.user=null;state.profile=null;state.students=[];state.teacherClasses=[];render();}
      });
      await refreshUser();
    }catch(e){notice(`Connection problem: ${e.message}`,true);}
  }
  init();
})();
