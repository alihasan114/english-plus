/* L7 TEST · 5A · Unit 0.2 · Tilda same-origin online quiz · 2026-11-26 */
(() => {
'use strict';
const host = document.getElementById('l7-unit-0-2-online');
if (!host || host.dataset.l7Online02 === '1') return;
host.dataset.l7Online02 = '1';
const shadow = host.attachShadow({mode:'open'});
shadow.innerHTML = '<style>' + "\n:host{--navy:#122744;--deep:#0d1f37;--blue:#2862d6;--sky:#eaf2ff;--teal:#02ae9f;--ink:#172b46;--muted:#5f7189;--border:#dbe5f2;--bg:#edf3fb;--card:#fff;--danger:#d14c4e;--radius:20px}\n*{box-sizing:border-box}\n:host{display:block;min-height:70vh;isolation:isolate}\n.l7-contained{margin:0;min-height:100%;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,\"Segoe UI\",Arial,sans-serif;background:linear-gradient(144deg,#e2edff,#f4f7fb 45%,#e7f7f7);-webkit-font-smoothing:antialiased}\nbutton{font:inherit}\nbutton:focus-visible{outline:3px solid #00b9a8;outline-offset:3px}\n#app{min-height:100dvh;display:flex;flex-direction:column}\n.topbar{background:var(--navy);color:white;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px max(24px,calc((100vw - 1550px)/2));min-height:70px}\n.brand{display:flex;align-items:center;gap:12px;white-space:nowrap}\n.brand-logo{display:grid;place-items:center;background:#2b67d0;color:#fff;border-radius:12px;font-size:21px;font-weight:950;letter-spacing:-1px;width:52px;height:43px}\n.brand-name{font-size:20px;letter-spacing:.01em;font-weight:850}\n.brand-sub{font-size:11px;letter-spacing:.12em;color:#b8c9e2;text-transform:uppercase;margin-top:1px}\n.bar-right{display:flex;align-items:center;gap:18px}\n.bar-meta{color:#d6e1f2;font-size:13px;white-space:nowrap}\n.full-btn{border:1px solid #6a85ae;border-radius:10px;background:#1c3b62;color:white;display:flex;align-items:center;gap:8px;padding:10px 12px;font-size:13px;font-weight:800;cursor:pointer}\n.full-btn:hover{background:#2d517c}\n.full-btn svg{width:16px;height:16px}\n.shell{width:min(1500px,100%);margin:0 auto;padding:19px 24px 14px;flex:1;display:flex;flex-direction:column;min-height:0}\n.view{display:none;flex:1;min-height:0;flex-direction:column}\n.view.active{display:flex}\n.hero{width:min(980px,100%);margin:auto;padding:42px 12px;text-align:center}\n.eyebrow{display:inline-flex;padding:7px 15px;border-radius:100px;background:#dce9ff;color:#275fbd;font-size:13px;letter-spacing:.1em;text-transform:uppercase;font-weight:900}\nh1{font-size:clamp(40px,5.6vw,75px);line-height:1.08;letter-spacing:-.045em;margin:20px 0 13px;color:var(--navy)}\n.hero-sub{font-size:clamp(17px,2vw,24px);color:#4f6582;max-width:800px;margin:0 auto 25px;line-height:1.48}\n.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:25px auto;max-width:860px}\n.summary-card{background:white;border:1px solid var(--border);padding:18px 10px;border-radius:16px;box-shadow:0 3px 14px #172f5610}\n.summary-num{font-size:35px;font-weight:900;color:#285eb6;line-height:1.1}\n.summary-desc{font-size:14px;color:var(--muted);font-weight:750;margin-top:6px}\n.schedule{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin:10px 0 27px}\n.schedule span{background:#e8effa;color:#274978;border:1px solid #cbd9ed;padding:8px 12px;border-radius:100px;font-size:13px;font-weight:750}\n.primary{background:var(--blue);color:white;border:0;border-radius:13px;padding:15px 27px;font-size:18px;font-weight:850;box-shadow:0 7px 18px #2760d32b;cursor:pointer}\n.primary:hover{background:#1e51b5}\n.secondary{background:white;color:#224774;border:1px solid #c7d8f2;border-radius:12px;padding:12px 20px;font-size:15px;font-weight:800;cursor:pointer}\n.secondary:hover{background:#f0f6ff}\n.mini-note{font-size:12px;color:#74849a;margin-top:17px}\n.block-head{display:flex;align-items:center;justify-content:space-between;gap:20px;margin:0 0 12px}\n.block-heading{min-width:0}\n.block-number{font-size:12px;color:#2863c5;font-weight:900;text-transform:uppercase;letter-spacing:.11em}\n.block-title{font-size:clamp(22px,2.8vw,37px);font-weight:900;line-height:1.1;letter-spacing:-.03em;margin:4px 0 0;color:var(--navy)}\n.counter{display:flex;align-items:center;gap:14px;flex-shrink:0}\n.answered{color:#6a7f9b;font-size:14px;font-weight:700;white-space:nowrap}\n.timer{font-size:clamp(32px,4vw,51px);line-height:1;font-variant-numeric:tabular-nums;font-weight:950;letter-spacing:-.04em;color:#164a9b;min-width:100px;text-align:right}\n.timer.urgent{color:var(--danger)}\n.timer-label{font-size:11px;color:var(--muted);letter-spacing:.05em;text-transform:uppercase;text-align:right;margin-top:2px;font-weight:850}\n.progress{height:9px;display:flex;background:#dce6f5;border-radius:999px;gap:3px;overflow:hidden;margin-bottom:12px}\n.progress-piece{flex:1;background:#d0dfef;transition:background .2s}\n.progress-piece.past{background:var(--teal)}\n.progress-piece.now{background:#3e76e0}\n.time-track{height:5px;background:#dbe6f4;border-radius:99px;overflow:hidden;margin:-4px 0 10px}\n.time-fill{height:100%;width:100%;background:#0da997;transition:width .12s linear}\n.time-fill.urgent{background:#e35e5d}\n.instructions{background:#e0eafe;color:#20497c;border-radius:11px;padding:9px 14px;font-weight:700;font-size:clamp(14px,1.2vw,17px);margin-bottom:11px}\n.instructions b{color:#10429d}\n.example{margin:0 0 10px;font-size:14px;color:#657991;font-weight:600}\n.example strong{color:#183b73}\n.choice-legend{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin-bottom:13px}\n.legend-choice{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid #cbd9ec;border-radius:10px;padding:7px 11px;font-size:clamp(14px,1.35vw,19px);font-weight:750;color:#1d385a}\n.legend-choice strong{background:#e1edff;color:#1d54b2;display:grid;place-items:center;border-radius:7px;min-width:30px;height:29px;font-size:15px}\n.cards-wrap{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:0 2px 5px;scrollbar-width:thin;scrollbar-color:#b9cde8 transparent}\n.question-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-content:start}\n.question-grid.grid-9{grid-template-columns:repeat(3,minmax(0,1fr))}\n.question-grid.grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}\n.card{background:var(--card);border:1.5px solid #d5e2f3;border-radius:15px;min-width:0;display:flex;flex-direction:column;justify-content:space-between;padding:13px 16px 12px;gap:8px;box-shadow:0 2px 8px #15325e09;transition:border-color .14s,background .14s}\n.card:has(.pick.active){border-color:#6799ed;background:#f9fcff}\n.card-top{display:flex;align-items:flex-start;gap:10px;min-width:0}\n.n-circle{display:grid;place-items:center;flex-shrink:0;width:34px;height:34px;background:#e7efff;color:#235cc3;border-radius:10px;font-weight:900;font-size:16px}\n.q-text{font-size:clamp(17px,1.48vw,23px);line-height:1.32;font-weight:720;letter-spacing:-.015em;color:#1e2c43;min-width:0;overflow-wrap:anywhere;padding-top:2px}\n.blank{color:#1b67be;font-weight:950;letter-spacing:.03em}\n.picks{display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap}\n.pick{border:1.5px solid #cddcf0;background:#f5f8ff;color:#244a84;font-size:16px;font-weight:900;border-radius:9px;min-width:40px;height:36px;padding:3px 11px;cursor:pointer;transition:background .12s,transform .1s}\n.pick:hover{background:#e8f0ff;transform:translateY(-1px)}\n.pick.active{background:#235fca;color:white;border-color:#235fca}\n.slot{display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;width:28px;height:27px;line-height:1;background:#e6f4ef;color:#117a6a;border:1px dashed #60bbac;border-radius:6px;font-size:15px;font-weight:900;margin:0 2px}\n.slot.selected{background:#0b9f91;color:white;border-color:#0b9f91}\n.footer-actions{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:13px;flex-shrink:0}\n.footer-info{font-size:12px;color:#60758f;max-width:65%}\n.next{font-size:16px;padding:12px 23px;white-space:nowrap}\n.result-shell{margin:auto;width:min(1020px,100%);padding:20px 0 35px}\n.result-card{background:#fff;border:1px solid var(--border);border-radius:22px;padding:clamp(24px,4vw,42px);box-shadow:0 12px 40px #264e8317;text-align:center}\n.result-label{color:#1b66b2;text-transform:uppercase;letter-spacing:.12em;font-size:13px;font-weight:900}\n.result-title{font-size:clamp(27px,4vw,44px);margin:9px 0;color:var(--navy)}\n.score{font-size:clamp(58px,8vw,96px);font-weight:950;line-height:1.05;color:#1e5db7;letter-spacing:-.07em}\n.score small{font-size:.5em;color:#8798b2;letter-spacing:-.04em}\n.grade-line{font-weight:850;color:#345a89;margin-top:12px}\n.result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:21px 0 18px}\n.result-mini{background:#f1f6fc;border:1px solid #deebf9;border-radius:12px;padding:13px 5px}\n.result-mini b{font-size:23px;color:#153c7a;display:block}\n.result-mini span{font-size:13px;color:#526782;font-weight:700}\n.review{max-height:42vh;overflow:auto;text-align:left;margin-top:20px;border-top:1px solid var(--border);padding-top:12px}\n.review-item{padding:10px 6px;border-bottom:1px solid #e6edf8;font-size:15px}\n.review-item .right{color:#11735b;font-weight:900}\n.review-item .wrong{color:#b74951;font-weight:900}\n.review-item small{display:block;margin:4px 0 0 31px;color:#52617a}\n.check-circle{width:22px;display:inline-grid;place-items:center;margin-right:7px}\n.hidden{display:none!important}\n/* Compact 8-question negative-sentence block for classroom screens. */\n.mode-position .block-head{margin-bottom:8px}\n.mode-position .instructions{padding:7px 12px;margin-bottom:6px}\n.mode-position .example{margin:0 0 8px;font-size:13px}\n.mode-position #legend{display:none}\n.mode-position .question-grid{gap:8px}\n.mode-position .card{padding:9px 12px 8px;gap:4px}\n.mode-position .card-top{gap:8px}\n.mode-position .n-circle{width:30px;height:30px;font-size:14px}\n.mode-position .q-text{font-size:clamp(17px,1.45vw,21px);line-height:1.25}\n.mode-position .slot{width:25px;height:25px;font-size:14px}\n.mode-position .pick{height:30px;min-width:35px;padding:2px 8px;font-size:15px}\n.mode-position .footer-actions{margin-top:8px}\n@media (min-height:850px){.card{padding:17px 18px 16px;gap:12px}.q-text{font-size:clamp(19px,1.8vw,27px)}.pick{height:43px;min-width:46px;font-size:17px}.question-grid{gap:13px}}\n@media (max-height:720px) and (min-width:900px){.shell{padding-top:12px}.block-head{margin-bottom:8px}.progress{margin-bottom:9px}.instructions{margin-bottom:9px}.choice-legend{margin-bottom:9px}.card{padding:10px 13px 9px;gap:6px}.q-text{font-size:clamp(17px,1.55vw,22px)}.pick{height:33px;min-width:38px}.footer-actions{margin-top:10px}}\n@media (max-width:900px){.question-grid.grid-9,.question-grid.grid-3{grid-template-columns:repeat(2,minmax(0,1fr))}.bar-meta{display:none}.topbar{padding:12px 18px}.shell{padding:15px 15px 12px}.q-text{font-size:18px}}\n@media (max-width:650px){.topbar{padding:10px 13px;min-height:60px}.brand-logo{width:41px;height:38px;font-size:18px}.brand-name{font-size:18px}.brand-sub{font-size:9px}.full-btn{padding:8px 9px;font-size:0;gap:0}.full-btn svg{width:19px;height:19px}.shell{padding:12px 12px 10px}.hero{padding:24px 4px}.summary{gap:7px}.summary-card{padding:12px 6px}.summary-num{font-size:26px}.summary-desc{font-size:11px}.block-head{align-items:flex-start;gap:9px;margin-bottom:10px}.block-title{font-size:25px}.counter{gap:7px}.answered{display:none}.timer{min-width:62px;font-size:34px}.question-grid,.question-grid.grid-9,.question-grid.grid-3{grid-template-columns:1fr}.card{min-height:94px;gap:9px;padding:12px 13px}.q-text{font-size:19px}.choice-legend{gap:6px}.legend-choice{padding:5px 8px;font-size:14px}.legend-choice strong{min-width:24px;height:24px;font-size:13px}.footer-info{font-size:11px}.next{padding:11px 13px;font-size:14px}.result-grid{gap:5px}.result-mini b{font-size:18px}.result-mini span{font-size:11px}}\n@media print{.topbar,.full-btn,.footer-actions,.progress,.time-track,.intro,button{display:none!important}.view{display:none!important}#results.view{display:block!important}.result-card{border:0;box-shadow:none}.review{max-height:none;overflow:visible}}\n\n:host(:fullscreen){width:100vw;height:100dvh;overflow:auto;background:#edf3fb}\n:host(:fullscreen) .l7-contained{height:100dvh;min-height:100dvh}\n.account-gate{display:flex;align-items:center;justify-content:center;flex:1;padding:50px 14px}\n.account-panel{max-width:760px;width:100%;background:#fff;border:1px solid #d6e3f4;border-radius:22px;padding:clamp(24px,4vw,45px);box-shadow:0 10px 36px #21437716;text-align:center}\n.account-panel h2{font-size:clamp(25px,3.5vw,39px);color:#122744;margin:12px 0}\n.account-panel p{font-size:18px;line-height:1.5;color:#536781}\n.account-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:20px}\n.account-link{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}\n.account-err{margin-top:12px;color:#a9343c;background:#fff4f3;border:1px solid #f2c9cc;border-radius:10px;padding:12px;font-size:14px;line-height:1.45;text-align:left;white-space:pre-wrap}\n.student-badge{font-size:13px;font-weight:800;color:#cce8f5;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.save-status{margin:20px auto 12px;padding:14px 17px;border-radius:12px;background:#edf4ff;border:1px solid #cfe0f9;color:#264a81;font-size:16px;line-height:1.5;max-width:680px}\n.save-status.good{background:#eaf7f1;color:#14614b;border-color:#acdccc}\n.save-status.bad{background:#fff2f2;color:#982e39;border-color:#edb5be}\n.result-card .primary:disabled{opacity:.45;cursor:not-allowed}\n@media(max-width:650px){.student-badge{display:none}.account-gate{padding:16px 4px}.account-panel p{font-size:16px}}\n" + '</style>' + "<div id=\"app\" class=\"l7-contained\">\n  <header class=\"topbar\">\n    <div class=\"brand\"><div class=\"brand-logo\" aria-label=\"L7\">L7</div><div><div class=\"brand-name\">L7 TEST</div><div class=\"brand-sub\">5A · English · Unit 0.2</div></div></div>\n    <div class=\"bar-right\"><div class=\"bar-meta\" id=\"studentBadge\">Grammar practice · 30 questions</div><button class=\"full-btn\" id=\"fullscreen\" type=\"button\" title=\"Toggle fullscreen\" aria-label=\"Toggle fullscreen\"><svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2.3\"><path d=\"M8 3H4a1 1 0 0 0-1 1v4M16 3h4a1 1 0 0 1 1 1v4M3 16v4a1 1 0 0 0 1 1h4m13-5v4a1 1 0 0 1-1 1h-4\"/></svg>Fullscreen</button></div>\n  </header>\n  <main class=\"shell\">\n    <section id=\"authGate\" class=\"view active\" aria-label=\"Account check\">\n      <div class=\"account-gate\"><div class=\"account-panel\">\n        <span class=\"eyebrow\">5A · Student account</span>\n        <h2 id=\"authHeading\">Checking your account…</h2>\n        <p id=\"authText\">Checking your L7 TEST account on this site.</p>\n        <div id=\"authError\" class=\"account-err hidden\"></div>\n        <div class=\"account-actions\"><a class=\"primary account-link\" href=\"/5a-accounts\">My account</a><button class=\"secondary\" id=\"checkAgain\" type=\"button\">Check again</button></div>\n      </div></div>\n    </section>\n    <section id=\"welcome\" class=\"view\">\n      <div class=\"hero\"><span class=\"eyebrow\">Class 5A · Exercise 0.2</span>\n        <h1>Grammar Challenge</h1>\n        <p class=\"hero-sub\">Practise <b>be</b>, negative sentences, subject pronouns and possessive adjectives. Answer each question before time runs out.</p>\n        <div class=\"summary\">\n          <div class=\"summary-card\"><div class=\"summary-num\">30</div><div class=\"summary-desc\">Questions</div></div>\n          <div class=\"summary-card\"><div class=\"summary-num\">6</div><div class=\"summary-desc\">Timed blocks</div></div>\n          <div class=\"summary-card\"><div class=\"summary-num\">5:00</div><div class=\"summary-desc\">Total time</div></div>\n        </div>\n        <div class=\"schedule\"><span>1–9 · 80 sec</span><span>10–17 · 90 sec</span><span>18–20 · 30 sec</span><span>21–23 · 30 sec</span><span>24–27 · 40 sec</span><span>28–30 · 30 sec</span></div>\n        <button id=\"start\" class=\"primary\" type=\"button\">Start exercise →</button>\n        <div class=\"mini-note\" id=\"welcomeStudent\">The next block opens automatically when the timer ends.</div>\n      </div>\n    </section>\n    <section id=\"exercise\" class=\"view\" aria-label=\"Timed test\">\n      <div class=\"block-head\"><div class=\"block-heading\"><div id=\"block-number\" class=\"block-number\">BLOCK 1 OF 6 · QUESTIONS 1–9</div><h2 id=\"block-title\" class=\"block-title\">Verb to be</h2></div><div class=\"counter\"><div id=\"answered\" class=\"answered\">0 / 9 answered</div><div><div class=\"timer\" id=\"timer\" aria-live=\"off\">80</div><div class=\"timer-label\">seconds left</div></div></div></div>\n      <div class=\"progress\" id=\"progress\" aria-hidden=\"true\"></div>\n      <div class=\"time-track\" aria-hidden=\"true\"><div class=\"time-fill\" id=\"time-fill\"></div></div>\n      <div class=\"instructions\" id=\"instructions\"></div>\n      <p class=\"example hidden\" id=\"example\">Example: <strong>I’m [A] into [B] cycling [C]</strong> → I’m <strong>not</strong> into cycling → select <strong>A</strong>.</p>\n      <div id=\"legend\" class=\"choice-legend\" aria-label=\"Answer choices\"></div>\n      <div class=\"cards-wrap\"><div id=\"questions\" class=\"question-grid\"></div></div>\n      <div class=\"footer-actions\"><div class=\"footer-info\">Your answers are saved as you select them. The answer key is not shown in Student Mode.</div><button class=\"primary next\" id=\"next\" type=\"button\">Next block →</button></div>\n    </section>\n    <section id=\"results\" class=\"view\" aria-label=\"Test results\">\n      <div class=\"result-shell\"><div class=\"result-card\">\n        <div class=\"result-label\">Unit 0.2 · Finished</div><h2 class=\"result-title\">Your results</h2>\n        <div id=\"score\" class=\"score\">… <small>/ 30</small></div>\n        <div id=\"grade\" class=\"grade-line\">Your answers are being checked securely.</div>\n        <div class=\"result-grid\"><div class=\"result-mini\"><b id=\"resultScore\">—</b><span>Score</span></div><div class=\"result-mini\"><b id=\"resultPercent\">—</b><span>Accuracy</span></div><div class=\"result-mini\"><b id=\"resultGrade\">—</b><span>Grade</span></div></div>\n        <div class=\"save-status\" id=\"saveStatus\" role=\"status\">Submitting your answers to the online journal…</div>\n        <div style=\"display:flex;flex-wrap:wrap;justify-content:center;gap:10px\">\n          <button class=\"primary\" id=\"restart\" type=\"button\" disabled>Try again</button>\n          <button class=\"secondary hidden\" id=\"retry\" type=\"button\">Retry saving</button>\n          <button class=\"secondary\" id=\"print\" type=\"button\">Print result</button>\n        </div>\n        <div class=\"mini-note\">Results are checked by the L7 TEST server. The answer key is not available in Student Mode.</div>\n      </div></div>\n    </section>\n  </main>\n</div>";
const BLOCKS = [{"name":"Verb to be","range":"1–9","seconds":80,"mode":"word","instruction":"Choose the correct short form of <b>be</b> for each sentence.","choices":[["A","’m"],["B","’s"],["C","’re"]],"questions":[{"n":1,"text":"They____ into movies and music."},{"n":2,"text":"I____ interested in animals."},{"n":3,"text":"He____ Italian."},{"n":4,"text":"You____ good at skateboarding."},{"n":5,"text":"She____ into chatting online."},{"n":6,"text":"It____ a good video game!"},{"n":7,"text":"We____ from Edinburgh."},{"n":8,"text":"I____ eleven."},{"n":9,"text":"They____ teachers."}]},{"name":"Make negative","range":"10–17","seconds":90,"mode":"position","instruction":"Choose where to insert <b>not</b> in each sentence. Select the correct letter (A–E as shown).","choices":[],"questions":[{"n":10,"text":"She’s __A interested __B in __C reading __D."},{"n":11,"text":"We’re __A good __B at __C basketball __D."},{"n":12,"text":"The __A book __B is __C very __D good __E."},{"n":13,"text":"My __A brothers __B are __C into __D photography __E."},{"n":14,"text":"I’m __A fifteen __B."},{"n":15,"text":"You’re __A from __B Ankara __C."},{"n":16,"text":"He’s __A my __B friend __C."},{"n":17,"text":"We’re __A in __B our __C house __D."}]},{"name":"Subject pronouns I","range":"18–20","seconds":30,"mode":"word","instruction":"Choose the correct pronoun for each sentence.","choices":[["A","He"],["B","I"],["C","It"],["D","They"],["E","We"]],"questions":[{"n":18,"text":"Hi, my name is Anna. ___’m from Bristol."},{"n":19,"text":"Robert is twelve. ___’s good at music."},{"n":20,"text":"Ed and Tim are into sport. ___ like football."}]},{"name":"Subject pronouns II","range":"21–23","seconds":30,"mode":"word","instruction":"Choose the correct pronoun for each sentence.","choices":[["A","I"],["B","It"],["C","They"],["D","We"],["E","You"]],"questions":[{"n":21,"text":"Mary and I are friends. ___’re into chatting on the internet."},{"n":22,"text":"This is my favorite movie. ___’s very good."},{"n":23,"text":"You and Marco are from Milan. ___’re Italian."}]},{"name":"Possessive adjectives I","range":"24–27","seconds":40,"mode":"word","instruction":"Choose the correct possessive adjective.","choices":[["A","her"],["B","our"],["C","your"],["D","my"],["E","his"]],"questions":[{"n":24,"text":"It’s ___ (you) book."},{"n":25,"text":"It’s ___ (she) photo."},{"n":26,"text":"It’s ___ (I) bag."},{"n":27,"text":"It’s ___ (we) house."}]},{"name":"Possessive adjectives II","range":"28–30","seconds":30,"mode":"word","instruction":"Choose the correct possessive adjective.","choices":[["A","her"],["B","our"],["C","your"],["D","their"],["E","his"]],"questions":[{"n":28,"text":"It’s ___ (they) laptop."},{"n":29,"text":"It’s ___ (he) food."},{"n":30,"text":"It’s ___ (you) TV."}]}];
const $ = id => shadow.getElementById(id);
const state = {block:0,answers:{},deadline:0,raf:0,running:false,finished:false,saving:false,saved:false,client:null,user:null,profile:null};
const preview = location.protocol !== 'https:' && window.L7_UNIT02_PREVIEW === true;
const htmlEscape = value => String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function showView(id){for(const el of shadow.querySelectorAll('.view'))el.classList.toggle('active',el.id===id)}
function formatText(text,mode){
 const escaped=htmlEscape(text);
 if(mode==='position')return escaped.replace(/__([A-E])/g,(_all,letter)=>`<span class="slot" data-slot="${letter}">${letter}</span>`);
 return escaped.replace(/_{3,4}/g,'<span class="blank">____</span>');
}
function render(){
 const b=BLOCKS[state.block];
 $('exercise').classList.toggle('mode-position',b.mode==='position');
 $('block-number').textContent=`BLOCK ${state.block+1} OF ${BLOCKS.length} · QUESTIONS ${b.range}`;
 $('block-title').textContent=b.name;
 $('instructions').innerHTML=b.instruction; // controlled static instructions only
 $('example').classList.toggle('hidden',b.mode!=='position');
 $('progress').innerHTML=BLOCKS.map((_x,i)=>`<div class="progress-piece ${i<state.block?'past':i===state.block?'now':''}"></div>`).join('');
 $('legend').innerHTML=b.mode==='position'?'<span class="legend-choice"><strong>NOT</strong> Choose a position A–E for each sentence</span>':b.choices.map(([k,v])=>`<div class="legend-choice"><strong>${k}</strong><span>${htmlEscape(v)}</span></div>`).join('');
 let gridClass=b.questions.length===9?'grid-9':b.questions.length===3?'grid-3':'';
 $('questions').className='question-grid '+gridClass;
 $('questions').innerHTML=b.questions.map(q=>{
   const letters=b.mode==='position'?[...q.text.matchAll(/__([A-E])/g)].map(m=>m[1]):b.choices.map(p=>p[0]);
   const current=state.answers[q.n]||'';
   return `<article class="card" data-q="${q.n}"><div class="card-top"><div class="n-circle">${q.n}</div><div class="q-text">${formatText(q.text,b.mode)}</div></div><div class="picks" role="group" aria-label="Answer for question ${q.n}">${letters.map(k=>`<button class="pick ${current===k?'active':''}" type="button" data-answer="${k}" aria-label="Question ${q.n}, option ${k}" aria-pressed="${current===k}">${k}</button>`).join('')}</div></article>`;
 }).join('');
 if(b.mode==='position')updateSlots();
 $('next').textContent=state.block===BLOCKS.length-1?'Finish test →':'Next block →';
 $('timer').textContent=b.seconds;$('timer').classList.remove('urgent');
 $('time-fill').style.width='100%';$('time-fill').classList.remove('urgent');
 $('answered').textContent=`${b.questions.filter(q=>state.answers[q.n]).length} / ${b.questions.length} answered`;
 $('questions').parentElement.scrollTop=0;
 state.deadline=performance.now()+b.seconds*1000;
 state.running=true;
 cancelAnimationFrame(state.raf);state.raf=requestAnimationFrame(tick);
}
function updateSlots(){
 for(const card of shadow.querySelectorAll('.card')){
   const n=Number(card.dataset.q),v=state.answers[n];
   for(const slot of card.querySelectorAll('.slot'))slot.classList.toggle('selected',slot.dataset.slot===v);
 }
}
function tick(now){
 if(!state.running)return;
 const b=BLOCKS[state.block],remain=Math.max(0,state.deadline-now),secs=Math.ceil(remain/1000);
 $('timer').textContent=secs;
 $('timer').classList.toggle('urgent',secs<=10);
 $('time-fill').classList.toggle('urgent',secs<=10);
 $('time-fill').style.width=(remain/(b.seconds*1000)*100)+'%';
 if(remain<=0){advance();return;}
 state.raf=requestAnimationFrame(tick);
}
function advance(){
 if(!state.running)return;
 state.running=false;cancelAnimationFrame(state.raf);
 if(state.block===BLOCKS.length-1){finish();return;}
 state.block++;render();
}
async function finish(){
 state.finished=true;state.running=false;cancelAnimationFrame(state.raf);
 showView('results');$('retry').classList.add('hidden');$('restart').disabled=true;
 $('score').innerHTML='… <small>/ 30</small>';
 $('grade').textContent='Your answers are being checked securely.';
 $('resultScore').textContent='—';$('resultPercent').textContent='—';$('resultGrade').textContent='—';
 $('saveStatus').className='save-status';$('saveStatus').textContent='Submitting your answers to the online journal…';
 await saveResults();
 host.scrollIntoView({block:'start',behavior:'instant'});
}
async function saveResults(){
 if(state.saving || state.saved)return;
 state.saving=true;$('retry').classList.add('hidden');
 $('saveStatus').className='save-status';$('saveStatus').textContent='Saving your result to L7 TEST…';
 try{
   if(preview){
     $('score').innerHTML='— <small>/ 30</small>';
     $('grade').textContent='Layout preview: online checking is disabled.';
     $('saveStatus').textContent='Preview only. Open this exercise on l7-test.online to save a real result.';
     $('restart').disabled=false;state.saving=false;return;
   }
   if(!state.client || !state.user)throw Error('Approved Student account is not available. Open My account and return to this test.');
   const {data:sessionData,error:sessionError}=await state.client.auth.getSession();
   if(sessionError || !sessionData?.session)throw Error('Your login session expired. Open My account and sign in again.');
   const payload={};for(const [n,v] of Object.entries(state.answers))if(v)payload[n]=v;
   const {data,error}=await state.client.rpc('l7_submit_test',{p_test_code:'unit-0-2',p_answers:payload});
   if(error)throw error;
   if(!data || data.test_code!=='unit-0-2' || Number(data.total)!==30)throw Error('Unexpected response from the results server.');
   state.saved=true;
   const score=Number(data.score),grade=String(data.grade),percent=Number(data.percent);
   $('score').innerHTML=htmlEscape(String(score))+' <small>/ 30</small>';
   $('grade').textContent='Grade: '+grade+' · '+percent+'%';
   $('resultScore').textContent=score+' / 30';$('resultPercent').textContent=percent+'%';$('resultGrade').textContent=grade;
   $('saveStatus').className='save-status good';
   $('saveStatus').textContent='✓ Result saved online · '+new Date().toLocaleString()+(data.result_id?' · ID: '+String(data.result_id).slice(0,8):'');
   $('restart').disabled=false;
 }catch(err){
   $('saveStatus').className='save-status bad';
   $('saveStatus').textContent='Result NOT confirmed as saved: '+String(err?.message||err);
   $('grade').textContent='Your result was not confirmed. Check your journal before retrying to avoid duplicates.';
   $('retry').classList.remove('hidden');
 }finally{state.saving=false}
}
function showAuth(title,detail,extra=''){
 showView('authGate');$('authHeading').textContent=title;$('authText').textContent=detail;
 $('authError').textContent=extra;$('authError').classList.toggle('hidden',!extra);
}
const CONFIG_SCRIPT='https://alihasan114.github.io/english-plus/l7-config.js?v=20261126';
function loadScript(url){return new Promise((resolve,reject)=>{
 const s=document.createElement('script');s.src=url;s.async=true;
 s.onload=resolve;s.onerror=()=>reject(new Error('Unable to load '+(url.includes('supabase')?'Supabase library':'project configuration')));
 document.head.appendChild(s);
});}
function findConfig(){
 const h=window.L7_HEADER_CONFIG||{},a=window.L7_ACCOUNTS_CONFIG||{},t=window.L7_TEST_CONFIG||{};
 const options=[{url:h.supabaseUrl,key:h.publishableKey,source:'Header'},
  {url:a.supabaseUrl,key:a.publishableKey,source:'Accounts'},
  {url:t.url,key:t.publishableKey,source:'GitHub configuration'}];
 return options.find(c=>/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(String(c.url||''))
  && /^(sb_publishable_|eyJ)/.test(String(c.key||''))
  && !/YOUR|REPLACE|PLACEHOLDER/.test(c.key))||null;
}
let checking=false;
async function checkAccount(){
 if(checking)return;checking=true;
 showAuth('Checking your L7 TEST account…','Checking the session for this website.');
 try{
   if(preview){
     state.profile={display_name:'Preview Student',role:'student',status:'approved',class_code:'5A'};
     showView('welcome');$('studentBadge').textContent='Preview Student · 5A';
     $('welcomeStudent').textContent='Layout preview only — no result is saved. The next block opens when the timer ends.';
     return;
   }
   if(window.top!==window)throw Error('The quiz code is running inside an iframe. Install the native T123 script directly on the Tilda page.');
   if(location.protocol!=='https:')throw Error('Please open the published HTTPS version of l7-test.online.');
   let cfg=findConfig();
   if(!cfg){await loadScript(CONFIG_SCRIPT);cfg=findConfig()}
   if(!cfg)throw Error('Supabase settings not found. Check the site header or l7-config.js file.');
   if(!window.supabase?.createClient)await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js');
   if(!window.supabase?.createClient)throw Error('Supabase could not be initialized.');
   if(!state.client)state.client=window.supabase.createClient(cfg.url,cfg.key);
   const {data:session,error:se}=await state.client.auth.getSession();
   if(se)throw se;
   if(!session?.session){
     showAuth('Sign in on L7 TEST first','Your account session is not available on this page. Sign in through My account, then return here.',
       'Current host: '+location.host+' · Configuration: '+cfg.source+' · Check that the account page and the test use the same domain, e.g. l7-test.online (not www).');
     return;
   }
   const {data:ud,error:ue}=await state.client.auth.getUser();
   if(ue || !ud?.user)throw Error('Could not validate the current login session.');
   const {data:p,error:pe}=await state.client.from('profiles').select('display_name,role,status,class_code').eq('id',ud.user.id).single();
   if(pe)throw pe;
   if(p.role!=='student'||p.status!=='approved'||p.class_code!=='5A'){
     showAuth('5A Student access required', 'This test is available only to approved 5A students.',
      'Current account: '+(p.display_name||'unknown')+' · '+p.role+' · '+p.status+' · '+p.class_code);
     return;
   }
   state.user=ud.user;state.profile=p;
   $('studentBadge').textContent=p.display_name+' · Student · 5A';
   $('welcomeStudent').textContent='Signed in as '+p.display_name+' (5A). The next block opens automatically when the timer ends.';
   showView('welcome');
 }catch(err){
   showAuth('Could not check your account','Please open My account, sign in, and then return to Unit 0.2.', String(err?.message||err));
 }finally{checking=false}
}
async function requestFullscreen(){
 try{if(!document.fullscreenElement&&host.requestFullscreen)await host.requestFullscreen();else if(document.fullscreenElement&&document.exitFullscreen)await document.exitFullscreen();}
 catch(_err){/* Optional on some devices. */}
}
$('checkAgain').addEventListener('click',checkAccount);
$('start').addEventListener('click',()=>{if(!state.user&&!preview)return;
 state.block=0;state.answers={};state.finished=false;state.saved=false;state.saving=false;showView('exercise');render();if(!document.fullscreenElement)requestFullscreen();});
$('next').addEventListener('click',advance);
$('questions').addEventListener('click',event=>{
 const btn=event.target.closest('button[data-answer]');if(!btn||!state.running)return;
 const card=btn.closest('.card'),n=Number(card.dataset.q),answer=btn.dataset.answer;
 state.answers[n]=answer;
 for(const choice of card.querySelectorAll('.pick')){
  const selected=choice.dataset.answer===answer;
  choice.classList.toggle('active',selected);choice.setAttribute('aria-pressed',selected?'true':'false');
 }
 if(BLOCKS[state.block].mode==='position')updateSlots();
 const b=BLOCKS[state.block];$('answered').textContent=`${b.questions.filter(q=>state.answers[q.n]).length} / ${b.questions.length} answered`;
});
$('restart').addEventListener('click',()=>{if(!state.saved&&!preview)return;
 state.block=0;state.answers={};state.finished=false;state.saved=false;showView('exercise');render();});
$('retry').addEventListener('click',saveResults);
$('fullscreen').addEventListener('click',requestFullscreen);
$('print').addEventListener('click',()=>window.print());
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state.running&&performance.now()>=state.deadline)advance()});
window.addEventListener('pageshow',e=>{if(e.persisted&&!state.running&&!state.finished)checkAccount()});
checkAccount();
})();
