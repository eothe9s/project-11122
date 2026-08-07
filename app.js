const VERSION='4.0';
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
  ['국어','must','All Of KICE Origin 9~12강','김승리 All Of KICE','가장 어려운 지문 재독','3시간 20분'],['수학','must','오르새 학습 블록','세부 진도 추후 입력','오전 집중 블록','2시간 30분'],['영어','should','빈칸 2+순서·삽입 4','평가원 기출','전날 오답 재풀이','1시간'],['사회문화','must','LIM IT 다음 2강','임정환 LIM IT','총강 수 확인 전 완강으로 처리하지 않음','1시간 30분'],['경제','must','LEAD IN 17~18강+적용','우영호 LEAD IN·마더텅','마더텅 10문제+그래프 재현','2시간 40분']],
  schedule:[['07:00~09:10','방학','국어 Origin 9~10강'],['09:20~11:50','방학','수학 오르새 블록'],['11:50~12:40','점심','식사·휴식'],['12:40~15:20','방학','경제 LEAD IN 17~18강+적용'],['15:30~17:00','방학','사문 LIM IT 다음 2강'],['17:10~18:10','방학','영어 빈칸·순서·삽입'],['18:10~19:00','저녁','식사·휴식'],['19:00~20:20','방학','국어 Origin 11~12강'],['20:20~20:40','마감','누적 복습']]},
 '2026-08-05':{mode:'방학 점검',goal:10.5,tasks:[
  ['국어','must','Origin 13~14강 완료+다음 과정 진입','김승리 All Of KICE','Origin 복습 후 Predator 시작','3시간'],['수학','must','오르새 학습 블록','세부 진도 추후 입력','이번 주 오답 정리 포함','2시간 30분'],['영어','must','평가원·수능 영어 진단 2회','연도·월 직접 기록','첫날과 점수·시간 비교','1시간 40분'],['사회문화','must','LIM IT 다음 2강 또는 실제 완강 확인','총강 수 입력 후 자동 전환','완강 확인 전에는 다음 강의, 완강 후에만 실모','1시간 30분'],['경제','must','LEAD IN 19~20강+누적 테스트','우영호 LEAD IN·마더텅','13~20강 누적 15~20문제','2시간 40분']],
  schedule:[['07:00~09:00','방학','국어 Origin 13~14강+복습'],['09:10~11:40','방학','수학 오르새 블록'],['11:40~12:30','점심','식사·휴식'],['12:30~15:10','방학','경제 19~20강+누적 테스트'],['15:20~16:50','방학','사문 LIM IT 진도 또는 완강 후 실모'],['17:00~18:40','방학','영어 전체 진단+오답'],['18:40~19:30','저녁','식사·휴식'],['19:30~20:30','점검','4일 성적·진도 결산']]},
 '2026-08-06':{mode:'학기 중 토요일 시간표',goal:8.0,tasks:[
  ['국어','must','All Of KICE 다음 과정 2블록','김승리 All Of KICE','1교시·4교시에 배치','2시간 20분'],['수학','must','오르새 학습 블록','세부 진도 추후 입력','3교시+하교 후','3시간'],['영어','should','단어+취약 유형','기출 오답','점심 20분+저녁 40분','1시간'],['사회문화','must','LIM IT 완강 확인 시 실모, 아니면 다음 강의','총강 수 입력 후 자동 전환','5교시 60분','1시간'],['경제','must','LEAD IN 21~22강 또는 적용','우영호 LEAD IN·마더텅','2교시·6교시','2시간 10분']],
  schedule:[['08:40~09:50','1교시 · 수업명 입력','국어 All Of KICE 다음 진도'],['10:00~11:10','2교시 · 수업명 입력','경제 LEAD IN 21강+교재'],['11:20~12:30','3교시 · 수업명 입력','수학 오르새 블록'],['12:30~13:30','점심','식사 40분+영어 단어 20분'],['13:30~14:40','4교시 · 수업명 입력','국어 All Of KICE 다음 진도'],['14:50~15:50','5교시 · 수업명 입력','사문 실모 30분+분석 30분'],['16:00~17:00','6교시 · 수업명 입력','경제 LEAD IN 22강/마더텅'],['17:40~19:40','하교 후','수학 오르새 블록'],['19:50~20:30','마감','영어 취약 유형 또는 누적 복습']]}
};

function buildInitial(){const tasks={},schedules={};Object.entries(INITIAL_WEEK).forEach(([date,d])=>{tasks[date]=d.tasks.map(x=>({id:uid(),subject:x[0],priority:x[1],name:x[2],material:x[3],note:x[4],duration:x[5],done:false}));schedules[date]=d.schedule.map(x=>({id:uid(),time:x[0],school:x[1],study:x[2],done:false}))});return{tasks,schedules}}
const INITIAL=buildInitial();
function settings(){return get('p11122_v2_settings',{vacationGoal:10.8,schoolGoal:9.5,hikeEnabled:false,lectureDailyCap:5})}
function allTasks(){return get('p11122_v2_tasks',INITIAL.tasks)}
function allSchedules(){return get('p11122_v2_schedules',INITIAL.schedules)}
function saveTasks(date,tasks){const m=allTasks();m[date]=tasks;set('p11122_v2_tasks',m)}
function saveSchedules(date,slots){const m=allSchedules();m[date]=slots;set('p11122_v2_schedules',m)}
function tasksFor(date){const m=allTasks();if(!m[date]){m[date]=SUBJECTS.map((s,i)=>({id:uid(),subject:s,priority:[0,1,4].includes(i)?'must':'should',name:'직접 계획 입력',material:'',note:'',duration:'',done:false}));set('p11122_v2_tasks',m)}return m[date]}
function scheduleFor(date){
 const m=allSchedules();
 if(!m[date]){
   const day=parse(date).getDay();
   m[date]=(day>=1&&day<=5)?schoolScheduleForDate(date):[];
   set('p11122_v2_schedules',m)
 }
 return m[date]
}
function phase(date){if(date<='2026-08-01')return'사관학교 집중';if(date<='2026-08-05')return'방학 압축 부팅';if(date<='2026-08-12')return'기반 완성';if(date<='2026-08-19')return'기출 전환';if(date<='2026-08-26')return'11122 진입';return'실전 고정'}
let selected=ymd(now())<'2026-08-02'?'2026-08-02':ymd(now());

$$('nav button').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
$('#settingsGear')?.addEventListener('click',()=>navigate('data'));
function navigate(page){$$('.section').forEach(s=>s.classList.toggle('active',s.id===page));$$('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));const nav=$(`nav button[data-page="${page}"]`);$('#pageTitle').textContent=nav?nav.textContent:(page==='data'?'설정·백업':'PROJECT 11122');if(page==='manager')renderManager();if(page==='condition')renderCondition();if(page==='week')renderWeek();if(page==='school')renderSchool();if(page==='lectures')renderLearningVending();if(page==='courses')renderCourses();if(page==='tests')renderTests();if(page==='report')renderReport();if(page==='hike')renderHike()}

function renderDashboard(){const ts=tasksFor(selected),slots=scheduleFor(selected),done=ts.filter(t=>t.done).length,rate=ts.length?Math.round(done/ts.length*100):0;$('#phaseBadge').textContent=phase(selected);const info=INITIAL_WEEK[selected],st=settings(),mode=info?.mode||(parse(selected).getDay()===0?'일요일 회복':'학기 모드');$('#modeText').textContent=mode;const goalOverrides=get('p11122_v23_goals',{});$('#goalHours').textContent=(goalOverrides[selected]??info?.goal??(parse(selected).getDay()===0?4.5:st.schoolGoal)).toFixed(1);$('#todayRate').textContent=rate+'%';$('#todayBar').style.width=rate+'%';const h=get('p11122_v2_hours',{});$('#hoursInput').value=h[selected]||'';const[ws,we]=weekBounds(parse(selected));let wh=0;for(let d=new Date(ws);d<=we;d.setDate(d.getDate()+1))wh+=Number(h[ymd(d)]||0);$('#weekStudy').textContent=wh.toFixed(1);renderTasks(ts);renderSchedule(slots);renderConditionQuick();renderFeasibilityQuick();renderMinimumSuccess()}
function renderTasks(ts){const box=$('#todayTasks');box.innerHTML='';ts.forEach(t=>{const e=document.createElement('div');e.className='task'+(t.done?' done':'');e.innerHTML=`<div class="task-main"><input type="checkbox" ${t.done?'checked':''}><div><div><span class="priority ${t.priority}">${PRIORITY_LABEL[t.priority]}</span><span class="subject">${esc(t.subject)}</span><span class="task-title">${esc(t.name)}</span></div><div class="task-meta">${esc(t.material)}${t.duration?' · '+esc(t.duration):''}${t.note?' · '+esc(t.note):''}</div></div><div class="task-actions"><button class="btn ghost small edit">수정</button><button class="btn danger small del">삭제</button></div></div>`;e.querySelector('input').onchange=x=>{t.done=x.target.checked;if(t.done&&Array.isArray(t.lectureIds))markLecturesCompleted(t.lectureIds,true);if(t.done&&t.bookItem?.mode==='subunit'&&t.bookItem.subunit)markBookSubunitCompleted(t.bookItem.bookId,t.bookItem.subunit,true);saveTasks(selected,ts);renderDashboard();if($('#lectures')?.classList.contains('active'))renderLearningVending()};e.querySelector('.edit').onclick=()=>openTask(t);e.querySelector('.del').onclick=()=>{if(confirm('삭제할까요?')){saveTasks(selected,ts.filter(x=>x.id!==t.id));renderDashboard()}};box.appendChild(e)})}
function renderSchedule(slots){const box=$('#todaySchedule');box.innerHTML=slots.length?'':'<div class="note">시간표가 없습니다.</div>';slots.forEach(s=>{const e=document.createElement('div');e.className='slot'+(s.done?' done':'');const study=genericStudyText(s);e.innerHTML=`<div class="time">${esc(s.time||'')}</div><div class="school">${s.locked?'🔒 ':''}${esc(s.name||s.school||'')}</div><div class="study">${esc(study||(s.selfStudy?'할 일 미배정':s.study||''))}</div><div class="slot-actions">${s.selfStudy?'<button class="btn ghost small slot-edit-study">수정</button>':''}<label><input type="checkbox" ${s.done?'checked':''}> 완료</label></div>`;const chk=e.querySelector('input');if(chk)chk.onchange=x=>{s.done=x.target.checked;saveTimeline(selected,slots);renderDashboard()};const edit=e.querySelector('.slot-edit-study');if(edit)edit.onclick=()=>{const v=prompt('이 블록에서 할 일을 입력하세요.',study);if(v===null)return;s.study=v.trim();saveTimeline(selected,slots);renderDashboard()};box.appendChild(e)})}
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

const SCHOOL_TIMETABLE={
 '1':[['물리학Ⅱ',false,false],['인공지능수학',false,false],['지구과학Ⅱ',true,false],['진로',true,true],['언어와매체',false,false],['미적분',false,false],['공강',true,true]],
 '2':[['지구과학Ⅱ',true,false],['과학과제연구',true,false],['화학Ⅱ',false,false],['사회문제탐구',true,true],['정보과제연구',true,true],['물리학Ⅱ',false,false],['생명과학Ⅱ',true,false]],
 '3':[['미적분',false,false],['정보과제연구',true,true],['스포츠생활',false,false],['화학Ⅱ',false,false],['과학융합',true,true],['공강',true,true],['공강',true,true]],
 '4':[['지구과학Ⅱ',true,false],['사회문제탐구',true,true],['미적분',false,false],['생명과학Ⅱ',true,false],['과학융합',true,true],['물리학Ⅱ',false,false],['언어와매체',false,false]],
 '5':[['환경',true,true],['과학과제연구',true,false],['인공지능수학',false,false],['화학Ⅱ',false,false],['공강',true,true],['공강',true,true],['생명과학Ⅱ',true,false]]
};
const DAY_NAMES={0:'일요일',1:'월요일',2:'화요일',3:'수요일',4:'목요일',5:'금요일',6:'토요일'};
const SATURDAY_BLOCKS=[['08:40','09:50','1교시'],['10:00','11:10','2교시'],['11:20','12:30','3교시'],['13:30','14:40','4교시'],['14:50','15:50','5교시'],['16:00','17:00','6교시']];
function fixedSchoolMap(){const out={};Object.entries(SCHOOL_TIMETABLE).forEach(([day,rows])=>out[day]=rows.map((r,i)=>({id:`school-${day}-${i+1}`,period:i+1,time:`${i+1}교시`,school:r[0],selfStudy:Boolean(r[1]),device:Boolean(r[2]),study:r[1]?(r[2]?'전자기기 자습':'종이 자습'):'학교 수업'})));return out}
function schoolMap(){return get('p11122_v2_school',fixedSchoolMap())}
function baseTimelineForDate(date){
 const day=parse(date).getDay(),blocks=[];
 if(day>=1&&day<=5){
  (schoolMap()[String(day)]||[]).forEach(p=>blocks.push({id:`${date}-regular-${p.period}`,order:p.period,time:`${p.period}교시`,start:'',end:'',name:p.school,type:p.selfStudy?'self':'class',school:p.school,selfStudy:p.selfStudy,device:p.device,study:p.selfStudy?'':'학교 수업',locked:false,done:false,regular:true,v4Timeline:true}));
  const afterName=day<=3?'방과후 자습':day===4?'나혜주 선생님 영어 독해':'문두열 선생님 수학Ⅰ·수학Ⅱ·미적분(상)',afterSelf=day<=3;
  blocks.push({id:`${date}-after`,order:20,time:'16:45~17:45',start:'16:45',end:'17:45',name:afterName,type:afterSelf?'self':'class',school:afterName,selfStudy:afterSelf,device:afterSelf,study:afterSelf?'':'방과후 수업',locked:!afterSelf,done:false,v4Timeline:true});
  blocks.push({id:`${date}-dinner`,order:21,time:'17:45~18:40',start:'17:45',end:'18:40',name:'석식',type:'meal',school:'석식',selfStudy:false,device:false,study:'식사·휴식',locked:true,done:false,v4Timeline:true});
  blocks.push({id:`${date}-night1`,order:22,time:'18:40~20:20',start:'18:40',end:'20:20',name:'야간자율학습 1',type:'self',school:'야간자율학습 1',selfStudy:true,device:true,study:'',locked:false,done:false,v4Timeline:true});
  blocks.push({id:`${date}-break`,order:23,time:'20:20~20:30',start:'20:20',end:'20:30',name:'쉬는 시간',type:'break',school:'쉬는 시간',selfStudy:false,device:false,study:'휴식',locked:true,done:false,v4Timeline:true});
  blocks.push({id:`${date}-night2`,order:24,time:'20:30~22:00',start:'20:30',end:'22:00',name:'야간자율학습 2',type:'self',school:'야간자율학습 2',selfStudy:true,device:true,study:'',locked:false,done:false,v4Timeline:true})
 }else if(day===6){
  SATURDAY_BLOCKS.forEach((b,i)=>blocks.push({id:`${date}-sat-${i+1}`,order:i+1,time:`${b[0]}~${b[1]}`,start:b[0],end:b[1],name:b[2],type:'self',school:`토요일 ${b[2]}`,selfStudy:true,device:true,study:'',locked:false,done:false,v4Timeline:true}))
 }
 return blocks
}
function timelineForDate(date){const all=allSchedules();if(!all[date]||!all[date].some(x=>x.v4Timeline)){const old=Array.isArray(all[date])?all[date]:[],base=baseTimelineForDate(date);old.forEach(o=>{let t=null;const m=String(o.school||'').match(/(\d+)교시/);if(m)t=base.find(x=>x.regular&&x.order===Number(m[1]));if(!t&&o.time)t=base.find(x=>x.time===o.time);if(t&&o.study&&!['학교 수업','전자기기 자습','종이 자습'].includes(o.study))t.study=o.study});all[date]=base;set('p11122_v2_schedules',all)}return all[date].sort((a,b)=>(a.order??99)-(b.order??99))}
function scheduleFor(date){return timelineForDate(date)}
function saveTimeline(date,blocks){const all=allSchedules();all[date]=blocks.map(x=>({...x,v4Timeline:true}));set('p11122_v2_schedules',all)}
function timeMinutes(start,end){if(!start||!end)return 0;const [sh,sm]=start.split(':').map(Number),[eh,em]=end.split(':').map(Number);let a=sh*60+sm,b=eh*60+em;if(b<a)b+=1440;return Math.max(0,b-a)}
function genericStudyText(b){if(!b.selfStudy)return b.study||'';if(b.study&&!['전자기기 자습','종이 자습'].includes(b.study))return b.study;return ''}
function renderSchoolWeekGrid(){const map=schoolMap(),days=['1','2','3','4','5'];let self=0,device=0,paper=0;days.forEach(d=>(map[d]||[]).forEach(p=>{if(p.selfStudy){self++;p.device?device++:paper++}}));$('#schoolSelfStudyCount').textContent=self;$('#schoolDeviceCount').textContent=device;$('#schoolPaperCount').textContent=paper;$('#schoolWeekGrid').innerHTML=[1,2,3,4,5,6,7].map(period=>`<tr><th>${period}교시</th>${days.map(day=>{const p=(map[day]||[]).find(x=>Number(x.period)===period)||{};return `<td><div class="school-cell"><div class="period-time">${period}교시</div><strong>${esc(p.school||'')}</strong><div class="school-cell-tags">${p.selfStudy?'<span class="school-tag self">자습</span>':''}${p.selfStudy?(p.device?'<span class="school-tag device">전자기기</span>':'<span class="school-tag paper">종이</span>'):''}</div></div></td>`}).join('')}</tr>`).join('')}
function renderTimelineSummary(date,blocks){if(!$('#availableStudySummary'))return;const self=blocks.filter(x=>x.selfStudy),regular=self.filter(x=>x.regular).length,known=self.reduce((s,x)=>s+timeMinutes(x.start,x.end),0),device=self.filter(x=>x.device).length,assigned=self.filter(x=>genericStudyText(x)).length;$('#availableStudySummary').innerHTML=`<div class="timeline-stat"><span>정규 자습</span><b>${regular}교시</b></div><div class="timeline-stat"><span>시각 확정 자습</span><b>${known}분</b></div><div class="timeline-stat"><span>전자기기 가능</span><b>${device}블록</b></div><div class="timeline-stat"><span>할 일 배정</span><b>${assigned}/${self.length}</b></div>`}
function renderTimelineEditor(){if(!$('#dailyTimelineEditor'))return;const date=$('#timelineDate').value||selected,blocks=timelineForDate(date);$('#timelineDate').value=date;renderTimelineSummary(date,blocks);$('#dailyTimelineEditor').innerHTML=blocks.length?blocks.map(b=>`<div class="timeline-block ${b.locked?'locked':''} ${b.done?'done':''}"><div class="timeline-time">${esc(b.time||b.name)}</div><div><div class="timeline-name">${b.locked?'🔒 ':''}${esc(b.name||b.school||'시간 블록')}</div><div class="timeline-study ${genericStudyText(b)?'':'timeline-empty-study'}">${esc(genericStudyText(b)||(b.selfStudy?'할 일 미배정':b.study||''))}</div><div class="timeline-tags">${b.selfStudy?'<span class="school-tag self">자습</span>':''}${b.selfStudy?(b.device?'<span class="school-tag device">전자기기</span>':'<span class="school-tag paper">종이</span>'):''}</div></div><div class="timeline-actions">${b.selfStudy?`<button class="btn ghost small assign-block" data-id="${b.id}">할 일 수정</button>`:''}<button class="btn ghost small edit-block" data-id="${b.id}">블록 설정</button><label><input class="timeline-done" data-id="${b.id}" type="checkbox" ${b.done?'checked':''}> 완료</label></div></div>`).join(''):'<div class="note">기본 시간표가 없습니다. 집 공부나 시간 블록을 추가할 수 있습니다.</div>';$$('.assign-block').forEach(btn=>btn.onclick=()=>{const b=blocks.find(x=>x.id===btn.dataset.id),v=prompt('이 블록에서 할 일을 입력하세요. 비우면 미배정입니다.',genericStudyText(b));if(v===null)return;b.study=v.trim();saveTimeline(date,blocks);renderTimelineEditor();if(date===selected)renderDashboard()});$$('.edit-block').forEach(btn=>btn.onclick=()=>openTimeBlockModal(date,blocks.find(x=>x.id===btn.dataset.id)));$$('.timeline-done').forEach(ch=>ch.onchange=()=>{const b=blocks.find(x=>x.id===ch.dataset.id);if(b)b.done=ch.checked;saveTimeline(date,blocks);if(date===selected)renderDashboard()})}
function renderSchool(){renderSchoolWeekGrid();renderTimelineEditor()}
$('#timelineDate')?.addEventListener('change',renderTimelineEditor);
function openTimeBlockModal(date,b=null,home=false){$('#timeBlockModalTitle').textContent=b?'시간 블록 수정':home?'집 공부 추가':'시간 블록 추가';$('#timeBlockId').value=b?.id||'';$('#timeBlockDate').value=date;$('#timeBlockName').value=b?.name||(home?'집 공부':'');$('#timeBlockType').value=b?.type||'self';$('#timeBlockStart').value=b?.start||(home?'22:20':'');$('#timeBlockEnd').value=b?.end||(home?'23:00':'');$('#timeBlockStudy').value=genericStudyText(b||{})||'';$('#timeBlockSelfStudy').checked=b?Boolean(b.selfStudy):true;$('#timeBlockDevice').checked=b?Boolean(b.device):true;$('#timeBlockLocked').checked=b?Boolean(b.locked):false;$('#deleteTimeBlock').style.display=b&&!b.regular?'inline-flex':'none';$('#timeBlockModal').classList.add('show')}
$('#addHomeStudy')?.addEventListener('click',()=>openTimeBlockModal($('#timelineDate').value||selected,null,true));
$('#addCustomBlock')?.addEventListener('click',()=>openTimeBlockModal($('#timelineDate').value||selected,null,false));
$('#saveTimeBlock')?.addEventListener('click',()=>{const date=$('#timeBlockDate').value,blocks=timelineForDate(date),id=$('#timeBlockId').value;let b=id?blocks.find(x=>x.id===id):null;if(!b){b={id:uid(),order:80+blocks.length,v4Timeline:true,regular:false,done:false};blocks.push(b)}const start=$('#timeBlockStart').value,end=$('#timeBlockEnd').value;b.name=$('#timeBlockName').value.trim()||'시간 블록';b.type=$('#timeBlockType').value;b.start=start;b.end=end;b.time=start&&end?`${start}~${end}`:b.time||b.name;b.school=b.name;b.study=$('#timeBlockStudy').value.trim();b.selfStudy=$('#timeBlockSelfStudy').checked;b.device=b.selfStudy&&$('#timeBlockDevice').checked;b.locked=$('#timeBlockLocked').checked;saveTimeline(date,blocks);$('#timeBlockModal').classList.remove('show');renderTimelineEditor();if(date===selected)renderDashboard()});
$('#deleteTimeBlock')?.addEventListener('click',()=>{const date=$('#timeBlockDate').value,id=$('#timeBlockId').value,blocks=timelineForDate(date),b=blocks.find(x=>x.id===id);if(!b||b.regular||!confirm('이 시간 블록을 삭제할까요?'))return;saveTimeline(date,blocks.filter(x=>x.id!==id));$('#timeBlockModal').classList.remove('show');renderTimelineEditor();if(date===selected)renderDashboard()});
$('#resetTimeline')?.addEventListener('click',()=>{const date=$('#timelineDate').value||selected;if(!confirm(`${date} 시간표를 기본 구조로 복원할까요?`))return;const all=allSchedules();all[date]=baseTimelineForDate(date);set('p11122_v2_schedules',all);renderTimelineEditor();if(date===selected)renderDashboard()});

const COURSE_META={
 'Origin':{deadline:'2026-08-10',dailyTarget:3},
 'Predator 독서':{deadline:'2026-08-22',dailyTarget:2},
 'Predator 문학':{deadline:'2026-08-27',dailyTarget:2},
 'Predator 독서 W.O.W':{deadline:'2026-09-01',dailyTarget:2},
 'LEAD IN':{deadline:'2026-08-14',dailyTarget:2},
 'CORE':{deadline:'2026-08-29',dailyTarget:1},
 '마더텅':{deadline:'2026-09-01',dailyTarget:1},
 'LIM IT':{deadline:'2026-08-10',dailyTarget:2},
 '사문 실모':{deadline:'2026-09-01',dailyTarget:1},
 '오르새 수학':{deadline:'2026-08-31',dailyTarget:1},
 '영어 일일 루틴':{deadline:'2026-09-01',dailyTarget:1}
};
const COURSE_TOTALS={
 'Origin':14,'Predator 독서':32,'Predator 문학':38,'Predator 독서 W.O.W':56,
 'LEAD IN':29,'CORE':7,'마더텅':25,'LIM IT':30
};
function courseData(){
 const base={
  kor:[
   {name:'Origin',done:0,total:14,note:'All Of KICE 첫 과정'},
   {name:'Predator 독서',done:0,total:32,note:'All Of KICE 독서'},
   {name:'Predator 문학',done:0,total:38,note:'All Of KICE 문학'},
   {name:'Predator 독서 W.O.W',done:0,total:56,note:'All Of KICE 독서 W.O.W'}
  ],
  eco:[
   {name:'LEAD IN',done:12,total:29,note:'13강부터 재개'},
   {name:'CORE',done:0,total:7,note:'LEAD IN 후 자료 분석'},
   {name:'마더텅',done:0,total:25,note:'빨간 마더텅 · 강의와 병행'}
  ],
  soc:[
   {name:'LIM IT',done:25,total:30,note:'26~30강 남음'},
   {name:'사문 실모',done:0,total:0,note:'LIM IT 완강 후 하루 1회+분석'}
  ],
  other:[
   {name:'오르새 수학',done:0,total:0,note:'세부 진도 추후 확정'},
   {name:'영어 일일 루틴',done:0,total:0,note:'매일 50~60분'}
  ]
 };
 const stored=get('p11122_v2_courses',base);
 Object.keys(base).forEach(key=>{
  if(!Array.isArray(stored[key]))stored[key]=base[key];
  const knownNames=new Set(base[key].map(x=>x.name));
  stored[key]=stored[key].map(c=>{
   let name=c.name==='W.O.W'?'Predator 독서 W.O.W':c.name;
   return {...COURSE_META[name],...c,name,total:COURSE_TOTALS[name]??c.total}
  });
  base[key].forEach(b=>{if(!stored[key].some(c=>c.name===b.name))stored[key].push({...COURSE_META[b.name],...b})});
 });
 return stored
}
function studyDaysUntil(deadline){
 const today=parse(ymd(now())),end=parse(deadline||'2026-09-01');
 if(end<today)return 0;
 let count=0;
 for(let d=new Date(today);d<=end;d.setDate(d.getDate()+1)){if(d.getDay()!==0)count++}
 return count
}
function forecastCourse(c){
 const done=Number(c.done||0),total=Number(c.total||0),daily=Number(c.dailyTarget||0),days=studyDaysUntil(c.deadline);
 if(!total)return{state:'unknown',label:'검증 불가',text:`총강·총회차가 입력되지 않았습니다. 목표일 ${c.deadline||'미입력'}`};
 const remain=Math.max(0,total-done);
 if(remain===0)return{state:'ok',label:'완료',text:`${done}/${total} 완료`};
 if(days<=0)return{state:'danger',label:'기한 초과',text:`${remain}개 남음 · 목표일 ${c.deadline}`};
 const need=remain/days;
 if(!daily)return{state:'unknown',label:'기준량 없음',text:`${remain}개 남음 · 하루 ${need.toFixed(1)}개 필요`};
 const ratio=need/daily;
 return{
   state:ratio<=1?'ok':ratio<=1.25?'tight':'danger',
   label:ratio<=1?'가능':ratio<=1.25?'빡빡':'위험',
   text:`${remain}개 남음 · ${days}학습일 · 하루 ${need.toFixed(1)}개 필요 / 기준 ${daily}개`
 }
}
function renderCourses(){const d=courseData();renderCourseBox('#korCourses',d.kor,'kor');renderCourseBox('#ecoCourses',d.eco,'eco');renderCourseBox('#socCourses',d.soc,'soc');renderCourseBox('#otherCourses',d.other,'other');renderFeasibility()}
function renderCourseBox(sel,arr,key){
 $(sel).innerHTML=arr.map((c,i)=>{const pct=c.total?Math.min(100,Math.round(c.done/c.total*100)):0,f=forecastCourse(c);return `<div class="course"><div class="course-head"><div><div class="course-title">${esc(c.name)}</div><div class="course-sub">${esc(c.note)}</div></div><button class="btn ghost small" data-i="${i}">진도 수정</button></div><div class="course-progress"><div style="width:${pct}%"></div></div><div class="task-meta">${c.total?`${c.done}/${c.total}강·회차 · ${pct}%`:`현재 ${c.done} · 총량 미입력`}</div><div class="course-forecast"><b>${f.label}</b> · ${esc(f.text)}<br>목표일 ${c.deadline||'-'} · 하루 기준 ${c.dailyTarget||'-'}개</div></div>`}).join('');
 $$(sel+' button').forEach(b=>b.onclick=()=>{
   const c=arr[Number(b.dataset.i)];
   const done=prompt(`${c.name} 현재 완료 강·회차`,c.done);if(done===null)return;
   const total=prompt(`${c.name} 전체 강·회차 (모르면 0)`,c.total);if(total===null)return;
   const deadline=prompt(`${c.name} 목표 완료일 (YYYY-MM-DD)`,c.deadline||'2026-08-31');if(deadline===null)return;
   const daily=prompt(`${c.name} 하루 현실 기준량`,c.dailyTarget||1);if(daily===null)return;
   c.done=Number(done||0);c.total=Number(total||0);c.deadline=deadline;c.dailyTarget=Number(daily||0);
   const all=courseData();all[key]=arr;set('p11122_v2_courses',all);syncLectureStateFromCourseProgress(c);renderCourses();if($('#lectures'))renderLectures()
 })
}

$('#testDate').value=$('#fullDate').value=ymd(now());$('#singleMode').onclick=()=>{$('#singleForm').classList.remove('hidden');$('#fullForm').classList.add('hidden');$('#singleMode').className='btn primary small';$('#fullMode').className='btn ghost small'};$('#fullMode').onclick=()=>{$('#singleForm').classList.add('hidden');$('#fullForm').classList.remove('hidden');$('#fullMode').className='btn primary small';$('#singleMode').className='btn ghost small'};$('#fullScoreInputs').innerHTML=SUBJECTS.map(s=>`<label>${s}<div class="full-score-pair"><input class="input full-score" data-sub="${s}" type="number" min="0" max="${s==='사회문화'||s==='경제'?50:100}" placeholder="점수"><select class="input full-grade" data-sub="${s}"><option value="">등급</option><option value="1">1등급</option><option value="2">2등급</option><option value="3">3등급</option><option value="4">4등급</option><option value="5">5등급 이하</option></select></div></label>`).join('');
function tests(){return get('p11122_v2_tests',[])}
$('#saveSingleTest').onclick=()=>{const a=tests();a.push({id:uid(),kind:'single',date:$('#testDate').value,subject:$('#testSubject').value,category:$('#testCategory').value,select:$('#testSelect').value,series:$('#testSeries').value,round:$('#testRound').value,year:$('#testYear').value,month:$('#testMonth').value,score:Number($('#testScore').value||0),grade:Number($('#testGrade').value||0),time:$('#testTime').value,wrong:Number($('#wrongCount').value||0),reason:$('#wrongReason').value,memo:$('#testMemo').value});set('p11122_v2_tests',a);savePrescriptionFromTest(a[a.length-1]);renderTests();alert('저장했습니다.')};
$('#saveFullTest').onclick=()=>{const scores={},grades={};$$('.full-score').forEach(x=>scores[x.dataset.sub]=Number(x.value||0));$$('.full-grade').forEach(x=>grades[x.dataset.sub]=Number(x.value||0));const a=tests();a.push({id:uid(),kind:'full',date:$('#fullDate').value,name:$('#fullName').value||'전과목 모의고사',memo:$('#fullMemo').value,scores,grades});set('p11122_v2_tests',a);savePrescriptionFromTest(a[a.length-1]);renderTests();alert('저장했습니다.')};
function renderTests(){const a=tests().sort((x,y)=>x.date.localeCompare(y.date));drawChart(a);$('#testList').innerHTML=a.length?a.slice().reverse().map(t=>`<div class="test-card"><div class="row" style="justify-content:space-between"><div><div class="test-title">${t.kind==='full'?esc(t.name):`${esc(t.subject)} · ${esc(t.series||t.category)} ${esc(t.round||'')}`}</div><div class="test-meta">${t.date}${t.kind==='single'?` · ${esc(t.year)} ${esc(t.month)} · ${esc(t.select)}`:''}</div></div><button class="btn danger small" data-id="${t.id}">삭제</button></div><div>${t.kind==='full'?SUBJECTS.map(s=>`<span class="score-pill">${s} ${t.scores[s]||'-'}${t.grades?.[s]?` · ${t.grades[s]}등급`:''}</span>`).join(''):`<span class="score-pill">${t.score}점</span>${t.grade?`<span class="score-pill">${t.grade}등급</span>`:''}<span class="score-pill">${esc(t.time)}</span><span class="score-pill">오답 ${t.wrong}</span><span class="score-pill">${esc(t.reason)}</span>`}</div>${t.memo?`<div class="task-meta">${esc(t.memo)}</div>`:''}</div>`).join(''):'<div class="note">아직 기록이 없습니다.</div>';$$('#testList button').forEach(b=>b.onclick=()=>{set('p11122_v2_tests',a.filter(x=>x.id!==b.dataset.id));renderTests()});const latest=a.slice(-5).reverse();$('#testSummary').innerHTML=latest.length?latest.map(t=>`<div class="test-card"><b>${t.date}</b> · ${t.kind==='full'?esc(t.name):`${esc(t.subject)} ${esc(t.series||t.category)}`}<div class="task-meta">${t.kind==='single'?`${t.score}점 · ${esc(t.reason)}`:SUBJECTS.map(s=>`${s} ${t.scores[s]||'-'}`).join(' · ')}</div></div>`).join(''):'<div class="note">최근 시험이 없습니다.</div>'}
function drawChart(a){const c=$('#scoreChart'),ctx=c.getContext('2d'),r=c.getBoundingClientRect(),dpr=devicePixelRatio||1;c.width=Math.max(1,r.width*dpr);c.height=Math.max(1,r.height*dpr);ctx.scale(dpr,dpr);const w=r.width,h=r.height,p=34;ctx.clearRect(0,0,w,h);ctx.strokeStyle='#e1e5ed';for(let i=0;i<=5;i++){const y=p+(h-2*p)*i/5;ctx.beginPath();ctx.moveTo(p,y);ctx.lineTo(w-p,y);ctx.stroke()}const rows=[];a.forEach(t=>{if(t.kind==='full')SUBJECTS.forEach(s=>rows.push({date:t.date,subject:s,score:t.scores[s]}));else rows.push({date:t.date,subject:t.subject,score:t.score})});if(!rows.length){ctx.fillStyle='#7a8392';ctx.fillText('시험을 기록하면 그래프가 표시됩니다.',p,55);return}const colors={국어:'#3658df',수학:'#7657d9',영어:'#14825d',사회문화:'#c38a17',경제:'#c43d57'};SUBJECTS.forEach(s=>{const vals=rows.filter(x=>x.subject===s&&x.score>0);if(!vals.length)return;ctx.strokeStyle=colors[s];ctx.lineWidth=2;ctx.beginPath();vals.forEach((v,i)=>{const max=s==='사회문화'||s==='경제'?50:100,x=p+(w-2*p)*(vals.length===1?.5:i/(vals.length-1)),y=h-p-(h-2*p)*(v.score/max);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()});let lx=p;SUBJECTS.forEach(s=>{ctx.fillStyle=colors[s];ctx.fillRect(lx,9,9,9);ctx.fillStyle='#3e4655';ctx.fillText(s,lx+12,18);lx+=s.length>2?67:48})}
window.addEventListener('resize',()=>{if($('#tests').classList.contains('active'))renderTests()});

function renderReport(){const[ws,we]=weekBounds(parse(selected)),tm=allTasks(),hm=get('p11122_v2_hours',{});let hours=0,done=0,total=0,sub={};SUBJECTS.forEach(s=>sub[s]={done:0,total:0});for(let d=new Date(ws);d<=we;d.setDate(d.getDate()+1)){const ds=ymd(d);hours+=Number(hm[ds]||0);(tm[ds]||[]).forEach(t=>{total++;if(t.done)done++;if(sub[t.subject]){sub[t.subject].total++;if(t.done)sub[t.subject].done++}})}const rate=total?Math.round(done/total*100):0;$('#repHours').textContent=hours.toFixed(1);$('#repRate').textContent=rate+'%';$('#repTests').textContent=tests().filter(t=>parse(t.date)>=ws&&parse(t.date)<=we).length;$('#repHike').textContent=settings().hikeEnabled?'ON':'OFF';$('#subjectReport').innerHTML=SUBJECTS.map(s=>`<tr><td>${s}</td><td>${sub[s].done}</td><td>${sub[s].total}</td><td>${sub[s].total?Math.round(sub[s].done/sub[s].total*100):0}%</td></tr>`).join('');const weak=SUBJECTS.map(s=>[s,sub[s].total?sub[s].done/sub[s].total:1]).sort((a,b)=>a[1]-b[1])[0][0];$('#managerReport').innerHTML=`<div class="report-block"><b>총평</b>이번 주 순공 ${hours.toFixed(1)}시간, 계획 달성률 ${rate}%입니다. ${rate>=90?'현재 계획 강도를 유지합니다.':rate>=75?'필수 과제는 유지하고 권장 과제를 일부 줄입니다.':'총량을 줄이고 필수 과제부터 복구해야 합니다.'}</div><div class="report-block"><b>가장 위험한 과목</b>${weak}의 완료율이 가장 낮습니다. 다음 주에는 새로운 자료보다 미완료 핵심을 우선 배치합니다.</div><div class="report-block"><b>이월 규칙</b>필수만 다음 가능한 날로 이동하고, 권장은 일요일 오후 후보, 여유는 삭제합니다.</div>`}
function renderHike(){const st=settings();$('#hikeEnabled').checked=st.hikeEnabled;const items=['전날 7시간 30분 이상 수면','무릎·발목 통증 없음','폭염·호우·강풍 예보 없음','월요일까지 남는 과도한 피로 없음','물·간식·보조배터리 준비'],saved=get('p11122_v2_hikeChecks',{});$('#hikeChecks').innerHTML=items.map((x,i)=>`<label class="check"><input type="checkbox" data-i="${i}" ${saved[i]?'checked':''}><span>${x}</span></label>`).join('');$$('#hikeChecks input').forEach(x=>x.onchange=()=>{saved[x.dataset.i]=x.checked;set('p11122_v2_hikeChecks',saved);renderHikeDecision()});renderHikeDecision()}
$('#hikeEnabled').onchange=e=>{const st=settings();st.hikeEnabled=e.target.checked;set('p11122_v2_settings',st);renderHikeDecision()};

function missed(){const m=allTasks(),todayS=ymd(now()),out=[];Object.keys(m).filter(d=>d<todayS).sort().forEach(d=>m[d].filter(t=>!t.done).forEach(t=>out.push({date:d,t})));return out}
$('#carryBtn').onclick=()=>{const list=missed();$('#carryList').innerHTML=list.length?list.map(({date,t})=>`<div class="test-card" data-date="${date}" data-id="${t.id}"><b>${date} · ${esc(t.subject)} · ${esc(t.name)}</b><div class="row"><select class="input action short"><option value="today">오늘로 이동</option><option value="next">다음 날로 이동</option><option value="sunday">다음 일요일</option><option value="delete">삭제</option></select><button class="btn primary small apply">적용</button></div></div>`).join(''):'<div class="note">지난 미완료 과제가 없습니다.</div>';$$('#carryList .apply').forEach(b=>b.onclick=()=>{const box=b.closest('.test-card');carryOne(box.dataset.date,box.dataset.id,box.querySelector('.action').value);$('#carryBtn').click()});$('#carryModal').classList.add('show')};
function carryOne(from,id,action){const m=allTasks(),task=m[from]?.find(t=>t.id===id);if(!task)return;m[from]=m[from].filter(t=>t.id!==id);if(action!=='delete'){let dest;if(action==='today')dest=ymd(now());if(action==='next'){const d=parse(from);d.setDate(d.getDate()+1);dest=ymd(d)}if(action==='sunday'){const d=now(),add=(7-d.getDay())%7||7;d.setDate(d.getDate()+add);dest=ymd(d)}task.id=uid();task.done=false;(m[dest]||(m[dest]=[])).push(task)}set('p11122_v2_tasks',m);renderDashboard()}

function exportData(){const data={app:'PROJECT11122',version:VERSION,exportedAt:new Date().toISOString(),storage:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('p11122'))data.storage[k]=localStorage.getItem(k)}const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`PROJECT11122_backup_${ymd(now())}.json`;a.click();URL.revokeObjectURL(a.href)}
$('#exportData').onclick=exportData;if($('#backupQuick'))$('#backupQuick').onclick=exportData;$('#importData').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(d.app!=='PROJECT11122')throw Error();if(!confirm('현재 기록을 백업으로 덮어쓸까요?'))return;Object.entries(d.storage).forEach(([k,v])=>localStorage.setItem(k,v));location.reload()}catch{alert('PROJECT 11122 백업 파일이 아닙니다.')}};
$('#vacationGoal').value=settings().vacationGoal;$('#schoolGoal').value=settings().schoolGoal;if($('#lectureDailyCap'))$('#lectureDailyCap').value=settings().lectureDailyCap||5;$('#saveSettings').onclick=()=>{const st=settings();st.vacationGoal=Number($('#vacationGoal').value||10.8);st.schoolGoal=Number($('#schoolGoal').value||9.5);st.lectureDailyCap=Number($('#lectureDailyCap')?.value||5);set('p11122_v2_settings',st);alert('저장했습니다.');renderDashboard()};$('#resetAll').onclick=()=>{if(prompt('전체 기록을 지우려면 RESET을 입력하세요.')==='RESET'){Object.keys(localStorage).filter(k=>k.startsWith('p11122')).forEach(k=>localStorage.removeItem(k));location.reload()}};


/* ========================= v2.3 DAILY MANAGER ========================= */
const TARGET_GRADES={국어:1,수학:1,영어:1,사회문화:2,경제:2};

function migrateV23(){
 if(get('p11122_v23_migrated',false))return;
 const courses=courseData();
 Object.keys(courses).forEach(k=>courses[k]=courses[k].map(c=>({...COURSE_META[c.name],...c})));
 set('p11122_v2_courses',courses);
 set('p11122_v23_migrated',true)
}

function conditionData(){return get('p11122_v23_condition',{})}
function valueOrDash(v){return v===0||v?String(v):'-'}
function headacheLabel(v){
 const map={0:'없음',1:'약함',2:'보통',3:'심함'};
 return v===0||v?map[Number(v)]:'미입력'
}
function calculateSleepMinutes(bed,wake){
 if(!bed||!wake)return 0;
 const [bh,bm]=bed.split(':').map(Number),[wh,wm]=wake.split(':').map(Number);
 let start=bh*60+bm,end=wh*60+wm;
 if(end<=start)end+=1440;
 return Math.max(0,end-start)
}
function formatMinutes(min){
 const h=Math.floor(Number(min||0)/60),m=Number(min||0)%60;
 return `${h}시간 ${m}분`
}
function conditionAdviceFor(c){
 if(!c)return{kind:'',text:'아직 기록이 없습니다.'};
 const sleep=Number(c.sleepMinutes||0),fatigue=Math.max(Number(c.morningFatigue||0),Number(c.eveningFatigue||0)),head=Number(c.headache||0);
 if(head>=3||fatigue>=5)return{kind:'bad',text:'오늘은 실모 강행보다 필수 복습과 휴식을 우선하고, 종료 시각을 늦추지 않는 편이 좋습니다.'};
 if(sleep&&sleep<420||head>=2||fatigue>=4)return{kind:'warn',text:'수면·피로 상태를 고려해 여유 과제를 빼고 새 실모보다 오답·강의 중심으로 조정하는 편이 좋습니다.'};
 return{kind:'good',text:'현재 기록만 보면 계획을 정상 강도로 진행할 수 있습니다.'}
}
function renderCondition(){
 if(!$('#conditionDate'))return;
 const date=$('#conditionDate').value||selected||ymd(now());
 $('#conditionDate').value=date;
 const c=conditionData()[date]||{};
 $('#sleepBed').value=c.bed||'';$('#sleepWake').value=c.wake||'';$('#sleepQuality').value=valueOrDash(c.sleepQuality)==='-'?'':c.sleepQuality;
 $('#morningFatigue').value=valueOrDash(c.morningFatigue)==='-'?'':c.morningFatigue;$('#headache').value=valueOrDash(c.headache)==='-'?'':c.headache;$('#morningFocus').value=valueOrDash(c.morningFocus)==='-'?'':c.morningFocus;$('#expectedCondition').value=c.expectedCondition||'';
 $('#caffeineCups').value=String(c.caffeineCups||0);$('#lastCaffeine').value=c.lastCaffeine||'';$('#eveningFatigue').value=valueOrDash(c.eveningFatigue)==='-'?'':c.eveningFatigue;$('#eveningFocus').value=valueOrDash(c.eveningFocus)==='-'?'':c.eveningFocus;$('#overallCondition').value=valueOrDash(c.overallCondition)==='-'?'':c.overallCondition;$('#vitaminTaken').checked=Boolean(c.vitaminTaken);$('#conditionMemo').value=c.memo||'';
 $$('.symptom-check').forEach(x=>x.checked=(c.symptoms||[]).includes(x.value));
 updateSleepPreview();toggleLastCaffeine();
 const advice=conditionAdviceFor(c);$('#conditionAdvice').className='condition-advice '+advice.kind;$('#conditionAdvice').textContent=advice.text;
 renderConditionWeek();renderConditionPlanAdvice()
}
function updateSleepPreview(){
 const min=calculateSleepMinutes($('#sleepBed').value,$('#sleepWake').value);
 $('#sleepTotal').value=min?formatMinutes(min):''
}
function toggleLastCaffeine(){
 const show=Number($('#caffeineCups').value||0)>0;
 $('#lastCaffeineWrap').style.display=show?'block':'none';
 if(!show)$('#lastCaffeine').value=''
}
$('#sleepBed')?.addEventListener('change',updateSleepPreview);
$('#sleepWake')?.addEventListener('change',updateSleepPreview);
$('#caffeineCups')?.addEventListener('change',toggleLastCaffeine);
$('#conditionDate')?.addEventListener('change',renderCondition);
$('#saveCondition')?.addEventListener('click',()=>{
 const date=$('#conditionDate').value||ymd(now()),all=conditionData();
 const bed=$('#sleepBed').value,wake=$('#sleepWake').value;
 all[date]={
  bed,wake,sleepMinutes:calculateSleepMinutes(bed,wake),
  sleepQuality:Number($('#sleepQuality').value||0),
  morningFatigue:Number($('#morningFatigue').value||0),
  headache:Number($('#headache').value||0),
  morningFocus:Number($('#morningFocus').value||0),
  expectedCondition:$('#expectedCondition').value,
  symptoms:$$('.symptom-check:checked').map(x=>x.value),
  caffeineCups:Number($('#caffeineCups').value||0),
  lastCaffeine:$('#lastCaffeine').value,
  vitaminTaken:$('#vitaminTaken').checked,
  eveningFatigue:Number($('#eveningFatigue').value||0),
  eveningFocus:Number($('#eveningFocus').value||0),
  overallCondition:Number($('#overallCondition').value||0),
  memo:$('#conditionMemo').value.trim(),
  updatedAt:new Date().toISOString()
 };
 set('p11122_v23_condition',all);selected=date;renderCondition();renderDashboard();refreshDailyReportText();alert('수면·컨디션을 저장했습니다.')
});
$('#clearCondition')?.addEventListener('click',()=>{
 if(!confirm('이 날짜의 수면·컨디션 기록을 지울까요?'))return;
 const date=$('#conditionDate').value,all=conditionData();delete all[date];set('p11122_v23_condition',all);renderCondition();renderDashboard()
});
function renderConditionQuick(){
 if(!$('#conditionQuick'))return;
 const c=conditionData()[selected]||{};
 const advice=conditionAdviceFor(c);
 $('#conditionQuick').innerHTML=`
  <div class="condition-kpi"><span>수면</span><b>${c.sleepMinutes?formatMinutes(c.sleepMinutes):'미입력'}</b></div>
  <div class="condition-kpi"><span>피로</span><b>${valueOrDash(c.eveningFatigue||c.morningFatigue)}/5</b></div>
  <div class="condition-kpi"><span>두통</span><b>${headacheLabel(c.headache)}</b></div>
  <div class="condition-kpi"><span>카페인</span><b>${Number(c.caffeineCups||0)}잔</b></div>
  <div class="condition-kpi"><span>마지막 카페인</span><b>${c.lastCaffeine||'-'}</b></div>
  <div class="condition-kpi"><span>비타민</span><b>${c.vitaminTaken?'✓':'-'}</b></div>
  <div class="condition-advice ${advice.kind}" style="grid-column:1/-1">${advice.text}</div>`
}
function recentConditionRows(){
 const data=conditionData(),rows=[];
 for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const ds=ymd(d);if(data[ds])rows.push({date:ds,...data[ds]})}
 return rows
}
function renderConditionWeek(){
 if(!$('#conditionWeek'))return;
 const rows=recentConditionRows();
 if(!rows.length){$('#conditionWeek').innerHTML='<div class="note">7일 기록이 아직 없습니다.</div>';return}
 const avgSleep=rows.reduce((s,x)=>s+Number(x.sleepMinutes||0),0)/rows.filter(x=>x.sleepMinutes).length||0;
 const avgFat=rows.reduce((s,x)=>s+Number(x.eveningFatigue||x.morningFatigue||0),0)/rows.length;
 const headaches=rows.filter(x=>Number(x.headache||0)>0).length;
 $('#conditionWeek').innerHTML=`<div class="note"><b>평균 수면 ${formatMinutes(Math.round(avgSleep))}</b><br>평균 피로 ${avgFat.toFixed(1)}/5 · 두통 기록 ${headaches}일</div>`+rows.map(x=>`<div class="condition-day"><b>${x.date.slice(5)}</b><div>수면 ${x.sleepMinutes?formatMinutes(x.sleepMinutes):'-'} · 피로 ${valueOrDash(x.eveningFatigue||x.morningFatigue)}/5 · 두통 ${headacheLabel(x.headache)} · 카페인 ${Number(x.caffeineCups||0)}잔${x.lastCaffeine?' / '+x.lastCaffeine:''}</div></div>`).join('')
}
function renderConditionPlanAdvice(){
 if(!$('#conditionPlanAdvice'))return;
 const c=conditionData()[$('#conditionDate')?.value||selected]||{};
 const advice=conditionAdviceFor(c);
 const late=Number(c.caffeineCups||0)>0&&c.lastCaffeine&&c.lastCaffeine>='16:00';
 $('#conditionPlanAdvice').innerHTML=`<div class="report-block"><b>오늘 강도</b>${advice.text}</div><div class="report-block"><b>카페인</b>${late?'마지막 카페인 시각이 늦습니다. 오늘 취침이 밀리는지 확인합니다.':'특별한 늦은 카페인 경고가 없습니다.'}</div><div class="report-block"><b>원칙</b>수면 부족분을 밤 공부로 갚지 않고, 여유 과제를 먼저 줄입니다.</div>`
}

function allForecasts(){
 const data=courseData(),out=[];
 Object.entries(data).forEach(([group,arr])=>arr.forEach(c=>out.push({group,course:c,forecast:forecastCourse(c)})));
 return out
}
function overallFinishStatus(){
 const rows=allForecasts().filter(x=>!['오르새 수학'].includes(x.course.name));
 const unknown=rows.filter(x=>x.forecast.state==='unknown').length;
 const danger=rows.filter(x=>x.forecast.state==='danger').length;
 const tight=rows.filter(x=>x.forecast.state==='tight').length;
 const lp=lectureFinishPressure();
 if(lp.state==='danger')return{state:'danger',label:'현재 계획으로 완주 위험',detail:`남은 인강 ${lp.remaining}강 · 하루 ${lp.perDay.toFixed(1)}강 필요(계획 상한 ${lp.cap}강). 문제풀이·수학·영어 시간은 별도입니다.`};
 if(danger)return{state:'danger',label:'현재 계획으로 완주 위험',detail:`위험 ${danger}개 · 빡빡 ${tight}개 · 검증 불가 ${unknown}개`};
 if(unknown)return{state:'unknown',label:'아직 완주 확인 불가',detail:`총량 미입력 ${unknown}개가 있어 반드시 끝난다고 판단할 수 없습니다.`};
 if(lp.state==='tight'||tight)return{state:'tight',label:'완주 가능하지만 빡빡함',detail:`남은 인강 하루 ${lp.perDay.toFixed(1)}강 필요 · 빡빡한 과정 ${tight}개`};
 return{state:'ok',label:'현재 입력 기준 완주 가능',detail:`남은 인강 하루 ${lp.perDay.toFixed(1)}강 필요 · 입력된 과정이 목표일 안에 들어옵니다.`}
}
function latestGrades(subject){
 const list=[];
 tests().forEach(t=>{
  if(t.kind==='single'&&t.subject===subject&&t.grade)list.push({date:t.date,grade:Number(t.grade)});
  if(t.kind==='full'&&t.grades?.[subject])list.push({date:t.date,grade:Number(t.grades[subject])})
 });
 return list.sort((a,b)=>a.date.localeCompare(b.date)).slice(-2)
}
function gradeState(subject){
 const vals=latestGrades(subject),target=TARGET_GRADES[subject];
 if(!vals.length)return{state:'unknown',label:'확인 불가',text:'최근 등급 미입력'};
 const latest=vals.at(-1).grade;
 if(vals.length>=2&&vals.every(x=>x.grade<=target))return{state:'ok',label:'도달권',text:`최근 ${vals.map(x=>x.grade+'등급').join(' · ')}`};
 if(latest<=target)return{state:'tight',label:'1회 도달',text:`최근 ${latest}등급 · 한 번 더 확인 필요`};
 return{state:'danger',label:'보완 필요',text:`최근 ${latest}등급 · 목표 ${target}등급`}
}
function renderFeasibility(){
 if(!$('#finishForecast'))return;
 const rows=allForecasts();
 const overall=overallFinishStatus();
 $('#finishStatusBadge').textContent=overall.label;
 $('#finishForecast').className='forecast-list';
 $('#finishForecast').innerHTML=`<div class="note"><b>${overall.label}</b><br>${overall.detail}</div>`+rows.map(({course:c,forecast:f})=>`<div class="forecast-item"><div class="forecast-top"><div><div class="forecast-name">${esc(c.name)}</div><div class="forecast-meta">${esc(f.text)}<br>목표일 ${esc(c.deadline||'-')} · 하루 기준 ${c.dailyTarget||'-'}개</div></div><span class="forecast-status ${f.state}">${f.label}</span></div></div>`).join('');
 $('#gradeForecast').className='grade-grid';
 $('#gradeForecast').innerHTML=SUBJECTS.map(s=>{const g=gradeState(s);return `<div class="grade-row"><b>${s}</b><span>${g.text}</span><span class="forecast-status ${g.state}">${g.label}</span></div>`}).join('')
}
function renderFeasibilityQuick(){
 if(!$('#feasibilityQuick'))return;
 const f=overallFinishStatus(),grades=SUBJECTS.map(gradeState),reached=grades.filter(x=>x.state==='ok'||x.state==='tight').length;
 const lp=lectureFinishPressure();$('#feasibilityQuick').innerHTML=`<b>${f.label}</b><br>${f.detail}<br><br>인강: ${lp.remaining}강 남음 · 하루 ${lp.perDay.toFixed(1)}강 필요<br>11122 최근 등급 확인: ${reached}/5과목 · 등급 미입력은 실모 기록에서 추가`
}

function validatePatch(p){
 if(!p||typeof p!=='object')throw new Error('JSON 객체가 아닙니다.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(p.date||''))throw new Error('date가 YYYY-MM-DD 형식이어야 합니다.');
 if(p.tasks&&!Array.isArray(p.tasks))throw new Error('tasks는 배열이어야 합니다.');
 if(p.schedule&&!Array.isArray(p.schedule))throw new Error('schedule은 배열이어야 합니다.');
 return p
}
$('#applyPlanPatch')?.addEventListener('click',previewPlanPatch);
$('#clearPlanPatch')?.addEventListener('click',()=>{$('#planPatchInput').value='';$('#patchStatus').textContent=''});



/* ========================= v2.4 FINAL GUARD ========================= */
const EXAM_DAY='2026-09-02';
let pendingPlanPatch=null;
let closeStep=1;
let closeDate='';
let closeQuickTestId='';

function deepCopy(v){return JSON.parse(JSON.stringify(v))}

/* ---------- Minimum success line ---------- */
function minimumSuccess(date=selected){
 const must=tasksFor(date).filter(t=>t.priority==='must');
 return{tasks:must,done:must.filter(t=>t.done).length,total:must.length}
}
function renderMinimumSuccess(){
 if(!$('#minimumSuccessList'))return;
 const m=minimumSuccess(selected),rate=m.total?Math.round(m.done/m.total*100):0;
 $('#minimumBadge').textContent=m.total?`${m.done}/${m.total}`:'미설정';
 $('#minimumBar').style.width=rate+'%';
 if(!m.total){
  $('#minimumSuccessList').innerHTML='<div class="minimum-empty">필수 과제가 없습니다. 오늘 반드시 지킬 과제를 ‘필수’로 지정하세요.</div>';
  return
 }
 $('#minimumSuccessList').innerHTML=m.tasks.map(t=>`<div class="minimum-item ${t.done?'done':''}"><div class="tick">${t.done?'✓':'·'}</div><div><b>${esc(t.subject)} · ${esc(t.name)}</b><span>${esc(t.duration||'시간 미입력')}${t.material?' · '+esc(t.material):''}</span></div></div>`).join('')
}

/* ---------- Reverse roadmap ---------- */
function phaseStatus(start,end,today=ymd(now())){
 if(today>end)return'past';
 if(today>=start&&today<=end)return'current';
 return'future'
}
function courseTargetsInRange(start,end){
 return allForecasts().filter(x=>x.course.deadline&&x.course.deadline>=start&&x.course.deadline<=end)
}
function renderReverseRoadmap(){
 if(!$('#reverseRoadmap'))return;
 const today=ymd(now()),dd=Math.max(0,Math.ceil((parse(EXAM_DAY)-parse(today))/86400000));
 $('#roadmapDday').textContent=today<=EXAM_DAY?`D-${dd}`:'종료';
 const phases=[
  {start:'2026-08-02',end:'2026-08-09',title:'개념 복구 가속',items:['사문 LIM IT 남은 강의 정리','국어·경제 강의 진도 정상화','수면·실제 공부량 기준 확보']},
  {start:'2026-08-10',end:'2026-08-19',title:'완강과 문제 적용',items:['강의만 듣지 않고 당일 문제 적용','사문은 완강 확인 후 실모 전환','경제 LEAD IN 종료선 점검']},
  {start:'2026-08-20',end:'2026-08-26',title:'실전 비중 확대',items:['전과목 실모·기출 점수와 등급 기록','반복 오답 유형 집중 복구','완강 지연 과정은 과감히 감량 판단']},
  {start:'2026-08-27',end:'2026-09-01',title:'최종 안정화',items:['새 대형 강의 최소화','실모·오답·시간 운영 중심','취침·기상 고정, 밤 공부 연장 금지']}
 ];
 $('#reverseRoadmap').innerHTML=phases.map(p=>{
  const status=phaseStatus(p.start,p.end,today),targets=courseTargetsInRange(p.start,p.end);
  const targetText=targets.length
   ?targets.map(x=>`${x.course.name}: ${x.forecast.label}`).join('<br>')
   :'이 구간에 설정된 강좌 목표일 없음';
  return `<div class="road-phase ${status}">
    <span class="road-phase-label">${status==='current'?'현재 구간':status==='past'?'지난 구간':'예정'}</span>
    <h4>${p.title}</h4>
    <div class="road-date">${p.start.slice(5)} ~ ${p.end.slice(5)}</div>
    <ul>${p.items.map(x=>`<li>${x}</li>`).join('')}</ul>
    <div class="road-course"><b>강좌 마감선</b><br>${targetText}</div>
  </div>`
 }).join('')
}

/* ---------- Patch preview + undo ---------- */
function cleanPatchTasks(tasks){
 return (tasks||[]).slice(0,20).map(t=>({
  id:uid(),
  subject:SUBJECTS.includes(t.subject)?t.subject:'기타',
  priority:['must','should','extra'].includes(t.priority)?t.priority:'should',
  name:String(t.name||'새 할 일').slice(0,120),
  material:String(t.material||'').slice(0,120),
  note:String(t.note||'').slice(0,300),
  duration:String(t.duration||'').slice(0,40),
  done:false,
  managerPatch:true
 }))
}
function normalizedPatch(raw){
 const p=validatePatch(raw);
 return{
  ...p,
  replace:p.replace!==false,
  cleanTasks:cleanPatchTasks(p.tasks),
  cleanSchedule:(p.schedule||[]).slice(0,20).map(s=>({
   id:uid(),time:String(s.time||'').slice(0,40),school:String(s.school||'').slice(0,80),
   study:String(s.study||'').slice(0,160),done:false
  }))
 }
}
function taskPreviewHtml(t,kind=''){
 return `<div class="patch-task ${kind}"><b><span class="priority ${t.priority||'should'}">${PRIORITY_LABEL[t.priority]||'권장'}</span>${esc(t.subject||'기타')} · ${esc(t.name||'할 일')}</b><div>${esc(t.duration||'시간 미입력')}${t.material?' · '+esc(t.material):''}${t.note?' · '+esc(t.note):''}</div></div>`
}
function previewPlanPatch(){
 try{
  const text=$('#planPatchInput').value.trim();
  if(!text)throw new Error('붙여넣은 수정안이 없습니다.');
  const p=normalizedPatch(JSON.parse(text));
  const before=deepCopy(tasksFor(p.date));
  const after=p.tasks?(p.replace?p.cleanTasks:[...before,...p.cleanTasks]):before;
  const goalMap=get('p11122_v23_goals',{}),beforeGoal=Object.prototype.hasOwnProperty.call(goalMap,p.date)?goalMap[p.date]:null;
  pendingPlanPatch={...p,before,after,beforeGoal};
  $('#patchPreviewDate').textContent=p.date;
  $('#patchPreviewSummary').innerHTML=`
   <div class="patch-stat"><span>기존 과제</span><b>${before.length}개</b></div>
   <div class="patch-stat"><span>적용 후</span><b>${after.length}개</b></div>
   <div class="patch-stat"><span>시간표</span><b>${p.schedule?p.cleanSchedule.length+'개':'유지'}</b></div>
   <div class="patch-stat"><span>목표 순공</span><b>${Number.isFinite(Number(p.goal))?Number(p.goal).toFixed(1)+'h':'유지'}</b></div>`;
  $('#patchBefore').innerHTML=before.length?before.map(t=>taskPreviewHtml(t,p.replace?'removed':'')).join(''):'<div class="note">기존 과제 없음</div>';
  $('#patchAfter').innerHTML=after.length?after.map((t,i)=>taskPreviewHtml(t,p.tasks&&(p.replace||i>=before.length)?'added':'')).join(''):'<div class="note">적용 후 과제 없음</div>';
  $('#patchPreviewModal').classList.add('show');
  $('#patchStatus').textContent='미리보기를 열었습니다. 아직 실제 계획은 바뀌지 않았습니다.'
 }catch(err){
  $('#patchStatus').textContent='미리보기 실패: '+err.message
 }
}
function undoHistory(){return get('p11122_v24_undo',[])}
function saveUndoSnapshot(p){
 const goals=get('p11122_v23_goals',{}),hadGoal=Object.prototype.hasOwnProperty.call(goals,p.date);
 const history=undoHistory();
 history.unshift({
  id:uid(),date:p.date,createdAt:new Date().toISOString(),
  tasks:deepCopy(tasksFor(p.date)),
  schedule:deepCopy(scheduleFor(p.date)),
  hadGoal,goal:hadGoal?goals[p.date]:null,
  label:`${p.date} · 적용 전 ${tasksFor(p.date).length}개 과제`
 });
 set('p11122_v24_undo',history.slice(0,5))
}
function applyPendingPatch(){
 const p=pendingPlanPatch;if(!p)return;
 saveUndoSnapshot(p);
 if(p.tasks)saveTasks(p.date,p.after);
 if(p.schedule)saveSchedules(p.date,p.cleanSchedule);
 if(Number.isFinite(Number(p.goal))){
  const goals=get('p11122_v23_goals',{});goals[p.date]=Number(p.goal);set('p11122_v23_goals',goals)
 }
 selected=p.date;
 $('#patchPreviewModal').classList.remove('show');
 $('#patchStatus').textContent=`${p.date} 계획을 적용했습니다. 적용 전 상태는 되돌리기에 저장했습니다.`;
 pendingPlanPatch=null;
 renderDashboard();renderWeek();renderManager()
}
$('#confirmApplyPatch')?.addEventListener('click',applyPendingPatch);
function renderUndoList(){
 if(!$('#undoList'))return;
 const history=undoHistory();
 $('#undoList').innerHTML=history.length?history.map(x=>`<div class="undo-item"><div><b>${esc(x.label)}</b><span>${new Date(x.createdAt).toLocaleString('ko-KR')} · 과제 ${x.tasks.length}개</span></div><button class="btn ghost small undo-btn" data-id="${x.id}">되돌리기</button></div>`).join(''):'<div class="undo-empty">아직 되돌릴 수정이 없습니다.</div>';
 $$('.undo-btn').forEach(b=>b.onclick=()=>restoreUndo(b.dataset.id))
}
function restoreUndo(id){
 const history=undoHistory(),snap=history.find(x=>x.id===id);
 if(!snap||!confirm(`${snap.date} 계획을 수정 전 상태로 되돌릴까요?`))return;
 saveTasks(snap.date,deepCopy(snap.tasks));
 saveSchedules(snap.date,deepCopy(snap.schedule));
 const goals=get('p11122_v23_goals',{});
 if(snap.hadGoal)goals[snap.date]=snap.goal;else delete goals[snap.date];
 set('p11122_v23_goals',goals);
 set('p11122_v24_undo',history.filter(x=>x.id!==id));
 selected=snap.date;$('#patchStatus').textContent=`${snap.date} 계획을 이전 상태로 되돌렸습니다.`;
 renderDashboard();renderWeek();renderManager()
}

/* ---------- One-minute day close ---------- */
function openCloseDay(){
 closeDate=selected||ymd(now());closeStep=1;closeQuickTestId='';
 $('#closeDayDate').textContent=closeDate;
 const h=get('p11122_v2_hours',{}),c=conditionData()[closeDate]||{};
 $('#closeHours').value=h[closeDate]||'';
 $('#closeFatigue').value=c.eveningFatigue||'';
 $('#closeFocus').value=c.eveningFocus||'';
 $('#closeOverall').value=c.overallCondition||'';
 $('#closeCaffeine').value=String(c.caffeineCups||0);
 $('#closeLastCaffeine').value=c.lastCaffeine||'';
 $('#closeVitamin').checked=Boolean(c.vitaminTaken);
 $('#closeTestScore').value='';$('#closeTestGrade').value='';$('#closeTestReason').value='';
 toggleCloseCaffeine();renderCloseTasks();renderCloseStep();$('#closeDayModal').classList.add('show')
}
function renderCloseTasks(){
 const ts=tasksFor(closeDate);
 $('#closeTaskList').innerHTML=ts.length?ts.map(t=>`<label class="close-task"><input class="close-task-check" data-id="${t.id}" type="checkbox" ${t.done?'checked':''}><div><b><span class="priority ${t.priority}">${PRIORITY_LABEL[t.priority]}</span>${esc(t.subject)} · ${esc(t.name)}</b><span>${esc(t.duration||'시간 미입력')}${t.material?' · '+esc(t.material):''}</span></div></label>`).join(''):'<div class="note">등록된 과제가 없습니다.</div>';
 $$('.close-task-check').forEach(x=>x.onchange=()=>{
  const ts=tasksFor(closeDate),t=ts.find(v=>v.id===x.dataset.id);if(t)t.done=x.checked;saveTasks(closeDate,ts);renderCloseMinimum();renderDashboard()
 });
 renderCloseMinimum()
}
function renderCloseMinimum(){
 const m=minimumSuccess(closeDate),box=$('#closeMinimumState');
 if(!m.total){box.className='condition-advice';box.textContent='최소 성공선이 설정되지 않았습니다.';return}
 if(m.done===m.total){box.className='condition-advice good';box.textContent=`최소 성공선 달성 · 필수 ${m.done}/${m.total}`;}
 else{box.className='condition-advice warn';box.textContent=`최소 성공선 미달 · 필수 ${m.done}/${m.total} · 남은 필수 ${m.total-m.done}개`;}
}
function toggleCloseCaffeine(){
 const show=Number($('#closeCaffeine').value||0)>0;
 $('#closeLastCaffeineWrap').style.display=show?'block':'none';
 if(!show)$('#closeLastCaffeine').value=''
}
$('#closeCaffeine')?.addEventListener('change',toggleCloseCaffeine);
function saveCloseCondition(){
 const hours=get('p11122_v2_hours',{});hours[closeDate]=Number($('#closeHours').value||0);set('p11122_v2_hours',hours);
 const all=conditionData(),old=all[closeDate]||{};
 all[closeDate]={
  ...old,
  caffeineCups:Number($('#closeCaffeine').value||0),
  lastCaffeine:$('#closeLastCaffeine').value,
  vitaminTaken:$('#closeVitamin').checked,
  eveningFatigue:Number($('#closeFatigue').value||0),
  eveningFocus:Number($('#closeFocus').value||0),
  overallCondition:Number($('#closeOverall').value||0),
  updatedAt:new Date().toISOString()
 };
 set('p11122_v23_condition',all)
}
function saveCloseQuickTest(){
 const score=Number($('#closeTestScore').value||0);
 if(!score)return;
 const list=tests(),subject=$('#closeTestSubject').value;
 let t=closeQuickTestId?list.find(x=>x.id===closeQuickTestId):null;
 const values={
  kind:'single',date:closeDate,subject,category:'오늘 마감 빠른 기록',select:'',
  series:'오늘 기록',round:'',year:'',month:'',score,
  grade:Number($('#closeTestGrade').value||0),time:'',wrong:0,
  reason:$('#closeTestReason').value.trim(),memo:'오늘 마감에서 입력'
 };
 if(t)Object.assign(t,values);
 else{t={id:uid(),...values};list.push(t);closeQuickTestId=t.id;savePrescriptionFromTest(t)}
 set('p11122_v2_tests',list)
}
function renderCloseStep(){
 $$('.close-step').forEach(x=>x.classList.toggle('active',Number(x.dataset.closeStep)===closeStep));
 $$('.close-steps i').forEach(x=>x.classList.toggle('active',Number(x.dataset.step)<=closeStep));
 $('#closeStepBadge').textContent=`${closeStep}/4`;
 $('#closePrev').style.visibility=closeStep===1?'hidden':'visible';
 $('#closeNext').style.display=closeStep===4?'none':'inline-flex';
 if(closeStep===4){
  $('#closeReportText').value=dailyReport(closeDate);
  const m=minimumSuccess(closeDate),f=overallFinishStatus();
  $('#closeFinalState').innerHTML=`<b>${m.total&&m.done===m.total?'최소 성공선 달성':'최소 성공선 확인 필요'}</b><br>9모 완주 검증: ${f.label} · 보고서를 복사해 보내면 내일 계획을 수정합니다.`
 }
}
$('#closeDayBtn')?.addEventListener('click',openCloseDay);
$('#closePrev')?.addEventListener('click',()=>{if(closeStep>1){closeStep--;renderCloseStep()}});
$('#closeNext')?.addEventListener('click',()=>{
 if(closeStep===2)saveCloseCondition();
 if(closeStep===3){saveCloseQuickTest();renderTests();renderFeasibility()}
 if(closeStep<4){closeStep++;renderCloseStep()}
});
$('#copyCloseReport')?.addEventListener('click',()=>copyText($('#closeReportText').value));
$('#finishCloseDay')?.addEventListener('click',()=>{
 saveCloseCondition();saveCloseQuickTest();
 set('p11122_v24_close_history',{...(get('p11122_v24_close_history',{})),[closeDate]:new Date().toISOString()});
 $('#closeDayModal').classList.remove('show');renderDashboard();renderCondition();renderManager();renderTests();
 alert('오늘 마감을 저장했습니다.')
});


/* ========================= v3.0 FINAL · LECTURE VENDING ========================= */
const LECTURE_COURSES=[
 {key:'kor-origin',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Origin',display:'All Of KICE Origin',courseName:'Origin',total:14},
 {key:'kor-pred-read',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Predator 독서',display:'All Of KICE Predator 독서',courseName:'Predator 독서',total:32},
 {key:'kor-pred-lit',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Predator 문학',display:'All Of KICE Predator 문학',courseName:'Predator 문학',total:38},
 {key:'kor-wow',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Predator 독서 W.O.W',display:'All Of KICE Predator 독서 W.O.W',courseName:'Predator 독서 W.O.W',total:56},
 {key:'eco-leadin',subject:'경제',provider:'우영호',series:'경제',name:'LEAD IN',display:'LEAD IN',courseName:'LEAD IN',total:29},
 {key:'eco-core',subject:'경제',provider:'우영호',series:'경제',name:'CORE',display:'CORE',courseName:'CORE',total:7},
 {key:'soc-limit',subject:'사회문화',provider:'임정환',series:'사회문화',name:'LIM IT',display:'LIM IT',courseName:'LIM IT',total:30}
];
function customLectureCourses(){return get('p11122_v30_custom_lectures',[])}
function lectureCourses(){return [...LECTURE_COURSES,...customLectureCourses()]}
function lectureId(key,n){return `${key}::${n}`}
function lectureState(){return get('p11122_v30_lecture_state',{})}
function lectureCart(){return get('p11122_v30_lecture_cart',[])}
function saveLectureCart(v){set('p11122_v30_lecture_cart',[...new Set(v)])}
function lectureCourse(key){return lectureCourses().find(c=>c.key===key)}
function lectureInfo(id){
 const [key,n]=String(id).split('::'),course=lectureCourse(key);
 return course?{...course,n:Number(n),id}:null
}
function lectureCompleted(id){return Boolean(lectureState()[id]?.completed)}
function lecturePlannedDate(id){return lectureState()[id]?.plannedDate||''}
function lectureCourseDone(course){
 let n=0;for(let i=1;i<=course.total;i++)if(lectureCompleted(lectureId(course.key,i)))n++;return n
}
function findCourseProgress(name){
 const d=courseData();
 for(const arr of Object.values(d)){const c=arr.find(x=>x.name===name);if(c)return c}
 return null
}
function setCourseProgressDone(name,done){
 const d=courseData();
 for(const key of Object.keys(d)){
  const c=d[key].find(x=>x.name===name);
  if(c){c.done=done;set('p11122_v2_courses',d);return}
 }
}
function syncCourseProgressFromLectures(){
 lectureCourses().forEach(c=>setCourseProgressDone(c.courseName,lectureCourseDone(c)))
}
function syncLectureStateFromCourseProgress(courseProgress){
 const lc=lectureCourses().find(x=>x.courseName===courseProgress.name);if(!lc)return;
 const st=lectureState(),done=Math.max(0,Math.min(lc.total,Number(courseProgress.done||0)));
 for(let i=1;i<=lc.total;i++){
  const id=lectureId(lc.key,i),old=st[id]||{};
  if(i<=done)st[id]={...old,completed:true,plannedDate:''};
  else if(old.completed)st[id]={...old,completed:false}
 }
 set('p11122_v30_lecture_state',st)
}
function inferCompletedFromOldTasks(st){
 const courseMatchers=[
  ['kor-origin',/Origin\s*(\d+)(?:~(\d+))?강/i],
  ['kor-pred-read',/Predator\s*독서\s*(\d+)(?:~(\d+))?강/i],
  ['kor-pred-lit',/Predator\s*문학\s*(\d+)(?:~(\d+))?강/i],
  ['kor-wow',/(?:W\.?O\.?W|Predator\s*독서\s*W\.?O\.?W)\s*(\d+)(?:~(\d+))?강/i],
  ['eco-leadin',/LEAD IN\s*(\d+)(?:~(\d+))?강/i],
  ['eco-core',/CORE\s*(\d+)(?:~(\d+))?강/i],
  ['soc-limit',/LIM IT\s*(\d+)(?:~(\d+))?강/i]
 ];
 Object.values(allTasks()).flat().filter(t=>t.done).forEach(t=>{
  const text=`${t.name||''} ${t.material||''}`;
  for(const [key,re] of courseMatchers){
   const m=text.match(re);if(!m)continue;
   const c=lectureCourse(key),a=Number(m[1]),b=Number(m[2]||m[1]);
   for(let n=a;n<=Math.min(b,c.total);n++)st[lectureId(key,n)]={...(st[lectureId(key,n)]||{}),completed:true,plannedDate:''}
   break
  }
 })
 return st
}
function migrateV30(){
 if(get('p11122_v30_migrated',false))return;
 set('p11122_v2_school',fixedSchoolMap());

 const d=courseData();
 Object.values(d).flat().forEach(c=>{
  if(COURSE_TOTALS[c.name])c.total=COURSE_TOTALS[c.name]
 });
 set('p11122_v2_courses',d);

 let st=lectureState();
 lectureCourses().forEach(lc=>{
  const progress=findCourseProgress(lc.courseName),done=Math.min(lc.total,Number(progress?.done||0));
  for(let n=1;n<=done;n++){
   const id=lectureId(lc.key,n);st[id]={...(st[id]||{}),completed:true,plannedDate:''}
  }
 });
 st=inferCompletedFromOldTasks(st);
 set('p11122_v30_lecture_state',st);
 syncCourseProgressFromLectures();

 const s=settings();if(!s.lectureDailyCap)s.lectureDailyCap=5;set('p11122_v2_settings',s);
 set('p11122_v30_migrated',true)
}
function studyDaysToExam(){
 let start=parse(ymd(now())),end=parse('2026-09-01'),count=0;
 if(start>end)return 0;
 for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1))if(d.getDay()!==0)count++;
 return count
}
function lectureFinishPressure(){
 const total=lectureCourses().reduce((s,c)=>s+c.total,0);
 const done=lectureCourses().reduce((s,c)=>s+lectureCourseDone(c),0);
 const remaining=Math.max(0,total-done),days=studyDaysToExam(),perDay=days?remaining/days:remaining;
 const cap=Number(settings().lectureDailyCap||5),ratio=cap?perDay/cap:99;
 return{total,done,remaining,days,perDay,cap,state:remaining===0?'ok':ratio<=.85?'ok':ratio<=1?'tight':'danger'}
}
function markLecturesCompleted(ids,completed=true){
 const st=lectureState(),cart=lectureCart().filter(id=>!ids.includes(id));
 ids.forEach(id=>{
  const old=st[id]||{};
  st[id]={...old,completed:Boolean(completed),plannedDate:completed?'':(old.plannedDate||'')}
 });
 set('p11122_v30_lecture_state',st);saveLectureCart(cart);syncCourseProgressFromLectures()
}
function reconcileLecturePlans(){
 const st=lectureState();
 Object.keys(st).forEach(id=>{if(!st[id].completed)st[id].plannedDate=''});
 Object.entries(allTasks()).forEach(([date,ts])=>ts.forEach(t=>(t.lectureIds||[]).forEach(id=>{
  if(!st[id]?.completed)st[id]={...(st[id]||{}),completed:false,plannedDate:date}
 })));
 set('p11122_v30_lecture_state',st)
}
function nextUnfinishedLectureLabels(limit=10){
 const out=[];
 for(const c of lectureCourses()){
  for(let n=1;n<=c.total;n++){
   const id=lectureId(c.key,n);
   if(!lectureCompleted(id)){out.push(`${c.provider} ${c.display} ${n}강`);if(out.length>=limit)return out}
  }
 }
 return out
}
function fillLectureCourseFilter(){
 if(!$('#lectureCourseFilter'))return;
 const subject=$('#lectureSubjectFilter').value,sel=$('#lectureCourseFilter').value;
 const list=lectureCourses().filter(c=>subject==='all'||c.subject===subject);
 $('#lectureCourseFilter').innerHTML='<option value="all">전체 강좌</option>'+list.map(c=>`<option value="${c.key}">${esc(c.display)}</option>`).join('');
 if(list.some(c=>c.key===sel))$('#lectureCourseFilter').value=sel
}
function toggleLectureCartId(id){
 if(lectureCompleted(id))return;
 const cart=lectureCart(),i=cart.indexOf(id);
 if(i>=0)cart.splice(i,1);else cart.push(id);
 saveLectureCart(cart);renderLearningVending()
}
function addNextLectures(key,count){
 const c=lectureCourse(key),cart=lectureCart();let added=0;
 for(let n=1;n<=c.total&&added<count;n++){
  const id=lectureId(key,n);
  if(!lectureCompleted(id)&&!cart.includes(id)){cart.push(id);added++}
 }
 saveLectureCart(cart);renderLearningVending()
}
function renderLectures(){
 if(!$('#lectureCatalog'))return;
 reconcileLecturePlans();fillLectureCourseFilter();
 const pressure=lectureFinishPressure(),cart=lectureCart(),subject=$('#lectureSubjectFilter').value,courseFilter=$('#lectureCourseFilter').value,incomplete=$('#lectureIncompleteOnly').checked;
 $('#lectureTotal').textContent=pressure.total+'강';$('#lectureDone').textContent=pressure.done+'강';$('#lectureRemain').textContent=pressure.remaining+'강';$('#lecturePerDay').textContent=pressure.days?pressure.perDay.toFixed(1)+'강':'-';
 $('#lecturePressureBadge').textContent=pressure.state==='ok'?'현재 속도 가능':pressure.state==='tight'?'상한선 근접':'완주 위험';
 $('#lecturePressureBadge').className='badge lecture-pressure-'+pressure.state;
 $('#lecturePressureText').innerHTML=`9모 전 집중 학습일 ${pressure.days}일 기준, <b>강의만 하루 ${pressure.perDay.toFixed(1)}강</b>이 필요합니다. 현재 개인 계획 상한은 하루 ${pressure.cap}강입니다. 문제풀이·수학·영어 시간은 별도이므로 이 수치는 매일 다시 확인합니다.`;

 const courses=lectureCourses().filter(c=>(subject==='all'||c.subject===subject)&&(courseFilter==='all'||c.key===courseFilter));
 $('#lectureCatalog').innerHTML=courses.map(c=>{
  const done=lectureCourseDone(c),pct=Math.round(done/c.total*100);
  const buttons=[];
  for(let n=1;n<=c.total;n++){
   const id=lectureId(c.key,n),isDone=lectureCompleted(id),isCart=cart.includes(id),planned=lecturePlannedDate(id);
   if(incomplete&&isDone)continue;
   buttons.push(`<button class="lecture-btn ${isDone?'completed':''} ${isCart?'cart':''} ${planned?'planned':''}" data-id="${id}">
    <button class="lecture-complete-toggle" data-complete-id="${id}" title="완료 상태">${isDone?'✓':'○'}</button>
    <b>${n}강</b>
    <small>${isDone?'완료':isCart?'장바구니':planned?planned+' 예정':'미수강'}</small>
   </button>`)
  }
  return `<section class="lecture-course">
    <div class="lecture-course-head">
      <div class="lecture-course-title"><b>${esc(c.provider)} · ${esc(c.display)}</b><span>${done}/${c.total}강 완료 · ${c.total-done}강 남음</span><div class="lecture-course-progress"><i style="width:${pct}%"></i></div></div>
      <div class="lecture-course-actions"><button class="btn ghost small next-lecture-btn" data-key="${c.key}" data-count="2">다음 2강 담기</button><button class="btn ghost small next-lecture-btn" data-key="${c.key}" data-count="4">다음 4강 담기</button>${c.custom?`<button class="btn danger small delete-custom-course" data-key="${c.key}">강좌 삭제</button>`:''}</div>
    </div>
    <div class="lecture-grid">${buttons.length?buttons.join(''):'<div class="note">표시할 미수강 강의가 없습니다.</div>'}</div>
  </section>`
 }).join('');

 $$('.lecture-btn[data-id]').forEach(b=>b.onclick=e=>{if(e.target.closest('.lecture-complete-toggle'))return;toggleLectureCartId(b.dataset.id)});
 $$('.lecture-complete-toggle').forEach(b=>b.onclick=e=>{
  e.stopPropagation();const id=b.dataset.completeId;markLecturesCompleted([id],!lectureCompleted(id));renderCourses();renderLearningVending();renderFeasibility()
 });
 $$('.next-lecture-btn').forEach(b=>b.onclick=()=>addNextLectures(b.dataset.key,Number(b.dataset.count)));
 $$('.delete-custom-course').forEach(b=>b.onclick=e=>{
  e.stopPropagation();
  const key=b.dataset.key,c=lectureCourse(key);
  if(!c||!confirm(`${c.display} 강좌와 관련된 완료·계획 표시를 삭제할까요?`))return;
  const custom=customLectureCourses().filter(x=>x.key!==key);set('p11122_v30_custom_lectures',custom);
  const st=lectureState();Object.keys(st).filter(id=>id.startsWith(key+'::')).forEach(id=>delete st[id]);set('p11122_v30_lecture_state',st);
  saveLectureCart(lectureCart().filter(id=>!id.startsWith(key+'::')));renderLearningVending()
 });

 $('#lectureCartCount').textContent=cart.length+'강';
 $('#lectureCartList').innerHTML=cart.length?cart.map(id=>{const x=lectureInfo(id);return `<div class="cart-lecture"><div><b>${esc(x.display)} ${x.n}강</b><span>${esc(x.provider)} · ${esc(x.subject)}</span></div><button class="cart-remove" data-id="${id}">×</button></div>`}).join(''):'<div class="cart-empty">강의를 클릭하면 여기에 담깁니다.</div>';
 $$('.cart-remove').forEach(b=>b.onclick=()=>toggleLectureCartId(b.dataset.id));

 const date=$('#lecturePlanDate').value||selected||ymd(now());$('#lecturePlanDate').value=date;
 const day=parse(date).getDay(),deviceSlots=day>=1&&day<=5?(schoolMap()[String(day)]||[]).filter(p=>p.selfStudy&&p.device).length:0;
 $('#lectureCartSchoolHint').textContent=day>=1&&day<=5?`${DAY_NAMES[day]} 전자기기 가능 자습 ${deviceSlots}교시 · 장바구니 ${cart.length}강`:'주말·비등교일은 오늘 할 일에만 추가합니다.'
}
$('#lectureSubjectFilter')?.addEventListener('change',()=>{fillLectureCourseFilter();renderLearningVending()});
$('#lectureCourseFilter')?.addEventListener('change',renderLearningVending);
$('#lectureIncompleteOnly')?.addEventListener('change',renderLearningVending);
$('#lecturePlanDate')?.addEventListener('change',renderLearningVending);
$('#clearLectureCart')?.addEventListener('click',()=>{saveLectureCart([]);saveBookCart([]);renderLearningVending()});

function sortLectureIds(ids){
 return [...ids].sort((a,b)=>{
  const A=lectureInfo(a),B=lectureInfo(b),ca=lectureCourses().findIndex(c=>c.key===A.key),cb=lectureCourses().findIndex(c=>c.key===B.key);
  return ca-cb||A.n-B.n
 })
}
function groupLectureIds(ids){
 const groups=[];
 sortLectureIds(ids).forEach(id=>{
  const x=lectureInfo(id),last=groups.at(-1);
  if(last&&last.key===x.key&&last.numbers.at(-1)+1===x.n){last.ids.push(id);last.numbers.push(x.n)}
  else groups.push({key:x.key,course:x,ids:[id],numbers:[x.n]})
 });
 return groups
}
function rangeLabel(nums){
 if(nums.length===1)return`${nums[0]}강`;
 return`${nums[0]}~${nums.at(-1)}강`
}
function buildLecturePlan(){const date=$('#lecturePlanDate').value||selected,lcart=lectureCart().filter(id=>!lectureCompleted(id)),bcart=bookCart();if(!lcart.length&&!bcart.length){alert('장바구니에 학습 항목을 먼저 담아 주세요.');return}const existing=tasksFor(date),existingIds=new Set(existing.flatMap(t=>t.lectureIds||[])),fresh=lcart.filter(id=>!existingIds.has(id));groupLectureIds(fresh).forEach(g=>{const c=g.course;existing.push({id:uid(),subject:c.subject,priority:'must',name:`${c.display} ${rangeLabel(g.numbers)}`,material:`${c.provider} · ${c.series}`,note:'학습 자판기 · 인강',duration:`${g.ids.length}강`,done:false,lectureIds:g.ids,taskKind:'lecture'})});bcart.forEach(x=>existing.push({id:uid(),subject:x.subject,priority:'must',name:x.label,material:x.bookName,note:`학습 자판기 · 문제집 · ${x.mode==='problems'?'문제 수 기준':'소단원 기준'}`,duration:`${x.minutes}분`,done:false,bookItem:{...x},taskKind:'book'}));saveTasks(date,existing);const state=lectureState();fresh.forEach(id=>state[id]={...(state[id]||{}),completed:false,plannedDate:date});set('p11122_v30_lecture_state',state);const blocks=timelineForDate(date),free=blocks.filter(b=>b.selfStudy&&!b.locked&&!genericStudyText(b)),device=free.filter(b=>b.device),paper=free.filter(b=>!b.device);let placedLecture=0,placedBook=0;sortLectureIds(fresh).forEach(id=>{const slot=device.find(b=>!genericStudyText(b));if(!slot)return;const x=lectureInfo(id);slot.study=`${x.provider} ${x.display} ${x.n}강`;slot.lectureIds=[id];placedLecture++});bcart.forEach(x=>{const slot=paper.find(b=>!genericStudyText(b))||device.find(b=>!genericStudyText(b));if(!slot)return;slot.study=x.label;slot.bookCartItemId=x.id;placedBook++});saveTimeline(date,blocks);saveLectureCart([]);saveBookCart([]);selected=date;renderDashboard();renderWeek();renderLearningVending();renderCourses();renderFeasibility();if($('#timelineDate'))$('#timelineDate').value=date;renderTimelineEditor();navigate('dashboard');const total=fresh.length+bcart.length,placed=placedLecture+placedBook;alert(`${date}에 학습 ${total}개를 추가했습니다.\n시간표 자동배치 ${placed}개${total>placed?` · 초과 ${total-placed}개는 오늘 할 일에만 추가`:''}`)}

$('#addCustomLectureCourse')?.addEventListener('click',()=>{
 const subject=(prompt('과목명을 입력하세요. 예: 수학')||'').trim();if(!subject)return;
 const provider=(prompt('강사 또는 제공자 이름을 입력하세요. 예: 오르새')||'').trim();if(!provider)return;
 const display=(prompt('강좌명을 입력하세요.')||'').trim();if(!display)return;
 const total=Number(prompt('전체 강의 수를 숫자로 입력하세요.'));if(!Number.isInteger(total)||total<1||total>300){alert('전체 강의 수는 1~300 사이의 정수로 입력해 주세요.');return}
 const custom=customLectureCourses();
 const key='custom-'+Date.now().toString(36);
 custom.push({key,subject,provider,series:subject,name:display,display,courseName:'',total,custom:true});
 set('p11122_v30_custom_lectures',custom);
 $('#lectureSubjectFilter').value='all';$('#lectureCourseFilter').value='all';renderLearningVending();
});

$('#buildLecturePlan')?.addEventListener('click',buildLecturePlan);

let currentLearningTab='all';
function problemBooks(){return get('p11122_v40_problem_books',[])}
function saveProblemBooks(v){set('p11122_v40_problem_books',v)}
function bookCart(){return get('p11122_v40_book_cart',[])}
function saveBookCart(v){set('p11122_v40_book_cart',v)}
function bookState(){return get('p11122_v40_book_state',{})}
function bookSubunitKey(bookId,subunit){return `${bookId}::${subunit}`}
function bookSubunitCompleted(bookId,subunit){return Boolean(bookState()[bookSubunitKey(bookId,subunit)]?.completed)}
function markBookSubunitCompleted(bookId,subunit,completed=true){const st=bookState(),key=bookSubunitKey(bookId,subunit);st[key]={...(st[key]||{}),completed:Boolean(completed)};set('p11122_v40_book_state',st)}
function renderLearningTabs(){$$('.learning-tab').forEach(b=>b.classList.toggle('active',b.dataset.learningTab===currentLearningTab));$('#lectureVendingPanel')?.classList.toggle('hidden-by-tab',currentLearningTab==='book');$('#bookVendingPanel')?.classList.toggle('hidden-by-tab',currentLearningTab==='lecture')}
$$('.learning-tab').forEach(b=>b.onclick=()=>{currentLearningTab=b.dataset.learningTab;renderLearningTabs()});
function openProblemBookModal(book=null){$('#problemBookId').value=book?.id||'';$('#problemBookSubject').value=book?.subject||'수학';$('#problemBookName').value=book?.name||'';$('#problemBookSubunits').value=(book?.subunits||[]).join('\n');$('#problemBookModal').classList.add('show')}
$('#addProblemBook')?.addEventListener('click',()=>openProblemBookModal());
$('#saveProblemBook')?.addEventListener('click',()=>{const id=$('#problemBookId').value||uid(),name=$('#problemBookName').value.trim(),subject=$('#problemBookSubject').value;if(!name){alert('교재명을 입력해 주세요.');return}const subunits=$('#problemBookSubunits').value.split(/\n|,/).map(x=>x.trim()).filter(Boolean),list=problemBooks(),idx=list.findIndex(x=>x.id===id),obj={id,subject,name,subunits};if(idx>=0)list[idx]=obj;else list.push(obj);saveProblemBooks(list);$('#problemBookModal').classList.remove('show');renderProblemBooks()});
function toggleBookTaskMode(){const mode=$('input[name="bookTaskMode"]:checked')?.value||'problems';$('#bookProblemFields').classList.toggle('hidden',mode!=='problems');$('#bookSubunitFields').classList.toggle('hidden',mode!=='subunit')}
$$('input[name="bookTaskMode"]').forEach(r=>r.onchange=toggleBookTaskMode);
function openBookTaskModal(book,mode='problems',subunit=''){const options='<option value="">전체/미지정</option>'+(book.subunits||[]).map(x=>`<option>${esc(x)}</option>`).join('');$('#bookTaskBookId').value=book.id;$('#bookTaskBookName').textContent=book.name;$('#bookProblemSubunit').innerHTML=options;$('#bookSubunitSelect').innerHTML=(book.subunits||[]).map(x=>`<option>${esc(x)}</option>`).join('')||'<option value="">소단원 미등록</option>';if(subunit){$('#bookProblemSubunit').value=subunit;$('#bookSubunitSelect').value=subunit}$$('input[name="bookTaskMode"]').forEach(r=>r.checked=r.value===mode);toggleBookTaskMode();$('#bookTaskModal').classList.add('show')}
$('#addBookTaskToCart')?.addEventListener('click',()=>{const book=problemBooks().find(x=>x.id===$('#bookTaskBookId').value);if(!book)return;const mode=$('input[name="bookTaskMode"]:checked')?.value||'problems',minutes=Math.max(5,Number($('#bookTaskMinutes').value||30));let item;if(mode==='problems'){const start=Math.max(1,Number($('#bookProblemStart').value||1)),count=Math.max(1,Number($('#bookProblemCount').value||10)),end=start+count-1,subunit=$('#bookProblemSubunit').value;item={id:uid(),kind:'book',mode,bookId:book.id,subject:book.subject,bookName:book.name,subunit,start,count,end,minutes,label:`${book.name}${subunit?' · '+subunit:''} ${start}~${end}번`}}else{const subunit=$('#bookSubunitSelect').value;if(!subunit){alert('소단원을 먼저 등록해 주세요.');return}item={id:uid(),kind:'book',mode,bookId:book.id,subject:book.subject,bookName:book.name,subunit,minutes,label:`${book.name} · ${subunit}`}}const cart=bookCart();cart.push(item);saveBookCart(cart);$('#bookTaskModal').classList.remove('show');renderLearningVending()});
function renderProblemBooks(){if(!$('#problemBookCatalog'))return;const list=problemBooks();$('#problemBookCatalog').innerHTML=list.length?list.map(book=>`<section class="book-card"><div class="book-card-head"><div><h4>${esc(book.subject)} · ${esc(book.name)}</h4><div class="book-meta">소단원 ${(book.subunits||[]).length}개 · 문제 수/소단원 방식 지원</div></div><div class="book-actions"><button class="btn primary small book-problem-task" data-id="${book.id}">문제 수로 담기</button><button class="btn ghost small edit-book" data-id="${book.id}">편집</button><button class="btn danger small delete-book" data-id="${book.id}">삭제</button></div></div><div class="subunit-grid">${(book.subunits||[]).length?(book.subunits||[]).map(s=>`<button class="subunit-chip ${bookSubunitCompleted(book.id,s)?'completed':''}" data-book="${book.id}" data-subunit="${esc(s)}"><b>${esc(s)}</b><span>${bookSubunitCompleted(book.id,s)?'완료 · 클릭해서 다시 담기':'클릭 → 소단원으로 담기'}</span></button>`).join(''):'<div class="note">소단원이 없습니다. 편집에서 추가하세요.</div>'}</div></section>`).join(''):'<div class="note">등록된 문제집이 없습니다. `+ 문제집 등록`에서 시작하세요.</div>';$$('.book-problem-task').forEach(b=>b.onclick=()=>{const book=list.find(x=>x.id===b.dataset.id);if(book)openBookTaskModal(book,'problems')});$$('.subunit-chip').forEach(b=>b.onclick=()=>{const book=list.find(x=>x.id===b.dataset.book);if(book)openBookTaskModal(book,'subunit',b.dataset.subunit)});$$('.edit-book').forEach(b=>b.onclick=()=>{const book=list.find(x=>x.id===b.dataset.id);if(book)openProblemBookModal(book)});$$('.delete-book').forEach(b=>b.onclick=()=>{const book=list.find(x=>x.id===b.dataset.id);if(!book||!confirm(`${book.name}을 삭제할까요?`))return;saveProblemBooks(list.filter(x=>x.id!==book.id));saveBookCart(bookCart().filter(x=>x.bookId!==book.id));renderLearningVending()})}
function combinedCartCount(){return lectureCart().length+bookCart().length}
function renderCombinedLearningCart(){if(!$('#lectureCartList'))return;const rows=[];lectureCart().forEach(id=>{const x=lectureInfo(id);if(x)rows.push(`<div class="cart-lecture"><div><b><span class="cart-kind lecture">인강</span>${esc(x.display)} ${x.n}강</b><span>${esc(x.provider)} · ${esc(x.subject)}</span></div><button class="cart-remove" data-lecture-id="${id}">×</button></div>`)});bookCart().forEach(x=>rows.push(`<div class="cart-lecture"><div><b><span class="cart-kind book">문제집</span>${esc(x.label)}</b><span>${esc(x.subject)} · ${x.minutes}분 · ${x.mode==='problems'?x.count+'문제':'소단원'}</span></div><button class="cart-remove" data-bookcart-id="${x.id}">×</button></div>`));$('#lectureCartCount').textContent=combinedCartCount()+'개';$('#lectureCartList').innerHTML=rows.length?rows.join(''):'<div class="cart-empty">인강이나 문제집 할 일을 담아 주세요.</div>';$$('[data-lecture-id]').forEach(b=>b.onclick=()=>toggleLectureCartId(b.dataset.lectureId));$$('[data-bookcart-id]').forEach(b=>b.onclick=()=>{saveBookCart(bookCart().filter(x=>x.id!==b.dataset.bookcartId));renderLearningVending()})}
function renderLearningVending(){renderLearningTabs();renderLectures();renderProblemBooks();renderCombinedLearningCart();const date=$('#lecturePlanDate').value||selected;$('#lecturePlanDate').value=date;const blocks=timelineForDate(date),open=blocks.filter(b=>b.selfStudy&&!b.locked),device=open.filter(b=>b.device).length,paper=open.filter(b=>!b.device).length;$('#lectureCartSchoolHint').innerHTML=`${DAY_NAMES[parse(date).getDay()]} · 사용 가능한 자습 ${open.length}블록 · 전자기기 ${device} · 종이 ${paper} · 장바구니 ${combinedCartCount()}개${combinedCartCount()>open.length?'<br><span class="learning-overflow">블록보다 할 일이 많아 초과분은 오늘 할 일에만 추가됩니다.</span>':''}`}


function migrateV40(){if(get('p11122_v40_migrated',false))return;set('p11122_v2_school',fixedSchoolMap());const all=allSchedules(),today=ymd(now());Object.keys(all).filter(d=>d>=today).forEach(d=>delete all[d]);set('p11122_v2_schedules',all);set('p11122_v40_migrated',true)}

$('#todayLabel').textContent=new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'long'});const dday=Math.ceil((EXAM_DATE-now())/86400000);$('#dday').textContent=dday>=0?'D-'+dday:'종료';
migrateV21();migrateV23();migrateV30();migrateV40();if($('#timelineDate'))$('#timelineDate').value=selected;renderDashboard();renderCondition();renderManager();renderWeek();renderSchool();renderLearningVending();renderCourses();renderTests();renderReport();renderHike();
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
 if(!$('#managerDate'))return;renderFeasibility();renderReverseRoadmap();renderUndoList();$('#managerDate').value=$('#managerDate').value||nextDateString(ymd(now()),1);
 const date=$('#managerDate').value||nextDateString(ymd(now()),1),preview=managerSuggestions(date);
 $('#managerPreview').innerHTML=preview.map(x=>`<div class="manager-preview-item"><span class="priority ${x.priority}">${PRIORITY_LABEL[x.priority]}</span><span class="subject">${x.subject}</span><b>${esc(x.name)}</b><div class="task-meta">${esc(x.material)} · ${esc(x.duration)} · ${esc(x.note)}</div></div>`).join('');
 renderPrescriptions();refreshDailyReportText()
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
 const ts=tasksFor(date),hours=get('p11122_v2_hours',{})[date]||0,dayTests=tests().filter(t=>t.date===date),c=conditionData()[date]||{},finish=overallFinishStatus();
 const sleep=c.sleepMinutes?formatMinutes(c.sleepMinutes):'미입력';
 const caffeine=Number(c.caffeineCups||0);
 const lines=[
  `[PROJECT 11122 일일 보고]`,
  `날짜: ${date}`,
  `순공: ${hours}시간`,
  `완료: ${ts.filter(t=>t.done).length}/${ts.length}`,
  `수면: ${sleep}${c.bed&&c.wake?` (${c.bed} 취침 / ${c.wake} 기상)`:''}`,
  `아침 피로: ${valueOrDash(c.morningFatigue)}/5 · 두통: ${headacheLabel(c.headache)} · 아침 집중: ${valueOrDash(c.morningFocus)}/5`,
  `저녁 피로: ${valueOrDash(c.eveningFatigue)}/5 · 오늘 집중: ${valueOrDash(c.eveningFocus)}/5 · 전체 컨디션: ${valueOrDash(c.overallCondition)}/5`,
  `카페인: ${caffeine}잔${caffeine&&c.lastCaffeine?` · 마지막 ${c.lastCaffeine}`:''} · 비타민: ${c.vitaminTaken?'복용':'미복용/미입력'}`,
  c.symptoms?.length?`기타 상태: ${c.symptoms.join(', ')}`:'',
  '',
  `9모 전 완주 검증: ${finish.label}`,
  `남은 인강: ${lectureFinishPressure().remaining}강 · 9모 전 하루 ${lectureFinishPressure().perDay.toFixed(1)}강 필요`,
  finish.detail,
  '',
  '완료 과제:',
  ...ts.filter(t=>t.done).map(t=>`- ${t.subject}: ${t.name}`),
  '',
  '미완료 과제:',
  ...ts.filter(t=>!t.done).map(t=>`- [${PRIORITY_LABEL[t.priority]}] ${t.subject}: ${t.name}`),
  '',
  '오늘 시험:',
  ...(dayTests.length?dayTests.map(t=>t.kind==='single'?`- ${t.subject} ${t.series||t.category} ${t.score}점${t.grade?` ${t.grade}등급`:''} · ${t.reason||'원인 미입력'}`:`- ${t.name} · ${SUBJECTS.map(s=>`${s} ${t.scores[s]||'-'}${t.grades?.[s]?`(${t.grades[s]}등급)`:''}`).join(' / ')}`):['- 없음']),
  '',
  c.memo?`컨디션 메모: ${c.memo}`:'',
  '내일 계획을 9모 전 완주 가능성과 11122 도달 가능성을 다시 확인해서 수정해 주세요.'
 ];
 return lines.filter((x,i)=>x!==''||lines[i-1]!=='').join('\n')
}
function refreshDailyReportText(){$('#dailyReportText').value=dailyReport(selected)}
$('#refreshDailyReport')?.addEventListener('click',refreshDailyReportText);
async function copyText(text){try{await navigator.clipboard.writeText(text);alert('복사했습니다.')}catch{$('#dailyReportText').value=text;$('#dailyReportText').select();document.execCommand('copy');alert('복사했습니다.')}}
$('#copyDailyReport')?.addEventListener('click',()=>copyText($('#dailyReportText').value));
$('#copyReportQuick')?.addEventListener('click',()=>copyText(dailyReport(selected)));

$$('[data-open-page]').forEach(b=>b.onclick=()=>navigate(b.dataset.openPage));

/* ========================= CALENDAR ========================= */
/* Test templates */
$$('.test-template').forEach(b=>b.onclick=()=>{const t=b.dataset.template;$('#singleMode').click();if(t==='평가원'){$('#testCategory').value='평가원 기출';$('#testSeries').value='평가원 기출';$('#testRound').value=''}if(t==='전대'){$('#testCategory').value='학교 실모';$('#testSeries').value='전대 실모';$('#testRound').value=''}if(t==='우영호'){$('#testSubject').value='경제';$('#testCategory').value='강사 실모';$('#testSeries').value='우영호 실모';$('#testRound').value=''}if(t==='사문'){$('#testSubject').value='사회문화';$('#testCategory').value='사설 실모';$('#testSeries').value='사문 실모';$('#testRound').value=''}$('#testSeries').focus()});

function renderHikeDecision(){
 if(!$('#hikeDecision'))return;
 const st=settings(),checks=get('p11122_v2_hikeChecks',{}),count=Object.values(checks).filter(Boolean).length;
 const recent=conditionData()[ymd(now())]||{};
 const healthRisk=(recent.sleepMinutes&&recent.sleepMinutes<420)||Number(recent.eveningFatigue||recent.morningFatigue||0)>=4||Number(recent.headache||0)>=2;
 let cls='rest',text='등산 OFF · 일반 회복일';
 if(st.hikeEnabled){
  if(healthRisk){cls='rest';text='수면·피로·두통 기록상 휴식 또는 짧은 산책 권장'}
  else if(count===5){cls='full';text='풀코스 권장 · 오후 공부 4~5시간'}
  else if(count>=3){cls='short';text='단축 코스 권장 · 오후 공부 3시간'}
  else{text='등산 대신 휴식 · 복습 1~2시간'}
 }
 $('#hikeDecision').className='hike-decision '+cls;
 $('#hikeDecision').textContent=text
}
