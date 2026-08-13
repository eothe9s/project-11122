/* PROJECT 11122 v6.7 · CSAT EDITION */
'use strict';

const APP_VERSION='6.7';
const SCHEMA_VERSION=6;
const BUILD='2026-08-13';
const EXAM9='2026-09-02';
const CSAT='2026-11-19';
const SUBJECTS=['국어','수학','영어','사회문화','경제'];
const GOAL9={'국어':1,'수학':1,'영어':1,'사회문화':2,'경제':2};
const GOAL_CSAT={'국어':1,'수학':1,'영어':1,'사회문화':1,'경제':1};
const DB_KEY='p11122_v60_db';

const BUILTIN_LECTURES=[
 {key:'kor-origin',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Origin',display:'All Of KICE Origin',total:14},
 {key:'kor-pred-read',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Predator 독서',display:'All Of KICE Predator 독서',total:32},
 {key:'kor-pred-lit',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Predator 문학',display:'All Of KICE Predator 문학',total:38},
 {key:'kor-wow',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Predator 독서 W.O.W',display:'All Of KICE Predator 독서 W.O.W',total:56},
 {key:'eco-leadin',subject:'경제',provider:'우영호',series:'경제',name:'LEAD IN',display:'LEAD IN',total:29},
 {key:'eco-core',subject:'경제',provider:'우영호',series:'경제',name:'CORE',display:'CORE',total:7},
 {key:'soc-limit',subject:'사회문화',provider:'임정환',series:'사회문화',name:'LIM IT',display:'LIM IT',total:30}
];

const SCHOOL={
 1:[['물리학Ⅱ',0,0],['인공지능수학',0,0],['지구과학Ⅱ',1,0],['진로',1,1],['언어와매체',0,0],['미적분',0,0],['공강',1,1]],
 2:[['지구과학Ⅱ',1,0],['과학과제연구',1,0],['화학Ⅱ',0,0],['사회문제탐구',1,1],['정보과제연구',1,1],['물리학Ⅱ',0,0],['생명과학Ⅱ',1,0]],
 3:[['미적분',0,0],['정보과제연구',1,1],['스포츠생활',0,0],['화학Ⅱ',0,0],['과학융합',1,1],['공강',1,1],['공강',1,1]],
 4:[['지구과학Ⅱ',1,0],['사회문제탐구',1,1],['미적분',0,0],['생명과학Ⅱ',1,0],['과학융합',1,1],['물리학Ⅱ',0,0],['언어와매체',0,0]],
 5:[['환경',1,1],['과학과제연구',1,0],['인공지능수학',0,0],['화학Ⅱ',0,0],['공강',1,1],['공강',1,1],['생명과학Ⅱ',1,0]]
};
const DAYNAME=['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
const SATURDAY=[
 ['08:40','09:50','1교시'],['10:00','11:10','2교시'],['11:20','12:30','3교시'],
 ['13:30','14:40','4교시'],['14:50','15:50','5교시'],['16:00','17:00','6교시']
];
const PRIORITY_LABEL={must:'필수',should:'권장',extra:'여유'};
const ERROR_CAUSES=['시간 부족','개념 부족','계산 실수','문제 해석','부주의','찍음'];

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const uid=()=>crypto.randomUUID?.()||('id-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9));
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const deep=x=>JSON.parse(JSON.stringify(x));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function ymd(d=new Date()){const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`}
function addDays(date,n){const d=parseDate(date);d.setDate(d.getDate()+n);return ymd(d)}
function parseDate(s){const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d,12,0,0,0)}
function fmtDate(s){const d=parseDate(s);return `${d.getMonth()+1}월 ${d.getDate()}일 ${DAYNAME[d.getDay()]}`}
function daysBetween(a,b){return Math.ceil((parseDate(b)-parseDate(a))/86400000)}
function minuteLabel(n){n=Math.max(0,Math.round(n));return n>=60?`${Math.floor(n/60)}시간${n%60?` ${n%60}분`:''}`:`${n}분`}
function hoursLabel(n){return (n/60).toFixed(1)+'h'}
function timeToMin(t){if(!t)return null;const [h,m]=t.split(':').map(Number);return h*60+m}
function durationMin(start,end){if(!start||!end)return 0;let a=timeToMin(start),b=timeToMin(end);if(b<=a)b+=1440;return Math.max(0,b-a)}
function plannerMinute(t){let m=timeToMin(t);if(m==null)return null;if(m<300)m+=1440;return m}
function plannerIndexToTime(i){let m=300+i*10;m%=1440;return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`}
function plannerIndexForTime(t){const m=plannerMinute(t);return m==null?null:Math.round((m-300)/10)}
function dateInRange(date,start,end){return (!start||date>=start)&&(!end||date<=end)}
function subjectClass(s){return s==='국어'?'sub-kor':s==='수학'?'sub-math':s==='영어'?'sub-eng':s==='사회문화'?'sub-soc':s==='경제'?'sub-eco':'sub-other'}
function activeStage(date=ymd()){return date<=EXAM9?{key:'nine',title:'9월 모의평가 대비',target:EXAM9,goals:GOAL9,label:'중간 체크포인트'}:{key:'csat',title:'수능 최종 대비',target:CSAT,goals:GOAL_CSAT,label:'최종 목표'}}
function dday(target,date=ymd()){return Math.max(0,daysBetween(date,target))}
function parseMinutesLike(v){if(v==null||v==='')return 0;if(typeof v==='number')return v;const s=String(v);let n=0;const h=s.match(/(\d+(?:\.\d+)?)\s*시간/);const m=s.match(/(\d+)\s*분/);if(h)n+=Number(h[1])*60;if(m)n+=Number(m[1]);if(!h&&!m&&/^\d+(?:\.\d+)?$/.test(s.trim()))n=Number(s);return Math.round(n)}

function defaultDB(){
 const periodTimes={};for(let i=1;i<=7;i++)periodTimes[i]={start:'',end:''};
 return {
  schema:SCHEMA_VERSION,createdAt:Date.now(),
  settings:{lectureDailyCap:5,periodTimes,hikeEnabled:false,taskSortMode:'timeline',vitaminOptions:['비타민 B군','종합비타민','비타민 C']},
  tasks:{},schedules:{},customLectures:[],lectureState:{},books:[],bookState:{},
  automations:[],automationSkips:{},automationConflicts:[],waiting:[],tests:[],condition:{},plannerMeta:{},
  studyOverrides:{},planLocks:{},recentLearning:[],trash:[],closeHistory:[]
 }
}
function legacy(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}}
function migrateLegacy(){
 const d=defaultDB();
 const oldTasks=legacy('p11122_v2_tasks',{});
 Object.entries(oldTasks).forEach(([date,list])=>{
  d.tasks[date]=(Array.isArray(list)?list:[]).filter(t=>!(t.name==='직접 계획 입력'&&!t.material&&!t.note)).map(normalizeImportedTask)
 });
 d.schedules=legacy('p11122_v2_schedules',{});
 d.customLectures=legacy('p11122_v30_custom_lectures',[]);
 d.lectureState=legacy('p11122_v30_lecture_state',{});
 d.books=legacy('p11122_v40_problem_books',[]);
 d.bookState={...legacy('p11122_v40_book_state',{}),...legacy('p11122_v50_book_part_state',{})};
 d.automations=legacy('p11122_v50_automations',[]).map(r=>({...r,minutes:parseMinutesLike(r.duration)}));
 d.automationSkips=legacy('p11122_v50_automation_skips',{});
 d.automationConflicts=legacy('p11122_v50_automation_conflicts',[]);
 d.waiting=legacy('p11122_v50_waiting',[]).map(normalizeImportedTask);
 d.tests=legacy('p11122_v2_tests',[]).map(t=>({...t,causes:Array.isArray(t.causes)?t.causes:(t.reason?[t.reason]:[]),wrongQuestions:t.wrongQuestions||''}));
 d.condition=legacy('p11122_v23_condition',{});
 const oldHours=legacy('p11122_v2_hours',{});
 Object.entries(oldHours).forEach(([date,h])=>{if(Number(h)>0)d.studyOverrides[date]=Math.round(Number(h)*60)});
 d.planLocks=legacy('p11122_v50_plan_locks',{});
 d.recentLearning=legacy('p11122_v50_recent_learning',[]);
 const oldSettings=legacy('p11122_v2_settings',{});
 if(oldSettings.lectureDailyCap)d.settings.lectureDailyCap=Number(oldSettings.lectureDailyCap)||5;
 d.settings.hikeEnabled=Boolean(oldSettings.hikeEnabled);
 return d
}
function normalizeImportedTask(t){
 const x={...deep(t),id:t.id||uid(),priority:t.priority||'should',subject:t.subject||'기타',name:t.name||'할 일',material:t.material||'',note:t.note||'',minutes:parseMinutesLike(t.minutes||t.duration),done:Boolean(t.done)};
 if(Array.isArray(t.components)&&t.components.length){
  x.components=t.components.map(c=>({...deep(c),id:c.id||uid(),done:Boolean(c.done),label:c.label||'세부 항목'}))
 }else if(Array.isArray(t.lectureIds)&&t.lectureIds.length){
  x.components=t.lectureIds.map(ref=>({id:'cmp-'+ref,kind:'lecture',ref,label:String(ref).split('::').at(-1)+'강',done:Boolean(t.done)}))
 }else if(t.bookItem){
  x.components=[{id:uid(),kind:'book',bookItem:deep(t.bookItem),label:t.bookItem.subunit||t.bookItem.label||t.name,done:Boolean(t.done)}]
 }else{
  x.components=[{id:uid(),kind:'manual',label:x.name,done:Boolean(t.done)}]
 }
 x.done=x.components.length?x.components.every(c=>c.done):Boolean(t.done);
 return x
}
function loadDB(){
 let d;
 try{d=JSON.parse(localStorage.getItem(DB_KEY)||'null')}catch{}
 if(!d)d=migrateLegacy();
 const base=defaultDB();
 d={...base,...d,settings:{...base.settings,...(d.settings||{})}};
 if(!d.settings.periodTimes)d.settings.periodTimes=base.settings.periodTimes;
 if(!['subject','timeline'].includes(d.settings.taskSortMode))d.settings.taskSortMode='timeline';
 if(!Array.isArray(d.settings.vitaminOptions))d.settings.vitaminOptions=deep(base.settings.vitaminOptions);
 d.schema=SCHEMA_VERSION;
 cleanupTrash(d);
 return d
}
let DB=loadDB();
let LAST_SAVED_JSON=JSON.stringify(DB);
function undoHistory(){try{return JSON.parse(localStorage.getItem('p11122_v60_undo')||'[]')}catch{return[]}}
function saveDB(options={}){
 const next=JSON.stringify(DB);
 if(options.undo!==false&&LAST_SAVED_JSON&&LAST_SAVED_JSON!==next){
  const h=undoHistory();h.unshift({id:uid(),at:Date.now(),data:LAST_SAVED_JSON});localStorage.setItem('p11122_v60_undo',JSON.stringify(h.slice(0,5)))
 }
 localStorage.setItem(DB_KEY,next);LAST_SAVED_JSON=next
}
function restoreUndo(id){
 const h=undoHistory(),i=h.findIndex(x=>x.id===id);if(i<0)return;
 try{DB=JSON.parse(h[i].data);DB.schema=SCHEMA_VERSION;localStorage.setItem(DB_KEY,JSON.stringify(DB));LAST_SAVED_JSON=JSON.stringify(DB);localStorage.setItem('p11122_v60_undo',JSON.stringify(h.filter((_,j)=>j!==i)));selected=ymd();displayMonth=selected.slice(0,7);alert('이전 상태로 되돌렸습니다.');renderSettings();navigate('dashboard')}catch{alert('되돌리기에 실패했습니다.')}
}
function cleanupTrash(d=DB){const cutoff=Date.now()-7*86400000;d.trash=(d.trash||[]).filter(x=>(x.deletedAt||0)>=cutoff)}

function allLectureCourses(){return [...BUILTIN_LECTURES,...(DB.customLectures||[])]}
function lectureCourse(key){return allLectureCourses().find(c=>c.key===key)}
function lectureRef(key,n){return `${key}::${n}`}
function lectureInfo(ref){const [key,n]=String(ref).split('::'),c=lectureCourse(key);return c?{...c,n:Number(n),ref}:null}
function lectureDone(ref){return Boolean(DB.lectureState?.[ref]?.completed)}
function setLectureDone(ref,done){DB.lectureState[ref]={...(DB.lectureState[ref]||{}),completed:Boolean(done)}}
function lectureCourseDone(c){let n=0;for(let i=1;i<=c.total;i++)if(lectureDone(lectureRef(c.key,i)))n++;return n}
function bookSubKey(bookId,subunit){return `${bookId}::${subunit}`}
function bookSubDone(bookId,subunit){return Boolean(DB.bookState?.[bookSubKey(bookId,subunit)]?.completed)}
function setBookSubDone(bookId,subunit,done){DB.bookState[bookSubKey(bookId,subunit)]={completed:Boolean(done)}}

function tasksFor(date){return DB.tasks[date]||(DB.tasks[date]=[])}
function taskById(date,id){return tasksFor(date).find(t=>t.id===id)}
function taskState(t){const c=Array.isArray(t.components)?t.components:[];return{done:c.filter(x=>x.done).length,total:c.length}}
function syncComponentSource(c,done){
 c.done=Boolean(done);
 if(c.kind==='lecture'&&c.ref)setLectureDone(c.ref,done);
 if(c.kind==='book'&&c.bookItem?.mode==='subunit'&&c.bookItem.subunit)setBookSubDone(c.bookItem.bookId,c.bookItem.subunit,done)
}
function setTaskDoneInternal(date,id,done){
 const t=taskById(date,id);if(!t)return;
 (t.components||[]).forEach(c=>syncComponentSource(c,done));t.done=Boolean(done);
 saveDB()
}
function setTaskComponentDone(date,id,cid,done){
 const t=taskById(date,id);if(!t)return;const c=(t.components||[]).find(x=>x.id===cid);if(!c)return;
 syncComponentSource(c,done);t.done=(t.components||[]).length?(t.components||[]).every(x=>x.done):Boolean(done);
 saveDB()
}
function taskLinkedBlocks(date,taskId){return ensureSchedule(date).filter(b=>(b.taskIds||[]).includes(taskId))}
function setBlockDone(date,blockId,done){
 const blocks=ensureSchedule(date),b=blocks.find(x=>x.id===blockId);if(!b)return;
 // 시간표 완료는 '그 시간 블록을 실제로 사용했는지'만 기록한다.
 // 연결된 할 일의 완료 상태와는 의도적으로 독립이다.
 b.done=Boolean(done);DB.schedules[date]=blocks;saveDB()
}
function addTask(date,t){const x=normalizeImportedTask({...t,id:t.id||uid(),done:false});tasksFor(date).push(x);saveDB();return x}
function removeTask(date,id,toTrash=true){
 const list=tasksFor(date),t=list.find(x=>x.id===id);if(!t)return;
 ensureSchedule(date).forEach(b=>b.taskIds=(b.taskIds||[]).filter(x=>x!==id));
 DB.tasks[date]=list.filter(x=>x.id!==id);
 if(toTrash)trashPush('task',t,{date});saveDB()
}
function moveTaskToWaiting(date,id){
 const t=taskById(date,id);if(!t)return;removeTask(date,id,false);DB.waiting.push({...deep(t),waitingSince:date,done:false});saveDB()
}

function baseSchedule(date){
 const day=parseDate(date).getDay(),a=[];
 if(day>=1&&day<=5){
  a.push({id:`${date}-morning`,schema:6,fixed:true,name:'아침 자습',type:'self',selfStudy:true,device:false,start:'07:50',end:'08:30',taskIds:[],locked:false,done:false,actualMin:null});
  (SCHOOL[day]||[]).forEach((r,i)=>{
   if(day===5&&i+1===5)return;
   const p=i+1,pt=DB.settings.periodTimes?.[p]||{};
   a.push({id:`${date}-p${p}`,schema:6,fixed:true,regular:true,period:p,name:r[0],type:r[1]?'self':'class',selfStudy:Boolean(r[1]),device:Boolean(r[2]),start:pt.start||'',end:pt.end||'',taskIds:[],locked:false,done:false,actualMin:null})
  });
  a.push({id:`${date}-lunch`,schema:6,fixed:true,name:'점심시간',type:'meal',selfStudy:false,device:false,start:'12:30',end:'13:00',taskIds:[],locked:true,done:false,actualMin:null});
  if(day===1||day===3)a.push({id:`${date}-lunch-program`,schema:6,fixed:true,name:'영단어 프로그램',type:'class',selfStudy:false,device:false,start:'13:00',end:'13:30',taskIds:[],locked:true,done:false,actualMin:null});
  if(day===2||day===4)a.push({id:`${date}-lunch-program`,schema:6,fixed:true,name:'국어 프로그램',type:'class',selfStudy:false,device:false,start:'13:00',end:'13:30',taskIds:[],locked:true,done:false,actualMin:null});
  if(day===5){const p5end=DB.settings.periodTimes?.[5]?.end||'';a.push({id:`${date}-english-mock`,schema:6,fixed:true,name:'영어 모의고사',type:'class',selfStudy:false,device:false,start:'13:00',end:p5end,taskIds:[],locked:true,done:false,actualMin:null})}
  const after=day<=3?['방과후 자습','self',true,true]:day===4?['나혜주 선생님 영어 독해','class',false,false]:['문두열 선생님 수학Ⅰ·수학Ⅱ·미적분(상)','class',false,false];
  a.push({id:`${date}-after`,schema:6,fixed:true,name:after[0],type:after[1],selfStudy:after[2],device:after[3],start:'16:45',end:'17:45',taskIds:[],locked:!after[2],done:false,actualMin:null});
  a.push({id:`${date}-dinner`,schema:6,fixed:true,name:'석식',type:'meal',selfStudy:false,device:false,start:'17:45',end:'18:40',taskIds:[],locked:true,done:false,actualMin:null});
  a.push({id:`${date}-night1`,schema:6,fixed:true,name:'야간자율학습 1',type:'self',selfStudy:true,device:true,start:'18:40',end:'20:20',taskIds:[],locked:false,done:false,actualMin:null});
  a.push({id:`${date}-break`,schema:6,fixed:true,name:'쉬는 시간',type:'break',selfStudy:false,device:false,start:'20:20',end:'20:30',taskIds:[],locked:true,done:false,actualMin:null});
  a.push({id:`${date}-night2`,schema:6,fixed:true,name:'야간자율학습 2',type:'self',selfStudy:true,device:true,start:'20:30',end:'22:00',taskIds:[],locked:false,done:false,actualMin:null});
 } else if(day===6){
  SATURDAY.forEach((r,i)=>a.push({id:`${date}-sat${i+1}`,schema:6,fixed:true,name:r[2],type:'self',selfStudy:true,device:true,start:r[0],end:r[1],taskIds:[],locked:false,done:false,actualMin:null}))
 }
 return a
}
function normalizeBlock(b,date){
 const x={...deep(b),id:b.id||uid(),schema:6,fixed:Boolean(b.fixed),regular:Boolean(b.regular),period:b.period||null,name:b.name||b.school||'시간 블록',type:b.type||(b.selfStudy?'self':'custom'),selfStudy:Boolean(b.selfStudy),device:Boolean(b.device),start:b.start||'',end:b.end||'',taskIds:Array.isArray(b.taskIds)?b.taskIds:[],locked:Boolean(b.locked),done:Boolean(b.done),actualMin:b.actualMin==null?null:Number(b.actualMin),userOverrides:b.userOverrides?deep(b.userOverrides):null};
 if(!x.start&&b.time&&/^\d{2}:\d{2}~\d{2}:\d{2}$/.test(b.time)){[x.start,x.end]=b.time.split('~')}
 return x
}
function mergeSchedule(date,old){
 const base=baseSchedule(date),used=new Set();
 base.forEach(n=>{
  const o=(old||[]).find(x=>x.id===n.id)||(old||[]).find(x=>n.regular&&Number(x.period)===n.period)||(old||[]).find(x=>!n.regular&&((x.name||x.school)===n.name||(`${x.start||''}~${x.end||''}`===`${n.start}~${n.end}`)));
  if(o){used.add(o.id);const q=normalizeBlock(o,date);n.taskIds=q.taskIds;n.done=q.done;n.actualMin=q.actualMin;n.locked=n.selfStudy?q.locked:n.locked;if(q.userOverrides){const u=q.userOverrides;n.name=u.name??n.name;n.type=u.type??n.type;n.selfStudy=u.selfStudy??n.selfStudy;n.device=u.device??n.device;n.start=u.start??n.start;n.end=u.end??n.end;n.userOverrides=deep(u)}}
 });
 (old||[]).filter(x=>!used.has(x.id)&&!x.regular&&!x.fixed).forEach(x=>base.push(normalizeBlock(x,date)));
 return sortBlocks(base)
}
function sortBlocks(blocks){
 return [...blocks].sort((a,b)=>{
  const am=plannerMinute(a.start),bm=plannerMinute(b.start);
  if(am!=null&&bm!=null)return am-bm||(a.fixed===b.fixed?0:a.fixed?-1:1);
  if(am==null&&bm==null)return (a.period||99)-(b.period||99);
  return am==null?-1:1
 })
}
function ensureSchedule(date){
 const old=Array.isArray(DB.schedules[date])?DB.schedules[date]:[];
 const merged=mergeSchedule(date,old);
 DB.schedules[date]=merged;return merged
}
function saveSchedule(date,blocks){DB.schedules[date]=sortBlocks(blocks.map(x=>normalizeBlock(x,date)));saveDB()}
function blockDuration(b){return durationMin(b.start,b.end)}
function plannedStudy(date){
 const blocks=ensureSchedule(date);let minutes=0,unknown=0;
 blocks.filter(b=>b.selfStudy).forEach(b=>{if(b.start&&b.end)minutes+=blockDuration(b);else unknown++});
 return{minutes,unknown}
}
function autoActualStudy(date){
 let minutes=0;
 ensureSchedule(date).filter(b=>b.selfStudy).forEach(b=>{
  if(b.actualMin!=null&&b.actualMin!=='')minutes+=Math.max(0,Number(b.actualMin)||0);
  else if(b.done)minutes+=blockDuration(b)
 });
 return Math.round(minutes)
}
function finalStudy(date){return DB.studyOverrides[date]!=null?Number(DB.studyOverrides[date]):autoActualStudy(date)}
function planMeta(date){if(!DB.plannerMeta)DB.plannerMeta={};return DB.plannerMeta[date]||(DB.plannerMeta[date]={bed:'',wake:''})}
function sleepSession(date){
 const c=DB.condition?.[date]||{},prev=addDays(date,-1);
 return{bed:c.bed||planMeta(prev).bed||'',wake:c.wake||planMeta(date).wake||''}
}
function plannerNightBed(date){
 const next=addDays(date,1),c=DB.condition?.[next]||{};
 return c.bed||planMeta(date).bed||''
}
function plannerMorningWake(date){const c=DB.condition?.[date]||{};return c.wake||planMeta(date).wake||''}
function sleepSpanLabel(bed,wake){if(!bed||!wake)return '미설정';return calcSleep(bed,wake)||'미설정'}
function deviceMark(b){return b&&b.selfStudy&&b.device?'⌨︎ ':''}
function nextSelfStudyBlock(date){return ensureSchedule(date).find(b=>b.selfStudy&&!b.done)||null}
function plannerLegendHTML(){return ['<span class="legend-chip sub-kor">국어</span>','<span class="legend-chip sub-math">수학</span>','<span class="legend-chip sub-eng">영어</span>','<span class="legend-chip sub-soc">사회문화</span>','<span class="legend-chip sub-eco">경제</span>','<span class="legend-chip block-meal">식사</span>','<span class="legend-chip block-break">휴식</span>','<span class="legend-chip block-class">수업</span>','<span class="legend-chip sleep">☽ 취침 · ☼︎ 기상</span>'].join('')}
function regularTimeLabel(b){
 if(b.regular&&b.period&&b.start&&b.end)return `<span class="period-label">${b.period}교시</span><span class="clock-label">${b.start}~${b.end}</span>`;
 if(b.regular&&b.period)return `<span class="period-label">${b.period}교시</span>`;
 return `<span class="clock-label">${b.start&&b.end?`${b.start}~${b.end}`:'시간 미설정'}</span>`
}
function remainingStudyToday(date){
 const now=new Date(),isToday=date===ymd(now);let m=0;
 ensureSchedule(date).filter(b=>b.selfStudy&&b.start&&b.end&&!b.done).forEach(b=>{
  if(!isToday){m+=blockDuration(b);return}
  const end=plannerMinute(b.end),cur=(now.getHours()<5?now.getHours()+24:now.getHours())*60+now.getMinutes();
  const start=plannerMinute(b.start);
  if(end<=cur)return;
  if(cur<=start)m+=blockDuration(b);else m+=Math.max(0,end-cur)
 });return Math.round(m)
}
function currentBlock(date=ymd()){
 if(date!==ymd())return null;const n=new Date(),cur=(n.getHours()<5?n.getHours()+24:n.getHours())*60+n.getMinutes();
 return ensureSchedule(date).find(b=>b.start&&b.end&&plannerMinute(b.start)<=cur&&cur<plannerMinute(b.end))||null
}
function nextBlock(date=ymd()){
 const blocks=ensureSchedule(date).filter(b=>b.start&&b.end);if(date!==ymd())return blocks.find(b=>!b.done)||null;
 const n=new Date(),cur=(n.getHours()<5?n.getHours()+24:n.getHours())*60+n.getMinutes();
 return blocks.find(b=>plannerMinute(b.start)>cur)||null
}
function blockSubjects(date,b){
 const ss=(b.taskIds||[]).map(id=>taskById(date,id)?.subject).filter(Boolean);return [...new Set(ss)]
}
function blockColorClass(date,b){
 const subs=blockSubjects(date,b);if(subs.length)return subjectClass(subs[0]);
 if(b.type==='meal')return'block-meal';if(b.type==='break'||b.type==='travel')return'block-break';if(b.type==='class')return'block-class';return'sub-other'
}

function trashPush(type,data,context={}){
 DB.trash.unshift({id:uid(),type,data:deep(data),context:deep(context),deletedAt:Date.now()});cleanupTrash()
}
function deleteLearningCourse(key){
 const c=DB.customLectures.find(x=>x.key===key);if(!c)return;trashPush('lectureCourse',c);DB.customLectures=DB.customLectures.filter(x=>x.key!==key);saveDB()
}
function deleteBook(id){
 const b=DB.books.find(x=>x.id===id);if(!b)return;trashPush('book',b);DB.books=DB.books.filter(x=>x.id!==id);saveDB()
}
function latestCompletedDate(subject,through=ymd()){
 let latest='';
 Object.keys(DB.tasks).filter(d=>d<=through).sort().forEach(d=>{
  if((DB.tasks[d]||[]).some(t=>t.subject===subject&&t.done))latest=d
 });
 return latest
}
function studyGaps(date=ymd()){
 return SUBJECTS.map(subject=>{
  const last=latestCompletedDate(subject,date);const gap=last?Math.max(0,daysBetween(last,date)):999;
  return{subject,last,gap}
 })
}
function latestGrades(){
 const out={};[...DB.tests].sort((a,b)=>a.date.localeCompare(b.date)).forEach(t=>{
  if(t.subject&&t.grade)out[t.subject]={grade:Number(t.grade),date:t.date,name:t.name||''};
  if(t.grades)SUBJECTS.forEach(s=>{if(t.grades[s])out[s]={grade:Number(t.grades[s]),date:t.date,name:t.name||''}})
 });return out
}
function touchRecent(kind,id,label){
 DB.recentLearning=DB.recentLearning.filter(x=>!(x.kind===kind&&x.id===id));
 DB.recentLearning.unshift({kind,id,label,at:Date.now()});DB.recentLearning=DB.recentLearning.slice(0,8);saveDB()
}

let selected=ymd();
let displayMonth=selected.slice(0,7);
let vendingTab='all';
let cart=[];
let plannerEdit=false;
let plannerSelectStart=null;
let plannerDragStart=null;
let plannerDragEnd=null;
let plannerDragging=false;
let pendingAssignBlock=null;
let plannerSleepMode=false;
const taskDetailOpen=new Set();

function showModal(id){$('#'+id)?.classList.add('show')}
function hideModal(id){$('#'+id)?.classList.remove('show')}
function navigate(page){
 $$('.page').forEach(p=>p.classList.toggle('active',p.id===page));
 $$('#mainNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 const btn=$(`#mainNav button[data-page="${page}"]`);
 $('#pageTitle').textContent=btn?btn.textContent:(page==='settings'?'설정·백업':'PROJECT 11122');
 renderPage(page)
}
function renderPage(page){
 if(page==='dashboard')renderDashboard();
 if(page==='month')renderMonth();
 if(page==='planner')renderPlanner();
 if(page==='vending')renderVending();
 if(page==='automation')renderAutomation();
 if(page==='progress')renderProgress();
 if(page==='tests')renderTests();
 if(page==='goals')renderGoals();
 if(page==='condition')renderCondition();
 if(page==='analysis')renderAnalysis();
 if(page==='hike')renderHike();
 if(page==='settings')renderSettings()
}
function renderAllVisible(){const p=$('.page.active')?.id||'dashboard';renderPage(p);$('#topDate').textContent=fmtDate(selected)}

function renderDashboard(){
 runAutomationForDate(selected);
 const tasks=tasksFor(selected),units=todayUnitState(tasks),stage=activeStage(selected),pb=plannedStudy(selected),auto=autoActualStudy(selected),final=finalStudy(selected);
 $('#topDate').textContent=fmtDate(selected);
 $('#stageLabel').textContent=stage.label;
 $('#stageTitle').textContent=stage.title;
 $('#stageDesc').textContent=stage.key==='nine'?'목표 11122':'목표 11111';
 $('#dday9').textContent=selected>EXAM9?'완료':'D-'+dday(EXAM9,selected);
 $('#ddayCsat').textContent=selected>CSAT?'완료':'D-'+dday(CSAT,selected);
 $('#planLockBadge').textContent=DB.planLocks[selected]?'계획 확정':'계획 열림';
 $('#togglePlanLock').textContent=DB.planLocks[selected]?'계획 잠금 해제':'오늘 계획 확정';
 $('#focusTaskCount').textContent=`${units.done}/${units.total}`;
 const cb=currentBlock(selected),nb=nextBlock(selected);
 const nowTask=cb?(cb.taskIds||[]).map(id=>taskById(selected,id)).find(t=>t&&!t.done):null;
 const nextTask=nowTask||((nb?.taskIds||[]).map(id=>taskById(selected,id)).find(t=>t&&!t.done))||tasks.find(t=>!t.done);
 $('#focusNowTask').textContent=nextTask?.name||'아직 없음';
 $('#focusCurrentBlock').textContent=cb?.name||(selected===ymd()?'현재 블록 없음':'선택 날짜');
 $('#focusRemainStudy').textContent=minuteLabel(remainingStudyToday(selected));
 $('#plannedStudyTime').textContent=minuteLabel(pb.minutes);
 $('#autoStudyTime').textContent=minuteLabel(auto);
 $('#finalStudyTime').textContent=minuteLabel(final);
 $('#studyOverrideHours').value=DB.studyOverrides[selected]!=null?(DB.studyOverrides[selected]/60).toFixed(1):'';
 $('#unknownPeriodHint').textContent=pb.unknown?`정규 자습 ${pb.unknown}개는 교시 시각이 없어 자동 시간 합계에서 제외됩니다. 톱니바퀴에서 평일 교시 시각을 한 번 입력하면 포함됩니다.`:'';
 renderTaskList();
 renderCompactSchedule();
 renderGapList('#gapQuick',studyGaps(selected),true);
 renderTestQuick();
 renderOverload();
 renderAutomationBanner();
}
function renderOverload(){
 const tasks=tasksFor(selected).filter(t=>!t.done),known=tasks.reduce((s,t)=>s+(Number(t.minutes)||0),0),unknown=tasks.filter(t=>!Number(t.minutes)).length,p=plannedStudy(selected).minutes;
 const el=$('#overloadBanner');
 if(known>p&&p>0){el.classList.remove('hidden');el.innerHTML=`오늘 할 일 예상 ${minuteLabel(known)} / 시간표상 자습 ${minuteLabel(p)}. <b>${minuteLabel(known-p)} 초과</b>${unknown?` · 시간 미입력 ${unknown}개 별도`:''}`}
 else el.classList.add('hidden')
}
function renderAutomationBanner(){
 const c=DB.automationConflicts.filter(x=>x.date===selected),el=$('#automationConflictBanner');
 if(c.length){el.classList.remove('hidden');el.textContent=`반복 자동화 미완료 충돌 ${c.length}건이 있습니다. 자동화 화면에서 합치기/별도 유지/이전 건너뛰기를 선택하세요.`}else el.classList.add('hidden')
}
function todayUnitState(list){
 let total=0,done=0;
 (list||[]).forEach(t=>{
  const lectures=(t.components||[]).filter(c=>c.kind==='lecture');
  if(lectures.length){total+=lectures.length;done+=lectures.filter(c=>c.done).length}
  else{total+=1;if(t.done)done+=1}
 });
 return{total,done}
}
function taskTimelineMinute(date,t){
 const mins=taskLinkedBlocks(date,t.id).map(b=>plannerMinute(b.start)).filter(x=>x!=null);
 return mins.length?Math.min(...mins):Number.POSITIVE_INFINITY
}
function sortedTodayTasks(date){
 const mode=DB.settings.taskSortMode||'timeline',order=new Map(SUBJECTS.map((s,i)=>[s,i]));
 return tasksFor(date).map((t,i)=>({t,i})).sort((a,b)=>{
  if(mode==='subject'){
   const sa=order.has(a.t.subject)?order.get(a.t.subject):99,sb=order.has(b.t.subject)?order.get(b.t.subject):99;
   return sa-sb||a.i-b.i
  }
  const ta=taskTimelineMinute(date,a.t),tb=taskTimelineMinute(date,b.t);
  return ta-tb||a.i-b.i
 }).map(x=>x.t)
}
function renderTaskList(){
 const box=$('#todayTasks'),list=sortedTodayTasks(selected);
 const sort=$('#taskSortMode');if(sort)sort.value=DB.settings.taskSortMode||'timeline';
 if(!list.length){box.innerHTML='<div class="muted">아직 할 일이 없습니다. 학습 자판기나 자동화에서 추가하거나 직접 추가하세요.</div>';return}
 box.innerHTML=list.map(t=>{
  const st=taskState(t),linked=taskLinkedBlocks(selected,t.id),partial=st.total>1?`${st.done}/${st.total} 완료`:linked.length>1?`시간표 ${linked.filter(b=>b.done).length}/${linked.length} 사용`:'';
  return `<div class="task ${t.done?'done':''}" data-task="${t.id}">
   <div class="task-row">
    <input class="task-check" data-id="${t.id}" type="checkbox" ${t.done?'checked':''}>
    <div>
      <div><span class="priority-pill ${t.priority}">${PRIORITY_LABEL[t.priority]||'권장'}</span><span class="subject-pill ${subjectClass(t.subject)}">${esc(t.subject)}</span><span class="task-title">${esc(t.name)}</span></div>
      <div class="task-meta">${esc(t.material||'')}${t.minutes?` · ${t.minutes}분`:''}${linked.length?` · 시간표 ${linked.length}곳`:''}</div>
      ${partial?`<div class="task-meta"><b>${partial}</b></div>`:''}
      ${st.total>1?`<details class="component-toggle" data-tid="${t.id}" ${taskDetailOpen.has(t.id)?'open':''}><summary>세부 완료</summary><div class="component-list">${t.components.map(c=>`<label class="component-item"><input class="component-check" data-tid="${t.id}" data-cid="${c.id}" type="checkbox" ${c.done?'checked':''}>${esc(c.label)}</label>`).join('')}</div></details>`:''}
    </div>
    <div class="task-actions"><button class="btn ghost small task-edit" data-id="${t.id}">수정</button><button class="btn ghost small task-wait" data-id="${t.id}">대기</button><button class="btn danger small task-del" data-id="${t.id}">삭제</button></div>
   </div>
  </div>`
 }).join('');
 $$('.component-toggle').forEach(d=>d.ontoggle=()=>{if(d.open)taskDetailOpen.add(d.dataset.tid);else taskDetailOpen.delete(d.dataset.tid)});
 $$('.task-check').forEach(x=>x.onchange=()=>{setTaskDoneInternal(selected,x.dataset.id,x.checked);renderDashboard();renderProgress();renderVendingIfVisible()});
 $$('.component-check').forEach(x=>x.onchange=()=>{taskDetailOpen.add(x.dataset.tid);setTaskComponentDone(selected,x.dataset.tid,x.dataset.cid,x.checked);renderDashboard();renderProgress();renderVendingIfVisible()});
 $$('.task-edit').forEach(b=>b.onclick=()=>openTaskModal(taskById(selected,b.dataset.id)));
 $$('.task-wait').forEach(b=>b.onclick=()=>{moveTaskToWaiting(selected,b.dataset.id);renderDashboard()});
 $$('.task-del').forEach(b=>b.onclick=()=>{if(confirm('이 할 일을 휴지통으로 이동할까요?')){removeTask(selected,b.dataset.id,true);renderDashboard()}})
}
function renderCompactSchedule(){
 const box=$('#todayScheduleList'),blocks=ensureSchedule(selected);
 if(!blocks.length){box.innerHTML='<div class="muted">시간 블록이 없습니다. 시간표에서 10분 격자로 빠르게 추가할 수 있습니다.</div>';return}
 box.innerHTML=blocks.map(b=>{
  const names=(b.taskIds||[]).map(id=>taskById(selected,id)?.name).filter(Boolean);
  return `<div class="schedule-row ${b.done?'done':''} ${b.selfStudy&&!names.length?'empty-self':''}">
   <div class="time">${regularTimeLabel(b)}</div>
   <div><div class="name">${b.locked?'잠금 · ':''}${deviceMark(b)}${esc(b.name)}</div><div class="assigned">${names.length?names.map(esc).join(' + '):(b.selfStudy?'할 일 미배정':b.type==='meal'?'식사·휴식':'')}</div></div>
   <div class="row">${b.selfStudy?`<button class="btn ghost small quick-assign" data-id="${b.id}">할 일 선택</button>`:''}<label class="inline"><input class="block-done" data-id="${b.id}" type="checkbox" ${b.done?'checked':''}>완료</label></div>
  </div>`
 }).join('');
 $$('.quick-assign').forEach(b=>b.onclick=()=>openAssignModal(selected,b.dataset.id));
 $$('.block-done').forEach(x=>x.onchange=()=>{setBlockDone(selected,x.dataset.id,x.checked);renderDashboard()})
}

function openTaskModal(t=null){
 $('#taskModalTitle').textContent=t?'할 일 수정':'할 일 추가';$('#taskId').value=t?.id||'';$('#taskSubject').value=t?.subject||'국어';$('#taskPriority').value=t?.priority||'must';$('#taskMinutes').value=t?.minutes||'';$('#taskName').value=t?.name||'';$('#taskMaterial').value=t?.material||'';$('#taskNote').value=t?.note||'';showModal('taskModal')
}
function saveTaskModal(){
 const id=$('#taskId').value,name=$('#taskName').value.trim();if(!name){alert('할 일을 입력하세요.');return}
 if(id){const t=taskById(selected,id);if(t){t.subject=$('#taskSubject').value;t.priority=$('#taskPriority').value;t.minutes=Number($('#taskMinutes').value||0);t.name=name;t.material=$('#taskMaterial').value.trim();t.note=$('#taskNote').value.trim();if(t.components?.length===1&&t.components[0].kind==='manual')t.components[0].label=name}}
 else addTask(selected,{subject:$('#taskSubject').value,priority:$('#taskPriority').value,minutes:Number($('#taskMinutes').value||0),name,material:$('#taskMaterial').value.trim(),note:$('#taskNote').value.trim(),components:[{id:uid(),kind:'manual',label:name,done:false}]});
 saveDB();hideModal('taskModal');renderDashboard()
}
function renderTestQuick(){
 const a=[...DB.tests].sort((x,y)=>y.date.localeCompare(x.date)).slice(0,3),box=$('#testQuick');
 if(!a.length){box.innerHTML='<div class="muted">시험 기록이 없습니다.</div>';return}
 box.innerHTML=a.map(t=>`<div class="test-quick-row"><b>${esc(t.subject||'전과목')} · ${esc(t.name||'시험')}</b><br>${t.date}${t.grade?` · ${t.grade}등급`:''}${t.score?` · ${t.score}점`:''}</div>`).join('')
}
function renderGapList(selector,gaps,compact=false){
 const el=$(selector);if(!el)return;el.innerHTML=gaps.map(g=>`<div class="gap-row ${g.gap>=3?'warn':''}"><b>${g.subject}</b><span>${g.last?`마지막 완료 ${g.last}`:'완료 기록 없음'}</span><b>${g.gap===999?'미기록':g.gap===0?'오늘':`${g.gap}일`}</b></div>`).join('')
}

function renderMonth(){
 $('#monthPicker').value=displayMonth;
 const [y,m]=displayMonth.split('-').map(Number),first=new Date(y,m-1,1,12),last=new Date(y,m,0,12),days=last.getDate();
 let cells='';for(let i=0;i<first.getDay();i++)cells+='<button class="month-day blank"></button>';
 let totalMin=0,totalTasks=0,doneTasks=0,testCount=0;
 for(let n=1;n<=days;n++){
  const date=`${displayMonth}-${String(n).padStart(2,'0')}`,list=DB.tasks[date]||[],done=list.filter(t=>t.done).length,rate=list.length?Math.round(done/list.length*100):0,mins=finalStudy(date),hasTest=DB.tests.some(t=>t.date===date);
  totalMin+=mins;totalTasks+=list.length;doneTasks+=done;if(hasTest)testCount++;
  cells+=`<button class="month-day ${date===ymd()?'today':''} ${date===selected?'selected':''}" data-date="${date}"><div class="n">${n}${hasTest?'<span class="test-dot"></span>':''}</div><div class="month-mini">${list.length?`${rate}%`:'-'}<br>${mins?minuteLabel(mins):'0분'}</div></button>`
 }
 $('#monthCalendar').innerHTML=cells;
 $$('#monthCalendar .month-day[data-date]').forEach(b=>b.onclick=()=>{selected=b.dataset.date;$('#plannerDate').value=selected;renderMonth();navigate('dashboard')});
 $('#monthStats').innerHTML=`<div><span>월 순공</span><b>${hoursLabel(totalMin)}</b></div><div><span>할 일 달성률</span><b>${totalTasks?Math.round(doneTasks/totalTasks*100):0}%</b></div><div><span>시험</span><b>${testCount}회</b></div><div><span>최종 목표</span><b>수능 11111</b></div>`
}

function renderPlanner(){
 $('#plannerDate').value=selected;
 const blocks=ensureSchedule(selected),pb=plannedStudy(selected),auto=autoActualStudy(selected);
 $('#plannerStats').innerHTML=`<div><span>계획 자습</span><b>${minuteLabel(pb.minutes)}</b></div><div><span>자동 실제</span><b>${minuteLabel(auto)}</b></div><div><span>최종 기록</span><b>${minuteLabel(finalStudy(selected))}</b></div><div><span>미배정 자습</span><b>${blocks.filter(b=>b.selfStudy&&!(b.taskIds||[]).length).length}개</b></div>`;
 $('#plannerModeBtn').textContent=plannerEdit?'보기 모드로':'편집 모드';
 $('#plannerModeHint').textContent=plannerSleepMode?'☽ 선택':(plannerEdit?'편집':'보기');
 $('#addGridBlockBtn').disabled=!plannerEdit;
 $('#sleepModeBtn').classList.toggle('primary',plannerSleepMode);
 const unknown=blocks.filter(b=>b.regular&&!(b.start&&b.end));
 $('#unknownRegularStrip').innerHTML=unknown.length?`<div class="muted" style="width:100%">교시 시각 미설정 · ⚙에서 입력</div>`+unknown.map(b=>`<span class="regular-chip ${b.selfStudy?'self':''}">${b.period}교시 ${b.device?'⌨︎ ':''}${esc(b.name)}${b.selfStudy?' · 자습':''}</span>`).join(''):'';
 $('#plannerLegend').innerHTML=plannerLegendHTML();
 renderPlannerQuickPanel();
 renderTenGrid()
}
function renderPlannerQuickPanel(){
 const session=sleepSession(selected),next=nextSelfStudyBlock(selected),current=currentBlock(selected),unfinished=tasksFor(selected).filter(t=>!t.done).length;
 $('#plannerQuickPanel').innerHTML=`<div class="planner-quick-grid">
   <div class="planner-quick-item"><span>현재</span><b>${current?`${deviceMark(current)}${esc(current.name)}`:'없음'}</b></div>
   <div class="planner-quick-item"><span>다음 자습</span><b>${next?`${deviceMark(next)}${esc(next.name)}${next.start&&next.end?` · ${next.start}`:''}`:'없음'}</b></div>
   <div class="planner-quick-item"><span>미완료</span><b>${unfinished}개</b></div>
 </div>
 <div class="planner-sleep-box">
   <div class="planner-sleep-row"><div class="planner-sleep-icon">☽</div><div class="planner-sleep-value">${session.bed||'–'}</div></div>
   <div class="planner-sleep-row"><div class="planner-sleep-icon">☼︎</div><div class="planner-sleep-value">${session.wake||'–'}</div></div>
   <div class="planner-sleep-row"><div class="planner-sleep-icon">◔</div><div class="planner-sleep-value">${sleepSpanLabel(session.bed,session.wake)}</div></div>
 </div>`
}
function renderTenGrid(){
 const box=$('#tenMinutePlanner'),blocks=ensureSchedule(selected),mapped=new Map(),bedVal=plannerNightBed(selected),wakeVal=plannerMorningWake(selected),sleepIdx=bedVal?plannerIndexForTime(bedVal):null,wakeIdx=wakeVal?plannerIndexForTime(wakeVal):null;
 blocks.filter(b=>b.start&&b.end).forEach(b=>{
  let s=plannerIndexForTime(b.start),e=plannerIndexForTime(b.end);if(s==null||e==null)return;if(e<=s)e+=144;
  for(let i=Math.max(0,s);i<Math.min(120,e);i++){if(!mapped.has(i))mapped.set(i,b)}
 });
 let html='';
 for(let h=5;h<25;h++){
  const hour=h%24;html+=`<div class="ten-hour"><div class="hour-label">${String(hour).padStart(2,'0')}:00</div>`;
  for(let k=0;k<6;k++){
   const idx=(h-5)*6+k,b=mapped.get(idx),prev=mapped.get(idx-1),first=b&&(!prev||prev.id!==b.id),isSleep=sleepIdx===idx,isWake=wakeIdx===idx;
   const cls=[plannerEdit&&!b?'editable':'',b?`${blockColorClass(selected,b)} block-cell`:'',isSleep?'sleep-marker':'',isWake?'wake-marker':''].filter(Boolean).join(' ');
   let label='';
   if(first)label=`<span class="cell-label">${deviceMark(b)}${esc(b.name)}</span>`;
   if(isSleep&&isWake)label=`<span class="cell-label">☽☼︎</span>`;
   else if(isSleep)label=`<span class="cell-label">☽</span>`;
   else if(isWake)label=`<span class="cell-label">☼︎</span>`;
   html+=`<div class="ten-cell ${cls}" data-index="${idx}" ${b?`data-block="${b.id}"`:''}>${label}</div>`
  }html+='</div>'
 }
 box.innerHTML=html;box.classList.toggle('planner-mode-edit',plannerEdit);
 $$('.ten-cell[data-block]').forEach(c=>c.onclick=e=>{if(plannerSleepMode)return;e.stopPropagation();openBlockModal(selected,c.dataset.block)});
 $$('.ten-cell').forEach(c=>c.addEventListener('click',()=>{if(!plannerSleepMode)return;const idx=Number(c.dataset.index);plannerSleepMode=false;openSleepModal(selected,plannerIndexToTime(idx))}));
 if(plannerEdit&&!plannerSleepMode)bindPlannerSelection()
}
function openSleepModal(date,time=''){
 const sessionDate=addDays(date,1),session=sleepSession(sessionDate);$('#sleepDate').value=date;$('#sleepBed').value=time||session.bed||'23:30';$('#sleepWake').value=session.wake||'06:30';$('#sleepSummaryText').textContent=`다음 날 수면 ${sleepSpanLabel($('#sleepBed').value,$('#sleepWake').value)}`;showModal('sleepModal')
}
function saveSleepModal(){
 const date=$('#sleepDate').value||selected,sessionDate=addDays(date,1),bed=$('#sleepBed').value,wake=$('#sleepWake').value;
 DB.condition[sessionDate]={...(DB.condition[sessionDate]||{}),bed,wake};planMeta(date).bed=bed;planMeta(sessionDate).wake=wake;
 saveDB();hideModal('sleepModal');selected=date;renderPlanner();
}
function clearSleepModal(){
 const date=$('#sleepDate').value||selected,sessionDate=addDays(date,1);if(DB.condition[sessionDate]){DB.condition[sessionDate].bed='';DB.condition[sessionDate].wake=''};planMeta(date).bed='';planMeta(sessionDate).wake='';saveDB();hideModal('sleepModal');selected=date;renderPlanner();
}
function clearPlannerSelection(){plannerSelectStart=null;plannerDragStart=null;plannerDragEnd=null;plannerDragging=false;$$('.ten-cell').forEach(c=>c.classList.remove('selected-cell'))}
function highlightRange(a,b){const lo=Math.min(a,b),hi=Math.max(a,b);$$('.ten-cell').forEach(c=>{const i=Number(c.dataset.index);c.classList.toggle('selected-cell',i>=lo&&i<=hi&&!c.dataset.block)})}
function openRangeBlock(a,b){
 const lo=Math.min(a,b),hi=Math.max(a,b);const occupied=$$('.ten-cell').some(c=>{const i=Number(c.dataset.index);return i>=lo&&i<=hi&&c.dataset.block});if(occupied){alert('이미 일정이 있는 칸이 포함되어 있습니다. 빈 칸만 선택해 주세요.');clearPlannerSelection();return}
 openBlockModal(selected,null,{start:plannerIndexToTime(lo),end:plannerIndexToTime(hi+1),name:'자습',type:'self',selfStudy:true,device:true});clearPlannerSelection()
}
function bindPlannerSelection(){
 const box=$('#tenMinutePlanner');let moved=false;
 $$('.ten-cell.editable').forEach(c=>{
  c.onpointerdown=e=>{e.preventDefault();plannerDragging=true;moved=false;plannerDragStart=plannerDragEnd=Number(c.dataset.index);highlightRange(plannerDragStart,plannerDragEnd)}
 });
 box.onpointermove=e=>{if(!plannerDragging)return;const target=document.elementFromPoint?.(e.clientX,e.clientY)?.closest?.('.ten-cell.editable');if(!target)return;const idx=Number(target.dataset.index);if(idx!==plannerDragEnd){moved=true;plannerDragEnd=idx;highlightRange(plannerDragStart,plannerDragEnd)}};
 box.onpointerup=()=>{if(!plannerDragging)return;const a=plannerDragStart,b=plannerDragEnd;plannerDragging=false;if(moved&&a!==b){openRangeBlock(a,b);return}if(plannerSelectStart==null){plannerSelectStart=a;highlightRange(a,a);$('#plannerModeHint').textContent=`${plannerIndexToTime(a)} 시작 선택 · 마지막 칸을 한 번 더 누르세요.`}else{const first=plannerSelectStart;plannerSelectStart=null;openRangeBlock(first,a)}};
 box.onpointercancel=()=>{plannerDragging=false;clearPlannerSelection()}
}
function openBlockModal(date,id=null,prefill=null){
 const b=id?ensureSchedule(date).find(x=>x.id===id):null;
 $('#blockModalTitle').textContent=b?'시간 블록 수정':'시간 블록 추가';$('#blockId').value=b?.id||'';$('#blockDate').value=date;$('#blockName').value=b?.name||prefill?.name||'자습';$('#blockType').value=b?.type||prefill?.type||'self';$('#blockStart').value=b?.start||prefill?.start||'';$('#blockEnd').value=b?.end||prefill?.end||'';$('#blockActual').value=b?.actualMin??'';$('#blockSelfStudy').checked=b?b.selfStudy:(prefill?.selfStudy??true);$('#blockDevice').checked=b?b.device:(prefill?.device??true);$('#blockLocked').checked=b?b.locked:false;$('#deleteBlock').style.display=b&&!b.fixed?'inline-flex':'none';pendingAssignBlock=b?.id||null;renderBlockLinked(date,b);showModal('blockModal')
}
function renderBlockLinked(date,b){
 const box=$('#blockLinkedTasks');if(!b){box.innerHTML='<div class="muted">저장 후 할 일을 선택할 수 있습니다.</div>';return}
 const arr=(b.taskIds||[]).map(id=>taskById(date,id)).filter(Boolean);box.innerHTML=arr.length?arr.map(t=>`<div class="linked-task-chip">${esc(t.subject)} · ${esc(t.name)}</div>`).join(''):'<div class="muted">연결된 할 일이 없습니다.</div>'
}
function saveBlockModal(){
 const date=$('#blockDate').value,id=$('#blockId').value,blocks=ensureSchedule(date);let b=id?blocks.find(x=>x.id===id):null,isNew=!b;
 if(!b){b={id:uid(),schema:6,fixed:false,regular:false,taskIds:[],done:false};blocks.push(b)}
 b.name=$('#blockName').value.trim()||'시간 블록';b.type=$('#blockType').value;b.start=$('#blockStart').value;b.end=$('#blockEnd').value;b.selfStudy=$('#blockSelfStudy').checked;b.device=b.selfStudy&&$('#blockDevice').checked;b.locked=$('#blockLocked').checked;b.actualMin=$('#blockActual').value===''?null:Number($('#blockActual').value);if(b.fixed)b.userOverrides={name:b.name,type:b.type,selfStudy:b.selfStudy,device:b.device,start:b.start,end:b.end};
 if(b.start&&b.end&&blockDuration(b)<=0){alert('종료 시각을 확인해 주세요.');return}
 saveSchedule(date,blocks);hideModal('blockModal');selected=date;renderPlanner();renderDashboard();
 if(isNew&&b.selfStudy)openAssignModal(date,b.id)
}
function deleteBlockModal(){
 const date=$('#blockDate').value,id=$('#blockId').value,blocks=ensureSchedule(date),b=blocks.find(x=>x.id===id);if(!b||b.fixed)return;if(!confirm('이 시간 블록을 휴지통으로 이동할까요?'))return;trashPush('block',b,{date});saveSchedule(date,blocks.filter(x=>x.id!==id));hideModal('blockModal');renderPlanner();renderDashboard()
}
function openAssignModal(date,blockId){
 const b=ensureSchedule(date).find(x=>x.id===blockId);if(!b)return;
 $('#assignDate').value=date;$('#assignBlockId').value=blockId;$('#assignBlockLabel').textContent=`${b.start&&b.end?`${b.start}~${b.end} · `:''}${b.name}`;$('#assignSearch').value='';renderAssignList();showModal('assignModal')
}
function renderAssignList(){
 const date=$('#assignDate').value,id=$('#assignBlockId').value,b=ensureSchedule(date).find(x=>x.id===id),q=$('#assignSearch').value.trim().toLowerCase(),list=tasksFor(date).filter(t=>!q||`${t.subject} ${t.name} ${t.material}`.toLowerCase().includes(q));
 $('#assignTaskList').innerHTML=list.length?list.map(t=>{const links=taskLinkedBlocks(date,t.id).filter(x=>x.id!==id).length;return `<label class="assign-option"><input class="assign-check" type="checkbox" value="${t.id}" ${(b.taskIds||[]).includes(t.id)?'checked':''}><div><b>${esc(t.subject)} · ${esc(t.name)}</b><div class="task-meta">${esc(t.material||'')}${links?` · 다른 블록 ${links}곳에도 배정`:''}</div></div></label>`}).join(''):'<div class="muted">이 날짜의 할 일이 없습니다.</div>';updateAssignCount();$$('.assign-check').forEach(x=>x.onchange=updateAssignCount)
}
function updateAssignCount(){$('#assignCount').textContent=`${$$('.assign-check:checked').length}개 선택`}
function saveAssignments(){
 const date=$('#assignDate').value,id=$('#assignBlockId').value,blocks=ensureSchedule(date),b=blocks.find(x=>x.id===id);if(!b)return;b.taskIds=$$('.assign-check:checked').map(x=>x.value);saveSchedule(date,blocks);hideModal('assignModal');renderPlanner();renderDashboard()
}

function renderVendingIfVisible(){if($('#vending')?.classList.contains('active'))renderVending()}
function renderVending(){
 $$('.learning-tab').forEach(b=>b.classList.toggle('active',b.dataset.vtab===vendingTab));
 $('#lecturePanel').classList.toggle('hidden',vendingTab==='book');$('#bookPanel').classList.toggle('hidden',vendingTab==='lecture');
 renderRecentLearning();renderLectureCatalog();renderBookCatalog();renderCart()
}
function renderRecentLearning(){
 const box=$('#recentLearning'),a=DB.recentLearning||[];box.innerHTML=a.length?'<span class="muted">최근 사용</span>'+a.map(x=>`<button class="recent-chip" data-kind="${x.kind}" data-id="${x.id}">${esc(x.label)}</button>`).join(''):'';
 $$('#recentLearning .recent-chip').forEach(b=>b.onclick=()=>{const q=b.textContent;$('#learningSearch').value=q;applyVendingSearch()})
}
function renderLectureCatalog(){
 const q=$('#learningSearch')?.value.trim().toLowerCase()||'',inc=$('#incompleteOnly')?.checked;
 $('#lectureCatalog').innerHTML=allLectureCourses().map(c=>{
  const done=lectureCourseDone(c),buttons=[];
  for(let n=1;n<=c.total;n++){
   const ref=lectureRef(c.key,n),isDone=lectureDone(ref),inCart=cart.some(x=>x.kind==='lecture'&&x.ref===ref);
   if(inc&&isDone)continue;
   buttons.push(`<button class="lecture-btn ${isDone?'done':''} ${inCart?'cart':''}" data-ref="${ref}"><b>${String(n).padStart(2,'0')}강</b><small>${isDone?'완료':inCart?'장바구니':'미수강'}</small></button>`)
  }
  return `<section class="source-card vending-source" data-search="${esc(`${c.subject} ${c.provider} ${c.display}`.toLowerCase())}">
    <div class="source-head"><div><h4>${esc(c.subject)} · ${esc(c.provider)} ${esc(c.display)}</h4><span>${done}/${c.total}강 완료</span></div><div class="row"><button class="btn ghost small add-next" data-key="${c.key}" data-count="2">다음 2강</button>${c.custom?`<button class="btn danger small del-course" data-key="${c.key}">삭제</button>`:''}</div></div>
    <div class="lecture-grid">${buttons.join('')||'<div class="muted">표시할 강의가 없습니다.</div>'}</div>
  </section>`
 }).join('');
 $$('.lecture-btn').forEach(b=>b.onclick=()=>toggleLectureCart(b.dataset.ref));
 $$('.add-next').forEach(b=>b.onclick=()=>addNextLectures(b.dataset.key,Number(b.dataset.count)));
 $$('.del-course').forEach(b=>b.onclick=()=>{if(confirm('이 사용자 강좌를 휴지통으로 이동할까요?')){deleteLearningCourse(b.dataset.key);renderVending();renderProgress()}});
 applyVendingSearch()
}
function toggleLectureCart(ref){
 const i=cart.findIndex(x=>x.kind==='lecture'&&x.ref===ref);
 if(i>=0)cart.splice(i,1);else{const x=lectureInfo(ref);cart.push({id:uid(),kind:'lecture',ref});if(x)touchRecent('lecture',x.key,x.display)}
 renderVending()
}
function addNextLectures(key,count){
 const c=lectureCourse(key);if(!c)return;let n=0;
 for(let i=1;i<=c.total&&n<count;i++){const ref=lectureRef(key,i);if(!lectureDone(ref)&&!cart.some(x=>x.kind==='lecture'&&x.ref===ref)){cart.push({id:uid(),kind:'lecture',ref});n++}}
 touchRecent('lecture',c.key,c.display);renderVending()
}
function renderBookCatalog(){
 const q=$('#learningSearch')?.value.trim().toLowerCase()||'';
 $('#bookCatalog').innerHTML=DB.books.length?DB.books.map(b=>{
  const done=(b.subunits||[]).filter(s=>bookSubDone(b.id,s)).length;
  return `<section class="source-card vending-source" data-search="${esc(`${b.subject} ${b.name} ${(b.subunits||[]).join(' ')}`.toLowerCase())}">
   <div class="source-head"><div><h4>${esc(b.subject)} · ${esc(b.name)}</h4><span>소단원 ${done}/${(b.subunits||[]).length}</span></div><div class="row"><button class="btn ghost small problems-add" data-id="${b.id}">문제 수로 담기</button><button class="btn ghost small edit-book" data-id="${b.id}">편집</button><button class="btn danger small del-book" data-id="${b.id}">삭제</button></div></div>
   <div class="subunit-grid">${(b.subunits||[]).map((s,i)=>{const inCart=cart.some(x=>x.kind==='book-subunit'&&x.bookId===b.id&&x.subunit===s);return `<button class="subunit-btn ${bookSubDone(b.id,s)?'done':''} ${inCart?'cart':''}" data-book="${b.id}" data-sub="${esc(s)}" data-index="${i}"><b>${esc(s)}</b><small>${bookSubDone(b.id,s)?'완료':inCart?'장바구니':'소단원으로 담기'}</small></button>`}).join('')||'<div class="muted">소단원이 없습니다. 편집에서 추가하세요.</div>'}</div>
  </section>`
 }).join(''):'<div class="muted">등록된 문제집이 없습니다.</div>';
 $$('.subunit-btn').forEach(b=>b.onclick=()=>toggleBookSubunit(b.dataset.book,b.dataset.sub,Number(b.dataset.index)));
 $$('.problems-add').forEach(b=>b.onclick=()=>openProblemsModal(b.dataset.id));
 $$('.edit-book').forEach(b=>b.onclick=()=>openBookModal(DB.books.find(x=>x.id===b.dataset.id)));
 $$('.del-book').forEach(b=>b.onclick=()=>{if(confirm('이 문제집을 휴지통으로 이동할까요?')){deleteBook(b.dataset.id);renderVending();renderProgress()}});
 applyVendingSearch()
}
function toggleBookSubunit(bookId,subunit,index){
 const i=cart.findIndex(x=>x.kind==='book-subunit'&&x.bookId===bookId&&x.subunit===subunit);
 if(i>=0)cart.splice(i,1);else{const b=DB.books.find(x=>x.id===bookId);cart.push({id:uid(),kind:'book-subunit',bookId,subunit,index,minutes:30});if(b)touchRecent('book',b.id,b.name)}
 renderVending()
}
function openLectureModal(){['#lectureProvider','#lectureName','#lectureTotal'].forEach(s=>$(s).value='');$('#lectureSubject').value='수학';showModal('lectureModal')}
function saveLectureModal(){
 const name=$('#lectureName').value.trim(),provider=$('#lectureProvider').value.trim(),total=Number($('#lectureTotal').value);
 if(!name||!provider||!Number.isInteger(total)||total<1){alert('강사·강좌명·전체 강의 수를 확인하세요.');return}
 DB.customLectures.push({key:'custom-'+uid(),subject:$('#lectureSubject').value,provider,series:$('#lectureSubject').value,name,display:name,total,custom:true});saveDB();hideModal('lectureModal');renderVending();renderProgress()
}
function openBookModal(b=null){
 $('#bookModalTitle').textContent=b?'문제집 편집':'문제집 등록';$('#bookId').value=b?.id||'';$('#bookSubject').value=b?.subject||'수학';$('#bookName').value=b?.name||'';$('#bookSubunits').value=(b?.subunits||[]).join('\n');showModal('bookModal')
}
function saveBookModal(){
 const name=$('#bookName').value.trim();if(!name){alert('교재명을 입력하세요.');return}
 const subs=$('#bookSubunits').value.split(/\n|,/).map(x=>x.trim()).filter(Boolean),id=$('#bookId').value||uid(),obj={id,subject:$('#bookSubject').value,name,subunits:subs};
 const i=DB.books.findIndex(x=>x.id===id);if(i>=0)DB.books[i]=obj;else DB.books.push(obj);saveDB();hideModal('bookModal');renderVending();renderProgress()
}
function openProblemsModal(bookId){
 const b=DB.books.find(x=>x.id===bookId);if(!b)return;$('#problemBookId').value=bookId;$('#problemSubunit').innerHTML='<option value="">전체/미지정</option>'+(b.subunits||[]).map(s=>`<option>${esc(s)}</option>`).join('');$('#problemStart').value=1;$('#problemCount').value=10;$('#problemMinutes').value=30;showModal('bookProblemsModal')
}
function addProblemsCart(){
 const bookId=$('#problemBookId').value,b=DB.books.find(x=>x.id===bookId);if(!b)return;const start=Math.max(1,Number($('#problemStart').value)||1),count=Math.max(1,Number($('#problemCount').value)||1),end=start+count-1,subunit=$('#problemSubunit').value,minutes=Math.max(5,Number($('#problemMinutes').value)||30);
 cart.push({id:uid(),kind:'book-problems',bookId,subunit,start,end,count,minutes});touchRecent('book',b.id,b.name);hideModal('bookProblemsModal');renderVending()
}
function applyVendingSearch(){
 const q=$('#learningSearch')?.value.trim().toLowerCase()||'';$$('.vending-source').forEach(el=>el.classList.toggle('hidden',q&&!el.dataset.search.includes(q)))
}
function renderCart(){
 const box=$('#cartList');$('#cartCount').textContent=`${cart.length}개`;$('#cartDate').value=$('#cartDate').value||selected;
 box.innerHTML=cart.length?cart.map(x=>{
  if(x.kind==='lecture'){const i=lectureInfo(x.ref);return `<div class="cart-item"><div><b>인강 · ${esc(i?.display)} ${i?.n}강</b><span>${esc(i?.subject)} · ${esc(i?.provider)}</span></div><button class="btn danger small cart-del" data-id="${x.id}">×</button></div>`}
  const b=DB.books.find(y=>y.id===x.bookId);const label=x.kind==='book-subunit'?`${b?.name} · ${x.subunit}`:`${b?.name}${x.subunit?' · '+x.subunit:''} ${x.start}~${x.end}번`;
  return `<div class="cart-item"><div><b>문제집 · ${esc(label)}</b><span>${esc(b?.subject)} · ${x.minutes}분</span></div><button class="btn danger small cart-del" data-id="${x.id}">×</button></div>`
 }).join(''):'<div class="muted">강의나 문제집 항목을 클릭해서 담으세요.</div>';
 $$('.cart-del').forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==b.dataset.id);renderVending()});
 const date=$('#cartDate').value||selected,blocks=ensureSchedule(date),open=blocks.filter(b=>b.selfStudy&&!b.locked&&!(b.taskIds||[]).length);
 $('#cartHint').textContent=`${fmtDate(date)} · 빈 자습 블록 ${open.length}개 · 장바구니 ${cart.length}개`
}
function groupConsecutiveNumbers(rows,getN,getKey){
 const out=[];[...rows].sort((a,b)=>getKey(a).localeCompare(getKey(b))||getN(a)-getN(b)).forEach(x=>{
  const key=getKey(x),n=getN(x),g=out.at(-1);if(g&&g.key===key&&g.last+1===n){g.items.push(x);g.last=n}else out.push({key,first:n,last:n,items:[x]})
 });return out
}
function compactSubunits(items,b){
 const sorted=[...items].sort((a,c)=>a.index-c.index);if(!sorted.length)return'';
 if(sorted.length===1)return sorted[0].subunit;return `${sorted[0].subunit}~${sorted.at(-1).subunit}`
}
function buildCartTasks(date){
 const newTasks=[],lect=cart.filter(x=>x.kind==='lecture'),subs=cart.filter(x=>x.kind==='book-subunit'),probs=cart.filter(x=>x.kind==='book-problems');
 groupConsecutiveNumbers(lect,x=>lectureInfo(x.ref)?.n||0,x=>lectureInfo(x.ref)?.key||'').forEach(g=>{
  const info=lectureInfo(g.items[0].ref),components=g.items.map(x=>{const i=lectureInfo(x.ref);return{id:uid(),kind:'lecture',ref:x.ref,label:`${String(i.n).padStart(2,'0')}강`,done:lectureDone(x.ref)}});
  newTasks.push(addTask(date,{subject:info.subject,priority:'must',name:`${info.display} ${g.first===g.last?`${g.first}강`:`${g.first}~${g.last}강`}`,material:`${info.provider} · ${info.series}`,minutes:0,note:'학습 자판기 · 인강',components,taskKind:'lecture'}))
 });
 const byBook={};subs.forEach(x=>(byBook[x.bookId]||(byBook[x.bookId]=[])).push(x));
 Object.entries(byBook).forEach(([bookId,items])=>{
  const b=DB.books.find(x=>x.id===bookId);if(!b)return;
  groupConsecutiveNumbers(items,x=>x.index,()=>bookId).forEach(g=>{
   const components=g.items.map(x=>({id:uid(),kind:'book',bookItem:{mode:'subunit',bookId,subunit:x.subunit,index:x.index},label:x.subunit,done:bookSubDone(bookId,x.subunit)})),mins=g.items.reduce((s,x)=>s+(x.minutes||30),0);
   newTasks.push(addTask(date,{subject:b.subject,priority:'must',name:`${b.name} · ${compactSubunits(g.items,b)}`,material:b.name,minutes:mins,note:'학습 자판기 · 소단원',components,taskKind:'book'}))
  })
 });
 const probGroups=[];[...probs].sort((a,b)=>`${a.bookId}|${a.subunit}`.localeCompare(`${b.bookId}|${b.subunit}`)||a.start-b.start).forEach(x=>{
  const key=`${x.bookId}|${x.subunit}`,g=probGroups.at(-1);if(g&&g.key===key&&g.end+1===x.start){g.items.push(x);g.end=x.end;g.minutes+=x.minutes}else probGroups.push({key,bookId:x.bookId,subunit:x.subunit,start:x.start,end:x.end,minutes:x.minutes,items:[x]})
 });
 probGroups.forEach(g=>{const b=DB.books.find(x=>x.id===g.bookId);if(!b)return;const components=g.items.map(x=>({id:uid(),kind:'book',bookItem:{mode:'problems',bookId:x.bookId,subunit:x.subunit,start:x.start,end:x.end},label:`${x.start}~${x.end}번`,done:false}));newTasks.push(addTask(date,{subject:b.subject,priority:'must',name:`${b.name}${g.subunit?' · '+g.subunit:''} ${g.start}~${g.end}번`,material:b.name,minutes:g.minutes,note:'학습 자판기 · 문제 수',components,taskKind:'book'}))});
 return newTasks
}
function autoPlaceTasks(date,newTasks){
 const blocks=ensureSchedule(date),free=blocks.filter(b=>b.selfStudy&&!b.locked&&!(b.taskIds||[]).length);let placed=0;
 newTasks.filter(t=>t.taskKind==='lecture').forEach(t=>{const b=free.find(x=>x.device&&!(x.taskIds||[]).length);if(b){b.taskIds=[t.id];placed++}});
 newTasks.filter(t=>t.taskKind!=='lecture').forEach(t=>{const b=free.find(x=>!x.device&&!(x.taskIds||[]).length)||free.find(x=>x.device&&!(x.taskIds||[]).length);if(b){b.taskIds=[t.id];placed++}});
 saveSchedule(date,blocks);return placed
}
function buildCartPlan(){
 const date=$('#cartDate').value||selected;if(!cart.length){alert('장바구니가 비어 있습니다.');return}
 if(DB.planLocks[date]&&!confirm('이 날짜 계획이 잠겨 있습니다. 할 일만 추가하고 자동배치는 하지 않을까요?'))return;
 const n=buildCartTasks(date),placed=DB.planLocks[date]?0:autoPlaceTasks(date,n);cart=[];selected=date;saveDB();renderVending();navigate('dashboard');alert(`${n.length}개 묶음 할 일을 만들었습니다.${placed?` 시간표 ${placed}개 자동배치.`:''}`)
}
function learningProgressItems(){
 const rows=allLectureCourses().map(c=>({kind:'인강',sourceKind:'lecture',id:c.key,subject:c.subject,name:c.display,done:lectureCourseDone(c),total:c.total,note:`${c.provider} · ${c.series}`}));
 DB.books.forEach(b=>{const total=(b.subunits||[]).length,done=(b.subunits||[]).filter(s=>bookSubDone(b.id,s)).length;rows.push({kind:'문제집',sourceKind:'book',id:b.id,subject:b.subject,name:b.name,done,total,note:total?`소단원 ${done}/${total}`:'소단원 미등록'})});return rows
}
function renderProgress(){
 const rows=learningProgressItems(),subs=[...new Set(rows.map(x=>x.subject))],box=$('#progressCatalog');
 box.innerHTML=rows.length?subs.map(s=>`<section class="progress-group"><h4>${esc(s)}</h4><div class="progress-grid">${rows.filter(x=>x.subject===s).map(x=>{const pct=x.total?Math.round(x.done/x.total*100):0;return `<button class="progress-card" data-kind="${x.sourceKind}" data-id="${x.id}"><span class="kind-pill">${x.kind}</span><h5>${esc(x.name)}</h5><div class="task-meta">${esc(x.note)}</div><div class="progress-line"><i style="width:${pct}%"></i></div><b>${x.total?`${x.done}/${x.total} · ${pct}%`:'소단원 미등록'}</b></button>`}).join('')}</div></section>`).join(''):'<div class="muted">학습 자판기에 등록된 항목이 없습니다.</div>';
 $$('.progress-card').forEach(b=>b.onclick=()=>{navigate('vending');vendingTab=b.dataset.kind==='lecture'?'lecture':'book';$('#learningSearch').value=b.dataset.kind==='lecture'?(lectureCourse(b.dataset.id)?.display||''):(DB.books.find(x=>x.id===b.dataset.id)?.name||'');renderVending()})
}

function automationOptions(){
 return [...allLectureCourses().map(c=>({value:`lecture:${c.key}`,kind:'lecture',id:c.key,label:`인강 · ${c.provider} ${c.display}`,subject:c.subject})),...DB.books.map(b=>({value:`book:${b.id}`,kind:'book',id:b.id,label:`문제집 · ${b.subject} ${b.name}`,subject:b.subject}))]
}
function automationRuleApplies(r,date){
 if(r.enabled===false||!dateInRange(date,r.start,r.end)||date>CSAT)return false;
 if(!(r.weekdays||[]).includes(parseDate(date).getDay()))return false;
 if(DB.automationSkips[`${r.id}:${date}`])return false;return true
}
function taskUsesLecture(ref){return Object.values(DB.tasks).flat().some(t=>!t.done&&(t.components||[]).some(c=>c.kind==='lecture'&&c.ref===ref))}
function taskUsesSubunit(bookId,sub){return Object.values(DB.tasks).flat().some(t=>!t.done&&(t.components||[]).some(c=>c.kind==='book'&&c.bookItem?.mode==='subunit'&&c.bookItem.bookId===bookId&&c.bookItem.subunit===sub))}
function makeAutomationProposal(rule,date){
 const [kind,id]=String(rule.source).split(':');
 if(kind==='lecture'){const c=lectureCourse(id);if(!c)return null;let ref=null;for(let n=1;n<=c.total;n++){const x=lectureRef(c.key,n);if(!lectureDone(x)&&!taskUsesLecture(x)){ref=x;break}}if(!ref)return null;const i=lectureInfo(ref);return normalizeImportedTask({id:uid(),subject:c.subject,priority:rule.priority||'must',name:`${c.display} ${i.n}강`,material:`${c.provider} · ${c.series}`,minutes:Number(rule.minutes)||0,note:'반복 자동화 · 다음 미수강 강의',components:[{id:uid(),kind:'lecture',ref,label:`${String(i.n).padStart(2,'0')}강`,done:false}],taskKind:'lecture',automationRuleId:rule.id,autoKey:`auto60-${rule.id}-${date}`})}
 const b=DB.books.find(x=>x.id===id);if(!b)return null;const sub=(b.subunits||[]).find(s=>!bookSubDone(b.id,s)&&!taskUsesSubunit(b.id,s));
 if(sub)return normalizeImportedTask({id:uid(),subject:b.subject,priority:rule.priority||'must',name:`${b.name} · ${sub}`,material:b.name,minutes:Number(rule.minutes)||30,note:'반복 자동화 · 다음 미완료 소단원',components:[{id:uid(),kind:'book',bookItem:{mode:'subunit',bookId:b.id,subunit:sub,index:(b.subunits||[]).indexOf(sub)},label:sub,done:false}],taskKind:'book',automationRuleId:rule.id,autoKey:`auto60-${rule.id}-${date}`});
 return normalizeImportedTask({id:uid(),subject:b.subject,priority:rule.priority||'must',name:b.name,material:b.name,minutes:Number(rule.minutes)||30,note:'반복 자동화 · 문제집',components:[{id:uid(),kind:'manual',label:b.name,done:false}],taskKind:'book',automationRuleId:rule.id,autoKey:`auto60-${rule.id}-${date}`})
}
function runAutomationForDate(date){
 if(DB.planLocks[date]||date>CSAT)return;
 DB.automations.forEach(rule=>{
  if(!automationRuleApplies(rule,date))return;
  if(tasksFor(date).some(t=>t.automationRuleId===rule.id))return;
  if(DB.automationConflicts.some(c=>c.ruleId===rule.id&&c.date===date))return;
  const prev=[];Object.keys(DB.tasks).filter(d=>d<date).sort().forEach(d=>(DB.tasks[d]||[]).filter(t=>t.automationRuleId===rule.id&&!t.done).forEach(t=>prev.push({date:d,task:t})));
  const proposal=makeAutomationProposal(rule,date);if(!proposal)return;
  if(prev.length){const p=prev.at(-1);DB.automationConflicts.push({id:uid(),ruleId:rule.id,date,previousDate:p.date,previousTaskId:p.task.id,proposal});saveDB();return}
  tasksFor(date).push(proposal);saveDB()
 })
}
function renderAutomation(){
 const opts=automationOptions();
 $('#automationList').innerHTML=DB.automations.length?DB.automations.map(r=>{const s=opts.find(x=>x.value===r.source);return `<div class="automation-rule ${r.enabled===false?'paused':''}"><div class="rule-top"><div><b>${esc(s?.label||'삭제된 항목')}</b><div class="task-meta">${(r.weekdays||[]).map(x=>DAYNAME[x][0]).join('·')} · ${r.start||''}~${r.end||'계속'} · ${r.minutes?`${r.minutes}분`:'시간 미입력'}</div></div><div class="row"><button class="btn ghost small auto-edit" data-id="${r.id}">수정</button><button class="btn ghost small auto-skip" data-id="${r.id}">오늘만 건너뛰기</button><button class="btn warn small auto-toggle" data-id="${r.id}">${r.enabled===false?'재개':'일시정지'}</button><button class="btn danger small auto-del" data-id="${r.id}">삭제</button></div></div></div>`}).join(''):'<div class="muted">반복 규칙이 없습니다. 예: 사회문화 월·수·금, 경제 화·목·토, 영어 월~토.</div>';
 $$('.auto-edit').forEach(b=>b.onclick=()=>openAutomationModal(DB.automations.find(x=>x.id===b.dataset.id)));
 $$('.auto-skip').forEach(b=>b.onclick=()=>skipAutomationToday(b.dataset.id));
 $$('.auto-toggle').forEach(b=>b.onclick=()=>{const r=DB.automations.find(x=>x.id===b.dataset.id);if(r)r.enabled=r.enabled===false;saveDB();renderAutomation()});
 $$('.auto-del').forEach(b=>b.onclick=()=>{const r=DB.automations.find(x=>x.id===b.dataset.id);if(!r)return;if(confirm('이 반복 규칙을 휴지통으로 이동할까요?')){trashPush('automation',r);DB.automations=DB.automations.filter(x=>x.id!==r.id);DB.automationConflicts=DB.automationConflicts.filter(x=>x.ruleId!==r.id);saveDB();renderAutomation()}});
 renderConflicts()
}
function openAutomationModal(r=null){
 const opts=automationOptions();if(!opts.length){alert('학습 자판기에 강좌나 문제집을 먼저 등록하세요.');return}
 $('#automationSource').innerHTML=opts.map(x=>`<option value="${x.value}">${esc(x.label)}</option>`).join('');$('#automationId').value=r?.id||'';$('#automationSource').value=r?.source||opts[0].value;$$('#weekdayPicker input').forEach(x=>x.checked=(r?.weekdays||[1,2,3,4,5,6]).includes(Number(x.value)));$('#automationStart').value=r?.start||selected;$('#automationEnd').value=r?.end||CSAT;$('#automationPriority').value=r?.priority||'must';$('#automationMinutes').value=r?.minutes||'';$('#automationEnabled').checked=r?.enabled!==false;showModal('automationModal')
}
function saveAutomationModal(){
 const weekdays=$$('#weekdayPicker input:checked').map(x=>Number(x.value));if(!weekdays.length){alert('반복 요일을 하나 이상 선택하세요.');return}
 const id=$('#automationId').value||uid(),obj={id,source:$('#automationSource').value,weekdays,start:$('#automationStart').value,end:$('#automationEnd').value||CSAT,priority:$('#automationPriority').value,minutes:Number($('#automationMinutes').value)||0,enabled:$('#automationEnabled').checked},i=DB.automations.findIndex(x=>x.id===id);if(i>=0)DB.automations[i]=obj;else DB.automations.push(obj);saveDB();hideModal('automationModal');runAutomationForDate(selected);renderAutomation();renderDashboard()
}
function skipAutomationToday(id){
 DB.automationSkips[`${id}:${selected}`]=true;const t=tasksFor(selected).filter(x=>x.automationRuleId===id&&!x.done);t.forEach(x=>removeTask(selected,x.id,false));DB.automationConflicts=DB.automationConflicts.filter(x=>!(x.ruleId===id&&x.date===selected));saveDB();renderAutomation();renderDashboard()
}
function renderConflicts(){
 $('#conflictCount').textContent=`${DB.automationConflicts.length}건`;$('#conflictList').innerHTML=DB.automationConflicts.length?DB.automationConflicts.map(c=>{const r=DB.automations.find(x=>x.id===c.ruleId),o=automationOptions().find(x=>x.value===r?.source);return `<div class="conflict-card"><b>${esc(o?.label||'반복 할 일')}</b><div class="task-meta">${c.previousDate} 미완료 → ${c.date} 반복일</div><div class="row"><button class="btn primary small conflict-act" data-id="${c.id}" data-act="merge">오늘 것과 합치기</button><button class="btn ghost small conflict-act" data-id="${c.id}" data-act="separate">별도 유지</button><button class="btn warn small conflict-act" data-id="${c.id}" data-act="skip">이전 것은 건너뛰기</button></div></div>`}).join(''):'<div class="muted">미완료 충돌이 없습니다.</div>';
 $$('.conflict-act').forEach(b=>b.onclick=()=>resolveConflict(b.dataset.id,b.dataset.act))
}
function resolveConflict(id,act){
 const c=DB.automationConflicts.find(x=>x.id===id);if(!c)return;const prev=taskById(c.previousDate,c.previousTaskId);
 if(act==='merge'&&prev){removeTask(c.previousDate,prev.id,false);prev.id=uid();prev.note=(prev.note||'')+' · 전날 미완료와 오늘분 합침';tasksFor(c.date).push(prev)}
 if(act==='separate')tasksFor(c.date).push(c.proposal);
 if(act==='skip'){if(prev)removeTask(c.previousDate,prev.id,true);tasksFor(c.date).push(c.proposal)}
 DB.automationConflicts=DB.automationConflicts.filter(x=>x.id!==id);saveDB();renderAutomation();if(c.date===selected)renderDashboard()
}

function renderWaiting(){
 const box=$('#waitingList');box.innerHTML=DB.waiting.length?DB.waiting.map(t=>`<div class="waiting-item"><div class="waiting-top"><div><b>${esc(t.subject)} · ${esc(t.name)}</b><div class="task-meta">${esc(t.material||'')} · 대기 ${t.waitingSince||''}</div></div><div class="row"><button class="btn primary small wait-today" data-id="${t.id}">오늘로</button><button class="btn danger small wait-del" data-id="${t.id}">삭제</button></div></div></div>`).join(''):'<div class="muted">대기 중인 할 일이 없습니다.</div>';
 $$('.wait-today').forEach(b=>b.onclick=()=>{const i=DB.waiting.findIndex(x=>x.id===b.dataset.id);if(i<0)return;const t=DB.waiting.splice(i,1)[0];t.id=uid();t.waitingSince='';t.done=false;(t.components||[]).forEach(c=>c.done=false);tasksFor(selected).push(t);saveDB();renderWaiting();renderDashboard()});
 $$('.wait-del').forEach(b=>b.onclick=()=>{const t=DB.waiting.find(x=>x.id===b.dataset.id);if(!t)return;trashPush('waiting',t);DB.waiting=DB.waiting.filter(x=>x.id!==t.id);saveDB();renderWaiting()})
}

function renderTests(){
 const list=[...DB.tests].sort((a,b)=>b.date.localeCompare(a.date));
 $('#testList').innerHTML=list.length?list.map(t=>`<div class="test-card"><div class="test-top"><div><b>${t.date} · ${t.kind==='full'?esc(t.name||'전과목 모의고사'):`${esc(t.subject||'')} · ${esc(t.name||'시험')}`}</b><div class="task-meta">${t.kind==='full'?SUBJECTS.map(s=>`${s} ${t.grades?.[s]||'-'}등급`).join(' · '):`${t.score?`${t.score}점 · `:''}${t.grade?`${t.grade}등급 · `:''}${t.minutes?`${t.minutes}분 · `:''}`}${(t.causes||[]).map(esc).join(' / ')}</div>${t.wrongQuestions?`<div class="task-meta">다시 볼 문제: ${esc(t.wrongQuestions)}</div>`:''}</div><button class="btn danger small test-del" data-id="${t.id}">삭제</button></div></div>`).join(''):'<div class="muted">시험 기록이 없습니다.</div>';
 $$('.test-del').forEach(b=>b.onclick=()=>{const t=DB.tests.find(x=>x.id===b.dataset.id);if(!t)return;if(confirm('시험 기록을 휴지통으로 이동할까요?')){trashPush('test',t);DB.tests=DB.tests.filter(x=>x.id!==t.id);saveDB();renderTests()}});
 renderErrorCauseSummary();renderLatestGrades()
}
function renderErrorCauseSummary(){
 const counts={};ERROR_CAUSES.forEach(x=>counts[x]=0);DB.tests.forEach(t=>(t.causes||[]).forEach(c=>{if(counts[c]!=null)counts[c]++}));const max=Math.max(1,...Object.values(counts));
 $('#errorCauseSummary').innerHTML=`<div class="cause-summary">${ERROR_CAUSES.map(c=>`<div class="cause-row"><b>${c}</b><div class="cause-bar"><i style="width:${counts[c]/max*100}%"></i></div><span>${counts[c]}회</span></div>`).join('')}</div>`
}
function renderLatestGrades(){
 const latest=latestGrades(),goals=activeStage(selected).goals;$('#latestGradeSummary').innerHTML=SUBJECTS.map(s=>{const x=latest[s],ok=x&&x.grade<=goals[s];return `<div class="test-quick-row"><b>${s}</b> · ${x?`${x.grade}등급 (${x.date})`:'미입력'} · 목표 ${goals[s]}등급 ${x?`· ${ok?'도달권':'보완 필요'}`:''}</div>`}).join('')
}
function toggleTestKind(){
 const full=$('#testKind').value==='full';$('#singleTestFields').classList.toggle('hidden',full);$('#fullTestFields').classList.toggle('hidden',!full)
}
function openTestModal(){
 $('#testKind').value='single';toggleTestKind();$('#testDate').value=selected;$('#testSubject').value='국어';$('#testName').value='';$('#testScore').value='';$('#testGrade').value='';$('#testMinutes').value='';$('#testWrongQuestions').value='';$('#testMemo').value='';$$('.full-score,.full-grade').forEach(x=>x.value='');$$('.cause-picker input').forEach(x=>x.checked=false);showModal('testModal')
}
function saveTestModal(){
 const kind=$('#testKind').value,name=$('#testName').value.trim()||(kind==='full'?'전과목 모의고사':'시험'),base={id:uid(),kind,date:$('#testDate').value||selected,name,causes:$$('.cause-picker input:checked').map(x=>x.value),wrongQuestions:$('#testWrongQuestions').value.trim(),memo:$('#testMemo').value.trim()};
 if(kind==='full'){const scores={},grades={};$$('.full-score').forEach(x=>scores[x.dataset.sub]=Number(x.value)||0);$$('.full-grade').forEach(x=>grades[x.dataset.sub]=Number(x.value)||0);DB.tests.push({...base,scores,grades})}
 else DB.tests.push({...base,subject:$('#testSubject').value,score:Number($('#testScore').value)||0,grade:Number($('#testGrade').value)||0,minutes:Number($('#testMinutes').value)||0});
 saveDB();hideModal('testModal');renderTests();renderDashboard()
}

function studyDaysUntil(target,from=selected){let n=0;for(let d=parseDate(from);d<=parseDate(target);d.setDate(d.getDate()+1))if(d.getDay()!==0)n++;return Math.max(0,n)}
function renderGoals(){
 const st=activeStage(selected),latest=latestGrades();$('#goalStageBadge').textContent=`${st.title} · D-${dday(st.target,selected)}`;
 $('#gradeForecast').innerHTML=SUBJECTS.map(s=>{const x=latest[s],goal=st.goals[s],state=!x?'판정 불가':x.grade<=goal?'도달권':x.grade===goal+1?'경계':'보완 필요';return `<div class="gap-row"><b>${s}</b><span>${x?`최근 ${x.grade}등급 · ${x.date}`:'최근 등급 없음'} · 목표 ${goal}</span><b>${state}</b></div>`}).join('');
 const rows=allLectureCourses().map(c=>{const remain=c.total-lectureCourseDone(c),days=studyDaysUntil(st.target),per=days?remain/days:remain;return{c,remain,per}});
 const cap=Number(DB.settings.lectureDailyCap)||5,totalRemain=rows.reduce((s,x)=>s+x.remain,0),days=studyDaysUntil(st.target),daily=days?totalRemain/days:totalRemain,state=daily<=cap*.85?'가능':daily<=cap?'빡빡':'위험';
 $('#finishPressureBadge').textContent=`${state} · 하루 ${daily.toFixed(1)}강`;
 $('#finishForecast').innerHTML=rows.map(x=>`<div class="gap-row"><b>${esc(x.c.display)}</b><span>${lectureCourseDone(x.c)}/${x.c.total} · ${x.remain}강 남음</span><b>${x.per.toFixed(1)}/일</b></div>`).join('')+`<div class="muted">문제풀이·수학·영어 시간은 별도입니다. 이 수치는 인강 총량만 계산합니다.</div>`;
 renderRoadmap();renderGapList('#gapDetail',studyGaps(selected))
}
function renderRoadmap(){
 const steps=[
  {start:'2026-08-10',end:'2026-09-01',title:'9모 전 완주·실전 점검',desc:'개념·강좌를 정리하면서 실모와 기출 적용을 늘립니다.'},
  {start:'2026-09-02',end:'2026-09-13',title:'9모 분석·회복',desc:'9모 결과에서 틀린 이유와 학습 공백을 정리합니다.'},
  {start:'2026-09-14',end:'2026-10-11',title:'약점 재구축',desc:'등급을 막는 과목·유형을 우선 보완합니다.'},
  {start:'2026-10-12',end:'2026-11-01',title:'수능형 실전 확대',desc:'시간 배분과 전과목 실전 루틴을 안정화합니다.'},
  {start:'2026-11-02',end:'2026-11-18',title:'최종 안정화',desc:'새 자료보다 오답·기출·실전 감각을 유지합니다.'},
  {start:'2026-11-19',end:'2026-11-19',title:'수능',desc:'최종 목표 11111'}
 ];
 $('#longRoadmap').innerHTML=steps.map(s=>`<div class="roadmap-step ${selected>=s.start&&selected<=s.end?'active':''}"><b>${s.start.slice(5)}${s.end!==s.start?`~${s.end.slice(5)}`:''}</b><span><strong>${s.title}</strong><br>${s.desc}</span></div>`).join('')
}

function sleepMinutes(bed,wake){if(!bed||!wake)return null;let a=timeToMin(bed),b=timeToMin(wake);if(a==null||b==null)return null;if(b<=a)b+=1440;return b-a}
function calcSleep(bed,wake){const m=sleepMinutes(bed,wake);return m==null?'':`${Math.floor(m/60)}시간 ${m%60}분`}
function vitaminValues(c){if(Array.isArray(c?.vitamins))return c.vitamins;if(c?.vitamin)return['기존 비타민'];return[]}
function renderVitaminPicker(selectedValues=[]){
 const box=$('#vitaminPicker');if(!box)return;const selectedSet=new Set(selectedValues),opts=[...new Set([...(DB.settings.vitaminOptions||[]),...selectedValues])];
 box.innerHTML=opts.length?opts.map(v=>`<div class="vitamin-option"><label><input class="vitaminCheck" type="checkbox" value="${esc(v)}" ${selectedSet.has(v)?'checked':''}>${esc(v)}</label><button class="vitamin-remove" type="button" data-name="${esc(v)}" aria-label="${esc(v)} 삭제">×</button></div>`).join(''):'<span class="muted">등록된 비타민이 없습니다.</span>';
 $$('.vitamin-remove').forEach(b=>b.onclick=()=>{DB.settings.vitaminOptions=(DB.settings.vitaminOptions||[]).filter(v=>v!==b.dataset.name);saveDB();renderVitaminPicker($$('.vitaminCheck:checked').map(x=>x.value).filter(v=>v!==b.dataset.name))})
}
function addVitaminOption(){
 const input=$('#vitaminName'),name=input.value.trim();if(!name)return;DB.settings.vitaminOptions=[...new Set([...(DB.settings.vitaminOptions||[]),name])];saveDB();input.value='';const current=$$('.vitaminCheck:checked').map(x=>x.value);renderVitaminPicker([...current,name])
}
function conditionRows(through){
 const start=addDays(through,-59);
 return Object.keys(DB.condition||{}).filter(d=>d>=start&&d<=through).sort().map(date=>{
  const c=DB.condition[date]||{},sm=sleepMinutes(c.bed,c.wake),num=v=>(v===''||v==null?NaN:Number(v));let bed=timeToMin(c.bed);if(bed!=null&&bed<720)bed+=1440;
  return{date,c,sleep:sm,bed,fatigue:num(c.fatigue),focus:num(c.dailyFocus!==''&&c.dailyFocus!=null?c.dailyFocus:c.focus),quality:num(c.quality),vitamins:vitaminValues(c)}
 })
}
function avg(a){const x=a.filter(Number.isFinite);return x.length?x.reduce((s,n)=>s+n,0)/x.length:null}
function pearson(pairs){const p=pairs.filter(([a,b])=>Number.isFinite(a)&&Number.isFinite(b));if(p.length<4)return null;const ax=avg(p.map(x=>x[0])),ay=avg(p.map(x=>x[1]));let num=0,dx=0,dy=0;p.forEach(([x,y])=>{const a=x-ax,b=y-ay;num+=a*b;dx+=a*a;dy+=b*b});return dx&&dy?num/Math.sqrt(dx*dy):0}
function patternLevel(n){return n<7?'기록 부족':n<14?'초기 경향':n<30?'경향 확인':'반복 패턴'}
function assocText(r,positive,negative){if(r==null)return'비교 가능한 기록이 더 필요합니다.';if(r>=.25)return positive;if(r<=-.25)return negative;return'현재 기록에서는 뚜렷한 연관이 보이지 않습니다.'}
function renderConditionAnalysis(){
 const d=$('#conditionDate').value||selected,rows=conditionRows(d),box=$('#conditionAnalysis');if(!box)return;const level=patternLevel(rows.length);
 const bedFat=rows.filter(r=>Number.isFinite(r.bed)&&Number.isFinite(r.fatigue)),sleepFat=rows.filter(r=>Number.isFinite(r.sleep)&&Number.isFinite(r.fatigue)),sleepFocus=rows.filter(r=>Number.isFinite(r.sleep)&&Number.isFinite(r.focus));
 const rBedFat=pearson(bedFat.map(r=>[r.bed,r.fatigue])),rSleepFat=pearson(sleepFat.map(r=>[r.sleep,r.fatigue])),rSleepFocus=pearson(sleepFocus.map(r=>[r.sleep,r.focus]));
 const vit=rows.filter(r=>r.vitamins.length&&Number.isFinite(r.focus)),noVit=rows.filter(r=>!r.vitamins.length&&Number.isFinite(r.focus)),va=avg(vit.map(r=>r.focus)),na=avg(noVit.map(r=>r.focus));
 const vitaminNames=[...new Set(rows.flatMap(r=>r.vitamins))];
 const vitRows=vitaminNames.map(name=>{const a=rows.filter(r=>r.vitamins.includes(name)&&Number.isFinite(r.focus));return{name,n:a.length,mean:avg(a.map(r=>r.focus))}}).filter(x=>x.n>=2).sort((a,b)=>b.n-a.n).slice(0,5);
 box.innerHTML=`<div class="condition-analysis-head"><div><b>최근 60일 패턴</b><span>${rows.length}일 기록 · ${level}</span></div><span class="badge">연관만 표시</span></div>
 <div class="condition-insight-grid">
  <div class="condition-insight"><span>취침시간 ↔ 아침 피로</span><b>${assocText(rBedFat,'늦게 잔 날일수록 아침 피로가 높게 기록되는 경향입니다.','늦게 잔 날의 아침 피로가 오히려 낮게 기록되는 경향입니다.')}</b><small>${bedFat.length}일 비교</small></div>
  <div class="condition-insight"><span>수면시간 ↔ 아침 피로</span><b>${assocText(rSleepFat,'수면시간이 긴 날일수록 아침 피로가 높게 기록되는 경향입니다.','수면시간이 긴 날일수록 아침 피로가 낮게 기록되는 경향입니다.')}</b><small>${sleepFat.length}일 비교</small></div>
  <div class="condition-insight"><span>수면시간 ↔ 집중도</span><b>${assocText(rSleepFocus,'수면시간이 긴 날일수록 집중도가 높게 기록되는 경향입니다.','수면시간이 긴 날일수록 집중도가 낮게 기록되는 경향입니다.')}</b><small>${sleepFocus.length}일 비교</small></div>
  <div class="condition-insight"><span>비타민 복용 ↔ 집중도</span><b>${va!=null&&na!=null&&vit.length>=2&&noVit.length>=2?`복용 기록일 평균 ${va.toFixed(1)} / 미복용일 ${na.toFixed(1)}`:'비교 가능한 복용·미복용 기록이 더 필요합니다.'}</b><small>${vit.length}일 복용 · ${noVit.length}일 미복용</small></div>
 </div>
 ${vitRows.length?`<div class="vitamin-analysis"><b>종류별 집중도</b>${vitRows.map(x=>`<div><span>${esc(x.name)}</span><strong>${x.mean.toFixed(1)}</strong><small>${x.n}일</small></div>`).join('')}</div>`:''}
 <div class="muted">기록에서 함께 나타난 경향만 보여줍니다. 수면, 학교 일정, 카페인 등 다른 요인의 영향을 분리한 인과 분석은 아닙니다.</div>`
}
function renderCondition(){
 $('#conditionDate').value=$('#conditionDate').value||selected;const d=$('#conditionDate').value,c=DB.condition[d]||{},session=sleepSession(d);
 $('#bedTime').value=c.bed||session.bed||'';$('#wakeTime').value=c.wake||session.wake||'';$('#sleepTotal').value=calcSleep($('#bedTime').value,$('#wakeTime').value);$('#sleepQuality').value=c.quality||'';$('#fatigue').value=c.fatigue??'';$('#headache').value=c.headache??'';$('#focusScore').value=c.focus??'';$('#expectedCondition').value=c.expected||'';$('#eveningFatigue').value=c.eveningFatigue??'';$('#dailyFocus').value=c.dailyFocus??'';$('#overallCondition').value=c.overall||'';$('#caffeineCups').value=c.caffeine??'';$('#lastCaffeine').value=c.lastCaffeine||'';$('#conditionMemo').value=c.memo||'';$$('.symptomCheck').forEach(x=>x.checked=(c.symptoms||[]).includes(x.value));renderVitaminPicker(vitaminValues(c));renderConditionAnalysis()
}
function saveCondition(){
 const d=$('#conditionDate').value,bed=$('#bedTime').value,wake=$('#wakeTime').value,prev=addDays(d,-1),vitamins=$$('.vitaminCheck:checked').map(x=>x.value);
 DB.condition[d]={...(DB.condition[d]||{}),bed,wake,quality:$('#sleepQuality').value,fatigue:$('#fatigue').value,headache:$('#headache').value,focus:$('#focusScore').value,expected:$('#expectedCondition').value,eveningFatigue:$('#eveningFatigue').value,dailyFocus:$('#dailyFocus').value,overall:$('#overallCondition').value,caffeine:Number($('#caffeineCups').value)||0,lastCaffeine:$('#lastCaffeine').value,vitamins,vitamin:vitamins.length>0,symptoms:$$('.symptomCheck:checked').map(x=>x.value),memo:$('#conditionMemo').value.trim()};
 // D일 수면은 D-1일 밤 취침 + D일 아침 기상. 시간표 마커도 같은 원본을 따른다.
 planMeta(prev).bed=bed;planMeta(d).wake=wake;saveDB();renderCondition();if(d===selected){renderDashboard();if($('#planner').classList.contains('active'))renderPlanner()}else if($('#planner').classList.contains('active')&&(selected===prev||selected===d))renderPlanner()
}

function monthDates(month){
 const[y,m]=month.split('-').map(Number),last=new Date(y,m,0).getDate();return Array.from({length:last},(_,i)=>`${month}-${String(i+1).padStart(2,'0')}`)
}
function statsForDates(dates){
 let mins=0,total=0,done=0,tests=0;const subjectDone={};SUBJECTS.forEach(s=>subjectDone[s]=0);
 dates.forEach(d=>{mins+=finalStudy(d);const a=DB.tasks[d]||[];total+=a.length;done+=a.filter(t=>t.done).length;a.filter(t=>t.done&&subjectDone[t.subject]!=null).forEach(t=>subjectDone[t.subject]++);tests+=DB.tests.filter(t=>t.date===d).length});
 return{mins,total,done,tests,subjectDone}
}
function renderAnalysis(){
 $('#analysisMonth').value=$('#analysisMonth').value||displayMonth;const month=$('#analysisMonth').value,st=statsForDates(monthDates(month));
 $('#analysisStats').innerHTML=`<div><span>순공</span><b>${hoursLabel(st.mins)}</b></div><div><span>달성률</span><b>${st.total?Math.round(st.done/st.total*100):0}%</b></div><div><span>완료 할 일</span><b>${st.done}/${st.total}</b></div><div><span>시험</span><b>${st.tests}회</b></div>`;
 const max=Math.max(1,...Object.values(st.subjectDone));$('#subjectBalance').innerHTML='<h3 class="subhead">과목 완료 분포</h3>'+SUBJECTS.map(s=>`<div class="cause-row"><b>${s}</b><div class="cause-bar"><i style="width:${st.subjectDone[s]/max*100}%"></i></div><span>${st.subjectDone[s]}</span></div>`).join('');
 const end=parseDate(selected),dates=[];for(let i=6;i>=0;i--){const d=new Date(end);d.setDate(d.getDate()-i);dates.push(ymd(d))}const r=statsForDates(dates);
 $('#recent7Stats').innerHTML=`<div><span>순공</span><b>${hoursLabel(r.mins)}</b></div><div><span>달성률</span><b>${r.total?Math.round(r.done/r.total*100):0}%</b></div><div><span>완료</span><b>${r.done}/${r.total}</b></div><div><span>시험</span><b>${r.tests}회</b></div>`;
 renderGapList('#analysisGap',studyGaps(selected))
}
function renderHike(){$('#hikeEnabled').checked=Boolean(DB.settings.hikeEnabled)}

function renderUndoList(){
 const h=undoHistory(),box=$('#undoList');if(!box)return;box.innerHTML=h.length?h.map(x=>`<div class="undo-item"><span>${new Date(x.at).toLocaleString('ko-KR')} 이전 상태</span><button class="btn ghost small undo-btn" data-id="${x.id}">되돌리기</button></div>`).join(''):'<div class="muted">되돌릴 변경이 없습니다.</div>';$$('.undo-btn').forEach(b=>b.onclick=()=>restoreUndo(b.dataset.id))
}
function renderSettings(){
 $('#lectureDailyCap').value=DB.settings.lectureDailyCap||5;
 $('#periodTimeSettings').innerHTML=Array.from({length:7},(_,i)=>{const p=i+1,t=DB.settings.periodTimes[p]||{};return `<div class="period-box"><b>${p}교시</b><input class="input period-start" data-p="${p}" type="time" value="${t.start||''}"><input class="input period-end" data-p="${p}" type="time" value="${t.end||''}"></div>`}).join('');
 renderTrash();renderUndoList();$('#versionInfo').innerHTML=`<code>App ${APP_VERSION}<br>Data schema ${SCHEMA_VERSION}<br>Build ${BUILD}<br>9모 ${EXAM9}<br>수능 ${CSAT}</code>`;$('#diagnosticResult').innerHTML='<div class="muted">검사 실행을 누르면 끊어진 연결·중복 ID·자동화 소스를 확인합니다.</div>'
}
function savePeriodTimes(){
 for(let p=1;p<=7;p++){DB.settings.periodTimes[p]={start:$(`.period-start[data-p="${p}"]`).value,end:$(`.period-end[data-p="${p}"]`).value}}
 saveDB();Object.keys(DB.schedules).forEach(date=>{if([1,2,3,4,5].includes(parseDate(date).getDay()))DB.schedules[date]=mergeSchedule(date,DB.schedules[date])});saveDB();alert('평일 교시 시각을 저장했습니다.');renderSettings();if($('#planner').classList.contains('active'))renderPlanner()
}
function runDiagnostics(){
 const problems=[],ids=new Map();
 function seen(id,label){if(!id)return;if(ids.has(id))problems.push(`중복 ID: ${id} (${ids.get(id)} / ${label})`);else ids.set(id,label)}
 Object.entries(DB.tasks).forEach(([date,arr])=>(arr||[]).forEach(t=>seen(t.id,`할 일 ${date}`)));
 Object.entries(DB.schedules).forEach(([date,arr])=>(arr||[]).forEach(b=>{seen(b.id,`블록 ${date}`);(b.taskIds||[]).forEach(id=>{if(!(DB.tasks[date]||[]).some(t=>t.id===id))problems.push(`끊어진 시간표 연결: ${date} ${b.name} → ${id}`)})}));
 DB.books.forEach(b=>seen(b.id,'문제집'));DB.customLectures.forEach(c=>seen(c.key,'사용자 인강'));DB.automations.forEach(a=>{seen(a.id,'자동화');if(!automationOptions().some(o=>o.value===a.source))problems.push(`삭제된 학습 항목을 참조하는 자동화: ${a.id}`)});DB.tests.forEach(t=>seen(t.id,'시험'));
 if(DB.schema!==SCHEMA_VERSION)problems.push(`데이터 스키마 불일치: ${DB.schema}`);
 $('#diagnosticResult').innerHTML=problems.length?`<b>${problems.length}개 확인 필요</b><br>${problems.map(esc).join('<br>')}`:`<b>정상</b><br>끊어진 연결 0 · 중복 ID 0 · 자동화 소스 오류 0`
}
function renderTrash(){
 cleanupTrash();const box=$('#trashList');box.innerHTML=DB.trash.length?DB.trash.map(x=>`<div class="trash-item"><div class="trash-top"><div><b>${trashTitle(x)}</b><div class="task-meta">${new Date(x.deletedAt).toLocaleString('ko-KR')}</div></div><button class="btn ghost small trash-restore" data-id="${x.id}">복원</button></div></div>`).join(''):'<div class="muted">휴지통이 비어 있습니다.</div>';$$('.trash-restore').forEach(b=>b.onclick=()=>restoreTrash(b.dataset.id))
}
function trashTitle(x){
 if(x.type==='task')return`할 일 · ${x.data.subject} ${x.data.name}`;if(x.type==='block')return`시간 블록 · ${x.data.name}`;if(x.type==='lectureCourse')return`인강 · ${x.data.display}`;if(x.type==='book')return`문제집 · ${x.data.name}`;if(x.type==='automation')return'자동화 규칙';if(x.type==='test')return`시험 · ${x.data.name||''}`;if(x.type==='waiting')return`대기함 · ${x.data.name}`;return x.type
}
function restoreTrash(id){
 const i=DB.trash.findIndex(x=>x.id===id);if(i<0)return;const x=DB.trash[i];
 if(x.type==='task'){const date=x.context.date||selected;const t=deep(x.data);if(tasksFor(date).some(a=>a.id===t.id))t.id=uid();tasksFor(date).push(t)}
 if(x.type==='block'){const date=x.context.date||selected;const b=deep(x.data);if(ensureSchedule(date).some(a=>a.id===b.id))b.id=uid();DB.schedules[date].push(b);DB.schedules[date]=sortBlocks(DB.schedules[date])}
 if(x.type==='lectureCourse'){const c=deep(x.data);if(DB.customLectures.some(a=>a.key===c.key))c.key='custom-'+uid();DB.customLectures.push(c)}
 if(x.type==='book'){const b=deep(x.data);if(DB.books.some(a=>a.id===b.id))b.id=uid();DB.books.push(b)}
 if(x.type==='automation'){const a=deep(x.data);if(DB.automations.some(q=>q.id===a.id))a.id=uid();DB.automations.push(a)}
 if(x.type==='test'){const t=deep(x.data);if(DB.tests.some(q=>q.id===t.id))t.id=uid();DB.tests.push(t)}
 if(x.type==='waiting'){const t=deep(x.data);if(DB.waiting.some(q=>q.id===t.id))t.id=uid();DB.waiting.push(t)}
 DB.trash.splice(i,1);saveDB();renderSettings()
}
function exportData(){
 const blob=new Blob([JSON.stringify(DB,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`PROJECT_11122_backup_${ymd()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
function importData(file){
 const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d||typeof d!=='object')throw new Error();if(!confirm('현재 기록을 가져온 백업으로 교체할까요?'))return;DB={...defaultDB(),...d,settings:{...defaultDB().settings,...(d.settings||{})},schema:SCHEMA_VERSION};cleanupTrash();saveDB();selected=ymd();displayMonth=selected.slice(0,7);alert('복원했습니다.');navigate('dashboard')}catch{alert('올바른 PROJECT 11122 백업 파일이 아닙니다.')}};r.readAsText(file)
}

function openNowMode(){
 const date=ymd();selected=date;const cb=currentBlock(date),nb=nextBlock(date),b=cb||nb,tasks=b?(b.taskIds||[]).map(id=>taskById(date,id)).filter(Boolean):tasksFor(date).filter(t=>!t.done).slice(0,1);
 const n=new Date();$('#nowClock').textContent=`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;$('#nowBlockTitle').textContent=cb?`${cb.name} · 지금`:nb?`${nb.name} · 다음 블록`:'지금 할 것';
 $('#nowTasks').innerHTML=tasks.length?tasks.map(t=>`<div class="task" style="text-align:left"><b>${esc(t.subject)} · ${esc(t.name)}</b><div class="task-meta">${esc(t.material||'')}</div><div class="row" style="margin-top:8px"><button class="btn primary small now-complete" data-id="${t.id}">${t.done?'완료 해제':'완료'}</button></div></div>`).join(''):'<div class="muted">현재 연결된 할 일이 없습니다.</div>';$$('.now-complete').forEach(x=>x.onclick=()=>{const t=taskById(date,x.dataset.id);setTaskDoneInternal(date,t.id,!t.done);openNowMode();renderDashboard()});showModal('nowModal')
}
function togglePlanLock(){
 const locking=!DB.planLocks[selected];
 if(locking){const known=tasksFor(selected).filter(t=>!t.done).reduce((s,t)=>s+(Number(t.minutes)||0),0),p=plannedStudy(selected).minutes;if(p&&known>p&&!confirm(`할 일 예상 ${minuteLabel(known)}, 시간표 자습 ${minuteLabel(p)}로 ${minuteLabel(known-p)} 초과입니다. 그래도 오늘 계획을 확정할까요?`))return}
 DB.planLocks[selected]=locking;saveDB();renderDashboard()
}

function openCloseDay(){
 $('#closeDateBadge').textContent=fmtDate(selected);const p=plannedStudy(selected).minutes,a=autoActualStudy(selected),f=finalStudy(selected);$('#closeStudySummary').innerHTML=`<div><span>계획 자습</span><b>${minuteLabel(p)}</b></div><div><span>자동 실제</span><b>${minuteLabel(a)}</b></div><div><span>현재 최종</span><b>${minuteLabel(f)}</b></div>`;$('#closeStudyOverride').value=(f/60).toFixed(1);
 const unfinished=tasksFor(selected).filter(t=>!t.done);$('#closeUnfinished').innerHTML=unfinished.length?`<h3 class="subhead">미완료 ${unfinished.length}개</h3>`+unfinished.map(t=>`<div class="close-choice"><div><b>${esc(t.subject)} · ${esc(t.name)}</b><div class="task-meta">${esc(t.material||'')}</div></div><select class="input close-action" data-id="${t.id}"><option value="tomorrow">내일</option><option value="waiting">대기함</option><option value="skip">건너뛰기</option></select></div>`).join(''):'<div class="muted">미완료 할 일이 없습니다.</div>';showModal('closeDayModal')
}
function nextDate(date){const d=parseDate(date);d.setDate(d.getDate()+1);return ymd(d)}
function confirmCloseDay(){
 const v=Number($('#closeStudyOverride').value);if(Number.isFinite(v)&&v>=0)DB.studyOverrides[selected]=Math.round(v*60);
 const actions=$$('.close-action').map(x=>({id:x.dataset.id,act:x.value})),tom=nextDate(selected);
 actions.forEach(x=>{const t=taskById(selected,x.id);if(!t)return;if(x.act==='tomorrow'){removeTask(selected,t.id,false);t.id=uid();t.done=false;(t.components||[]).forEach(c=>c.done=false);tasksFor(tom).push(t)}else if(x.act==='waiting'){moveTaskToWaiting(selected,t.id)}else if(x.act==='skip')removeTask(selected,t.id,true)});
 DB.closeHistory.unshift({date:selected,at:Date.now(),study:finalStudy(selected)});DB.closeHistory=DB.closeHistory.slice(0,50);saveDB();hideModal('closeDayModal');renderDashboard();alert('오늘 마감을 저장했습니다.')
}
function todayRecordText(date=selected){
 const p=plannedStudy(date).minutes,a=autoActualStudy(date),f=finalStudy(date),list=tasksFor(date),done=list.filter(t=>t.done).length,c=DB.condition[date]||{},stage=activeStage(date);
 return `[PROJECT 11122 일일 기록]\n날짜: ${date}\n단계: ${stage.title}\n목표: ${stage.key==='nine'?'11122':'11111'}\n순공: 계획 ${minuteLabel(p)} / 자동 ${minuteLabel(a)} / 최종 ${minuteLabel(f)}\n완료: ${done}/${list.length}\n미완료: ${list.filter(t=>!t.done).map(t=>`${t.subject} ${t.name}`).join(' / ')||'없음'}\n수면: ${calcSleep(c.bed,c.wake)||'미입력'}\n컨디션: ${c.overall||'미입력'}`
}
async function copyText(text){try{await navigator.clipboard.writeText(text);alert('복사했습니다.')}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();alert('복사했습니다.')}}
function renderVersionStatus(){$('#runtimeStatus').textContent=`${APP_VERSION} · SW ${APP_VERSION}`}

function bindEvents(){
 $$('#mainNav button').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
 $$('[data-go]').forEach(b=>b.onclick=()=>navigate(b.dataset.go));
 $('#settingsGear').onclick=()=>navigate('settings');$('#nowModeBtn').onclick=openNowMode;$('#closeDayBtn').onclick=openCloseDay;
 $('#addTaskBtn').onclick=()=>openTaskModal();$('#saveTask').onclick=saveTaskModal;
 $('#openWaitingBtn').onclick=()=>{renderWaiting();showModal('waitingModal')};$('#addWaitingManual').onclick=()=>{const name=prompt('대기함에 넣을 할 일을 입력하세요.');if(!name)return;const subject=prompt('과목을 입력하세요. 예: 수학')||'기타';DB.waiting.push(normalizeImportedTask({id:uid(),subject,priority:'should',name,material:'',minutes:0,note:'',done:false,waitingSince:selected}));saveDB();renderWaiting()};
 $('#saveStudyOverride').onclick=()=>{const v=Number($('#studyOverrideHours').value);if(!Number.isFinite(v)||v<0){alert('시간을 확인하세요.');return}DB.studyOverrides[selected]=Math.round(v*60);saveDB();renderDashboard()};
 $('#resetStudyOverride').onclick=()=>{delete DB.studyOverrides[selected];saveDB();renderDashboard()};$('#togglePlanLock').onclick=togglePlanLock;
 $('#prevMonth').onclick=()=>{const [y,m]=displayMonth.split('-').map(Number),d=new Date(y,m-2,1);displayMonth=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;renderMonth()};
 $('#nextMonth').onclick=()=>{const [y,m]=displayMonth.split('-').map(Number),d=new Date(y,m,1);displayMonth=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;renderMonth()};
 $('#monthPicker').onchange=()=>{displayMonth=$('#monthPicker').value;renderMonth()};$('#taskSortMode').onchange=()=>{DB.settings.taskSortMode=$('#taskSortMode').value;saveDB();renderTaskList()};
 $('#plannerDate').onchange=()=>{selected=$('#plannerDate').value;renderPlanner();$('#topDate').textContent=fmtDate(selected)};
 $('#plannerModeBtn').onclick=()=>{plannerSleepMode=false;plannerEdit=!plannerEdit;clearPlannerSelection();renderPlanner()};$('#sleepModeBtn').onclick=()=>{plannerSleepMode=!plannerSleepMode;clearPlannerSelection();renderPlanner()};$('#addGridBlockBtn').onclick=()=>{if(!plannerEdit)return;plannerSleepMode=false;$('#plannerModeHint').textContent='빈 칸에서 시작 칸을 누르고 마지막 칸을 누르거나 드래그하세요.'};$('#addDirectBlockBtn').onclick=()=>openBlockModal(selected);
 $('#saveBlock').onclick=saveBlockModal;$('#deleteBlock').onclick=deleteBlockModal;$('#chooseBlockTasks').onclick=()=>{const id=$('#blockId').value;if(!id){alert('블록을 먼저 저장하세요.');return}hideModal('blockModal');openAssignModal($('#blockDate').value,id)};$('#sleepBed').onchange=()=>$('#sleepSummaryText').textContent=`다음 날 수면 ${sleepSpanLabel($('#sleepBed').value,$('#sleepWake').value)}`;$('#sleepWake').onchange=()=>$('#sleepSummaryText').textContent=`다음 날 수면 ${sleepSpanLabel($('#sleepBed').value,$('#sleepWake').value)}`;$('#saveSleepPlan').onclick=saveSleepModal;$('#clearSleepPlan').onclick=clearSleepModal;
 $('#assignSearch').oninput=renderAssignList;$('#saveAssignments').onclick=saveAssignments;$('#clearAssignments').onclick=()=>{$$('.assign-check').forEach(x=>x.checked=false);updateAssignCount()};
 $$('.learning-tab').forEach(b=>b.onclick=()=>{vendingTab=b.dataset.vtab;renderVending()});$('#learningSearch').oninput=applyVendingSearch;$('#incompleteOnly').onchange=renderLectureCatalog;$('#addLectureBtn').onclick=openLectureModal;$('#saveLecture').onclick=saveLectureModal;$('#addBookBtn').onclick=()=>openBookModal();$('#saveBook').onclick=saveBookModal;$('#addProblemsToCart').onclick=addProblemsCart;$('#cartDate').onchange=renderCart;$('#buildCartPlan').onclick=buildCartPlan;$('#clearCart').onclick=()=>{cart=[];renderVending()};
 $('#addAutomationBtn').onclick=()=>openAutomationModal();$('#saveAutomation').onclick=saveAutomationModal;
 $('#addTestBtn').onclick=openTestModal;$('#testKind').onchange=toggleTestKind;$('#saveTest').onclick=saveTestModal;
 $('#conditionDate').onchange=renderCondition;$('#bedTime').onchange=()=>$('#sleepTotal').value=calcSleep($('#bedTime').value,$('#wakeTime').value);$('#wakeTime').onchange=()=>$('#sleepTotal').value=calcSleep($('#bedTime').value,$('#wakeTime').value);$('#saveCondition').onclick=saveCondition;$('#addVitaminBtn').onclick=addVitaminOption;$('#vitaminName').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addVitaminOption()}};$('#analysisMonth').onchange=renderAnalysis;$('#hikeEnabled').onchange=()=>{DB.settings.hikeEnabled=$('#hikeEnabled').checked;saveDB()};
 $('#saveSettings').onclick=()=>{DB.settings.lectureDailyCap=Number($('#lectureDailyCap').value)||5;saveDB();alert('저장했습니다.')};$('#savePeriodTimes').onclick=savePeriodTimes;$('#clearPeriodTimes').onclick=()=>{$$('.period-start,.period-end').forEach(x=>x.value='')};$('#runDiagnostics').onclick=runDiagnostics;$('#exportData').onclick=exportData;$('#importData').onchange=e=>{if(e.target.files[0])importData(e.target.files[0])};
 $('#confirmCloseDay').onclick=confirmCloseDay;$('#copyTodayRecord').onclick=()=>copyText(todayRecordText());
 $$('.modal-close').forEach(b=>b.onclick=()=>b.closest('.modal-back').classList.remove('show'));$$('.modal-back').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')}));
}
function init(){
 cleanupTrash();saveDB();selected=ymd();displayMonth=selected.slice(0,7);$('#cartDate').value=selected;$('#plannerDate').value=selected;$('#conditionDate').value=selected;$('#analysisMonth').value=displayMonth;bindEvents();runAutomationForDate(selected);renderVersionStatus();renderDashboard();
 if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw-v67.js?v=670').catch(()=>{});
}
document.addEventListener('DOMContentLoaded',init);
