const VERSION='2.1';
const EXAM_DATE=new Date('2026-09-02T09:00:00');
const SUBJECTS=['국어','수학','영어','사회문화','경제'];
const PRIORITY_LABEL={must:'필수',should:'권장',extra:'여유'};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const now=()=>new Date();
const ymd=d=>{const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};
const parse=s=>new Date(s+'T12:00:00');
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch{return d}};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const INITIAL_WEEK={
 '2026-08-02':{mode:'방학 집중',goal:10.8,tasks:[
  ['국어','must','All Of KICE Origin 1~4강','김승리 All Of KICE','오전 2강+저녁 2강, 강의별 기준 한 줄','3시간 30분'],
  ['수학','must','오르새 학습 블록','세부 진도 추후 입력','오전 집중 블록 확보','2시간 20분'],
  ['영어','must','평가원·수능 영어 진단 1회','연도·월 직접 기록','70분 풀이+오답 원인 분류','1시간 40분'],
  ['사회문화','should','LIM IT 26~27강','임정환 LIM IT','당일 범위 책 덮고 설명','1시간 30분'],
  ['경제','must','LEAD IN 13~14강+적용','우영호 LEAD IN·마더텅','교재 재풀이+해당 단원 8~10문제','2시간 40분']],
  schedule:[['07:00~09:10','방학','국어 Origin 1~2강'],['09:20~11:40','방학','수학 오르새 블록'],['11:40~12:30','점심','식사·휴식'],['12:30~15:10','방학','경제 LEAD IN 13~14강+적용'],['15:20~16:50','방학','사문 LIM IT 26~27강'],['17:00~18:40','방학','영어 전체 진단+오답'],['18:40~19:30','저녁','식사·휴식'],['19:30~20:40','방학','국어 Origin 3~4강 또는 미완료'],['20:40~21:00','마감','경제·사문 백지 복습']]},
 '2026-08-03':{mode:'방학 집중',goal:10.8,tasks:[
  ['국어','must','All Of KICE Origin 5~8강','김승리 All Of KICE','전날 기준으로 기출 지문 1개 재독','3시간 20분'],['수학','must','오르새 학습 블록','세부 진도 추후 입력','실모 없으면 커리+복습','2시간 30분'],['영어','should','순서·삽입 집중','평가원 기출','진단에서 틀린 유형 4~6문제','1시간'],['사회문화','must','LIM IT 28~29강','임정환 LIM IT','26~29강 누적 복습','1시간 30분'],['경제','must','LEAD IN 15~16강+적용','우영호 LEAD IN·마더텅','마더텅 해당 단원 8~12문제','2시간 40분']],
  schedule:[['07:00~09:10','방학','국어 Origin 5~6강'],['09:20~11:50','방학','수학 오르새 블록'],['11:50~12:40','점심','식사·휴식'],['12:40~15:20','방학','경제 LEAD IN 15~16강+적용'],['15:30~17:00','방학','사문 LIM IT 28~29강'],['17:10~18:10','방학','영어 순서·삽입'],['18:10~19:00','저녁','식사·휴식'],['19:00~20:20','방학','국어 Origin 7~8강'],['20:20~20:40','마감','전 과목 미완료 정리']]},
 '2026-08-04':{mode:'방학 집중',goal:10.8,tasks:[
  ['국어','must','All Of KICE Origin 9~12강','김승리 All Of KICE','가장 어려운 지문 재독','3시간 20분'],['수학','must','오르새 학습 블록','세부 진도 추후 입력','오전 집중 블록','2시간 30분'],['영어','should','빈칸 2+순서·삽입 4','평가원 기출','전날 오답 재풀이','1시간'],['사회문화','must','LIM IT 30강부터 남은 2강','임정환 LIM IT','정확한 남은 강의는 직접 수정','1시간 30분'],['경제','must','LEAD IN 17~18강+적용','우영호 LEAD IN·마더텅','마더텅 10문제+그래프 재현','2시간 40분']],
  schedule:[['07:00~09:10','방학','국어 Origin 9~10강'],['09:20~11:50','방학','수학 오르새 블록'],['11:50~12:40','점심','식사·휴식'],['12:40~15:20','방학','경제 LEAD IN 17~18강+적용'],['15:30~17:00','방학','사문 LIM IT 남은 2강'],['17:10~18:10','방학','영어 빈칸·순서·삽입'],['18:10~19:00','저녁','식사·휴식'],['19:00~20:20','방학','국어 Origin 11~12강'],['20:20~20:40','마감','누적 복습']]},
 '2026-08-05':{mode:'방학 점검',goal:10.5,tasks:[
  ['국어','must','Origin 13~14강 완료+다음 과정 진입','김승리 All Of KICE','Origin 복습 후 Predator 시작','3시간'],['수학','must','오르새 학습 블록','세부 진도 추후 입력','이번 주 오답 정리 포함','2시간 30분'],['영어','must','평가원·수능 영어 진단 2회','연도·월 직접 기록','첫날과 점수·시간 비교','1시간 40분'],['사회문화','must','LIM IT 완강 또는 사문 실모 1회','실모 이름 직접 기록','30분 풀이+선지·개념 복구','1시간 30분'],['경제','must','LEAD IN 19~20강+누적 테스트','우영호 LEAD IN·마더텅','13~20강 누적 15~20문제','2시간 40분']],
  schedule:[['07:00~09:00','방학','국어 Origin 13~14강+복습'],['09:10~11:40','방학','수학 오르새 블록'],['11:40~12:30','점심','식사·휴식'],['12:30~15:10','방학','경제 19~20강+누적 테스트'],['15:20~16:50','방학','사문 완강/실모 1회+분석'],['17:00~18:40','방학','영어 전체 진단+오답'],['18:40~19:30','저녁','식사·휴식'],['19:30~20:30','점검','4일 성적·진도 결산']]},
 '2026-08-06':{mode:'학기 중 토요일 시간표',goal:8.0,tasks:[
  ['국어','must','All Of KICE 다음 과정 2블록','김승리 All Of KICE','1교시·4교시에 배치','2시간 20분'],['수학','must','오르새 학습 블록','세부 진도 추후 입력','3교시+하교 후','3시간'],['영어','should','단어+취약 유형','기출 오답','점심 20분+저녁 40분','1시간'],['사회문화','must','사문 실모 1회+분석','실모 이름 직접 기록','5교시 60분','1시간'],['경제','must','LEAD IN 21~22강 또는 적용','우영호 LEAD IN·마더텅','2교시·6교시','2시간 10분']],
  schedule:[['08:40~09:50','1교시 · 수업명 입력','국어 All Of KICE 다음 진도'],['10:00~11:10','2교시 · 수업명 입력','경제 LEAD IN 21강+교재'],['11:20~12:30','3교시 · 수업명 입력','수학 오르새 블록'],['12:30~13:30','점심','식사 40분+영어 단어 20분'],['13:30~14:40','4교시 · 수업명 입력','국어 All Of KICE 다음 진도'],['14:50~15:50','5교시 · 수업명 입력','사문 실모 30분+분석 30분'],['16:00~17:00','6교시 · 수업명 입력','경제 LEAD IN 22강/마더텅'],['17:40~19:40','하교 후','수학 오르새 블록'],['19:50~20:30','마감','영어 취약 유형 또는 누적 복습']]}
};

function buildInitial(){const tasks={},schedules={};Object.entries(INITIAL_WEEK).forEach(([date,d])=>{tasks[date]=d.tasks.map(x=>({id:uid(),subject:x[0],priority:x[1],name:x[2],material:x[3],note:x[4],duration:x[5],done:false}));schedules[date]=d.schedule.map(x=>({id:uid(),time:x[0],school:x[1],study:x[2],done:false}))});return{tasks,schedules}}
const INITIAL=buildInitial();
function settings(){return get('p11122_v2_settings',{vacationGoal:10.8,schoolGoal:9.5,hikeEnabled:false})}
function allTasks(){return get('p11122_v2_tasks',INITIAL.tasks)}
function allSchedules(){return get('p11122_v2_schedules',INITIAL.schedules)}
function saveTasks(date,tasks){const m=allTasks();m[date]=tasks;set('p11122_v2_tasks',m)}
function saveSchedules(date,slots){const m=allSchedules();m[date]=slots;set('p11122_v2_schedules',m)}
function tasksFor(date){const m=allTasks();if(!m[date]){m[date]=SUBJECTS.map((s,i)=>({id:uid(),subject:s,priority:[0,1,4].includes(i)?'must':'should',name:'직접 계획 입력',material:'',note:'',duration:'',done:false}));set('p11122_v2_tasks',m)}return m[date]}
function scheduleFor(date){const m=allSchedules();if(!m[date]){m[date]=[];set('p11122_v2_schedules',m)}return m[date]}
function phase(date){if(date<='2026-08-01')return'사관학교 집중';if(date<='2026-08-05')return'방학 압축 부팅';if(date<='2026-08-12')return'기반 완성';if(date<='2026-08-19')return'기출 전환';if(date<='2026-08-26')return'11122 진입';return'실전 고정'}
let selected=ymd(now())<'2026-08-02'?'2026-08-02':ymd(now());

$$('nav button').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
function navigate(page){$$('.section').forEach(s=>s.classList.toggle('active',s.id===page));$$('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$('#pageTitle').textContent=$(`nav button[data-page="${page}"]`).textContent;if(page==='manager')renderManager();if(page==='calendar')renderCalendarPage();if(page==='week')renderWeek();if(page==='school')renderSchool();if(page==='courses')renderCourses();if(page==='tests')renderTests();if(page==='report')renderReport();if(page==='hike')renderHike()}

function renderDashboard(){const ts=tasksFor(selected),slots=scheduleFor(selected),done=ts.filter(t=>t.done).length,rate=ts.length?Math.round(done/ts.length*100):0;$('#phaseBadge').textContent=phase(selected);const info=INITIAL_WEEK[selected],st=settings(),mode=info?.mode||(parse(selected).getDay()===0?'일요일 회복':'학기 모드');$('#modeText').textContent=mode;$('#goalHours').textContent=(info?.goal||(parse(selected).getDay()===0?4.5:st.schoolGoal)).toFixed(1);$('#todayRate').textContent=rate+'%';$('#todayBar').style.width=rate+'%';const h=get('p11122_v2_hours',{});$('#hoursInput').value=h[selected]||'';const[ws,we]=weekBounds(parse(selected));let wh=0;for(let d=new Date(ws);d<=we;d.setDate(d.getDate()+1))wh+=Number(h[ymd(d)]||0);$('#weekStudy').textContent=wh.toFixed(1);renderTasks(ts);renderSchedule(slots);renderUpcomingEvents();renderTodayPrescription()}
function renderTasks(ts){const box=$('#todayTasks');box.innerHTML='';ts.forEach(t=>{const e=document.createElement('div');e.className='task'+(t.done?' done':'');e.innerHTML=`<div class="task-main"><input type="checkbox" ${t.done?'checked':''}><div><div><span class="priority ${t.priority}">${PRIORITY_LABEL[t.priority]}</span><span class="subject">${esc(t.subject)}</span><span class="task-title">${esc(t.name)}</span></div><div class="task-meta">${esc(t.material)}${t.duration?' · '+esc(t.duration):''}${t.note?' · '+esc(t.note):''}</div></div><div class="task-actions"><button class="btn ghost small edit">수정</button><button class="btn danger small del">삭제</button></div></div>`;e.querySelector('input').onchange=x=>{t.done=x.target.checked;saveTasks(selected,ts);renderDashboard()};e.querySelector('.edit').onclick=()=>openTask(t);e.querySelector('.del').onclick=()=>{if(confirm('삭제할까요?')){saveTasks(selected,ts.filter(x=>x.id!==t.id));renderDashboard()}};box.appendChild(e)})}
function renderSchedule(slots){const box=$('#todaySchedule');box.innerHTML=slots.length?'':'<div class="note">시간표가 없습니다.</div>';slots.forEach(s=>{const e=document.createElement('div');e.className='slot'+(s.done?' done':'');e.innerHTML=`<div class="time">${esc(s.time)}</div><div class="school">${esc(s.school)}</div><div class="study">${esc(s.study)}</div><div class="slot-actions"><label><input type="checkbox" ${s.done?'checked':''}> 완료</label></div>`;e.querySelector('input').onchange=x=>{s.done=x.target.checked;saveSchedules(selected,slots);renderDashboard()};box.appendChild(e)})}
$('#newTask').onclick=()=>openTask();
function openTask(t=null){$('#taskModalTitle').textContent=t?'할 일 수정':'할 일 추가';$('#taskId').value=t?.id||'';$('#taskSubject').value=t?.subject||'국어';$('#taskPriority').value=t?.priority||'must';$('#taskDuration').value=t?.duration||'';$('#taskName').value=t?.name||'';$('#taskMaterial').value=t?.material||'';$('#taskNote').value=t?.note||'';$('#taskModal').classList.add('show')}
$('#saveTask').onclick=()=>{const ts=tasksFor(selected),id=$('#taskId').value,obj={id:id||uid(),subject:$('#taskSubject').value,priority:$('#taskPriority').value,duration:$('#taskDuration').value,name:$('#taskName').value.trim()||'새 할 일',material:$('#taskMaterial').value.trim(),note:$('#taskNote').value.trim(),done:false};const i=ts.findIndex(t=>t.id===id);if(i>=0){obj.done=ts[i].done;ts[i]=obj}else ts.push(obj);saveTasks(selected,ts);$('#taskModal').classList.remove('show');renderDashboard()};
$$('.closeModal').forEach(b=>b.onclick=()=>$$('.modal-back').forEach(m=>m.classList.remove('show')));$$('.modal-back').forEach(m=>m.onclick=e=>{if(e.target===m)m.classList.remove('show')});
$('#saveHours').onclick=()=>{const h=get('p11122_v2_hours',{});h[selected]=Number($('#hoursInput').value||0);set('p11122_v2_hours',h);renderDashboard()};

function weekBounds(d){const x=new Date(d),day=x.getDay()||7,mon=new Date(x);mon.setDate(x.getDate()-day+1);const sun=new Date(mon);sun.setDate(mon.getDate()+6);return[mon,sun]}
function renderWeek(){ $('#selectedDate').value=selected;updateSelectedSummary();const g=$('#calendarGrid');g.innerHTML='';['일','월','화','수','목','금','토'].forEach(x=>{const e=document.createElement('div');e.className='cal-head';e.textContent=x;g.appendChild(e)});const first=new Date('2026-08-01T12:00:00');for(let i=0;i<first.getDay();i++){const b=document.createElement('div');b.className='day blank';g.appendChild(b)}const hm=get('p11122_v2_hours',{});for(let n=1;n<=31;n++){const ds=`2026-08-${String(n).padStart(2,'0')}`,ts=tasksFor(ds),e=document.createElement('div');e.className='day'+(ds===ymd(now())?' today':'')+(ds===selected?' selected':'');e.innerHTML=`<div class="n">${n}</div><div class="mini">${phase(ds)}<br>${ts.filter(x=>x.done).length}/${ts.length} 완료</div>${hm[ds]?'<span class="dot"></span>':''}`;e.onclick=()=>{selected=ds;$('#selectedDate').value=ds;renderWeek()};g.appendChild(e)}const dates=['2026-08-02','2026-08-03','2026-08-04','2026-08-05','2026-08-06'];$('#weekTable').innerHTML=dates.map(d=>{const ts=tasksFor(d),pick=s=>ts.find(t=>t.subject===s)?.name||'';return `<tr><td>${d.slice(5)}</td>${SUBJECTS.map(s=>`<td>${esc(pick(s))}</td>`).join('')}</tr>`}).join('')}
$('#selectedDate').onchange=e=>{selected=e.target.value;updateSelectedSummary()};
function updateSelectedSummary(){const info=INITIAL_WEEK[selected],ts=tasksFor(selected);$('#selectedSummary').innerHTML=`<b>${selected} · ${info?.mode||phase(selected)}</b><br>${ts.filter(t=>t.priority==='must').length}개 필수, ${ts.filter(t=>t.priority==='should').length}개 권장, ${ts.filter(t=>t.priority==='extra').length}개 여유 과제`}
$('#openSelected').onclick=()=>{navigate('dashboard');renderDashboard()};$('#printPlan').onclick=()=>window.print();

const DEFAULT_PERIODS=[{time:'08:40~09:30',school:'수업명 입력',selfStudy:true,study:''},{time:'09:40~10:30',school:'수업명 입력',selfStudy:true,study:''},{time:'10:40~11:30',school:'수업명 입력',selfStudy:true,study:''},{time:'11:40~12:30',school:'수업명 입력',selfStudy:true,study:''},{time:'13:30~14:20',school:'수업명 입력',selfStudy:true,study:''},{time:'14:30~15:20',school:'수업명 입력',selfStudy:true,study:''},{time:'15:30~16:20',school:'수업명 입력',selfStudy:true,study:''}];
function schoolMap(){return get('p11122_v2_school',{})}
function renderSchool(){const day=$('#schoolDay').value,map=schoolMap(),arr=map[day]||DEFAULT_PERIODS.map(x=>({...x,id:uid()}));const box=$('#schoolEditor');box.innerHTML='';arr.forEach((p,i)=>{const e=document.createElement('div');e.className='slot';e.innerHTML=`<input class="input t" value="${esc(p.time)}"><input class="input s" value="${esc(p.school)}"><div><input class="input w" value="${esc(p.study)}" placeholder="실제 공부"><label class="task-meta"><input class="a" type="checkbox" ${p.selfStudy?'checked':''}> 자습 가능</label></div><button class="btn danger small">삭제</button>`;const save=()=>{p.time=e.querySelector('.t').value;p.school=e.querySelector('.s').value;p.study=e.querySelector('.w').value;p.selfStudy=e.querySelector('.a').checked;map[day]=arr;set('p11122_v2_school',map)};e.querySelectorAll('input').forEach(x=>x.onchange=save);e.querySelector('button').onclick=()=>{arr.splice(i,1);map[day]=arr;set('p11122_v2_school',map);renderSchool()};box.appendChild(e)});$('#thursdaySpecial').innerHTML=scheduleFor('2026-08-06').map(s=>`<div class="slot"><div class="time">${esc(s.time)}</div><div class="school">${esc(s.school)}</div><div class="study">${esc(s.study)}</div><div></div></div>`).join('')}
$('#schoolDay').onchange=renderSchool;$('#addPeriod').onclick=()=>{const day=$('#schoolDay').value,map=schoolMap(),arr=map[day]||DEFAULT_PERIODS.map(x=>({...x,id:uid()}));arr.push({id:uid(),time:'',school:'수업명 입력',selfStudy:true,study:''});map[day]=arr;set('p11122_v2_school',map);renderSchool()};
$('#autoArrange').onclick=()=>{const day=$('#schoolDay').value,map=schoolMap(),arr=map[day]||DEFAULT_PERIODS.map(x=>({...x,id:uid()})),order=['국어 All Of KICE','수학 오르새','경제 LEAD IN/CORE','사회문화 실모+복습','영어 단어·취약 유형','국어 복습','경제 마더텅'];let idx=0;arr.forEach(p=>{if(p.selfStudy&&!p.study)p.study=order[idx++%order.length]});map[day]=arr;set('p11122_v2_school',map);renderSchool()};

function courseData(){return get('p11122_v2_courses',{kor:[{name:'Origin',done:0,total:14,note:'우선 완강'},{name:'Predator 독서',done:0,total:32,note:'Origin 이후'},{name:'Predator 문학',done:0,total:38,note:'독서와 병행'},{name:'W.O.W',done:0,total:56,note:'전체 완주 대상'}],eco:[{name:'LEAD IN',done:12,total:29,note:'13강부터 재개'},{name:'CORE',done:0,total:0,note:'LEAD IN 후 자료 분석'},{name:'마더텅',done:0,total:0,note:'강의와 병행'}],soc:[{name:'LIM IT',done:25,total:0,note:'26강부터 완강'},{name:'사문 실모',done:0,total:0,note:'완강 후 하루 1회+분석'}],other:[{name:'오르새 수학',done:0,total:0,note:'세부 진도 추후 확정'},{name:'영어 일일 루틴',done:0,total:0,note:'매일 50~60분'}]})}
function renderCourses(){const d=courseData();renderCourseBox('#korCourses',d.kor,'kor');renderCourseBox('#ecoCourses',d.eco,'eco');renderCourseBox('#socCourses',d.soc,'soc');renderCourseBox('#otherCourses',d.other,'other')}
function renderCourseBox(sel,arr,key){$(sel).innerHTML=arr.map((c,i)=>{const pct=c.total?Math.min(100,Math.round(c.done/c.total*100)):0;return `<div class="course"><div class="course-head"><div><div class="course-title">${esc(c.name)}</div><div class="course-sub">${esc(c.note)}</div></div><button class="btn ghost small" data-i="${i}">진도 수정</button></div><div class="course-progress"><div style="width:${pct}%"></div></div><div class="task-meta">${c.total?`${c.done}/${c.total}강 · ${pct}%`:`현재 ${c.done} · 총량 직접 입력 가능`}</div></div>`}).join('');$$(sel+' button').forEach(b=>b.onclick=()=>{const c=arr[Number(b.dataset.i)],done=prompt(`${c.name} 현재 완료 강/회차`,c.done);if(done===null)return;const total=prompt(`${c.name} 전체 강/회차 (모르면 0)`,c.total);c.done=Number(done||0);c.total=Number(total||0);const all=courseData();all[key]=arr;set('p11122_v2_courses',all);renderCourses()})}

$('#testDate').value=$('#fullDate').value=ymd(now());$('#singleMode').onclick=()=>{$('#singleForm').classList.remove('hidden');$('#fullForm').classList.add('hidden');$('#singleMode').className='btn primary small';$('#fullMode').className='btn ghost small'};$('#fullMode').onclick=()=>{$('#singleForm').classList.add('hidden');$('#fullForm').classList.remove('hidden');$('#fullMode').className='btn primary small';$('#singleMode').className='btn ghost small'};$('#fullScoreInputs').innerHTML=SUBJECTS.map(s=>`<label>${s}<input class="input full-score" data-sub="${s}" type="number" min="0" max="${s==='사회문화'||s==='경제'?50:100}"></label>`).join('');
function tests(){return get('p11122_v2_tests',[])}
$('#saveSingleTest').onclick=()=>{const a=tests();a.push({id:uid(),kind:'single',date:$('#testDate').value,subject:$('#testSubject').value,category:$('#testCategory').value,select:$('#testSelect').value,series:$('#testSeries').value,round:$('#testRound').value,year:$('#testYear').value,month:$('#testMonth').value,score:Number($('#testScore').value||0),time:$('#testTime').value,wrong:Number($('#wrongCount').value||0),reason:$('#wrongReason').value,memo:$('#testMemo').value});set('p11122_v2_tests',a);savePrescriptionFromTest(a[a.length-1]);renderTests();alert('저장했습니다.')};
$('#saveFullTest').onclick=()=>{const scores={};$$('.full-score').forEach(x=>scores[x.dataset.sub]=Number(x.value||0));const a=tests();a.push({id:uid(),kind:'full',date:$('#fullDate').value,name:$('#fullName').value||'전과목 모의고사',memo:$('#fullMemo').value,scores});set('p11122_v2_tests',a);savePrescriptionFromTest(a[a.length-1]);renderTests();alert('저장했습니다.')};
function renderTests(){const a=tests().sort((x,y)=>x.date.localeCompare(y.date));drawChart(a);$('#testList').innerHTML=a.length?a.slice().reverse().map(t=>`<div class="test-card"><div class="row" style="justify-content:space-between"><div><div class="test-title">${t.kind==='full'?esc(t.name):`${esc(t.subject)} · ${esc(t.series||t.category)} ${esc(t.round||'')}`}</div><div class="test-meta">${t.date}${t.kind==='single'?` · ${esc(t.year)} ${esc(t.month)} · ${esc(t.select)}`:''}</div></div><button class="btn danger small" data-id="${t.id}">삭제</button></div><div>${t.kind==='full'?SUBJECTS.map(s=>`<span class="score-pill">${s} ${t.scores[s]||'-'}</span>`).join(''):`<span class="score-pill">${t.score}점</span><span class="score-pill">${esc(t.time)}</span><span class="score-pill">오답 ${t.wrong}</span><span class="score-pill">${esc(t.reason)}</span>`}</div>${t.memo?`<div class="task-meta">${esc(t.memo)}</div>`:''}</div>`).join(''):'<div class="note">아직 기록이 없습니다.</div>';$$('#testList button').forEach(b=>b.onclick=()=>{set('p11122_v2_tests',a.filter(x=>x.id!==b.dataset.id));renderTests()});const latest=a.slice(-5).reverse();$('#testSummary').innerHTML=latest.length?latest.map(t=>`<div class="test-card"><b>${t.date}</b> · ${t.kind==='full'?esc(t.name):`${esc(t.subject)} ${esc(t.series||t.category)}`}<div class="task-meta">${t.kind==='single'?`${t.score}점 · ${esc(t.reason)}`:SUBJECTS.map(s=>`${s} ${t.scores[s]||'-'}`).join(' · ')}</div></div>`).join(''):'<div class="note">최근 시험이 없습니다.</div>'}
function drawChart(a){const c=$('#scoreChart'),ctx=c.getContext('2d'),r=c.getBoundingClientRect(),dpr=devicePixelRatio||1;c.width=Math.max(1,r.width*dpr);c.height=Math.max(1,r.height*dpr);ctx.scale(dpr,dpr);const w=r.width,h=r.height,p=34;ctx.clearRect(0,0,w,h);ctx.strokeStyle='#e1e5ed';for(let i=0;i<=5;i++){const y=p+(h-2*p)*i/5;ctx.beginPath();ctx.moveTo(p,y);ctx.lineTo(w-p,y);ctx.stroke()}const rows=[];a.forEach(t=>{if(t.kind==='full')SUBJECTS.forEach(s=>rows.push({date:t.date,subject:s,score:t.scores[s]}));else rows.push({date:t.date,subject:t.subject,score:t.score})});if(!rows.length){ctx.fillStyle='#7a8392';ctx.fillText('시험을 기록하면 그래프가 표시됩니다.',p,55);return}const colors={국어:'#3658df',수학:'#7657d9',영어:'#14825d',사회문화:'#c38a17',경제:'#c43d57'};SUBJECTS.forEach(s=>{const vals=rows.filter(x=>x.subject===s&&x.score>0);if(!vals.length)return;ctx.strokeStyle=colors[s];ctx.lineWidth=2;ctx.beginPath();vals.forEach((v,i)=>{const max=s==='사회문화'||s==='경제'?50:100,x=p+(w-2*p)*(vals.length===1?.5:i/(vals.length-1)),y=h-p-(h-2*p)*(v.score/max);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()});let lx=p;SUBJECTS.forEach(s=>{ctx.fillStyle=colors[s];ctx.fillRect(lx,9,9,9);ctx.fillStyle='#3e4655';ctx.fillText(s,lx+12,18);lx+=s.length>2?67:48})}
window.addEventListener('resize',()=>{if($('#tests').classList.contains('active'))renderTests()});

function renderReport(){const[ws,we]=weekBounds(parse(selected)),tm=allTasks(),hm=get('p11122_v2_hours',{});let hours=0,done=0,total=0,sub={};SUBJECTS.forEach(s=>sub[s]={done:0,total:0});for(let d=new Date(ws);d<=we;d.setDate(d.getDate()+1)){const ds=ymd(d);hours+=Number(hm[ds]||0);(tm[ds]||[]).forEach(t=>{total++;if(t.done)done++;if(sub[t.subject]){sub[t.subject].total++;if(t.done)sub[t.subject].done++}})}const rate=total?Math.round(done/total*100):0;$('#repHours').textContent=hours.toFixed(1);$('#repRate').textContent=rate+'%';$('#repTests').textContent=tests().filter(t=>parse(t.date)>=ws&&parse(t.date)<=we).length;$('#repHike').textContent=settings().hikeEnabled?'ON':'OFF';$('#subjectReport').innerHTML=SUBJECTS.map(s=>`<tr><td>${s}</td><td>${sub[s].done}</td><td>${sub[s].total}</td><td>${sub[s].total?Math.round(sub[s].done/sub[s].total*100):0}%</td></tr>`).join('');const weak=SUBJECTS.map(s=>[s,sub[s].total?sub[s].done/sub[s].total:1]).sort((a,b)=>a[1]-b[1])[0][0];$('#managerReport').innerHTML=`<div class="report-block"><b>총평</b>이번 주 순공 ${hours.toFixed(1)}시간, 계획 달성률 ${rate}%입니다. ${rate>=90?'현재 계획 강도를 유지합니다.':rate>=75?'필수 과제는 유지하고 권장 과제를 일부 줄입니다.':'총량을 줄이고 필수 과제부터 복구해야 합니다.'}</div><div class="report-block"><b>가장 위험한 과목</b>${weak}의 완료율이 가장 낮습니다. 다음 주에는 새로운 자료보다 미완료 핵심을 우선 배치합니다.</div><div class="report-block"><b>이월 규칙</b>필수만 다음 가능한 날로 이동하고, 권장은 일요일 오후 후보, 여유는 삭제합니다.</div>`}
function renderHike(){const st=settings();$('#hikeEnabled').checked=st.hikeEnabled;const items=['전날 7시간 30분 이상 수면','무릎·발목 통증 없음','폭염·호우·강풍 예보 없음','월요일까지 남는 과도한 피로 없음','물·간식·보조배터리 준비'],saved=get('p11122_v2_hikeChecks',{});$('#hikeChecks').innerHTML=items.map((x,i)=>`<label class="check"><input type="checkbox" data-i="${i}" ${saved[i]?'checked':''}><span>${x}</span></label>`).join('');$$('#hikeChecks input').forEach(x=>x.onchange=()=>{saved[x.dataset.i]=x.checked;set('p11122_v2_hikeChecks',saved);renderHikeDecision()});renderHikeDecision()}
$('#hikeEnabled').onchange=e=>{const st=settings();st.hikeEnabled=e.target.checked;set('p11122_v2_settings',st);renderHikeDecision()};

function missed(){const m=allTasks(),todayS=ymd(now()),out=[];Object.keys(m).filter(d=>d<todayS).sort().forEach(d=>m[d].filter(t=>!t.done).forEach(t=>out.push({date:d,t})));return out}
$('#carryBtn').onclick=()=>{const list=missed();$('#carryList').innerHTML=list.length?list.map(({date,t})=>`<div class="test-card" data-date="${date}" data-id="${t.id}"><b>${date} · ${esc(t.subject)} · ${esc(t.name)}</b><div class="row"><select class="input action short"><option value="today">오늘로 이동</option><option value="next">다음 날로 이동</option><option value="sunday">다음 일요일</option><option value="delete">삭제</option></select><button class="btn primary small apply">적용</button></div></div>`).join(''):'<div class="note">지난 미완료 과제가 없습니다.</div>';$$('#carryList .apply').forEach(b=>b.onclick=()=>{const box=b.closest('.test-card');carryOne(box.dataset.date,box.dataset.id,box.querySelector('.action').value);$('#carryBtn').click()});$('#carryModal').classList.add('show')};
function carryOne(from,id,action){const m=allTasks(),task=m[from]?.find(t=>t.id===id);if(!task)return;m[from]=m[from].filter(t=>t.id!==id);if(action!=='delete'){let dest;if(action==='today')dest=ymd(now());if(action==='next'){const d=parse(from);d.setDate(d.getDate()+1);dest=ymd(d)}if(action==='sunday'){const d=now(),add=(7-d.getDay())%7||7;d.setDate(d.getDate()+add);dest=ymd(d)}task.id=uid();task.done=false;(m[dest]||(m[dest]=[])).push(task)}set('p11122_v2_tasks',m);renderDashboard()}

function exportData(){const data={app:'PROJECT11122',version:VERSION,exportedAt:new Date().toISOString(),storage:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('p11122'))data.storage[k]=localStorage.getItem(k)}const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`PROJECT11122_backup_${ymd(now())}.json`;a.click();URL.revokeObjectURL(a.href)}
$('#exportData').onclick=$('#backupQuick').onclick=exportData;$('#importData').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(d.app!=='PROJECT11122')throw Error();if(!confirm('현재 기록을 백업으로 덮어쓸까요?'))return;Object.entries(d.storage).forEach(([k,v])=>localStorage.setItem(k,v));location.reload()}catch{alert('PROJECT 11122 백업 파일이 아닙니다.')}};
$('#vacationGoal').value=settings().vacationGoal;$('#schoolGoal').value=settings().schoolGoal;$('#saveSettings').onclick=()=>{const st=settings();st.vacationGoal=Number($('#vacationGoal').value||10.8);st.schoolGoal=Number($('#schoolGoal').value||9.5);set('p11122_v2_settings',st);alert('저장했습니다.');renderDashboard()};$('#resetAll').onclick=()=>{if(prompt('전체 기록을 지우려면 RESET을 입력하세요.')==='RESET'){Object.keys(localStorage).filter(k=>k.startsWith('p11122')).forEach(k=>localStorage.removeItem(k));location.reload()}};

$('#todayLabel').textContent=new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'long'});const dday=Math.ceil((EXAM_DATE-now())/86400000);$('#dday').textContent=dday>=0?'D-'+dday:'종료';
migrateV21();renderDashboard();renderManager();renderCalendarPage();renderWeek();renderSchool();renderCourses();renderTests();renderReport();renderHike();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));


/* ========================= v2.1 AUTO MANAGER ========================= */
function migrateV21(){
 if(get('p11122_v21_migrated',false))return;
 const defaults=[
  {id:uid(),subject:'국어',type:'강의',name:'김승리 All Of KICE',note:'Origin → Predator 독서·문학 → W.O.W'},
  {id:uid(),subject:'영어',type:'기출',name:'평가원·수능 영어',note:'주 2회 전체, 평일 취약 유형'},
  {id:uid(),subject:'사회문화',type:'강의',name:'임정환 LIM IT',note:'완강 후 실모+개념 복구'},
  {id:uid(),subject:'사회문화',type:'실모',name:'사문 실모',note:'30분 풀이+분석'},
  {id:uid(),subject:'경제',type:'강의',name:'우영호 LEAD IN',note:'완강 후 CORE'},
  {id:uid(),subject:'경제',type:'강의',name:'우영호 CORE',note:'자료 분석+문제 적용'},
  {id:uid(),subject:'경제',type:'문제집',name:'마더텅 경제',note:'강의 범위와 병행'}
 ];
 if(!localStorage.getItem('p11122_v21_materials'))set('p11122_v21_materials',defaults);
 if(!localStorage.getItem('p11122_v21_events'))set('p11122_v21_events',[{id:uid(),title:'9월 모의평가',type:'시험',date:'2026-09-02',allDay:true,start:'',end:'',priority:'high',location:'학교',memo:'목표 11122',source:'app'}]);
 set('p11122_v21_migrated',true)
}

function nextDateString(base,days=1){const d=parse(base);d.setDate(d.getDate()+days);return ymd(d)}
function latestTestFor(subject){
 const flat=[];tests().forEach(t=>{if(t.kind==='single'&&t.subject===subject)flat.push({date:t.date,score:t.score,reason:t.reason||'',memo:t.memo||''});if(t.kind==='full'&&t.scores?.[subject])flat.push({date:t.date,score:t.scores[subject],reason:'',memo:t.memo||''})});
 return flat.sort((a,b)=>a.date.localeCompare(b.date)).at(-1)||null
}
function managerSuggestions(date){
 const data=courseData(),suggestions=[];
 const isSunday=parse(date).getDay()===0;
 const kor=data.kor.find(c=>c.total?c.done<c.total:true);
 if(kor){const count=isSunday?1:(date<='2026-08-05'?4:2),start=Number(kor.done||0)+1,end=kor.total?Math.min(kor.total,start+count-1):start+count-1;suggestions.push({autoKey:`kor-${kor.name}-${start}-${end}`,subject:'국어',priority:'must',name:`${kor.name} ${start}~${end}강`,material:'김승리 All Of KICE',note:'강의 후 핵심 기준 요약+지문 재독',duration:isSunday?'1시간':'2~3시간'})}
 const lead=data.eco.find(c=>c.name==='LEAD IN');const core=data.eco.find(c=>c.name==='CORE');
 if(lead && (!lead.total||lead.done<lead.total)){const start=Number(lead.done||0)+1,end=lead.total?Math.min(lead.total,start+1):start+1;suggestions.push({autoKey:`eco-lead-${start}-${end}`,subject:'경제',priority:'must',name:`LEAD IN ${start}~${end}강`,material:'우영호 LEAD IN',note:'교재 재풀이+해당 범위 문제 적용',duration:'2시간 30분'});suggestions.push({autoKey:`eco-apply-${start}-${end}`,subject:'경제',priority:'should',name:'강의 범위 자료·그래프 적용',material:'마더텅 경제',note:'8~12문제+그래프 백지 재현',duration:'50분'})}
 else {const start=Number(core?.done||0)+1,end=core?.total?Math.min(core.total,start):start;suggestions.push({autoKey:`eco-core-${start}`,subject:'경제',priority:'must',name:`CORE ${start}강+동일 유형 적용`,material:'우영호 CORE',note:'자료 분석 기준을 문제에 즉시 적용',duration:'2시간 20분'})}
 const limit=data.soc.find(c=>c.name==='LIM IT');const completed=Boolean(limit?.complete)||(limit?.total>0&&limit.done>=limit.total);
 if(completed){suggestions.push({autoKey:`soc-mock-${date}`,subject:'사회문화',priority:'must',name:'사문 실모 1회+개념 복구',material:'등록한 사문 실모',note:'30분 풀이+애매한 선지까지 분석',duration:'1시간 20분'})}
 else {const start=Number(limit?.done||0)+1,end=limit?.total?Math.min(limit.total,start+1):start+1;suggestions.push({autoKey:`soc-limit-${start}-${end}`,subject:'사회문화',priority:'must',name:`LIM IT ${start}~${end}강`,material:'임정환 LIM IT',note:'당일 범위 책 덮고 설명',duration:'1시간 30분'})}
 const eng=latestTestFor('영어');let engName='영어 일일 루틴',engNote='단어 15분+취약 유형 25분+오답 15분';
 if(eng&&eng.score<90){const r=eng.reason||'취약 유형';engName=`영어 ${r} 보완`;engNote=`최근 ${eng.score}점. ${r} 중심 5~6문제+오답 근거`}
 else if(eng&&eng.score>=90){engName='영어 1등급 유지 루틴';engNote=`최근 ${eng.score}점. 단어+고난도 3~4문제+쉬운 실수 점검`}
 suggestions.push({autoKey:`eng-${date}`,subject:'영어',priority:'should',name:engName,material:'평가원·수능 영어',note:engNote,duration:'55분'});
 if(isSunday)suggestions.forEach(s=>{if(s.subject==='국어'||s.subject==='경제')s.priority='should'});
 return suggestions
}
function generatePlanFor(date,showAlert=true){
 const current=tasksFor(date),suggestions=managerSuggestions(date),keys=new Set(current.map(t=>t.autoKey).filter(Boolean));let added=0;
 suggestions.forEach(s=>{if(!keys.has(s.autoKey)){current.push({id:uid(),...s,done:false});added++}});saveTasks(date,current);selected=date;renderDashboard();renderManager();if(showAlert)alert(`${date}에 ${added}개 계획을 추가했습니다.`);return added
}
function renderManager(){
 if(!$('#managerDate'))return;$('#managerDate').value=$('#managerDate').value||nextDateString(ymd(now()),1);
 const date=$('#managerDate').value||nextDateString(ymd(now()),1),preview=managerSuggestions(date);
 $('#managerPreview').innerHTML=preview.map(x=>`<div class="manager-preview-item"><span class="priority ${x.priority}">${PRIORITY_LABEL[x.priority]}</span><span class="subject">${x.subject}</span><b>${esc(x.name)}</b><div class="task-meta">${esc(x.material)} · ${esc(x.duration)} · ${esc(x.note)}</div></div>`).join('');
 renderPrescriptions();renderMaterials();refreshDailyReportText()
}
$('#managerDate')?.addEventListener('change',renderManager);
$('#generatePlan')?.addEventListener('click',()=>generatePlanFor($('#managerDate').value));
$('#generateNext')?.addEventListener('click',()=>generatePlanFor(nextDateString(ymd(now()),1)));
$('#generateNextQuick')?.addEventListener('click',()=>generatePlanFor(nextDateString(selected,1)));

function prescriptionStore(){return get('p11122_v21_prescriptions',[])}
function savePrescriptionFromTest(t){
 const list=prescriptionStore(),items=[];
 if(t.kind==='single')items.push(makePrescription(t.subject,t.score,t.reason,t.date));
 else SUBJECTS.forEach(s=>{if(t.scores?.[s])items.push(makePrescription(s,t.scores[s],'',t.date))});
 items.forEach(x=>{if(x)list.push(x)});set('p11122_v21_prescriptions',list.slice(-30))
}
function makePrescription(subject,score,reason,date){
 const target=(subject==='사회문화'||subject==='경제')?42:subject==='영어'?90:92;if(!score)return null;let action='오답 재풀이+판단 근거 확인';
 if(subject==='국어')action=String(reason).includes('시간')?'독서·문학 종료 시각 기록+시간 부족 지문 재풀이':'근거가 흐린 선지까지 분석';
 if(subject==='영어')action=score<90?`${reason||'취약 유형'} 5~6문제+오답 근거`:'단어+고난도 3문제 유지';
 if(subject==='사회문화')action=String(reason).includes('도표')?'도표 집중 5문제+개념 복구':'실모 오답 선지 LIM IT 복구';
 if(subject==='경제')action=String(reason).match(/그래프|자료|계산/)?'CORE 기준으로 자료·그래프 재해석+동형 문제':'LEAD IN 개념 복구+마더텅 동단원';
 return{id:uid(),date,subject,score,target,reason:reason||'',action,applied:false}
}
function renderPrescriptions(){
 const list=prescriptionStore().filter(x=>!x.applied).slice(-6).reverse();$('#prescriptionList').innerHTML=list.length?list.map(x=>`<div class="test-card"><b>${x.subject} ${x.score}점</b><div class="task-meta">목표 ${x.target} · ${esc(x.reason||'원인 미입력')}</div><div>${esc(x.action)}</div></div>`).join(''):'<div class="note">새 시험을 기록하면 자동 처방이 생성됩니다.</div>'
}
$('#applyPrescription')?.addEventListener('click',()=>{
 const list=prescriptionStore(),pending=list.filter(x=>!x.applied);if(!pending.length){alert('적용할 처방이 없습니다.');return}const date=nextDateString(ymd(now()),1),ts=tasksFor(date);
 pending.forEach(p=>{ts.push({id:uid(),autoKey:`rx-${p.id}`,subject:p.subject,priority:'must',name:`시험 처방: ${p.action}`,material:`${p.date} ${p.subject} ${p.score}점`,note:p.reason,duration:'40~60분',done:false});p.applied=true});saveTasks(date,ts);set('p11122_v21_prescriptions',list);alert(`${date} 계획에 처방을 추가했습니다.`);renderManager()
});
function renderTodayPrescription(){
 const p=prescriptionStore().filter(x=>!x.applied).at(-1);$('#todayPrescription').innerHTML=p?`<b>${p.subject} ${p.score}점 처방</b><br>${esc(p.action)}`:'<b>아직 새 처방이 없습니다.</b><br>실모·기출 점수를 기록하면 다음 계획에 반영합니다.'
}

function autoCarryRules(){
 const m=allTasks(),todayS=ymd(now());let moved=0,deleted=0;Object.keys(m).filter(d=>d<todayS).forEach(date=>{const remain=[];m[date].forEach(t=>{if(t.done){remain.push(t);return}if(t.priority==='extra'){deleted++;return}const dest=t.priority==='must'?todayS:nextSunday(todayS);t.id=uid();t.done=false;(m[dest]||(m[dest]=[])).push(t);moved++});m[date]=remain});set('p11122_v2_tasks',m);renderDashboard();renderManager();alert(`필수·권장 ${moved}개 이동, 여유 ${deleted}개 삭제했습니다.`)
}
function nextSunday(base){const d=parse(base),add=(7-d.getDay())%7||7;d.setDate(d.getDate()+add);return ymd(d)}
$('#autoCarry')?.addEventListener('click',autoCarryRules);

function materials(){return get('p11122_v21_materials',[])}
function renderMaterials(){
 const list=materials();$('#materialList').innerHTML=list.map(m=>`<div class="material-card"><div class="material-top"><div><span class="subject">${m.subject}</span><b>${esc(m.name)}</b><div class="task-meta">${esc(m.type)} · ${esc(m.note)}</div></div><div><button class="btn ghost small use-material" data-id="${m.id}">시험 입력</button><button class="btn danger small del-material" data-id="${m.id}">삭제</button></div></div></div>`).join('');
 $$('.use-material').forEach(b=>b.onclick=()=>{const m=list.find(x=>x.id===b.dataset.id);navigate('tests');$('#singleMode').click();$('#testSubject').value=m.subject;$('#testSeries').value=m.name;$('#testCategory').value=m.type==='실모'?'강사 실모':m.type==='기출'?'평가원 기출':m.type==='N제'?'N제':'기타'});
 $$('.del-material').forEach(b=>b.onclick=()=>{set('p11122_v21_materials',list.filter(x=>x.id!==b.dataset.id));renderMaterials()})
}
$('#addMaterial')?.addEventListener('click',()=>{$('#materialId').value='';$('#materialSubject').value='국어';$('#materialType').value='강의';$('#materialName').value='';$('#materialNote').value='';$('#materialModal').classList.add('show')});
$('#saveMaterial')?.addEventListener('click',()=>{const list=materials();list.push({id:uid(),subject:$('#materialSubject').value,type:$('#materialType').value,name:$('#materialName').value.trim()||'새 자료',note:$('#materialNote').value.trim()});set('p11122_v21_materials',list);$('#materialModal').classList.remove('show');renderMaterials()});

function dailyReport(date=selected){
 const ts=tasksFor(date),hours=get('p11122_v2_hours',{})[date]||0,dayTests=tests().filter(t=>t.date===date),ev=combinedEvents().filter(e=>e.date===date);const lines=[`${date} PROJECT 11122 결산`,`순공 ${hours}시간 / 완료 ${ts.filter(t=>t.done).length}/${ts.length}`,''];
 SUBJECTS.forEach(s=>{const a=ts.filter(t=>t.subject===s);if(a.length)lines.push(`${s}: ${a.map(t=>`${t.done?'완료':'미완료'} ${t.name}`).join(' / ')}`)});
 if(dayTests.length){lines.push('','시험 기록:');dayTests.forEach(t=>lines.push(t.kind==='single'?`${t.subject} ${t.series||t.category} ${t.round||''}: ${t.score}점, 원인 ${t.reason||'-'}`:`${t.name}: ${SUBJECTS.map(s=>`${s} ${t.scores[s]||'-'}`).join(', ')}`))}
 if(ev.length){lines.push('','오늘 일정: '+ev.map(e=>e.title).join(', '))}
 const miss=ts.filter(t=>!t.done);if(miss.length)lines.push('','조정 필요: '+miss.map(t=>`${t.subject} ${t.name}`).join(', '));return lines.join('\n')
}
function refreshDailyReportText(){$('#dailyReportText').value=dailyReport(selected)}
$('#refreshDailyReport')?.addEventListener('click',refreshDailyReportText);
async function copyText(text){try{await navigator.clipboard.writeText(text);alert('복사했습니다.')}catch{$('#dailyReportText').value=text;$('#dailyReportText').select();document.execCommand('copy');alert('복사했습니다.')}}
$('#copyDailyReport')?.addEventListener('click',()=>copyText($('#dailyReportText').value));
$('#copyReportQuick')?.addEventListener('click',()=>copyText(dailyReport(selected)));

$$('[data-open-page]').forEach(b=>b.onclick=()=>navigate(b.dataset.openPage));

/* ========================= CALENDAR ========================= */
function appEvents(){return get('p11122_v21_events',[])}
function googleEvents(){return get('p11122_v21_google_events',[])}
function combinedEvents(){return [...appEvents(),...googleEvents()].sort((a,b)=>(a.date+(a.start||'')).localeCompare(b.date+(b.start||'')))}
function eventDday(date){return Math.ceil((parse(date)-parse(ymd(now())))/86400000)}
function renderUpcomingEvents(){
 const from=selected,items=combinedEvents().filter(e=>e.date>=from).slice(0,5);$('#upcomingEvents').innerHTML=items.length?items.map(eventHtml).join(''):'<div class="calendar-empty">다가오는 일정이 없습니다.</div>'
}
function eventHtml(e,full=false){const d=eventDday(e.date),dd=d===0?'D-DAY':d>0?`D-${d}`:`D+${Math.abs(d)}`;return `<div class="event-card ${e.priority||'normal'}"><div class="event-date">${e.date}${e.allDay?' · 종일':e.start?' · '+e.start:''}<span class="d-day">${dd}</span> <span class="source-pill">${e.source==='google'?'Google':e.type||'일정'}</span></div><div class="event-title">${esc(e.title)}</div>${e.memo?`<div class="task-meta">${esc(e.memo)}</div>`:''}${full&&e.source!=='google'?`<div class="event-actions"><button class="btn ghost small edit-event" data-id="${e.id}">수정</button><button class="btn good small one-ics" data-id="${e.id}">ICS</button><button class="btn danger small del-event" data-id="${e.id}">삭제</button></div>`:''}</div>`}
function renderCalendarPage(){
 if(!$('#eventDate'))return;$('#eventDate').value=$('#eventDate').value||ymd(now());$('#googleOrigin').textContent=location.origin;const cfg=get('p11122_v21_google_config',{clientId:'',apiKey:''});$('#googleClientId').value=cfg.clientId;$('#googleApiKey').value=cfg.apiKey;
 const list=combinedEvents().filter(e=>e.date>=ymd(now())).slice(0,30);$('#eventList').innerHTML=list.length?list.map(e=>eventHtml(e,true)).join(''):'<div class="calendar-empty">일정이 없습니다.</div>';
 $$('.edit-event').forEach(b=>b.onclick=()=>editEvent(b.dataset.id));$$('.del-event').forEach(b=>b.onclick=()=>{set('p11122_v21_events',appEvents().filter(e=>e.id!==b.dataset.id));renderCalendarPage();renderDashboard()});$$('.one-ics').forEach(b=>b.onclick=()=>exportIcsFile(appEvents().filter(e=>e.id===b.dataset.id),`PROJECT11122_${b.dataset.id}.ics`));renderGoogleEvents()
}
function clearEventForm(){['eventId','eventTitle','eventStart','eventEnd','eventLocation','eventMemo'].forEach(id=>$('#'+id).value='');$('#eventDate').value=ymd(now());$('#eventType').value='시험';$('#eventPriority').value='normal';$('#eventAllDay').checked=true}
$('#clearEvent')?.addEventListener('click',clearEventForm);
$('#eventAllDay')?.addEventListener('change',e=>{$('#eventStart').disabled=e.target.checked;$('#eventEnd').disabled=e.target.checked});
$('#saveEvent')?.addEventListener('click',()=>{const list=appEvents(),id=$('#eventId').value,obj={id:id||uid(),title:$('#eventTitle').value.trim()||'새 일정',type:$('#eventType').value,date:$('#eventDate').value,priority:$('#eventPriority').value,allDay:$('#eventAllDay').checked,start:$('#eventStart').value,end:$('#eventEnd').value,location:$('#eventLocation').value.trim(),memo:$('#eventMemo').value.trim(),source:'app'};const i=list.findIndex(e=>e.id===id);i>=0?list[i]=obj:list.push(obj);set('p11122_v21_events',list);clearEventForm();renderCalendarPage();renderDashboard()});
function editEvent(id){const e=appEvents().find(x=>x.id===id);if(!e)return;$('#eventId').value=e.id;$('#eventTitle').value=e.title;$('#eventType').value=e.type;$('#eventDate').value=e.date;$('#eventPriority').value=e.priority;$('#eventAllDay').checked=e.allDay;$('#eventStart').value=e.start||'';$('#eventEnd').value=e.end||'';$('#eventLocation').value=e.location||'';$('#eventMemo').value=e.memo||'';window.scrollTo({top:0,behavior:'smooth'})}
function icsEscape(s){return String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')}
function icsDate(e,end=false){const date=e.date.replaceAll('-','');if(e.allDay)return end?nextDateString(e.date,1).replaceAll('-',''):date;const time=(end?e.end:e.start)||'00:00';return `${date}T${time.replace(':','')}00`}
function toIcs(events){const rows=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//PROJECT11122//KO','CALSCALE:GREGORIAN'];events.forEach(e=>{rows.push('BEGIN:VEVENT',`UID:${e.id}@project11122`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`);if(e.allDay){rows.push(`DTSTART;VALUE=DATE:${icsDate(e)}`,`DTEND;VALUE=DATE:${icsDate(e,true)}`)}else{rows.push(`DTSTART:${icsDate(e)}`,`DTEND:${icsDate(e,true)}`)}rows.push(`SUMMARY:${icsEscape(e.title)}`);if(e.memo)rows.push(`DESCRIPTION:${icsEscape(e.memo)}`);if(e.location)rows.push(`LOCATION:${icsEscape(e.location)}`);rows.push('END:VEVENT')});rows.push('END:VCALENDAR');return rows.join('\r\n')}
function exportIcsFile(events,name='PROJECT11122_calendar.ics'){const blob=new Blob([toIcs(events)],{type:'text/calendar;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
$('#exportIcs')?.addEventListener('click',()=>exportIcsFile(appEvents()));
$('#icsImport')?.addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const imported=parseIcs(await file.text()),list=appEvents(),seen=new Set(list.map(x=>x.id));imported.forEach(x=>{if(!seen.has(x.id))list.push(x)});set('p11122_v21_events',list);alert(`${imported.length}개 일정을 가져왔습니다.`);renderCalendarPage();renderDashboard()}catch(err){alert('ICS 파일을 읽지 못했습니다.')}});
function parseIcs(text){const lines=text.replace(/\r\n[ \t]/g,'').split(/\r?\n/),out=[];let e=null;for(const line of lines){if(line==='BEGIN:VEVENT'){e={source:'app',priority:'normal',type:'가져온 일정',allDay:false,start:'',end:'',location:'',memo:''};continue}if(line==='END:VEVENT'&&e){e.id=e.id||uid();if(e.title&&e.date)out.push(e);e=null;continue}if(!e)continue;const idx=line.indexOf(':');if(idx<0)continue;const key=line.slice(0,idx),value=line.slice(idx+1).replace(/\\n/g,'\n').replace(/\\([,;\\])/g,'$1');if(key.startsWith('UID'))e.id=value;if(key.startsWith('SUMMARY'))e.title=value;if(key.startsWith('DESCRIPTION'))e.memo=value;if(key.startsWith('LOCATION'))e.location=value;if(key.startsWith('DTSTART')){const p=parseIcsDate(value,key.includes('VALUE=DATE'));Object.assign(e,p)}if(key.startsWith('DTEND')){const p=parseIcsDate(value,key.includes('VALUE=DATE'));e.end=p.start||''}}
 return out}
function parseIcsDate(value,allDay){if(allDay||/^\d{8}$/.test(value)){return{date:`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`,allDay:true,start:''}}const clean=value.replace('Z',''),date=`${clean.slice(0,4)}-${clean.slice(4,6)}-${clean.slice(6,8)}`,start=`${clean.slice(9,11)}:${clean.slice(11,13)}`;return{date,allDay:false,start}}

/* Google Calendar read-only */
let googleTokenClient=null,googleReady=false;
function loadScriptOnce(src){return new Promise((resolve,reject)=>{const old=[...document.scripts].find(s=>s.src===src);if(old){if(old.dataset.loaded)resolve();else old.addEventListener('load',resolve,{once:true});return}const s=document.createElement('script');s.src=src;s.async=true;s.defer=true;s.onload=()=>{s.dataset.loaded='1';resolve()};s.onerror=reject;document.head.appendChild(s)})}
async function initGoogle(){const cfg=get('p11122_v21_google_config',{clientId:'',apiKey:''});if(!cfg.clientId||!cfg.apiKey)throw new Error('Client ID와 API Key를 먼저 저장하세요.');await Promise.all([loadScriptOnce('https://apis.google.com/js/api.js'),loadScriptOnce('https://accounts.google.com/gsi/client')]);await new Promise(resolve=>gapi.load('client',resolve));await gapi.client.init({apiKey:cfg.apiKey,discoveryDocs:['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']});googleTokenClient=google.accounts.oauth2.initTokenClient({client_id:cfg.clientId,scope:'https://www.googleapis.com/auth/calendar.readonly',callback:()=>{}});googleReady=true}
$('#saveGoogleConfig')?.addEventListener('click',()=>{set('p11122_v21_google_config',{clientId:$('#googleClientId').value.trim(),apiKey:$('#googleApiKey').value.trim()});$('#googleStatus').textContent='설정을 저장했습니다.'});
$('#connectGoogle')?.addEventListener('click',async()=>{try{$('#googleStatus').textContent='Google 라이브러리 준비 중…';if(!googleReady)await initGoogle();googleTokenClient.callback=async resp=>{if(resp.error){$('#googleStatus').textContent='연결 실패: '+resp.error;return}$('#googleStatus').textContent='연결되었습니다.';await fetchGoogleEvents()};googleTokenClient.requestAccessToken({prompt:gapi.client.getToken()?'':'consent'})}catch(err){$('#googleStatus').textContent='설정 오류: '+err.message}});
$('#refreshGoogle')?.addEventListener('click',async()=>{try{if(!googleReady)await initGoogle();if(!gapi.client.getToken()){alert('먼저 Google 연결을 눌러 주세요.');return}await fetchGoogleEvents()}catch(err){$('#googleStatus').textContent='새로고침 실패: '+err.message}});
$('#disconnectGoogle')?.addEventListener('click',()=>{try{const token=window.gapi?.client?.getToken();if(token)google.accounts.oauth2.revoke(token.access_token);gapi.client.setToken('')}catch{}set('p11122_v21_google_events',[]);$('#googleStatus').textContent='연결을 해제했습니다.';renderCalendarPage();renderDashboard()});
async function fetchGoogleEvents(){const max=new Date();max.setMonth(max.getMonth()+3);const res=await gapi.client.calendar.events.list({calendarId:'primary',timeMin:new Date().toISOString(),timeMax:max.toISOString(),showDeleted:false,singleEvents:true,maxResults:100,orderBy:'startTime'});const list=(res.result.items||[]).map(x=>{const raw=x.start?.dateTime||x.start?.date||'',end=x.end?.dateTime||x.end?.date||'',allDay=Boolean(x.start?.date);return{id:'g-'+x.id,title:x.summary||'(제목 없음)',type:'Google 일정',date:raw.slice(0,10),allDay,start:allDay?'':raw.slice(11,16),end:allDay?'':end.slice(11,16),priority:'normal',location:x.location||'',memo:x.description||'',source:'google'}});set('p11122_v21_google_events',list);$('#googleStatus').textContent=`Google 일정 ${list.length}개를 불러왔습니다.`;renderCalendarPage();renderDashboard()}
function renderGoogleEvents(){const list=googleEvents().filter(e=>e.date>=ymd(now())).slice(0,8);$('#googleEventList').innerHTML=list.length?list.map(e=>`<div class="google-event"><b>${esc(e.title)}</b><div class="task-meta">${e.date}${e.allDay?' · 종일':e.start?' · '+e.start:''}</div></div>`).join(''):'<div class="calendar-empty">저장된 Google 일정이 없습니다.</div>'}

/* Test templates */
$$('.test-template').forEach(b=>b.onclick=()=>{const t=b.dataset.template;$('#singleMode').click();if(t==='평가원'){$('#testCategory').value='평가원 기출';$('#testSeries').value='평가원 기출';$('#testRound').value=''}if(t==='전대'){$('#testCategory').value='학교 실모';$('#testSeries').value='전대 실모';$('#testRound').value=''}if(t==='우영호'){$('#testSubject').value='경제';$('#testCategory').value='강사 실모';$('#testSeries').value='우영호 실모';$('#testRound').value=''}if(t==='사문'){$('#testSubject').value='사회문화';$('#testCategory').value='사설 실모';$('#testSeries').value='사문 실모';$('#testRound').value=''}$('#testSeries').focus()});

function renderHikeDecision(){if(!$('#hikeDecision'))return;const st=settings(),checks=get('p11122_v2_hikeChecks',{}),count=Object.values(checks).filter(Boolean).length;let cls='rest',text='등산 OFF · 일반 회복일';if(st.hikeEnabled){if(count===5){cls='full';text='풀코스 권장 · 오후 공부 4~5시간'}else if(count>=3){cls='short';text='단축 코스 권장 · 오후 공부 3시간'}else{text='등산 대신 휴식 · 복습 1~2시간'}}$('#hikeDecision').className='hike-decision '+cls;$('#hikeDecision').textContent=text}
