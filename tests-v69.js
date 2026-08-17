const fs=require('fs'),vm=require('vm'),assert=require('assert');
const store=new Map();
const dummy=()=>({value:'',checked:false,textContent:'',innerHTML:'',classList:{add(){},remove(){},toggle(){}},style:{},addEventListener(){},closest(){return this}});
const ctx={console,crypto:require('crypto').webcrypto,structuredClone:global.structuredClone,Blob:global.Blob,URL:global.URL,
 localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k),key:i=>[...store.keys()][i]??null,get length(){return store.size}},
 document:{querySelector:()=>dummy(),querySelectorAll:()=>[],addEventListener(){},createElement:()=>dummy()},navigator:{},location:{reload(){}},alert(){},confirm(){return true},prompt(){return null},setTimeout,clearTimeout,FileReader:function(){}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/app-v69.js','utf8'),ctx);
function exec(code){return vm.runInContext('(()=>{'+code+'})()',ctx)}
function val(code){return vm.runInContext(code,ctx)}
function plain(x){return JSON.parse(JSON.stringify(x))}
function reset(){exec(`DB=defaultDB();DB.schema=SCHEMA_VERSION;LAST_SAVED_JSON=JSON.stringify(DB);`);store.clear()}
function test(name,fn){try{reset();fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,e);process.exitCode=1}}

test('future date does not execute automation',()=>{
 exec(`const d=addDays(todayDate(),1),wd=parseDate(d).getDay();DB.automations=[{id:'r1',source:'lecture:eco-core',weekdays:[wd],start:d,end:d,priority:'must',enabled:true}];runAutomationForDate(d);globalThis.out={tasks:(DB.tasks[d]||[]).length,conf:DB.automationConflicts.length,runs:Object.keys(DB.automationRuns).length}`);
 assert.deepStrictEqual(plain(val('out')),{tasks:0,conf:0,runs:0});
});
test('automation is idempotent',()=>{
 exec(`const d=todayDate(),wd=parseDate(d).getDay();DB.automations=[{id:'r1',source:'lecture:eco-core',weekdays:[wd],start:d,end:d,priority:'must',enabled:true}];runAutomationForDate(d);runAutomationForDate(d);globalThis.out=(DB.tasks[d]||[]).filter(t=>t.automationRuleId==='r1').length`);assert.equal(plain(val('out')),1);
});
test('automation run key recorded',()=>{
 exec(`const d=todayDate(),wd=parseDate(d).getDay();DB.automations=[{id:'r1',source:'lecture:eco-core',weekdays:[wd],start:d,end:d,priority:'must',enabled:true}];runAutomationForDate(d);globalThis.out=DB.automationRuns[automationRunKey('r1',d)]?.status`);assert.equal(plain(val('out')),'task');
});
test('waiting lecture avoids duplicate generation',()=>{
 exec(`const d=todayDate();DB.waiting=[normalizeImportedTask({id:'w',subject:'경제',name:'CORE 1강',components:[{id:'c',kind:'lecture',ref:lectureRef('eco-core',1),label:'01강',done:false}]})];const r={id:'r',source:'lecture:eco-core',priority:'must'};globalThis.out=makeAutomationProposal(r,d).components[0].ref`);assert.equal(plain(val('out')),'eco-core::2');
});
test('real-day unfinished creates conflict',()=>{
 exec(`const d=todayDate(),prev=addDays(d,-2),wd=parseDate(d).getDay();DB.tasks[prev]=[normalizeImportedTask({id:'old',subject:'경제',name:'CORE 1강',automationRuleId:'r1',components:[{id:'x',kind:'lecture',ref:'eco-core::1',label:'01강',done:false}]})];DB.automations=[{id:'r1',source:'lecture:eco-core',weekdays:[wd],start:prev,end:d,priority:'must',enabled:true}];runAutomationForDate(d);globalThis.out=DB.automationConflicts.length`);assert.equal(plain(val('out')),1);
});
test('true merge keeps previous and today components',()=>{
 exec(`const a=normalizeImportedTask({subject:'경제',name:'CORE 3강',minutes:30,components:[{id:'a',kind:'lecture',ref:'eco-core::3',label:'03강',done:false}]});const b=normalizeImportedTask({subject:'경제',name:'CORE 4강',minutes:30,automationRuleId:'r',autoKey:'k',components:[{id:'b',kind:'lecture',ref:'eco-core::4',label:'04강',done:false}]});const m=mergedAutomationTask(a,b);globalThis.out={n:m.components.length,name:m.name,min:m.minutes}`);assert.deepStrictEqual(plain(val('out')),{n:2,name:'CORE 3~4강',min:60});
});
test('timetable completion does not complete task',()=>{
 exec(`const d=todayDate();DB.tasks[d]=[normalizeImportedTask({id:'t1',subject:'수학',name:'문제',components:[{id:'c',kind:'manual',label:'문제',done:false}]})];DB.schedules[d]=[{id:'b1',name:'자습',type:'self',selfStudy:true,device:true,start:'18:00',end:'19:00',taskIds:['t1'],done:false}];setBlockDone(d,'b1',true);globalThis.out={b:DB.schedules[d].find(x=>x.id==='b1')?.done,t:DB.tasks[d][0].done}`);assert.deepStrictEqual(plain(val('out')),{b:true,t:false});
});
test('task completion does not complete timetable',()=>{
 exec(`const d=todayDate();DB.tasks[d]=[normalizeImportedTask({id:'t1',subject:'수학',name:'문제',components:[{id:'c',kind:'manual',label:'문제',done:false}]})];DB.schedules[d]=[{id:'b1',name:'자습',type:'self',selfStudy:true,device:true,start:'18:00',end:'19:00',taskIds:['t1'],done:false}];setTaskDoneInternal(d,'t1',true);globalThis.out={b:DB.schedules[d].find(x=>x.id==='b1')?.done,t:DB.tasks[d][0].done}`);assert.deepStrictEqual(plain(val('out')),{b:false,t:true});
});
test('sleep 23:30 to 06:40 = 430 minutes',()=>assert.equal(val(`sleepMinutes('23:30','06:40')`),430));
test('sleep session maps D-1 bed and D wake',()=>{
 exec(`const d='2026-08-11';planMeta('2026-08-10').bed='23:30';planMeta(d).wake='06:40';globalThis.out=sleepSession(d)`);assert.deepStrictEqual(plain(val('out')),{bed:'23:30',wake:'06:40'});
});
test('1~3 lectures count as 3 units',()=>{
 exec(`const t=normalizeImportedTask({subject:'국어',name:'1~3강',components:[1,2,3].map(n=>({id:String(n),kind:'lecture',ref:'kor-origin::'+n,label:n+'강',done:n<3}))});globalThis.out=todayUnitState([t])`);assert.deepStrictEqual(plain(val('out')),{total:3,done:2});
});
test('Friday English mock replaces period 5 only',()=>{
 exec(`DB.settings.periodTimes[4]={start:'11:40',end:'12:30'};DB.settings.periodTimes[5]={start:'13:30',end:'14:20'};const b=baseSchedule('2026-08-14');globalThis.out={mock:b.find(x=>x.id.endsWith('english-mock'))?.end,p4:!!b.find(x=>x.period===4),p5:!!b.find(x=>x.period===5)}`);assert.deepStrictEqual(plain(val('out')),{mock:'14:20',p4:true,p5:false});
});
test('overlap detection',()=>assert.equal(val(`blocksOverlap({start:'18:00',end:'19:00'},{start:'18:30',end:'19:30'})`),true));
test('schema 8 migrates to 9 and infers automation run',()=>{
 exec(`const d=todayDate(),old={...defaultDB(),schema:8};old.tasks[d]=[normalizeImportedTask({id:'a',subject:'경제',name:'CORE',automationRuleId:'r',components:[{id:'c',kind:'manual',label:'x',done:false}]})];const m=migrateDB(old);globalThis.out={schema:m.schema,run:m.automationRuns[automationRunKey('r',d)]?.status}`);assert.deepStrictEqual(plain(val('out')),{schema:9,run:'task'});
});
test('year boundary',()=>assert.equal(val(`addDays('2026-12-31',1)`),'2027-01-01'));
test('midnight duration',()=>assert.equal(val(`durationMin('23:50','00:20')`),30));
test('backup validation',()=>{assert.equal(val(`validateBackupObject(defaultDB())`),true);assert.equal(val(`validateBackupObject({foo:1})`),false)});


test('fixed block can be hidden on one date only',()=>{
 exec(`const d='2026-08-17',other='2026-08-18',b=ensureSchedule(d).find(x=>x.baseKey==='night2');DB.scheduleHidden[d]=[b.baseKey];DB.schedules[d]=ensureSchedule(d).filter(x=>x.id!==b.id);globalThis.out={d:!!ensureSchedule(d).find(x=>x.baseKey==='night2'),other:!!ensureSchedule(other).find(x=>x.baseKey==='night2')}`);assert.deepStrictEqual(plain(val('out')),{d:false,other:true});
});
test('restoring hidden fixed block restores only structure',()=>{
 exec(`const d='2026-08-17',b=ensureSchedule(d).find(x=>x.baseKey==='night2');DB.scheduleHidden[d]=[b.baseKey];DB.schedules[d]=ensureSchedule(d).filter(x=>x.id!==b.id);restoreDeletedFixedBlocks(d);globalThis.out=!!ensureSchedule(d).find(x=>x.baseKey==='night2')`);assert.equal(plain(val('out')),true);
});
test('Saturday bell mode has six blocks',()=>{
 exec(`const d='2026-08-17';DB.scheduleModes[d]={mode:'saturday',templateId:null};DB.schedules[d]=[];globalThis.out=ensureSchedule(d).map(x=>x.baseKey)`);assert.deepStrictEqual(plain(val('out')),['sat1','sat2','sat3','sat4','sat5','sat6']);
});
test('school off mode has no base blocks',()=>{
 exec(`const d='2026-08-17';DB.scheduleModes[d]={mode:'off',templateId:null};DB.schedules[d]=[];globalThis.out=ensureSchedule(d).length`);assert.equal(plain(val('out')),0);
});
test('saved timetable template applies to one date',()=>{
 exec(`const d='2026-08-17',other='2026-08-18',t=createScheduleTemplate('야자 없음',[{name:'아침 자습',type:'self',selfStudy:true,device:false,start:'07:50',end:'08:30',locked:false}]);DB.scheduleModes[d]={mode:'template',templateId:t.id};DB.schedules[d]=[];globalThis.out={d:ensureSchedule(d).map(x=>x.name),other:ensureSchedule(other).length}`);const o=plain(val('out'));assert.deepStrictEqual(o.d,['아침 자습']);assert.ok(o.other>1);
});
test('changing schedule mode keeps tasks but clears timetable assignment',()=>{
 exec(`const d='2026-08-17';DB.tasks[d]=[normalizeImportedTask({id:'t1',subject:'경제',name:'CORE',components:[{id:'c',kind:'manual',label:'x',done:false}]})];let b=ensureSchedule(d).find(x=>x.baseKey==='night1');b.taskIds=['t1'];DB.schedules[d]=ensureSchedule(d);setDayScheduleMode(d,'off',null,{confirmChange:false});globalThis.out={tasks:DB.tasks[d].length,blocks:ensureSchedule(d).length}`);assert.deepStrictEqual(plain(val('out')),{tasks:1,blocks:0});
});
test('template snapshot strips task state',()=>{
 exec(`const d='2026-08-17';let b=ensureSchedule(d).find(x=>x.baseKey==='night1');b.taskIds=['t1'];b.done=true;b.actualMin=40;const x=scheduleTemplateBlocksFromDate(d).find(x=>x.name==='야간자율학습 1');globalThis.out={keys:Object.keys(x).sort(),hasTask:'taskIds' in x,hasDone:'done' in x}`);const o=plain(val('out'));assert.equal(o.hasTask,false);assert.equal(o.hasDone,false);
});


test('hiding fixed block keeps task and removes assignment with block',()=>{
 exec(`const d='2026-08-17';DB.tasks[d]=[normalizeImportedTask({id:'t1',subject:'수학',name:'문제',components:[{id:'c',kind:'manual',label:'문제',done:false}]})];let b=ensureSchedule(d).find(x=>x.baseKey==='night1');b.taskIds=['t1'];DB.scheduleHidden[d]=['night1'];DB.schedules[d]=ensureSchedule(d).filter(x=>x.baseKey!=='night1');globalThis.out={task:DB.tasks[d].length,links:ensureSchedule(d).flatMap(x=>x.taskIds||[]).filter(x=>x==='t1').length}`);assert.deepStrictEqual(plain(val('out')),{task:1,links:0});
});
test('deleting used template returns its dates to default',()=>{
 exec(`const d='2026-08-17',t=createScheduleTemplate('T',[{name:'X',type:'self',selfStudy:true,device:false,start:'08:00',end:'09:00'}]);DB.scheduleModes[d]={mode:'template',templateId:t.id};DB.schedules[d]=[];deleteScheduleTemplate(t.id);globalThis.out={mode:scheduleModeFor(d).mode,hasX:ensureSchedule(d).some(x=>x.name==='X'),count:ensureSchedule(d).length}`);const o=plain(val('out'));assert.equal(o.mode,'default');assert.equal(o.hasX,false);assert.ok(o.count>1);
});

if(!process.exitCode)console.log('ALL CORE TESTS PASSED');
