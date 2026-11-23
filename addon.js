/* ต้นแบบส่วนเสริม: ย้อนกลับ/ทำซ้ำ+ประวัติ, เวอร์ชัน/ภาคเรียน, Excel, ครูที่ปรึกษา, ครูสอนแทน, ตารางสอบ
   วางต่อท้ายสคริปต์หลัก (ก่อน </body>) หรือโหลดด้วย <script src="addon.js"></script> */
(()=>{
const W=window,AX=W.AX={},X={},H=AX.H={u:[],r:[],p:null,j:""};
const NM={teachers:'ครู',subjects:'วิชา',classes:'ห้องเรียน',rooms:'ห้องพิเศษ',asg:'ภาระสอน',tt:'ตารางสอน',cfg:'ตั้งค่าเวลา',sp:'คาบพิเศษ',ev:'กิจกรรม',sig:'ผู้ลงนาม',subs:'สอนแทน',exam:'ตารางสอบ',sem:'ภาคเรียน'};
const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const tn=id=>byId('teachers',id)?.name||'',cn=id=>byId('classes',id)?.name||'',lvc=id=>byId('classes',id)?.lv;
const ens=()=>{S.vers=S.vers||[];S.subs=S.subs||[];S.exam=S.exam||{};S.exam.rows=S.exam.rows||[];S.sem=S.sem||'ภาคเรียนที่ 1/2569'};
const snap=()=>{const o={...S};delete o.vers;return JSON.stringify(o)};
const parts=()=>{const o={};for(const k in S)if(k!='vers')o[k]=JSON.stringify(S[k]);return o};
const dt=t=>new Date(t).toLocaleString('th-TH',{dateStyle:'short',timeStyle:'short'});
const tOpt=(v,none)=>`<option value="">${none||'—'}</option>`+S.teachers.map(t=>`<option value="${t.id}" ${v==t.id?'selected':''}>${esc(t.name)}</option>`).join('');
function track(){ens();const p=parts();if(!H.p){H.p=p;H.j=snap();return}const ch=Object.keys(p).filter(k=>p[k]!==H.p[k]);if(!ch.length)return;
 H.u.push({t:Date.now(),l:ch.map(k=>NM[k]||k).join(', '),j:H.j});if(H.u.length>40)H.u.shift();H.r=[];H.p=p;H.j=snap()}
function setS(j){const v=S.vers;S=JSON.parse(j);S.vers=v;norm();ens();save();H.p=parts();H.j=snap()}
AX.undo=()=>{if(!H.u.length)return;const e=H.u.pop();H.r.push({t:Date.now(),l:e.l,j:snap()});setS(e.j);R()};
AX.redo=()=>{if(!H.r.length)return;const e=H.r.pop();H.u.push({t:Date.now(),l:e.l,j:snap()});setS(e.j);R()};
AX.jump=i=>{let n=H.u.length-i;while(n-->0)AX.undo()};
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){const k=e.key.toLowerCase();if(k=='z'&&!e.shiftKey){AX.undo();e.preventDefault()}else if(k=='y'||(k=='z'&&e.shiftKey)){AX.redo();e.preventDefault()}}});
function hdr(){let e=$('#hx');if(!e){e=document.createElement('div');e.id='hx';e.style.cssText='display:flex;gap:6px;align-items:center;margin-top:6px;flex-wrap:wrap';document.querySelector('header').appendChild(e)}
 e.innerHTML=`<button ${H.u.length?'':'disabled'} onclick="AX.undo()">↶ ย้อนกลับ (${H.u.length})</button><button ${H.r.length?'':'disabled'} onclick="AX.redo()">↷ ทำซ้ำ</button><span class="mu">${esc(S.sem)}</span>`}
const pr=html=>{$('#pr').innerHTML=html;document.documentElement.style.setProperty('--pfs','18px');setTimeout(()=>print(),150)};
// ---------- เวอร์ชัน/ภาคเรียน/ประวัติ ----------
const ttMap=o=>{const m={},as=Object.fromEntries((o.asg||[]).map(g=>[g.id,g]));for(const c in o.tt||{})for(const k in o.tt[c]){const g=as[o.tt[c][k].a];if(g)m[c+'@'+k]=g.sub+'|'+g.t}return m};
AX.saveV=()=>{const n=prompt('ชื่อเวอร์ชัน',`${S.sem} #${S.vers.length+1}`);if(!n)return;S.vers.push({id:uid(),name:n,t:Date.now(),j:snap()});save();R()};
AX.restore=id=>{const v=S.vers.find(x=>x.id==id);if(!v||!confirm(`กู้คืน “${v.name}” ? (ย้อนกลับได้ด้วยปุ่มย้อนกลับ)`))return;setS(v.j);R()};
AX.delV=id=>{if(!confirm('ลบเวอร์ชันนี้?'))return;S.vers=S.vers.filter(x=>x.id!=id);if(AX.c==id)AX.c=null;save();R()};
AX.cmp=id=>{AX.c=AX.c==id?null:id;R()};
AX.newSem=()=>{if(!confirm('เริ่มภาคเรียนใหม่? ระบบจะบันทึกภาคเรียนปัจจุบันเป็นเวอร์ชัน แล้วล้างตาราง/สอนแทน/ตารางสอบ (ครู ห้อง วิชา ภาระสอน คงเดิม)'))return;
 S.vers.push({id:uid(),name:'จบ: '+S.sem,t:Date.now(),j:snap()});const n=prompt('ชื่อภาคเรียนใหม่','ภาคเรียนที่ 2/2569');if(!n)return;S.sem=n;S.tt={};S.fail=[];S.subs=[];S.exam={rows:[]};save();R()};
function diff(v){const a=ttMap(JSON.parse(v.j)),b=ttMap(S),keys=new Set([...Object.keys(a),...Object.keys(b)]),by={};let n=0;
 keys.forEach(k=>{if(a[k]!==b[k]){n++;const c=k.split('@')[0];by[c]=(by[c]||0)+1}});
 const top=Object.entries(by).sort((x,y)=>y[1]-x[1]).slice(0,10).map(([c,m])=>`${esc(cn(c)||c)} (${m})`).join(', ');
 return`<div class="card" style="background:var(--bg)"><b>เทียบ “${esc(v.name)}” กับปัจจุบัน</b><p>คาบในเวอร์ชันนั้น ${Object.keys(a).length} · ปัจจุบัน ${Object.keys(b).length} · <b>ต่างกัน ${n} ช่อง</b> ใน ${Object.keys(by).length} ห้อง</p>${top?`<p class="mu">ห้องที่ต่างมากสุด: ${top}</p>`:''}</div>`}
X.ver=()=>{ens();const cv=S.vers.find(v=>v.id==AX.c);
 return`<div class="card"><b>ภาคเรียนและเวอร์ชันของตาราง</b><div class="bar" style="margin-top:8px"><label>ภาคเรียนปัจจุบัน <input type="text" value="${esc(S.sem)}" onchange="S.sem=this.value;save();R()"></label><button class="p" onclick="AX.saveV()">💾 บันทึกเวอร์ชัน</button><button onclick="AX.newSem()">➕ เริ่มภาคเรียนใหม่</button></div>
 ${S.vers.length?`<div class="sc"><table><tr><th>ชื่อ</th><th>เวลา</th><th>คาบที่จัด</th><th></th></tr>${S.vers.slice().reverse().map(v=>`<tr><td>${esc(v.name)}</td><td>${dt(v.t)}</td><td>${Object.keys(ttMap(JSON.parse(v.j))).length}</td><td style="white-space:nowrap"><button onclick="AX.cmp('${v.id}')">เทียบ</button> <button onclick="AX.restore('${v.id}')">กู้คืน</button> <button class="d" onclick="AX.delV('${v.id}')">ลบ</button></td></tr>`).join('')}</table></div>`:'<p class="mu">ยังไม่มีเวอร์ชันที่บันทึก</p>'}${cv?diff(cv):''}</div>
 <div class="card"><b>ประวัติการแก้ไข</b> <span class="mu">(ย้อนกลับได้ ${H.u.length} ขั้น · Ctrl+Z / Ctrl+Y · เก็บในหน่วยความจำของหน้านี้)</span>${H.u.length?`<div class="sc"><table>${H.u.map((e,i)=>`<tr><td>${dt(e.t)}</td><td>แก้ไข: ${esc(e.l)}</td><td><button onclick="AX.jump(${i})">กลับไปก่อนจุดนี้</button></td></tr>`).reverse().join('')}</table></div>`:'<p class="mu">ยังไม่มีการแก้ไข</p>'}</div>`};
// ---------- Excel ----------
const loadX=()=>W.XLSX?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=ok;s.onerror=()=>no(Error('โหลดไลบรารี Excel ไม่ได้ (ตรวจสอบอินเทอร์เน็ต)'));document.head.appendChild(s)});
AX.exp=async tpl=>{try{await loadX();const wb=XLSX.utils.book_new(),add=(n,r)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(r),n),sn=id=>byId('subjects',id);
 if(tpl){add('ครู',[{'รหัส':'T01','ชื่อ':'ครูสมชาย ใจดี','กลุ่มสาระ':'คณิตศาสตร์','สอนสูงสุด/วัน':6}]);add('ห้องเรียน',[{'รหัส':'c11','ห้อง':'ม.1/1','ระดับ':1,'นักเรียน':33,'ครูที่ปรึกษา 1':'ครูสมชาย ใจดี','ครูที่ปรึกษา 2':''}]);add('วิชา',[{'รหัส':'ค','ชื่อวิชา':'คณิตศาสตร์','คาบ/สัปดาห์':3,'ห้องพิเศษ':'','คาบคู่':''}]);add('ภาระสอน',[{'ห้อง':'ม.1/1','วิชา':'คณิตศาสตร์','ครู':'ครูสมชาย ใจดี'}])}
 else{add('ครู',S.teachers.map(t=>({'รหัส':t.id,'ชื่อ':t.name,'กลุ่มสาระ':t.dept,'สอนสูงสุด/วัน':t.max})));add('ห้องเรียน',S.classes.map(c=>({'รหัส':c.id,'ห้อง':c.name,'ระดับ':c.lv,'นักเรียน':c.size,'ครูที่ปรึกษา 1':tn(c.adv),'ครูที่ปรึกษา 2':tn(c.adv2)})));add('วิชา',S.subjects.map(s=>({'รหัส':s.id,'ชื่อวิชา':s.name,'คาบ/สัปดาห์':s.hrs,'ห้องพิเศษ':s.room||'','คาบคู่':s.dbl?'Y':''})));add('ภาระสอน',S.asg.map(g=>({'ห้อง':cn(g.cls),'วิชา':sn(g.sub)?.name||'','ครู':tn(g.t)})));
  const r=[];for(const c in S.tt)for(const k in S.tt[c]){const g=byId('asg',S.tt[c][k].a);if(!g)continue;const[d,p]=k.split('-').map(Number);r.push({'ห้อง':cn(c),'วัน':DN[d],'คาบ':p+1,'เวลา':tm(p)+'-'+te(p),'วิชา':sn(g.sub)?.name||'','ครู':tn(g.t)})}add('ตารางสอน',r)}
 XLSX.writeFile(wb,tpl?'แม่แบบนำเข้า.xlsx':'timetable.xlsx')}catch(e){alert(e.message)}};
AX.imp=async f=>{if(!f)return;try{await loadX();const wb=XLSX.read(await f.arrayBuffer()),rows=n=>wb.SheetNames.includes(n)?XLSX.utils.sheet_to_json(wb.Sheets[n],{defval:''}):null,T=rows('ครู'),C=rows('ห้องเรียน'),Su=rows('วิชา'),A=rows('ภาระสอน'),rep=[],warn=[];
 if(!T&&!C&&!Su&&!A)throw Error('ไม่พบชีต ครู / ห้องเรียน / วิชา / ภาระสอน (โหลดแม่แบบได้ที่ปุ่มด้านบน)');
 if(!confirm('นำเข้าจะแทนที่ข้อมูลในหมวดที่มีชีตนั้น (ย้อนกลับได้ด้วยปุ่มย้อนกลับ) ดำเนินการต่อไหม?'))return;
 const s=v=>String(v??'').trim();
 if(T){const old=new Map(S.teachers.map(t=>[t.id,t]));S.teachers=T.filter(r=>s(r['ชื่อ'])).map(r=>{const id=s(r['รหัส'])||'t'+uid(),o=old.get(id)||{};return{...o,id,name:s(r['ชื่อ']),dept:s(r['กลุ่มสาระ']),max:+r['สอนสูงสุด/วัน']||6,off:o.off||[]}});rep.push('ครู '+S.teachers.length)}
 const tid=v=>S.teachers.find(t=>t.id==s(v)||t.name==s(v))?.id||'';
 if(Su){const old=new Map(S.subjects.map(x=>[x.id,x]));S.subjects=Su.filter(r=>s(r['ชื่อวิชา'])).map(r=>{const id=s(r['รหัส'])||'v'+uid(),o=old.get(id)||{},rv=s(r['ห้องพิเศษ']),rm=S.rooms.find(x=>x.id==rv||x.name==rv);return{...o,id,name:s(r['ชื่อวิชา']),hrs:+r['คาบ/สัปดาห์']||1,room:rm?rm.id:'',dbl:!!s(r['คาบคู่'])}});rep.push('วิชา '+S.subjects.length)}
 if(C){const old=new Map(S.classes.map(c=>[c.id,c]));S.classes=C.filter(r=>s(r['ห้อง'])).map(r=>{const id=s(r['รหัส'])||'c'+uid(),o=old.get(id)||{},m=/ม\.?\s*(\d)/.exec(s(r['ห้อง']));return{...o,id,name:s(r['ห้อง']),lv:+r['ระดับ']||(m?+m[1]:1),size:+r['นักเรียน']||33,adv:tid(r['ครูที่ปรึกษา 1']),adv2:tid(r['ครูที่ปรึกษา 2'])}});rep.push('ห้องเรียน '+S.classes.length)}
 if(A){const old=S.asg,out=[];A.forEach(r=>{const c=S.classes.find(x=>x.name==s(r['ห้อง'])||x.id==s(r['ห้อง'])),sb=S.subjects.find(x=>x.id==s(r['วิชา'])||x.name==s(r['วิชา']));if(!c||!sb)return warn.push(`ข้าม: ${s(r['ห้อง'])} / ${s(r['วิชา'])}`);const t=tid(r['ครู']);if(!t)warn.push(`ไม่พบครู “${s(r['ครู'])}” (${c.name} ${sb.name})`);const o=old.find(g=>g.cls==c.id&&g.sub==sb.id);out.push({id:o?o.id:uid(),cls:c.id,sub:sb.id,t})});S.asg=out;rep.push('ภาระสอน '+out.length)}
 for(const c in S.tt)if(!byId('classes',c))delete S.tt[c];clean();save();AX.xm=`นำเข้าสำเร็จ: ${rep.join(' · ')}`+(warn.length?`<br><span class="er">คำเตือน ${warn.length} รายการ: ${esc(warn.slice(0,8).join('; '))}</span>`:'');R()}catch(e){alert(e.message)}};
X.xl=()=>`<div class="card"><b>นำเข้า/ส่งออก Excel</b><p class="mu">ไฟล์ .xlsx มีชีต ครู · ห้องเรียน (รวมครูที่ปรึกษา) · วิชา · ภาระสอน (ระบุ ห้อง วิชา ครู ตามชื่อ) · ตารางสอน (ส่งออกอย่างเดียว) เริ่มจากโหลดแม่แบบ กรอกแล้วนำเข้าได้เลย ต้องต่ออินเทอร์เน็ตเพื่อโหลดไลบรารี Excel ครั้งแรก</p><div class="bar"><button onclick="AX.exp(true)">⬇ แม่แบบนำเข้า</button><button class="p" onclick="AX.exp()">⬇ ส่งออกข้อมูลทั้งหมด</button><label class="mu">นำเข้า: <input type="file" accept=".xlsx,.xls,.csv" onchange="AX.imp(this.files[0]);this.value=''"></label></div>${AX.xm?`<p class="ok">${AX.xm}</p>`:''}</div>`;
// ---------- ครูที่ปรึกษา ----------
AX.autoAdv=()=>{const n={};S.teachers.forEach(t=>n[t.id]=0);S.classes.forEach(c=>{c.adv=c.adv2=''});
 S.classes.forEach(c=>{for(const f of['adv','adv2']){const b=S.teachers.filter(t=>n[t.id]<2&&c.adv!=t.id).map(t=>({t,s:n[t.id]*3-S.asg.filter(g=>g.cls==c.id&&g.t==t.id).length})).sort((a,b)=>a.s-b.s)[0];if(b){c[f]=b.t.id;n[b.t.id]++}}});save();R()};
AX.setAdv=(i,f,v)=>{S.classes[i][f]=v;save();R()};
X.adv=()=>{const n={};S.classes.forEach(c=>[c.adv,c.adv2].forEach(t=>t&&(n[t]=(n[t]||0)+1)));
 return`<div class="card"><b>ครูที่ปรึกษาประจำชั้น</b><p class="mu">ตั้งได้ 2 ท่านต่อห้อง ชื่อจะแสดงในหัวตาราง PDF/พิมพ์ของห้องนั้น</p><div class="bar"><button class="p" onclick="AX.autoAdv()">⚡ จัดอัตโนมัติ (เน้นครูที่สอนห้องนั้น ไม่เกิน 2 ห้อง/คน)</button></div><div class="sc"><table><tr><th>ห้อง</th><th>ที่ปรึกษา 1</th><th>ที่ปรึกษา 2</th></tr>${S.classes.map((c,i)=>`<tr><td>${esc(c.name)}</td>${['adv','adv2'].map(f=>`<td><select onchange="AX.setAdv(${i},'${f}',this.value)">${tOpt(c[f])}</select>${c[f]&&n[c[f]]>2?' <span class="er">⚠ เกิน 2 ห้อง</span>':''}</td>`).join('')}</tr>`).join('')}</table></div></div>`};
// ---------- ครูสอนแทน ----------
AX.sd=AX.sd||{date:'',t:'',why:''};
AX.mkSub=()=>{const{date,t,why}=AX.sd;if(!date||!t)return alert('เลือกวันที่และครูที่ลา');const d=(new Date(date+'T00:00:00').getDay()+6)%7;if(d>=S.cfg.days)return alert('วันที่เลือกไม่ใช่วันเรียนตามที่ตั้งค่า');
 const occ=new Set(),items=[],gone=new Set([t,...S.subs.filter(s=>s.date==date).map(s=>s.t)]);
 for(const c in S.tt)for(const k in S.tt[c]){const g=byId('asg',S.tt[c][k].a);if(!g)continue;occ.add(g.t+k);if(g.t==t&&k.startsWith(d+'-'))items.push({k,cls:c,a:g.id})}
 S.subs.filter(s=>s.date==date).forEach(s=>s.items.forEach(i=>i.s&&occ.add(i.s+i.k)));
 if(!items.length)return alert('ครูท่านนี้ไม่มีคาบสอนในวันนั้น');items.sort((a,b)=>+a.k.split('-')[1]-+b.k.split('-')[1]);
 const cnt={};S.subs.forEach(s=>s.items.forEach(i=>i.s&&(cnt[i.s]=(cnt[i.s]||0)+1)));const dp=byId('teachers',t)?.dept;
 items.forEach(i=>{const[kd,kp]=i.k.split('-').map(Number),c=S.teachers.filter(x=>!gone.has(x.id)&&!occ.has(x.id+i.k)&&!x.off.includes(i.k)&&!(typeof spTch=='function'&&spTch(x.id,kd,kp))).sort((a,b)=>(a.dept==dp?0:5)+(cnt[a.id]||0)-((b.dept==dp?0:5)+(cnt[b.id]||0)))[0];i.s=c?c.id:'';if(c){occ.add(c.id+i.k);cnt[c.id]=(cnt[c.id]||0)+1}});
 S.subs.push({id:uid(),date,t,why,items});save();R()};
AX.setSub=(id,i,v)=>{S.subs.find(s=>s.id==id).items[i].s=v;save();R()};
AX.delSub=id=>{if(!confirm('ลบรายการสอนแทนนี้?'))return;S.subs=S.subs.filter(s=>s.id!=id);save();R()};
const fd=d=>new Date(d+'T00:00:00').toLocaleDateString('th-TH',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
AX.pSub=id=>{const s=S.subs.find(x=>x.id==id);pr(`<section><h2>ใบสอนแทน</h2><h3>${fd(s.date)} · ครูที่ลา: ${esc(tn(s.t))}${s.why?' ('+esc(s.why)+')':''}</h3><table><tr><th>คาบ</th><th>เวลา</th><th>ห้อง</th><th>วิชา</th><th>ครูสอนแทน</th><th>ลงชื่อ</th></tr>${s.items.map(i=>{const p=+i.k.split('-')[1],g=byId('asg',i.a);return`<tr><td>${p+1}</td><td>${tm(p)}–${te(p)}</td><td>${esc(cn(i.cls))}</td><td>${esc(byId('subjects',g?.sub)?.name||'')}</td><td>${esc(tn(i.s)||'—')}</td><td></td></tr>`}).join('')}</table></section>`)};
X.sub=()=>{const cnt={};S.subs.forEach(s=>s.items.forEach(i=>i.s&&(cnt[i.s]=(cnt[i.s]||0)+1)));const d=AX.sd;
 return`<div class="card"><b>บันทึกครูลา / จัดครูสอนแทน</b><div class="bar" style="margin-top:8px"><input type="date" value="${d.date}" onchange="AX.sd.date=this.value"><select onchange="AX.sd.t=this.value">${tOpt(d.t,'— ครูที่ลา —')}</select><input type="text" style="max-width:180px" placeholder="เหตุผล (ไม่บังคับ)" value="${esc(d.why)}" onchange="AX.sd.why=this.value"><button class="p" onclick="AX.mkSub()">สร้างรายการสอนแทน</button></div><p class="mu">ระบบดึงคาบสอนของครูที่ลาในวันนั้น แล้วเสนอครูที่ว่างในคาบนั้น (ไม่ติดสอน ไม่ติดคาบพิเศษ) โดยเน้นกลุ่มสาระเดียวกันและคนที่สอนแทนน้อยที่สุด แก้ไขเองได้</p></div>
 ${S.subs.slice().reverse().map(s=>`<div class="card"><div class="bar"><b>${fd(s.date)}</b><span>ครูที่ลา: ${esc(tn(s.t))}${s.why?' · '+esc(s.why):''}</span><button onclick="AX.pSub('${s.id}')">🖨 พิมพ์</button><button class="d" onclick="AX.delSub('${s.id}')">ลบ</button></div><div class="sc"><table><tr><th>คาบ</th><th>ห้อง</th><th>ครูสอนแทน</th></tr>${s.items.map((i,x)=>`<tr><td>${+i.k.split('-')[1]+1}</td><td>${esc(cn(i.cls))}</td><td><select onchange="AX.setSub('${s.id}',${x},this.value)">${tOpt(i.s,'— ไม่มีครูว่าง —')}</select></td></tr>`).join('')}</table></div></div>`).join('')}
 ${Object.keys(cnt).length?`<div class="card"><b>สถิติการสอนแทน (ความเป็นธรรม)</b><div class="sc"><table><tr><th>ครู</th><th>ครั้ง</th></tr>${Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`<tr><td>${esc(tn(t))}</td><td>${n}</td></tr>`).join('')}</table></div></div>`:''}`};
// ---------- ตารางสอบ ----------
AX.ep=AX.ep||{start:'',n:2};
const ymd=x=>x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');
AX.genEx=()=>{const p=AX.ep;if(!p.start)return alert('เลือกวันเริ่มสอบ');if(S.exam.rows.length&&!confirm('แทนที่ตารางสอบเดิม?'))return;
 const sl=[['09:00','10:30'],['10:45','12:15'],['13:15','14:45']].slice(0,p.n),days=[],d=new Date(p.start+'T00:00:00');while(days.length<40){const w=d.getDay();if(w>0&&w<6)days.push(ymd(d));d.setDate(d.getDate()+1)}
 const rows=[];for(let l=1;l<=6;l++){const subs=S.subjects.filter(s=>S.asg.some(g=>g.sub==s.id&&lvc(g.cls)==l));subs.forEach((s,i)=>rows.push({id:uid(),sub:s.id,lv:l,date:days[Math.floor(i/p.n)],from:sl[i%p.n][0],to:sl[i%p.n][1],proc:{}}))}
 S.exam.rows=rows;AX.genProc(true)};
AX.genProc=q=>{const load={},busy={};S.teachers.forEach(t=>load[t.id]=0);S.exam.rows.sort((a,b)=>(a.date+a.from).localeCompare(b.date+b.from));
 S.exam.rows.forEach(r=>{const key=r.date+r.from,b=busy[key]=busy[key]||new Set();r.proc={};S.classes.filter(c=>c.lv==r.lv).forEach(c=>{const st=new Set(S.asg.filter(g=>g.cls==c.id&&g.sub==r.sub).map(g=>g.t)),t=S.teachers.filter(t=>!b.has(t.id)&&!st.has(t.id)).sort((x,y)=>load[x.id]-load[y.id]||(S.asg.some(g=>g.cls==c.id&&g.t==y.id)-S.asg.some(g=>g.cls==c.id&&g.t==x.id)))[0];if(t){r.proc[c.id]=t.id;b.add(t.id);load[t.id]++}})});save();R()};
AX.exSet=(i,k,v)=>{S.exam.rows[i][k]=k=='lv'?+v:v;save();R()};AX.exDel=i=>{S.exam.rows.splice(i,1);save();R()};
AX.exAdd=()=>{S.exam.rows.push({id:uid(),sub:S.subjects[0]?.id,lv:1,date:AX.ep.start||ymd(new Date()),from:'09:00',to:'10:30',proc:{}});save();R()};
AX.pEx=m=>{const R_=S.exam.rows,t=S.exam.name||'ตารางสอบ',sn=id=>byId('subjects',id)?.name||'';let h='';
 if(m=='lv')for(let l=1;l<=6;l++){const r=R_.filter(x=>x.lv==l);if(r.length)h+=`<section style="page-break-after:always"><h2>${esc(t)} · ${esc(S.sem)}</h2><h3>ชั้นมัธยมศึกษาปีที่ ${l}</h3><table><tr><th>วัน/เดือน/ปี</th><th>เวลา</th><th>วิชา</th></tr>${r.map(x=>`<tr><td>${fd(x.date)}</td><td>${x.from}–${x.to}</td><td>${esc(sn(x.sub))}</td></tr>`).join('')}</table></section>`}
 else S.teachers.forEach(te_=>{const r=[];R_.forEach(x=>{for(const c in x.proc)if(x.proc[c]==te_.id)r.push({x,c})});if(r.length)h+=`<section style="page-break-after:always"><h2>ตารางคุมสอบ · ${esc(t)}</h2><h3>${esc(te_.name)}</h3><table><tr><th>วันที่</th><th>เวลา</th><th>วิชา</th><th>ห้องสอบ</th></tr>${r.map(({x,c})=>`<tr><td>${fd(x.date)}</td><td>${x.from}–${x.to}</td><td>${esc(sn(x.sub))}</td><td>${esc(cn(c))}</td></tr>`).join('')}</table></section>`});
 if(!h)return alert('ยังไม่มีข้อมูลให้พิมพ์');pr(h)};
X.exam=()=>{const p=AX.ep,r=S.exam.rows,ld={};r.forEach(x=>Object.values(x.proc||{}).forEach(t=>ld[t]=(ld[t]||0)+1));
 return`<div class="card"><b>ตารางสอบและผู้คุมสอบ</b><div class="bar" style="margin-top:8px"><input type="text" style="max-width:200px" placeholder="ชื่อการสอบ เช่น สอบกลางภาค" value="${esc(S.exam.name||'')}" onchange="S.exam.name=this.value;save()"><label>เริ่มสอบ <input type="date" value="${p.start}" onchange="AX.ep.start=this.value"></label><label>ช่วงต่อวัน <select onchange="AX.ep.n=+this.value">${[1,2,3].map(n=>`<option ${p.n==n?'selected':''}>${n}</option>`).join('')}</select></label><button class="p" onclick="AX.genEx()">⚡ สร้างตารางสอบอัตโนมัติ</button></div><p class="mu">สร้างทุกวิชาของแต่ละระดับ เรียงตามวันและช่วงเวลา (ข้ามเสาร์-อาทิตย์) แต่ละห้องใช้ห้องเรียนเดิมเป็นห้องสอบ แล้วจัดครูคุมสอบให้กระจายเท่ากัน ไม่ใช่ครูผู้สอนวิชานั้นและไม่ซ้อนเวลา</p>
 <div class="bar"><button onclick="AX.exAdd()">+ เพิ่มรายการ</button><button onclick="AX.genProc()">จัดผู้คุมสอบใหม่</button><button onclick="AX.pEx('lv')">🖨 ตารางสอบรายระดับ</button><button onclick="AX.pEx('tch')">🖨 ตารางคุมสอบรายครู</button></div>
 <div class="sc"><table><tr><th>วิชา</th><th>ระดับ</th><th>วันที่</th><th>เริ่ม</th><th>สิ้นสุด</th><th>ผู้คุมสอบ</th><th></th></tr>${r.map((x,i)=>`<tr><td><select onchange="AX.exSet(${i},'sub',this.value)">${S.subjects.map(s=>`<option value="${s.id}" ${x.sub==s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></td><td><select onchange="AX.exSet(${i},'lv',this.value)">${[1,2,3,4,5,6].map(l=>`<option value="${l}" ${x.lv==l?'selected':''}>ม.${l}</option>`).join('')}</select></td><td><input type="date" value="${x.date}" onchange="AX.exSet(${i},'date',this.value)"></td><td><input type="text" style="width:70px" value="${x.from}" onchange="AX.exSet(${i},'from',this.value)"></td><td><input type="text" style="width:70px" value="${x.to}" onchange="AX.exSet(${i},'to',this.value)"></td><td>${Object.keys(x.proc||{}).length}/${S.classes.filter(c=>c.lv==x.lv).length} ห้อง</td><td><button class="d" onclick="AX.exDel(${i})">ลบ</button></td></tr>`).join('')||'<tr><td colspan="7" class="mu">ยังไม่มีรายการสอบ</td></tr>'}</table></div>
 ${Object.keys(ld).length?`<p class="mu">ภาระคุมสอบ: สูงสุด ${Math.max(...Object.values(ld))} ครั้ง · ต่ำสุด ${Math.min(...S.teachers.map(t=>ld[t.id]||0))} ครั้ง · ครู ${Object.keys(ld).length}/${S.teachers.length} คนได้คุมสอบ</p>`:''}</div>`};
// ---------- เชื่อมเข้าระบบเดิม ----------
Object.assign(TABS,{adv:'ที่ปรึกษา',sub:'สอนแทน',exam:'ตารางสอบ',xl:'Excel',ver:'เวอร์ชัน/ประวัติ'});Object.assign(IC,{adv:'🧑‍🏫',sub:'🔄',exam:'📝',xl:'📥',ver:'🕘'});
const R0=R;R=function(){R0();ens();track();const f=X[V.tab];if(f)$('#m').innerHTML=f();hdr()};
const pg0=pg;pg=function(m,id){let h=pg0(m,id);if(m=='cls'){const c=byId('classes',id),n=[c?.adv,c?.adv2].map(tn).filter(Boolean);if(n.length)h=h.replace('</h3>',' · ครูที่ปรึกษา: '+esc(n.join(', '))+'</h3>')}return h};
ens();H.p=parts();H.j=snap();R();
})();
