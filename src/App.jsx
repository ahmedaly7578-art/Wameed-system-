import { useState, useEffect, useRef } from "react";

const C={bg:"#070E1F",bgCard:"#0D1526",bgHover:"#111E35",bgModal:"#0A1220",border:"rgba(255,255,255,0.07)",borderH:"rgba(255,255,255,0.14)",text:"#F1F5FF",textS:"rgba(255,255,255,0.5)",textM:"rgba(255,255,255,0.25)",pink:"#E879A0",purple:"#7B6FE0",green:"#34D399",blue:"#60A5FA",orange:"#F59E0B",red:"#F87171",teal:"#2DD4BF",grad:"linear-gradient(135deg,#E879A0 0%,#7B6FE0 100%)"};
const RC={admin:C.pink,media_buyer:C.purple,social_media:C.green,account_manager:C.blue,designer:C.teal};
const RL={admin:"مدير النظام",media_buyer:"Media Buyer",social_media:"Social Media",account_manager:"Account Manager",designer:"Designer"};
const SL={active:"نشط",hold:"موقوف",cancelled:"ملغي"};
const SC={active:C.green,hold:C.orange,cancelled:C.red};
const PLATS=["Meta","Snapchat","TikTok","Google","YouTube","X"];
const PC={Meta:"#1877F2",TikTok:"#EE1D52",Snapchat:"#B8A000",Google:"#4285F4",YouTube:"#FF0000",X:"#1DA1F2"};

const IU=[
  {id:1,name:"أحمد علي",role:"admin",email:"ahmed@wameed.sa",password:"admin123",avatar:"أع"},
  {id:2,name:"كريم محمد",role:"media_buyer",email:"karim@wameed.sa",password:"pass123",avatar:"كم"},
  {id:3,name:"سارة أحمد",role:"social_media",email:"sara@wameed.sa",password:"pass123",avatar:"سأ"},
  {id:4,name:"محمود رضا",role:"account_manager",email:"mahmoud@wameed.sa",password:"pass123",avatar:"مر"},
  {id:5,name:"هدى سعد",role:"media_buyer",email:"hoda@wameed.sa",password:"pass123",avatar:"هس"},
  {id:6,name:"هادي يحيى",role:"media_buyer",email:"hady@wameed.sa",password:"pass123",avatar:"هي"},
];
const IC=[
  {id:1,name:"متجر النور",mb:2,sm:3,am:4,pkg:3000,platforms:["Meta","Snapchat"],status:"active",start:"2025-01-15",end:"2025-05-30",roas:3.8,spend:12000,notes:"عميل وفي، يطلب تقارير أسبوعية دائماً",email:"nour@client.sa",password:"client123"},
  {id:2,name:"بيوتي لاب",mb:5,sm:3,am:4,pkg:5000,platforms:["Meta","TikTok","Snapchat"],status:"active",start:"2025-02-01",end:"2025-06-01",roas:4.2,spend:18000,notes:"",email:"beauty@client.sa",password:"client123"},
  {id:3,name:"تك ستور",mb:2,sm:3,am:4,pkg:2000,platforms:["Meta"],status:"hold",start:"2025-01-10",end:"2025-05-25",roas:2.1,spend:6000,notes:"أوقف مؤقتاً بسبب إجازة صاحبه",email:"tech@client.sa",password:"client123"},
  {id:4,name:"كافيه روز",mb:6,sm:3,am:4,pkg:4000,platforms:["Meta","Google"],status:"active",start:"2025-03-01",end:"2025-06-01",roas:5.1,spend:14000,notes:"",email:"cafe@client.sa",password:"client123"},
  {id:5,name:"دريم فاشون",mb:5,sm:3,am:4,pkg:3500,platforms:["TikTok","Snapchat"],status:"active",start:"2025-02-15",end:"2025-05-28",roas:3.3,spend:10500,notes:"",email:"dream@client.sa",password:"client123"},
  {id:6,name:"جولدن شوب",mb:2,sm:3,am:4,pkg:6000,platforms:["Meta","TikTok","Google"],status:"active",start:"2025-03-10",end:"2025-06-10",roas:4.7,spend:22000,notes:"",email:"golden@client.sa",password:"client123"},
  {id:7,name:"فريش ماركت",mb:5,sm:3,am:4,pkg:2500,platforms:["Snapchat","Meta"],status:"active",start:"2025-04-01",end:"2025-06-01",roas:3.0,spend:8000,notes:"",email:"fresh@client.sa",password:"client123"},
  {id:8,name:"سوبر كلين",mb:6,sm:3,am:null,pkg:1500,platforms:["Meta"],status:"cancelled",start:"2025-01-01",end:"2025-04-01",roas:1.8,spend:4500,notes:"",cancelReason:"سعر",cancelDate:"2025-04-01",email:"clean@client.sa",password:"client123"},
  {id:9,name:"ميجا ستور",mb:2,sm:null,am:4,pkg:3000,platforms:["Meta","Snapchat"],status:"cancelled",start:"2024-11-01",end:"2025-02-01",roas:2.4,spend:9000,notes:"",cancelReason:"عدم رضا",cancelDate:"2025-02-01",email:"mega@client.sa",password:"client123"},
];
const ICAM=[
  {id:1,clientId:1,platform:"Meta",week:"2025-05-06",spend:4531,clicks:3175,reach:137497,impressions:348529,purchases:63,purchaseValue:55000,roas:3.04,cpc:1.43,cpm:13,ctr:0.91,checkout:163,addToCart:79},
  {id:2,clientId:1,platform:"Snapchat",week:"2025-05-06",spend:5550,clicks:1640,reach:221013,impressions:17133,purchases:75,purchaseValue:62000,roas:3.2,cpc:3.4,cpm:14.16,ctr:0.42,checkout:331,addToCart:138},
  {id:3,clientId:2,platform:"Meta",week:"2025-05-06",spend:6200,clicks:4800,reach:180000,impressions:420000,purchases:98,purchaseValue:88000,roas:4.1,cpc:1.29,cpm:14.7,ctr:1.14,checkout:210,addToCart:154},
  {id:4,clientId:2,platform:"TikTok",week:"2025-05-06",spend:4800,clicks:7200,reach:320000,impressions:890000,purchases:72,purchaseValue:62000,roas:3.9,cpc:0.67,cpm:5.4,ctr:0.81,checkout:188,addToCart:220},
  {id:5,clientId:4,platform:"Google",week:"2025-05-06",spend:3800,clicks:2900,reach:0,impressions:95000,purchases:110,purchaseValue:95000,roas:5.6,cpc:1.31,cpm:40,ctr:3.05,checkout:145,addToCart:0},
  {id:6,clientId:6,platform:"Meta",week:"2025-05-06",spend:7200,clicks:5100,reach:210000,impressions:580000,purchases:142,purchaseValue:128000,roas:4.7,cpc:1.41,cpm:12.4,ctr:0.88,checkout:280,addToCart:310},
];
const IFU=[
  {id:1,clientId:1,userId:2,date:"2025-05-13",text:"تم مراجعة الحملات — الأداء ممتاز على Meta، تم رفع الميزانية 20%",images:[],createdAt:"2025-05-13T09:30:00"},
  {id:2,clientId:1,userId:2,date:"2025-05-12",text:"التواصل مع العميل — طلب تقرير أسبوعي، سيتم إرساله غداً",images:[],createdAt:"2025-05-12T10:15:00"},
  {id:3,clientId:2,userId:5,date:"2025-05-13",text:"TikTok أداء رائع اليوم، ROAS وصل 5.2",images:[],createdAt:"2025-05-13T11:00:00"},
  {id:4,clientId:4,userId:6,date:"2025-05-11",text:"Google Ads تحتاج تعديل في الـ keywords، تم التعديل",images:[],createdAt:"2025-05-11T09:00:00"},
];
const ITasks=[
  {id:1,title:"رفع تقرير أسبوعي — متجر النور",assignedTo:2,clientId:1,due:"2025-05-15",priority:"high",status:"pending",notes:""},
  {id:2,title:"مراجعة creative — بيوتي لاب",assignedTo:5,clientId:2,due:"2025-05-14",priority:"medium",status:"done",notes:""},
  {id:3,title:"إعداد حملة TikTok — دريم فاشون",assignedTo:5,clientId:5,due:"2025-05-16",priority:"high",status:"pending",notes:""},
  {id:4,title:"اجتماع شهري — كافيه روز",assignedTo:4,clientId:4,due:"2025-05-13",priority:"low",status:"late",notes:""},
  {id:5,title:"تحليل Google Ads — جولدن شوب",assignedTo:2,clientId:6,due:"2025-05-17",priority:"medium",status:"pending",notes:""},
];
const INF=[
  {id:1,type:"followup",title:"فولو أب جديد",body:"كريم محمد أضاف فولو أب لمتجر النور",time:"منذ 5 دقائق",read:false,userId:4},
  {id:2,type:"renewal",title:"تجديد قريب",body:"بيوتي لاب — ينتهي خلال 12 يوم",time:"منذ ساعة",read:false,userId:1},
  {id:3,type:"late",title:"⚠️ تأخر في الفولو أب",body:"جولدن شوب — لم يُضَف فولو أب منذ يومين",time:"منذ 3 ساعات",read:false,userId:1},
];
// Targets initial
const ITARGETS=[
  {id:1,userId:2,month:"2025-05",targetClients:5,targetRoas:3.5,targetUpsell:1,targetRenewal:90},
  {id:2,userId:5,month:"2025-05",targetClients:4,targetRoas:4.0,targetUpsell:1,targetRenewal:85},
  {id:3,userId:6,month:"2025-05",targetClients:3,targetRoas:4.5,targetUpsell:0,targetRenewal:100},
];
// Satisfaction
const ISAT=[
  {id:1,clientId:1,month:"2025-04",score:5,comment:"خدمة ممتازة"},
  {id:2,clientId:2,month:"2025-04",score:4,comment:"نتائج كويسة"},
  {id:3,clientId:4,month:"2025-04",score:5,comment:"ROAS فاق توقعاتي"},
  {id:4,clientId:5,month:"2025-04",score:3,comment:"يحتاج تحسين"},
];
// Notes/History
const INOTES=[
  {id:1,clientId:1,userId:4,date:"2025-05-10",type:"call",title:"مكالمة مع العميل",content:"ناقشنا نتائج أبريل، راضي جداً عن الأداء"},
  {id:2,clientId:1,userId:4,date:"2025-04-15",type:"deal",title:"تجديد الاشتراك",content:"جدد لـ 3 أشهر قادمة بنفس الباقة"},
  {id:3,clientId:2,userId:5,date:"2025-05-08",type:"note",title:"ملاحظة مهمة",content:"العميل طلب إضافة منصة YouTube في الشهر القادم"},
];

const todayStr=()=>new Date().toISOString().split("T")[0];
const fmtDate=(d)=>{if(!d)return"—";const dt=new Date(d);return`${dt.getDate()}/${dt.getMonth()+1}/${dt.getFullYear()}`};
const dl=(e)=>Math.ceil((new Date(e)-new Date())/86400000);
const pct=(a,b)=>Math.min(100,Math.round((a/b)*100));
const capC=(p)=>p>=90?C.red:p>=70?C.orange:C.green;
const ini=(n)=>n.split(" ").map(w=>w[0]).join("").slice(0,2);

// ─── ATOMS ───────────────────────────────────────────────────────────────────
const Card=({children,s={},onClick})=>(
  <div onClick={onClick} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,padding:20,...s,transition:"all .2s",cursor:onClick?"pointer":"default"}}
    onMouseEnter={e=>{if(onClick)e.currentTarget.style.borderColor=C.borderH}}
    onMouseLeave={e=>{if(onClick)e.currentTarget.style.borderColor=C.border}}>
    {children}
  </div>
);
const Bdg=({label,color,dot=true})=>(
  <span style={{display:"inline-flex",alignItems:"center",gap:5,background:`${color}18`,color,border:`1px solid ${color}33`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>
    {dot&&<span style={{width:5,height:5,borderRadius:"50%",background:color,display:"inline-block"}}/>}
    {label}
  </span>
);
const Av=({text,color,size=36})=>(
  <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,background:`${color}22`,border:`1.5px solid ${color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.29,fontWeight:700,color}}>{text}</div>
);
const PT=({name})=>(
  <span style={{fontSize:10,padding:"2px 8px",borderRadius:6,fontWeight:600,background:`${PC[name]||C.purple}22`,color:PC[name]||C.purple,border:`1px solid ${PC[name]||C.purple}33`,whiteSpace:"nowrap"}}>{name}</span>
);
const Inp=({label,value,onChange,type="text",placeholder,req,mb=14,style={}})=>(
  <div style={{marginBottom:mb,...style}}>
    {label&&<label style={{display:"block",fontSize:12,fontWeight:600,color:C.textS,marginBottom:6}}>{label}{req&&<span style={{color:C.pink}}> *</span>}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",padding:"11px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13,outline:"none",fontFamily:"Cairo",boxSizing:"border-box"}}
      onFocus={e=>e.target.style.borderColor=C.pink} onBlur={e=>e.target.style.borderColor=C.border}/>
  </div>
);
const Sel=({label,value,onChange,opts,ph,req,mb=14})=>(
  <div style={{marginBottom:mb}}>
    {label&&<label style={{display:"block",fontSize:12,fontWeight:600,color:C.textS,marginBottom:6}}>{label}{req&&<span style={{color:C.pink}}> *</span>}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"11px 14px",background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,color:value?C.text:C.textM,fontSize:13,outline:"none",fontFamily:"Cairo",cursor:"pointer"}}>
      <option value="">{ph||"اختر..."}</option>
      {opts.map(o=><option key={o.v} value={o.v} style={{background:C.bgCard,color:C.text}}>{o.l}</option>)}
    </select>
  </div>
);
const Mdl=({open,onClose,title,children,width=520})=>{
  if(!open)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.bgModal,border:`1px solid ${C.border}`,borderRadius:20,padding:28,width,maxWidth:"95vw",maxHeight:"92vh",overflowY:"auto",direction:"rtl",fontFamily:"Cairo",boxShadow:"0 24px 80px rgba(0,0,0,0.7)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
          <div style={{fontSize:16,fontWeight:800,color:C.text}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.textM,fontSize:20,cursor:"pointer",padding:4}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};
const Btn=({children,onClick,color,style:st={}})=>(
  <button onClick={onClick} style={{padding:"10px 18px",background:color||C.grad,border:"none",borderRadius:12,color:"white",fontSize:13,fontWeight:700,fontFamily:"Cairo",cursor:"pointer",...st}}>{children}</button>
);
const TB=({title,sub,children})=>(
  <div style={{padding:"24px 32px 0",display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:26}}>
    <div><h1 style={{color:C.text,fontSize:22,fontWeight:800,margin:0,marginBottom:3}}>{title}</h1>{sub&&<p style={{color:C.textS,fontSize:13,margin:0}}>{sub}</p>}</div>
    {children&&<div style={{display:"flex",gap:10,alignItems:"center"}}>{children}</div>}
  </div>
);
const StC=({label,value,sub,icon,color,trend})=>(
  <Card>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
      <div style={{width:40,height:40,borderRadius:11,background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{icon}</div>
      {trend!==undefined&&<span style={{fontSize:11,fontWeight:600,color:trend>=0?C.green:C.red}}>{trend>=0?"▲":"▼"} {Math.abs(trend)}%</span>}
    </div>
    <div style={{color:C.text,fontSize:24,fontWeight:800,marginBottom:3}}>{value}</div>
    <div style={{color:C.textS,fontSize:12}}>{label}</div>
    {sub&&<div style={{color:C.textM,fontSize:11,marginTop:3}}>{sub}</div>}
  </Card>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV=[
  {id:"dashboard",icon:"⬡",label:"الرئيسية"},
  {id:"clients",icon:"👥",label:"العملاء"},
  {id:"capacity",icon:"⚡",label:"Capacity"},
  {id:"followup",icon:"📌",label:"المتابعات"},
  {id:"creative",icon:"🎨",label:"الكريتيف"},
  {id:"campaigns",icon:"📊",label:"الحملات"},
  {id:"ai",icon:"🤖",label:"AI تحليل"},
  {id:"tasks",icon:"✅",label:"المهام"},
  {id:"reports",icon:"📋",label:"التقارير"},
  {id:"churn",icon:"📉",label:"Churn Tracker"},
  {id:"targets",icon:"🎯",label:"الأهداف"},
  {id:"scorecard",icon:"🏆",label:"Scorecard"},
  {id:"satisfaction",icon:"⭐",label:"رضا العملاء"},
  {id:"payroll",icon:"💰",label:"الرواتب",admin:true},
  {id:"team",icon:"🧑‍💼",label:"إدارة الفريق",admin:true},
];

function Sidebar({page,setPage,user,onLogout,unread}){
  return(
    <div style={{width:230,background:C.bgCard,borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",height:"100vh",position:"fixed",right:0,top:0,zIndex:100,overflowY:"auto"}}>
      <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width={24} height={24} viewBox="0 0 60 60" fill="none"><defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#E879A0"/><stop offset="100%" stopColor="#7B6FE0"/></linearGradient></defs><path d="M30 2 L36 22 L56 22 L40 35 L46 55 L30 43 L14 55 L20 35 L4 22 L24 22 Z" fill="url(#sg)"/></svg>
          <div><div style={{color:C.text,fontSize:15,fontWeight:900,lineHeight:1.1}}>وميض</div><div style={{fontSize:9,fontWeight:700,letterSpacing:4,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>WAMEED</div></div>
        </div>
      </div>
      <nav style={{flex:1,padding:"8px 8px"}}>
        {NAV.filter(n=>!n.admin||user.role==="admin").map(n=>{
          const a=page===n.id;
          return(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,marginBottom:2,background:a?`${C.pink}18`:"transparent",border:a?`1px solid ${C.pink}33`:"1px solid transparent",cursor:"pointer",fontFamily:"Cairo",transition:"all .15s",color:a?C.pink:C.textS,fontSize:12.5,fontWeight:a?600:400,textAlign:"right"}}
              onMouseEnter={e=>{if(!a)e.currentTarget.style.background="rgba(255,255,255,0.04)"}}
              onMouseLeave={e=>{if(!a)e.currentTarget.style.background="transparent"}}>
              <span style={{fontSize:14}}>{n.icon}</span>{n.label}
              {n.id==="followup"&&unread>0&&<span style={{marginRight:"auto",background:C.pink,color:"white",fontSize:9,fontWeight:700,borderRadius:10,padding:"2px 6px"}}>{unread}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:12,borderTop:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <Av text={user.avatar} color={RC[user.role]} size={34}/>
          <div style={{flex:1,minWidth:0}}><div style={{color:C.text,fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div><div style={{color:RC[user.role],fontSize:10,fontWeight:500}}>{RL[user.role]}</div></div>
        </div>
        <button onClick={onLogout} style={{width:"100%",padding:"7px",borderRadius:9,fontFamily:"Cairo",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",color:C.red,fontSize:12,fontWeight:600,cursor:"pointer"}}>تسجيل الخروج</button>
      </div>
    </div>
  );
}

// ═══ DASHBOARD ════════════════════════════════════════════════════════════════
function Dashboard({clients,users,notifs,followups,tasks}){
  const active=clients.filter(c=>c.status==="active");
  const renew=clients.filter(c=>{const d=dl(c.end);return d>0&&d<=14&&c.status==="active"});
  const rev=active.reduce((s,c)=>s+c.pkg,0);
  const avgR=active.length?(active.reduce((s,c)=>s+c.roas,0)/active.length).toFixed(1):0;
  const mbs=users.filter(u=>u.role==="media_buyer");
  const late=active.filter(c=>{const f=followups.filter(x=>x.clientId===c.id).sort((a,b)=>b.date.localeCompare(a.date))[0];const d=f?Math.floor((new Date()-new Date(f.date))/86400000):999;return d>1;});
  const lateTasks=tasks.filter(t=>new Date(t.due)<new Date()&&t.status!=="done");
  return(
    <div>
      <TB title="لوحة التحكم" sub="نظرة عامة على الأداء والفريق — مايو 2025">
        <div style={{display:"flex",alignItems:"center",gap:6,background:`${C.green}18`,border:`1px solid ${C.green}33`,borderRadius:20,padding:"6px 14px"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/>
          <span style={{color:C.green,fontSize:12,fontWeight:600}}>النظام يعمل</span>
        </div>
      </TB>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
          <StC label="العملاء النشطين" value={active.length} icon="👥" color={C.pink} trend={12} sub={`${clients.filter(c=>c.status==="hold").length} موقوف`}/>
          <StC label="إجمالي الإيرادات" value={`${(rev/1000).toFixed(0)}k SAR`} icon="💰" color={C.green} trend={5}/>
          <StC label="متوسط ROAS" value={avgR} icon="📈" color={C.purple} trend={8}/>
          <StC label="تجديد خلال 14 يوم" value={renew.length} icon="🔔" color={C.orange}/>
        </div>
        {(late.length>0||lateTasks.length>0)&&(
          <div style={{display:"grid",gridTemplateColumns:late.length>0&&lateTasks.length>0?"1fr 1fr":"1fr",gap:14,marginBottom:20}}>
            {late.length>0&&<div style={{background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:20}}>⚠️</span><div><div style={{color:C.red,fontSize:13,fontWeight:700,marginBottom:3}}>متأخرون في الفولو أب ({late.length})</div><div style={{color:"rgba(248,113,113,0.7)",fontSize:12}}>{late.map(c=>c.name).join(" · ")}</div></div>
            </div>}
            {lateTasks.length>0&&<div style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:20}}>📋</span><div><div style={{color:C.orange,fontSize:13,fontWeight:700,marginBottom:3}}>مهام متأخرة ({lateTasks.length})</div><div style={{color:"rgba(245,158,11,0.7)",fontSize:12}}>{lateTasks.map(t=>t.title.split("—")[0].trim()).join(" · ")}</div></div>
            </div>}
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{color:C.text,fontSize:14,fontWeight:700}}>أداء الفريق — ROAS</div>
            </div>
            {mbs.map(m=>{
              const mc=clients.filter(c=>c.mb===m.id&&c.status==="active");
              const r=mc.length?(mc.reduce((s,c)=>s+c.roas,0)/mc.length).toFixed(1):0;
              return(<div key={m.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <Av text={m.avatar} color={RC.media_buyer} size={30}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:C.text,fontWeight:600}}>{m.name}</span><span style={{fontSize:12,color:r>=3?C.green:C.orange,fontWeight:700}}>ROAS {r}</span></div>
                  <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,r*20)}%`,background:r>=3?C.green:C.orange,borderRadius:3}}/></div>
                </div>
              </div>);
            })}
          </Card>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{color:C.text,fontSize:14,fontWeight:700}}>تجديدات قريبة</div>
              <Bdg label={`${renew.length} عملاء`} color={C.orange}/>
            </div>
            {renew.length===0?<div style={{color:C.textM,fontSize:13,textAlign:"center",padding:"20px 0"}}>لا توجد تجديدات قريبة</div>:renew.map(c=>{
              const d=dl(c.end);const mb=users.find(u=>u.id===c.mb);
              return(<div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10,marginBottom:8,border:`1px solid ${d<=7?C.red+"33":C.orange+"22"}`}}>
                <div><div style={{color:C.text,fontSize:13,fontWeight:600}}>{c.name}</div><div style={{color:C.textS,fontSize:11}}>{mb?.name}</div></div>
                <div style={{textAlign:"left"}}><div style={{color:d<=7?C.red:C.orange,fontSize:13,fontWeight:700}}>{d} يوم</div><div style={{color:C.textM,fontSize:10}}>{c.pkg.toLocaleString()} SAR</div></div>
              </div>);
            })}
          </Card>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:14}}>توزيع المنصات</div>
            {["Meta","Snapchat","TikTok","Google"].map(p=>{
              const cnt=clients.filter(c=>c.platforms.includes(p)).length;if(!cnt)return null;
              return(<div key={p} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:60,fontSize:12,fontWeight:700,color:PC[p],textAlign:"right"}}>{p}</div>
                <div style={{flex:1,height:8,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(cnt/clients.length)*100}%`,background:PC[p],borderRadius:4}}/></div>
                <div style={{color:C.textS,fontSize:12,minWidth:14}}>{cnt}</div>
              </div>);
            })}
          </Card>
          <Card>
            <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:14}}>Capacity الفريق</div>
            {users.filter(u=>u.role==="media_buyer").map(m=>{
              const ac=clients.filter(c=>c.mb===m.id&&c.status==="active").length;const p=pct(ac,10);
              return(<div key={m.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <Av text={m.avatar} color={RC.media_buyer} size={28}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:C.textS}}>{m.name}</span><span style={{fontSize:11,color:capC(p),fontWeight:700}}>{ac}/10</span></div>
                  <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${p}%`,background:capC(p),borderRadius:3}}/></div>
                </div>
              </div>);
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══ AI ANALYSIS (Claude API) ════════════════════════════════════════════════
function AIAnalysis({clients,campaigns,users}){
  const [selClient,setSelClient]=useState("");
  const [aiResp,setAiResp]=useState("");
  const [loading,setLoading]=useState(false);
  const [chat,setChat]=useState([]);
  const [msg,setMsg]=useState("");
  const activeClients=clients.filter(c=>c.status==="active");

  const analyze=async()=>{
    if(!selClient){alert("اختر عميلاً أولاً");return;}
    const client=clients.find(c=>c.id===+selClient);
    const cams=campaigns.filter(c=>c.clientId===+selClient);
    const mb=users.find(u=>u.id===client.mb);
    if(!cams.length){alert("لا توجد بيانات حملات لهذا العميل");return;}
    setLoading(true);
    const summary=cams.map(c=>`${c.platform}: Spend ${c.spend} SAR, ROAS ${c.roas}, Clicks ${c.clicks}, Purchases ${c.purchases}, CTR ${c.ctr}%`).join("\n");
    const prompt=`أنت مساعد تحليل حملات إعلانية لـ وميض (وكالة ميديا). حلل البيانات التالية لعميل "${client.name}" وأعطي:\n1. تشخيص الوضع الحالي\n2. المشاكل الرئيسية\n3. توصيات عملية بالأرقام\n4. توزيع الميزانية المقترح\n5. هدف ROAS الأسبوع القادم\n\nبيانات الحملات:\n${summary}\n\nميزانية العميل الشهرية: ${client.pkg} SAR\nالـ Media Buyer: ${mb?.name}\nالمنصات: ${client.platforms.join(", ")}\n\nرد بالعربي بشكل منظم ومختصر وعملي.`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const text=data.content?.[0]?.text||"لم يتمكن النظام من التحليل";
      setAiResp(text);
      setChat([{role:"assistant",content:text}]);
    }catch(e){setAiResp("حدث خطأ في الاتصال بـ AI. حاول مرة أخرى.");}
    setLoading(false);
  };

  const sendMsg=async()=>{
    if(!msg.trim()||loading)return;
    const client=clients.find(c=>c.id===+selClient);
    const newChat=[...chat,{role:"user",content:msg}];
    setChat(newChat);setMsg("");setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:`أنت مساعد تحليل حملات لوكالة وميض. العميل الحالي: ${client?.name}. رد بالعربي بشكل مختصر وعملي.`,messages:newChat.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      const text=data.content?.[0]?.text||"خطأ في الاتصال";
      setChat(p=>[...p,{role:"assistant",content:text}]);
    }catch(e){setChat(p=>[...p,{role:"assistant",content:"حدث خطأ. حاول مرة أخرى."}]);}
    setLoading(false);
  };

  return(
    <div>
      <TB title="AI تحليل الحملات 🤖" sub="تحليل ذكي بالذكاء الاصطناعي — اقتراحات وتوقعات وحلول"/>
      <div style={{padding:"0 32px"}}>
        <div style={{background:"rgba(123,111,224,0.08)",border:"1px solid rgba(123,111,224,0.25)",borderRadius:14,padding:"14px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24}}>🤖</span>
          <div><div style={{color:C.purple,fontSize:13,fontWeight:700,marginBottom:3}}>مدعوم بـ Claude AI</div><div style={{color:"rgba(123,111,224,0.8)",fontSize:12}}>حدد عميلاً، واضغط "تحليل الآن" — الـ AI بيقرأ بيانات الحملات ويرجعلك تحليل كامل مع توصيات عملية</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:20}}>
          {/* Left: selector + info */}
          <div>
            <Card>
              <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:14}}>اختر العميل</div>
              <Sel value={selClient} onChange={setSelClient} opts={activeClients.map(c=>({v:c.id,l:c.name}))} ph="اختر عميلاً..." mb={16}/>
              {selClient&&(()=>{
                const client=clients.find(c=>c.id===+selClient);
                const cams=campaigns.filter(c=>c.clientId===+selClient);
                return(
                  <div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{client.platforms.map(p=><PT key={p} name={p}/>)}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                      {[["الباقة",`${client.pkg.toLocaleString()} SAR`],["ROAS",client.roas],["حملات",`${cams.length} حملة`]].map(([l,v])=>(
                        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",background:"rgba(255,255,255,0.03)",borderRadius:8}}>
                          <span style={{color:C.textS,fontSize:12}}>{l}</span><span style={{color:C.text,fontSize:12,fontWeight:600}}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <Btn onClick={analyze} style={{width:"100%",padding:13,opacity:loading?0.7:1}}>
                {loading?"🔄 جاري التحليل...":"✨ تحليل الآن"}
              </Btn>
            </Card>
            {selClient&&(
              <Card s={{marginTop:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:700,marginBottom:12}}>📊 ملخص الحملات</div>
                {campaigns.filter(c=>c.clientId===+selClient).map(c=>(
                  <div key={c.id} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><PT name={c.platform}/><span style={{color:c.roas>=3?C.green:C.orange,fontSize:12,fontWeight:700}}>ROAS {c.roas}</span></div>
                    <div style={{color:C.textM,fontSize:11}}>Spend: {c.spend.toLocaleString()} SAR · Purchases: {c.purchases}</div>
                  </div>
                ))}
              </Card>
            )}
          </div>
          {/* Right: AI response + chat */}
          <div>
            {!aiResp&&!loading&&(
              <Card s={{textAlign:"center",padding:"80px 20px"}}>
                <div style={{fontSize:56,marginBottom:16}}>🤖</div>
                <div style={{color:C.text,fontSize:16,fontWeight:700,marginBottom:8}}>جاهز للتحليل</div>
                <div style={{color:C.textS,fontSize:13}}>اختر عميلاً واضغط "تحليل الآن"</div>
              </Card>
            )}
            {loading&&!aiResp&&(
              <Card s={{textAlign:"center",padding:"80px 20px"}}>
                <div style={{fontSize:40,marginBottom:16,animation:"spin 1s linear infinite",display:"inline-block"}}>🔄</div>
                <div style={{color:C.purple,fontSize:14,fontWeight:600}}>الـ AI بيحلل البيانات...</div>
              </Card>
            )}
            {chat.length>0&&(
              <div>
                <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:14,maxHeight:420,overflowY:"auto"}}>
                  {chat.map((m,i)=>(
                    <div key={i} style={{marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <div style={{width:24,height:24,borderRadius:"50%",background:m.role==="assistant"?`${C.purple}33`:`${C.pink}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>{m.role==="assistant"?"🤖":"👤"}</div>
                        <span style={{fontSize:11,color:C.textM,fontWeight:500}}>{m.role==="assistant"?"Claude AI":"أنت"}</span>
                      </div>
                      <div style={{background:m.role==="assistant"?"rgba(123,111,224,0.08)":"rgba(255,255,255,0.04)",border:`1px solid ${m.role==="assistant"?"rgba(123,111,224,0.2)":C.border}`,borderRadius:12,padding:"12px 16px",fontSize:12.5,color:C.text,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.content}</div>
                    </div>
                  ))}
                  {loading&&<div style={{color:C.textM,fontSize:12,textAlign:"center",padding:"10px 0"}}>🔄 جاري...</div>}
                </div>
                {/* Chat input */}
                <div style={{display:"flex",gap:10}}>
                  <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="اسأل سؤالاً عن العميل أو الحملات..."
                    style={{flex:1,padding:"11px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:13,outline:"none",fontFamily:"Cairo"}}/>
                  <Btn onClick={sendMsg} style={{padding:"11px 20px",opacity:loading?0.6:1}}>إرسال</Btn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ═══ CHURN TRACKER ═══════════════════════════════════════════════════════════
function ChurnTracker({clients,users}){
  const cancelled=clients.filter(c=>c.status==="cancelled");
  const allTotal=clients.length;
  const churnRate=allTotal?((cancelled.length/allTotal)*100).toFixed(1):0;
  const reasons=["سعر","عدم رضا","ميزانية","منافس","توقف النشاط","أخرى"];
  const reasonCounts=reasons.map(r=>({r,count:cancelled.filter(c=>c.cancelReason===r).length})).filter(x=>x.count>0);
  return(
    <div>
      <TB title="Churn Tracker 📉" sub="تتبع العملاء الملغيين وأسباب الإلغاء"/>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
          <StC label="إجمالي الملغيين" value={cancelled.length} icon="📉" color={C.red}/>
          <StC label="Churn Rate" value={`${churnRate}%`} icon="📊" color={C.orange}/>
          <StC label="العملاء النشطين" value={clients.filter(c=>c.status==="active").length} icon="✅" color={C.green}/>
          <StC label="Renewal Rate" value={`${(100-churnRate).toFixed(1)}%`} icon="🔄" color={C.purple}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
          <Card>
            <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:16}}>أسباب الإلغاء</div>
            {reasonCounts.length===0?<div style={{color:C.textM,fontSize:13,textAlign:"center",padding:"20px"}}>لا بيانات كافية</div>:reasonCounts.map(({r,count})=>{
              const maxC=Math.max(...reasonCounts.map(x=>x.count));
              return(<div key={r} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{width:70,color:C.textS,fontSize:12,textAlign:"right"}}>{r}</div>
                <div style={{flex:1,height:8,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(count/maxC)*100}%`,background:C.red,borderRadius:4}}/></div>
                <div style={{color:C.red,fontSize:13,fontWeight:700,minWidth:16}}>{count}</div>
              </div>);
            })}
          </Card>
          <Card>
            <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:16}}>نسب الحالات</div>
            {[["نشط",clients.filter(c=>c.status==="active").length,C.green],["موقوف",clients.filter(c=>c.status==="hold").length,C.orange],["ملغي",cancelled.length,C.red]].map(([l,v,co])=>{
              const p=allTotal?((v/allTotal)*100).toFixed(0):0;
              return(<div key={l} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <Bdg label={l} color={co}/>
                <div style={{flex:1,height:8,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${p}%`,background:co,borderRadius:4}}/></div>
                <span style={{color:co,fontSize:13,fontWeight:700}}>{p}%</span>
              </div>);
            })}
          </Card>
        </div>
        <Card>
          <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:16}}>قائمة العملاء الملغيين</div>
          {cancelled.length===0?<div style={{color:C.textM,textAlign:"center",padding:"30px",fontSize:13}}>لا يوجد عملاء ملغيون</div>:
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"Cairo"}}>
            <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["العميل","الباقة","تاريخ الإلغاء","السبب","Media Buyer","ROAS"].map((h,i)=><th key={i} style={{padding:"12px 14px",color:C.textM,fontSize:11,textAlign:"right"}}>{h}</th>)}</tr></thead>
            <tbody>{cancelled.map(c=>{
              const mb=users.find(u=>u.id===c.mb);
              return(<tr key={c.id} style={{borderBottom:`1px solid ${C.border}`}} onMouseEnter={e=>e.currentTarget.style.background=C.bgHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"12px 14px",color:C.text,fontSize:13,fontWeight:600}}>{c.name}</td>
                <td style={{padding:"12px 14px",color:C.textS,fontSize:12}}>{c.pkg?.toLocaleString()} SAR</td>
                <td style={{padding:"12px 14px",color:C.textS,fontSize:12}}>{fmtDate(c.cancelDate||c.end)}</td>
                <td style={{padding:"12px 14px"}}><span style={{background:`${C.red}18`,color:C.red,border:`1px solid ${C.red}33`,borderRadius:8,padding:"3px 10px",fontSize:11,fontWeight:600}}>{c.cancelReason||"غير محدد"}</span></td>
                <td style={{padding:"12px 14px",color:C.textS,fontSize:12}}>{mb?.name||"—"}</td>
                <td style={{padding:"12px 14px",color:c.roas>=3?C.green:C.orange,fontWeight:700}}>{c.roas}</td>
              </tr>);
            })}</tbody>
          </table>}
        </Card>
      </div>
    </div>
  );
}

// ═══ TARGETS VS ACTUALS ════════════════════════════════════════════════════
function Targets({clients,campaigns,users,targets,setTargets}){
  const mbs=users.filter(u=>u.role==="media_buyer");
  const [editOpen,setEditOpen]=useState(false);
  const [editUser,setEditUser]=useState(null);
  const [f,setF]=useState({targetClients:5,targetRoas:3.5,targetUpsell:1,targetRenewal:85});
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));
  const saveTarget=()=>{
    const existing=targets.find(t=>t.userId===editUser.id&&t.month==="2025-05");
    if(existing)setTargets(p=>p.map(t=>t.id===existing.id?{...t,...f}:t));
    else setTargets(p=>[...p,{id:Date.now(),userId:editUser.id,month:"2025-05",...f}]);
    setEditOpen(false);
  };
  const getActuals=(uid)=>{
    const myClients=clients.filter(c=>c.mb===uid&&c.status==="active");
    const myCams=campaigns.filter(c=>myClients.find(cl=>cl.id===c.clientId));
    return{clients:myClients.length,roas:myCams.length?(myCams.reduce((s,c)=>s+c.roas,0)/myCams.length).toFixed(1):0};
  };
  return(
    <div>
      <Mdl open={editOpen} onClose={()=>setEditOpen(false)} title={`🎯 تحديد أهداف — ${editUser?.name}`} width={420}>
        {[["targetClients","هدف العملاء (عدد)","number","5"],["targetRoas","هدف ROAS","number","3.5"],["targetUpsell","هدف Upsell (عدد)","number","1"],["targetRenewal","هدف Renewal Rate (%)","number","85"]].map(([k,l,t,ph])=>(
          <Inp key={k} label={l} value={f[k]} onChange={v=>sf(k,+v)} type={t} placeholder={ph}/>
        ))}
        <Btn onClick={saveTarget} style={{width:"100%",padding:13}}>✓ حفظ الأهداف</Btn>
      </Mdl>
      <TB title="الأهداف والإنجازات 🎯" sub="Targets vs Actuals — مايو 2025"/>
      <div style={{padding:"0 32px"}}>
        {mbs.map(m=>{
          const target=targets.find(t=>t.userId===m.id&&t.month==="2025-05");
          const actuals=getActuals(m.id);
          const clientPct=target?pct(actuals.clients,target.targetClients):0;
          const roasPct=target?Math.min(100,Math.round((actuals.roas/target.targetRoas)*100)):0;
          return(
            <Card key={m.id} s={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <Av text={m.avatar} color={RC.media_buyer} size={46}/>
                  <div><div style={{color:C.text,fontSize:15,fontWeight:700}}>{m.name}</div><Bdg label="Media Buyer" color={RC.media_buyer}/></div>
                </div>
                <Btn onClick={()=>{setEditUser(m);const t=targets.find(x=>x.userId===m.id&&x.month==="2025-05");if(t)setF({targetClients:t.targetClients,targetRoas:t.targetRoas,targetUpsell:t.targetUpsell,targetRenewal:t.targetRenewal});setEditOpen(true)}} color={`${C.purple}33`} style={{color:C.purple,fontSize:12}}>✏️ تعديل الأهداف</Btn>
              </div>
              {!target?<div style={{color:C.textM,fontSize:13,textAlign:"center",padding:"20px 0"}}>لم يتم تحديد أهداف — اضغط تعديل الأهداف</div>:(
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
                  {[["العملاء",actuals.clients,target.targetClients,clientPct,C.blue],["ROAS",actuals.roas,target.targetRoas,roasPct,C.green],["Upsell","—",target.targetUpsell,0,C.orange],["Renewal",`${Math.round(Math.random()*20+75)}%`,`${target.targetRenewal}%`,Math.round(Math.random()*30+70),C.purple]].map(([l,actual,tgt,p,co])=>(
                    <div key={l} style={{textAlign:"center",padding:"14px 10px",background:"rgba(255,255,255,0.03)",borderRadius:12}}>
                      <div style={{color:C.textM,fontSize:11,marginBottom:6}}>{l}</div>
                      <div style={{color:co,fontSize:20,fontWeight:800,marginBottom:4}}>{actual}</div>
                      <div style={{color:C.textM,fontSize:10,marginBottom:8}}>هدف: {tgt}</div>
                      <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden",marginBottom:4}}><div style={{height:"100%",width:`${p}%`,background:p>=80?C.green:p>=50?C.orange:C.red,borderRadius:3}}/></div>
                      <div style={{fontSize:11,fontWeight:700,color:p>=80?C.green:p>=50?C.orange:C.red}}>{p}%</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ═══ PERFORMANCE SCORECARD ════════════════════════════════════════════════════
function Scorecard({clients,campaigns,tasks,users}){
  const team=users.filter(u=>u.role!=="admin");
  const calcScore=(u)=>{
    const myC=clients.filter(c=>c.mb===u.id&&c.status==="active");
    const myCams=campaigns.filter(c=>myC.find(cl=>cl.id===c.clientId));
    const avgR=myCams.length?(myCams.reduce((s,c)=>s+c.roas,0)/myCams.length):0;
    const myT=tasks.filter(t=>t.assignedTo===u.id);
    const doneT=myT.filter(t=>t.status==="done").length;
    const lateT=myT.filter(t=>t.status==="late").length;
    const roasScore=Math.min(40,Math.round((avgR/5)*40));
    const clientScore=Math.min(30,myC.length*5);
    const taskScore=myT.length?Math.max(0,30-lateT*10):15;
    return{total:roasScore+clientScore+taskScore,roasScore,clientScore,taskScore,avgR:avgR.toFixed(1),clients:myC.length,tasks:myT.length,done:doneT,late:lateT};
  };
  const scored=team.map(u=>({...u,score:calcScore(u)})).sort((a,b)=>b.score.total-a.score.total);
  const medalColor=(i)=>i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":C.textM;
  return(
    <div>
      <TB title="Performance Scorecard 🏆" sub="نقاط أداء شهرية لكل موظف — مايو 2025"/>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
          {scored.slice(0,3).map((u,i)=>(
            <Card key={u.id} s={{textAlign:"center",border:`1px solid ${medalColor(i)}44`}}>
              <div style={{fontSize:28,marginBottom:8}}>{i===0?"🥇":i===1?"🥈":"🥉"}</div>
              <Av text={u.avatar} color={RC[u.role]} size={52} /><div style={{marginTop:0}}/>
              <div style={{color:C.text,fontSize:15,fontWeight:700,marginTop:10,marginBottom:4}}>{u.name}</div>
              <Bdg label={RL[u.role]} color={RC[u.role]}/>
              <div style={{color:medalColor(i),fontSize:32,fontWeight:900,margin:"12px 0 4px"}}>{u.score.total}</div>
              <div style={{color:C.textM,fontSize:11}}>نقطة من 100</div>
            </Card>
          ))}
        </div>
        <Card>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"Cairo"}}>
            <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["#","الموظف","ROAS Score","Client Score","Task Score","الإجمالي","التقييم"].map((h,i)=><th key={i} style={{padding:"12px 16px",color:C.textM,fontSize:11,textAlign:"right"}}>{h}</th>)}</tr></thead>
            <tbody>{scored.map((u,i)=>{
              const s=u.score;const grade=s.total>=80?"ممتاز":s.total>=60?"جيد جداً":s.total>=40?"جيد":"يحتاج تطوير";
              const gradeC=s.total>=80?C.green:s.total>=60?C.blue:s.total>=40?C.orange:C.red;
              return(<tr key={u.id} style={{borderBottom:`1px solid ${C.border}`}} onMouseEnter={e=>e.currentTarget.style.background=C.bgHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"13px 16px",color:medalColor(i),fontSize:16,fontWeight:700}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</td>
                <td style={{padding:"13px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Av text={u.avatar} color={RC[u.role]} size={30}/><div><div style={{color:C.text,fontSize:13,fontWeight:600}}>{u.name}</div><div style={{color:RC[u.role],fontSize:10}}>{RL[u.role]}</div></div></div></td>
                <td style={{padding:"13px 16px"}}><div><div style={{color:C.text,fontSize:13,fontWeight:700}}>{s.roasScore}/40</div><div style={{color:C.textM,fontSize:10}}>ROAS {s.avgR}</div></div></td>
                <td style={{padding:"13px 16px"}}><div><div style={{color:C.text,fontSize:13,fontWeight:700}}>{s.clientScore}/30</div><div style={{color:C.textM,fontSize:10}}>{s.clients} عميل</div></div></td>
                <td style={{padding:"13px 16px"}}><div><div style={{color:C.text,fontSize:13,fontWeight:700}}>{s.taskScore}/30</div><div style={{color:C.textM,fontSize:10}}>{s.done} منجزة · {s.late} متأخرة</div></div></td>
                <td style={{padding:"13px 16px"}}><div style={{color:gradeC,fontSize:20,fontWeight:900}}>{s.total}</div></td>
                <td style={{padding:"13px 16px"}}><Bdg label={grade} color={gradeC}/></td>
              </tr>);
            })}</tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ═══ CLIENT SATISFACTION ══════════════════════════════════════════════════════
function Satisfaction({clients,satisfaction,setSatisfaction,users}){
  const [addOpen,setAddOpen]=useState(false);
  const [f,setF]=useState({clientId:"",score:5,comment:""});
  const [month]=useState("2025-05");
  const active=clients.filter(c=>c.status==="active");
  const avgScore=satisfaction.length?(satisfaction.reduce((s,x)=>s+x.score,0)/satisfaction.length).toFixed(1):0;
  const add=()=>{
    if(!f.clientId)return;
    setSatisfaction(p=>[...p,{id:Date.now(),...f,clientId:+f.clientId,month,score:+f.score}]);
    setF({clientId:"",score:5,comment:""});setAddOpen(false);
  };
  const stars=(n,max=5)=>Array.from({length:max},(_,i)=>(
    <span key={i} style={{color:i<n?"#FFD700":C.textM,fontSize:16}}>★</span>
  ));
  return(
    <div>
      <Mdl open={addOpen} onClose={()=>setAddOpen(false)} title="⭐ إضافة تقييم يدوي" width={420}>
        <Sel label="العميل" value={f.clientId} onChange={v=>setF(p=>({...p,clientId:v}))} opts={active.map(c=>({v:c.id,l:c.name}))} req/>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:C.textS,marginBottom:8}}>التقييم</label>
          <div style={{display:"flex",gap:8}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} onClick={()=>setF(p=>({...p,score:n}))} style={{width:40,height:40,borderRadius:10,border:`1px solid ${f.score>=n?"#FFD700":C.border}`,background:f.score>=n?"rgba(255,215,0,0.15)":"rgba(255,255,255,0.03)",cursor:"pointer",fontSize:20,color:f.score>=n?"#FFD700":C.textM}}>★</button>
            ))}
            <span style={{color:C.text,fontSize:13,fontWeight:700,alignSelf:"center",marginRight:8}}>{f.score}/5</span>
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:C.textS,marginBottom:6}}>تعليق</label>
          <textarea value={f.comment} onChange={e=>setF(p=>({...p,comment:e.target.value}))} placeholder="ما رأي العميل..."
            style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13,outline:"none",fontFamily:"Cairo",boxSizing:"border-box",resize:"vertical",minHeight:70,direction:"rtl"}}/>
        </div>
        <Btn onClick={add} style={{width:"100%",padding:13}}>✓ إضافة</Btn>
      </Mdl>
      <TB title="رضا العملاء ⭐" sub="تقييمات العملاء من بواباتهم ويدوياً">
        <Btn onClick={()=>setAddOpen(true)}>+ إضافة يدوي</Btn>
      </TB>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
          <StC label="متوسط التقييم" value={`${avgScore} ★`} icon="⭐" color={C.orange}/>
          <StC label="تقييمات إجمالية" value={satisfaction.length} icon="📝" color={C.blue}/>
          <StC label="ممتازون (5 ★)" value={satisfaction.filter(s=>s.score===5).length} icon="🌟" color={C.green}/>
          <StC label="يحتاجون متابعة (≤3)" value={satisfaction.filter(s=>s.score<=3).length} icon="⚠️" color={C.red}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
          <Card>
            <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:16}}>توزيع التقييمات</div>
            {[5,4,3,2,1].map(n=>{
              const cnt=satisfaction.filter(s=>s.score===n).length;
              const max=satisfaction.length||1;
              return(<div key={n} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{display:"flex",gap:2,minWidth:80}}>{Array(n).fill(null).map((_,i)=><span key={i} style={{color:"#FFD700",fontSize:13}}>★</span>)}</div>
                <div style={{flex:1,height:8,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(cnt/max)*100}%`,background:"#FFD700",borderRadius:4}}/></div>
                <span style={{color:C.textS,fontSize:12,minWidth:14}}>{cnt}</span>
              </div>);
            })}
          </Card>
          <Card>
            <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:16}}>تفاصيل كل محور</div>
            {satisfaction.some(s=>s.roas)&&[
              ["📈 ROAS وأداء الحملات","roas"],
              ["⚡ سرعة الرد","speed"],
              ["📋 جودة التقارير","reports"],
              ["🌟 التقييم العام","overall"],
            ].map(([l,k])=>{
              const vals=satisfaction.filter(s=>s[k]>0).map(s=>s[k]);
              const avg=vals.length?(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):null;
              if(!avg)return null;
              return(<div key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{flex:1,color:C.textS,fontSize:12}}>{l}</div>
                <div style={{width:80,height:6,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(avg/5)*100}%`,background:avg>=4?C.green:avg>=3?C.orange:C.red,borderRadius:3}}/></div>
                <span style={{color:C.text,fontSize:12,fontWeight:700,minWidth:28}}>{avg} ★</span>
              </div>);
            })}
            {!satisfaction.some(s=>s.roas)&&<div style={{color:C.textM,fontSize:12,textAlign:"center",padding:"20px 0"}}>لا توجد تقييمات تفصيلية بعد</div>}
          </Card>
        </div>
        {/* Client ratings list */}
        <Card>
          <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:16}}>سجل التقييمات</div>
          {satisfaction.length===0?<div style={{color:C.textM,textAlign:"center",padding:"30px",fontSize:13}}>لا توجد تقييمات بعد — ستظهر هنا عندما يقيّم العملاء من بواباتهم</div>:
          satisfaction.slice().reverse().map(s=>{
            const client=clients.find(c=>c.id===s.clientId);
            return(
              <div key={s.id} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <div style={{color:C.text,fontSize:13,fontWeight:600}}>{client?.name||"عميل"}</div>
                    <div style={{color:C.textM,fontSize:11}}>{s.month}</div>
                    {s.roas&&<Bdg label="تقييم تفصيلي" color={C.purple} dot={false}/>}
                  </div>
                  {s.comment&&<div style={{color:C.textS,fontSize:12,fontStyle:"italic",marginBottom:6}}>"{s.comment}"</div>}
                  {s.roas&&(
                    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                      {[["ROAS",s.roas],["سرعة الرد",s.speed],["التقارير",s.reports],["العام",s.overall]].filter(([,v])=>v>0).map(([l,v])=>(
                        <div key={l} style={{fontSize:11,color:C.textM}}>{l}: <span style={{color:"#FFD700",fontWeight:700}}>{"★".repeat(v)}</span></div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{display:"flex",gap:1,flexShrink:0,marginRight:8}}>{stars(s.score)}</div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// ═══ RENEWAL SYSTEM ══════════════════════════════════════════════════════════
function RenewalSystem({clients,users}){
  const active=clients.filter(c=>c.status==="active");
  const renew7=active.filter(c=>dl(c.end)<=7&&dl(c.end)>0);
  const renew14=active.filter(c=>dl(c.end)>7&&dl(c.end)<=14);
  const expired=clients.filter(c=>dl(c.end)<=0&&c.status==="active");
  const renewed=clients.filter(c=>c.status==="active").length;
  const churnRate=clients.length?((clients.filter(c=>c.status==="cancelled").length/clients.length)*100).toFixed(1):0;
  return(
    <div>
      <TB title="نظام التجديد 🔄" sub="تتبع التجديدات والتنبيهات"/>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
          <StC label="ينتهون خلال 7 أيام" value={renew7.length} icon="🚨" color={C.red}/>
          <StC label="ينتهون خلال 14 يوم" value={renew14.length} icon="⚠️" color={C.orange}/>
          <StC label="Renewal Rate" value={`${(100-churnRate).toFixed(1)}%`} icon="🔄" color={C.green}/>
          <StC label="منتهيون (لم يجددوا)" value={expired.length} icon="❌" color={C.red}/>
        </div>
        {renew7.length>0&&(
          <div style={{background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:14,padding:"16px 20px",marginBottom:16}}>
            <div style={{color:C.red,fontSize:13,fontWeight:700,marginBottom:10}}>🚨 عاجل — ينتهون خلال 7 أيام</div>
            {renew7.map(c=>{
              const mb=users.find(u=>u.id===c.mb);const d=dl(c.end);
              return(<div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:"rgba(248,113,113,0.08)",borderRadius:10,marginBottom:8}}>
                <div><div style={{color:C.text,fontSize:13,fontWeight:600}}>{c.name}</div><div style={{color:C.textS,fontSize:11}}>{mb?.name} · {c.pkg.toLocaleString()} SAR</div></div>
                <div style={{textAlign:"center"}}><div style={{color:C.red,fontSize:16,fontWeight:800}}>{d} يوم</div><Btn color="rgba(52,211,153,0.2)" style={{color:C.green,fontSize:11,padding:"5px 12px",marginTop:4,border:`1px solid ${C.green}33`}}>تجديد ✓</Btn></div>
              </div>);
            })}
          </div>
        )}
        {renew14.length>0&&(
          <div style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:14,padding:"16px 20px",marginBottom:16}}>
            <div style={{color:C.orange,fontSize:13,fontWeight:700,marginBottom:10}}>⚠️ ينتهون خلال 14 يوم</div>
            {renew14.map(c=>{
              const mb=users.find(u=>u.id===c.mb);const d=dl(c.end);
              return(<div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:"rgba(245,158,11,0.06)",borderRadius:10,marginBottom:8}}>
                <div><div style={{color:C.text,fontSize:13,fontWeight:600}}>{c.name}</div><div style={{color:C.textS,fontSize:11}}>{mb?.name}</div></div>
                <div style={{color:C.orange,fontSize:14,fontWeight:700}}>{d} يوم</div>
              </div>);
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ CLIENT NOTES ════════════════════════════════════════════════════════════
function ClientNotes({client,notes,setNotes,users,onBack}){
  const [addOpen,setAddOpen]=useState(false);
  const [f,setF]=useState({type:"note",title:"",content:""});
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));
  const myNotes=notes.filter(n=>n.clientId===client.id).sort((a,b)=>b.date.localeCompare(a.date));
  const typeIcon={note:"📝",call:"📞",deal:"🤝",meeting:"📅",issue:"⚠️"};
  const typeColor={note:C.purple,call:C.blue,deal:C.green,meeting:C.teal,issue:C.red};
  const add=()=>{
    if(!f.title.trim())return;
    setNotes(p=>[...p,{id:Date.now(),clientId:client.id,userId:1,date:todayStr(),...f}]);
    setF({type:"note",title:"",content:""});setAddOpen(false);
  };
  return(
    <div>
      <Mdl open={addOpen} onClose={()=>setAddOpen(false)} title="📝 إضافة ملاحظة" width={460}>
        <Sel label="النوع" value={f.type} onChange={v=>sf("type",v)} opts={[{v:"note",l:"📝 ملاحظة"},{v:"call",l:"📞 مكالمة"},{v:"deal",l:"🤝 صفقة"},{v:"meeting",l:"📅 اجتماع"},{v:"issue",l:"⚠️ مشكلة"}]}/>
        <Inp label="العنوان" value={f.title} onChange={v=>sf("title",v)} placeholder="مثال: مكالمة تجديد" req/>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:C.textS,marginBottom:6}}>التفاصيل</label>
          <textarea value={f.content} onChange={e=>sf("content",e.target.value)} placeholder="اكتب التفاصيل..."
            style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13,outline:"none",fontFamily:"Cairo",boxSizing:"border-box",resize:"vertical",minHeight:80,direction:"rtl"}}/>
        </div>
        <Btn onClick={add} style={{width:"100%",padding:13}}>✓ حفظ</Btn>
      </Mdl>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:C.textS,cursor:"pointer",fontFamily:"Cairo",fontSize:13,marginBottom:14}}>← العودة</button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{color:C.text,fontSize:14,fontWeight:700}}>سجل التفاعلات — {client.name}</div>
        <Btn onClick={()=>setAddOpen(true)} style={{fontSize:12,padding:"8px 14px"}}>+ إضافة</Btn>
      </div>
      {myNotes.length===0?<div style={{color:C.textM,textAlign:"center",padding:"30px",fontSize:13}}>لا توجد ملاحظات — أضف أول ملاحظة</div>:
      myNotes.map(n=>{
        const user=users.find(u=>u.id===n.userId);
        return(<div key={n.id} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{width:36,height:36,borderRadius:10,background:`${typeColor[n.type]||C.purple}22`,border:`1px solid ${typeColor[n.type]||C.purple}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{typeIcon[n.type]||"📝"}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{color:C.text,fontSize:13,fontWeight:700}}>{n.title}</div><div style={{color:C.textM,fontSize:11}}>{fmtDate(n.date)}</div></div>
            {n.content&&<div style={{color:C.textS,fontSize:12,lineHeight:1.55}}>{n.content}</div>}
            {user&&<div style={{color:C.textM,fontSize:10,marginTop:4}}>{user.name}</div>}
          </div>
        </div>);
      })}
    </div>
  );
}

// ═══ CLIENTS PAGE ═════════════════════════════════════════════════════════════
function AddClientModal({open,onClose,onAdd,users}){
  const mbs=users.filter(u=>u.role==="media_buyer");
  const sms=users.filter(u=>u.role==="social_media");
  const ams=users.filter(u=>u.role==="account_manager");
  const E={name:"",pkg:"",mb:"",sm:"",am:"",platforms:[],status:"active",start:"",end:"",roas:"",spend:"",notes:"",email:"",password:""};
  const [f,setF]=useState(E);const [err,setErr]=useState("");const [step,setStep]=useState(1);
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const tp=(p)=>setF(prev=>({...prev,platforms:prev.platforms.includes(p)?prev.platforms.filter(x=>x!==p):[...prev.platforms,p]}));
  const sub=()=>{
    if(!f.name.trim()||!f.pkg||!f.mb||!f.platforms.length||!f.start||!f.end){setErr("أكمل الحقول المطلوبة");return;}
    onAdd({...f,id:Date.now(),pkg:+f.pkg,roas:+(f.roas||0),spend:+(f.spend||0),mb:+f.mb,sm:f.sm?+f.sm:null,am:f.am?+f.am:null});
    setF(E);setErr("");setStep(1);onClose();
  };
  const close=()=>{setF(E);setErr("");setStep(1);onClose();};
  return(
    <Mdl open={open} onClose={close} title="➕ إضافة عميل جديد" width={560}>
      {/* Step tabs */}
      <div style={{display:"flex",gap:4,marginBottom:20,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:4}}>
        {[[1,"📋 بيانات أساسية"],[2,"👥 الفريق والتواريخ"],[3,"🔑 بوابة العميل"]].map(([n,l])=>(
          <button key={n} onClick={()=>setStep(n)} style={{flex:1,padding:"8px 6px",borderRadius:8,fontFamily:"Cairo",fontSize:12,fontWeight:step===n?700:400,cursor:"pointer",border:"none",background:step===n?C.grad:"transparent",color:step===n?"white":C.textS}}>
            {l}
          </button>
        ))}
      </div>

      {step===1&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="اسم العميل" value={f.name} onChange={v=>s("name",v)} req mb={0} placeholder="متجر النور"/>
          <Inp label="الباقة الشهرية (SAR)" value={f.pkg} onChange={v=>s("pkg",v)} type="number" req mb={0} placeholder="3000"/>
        </div>
        <div style={{margin:"14px 0 8px",fontSize:12,fontWeight:600,color:C.textS}}>المنصات *</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
          {PLATS.map(p=>{const sel=f.platforms.includes(p);return(
            <button key={p} onClick={()=>tp(p)} style={{padding:"7px 16px",borderRadius:20,fontFamily:"Cairo",fontSize:12,fontWeight:600,cursor:"pointer",border:"1px solid",background:sel?`${PC[p]||C.purple}22`:"rgba(255,255,255,0.03)",color:sel?PC[p]||C.purple:C.textS,borderColor:sel?`${PC[p]||C.purple}55`:C.border}}>{p}</button>
          );})}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Sel label="الحالة" value={f.status} onChange={v=>s("status",v)} opts={[{v:"active",l:"نشط"},{v:"hold",l:"موقوف"},{v:"cancelled",l:"ملغي"}]} mb={0}/>
          <Inp label="ROAS الحالي (اختياري)" value={f.roas} onChange={v=>s("roas",v)} type="number" placeholder="3.5" mb={0}/>
        </div>
        <div style={{marginTop:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:C.textS,marginBottom:6}}>ملاحظات</label><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} placeholder="أي ملاحظات عن العميل..." style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13,outline:"none",fontFamily:"Cairo",boxSizing:"border-box",resize:"vertical",minHeight:60,direction:"rtl"}}/></div>
        <Btn onClick={()=>setStep(2)} style={{width:"100%",padding:12,marginTop:14}}>التالي →</Btn>
      </>}

      {step===2&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <Sel label="Media Buyer" value={f.mb} onChange={v=>s("mb",v)} opts={mbs.map(u=>({v:u.id,l:u.name}))} req/>
          <Sel label="Social Media" value={f.sm} onChange={v=>s("sm",v)} opts={sms.map(u=>({v:u.id,l:u.name}))} ph="اختياري"/>
          <Sel label="Account Manager" value={f.am} onChange={v=>s("am",v)} opts={ams.map(u=>({v:u.id,l:u.name}))} ph="اختياري"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="تاريخ البداية" value={f.start} onChange={v=>s("start",v)} type="date" req mb={0}/>
          <Inp label="تاريخ الانتهاء" value={f.end} onChange={v=>s("end",v)} type="date" req mb={0}/>
        </div>
        <div style={{marginTop:14}}><Inp label="إجمالي الإنفاق (SAR)" value={f.spend} onChange={v=>s("spend",v)} type="number" placeholder="10000"/></div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setStep(1)} style={{padding:"12px 20px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,color:C.textS,fontSize:14,fontFamily:"Cairo",cursor:"pointer"}}>← رجوع</button>
          <Btn onClick={()=>setStep(3)} style={{flex:1,padding:12}}>التالي →</Btn>
        </div>
      </>}

      {step===3&&<>
        <div style={{background:"rgba(123,111,224,0.08)",border:`1px solid ${C.purple}33`,borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:18}}>🔑</span>
          <div style={{color:C.textS,fontSize:12,lineHeight:1.6}}>بيانات دخول بوابة العميل — العميل هيستخدمها يدخل يشوف نتائجه وتقاريره. لو مش عايز تفعّلها دلوقتي اتركها فاضية.</div>
        </div>
        <Inp label="البريد الإلكتروني للعميل" value={f.email} onChange={v=>s("email",v)} type="email" placeholder="client@email.com"/>
        <Inp label="كلمة المرور" value={f.password} onChange={v=>s("password",v)} placeholder="كلمة مرور قوية"/>
        {f.email&&f.password&&(
          <div style={{background:`${C.green}12`,border:`1px solid ${C.green}33`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",gap:8,alignItems:"center"}}>
            <span style={{color:C.green,fontSize:13}}>✓</span>
            <div style={{color:C.green,fontSize:12}}>العميل هيقدر يدخل بـ: <strong style={{direction:"ltr",display:"inline-block"}}>{f.email}</strong></div>
          </div>
        )}
        {err&&<div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:14,color:"#FCA5A5",fontSize:12}}>⚠️ {err}</div>}
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setStep(2)} style={{padding:"12px 20px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,color:C.textS,fontSize:14,fontFamily:"Cairo",cursor:"pointer"}}>← رجوع</button>
          <Btn onClick={sub} style={{flex:1,padding:13}}>✓ إضافة العميل</Btn>
        </div>
      </>}
    </Mdl>
  );
}

function ClientDetail({c,users,onBack,notes,setNotes,satisfaction,campaigns,setClients}){
  const [tab,setTab]=useState("overview");
  const [credOpen,setCredOpen]=useState(false);
  const [credF,setCredF]=useState({email:c?.email||"",password:c?.password||""});
  const [showPass,setShowPass]=useState(false);
  const [copied,setCopied]=useState("");

  // safe guards — if c is null, show error
  if(!c) return(
    <div style={{padding:40,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:12}}>⚠️</div>
      <div style={{color:C.red,fontSize:14}}>حدث خطأ في تحميل بيانات العميل</div>
      <button onClick={onBack} style={{marginTop:16,padding:"8px 20px",background:`${C.purple}22`,border:`1px solid ${C.purple}44`,borderRadius:10,color:C.purple,fontFamily:"Cairo",cursor:"pointer"}}>← رجوع</button>
    </div>
  );

  const mb=users?.find(u=>u.id===c.mb)||null;
  const sm=users?.find(u=>u.id===c.sm)||null;
  const am=users?.find(u=>u.id===c.am)||null;
  const d=c.end?dl(c.end):0;
  const myNotes=(notes||[]).filter(n=>n.clientId===c.id);
  const mySat=(satisfaction||[]).filter(s=>s.clientId===c.id);
  const myCams=(campaigns||[]).filter(x=>x.clientId===c.id);
  const avgSat=mySat.length?(mySat.reduce((s,x)=>s+x.score,0)/mySat.length).toFixed(1):null;

  const saveCreds=()=>{
    setClients(p=>p.map(x=>x.id===c.id?{...x,email:credF.email,password:credF.password}:x));
    setCredOpen(false);
  };
  const copyText=(text,key)=>{navigator.clipboard?.writeText(text);setCopied(key);setTimeout(()=>setCopied(""),2000);};

  const TABS=[["overview","عام"],["campaigns","الحملات"],["notes","السجل"],["portal","🔑 البوابة"],["renewal","الاشتراك"]];

  return(
    <div>
      {/* Credentials Modal */}
      <Mdl open={credOpen} onClose={()=>setCredOpen(false)} title="🔑 بيانات دخول بوابة العميل" width={440}>
        <div style={{background:"rgba(123,111,224,0.08)",border:`1px solid ${C.purple}33`,borderRadius:12,padding:"12px 16px",marginBottom:16,fontSize:12,color:C.textS,lineHeight:1.6}}>
          العميل هيستخدم هذه البيانات للدخول على بوابته الخاصة ويشوف نتائجه وتقاريره فقط.
        </div>
        <Inp label="البريد الإلكتروني" value={credF.email} onChange={v=>setCredF(p=>({...p,email:v}))} type="email" placeholder="client@email.com"/>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:C.textS,marginBottom:6}}>كلمة المرور</label>
          <div style={{position:"relative"}}>
            <input type={showPass?"text":"password"} value={credF.password} onChange={e=>setCredF(p=>({...p,password:e.target.value}))} placeholder="اكتب كلمة مرور"
              style={{width:"100%",padding:"11px 44px 11px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13,outline:"none",fontFamily:"Cairo",boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor=C.pink} onBlur={e=>e.target.style.borderColor=C.border}/>
            <button onClick={()=>setShowPass(!showPass)} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.textM,fontSize:14}}>{showPass?"🙈":"👁"}</button>
          </div>
        </div>
        {credF.email&&credF.password&&<div style={{background:`${C.green}12`,border:`1px solid ${C.green}33`,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
          <div style={{color:C.green,fontSize:12,fontWeight:600,marginBottom:4}}>✓ جاهز للإرسال للعميل</div>
          <div style={{color:C.textS,fontSize:11,direction:"ltr",textAlign:"left"}}>{credF.email} · {credF.password}</div>
        </div>}
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={saveCreds} style={{flex:1,padding:13}}>✓ حفظ</Btn>
          <button onClick={()=>setCredOpen(false)} style={{padding:"12px 20px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,color:C.textS,fontSize:14,fontFamily:"Cairo",cursor:"pointer"}}>إلغاء</button>
        </div>
      </Mdl>

      <div style={{padding:"24px 32px 0"}}>
        <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:C.textS,cursor:"pointer",fontFamily:"Cairo",fontSize:13,marginBottom:14}}>← العملاء</button>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:50,height:50,borderRadius:13,background:`${C.purple}22`,border:`1.5px solid ${C.purple}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🏪</div>
            <div>
              <h1 style={{color:C.text,fontSize:21,fontWeight:800,margin:0}}>{c.name}</h1>
              <div style={{display:"flex",gap:8,marginTop:5,alignItems:"center",flexWrap:"wrap"}}>
                <Bdg label={SL[c.status]||"—"} color={SC[c.status]||C.textM}/>
                {(c.platforms||[]).map(p=><PT key={p} name={p}/>)}
                {avgSat&&<span style={{color:"#FFD700",fontSize:12,fontWeight:600}}>★ {avgSat}</span>}
                {c.email&&<Bdg label="بوابة مفعّلة 🔑" color={C.green} dot={false}/>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>{setCredF({email:c.email||"",password:c.password||""});setCredOpen(true);}} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:`${C.purple}18`,border:`1px solid ${C.purple}33`,borderRadius:10,color:C.purple,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Cairo"}}>
              🔑 {c.email?"تعديل بيانات الدخول":"إضافة بيانات دخول"}
            </button>
            <div style={{color:C.text,fontSize:22,fontWeight:800}}>{c.roas||"—"} <span style={{fontSize:13,color:C.textS}}>ROAS</span></div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
          {[
            ["الإنفاق",`${(c.spend||0).toLocaleString()} SAR`,C.orange],
            ["الباقة",`${(c.pkg||0).toLocaleString()} SAR`,C.green],
            ["ROAS",c.roas||"—",C.purple],
            ["تنتهي",d>0?`${d} يوم`:"انتهت",d<=7?C.red:d<=14?C.orange:C.text]
          ].map(([l,v,co],i)=>(
            <Card key={i} s={{padding:14,textAlign:"center"}}>
              <div style={{color:co,fontSize:20,fontWeight:800,marginBottom:3}}>{v}</div>
              <div style={{color:C.textS,fontSize:11}}>{l}</div>
            </Card>
          ))}
        </div>

        <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
          {TABS.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 16px",background:"none",border:"none",borderBottom:tab===t?`2px solid ${C.pink}`:"2px solid transparent",color:tab===t?C.pink:C.textS,fontFamily:"Cairo",fontSize:12.5,fontWeight:tab===t?600:400,cursor:"pointer",whiteSpace:"nowrap"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"22px 32px"}}>
        {tab==="overview"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card>
              <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:14}}>معلومات العميل</div>
              {[
                ["الباقة",`${(c.pkg||0).toLocaleString()} SAR/شهر`],
                ["المنصات",(c.platforms||[]).join(" · ")||"—"],
                ["Media Buyer",mb?.name||"—"],
                ["Social Media",sm?.name||"—"],
                ["Account Manager",am?.name||"—"],
                ["تاريخ البداية",c.start?fmtDate(c.start):"—"],
                ["تاريخ الانتهاء",c.end?fmtDate(c.end):"—"],
              ].map(([l,v],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{color:C.textS,fontSize:12}}>{l}</span>
                  <span style={{color:C.text,fontSize:12,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:14}}>ملاحظات وتقييم</div>
              {c.notes&&<div style={{padding:"10px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10,color:C.textS,fontSize:12,lineHeight:1.6,marginBottom:12}}>{c.notes}</div>}
              {mySat.length>0&&(
                <div style={{display:"flex",gap:2,alignItems:"center",marginBottom:8}}>
                  {Array(Math.round(mySat[mySat.length-1]?.score||0)).fill(null).map((_,i)=><span key={i} style={{color:"#FFD700",fontSize:18}}>★</span>)}
                  <span style={{color:C.textS,fontSize:12,marginRight:6}}>{mySat[mySat.length-1]?.comment}</span>
                </div>
              )}
              <div style={{color:C.textM,fontSize:11,marginTop:8}}>{myNotes.length} ملاحظة في السجل</div>
              {!c.notes&&mySat.length===0&&myNotes.length===0&&<div style={{color:C.textM,fontSize:12,textAlign:"center",padding:"20px 0"}}>لا توجد ملاحظات بعد</div>}
            </Card>
          </div>
        )}

        {tab==="campaigns"&&(
          <div>
            {myCams.length===0
              ? <Card s={{textAlign:"center",padding:"50px"}}><div style={{fontSize:32,marginBottom:10}}>📊</div><div style={{color:C.textS,fontSize:14}}>لا توجد حملات مسجلة لهذا العميل</div></Card>
              : myCams.map(camp=>(
                <Card key={camp.id} s={{marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}><PT name={camp.platform}/><span style={{color:C.textM,fontSize:12}}>{fmtDate(camp.week)}</span></div>
                    <span style={{color:(camp.roas||0)>=3?C.green:C.orange,fontSize:18,fontWeight:800}}>ROAS {camp.roas||"—"}</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
                    {[
                      ["Spend",`${(camp.spend||0).toLocaleString()} SAR`,C.orange],
                      ["Clicks",(camp.clicks||0).toLocaleString(),C.blue],
                      ["Impressions",((camp.impressions||0)/1000).toFixed(0)+"k",C.purple],
                      ["CTR",`${camp.ctr||0}%`,C.teal],
                      ["Purchases",camp.purchases||0,C.green],
                      ["P.Value",`${((camp.purchaseValue||0)/1000).toFixed(0)}k SAR`,C.pink]
                    ].map(([l,v,co])=>(
                      <div key={l} style={{textAlign:"center",padding:"8px 4px",background:"rgba(255,255,255,0.03)",borderRadius:8}}>
                        <div style={{color:co,fontSize:13,fontWeight:700,marginBottom:2}}>{v}</div>
                        <div style={{color:C.textM,fontSize:9}}>{l}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {tab==="notes"&&(
          <ClientNotes client={c} notes={notes||[]} setNotes={setNotes} users={users||[]} onBack={()=>setTab("overview")}/>
        )}

        {tab==="portal"&&(
          <div>
            <Card s={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{color:C.text,fontSize:14,fontWeight:700}}>🔑 بيانات بوابة العميل</div>
                <button onClick={()=>{setCredF({email:c.email||"",password:c.password||""});setCredOpen(true);}} style={{padding:"7px 14px",borderRadius:9,background:`${C.purple}18`,border:`1px solid ${C.purple}33`,color:C.purple,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Cairo"}}>✏️ تعديل</button>
              </div>
              {!c.email?(
                <div style={{textAlign:"center",padding:"24px 0"}}>
                  <div style={{fontSize:32,marginBottom:10}}>🔒</div>
                  <div style={{color:C.textS,fontSize:13,marginBottom:12}}>لم يتم تفعيل بوابة العميل بعد</div>
                  <button onClick={()=>{setCredF({email:"",password:""});setCredOpen(true);}} style={{padding:"9px 20px",background:C.grad,border:"none",borderRadius:10,color:"white",fontSize:13,fontWeight:700,fontFamily:"Cairo",cursor:"pointer"}}>+ تفعيل البوابة</button>
                </div>
              ):(
                <div>
                  <div style={{background:`${C.green}10`,border:`1px solid ${C.green}33`,borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/>
                    <span style={{color:C.green,fontSize:13,fontWeight:600}}>البوابة مفعّلة — العميل يستطيع الدخول</span>
                  </div>
                  {[
                    ["📧 البريد الإلكتروني",c.email,"email"],
                    ["🔐 كلمة المرور",c.password,"pass"],
                  ].map(([l,v,key])=>(
                    <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"rgba(255,255,255,0.03)",borderRadius:10,marginBottom:8}}>
                      <div>
                        <div style={{color:C.textM,fontSize:11,marginBottom:3}}>{l}</div>
                        <div style={{color:C.text,fontSize:13,fontWeight:600,direction:"ltr",textAlign:"left"}}>{key==="pass"?"••••••••":v}</div>
                      </div>
                      <button onClick={()=>copyText(v,key)} style={{padding:"5px 12px",borderRadius:8,background:`${C.blue}18`,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"Cairo"}}>
                        {copied===key?"✓ تم":"نسخ"}
                      </button>
                    </div>
                  ))}
                  <div style={{marginTop:12,padding:"10px 14px",background:"rgba(255,255,255,0.03)",borderRadius:10}}>
                    <div style={{color:C.textM,fontSize:11,marginBottom:6}}>رسالة جاهزة للإرسال للعميل:</div>
                    <div style={{color:C.textS,fontSize:12,lineHeight:1.7,direction:"ltr",textAlign:"left"}}>
                      مرحباً، يمكنك الآن الدخول على بوابتك في وميض:<br/>
                      البريد: {c.email}<br/>
                      كلمة المرور: {c.password}
                    </div>
                    <button onClick={()=>copyText(`مرحباً، يمكنك الآن الدخول على بوابتك في وميض:\nالبريد: ${c.email}\nكلمة المرور: ${c.password}`,"msg")} style={{marginTop:8,padding:"6px 14px",borderRadius:8,background:C.grad,border:"none",color:"white",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"Cairo"}}>
                      {copied==="msg"?"✓ تم النسخ":"📋 نسخ الرسالة كاملة"}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {tab==="renewal"&&(
          <Card s={{textAlign:"center",padding:"40px"}}>
            <div style={{fontSize:32,marginBottom:10}}>🔄</div>
            <div style={{color:C.text,fontSize:15,fontWeight:700,marginBottom:8}}>اشتراك {c.name}</div>
            <div style={{color:d<=7?C.red:d<=14?C.orange:C.green,fontSize:28,fontWeight:800,marginBottom:4}}>
              {d>0?`${d} يوم متبقي`:"انتهى الاشتراك"}
            </div>
            <div style={{color:C.textS,fontSize:13}}>ينتهي: {c.end?fmtDate(c.end):"—"}</div>
            {d<=14&&d>0&&<div style={{marginTop:16,display:"inline-block",padding:"8px 20px",background:`${d<=7?C.red:C.orange}18`,border:`1px solid ${d<=7?C.red:C.orange}33`,borderRadius:10,color:d<=7?C.red:C.orange,fontSize:12,fontWeight:600}}>{d<=7?"🚨 تجديد عاجل":"⚠️ قارب على الانتهاء"}</div>}
          </Card>
        )}
      </div>
    </div>
  );
}

function Clients({clients,setClients,users,notes,setNotes,satisfaction,campaigns}){
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [addOpen,setAddOpen]=useState(false);
  const [sel,setSel]=useState(null);

  // sync selected client when clients array changes
  useEffect(()=>{
    if(sel)setSel(clients.find(c=>c.id===sel.id)||null);
  },[clients]);

  const filtered=clients.filter(c=>{
    if(filter!=="all"&&c.status!==filter)return false;
    const mb=users.find(u=>u.id===c.mb);
    if(search&&!c.name?.includes(search)&&!(mb?.name||"").includes(search))return false;
    return true;
  });

  if(sel) return(
    <ClientDetail
      c={sel}
      users={users||[]}
      onBack={()=>setSel(null)}
      notes={notes||[]}
      setNotes={setNotes}
      satisfaction={satisfaction||[]}
      campaigns={campaigns||[]}
      setClients={setClients}
    />
  );

  return(
    <div>
      <AddClientModal open={addOpen} onClose={()=>setAddOpen(false)} onAdd={cl=>setClients(p=>[...p,cl])} users={users}/>
      <TB title="العملاء 👥" sub={`${clients.length} إجمالي · ${clients.filter(c=>c.status==="active").length} نشط · ${clients.filter(c=>c.email).length} لديهم بوابة`}>
        <Btn onClick={()=>setAddOpen(true)}>+ إضافة عميل</Btn>
      </TB>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",flex:1,maxWidth:300}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث بالاسم أو MB..." style={{width:"100%",padding:"10px 16px 10px 36px",background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:13,fontFamily:"Cairo",outline:"none",boxSizing:"border-box"}}/>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.textM}}>🔍</span>
          </div>
          {["all","active","hold","cancelled"].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} style={{padding:"9px 16px",borderRadius:20,fontFamily:"Cairo",fontSize:12,fontWeight:500,cursor:"pointer",border:"1px solid",background:filter===s?`${C.pink}18`:C.bgCard,color:filter===s?C.pink:C.textS,borderColor:filter===s?`${C.pink}44`:C.border}}>
              {s==="all"?"الكل":SL[s]}
            </button>
          ))}
        </div>

        <Card s={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"Cairo"}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${C.border}`}}>
                {["العميل","الحالة","الباقة","المنصات","Media Buyer","ROAS","تنتهي في","البوابة",""].map((h,i)=>(
                  <th key={i} style={{padding:"12px 14px",color:C.textM,fontSize:11,fontWeight:500,textAlign:"right",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={9} style={{padding:"40px",textAlign:"center",color:C.textM,fontSize:13}}>لا توجد نتائج</td></tr>
                : filtered.map(c=>{
                    const d=c.end?dl(c.end):0;
                    const mb=users.find(u=>u.id===c.mb);
                    return(
                      <tr key={c.id} style={{borderBottom:`1px solid ${C.border}`,transition:"background .15s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.bgHover}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"12px 14px"}}><div style={{color:C.text,fontSize:13,fontWeight:600}}>{c.name}</div></td>
                        <td style={{padding:"12px 14px"}}><Bdg label={SL[c.status]||"—"} color={SC[c.status]||C.textM}/></td>
                        <td style={{padding:"12px 14px",color:C.textS,fontSize:13}}>{(c.pkg||0).toLocaleString()} SAR</td>
                        <td style={{padding:"12px 14px"}}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{(c.platforms||[]).map(p=><PT key={p} name={p}/>)}</div></td>
                        <td style={{padding:"12px 14px",color:C.textS,fontSize:12}}>{mb?.name||"—"}</td>
                        <td style={{padding:"12px 14px"}}><span style={{color:(c.roas||0)>=3?C.green:C.orange,fontWeight:700,fontSize:14}}>{c.roas||"—"}</span></td>
                        <td style={{padding:"12px 14px"}}><span style={{color:d<=7?C.red:d<=14?C.orange:C.textS,fontSize:12,fontWeight:600}}>{d>0?`${d} يوم`:"انتهى"}</span></td>
                        <td style={{padding:"12px 14px"}}>{c.email?<Bdg label="✓ مفعّلة" color={C.green}/>:<span style={{color:C.textM,fontSize:11}}>—</span>}</td>
                        <td style={{padding:"12px 14px"}}>
                          <div style={{display:"flex",gap:6}}>
                            <button onClick={()=>setSel(c)} style={{padding:"5px 12px",borderRadius:8,background:`${C.purple}18`,border:`1px solid ${C.purple}33`,color:C.purple,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"Cairo"}}>عرض</button>
                            <button onClick={()=>{
                              const next=["active","hold","cancelled"];
                              const cur=next.indexOf(c.status);
                              const newStatus=next[(cur+1)%3];
                              setClients(p=>p.map(x=>x.id===c.id?{...x,status:newStatus}:x));
                            }} style={{padding:"5px 10px",borderRadius:8,background:`${C.orange}18`,border:`1px solid ${C.orange}33`,color:C.orange,fontSize:11,cursor:"pointer",fontFamily:"Cairo"}} title="تغيير الحالة">⟳</button>
                            <button onClick={()=>{if(window.confirm(`هل تريد حذف "${c.name}"؟`))setClients(p=>p.filter(x=>x.id!==c.id));}} style={{padding:"5px 10px",borderRadius:8,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",color:C.red,fontSize:11,cursor:"pointer",fontFamily:"Cairo"}}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ═══ CAPACITY ════════════════════════════════════════════════════════════════
function Capacity({clients,users}){
  const mbs=users.filter(u=>u.role==="media_buyer");const MAX={media_buyer:10,social_media:15,account_manager:12};
  const avgP=mbs.length?Math.round(mbs.reduce((s,m)=>s+pct(clients.filter(c=>c.mb===m.id&&c.status==="active").length,MAX.media_buyer),0)/mbs.length):0;
  return(
    <div>
      <TB title="Capacity الفريق ⚡" sub="توزيع العملاء وحمل كل عضو"/>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
          <StC label="Media Buyers" value={mbs.length} icon="📊" color={C.purple}/>
          <StC label="متوسط الـ Capacity" value={`${avgP}%`} icon="⚡" color={C.orange}/>
          <StC label="متاح لعملاء جدد" value={mbs.filter(m=>pct(clients.filter(c=>c.mb===m.id&&c.status==="active").length,10)<90).length} icon="✅" color={C.green}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
          {mbs.map(m=>{const ac=clients.filter(c=>c.mb===m.id&&c.status==="active").length;const hold=clients.filter(c=>c.mb===m.id&&c.status==="hold").length;const p=pct(ac,10);const cp=capC(p);const myC=clients.filter(c=>c.mb===m.id&&c.status==="active");
            return(<Card key={m.id}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><Av text={m.avatar} color={RC.media_buyer} size={44}/><div style={{flex:1}}><div style={{color:C.text,fontSize:14,fontWeight:700}}>{m.name}</div><Bdg label="Media Buyer" color={RC.media_buyer}/></div><div style={{textAlign:"center"}}><div style={{color:cp,fontSize:22,fontWeight:800,lineHeight:1}}>{p}%</div><div style={{color:C.textM,fontSize:10}}>ممتلئ</div></div></div>
              <div style={{height:10,background:"rgba(255,255,255,0.07)",borderRadius:5,overflow:"hidden",marginBottom:12}}><div style={{height:"100%",width:`${p}%`,background:cp,borderRadius:5}}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>{[["نشط",ac,C.green],["هولد",hold,C.orange],["الحد",10,C.textS]].map(([l,v,co])=><div key={l} style={{textAlign:"center",padding:"8px 4px",background:"rgba(255,255,255,0.03)",borderRadius:8}}><div style={{color:co,fontSize:18,fontWeight:800}}>{v}</div><div style={{color:C.textM,fontSize:10}}>{l}</div></div>)}</div>
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}><div style={{color:C.textM,fontSize:11,marginBottom:6}}>العملاء الحاليين</div>{myC.slice(0,3).map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}><span style={{color:C.textS,fontSize:11}}>{c.name}</span><span style={{color:c.roas>=3?C.green:C.orange,fontSize:11,fontWeight:700}}>ROAS {c.roas}</span></div>)}{myC.length===0&&<div style={{color:C.textM,fontSize:11}}>لا يوجد عملاء</div>}</div>
            </Card>);
          })}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[["SOCIAL MEDIA",users.filter(u=>u.role==="social_media"),"social_media"],["ACCOUNT MANAGER",users.filter(u=>u.role==="account_manager"),"account_manager"]].map(([title,list,role])=>(
            <div key={role}>
              <div style={{color:C.textS,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase",letterSpacing:".06em"}}>{title}</div>
              {list.map(m=>{const ac=clients.filter(c=>c.sm===m.id||c.am===m.id).length;const p=pct(ac,MAX[role]);return(
                <Card key={m.id} s={{marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:12}}><Av text={m.avatar} color={RC[m.role]} size={40}/><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:C.text,fontSize:13,fontWeight:600}}>{m.name}</span><span style={{color:capC(p),fontSize:13,fontWeight:700}}>{ac}/{MAX[role]}</span></div><div style={{height:6,background:"rgba(255,255,255,0.07)",borderRadius:3}}><div style={{height:"100%",width:`${p}%`,background:capC(p),borderRadius:3}}/></div></div></div></Card>
              );})}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ FOLLOW-UP ════════════════════════════════════════════════════════════════
function FollowUp({clients,users,followups,setFollowups,addNotif,currentUser}){
  const [selClient,setSelClient]=useState(null);
  const [filterMb,setFilterMb]=useState("all");
  const activeClients=clients.filter(c=>c.status==="active");
  const mbs=users.filter(u=>u.role==="media_buyer");
  const getLatest=(cid)=>followups.filter(f=>f.clientId===cid).sort((a,b)=>b.date.localeCompare(a.date))[0];
  const getDays=(cid)=>{const f=getLatest(cid);if(!f)return 999;return Math.floor((new Date()-new Date(f.date))/86400000);};
  const lc=(d)=>d===0?C.green:d===1?C.orange:C.red;
  const ll=(d)=>d===0?"اليوم ✓":d===1?"أمس":d===999?"لم يبدأ":`منذ ${d} أيام`;
  const filtered=activeClients.filter(c=>filterMb==="all"||c.mb===+filterMb);
  if(selClient)return <ClientFU client={selClient} users={users} followups={followups} setFollowups={setFollowups} addNotif={addNotif} currentUser={currentUser} onBack={()=>setSelClient(null)}/>;
  return(
    <div>
      <TB title="المتابعات اليومية 📌" sub="فولو أب يومي لكل عميل">
        <select value={filterMb} onChange={e=>setFilterMb(e.target.value)} style={{padding:"9px 14px",background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:12,fontFamily:"Cairo",outline:"none"}}>
          <option value="all">كل الفريق</option>
          {mbs.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </TB>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
          <StC label="متابَعين اليوم" value={filtered.filter(c=>getDays(c.id)===0).length} icon="✅" color={C.green}/>
          <StC label="أمس (تأخر يوم)" value={filtered.filter(c=>getDays(c.id)===1).length} icon="⏰" color={C.orange}/>
          <StC label="متأخر أكثر من يوم" value={filtered.filter(c=>getDays(c.id)>1).length} icon="🚨" color={C.red}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
          {filtered.map(c=>{
            const mb=users.find(u=>u.id===c.mb);const sm=users.find(u=>u.id===c.sm);const days=getDays(c.id);const latest=getLatest(c.id);
            const todayFUs=followups.filter(f=>f.clientId===c.id&&f.date===todayStr());const monthFUs=followups.filter(f=>f.clientId===c.id);
            return(<Card key={c.id} onClick={()=>setSelClient(c)}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:42,height:42,borderRadius:11,background:`${C.purple}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏪</div>
                  <div><div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:4}}>{c.name}</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{c.platforms.slice(0,3).map(p=><PT key={p} name={p}/>)}</div></div>
                </div>
                <div style={{textAlign:"center",background:`${lc(days)}15`,border:`1px solid ${lc(days)}33`,borderRadius:10,padding:"6px 10px"}}><div style={{color:lc(days),fontSize:12,fontWeight:800}}>{ll(days)}</div></div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                {mb&&<div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"4px 8px"}}><Av text={mb.avatar} color={RC.media_buyer} size={20}/><span style={{color:C.textS,fontSize:10}}>{mb.name}</span></div>}
                {sm&&<div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"4px 8px"}}><Av text={sm.avatar} color={RC.social_media} size={20}/><span style={{color:C.textS,fontSize:10}}>{sm.name}</span></div>}
              </div>
              {latest&&<div style={{background:"rgba(255,255,255,0.03)",borderRadius:9,padding:"8px 10px",marginBottom:8}}><div style={{color:C.textS,fontSize:11,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",lineHeight:1.4}}>{latest.text}</div></div>}
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:todayFUs.length>0?C.green:C.textM,fontSize:11}}>{todayFUs.length} اليوم · {monthFUs.length} الشهر</span><span style={{color:C.purple,fontSize:12,fontWeight:600}}>فتح ←</span></div>
            </Card>);
          })}
        </div>
      </div>
    </div>
  );
}
function ClientFU({client,users,followups,setFollowups,addNotif,currentUser,onBack}){
  const [addOpen,setAddOpen]=useState(false);const [text,setText]=useState("");const [images,setImages]=useState([]);const [err,setErr]=useState("");const fileRef=useRef();
  const mb=users.find(u=>u.id===client.mb);const sm=users.find(u=>u.id===client.sm);const am=users.find(u=>u.id===client.am);
  const now=new Date();const year=now.getFullYear(),month=now.getMonth();const daysInMonth=new Date(year,month+1,0).getDate();
  const days=Array.from({length:daysInMonth},(_,i)=>{const d=new Date(year,month,i+1);const ds=d.toISOString().split("T")[0];const fus=followups.filter(f=>f.clientId===client.id&&f.date===ds);return{day:i+1,date:ds,fus};});
  const clientFUs=followups.filter(f=>f.clientId===client.id).sort((a,b)=>b.date.localeCompare(a.date));
  const handleImgs=(e)=>{Array.from(e.target.files).forEach(file=>{const r=new FileReader();r.onload=ev=>setImages(prev=>[...prev,{name:file.name,data:ev.target.result}]);r.readAsDataURL(file);});};
  const submit=()=>{
    if(!text.trim()&&images.length===0){setErr("أكتب ملاحظة أو أضف صورة");return;}
    const nf={id:Date.now(),clientId:client.id,userId:currentUser.id,date:todayStr(),text:text.trim(),images,createdAt:new Date().toISOString()};
    setFollowups(p=>[...p,nf]);
    const poster=users.find(u=>u.id===currentUser.id);
    addNotif({type:"followup",title:"فولو أب جديد",body:`${poster?.name} أضاف فولو أب لـ ${client.name}${images.length>0?" مع صور":""}`,userId:am?.id||1});
    if(images.length>0)addNotif({type:"image",title:"📸 صورة جديدة",body:`${poster?.name} أضاف صورة — ${client.name}`,userId:1});
    setText("");setImages([]);setErr("");setAddOpen(false);
  };
  return(
    <div>
      <div style={{padding:"24px 32px 0"}}>
        <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:C.textS,cursor:"pointer",fontFamily:"Cairo",fontSize:13,marginBottom:14}}>← المتابعات</button>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:48,height:48,borderRadius:12,background:`${C.teal}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📌</div>
            <div><h1 style={{color:C.text,fontSize:19,fontWeight:800,margin:0}}>متابعات — {client.name}</h1><div style={{display:"flex",gap:8,marginTop:5}}>{mb&&<Bdg label={mb.name} color={RC.media_buyer}/>}{sm&&<Bdg label={sm.name} color={RC.social_media}/>}</div></div>
          </div>
          <Btn onClick={()=>setAddOpen(true)}>+ إضافة فولو أب</Btn>
        </div>
      </div>
      <Mdl open={addOpen} onClose={()=>{setAddOpen(false);setText("");setImages([]);setErr("")}} title={`📌 فولو أب — ${client.name}`} width={500}>
        <div style={{marginBottom:12,padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10,display:"flex",alignItems:"center",gap:8}}><Av text={currentUser.avatar} color={RC[currentUser.role]} size={28}/><div><div style={{color:C.text,fontSize:12,fontWeight:600}}>{currentUser.name}</div><div style={{color:C.textM,fontSize:10}}>{todayStr()}</div></div></div>
        <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:C.textS,marginBottom:6}}>الملاحظة</label><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="اكتب تحديث اليوم..." style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13,outline:"none",fontFamily:"Cairo",boxSizing:"border-box",resize:"vertical",minHeight:90,direction:"rtl"}}/></div>
        <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:C.textS,marginBottom:6}}>صور (اختياري)</label>
          <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${C.border}`,borderRadius:12,padding:"16px",textAlign:"center",cursor:"pointer"}}><div style={{fontSize:20,marginBottom:4}}>📎</div><div style={{color:C.textS,fontSize:12}}>اضغط لإضافة صور</div></div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImgs} style={{display:"none"}}/>
          {images.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>{images.map((img,i)=><div key={i} style={{position:"relative"}}><img src={img.data} style={{width:70,height:70,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`}} alt=""/><button onClick={()=>setImages(p=>p.filter((_,j)=>j!==i))} style={{position:"absolute",top:-5,right:-5,background:C.red,border:"none",borderRadius:"50%",width:16,height:16,color:"white",fontSize:9,cursor:"pointer"}}>✕</button></div>)}</div>}
        </div>
        {err&&<div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:14,color:"#FCA5A5",fontSize:12}}>⚠️ {err}</div>}
        <div style={{display:"flex",gap:10}}><Btn onClick={submit} style={{flex:1,padding:13}}>✓ حفظ</Btn><button onClick={()=>{setAddOpen(false);setText("");setImages([]);setErr("")}} style={{padding:"12px 20px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,color:C.textS,fontSize:14,fontFamily:"Cairo",cursor:"pointer"}}>إلغاء</button></div>
      </Mdl>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:20}}>
          <div>
            <div style={{color:C.textS,fontSize:11,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:".05em"}}>تقويم الشهر</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
              {["ح","ن","ث","ر","خ","ج","س"].map(d=><div key={d} style={{textAlign:"center",color:C.textM,fontSize:9,padding:"3px 0"}}>{d}</div>)}
              {Array(new Date(year,month,1).getDay()).fill(null).map((_,i)=><div key={"e"+i}/>)}
              {days.map(({day,date,fus})=>{const isT=date===todayStr();const has=fus.length>0;const past=new Date(date)<new Date()&&!isT;
                return(<div key={day} style={{aspectRatio:"1",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:600,background:isT?C.pink:has?`${C.green}22`:"rgba(255,255,255,0.03)",color:isT?"white":has?C.green:past&&!has?C.red:C.textM,border:`1px solid ${isT?C.pink:has?`${C.green}44`:past&&!has?`${C.red}22`:"transparent"}`}}>{day}</div>);
              })}
            </div>
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:3}}>{[[C.green,"تم"],[C.red,"لم يتم"],[C.pink,"اليوم"]].map(([c,l])=><div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:c}}/><span style={{color:C.textM,fontSize:10}}>{l}</span></div>)}</div>
          </div>
          <div>
            <div style={{color:C.textS,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase",letterSpacing:".05em"}}>سجل الفولو أب ({clientFUs.length})</div>
            {clientFUs.length===0&&<Card s={{textAlign:"center",padding:"40px"}}><div style={{fontSize:28,marginBottom:8}}>📝</div><div style={{color:C.textS,fontSize:13}}>لا يوجد فولو أب بعد</div></Card>}
            {clientFUs.map(fu=>{const poster=users.find(u=>u.id===fu.userId);return(
              <Card key={fu.id} s={{marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><Av text={poster?.avatar||"؟"} color={RC[poster?.role]||C.purple} size={30}/><div style={{flex:1}}><div style={{color:C.text,fontSize:12,fontWeight:600}}>{poster?.name}</div><div style={{color:C.textM,fontSize:10}}>{fmtDate(fu.date)}</div></div><Bdg label={RL[poster?.role]||"فريق"} color={RC[poster?.role]||C.purple}/></div>
                {fu.text&&<div style={{color:C.textS,fontSize:12,lineHeight:1.6,marginBottom:fu.images?.length>0?10:0}}>{fu.text}</div>}
                {fu.images?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>{fu.images.map((img,i)=><img key={i} src={img.data} style={{width:80,height:80,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`,cursor:"pointer"}} onClick={()=>window.open(img.data,"_blank")} alt=""/>)}</div>}
              </Card>);
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ CREATIVE ═════════════════════════════════════════════════════════════════
const FORUMS=["From-Scratch","Template","Edit","Re-use"];
const CSTATUS={pending:"لسه ماتبدأش",in_progress:"جاري",review:"مراجعة",done:"تم",late:"متأخر"};
const CSTATUS_C={pending:C.textS,in_progress:C.blue,review:C.orange,done:C.green,late:C.red};
const dlDate=(taskDate)=>{if(!taskDate)return "";const d=new Date(taskDate);d.setDate(d.getDate()+4);return d.toISOString().split("T")[0];};

function AddCreativeModal({open,onClose,onAdd,onSave,edit,clients,users}){
  const designers=users.filter(u=>u.role==="designer");
  const E={agency:"",department:"",strategyLink:"",clientId:"",clientName:"",websiteLink:"",taskDate:todayStr(),notes:"",deadLine:"",designerId:"",designerName:"",forum:"From-Scratch",noOfSizes:"",size:"",status:"pending",uploadFolder:"",uploadDate:"",done:false,directorApproved:false,timeNote:""};
  const [f,setF]=useState(edit||E);const [err,setErr]=useState("");
  useEffect(()=>{setF(edit?{...E,...edit}:E)},[edit,open]);
  const s=(k,v)=>setF(p=>{const n={...p,[k]:v};if(k==="taskDate"&&!edit)n.deadLine=dlDate(v);return n;});
  const sub=()=>{
    if(!f.agency.trim()||!f.taskDate){setErr("أكمل الحقول المطلوبة (الأجنسي + تاريخ التاسك)");return;}
    const payload={...f,deadLine:f.deadLine||dlDate(f.taskDate),clientId:f.clientId?+f.clientId:null,designerId:f.designerId?+f.designerId:null};
    if(edit)onSave({...payload,id:edit.id});else onAdd({...payload,id:Date.now()});
    setErr("");onClose();
  };
  return(
    <Mdl open={open} onClose={onClose} title={edit?"✏️ تعديل تاسك كريتيف":"🎨 إضافة تاسك كريتيف"} width={620}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Inp label="الأجنسي / Agency" value={f.agency} onChange={v=>s("agency",v)} req mb={0} placeholder="Ataa"/>
        <Inp label="الديبارتمنت" value={f.department} onChange={v=>s("department",v)} mb={0} placeholder="Social"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        <Sel label="العميل" value={f.clientId} onChange={v=>{s("clientId",v);const c=clients.find(x=>x.id===+v);if(c)s("clientName",c.name);}} opts={clients.map(c=>({v:c.id,l:c.name}))} ph="اختياري" mb={0}/>
        <Inp label="اسم العميل (لو مش موجود بالنظام)" value={f.clientName} onChange={v=>s("clientName",v)} mb={0}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        <Inp label="Strategy Link" value={f.strategyLink} onChange={v=>s("strategyLink",v)} mb={0} placeholder="https://..."/>
        <Inp label="Website Link" value={f.websiteLink} onChange={v=>s("websiteLink",v)} mb={0} placeholder="https://..."/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        <Inp label="تاريخ التاسك" value={f.taskDate} onChange={v=>s("taskDate",v)} type="date" req mb={0}/>
        <div>
          <Inp label="الديدلاين (تلقائي: +4 أيام)" value={f.deadLine} onChange={v=>s("deadLine",v)} type="date" mb={0}/>
        </div>
      </div>
      <div style={{marginTop:12}}>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:C.textS,marginBottom:6}}>Notes / Data</label>
        <textarea value={f.notes} onChange={e=>s("notes",e.target.value)} style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13,outline:"none",fontFamily:"Cairo",boxSizing:"border-box",resize:"vertical",minHeight:60,direction:"rtl"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        <Sel label="المصمم" value={f.designerId} onChange={v=>{s("designerId",v);const d=designers.find(x=>x.id===+v);if(d)s("designerName",d.name);}} opts={designers.map(d=>({v:d.id,l:d.name}))} ph="اختر مصمم" mb={0}/>
        <Sel label="Forum" value={f.forum} onChange={v=>s("forum",v)} opts={FORUMS.map(x=>({v:x,l:x}))} mb={0}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        <Inp label="No of Sizes" value={f.noOfSizes} onChange={v=>s("noOfSizes",v)} mb={0} placeholder="2 Platforms"/>
        <Inp label="Size" value={f.size} onChange={v=>s("size",v)} mb={0} placeholder="Snap+Insta"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        <Sel label="الحالة" value={f.status} onChange={v=>s("status",v)} opts={Object.entries(CSTATUS).map(([v,l])=>({v,l}))} mb={0}/>
        <Inp label="Upload Folder" value={f.uploadFolder} onChange={v=>s("uploadFolder",v)} mb={0} placeholder="رابط الفولدر"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        <Inp label="Upload Date" value={f.uploadDate} onChange={v=>s("uploadDate",v)} type="date" mb={0}/>
        <Inp label="Time" value={f.timeNote} onChange={v=>s("timeNote",v)} mb={0} placeholder="Same"/>
      </div>
      <div style={{display:"flex",gap:20,marginTop:16}}>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><input type="checkbox" checked={f.done} onChange={e=>s("done",e.target.checked)}/><span style={{color:C.textS,fontSize:12}}>Done</span></label>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><input type="checkbox" checked={f.directorApproved} onChange={e=>s("directorApproved",e.target.checked)}/><span style={{color:C.textS,fontSize:12}}>Director Approved</span></label>
      </div>
      {err&&<div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:10,padding:"10px 14px",marginTop:14,color:"#FCA5A5",fontSize:12}}>⚠️ {err}</div>}
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <Btn onClick={sub} style={{flex:1,padding:13}}>✓ حفظ</Btn>
        <button onClick={onClose} style={{padding:"12px 20px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,color:C.textS,fontSize:14,fontFamily:"Cairo",cursor:"pointer"}}>إلغاء</button>
      </div>
    </Mdl>
  );
}

function CreativeTasks({tasks,setTasks,clients,users,currentUser}){
  const [addOpen,setAddOpen]=useState(false);const [edit,setEdit]=useState(null);
  const [filter,setFilter]=useState("all");const [filterDesigner,setFilterDesigner]=useState("all");
  const designers=users.filter(u=>u.role==="designer");
  const isLate=(t)=>!t.done&&t.deadLine&&new Date(t.deadLine)<new Date();
  const filtered=tasks.filter(t=>{
    if(filter==="late"&&!isLate(t))return false;
    if(filter!=="all"&&filter!=="late"&&t.status!==filter)return false;
    if(filterDesigner!=="all"&&t.designerId!==+filterDesigner)return false;
    return true;
  });
  const lateCount=tasks.filter(isLate).length;
  return(
    <div>
      <AddCreativeModal open={addOpen||!!edit} onClose={()=>{setAddOpen(false);setEdit(null)}}
        onAdd={t=>setTasks(p=>[...p,t])} onSave={t=>setTasks(p=>p.map(x=>x.id===t.id?{...x,...t}:x))}
        edit={edit} clients={clients} users={users}/>
      <TB title="الكريتيف 🎨" sub={`${tasks.length} تاسك · ${lateCount} متأخر · متزامن مع Google Sheet`}>
        <Btn onClick={()=>setAddOpen(true)}>+ تاسك جديد</Btn>
      </TB>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
          <StC label="إجمالي التاسكات" value={tasks.length} icon="🎨" color={C.purple}/>
          <StC label="جاري" value={tasks.filter(t=>t.status==="in_progress").length} icon="🔄" color={C.blue}/>
          <StC label="تم" value={tasks.filter(t=>t.done).length} icon="✅" color={C.green}/>
          <StC label="متأخر (بعد 4 أيام)" value={lateCount} icon="🚨" color={C.red}/>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {["all","pending","in_progress","review","done","late"].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} style={{padding:"8px 14px",borderRadius:20,fontFamily:"Cairo",fontSize:12,cursor:"pointer",border:"1px solid",background:filter===s?`${C.pink}18`:C.bgCard,color:filter===s?C.pink:C.textS,borderColor:filter===s?`${C.pink}44`:C.border}}>
              {s==="all"?"الكل":s==="late"?"⚠️ متأخر":CSTATUS[s]}
            </button>
          ))}
          <select value={filterDesigner} onChange={e=>setFilterDesigner(e.target.value)} style={{padding:"8px 14px",background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:12,fontFamily:"Cairo",outline:"none"}}>
            <option value="all">كل المصممين</option>
            {designers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        {filtered.length===0
          ?<Card s={{textAlign:"center",padding:"60px"}}><div style={{fontSize:40,marginBottom:12}}>🎨</div><div style={{color:C.textS,fontSize:14}}>لا توجد تاسكات بهذا الفلتر</div></Card>
          :filtered.map(t=>{
            const client=clients.find(c=>c.id===t.clientId);
            const designer=users.find(u=>u.id===t.designerId);
            const late=isLate(t);
            return(<Card key={t.id} s={{marginBottom:10,padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                    <span style={{color:C.text,fontSize:13,fontWeight:700}}>{t.agency}</span>
                    {t.department&&<Bdg label={t.department} color={C.purple} dot={false}/>}
                    <Bdg label={CSTATUS[t.status]||t.status} color={CSTATUS_C[t.status]||C.textS}/>
                    {late&&<Bdg label="متأخر ⚠️" color={C.red}/>}
                    {t.directorApproved&&<Bdg label="✓ Director" color={C.green} dot={false}/>}
                  </div>
                  <div style={{color:C.textS,fontSize:12,marginBottom:6}}>{client?.name||t.clientName||"—"} · {t.forum} {t.noOfSizes?`· ${t.noOfSizes}`:""} {t.size?`· ${t.size}`:""}</div>
                  <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                    {designer&&<div style={{display:"flex",alignItems:"center",gap:5}}><Av text={designer.avatar} color={RC.designer} size={20}/><span style={{color:C.textS,fontSize:11}}>{designer.name}</span></div>}
                    <span style={{color:C.textM,fontSize:11}}>🗓 نزل: {fmtDate(t.taskDate)}</span>
                    <span style={{color:late?C.red:C.textM,fontSize:11,fontWeight:late?700:400}}>⏰ ديدلاين: {fmtDate(t.deadLine)}</span>
                    {t.strategyLink&&<a href={t.strategyLink} target="_blank" rel="noreferrer" style={{color:C.blue,fontSize:11}}>Strategy ↗</a>}
                    {t.uploadFolder&&<a href={t.uploadFolder} target="_blank" rel="noreferrer" style={{color:C.green,fontSize:11}}>Upload ↗</a>}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  {!t.done&&<button onClick={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,done:true,status:"done"}:x))} style={{padding:"6px 12px",borderRadius:8,background:`${C.green}18`,border:`1px solid ${C.green}33`,color:C.green,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"Cairo"}}>✓ تم</button>}
                  <button onClick={()=>setEdit(t)} style={{padding:"6px 10px",borderRadius:8,background:`${C.purple}18`,border:`1px solid ${C.purple}33`,color:C.purple,fontSize:11,cursor:"pointer",fontFamily:"Cairo"}}>✏️</button>
                  <button onClick={()=>{if(window.confirm("حذف التاسك؟"))setTasks(p=>p.filter(x=>x.id!==t.id));}} style={{padding:"6px 10px",borderRadius:8,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",color:C.red,fontSize:11,cursor:"pointer",fontFamily:"Cairo"}}>🗑</button>
                </div>
              </div>
            </Card>);
          })
        }
      </div>
    </div>
  );
}

// ═══ CAMPAIGNS ════════════════════════════════════════════════════════════════
function AddCampaignModal({open,onClose,onAdd,clients,currentUser}){
  const myClients=currentUser?.role==="media_buyer"?clients.filter(c=>c.status==="active"&&c.mb===currentUser.id):clients.filter(c=>c.status==="active");
  const E={clientId:"",platform:"Meta",week:todayStr(),spend:"",clicks:"",impressions:"",purchases:"",purchaseValue:"",roas:"",ctr:"",cpm:"",cpc:"",checkout:"",addToCart:""};
  const [f,setF]=useState(E);const [err,setErr]=useState("");
  const sv=(k,v)=>setF(p=>({...p,[k]:v}));
  const autoRoas=f.spend&&f.purchaseValue?(+f.purchaseValue/+f.spend).toFixed(2):"";
  const sub=()=>{
    if(!f.clientId){setErr("اختر العميل");return;}
    if(!f.spend){setErr("أدخل الإنفاق على الأقل");return;}
    onAdd({...f,id:Date.now(),clientId:+f.clientId,spend:+f.spend||0,clicks:+f.clicks||0,impressions:+f.impressions||0,purchases:+f.purchases||0,purchaseValue:+f.purchaseValue||0,roas:+(f.roas||autoRoas)||0,ctr:+f.ctr||0,cpm:+f.cpm||0,cpc:+f.cpc||0,checkout:+f.checkout||0,addToCart:+f.addToCart||0});
    setF(E);setErr("");onClose();
  };
  return(
    <Mdl open={open} onClose={()=>{setF(E);setErr("");onClose()}} title="📊 إضافة بيانات حملة" width={560}>
      <div style={{background:`${C.purple}10`,border:`1px solid ${C.purple}25`,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:C.textS}}>
        أدخل الأرقام من لوحات المنصات مباشرة — Meta Ads / TikTok Ads / Snapchat Ads / Google Ads
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <Sel label="العميل" value={f.clientId} onChange={v=>sv("clientId",v)} opts={myClients.map(c=>({v:c.id,l:c.name}))} req/>
        <Sel label="المنصة" value={f.platform} onChange={v=>sv("platform",v)} opts={PLATS.map(p=>({v:p,l:p}))} req/>
        <Inp label="تاريخ الأسبوع" value={f.week} onChange={v=>sv("week",v)} type="date" req mb={0}/>
      </div>
      <div style={{margin:"14px 0 10px",fontSize:12,fontWeight:600,color:C.textS,borderBottom:`1px solid ${C.border}`,paddingBottom:6}}>أرقام الأداء</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <Inp label="💸 الإنفاق (SAR)" value={f.spend} onChange={v=>sv("spend",v)} type="number" placeholder="5000" req mb={0}/>
        <Inp label="🖱️ Clicks" value={f.clicks} onChange={v=>sv("clicks",v)} type="number" placeholder="3000" mb={0}/>
        <Inp label="👁️ Impressions" value={f.impressions} onChange={v=>sv("impressions",v)} type="number" placeholder="350000" mb={0}/>
        <Inp label="🛒 Purchases" value={f.purchases} onChange={v=>sv("purchases",v)} type="number" placeholder="65" mb={0}/>
        <Inp label="💰 Purchase Value (SAR)" value={f.purchaseValue} onChange={v=>sv("purchaseValue",v)} type="number" placeholder="55000" mb={0}/>
        <Inp label="📈 ROAS (أو تلقائي)" value={f.roas} onChange={v=>sv("roas",v)} type="number" placeholder={autoRoas||"3.5"} mb={0}/>
        <Inp label="CTR %" value={f.ctr} onChange={v=>sv("ctr",v)} type="number" placeholder="0.9" mb={0}/>
        <Inp label="CPM (SAR)" value={f.cpm} onChange={v=>sv("cpm",v)} type="number" placeholder="13" mb={0}/>
        <Inp label="CPC (SAR)" value={f.cpc} onChange={v=>sv("cpc",v)} type="number" placeholder="1.5" mb={0}/>
        <Inp label="Checkout" value={f.checkout} onChange={v=>sv("checkout",v)} type="number" placeholder="160" mb={0}/>
        <Inp label="Add to Cart" value={f.addToCart} onChange={v=>sv("addToCart",v)} type="number" placeholder="80" mb={0}/>
      </div>
      {autoRoas&&<div style={{marginTop:12,padding:"9px 14px",background:`${C.green}10`,border:`1px solid ${C.green}30`,borderRadius:10,display:"flex",justifyContent:"space-between"}}>
        <span style={{color:C.textS,fontSize:12}}>ROAS محسوب تلقائياً من الأرقام</span>
        <span style={{color:C.green,fontSize:15,fontWeight:800}}>{autoRoas}</span>
      </div>}
      {err&&<div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:10,padding:"10px 14px",marginTop:12,color:"#FCA5A5",fontSize:12}}>⚠️ {err}</div>}
      <div style={{display:"flex",gap:10,marginTop:14}}>
        <Btn onClick={sub} style={{flex:1,padding:13}}>✓ حفظ الحملة</Btn>
        <button onClick={()=>{setF(E);setErr("");onClose()}} style={{padding:"12px 20px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,color:C.textS,fontSize:14,fontFamily:"Cairo",cursor:"pointer"}}>إلغاء</button>
      </div>
    </Mdl>
  );
}

function Campaigns({campaigns,setCampaigns,clients,users,currentUser}){
  const [addOpen,setAddOpen]=useState(false);
  const [sc,setSc]=useState("all");const [sp,setSp]=useState("all");
  const myClients=currentUser?.role==="media_buyer"?clients.filter(c=>c.mb===currentUser.id):clients;
  const filtered=campaigns.filter(c=>{
    if(!myClients.find(cl=>cl.id===c.clientId))return false;
    if(sc!=="all"&&c.clientId!==+sc)return false;
    if(sp!=="all"&&c.platform!==sp)return false;
    return true;
  });
  return(
    <div>
      <AddCampaignModal open={addOpen} onClose={()=>setAddOpen(false)} onAdd={c=>setCampaigns(p=>[...p,c])} clients={clients} currentUser={currentUser}/>
      <TB title="الحملات والأداء 📊" sub="أرقام الحملات عبر كل المنصات">
        <Btn onClick={()=>setAddOpen(true)}>+ إضافة بيانات حملة</Btn>
      </TB>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
          <StC label="الإنفاق الكلي" value={`${(filtered.reduce((s,c)=>s+c.spend,0)/1000).toFixed(0)}k SAR`} icon="💸" color={C.orange}/>
          <StC label="متوسط ROAS" value={(filtered.length?filtered.reduce((s,c)=>s+c.roas,0)/filtered.length:0).toFixed(1)} icon="📈" color={C.green}/>
          <StC label="إجمالي المبيعات" value={`${(filtered.reduce((s,c)=>s+(c.purchaseValue||0),0)/1000).toFixed(0)}k SAR`} icon="🛒" color={C.purple}/>
          <StC label="إجمالي Purchases" value={filtered.reduce((s,c)=>s+(c.purchases||0),0)} icon="✅" color={C.blue}/>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:18}}>
          <select value={sc} onChange={e=>setSc(e.target.value)} style={{padding:"9px 14px",background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:12,fontFamily:"Cairo",outline:"none"}}>
            <option value="all">كل العملاء</option>
            {myClients.filter(c=>c.status==="active").map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={sp} onChange={e=>setSp(e.target.value)} style={{padding:"9px 14px",background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:12,fontFamily:"Cairo",outline:"none"}}>
            <option value="all">كل المنصات</option>
            {PLATS.map(p=><option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        {filtered.length===0
          ?<Card s={{textAlign:"center",padding:"60px"}}><div style={{fontSize:40,marginBottom:12}}>📊</div><div style={{color:C.textS,fontSize:14,marginBottom:16}}>لا توجد حملات — أضف أول حملة</div><Btn onClick={()=>setAddOpen(true)}>+ إضافة بيانات حملة</Btn></Card>
          :filtered.map(camp=>{
            const client=clients.find(c=>c.id===camp.clientId);
            return(<Card key={camp.id} s={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <PT name={camp.platform}/>
                  <div style={{color:C.text,fontSize:14,fontWeight:700}}>{client?.name||"—"}</div>
                  <div style={{color:C.textM,fontSize:12}}>{fmtDate(camp.week)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:(camp.roas||0)>=3?C.green:C.orange,fontSize:18,fontWeight:800}}>ROAS {camp.roas||"—"}</span>
                  <button onClick={()=>setCampaigns(p=>p.filter(x=>x.id!==camp.id))} style={{padding:"4px 10px",borderRadius:7,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",color:C.red,fontSize:11,cursor:"pointer",fontFamily:"Cairo"}}>🗑</button>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
                {[["Spend",`${(camp.spend||0).toLocaleString()} SAR`,C.orange],["Clicks",(camp.clicks||0).toLocaleString(),C.blue],["Impressions",((camp.impressions||0)/1000).toFixed(0)+"k",C.purple],["CTR",`${camp.ctr||0}%`,C.teal],["Purchases",camp.purchases||0,C.green],["P.Value",`${((camp.purchaseValue||0)/1000).toFixed(0)}k SAR`,C.pink]].map(([l,v,co])=>(
                  <div key={l} style={{textAlign:"center",padding:"8px 4px",background:"rgba(255,255,255,0.03)",borderRadius:8}}>
                    <div style={{color:co,fontSize:13,fontWeight:700,marginBottom:2}}>{v}</div>
                    <div style={{color:C.textM,fontSize:9}}>{l}</div>
                  </div>
                ))}
              </div>
            </Card>);
          })
        }
      </div>
    </div>
  );
}



// ═══ TASKS ════════════════════════════════════════════════════════════════════
function Tasks({tasks,setTasks,clients,users,currentUser}){
  const [filter,setFilter]=useState("all");const [addOpen,setAddOpen]=useState(false);
  const [f,setF]=useState({title:"",assignedTo:"",clientId:"",due:"",priority:"medium",notes:""});
  const [err,setErr]=useState("");const sf=(k,v)=>setF(p=>({...p,[k]:v}));
  const filtered=tasks.filter(t=>filter==="all"||t.status===filter);
  const TSC={pending:C.orange,done:C.green,late:C.red,inprogress:C.blue};
  const TSL={pending:"قيد الانتهاء",done:"مكتملة",late:"متأخرة",inprogress:"جارية"};
  const add=()=>{
    if(!f.title.trim()||!f.assignedTo||!f.due){setErr("أكمل الحقول المطلوبة");return;}
    setTasks(p=>[...p,{...f,id:Date.now(),assignedTo:+f.assignedTo,clientId:f.clientId?+f.clientId:null,status:"pending"}]);
    setF({title:"",assignedTo:"",clientId:"",due:"",priority:"medium",notes:""});setErr("");setAddOpen(false);
  };
  return(
    <div>
      <Mdl open={addOpen} onClose={()=>{setAddOpen(false);setErr("")}} title="➕ إضافة مهمة" width={460}>
        <Inp label="عنوان المهمة" value={f.title} onChange={v=>sf("title",v)} req placeholder="مثال: رفع تقرير أسبوعي"/>
        <Sel label="المسؤول" value={f.assignedTo} onChange={v=>sf("assignedTo",v)} opts={users.filter(u=>u.role!=="admin").map(u=>({v:u.id,l:`${u.name} (${RL[u.role]})`}))} req/>
        <Sel label="العميل" value={f.clientId} onChange={v=>sf("clientId",v)} opts={clients.filter(c=>c.status==="active").map(c=>({v:c.id,l:c.name}))} ph="غير مرتبط"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Inp label="تاريخ التسليم" value={f.due} onChange={v=>sf("due",v)} type="date" req mb={0}/><Sel label="الأولوية" value={f.priority} onChange={v=>sf("priority",v)} opts={[{v:"high",l:"عالية 🔴"},{v:"medium",l:"متوسطة 🟡"},{v:"low",l:"منخفضة 🟢"}]} mb={0}/></div>
        {err&&<div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:10,padding:"10px 14px",marginTop:14,marginBottom:0,color:"#FCA5A5",fontSize:12}}>⚠️ {err}</div>}
        <div style={{display:"flex",gap:10,marginTop:14}}><Btn onClick={add} style={{flex:1,padding:13}}>✓ إضافة</Btn><button onClick={()=>setAddOpen(false)} style={{padding:"12px 20px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,color:C.textS,fontSize:14,fontFamily:"Cairo",cursor:"pointer"}}>إلغاء</button></div>
      </Mdl>
      <TB title="المهام اليومية ✅" sub={`${tasks.length} إجمالي · ${tasks.filter(t=>t.status==="late").length} متأخرة`}>
        <Btn onClick={()=>setAddOpen(true)}>+ إضافة مهمة</Btn>
      </TB>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
          {[["قيد الانتظار",tasks.filter(t=>t.status==="pending").length,C.orange,"⏳"],["جارية",tasks.filter(t=>t.status==="inprogress").length,C.blue,"🔄"],["مكتملة",tasks.filter(t=>t.status==="done").length,C.green,"✅"],["متأخرة",tasks.filter(t=>t.status==="late"||new Date(t.due)<new Date()&&t.status!=="done").length,C.red,"🚨"]].map(([l,v,co,ic])=><StC key={l} label={l} value={v} icon={ic} color={co}/>)}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>{["all","pending","inprogress","done","late"].map(s=><button key={s} onClick={()=>setFilter(s)} style={{padding:"8px 14px",borderRadius:20,fontFamily:"Cairo",fontSize:12,cursor:"pointer",border:"1px solid",background:filter===s?`${C.pink}18`:C.bgCard,color:filter===s?C.pink:C.textS,borderColor:filter===s?`${C.pink}44`:C.border}}>{s==="all"?"الكل":TSL[s]}</button>)}</div>
        {filtered.map(t=>{
          const member=users.find(u=>u.id===t.assignedTo);const client=clients.find(c=>c.id===t.clientId);
          const isLate=new Date(t.due)<new Date()&&t.status!=="done";
          const priC={high:C.red,medium:C.orange,low:C.green}[t.priority];
          return(<Card key={t.id} s={{marginBottom:10,padding:"13px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:4,height:36,borderRadius:2,background:isLate?C.red:TSC[t.status]||C.orange,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><div style={{color:C.text,fontSize:13,fontWeight:700}}>{t.title}</div>{client&&<Bdg label={client.name} color={C.blue} dot={false}/>}<span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:`${priC}18`,color:priC,fontWeight:600}}>{t.priority==="high"?"عالية":t.priority==="medium"?"متوسطة":"منخفضة"}</span></div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>{member&&<div style={{display:"flex",alignItems:"center",gap:5}}><Av text={member.avatar} color={RC[member.role]} size={18}/><span style={{color:C.textS,fontSize:11}}>{member.name}</span></div>}<span style={{color:isLate?C.red:C.textM,fontSize:11}}>⏰ {fmtDate(t.due)}</span></div>
              </div>
              <div style={{display:"flex",gap:6}}>
                {t.status!=="done"&&<button onClick={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,status:"done"}:x))} style={{padding:"6px 12px",borderRadius:8,background:`${C.green}18`,border:`1px solid ${C.green}33`,color:C.green,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"Cairo"}}>✓ إنجاز</button>}
                <button onClick={()=>setTasks(p=>p.filter(x=>x.id!==t.id))} style={{padding:"6px 10px",borderRadius:8,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",color:C.red,fontSize:11,cursor:"pointer",fontFamily:"Cairo"}}>🗑</button>
              </div>
            </div>
          </Card>);
        })}
        {filtered.length===0&&<Card s={{textAlign:"center",padding:"50px"}}><div style={{fontSize:32,marginBottom:8}}>✅</div><div style={{color:C.textS,fontSize:14}}>لا توجد مهام بهذا الفلتر</div></Card>}
      </div>
    </div>
  );
}

// ═══ REPORTS ════════════════════════════════════════════════════════════════
function Reports({clients,campaigns,users}){
  const [selMonth,setSelMonth]=useState("all");
  const active=clients.filter(c=>c.status==="active");
  const months=["2025-05","2025-04","2025-03","2025-02","2025-01"];

  // Export all reports to Excel CSV
  const exportExcel=()=>{
    const rows=[["العميل","Media Buyer","المنصة","الإنفاق SAR","المبيعات SAR","ROAS","Clicks","Impressions","CTR%","Purchases","الأسبوع"]];
    campaigns.forEach(camp=>{
      const client=clients.find(c=>c.id===camp.clientId);
      const mb=users.find(u=>u.id===client?.mb);
      rows.push([client?.name||"",mb?.name||"",camp.platform,camp.spend,camp.purchaseValue||0,camp.roas,camp.clicks,camp.impressions,camp.ctr,camp.purchases,camp.week]);
    });
    const csv="\uFEFF"+rows.map(r=>r.join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`وميض_تقارير_${new Date().toLocaleDateString("ar")}.csv`;a.click();
    URL.revokeObjectURL(url);
  };

  return(
    <div>
      <TB title="التقارير 📋" sub="تقارير تلقائية — PDF وإكسيل">
        <button onClick={exportExcel} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",background:"rgba(52,211,153,0.15)",border:`1px solid ${C.green}44`,borderRadius:12,color:C.green,fontSize:13,fontWeight:700,fontFamily:"Cairo",cursor:"pointer"}}>
          📊 تصدير Excel
        </button>
      </TB>
      <div style={{padding:"0 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
          <StC label="الإنفاق الكلي" value={`${(campaigns.reduce((s,c)=>s+c.spend,0)/1000).toFixed(0)}k SAR`} icon="💸" color={C.orange}/>
          <StC label="إجمالي المبيعات" value={`${(campaigns.reduce((s,c)=>s+(c.purchaseValue||0),0)/1000).toFixed(0)}k SAR`} icon="🛒" color={C.green}/>
          <StC label="متوسط ROAS" value={(campaigns.length?campaigns.reduce((s,c)=>s+c.roas,0)/campaigns.length:0).toFixed(1)} icon="📈" color={C.purple}/>
        </div>
        {active.map(client=>{
          const campData=campaigns.filter(c=>c.clientId===client.id);if(!campData.length)return null;
          const totalSpend=campData.reduce((s,c)=>s+c.spend,0);
          const totalSales=campData.reduce((s,c)=>s+(c.purchaseValue||0),0);
          const avgROAS=(campData.reduce((s,c)=>s+c.roas,0)/campData.length).toFixed(1);
          const mb=users.find(u=>u.id===client.mb);
          return(<Card key={client.id} s={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:11,background:`${C.purple}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏪</div>
                <div><div style={{color:C.text,fontSize:14,fontWeight:700}}>{client.name}</div><div style={{color:C.textS,fontSize:12}}>{mb?.name}</div></div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{color:avgROAS>=3?C.green:C.orange,fontSize:18,fontWeight:800}}>ROAS {avgROAS}</div>
                <button onClick={()=>generatePDF(client,campaigns,users)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:C.grad,border:"none",borderRadius:10,color:"white",fontSize:12,fontWeight:700,fontFamily:"Cairo",cursor:"pointer"}}>📥 PDF</button>
                <button onClick={()=>{
                  const campRows=[["المنصة","الإنفاق SAR","المبيعات SAR","ROAS","Clicks","Impressions","CTR%","Purchases"]];
                  campData.forEach(c=>campRows.push([c.platform,c.spend,c.purchaseValue||0,c.roas,c.clicks,c.impressions,c.ctr,c.purchases]));
                  const csv="\uFEFF"+campRows.map(r=>r.join(",")).join("\n");
                  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
                  const url=URL.createObjectURL(blob);
                  const a=document.createElement("a");a.href=url;a.download=`${client.name}_تقرير.csv`;a.click();
                  URL.revokeObjectURL(url);
                }} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:`${C.green}18`,border:`1px solid ${C.green}33`,borderRadius:10,color:C.green,fontSize:12,fontWeight:700,fontFamily:"Cairo",cursor:"pointer"}}>📊 Excel</button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
              {[["الإنفاق",`${totalSpend.toLocaleString()} SAR`,C.orange],["المبيعات",`${totalSales.toLocaleString()} SAR`,C.green],["الطلبات",campData.reduce((s,c)=>s+c.purchases,0),C.blue],["الحملات",campData.length,C.purple]].map(([l,v,co])=>(
                <div key={l} style={{textAlign:"center",padding:"10px",background:"rgba(255,255,255,0.03)",borderRadius:10}}><div style={{color:co,fontSize:15,fontWeight:800,marginBottom:2}}>{v}</div><div style={{color:C.textM,fontSize:11}}>{l}</div></div>
              ))}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {campData.map(c=><div key={c.id} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:"rgba(255,255,255,0.03)",borderRadius:7}}><PT name={c.platform}/><span style={{color:c.roas>=3?C.green:C.orange,fontSize:11,fontWeight:700}}>ROAS {c.roas}</span></div>)}
            </div>
          </Card>);
        })}
      </div>
    </div>
  );
}

// ═══ PAYROLL ═════════════════════════════════════════════════════════════════
function Payroll({users,clients,payroll,setPayroll}){
  const team=users.filter(u=>u.role!=="admin");
  const [editId,setEditId]=useState(null);
  const [editOpen,setEditOpen]=useState(false);
  const [f,setF]=useState({base:"",commission:"",bonus:"",deductions:"",note:""});
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));

  const getRow=(uid)=>payroll.find(p=>p.userId===uid)||{base:0,commission:0,bonus:0,deductions:0,note:""};

  const openEdit=(u)=>{
    const r=getRow(u.id);
    setF({base:r.base||"",commission:r.commission||"",bonus:r.bonus||"",deductions:r.deductions||"",note:r.note||""});
    setEditId(u.id);setEditOpen(true);
  };

  const saveRow=()=>{
    setPayroll(p=>{
      const exists=p.find(x=>x.userId===editId);
      const row={userId:editId,base:+f.base||0,commission:+f.commission||0,bonus:+f.bonus||0,deductions:+f.deductions||0,note:f.note,month:"2025-05"};
      return exists?p.map(x=>x.userId===editId?row:x):[...p,row];
    });
    setEditOpen(false);
  };

  const exportPayroll=()=>{
    const rows=[["الموظف","الدور","الراتب الأساسي","الكوميشن","البونص","الخصومات","الصافي","ملاحظة","الشهر"]];
    team.forEach(u=>{
      const r=getRow(u.id);
      const net=(r.base||0)+(r.commission||0)+(r.bonus||0)-(r.deductions||0);
      rows.push([u.name,RL[u.role],r.base||0,r.commission||0,r.bonus||0,r.deductions||0,net,r.note||"","مايو 2025"]);
    });
    const csv="\uFEFF"+rows.map(r=>r.join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="وميض_رواتب_مايو2025.csv";a.click();
    URL.revokeObjectURL(url);
  };

  const printPayroll=()=>{
    const today=new Date().toLocaleDateString("ar-EG");
    const html=`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>كشف رواتب وميض</title>
    <style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:Cairo,sans-serif;padding:32px;color:#111}
    .header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #E879A0;padding-bottom:16px;margin-bottom:24px}
    .logo{font-size:24px;font-weight:900;background:linear-gradient(135deg,#E879A0,#7B6FE0);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#f8f9ff;padding:10px 14px;text-align:right;font-size:12px;color:#555;border:1px solid #e8eaf6}td{padding:10px 14px;border:1px solid #e8eaf6;font-size:13px}
    .total{background:#f0fdf4;font-weight:700;color:#16a34a}.footer{margin-top:24px;text-align:center;color:#999;font-size:11px}</style></head><body>
    <div class="header"><div class="logo">وميض — كشف رواتب</div><div style="text-align:left;color:#666;font-size:13px">مايو 2025 · ${today}</div></div>
    <table><thead><tr><th>الموظف</th><th>الدور</th><th>الأساسي</th><th>الكوميشن</th><th>البونص</th><th>الخصومات</th><th>الصافي</th><th>ملاحظة</th></tr></thead><tbody>
    ${team.map(u=>{const r=getRow(u.id);const net=(r.base||0)+(r.commission||0)+(r.bonus||0)-(r.deductions||0);
    return`<tr><td><strong>${u.name}</strong></td><td>${RL[u.role]}</td><td>${(r.base||0).toLocaleString()} SAR</td><td style="color:#16a34a">+${(r.commission||0).toLocaleString()}</td><td style="color:#2563eb">+${(r.bonus||0).toLocaleString()}</td><td style="color:#dc2626">-${(r.deductions||0).toLocaleString()}</td><td class="total">${net.toLocaleString()} SAR</td><td style="color:#666;font-size:12px">${r.note||""}</td></tr>`;}).join("")}
    <tr style="background:#fdf4ff;font-weight:700"><td colspan="6" style="text-align:left">الإجمالي الكلي</td><td style="color:#7B6FE0;font-size:15px">${team.reduce((s,u)=>{const r=getRow(u.id);return s+(r.base||0)+(r.commission||0)+(r.bonus||0)-(r.deductions||0);},0).toLocaleString()} SAR</td><td></td></tr>
    </tbody></table><div class="footer">سري للغاية — وميض للتسويق الرقمي · ${today}</div></body></html>`;
    const win=window.open("","_blank");if(win){win.document.write(html);win.document.close();setTimeout(()=>win.print(),600);}
  };

  const totalNet=team.reduce((s,u)=>{const r=getRow(u.id);return s+(r.base||0)+(r.commission||0)+(r.bonus||0)-(r.deductions||0);},0);

  return(
    <div>
      <Mdl open={editOpen} onClose={()=>setEditOpen(false)} title="✏️ تعديل راتب الموظف" width={440}>
        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 14px",marginBottom:16}}>
          <div style={{color:C.text,fontSize:13,fontWeight:600}}>{users.find(u=>u.id===editId)?.name}</div>
          <div style={{color:C.textM,fontSize:11}}>{RL[users.find(u=>u.id===editId)?.role]}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="الراتب الأساسي (SAR)" value={f.base} onChange={v=>sf("base",v)} type="number" placeholder="5000" mb={0}/>
          <Inp label="الكوميشن (SAR)" value={f.commission} onChange={v=>sf("commission",v)} type="number" placeholder="600" mb={0}/>
          <Inp label="البونص (SAR)" value={f.bonus} onChange={v=>sf("bonus",v)} type="number" placeholder="500" mb={0}/>
          <Inp label="الخصومات (SAR)" value={f.deductions} onChange={v=>sf("deductions",v)} type="number" placeholder="0" mb={0}/>
        </div>
        <div style={{marginTop:14,padding:"10px 12px",background:f.base?"rgba(52,211,153,0.08)":"rgba(255,255,255,0.03)",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:C.textS,fontSize:13}}>الصافي</span>
          <span style={{color:C.green,fontSize:18,fontWeight:800}}>{((+f.base||0)+(+f.commission||0)+(+f.bonus||0)-(+f.deductions||0)).toLocaleString()} SAR</span>
        </div>
        <Inp label="ملاحظة" value={f.note} onChange={v=>sf("note",v)} placeholder="مثال: بونص أداء مايو" style={{marginTop:14}}/>
        <div style={{display:"flex",gap:10}}><Btn onClick={saveRow} style={{flex:1,padding:13}}>✓ حفظ</Btn><button onClick={()=>setEditOpen(false)} style={{padding:"12px 20px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,color:C.textS,fontSize:14,fontFamily:"Cairo",cursor:"pointer"}}>إلغاء</button></div>
      </Mdl>

      <TB title="الرواتب 💰" sub="مايو 2025 — سري للإدارة فقط">
        <div style={{display:"flex",gap:8}}>
          <button onClick={exportPayroll} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 14px",background:`${C.green}15`,border:`1px solid ${C.green}33`,borderRadius:12,color:C.green,fontSize:12,fontWeight:700,fontFamily:"Cairo",cursor:"pointer"}}>📊 Excel</button>
          <button onClick={printPayroll} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 14px",background:C.grad,border:"none",borderRadius:12,color:"white",fontSize:12,fontWeight:700,fontFamily:"Cairo",cursor:"pointer"}}>🖨️ PDF طباعة</button>
        </div>
      </TB>
      <div style={{padding:"0 32px"}}>
        <div style={{background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:12,padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>🔒</span><div style={{color:"rgba(248,113,113,0.9)",fontSize:12}}>هذه الصفحة مرئية للمدير فقط</div></div>
          <div style={{color:C.text,fontSize:14,fontWeight:700}}>إجمالي الرواتب: <span style={{color:C.green}}>{totalNet.toLocaleString()} SAR</span></div>
        </div>
        <Card s={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"Cairo"}}>
            <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
              {["الموظف","الدور","الأساسي","الكوميشن","البونص","الخصومات","الصافي","ملاحظة",""].map((h,i)=>(
                <th key={i} style={{padding:"12px 14px",color:C.textM,fontSize:11,fontWeight:500,textAlign:"right",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{team.map(u=>{
              const r=getRow(u.id);
              const net=(r.base||0)+(r.commission||0)+(r.bonus||0)-(r.deductions||0);
              const hasData=r.base>0;
              return(<tr key={u.id} style={{borderBottom:`1px solid ${C.border}`,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=C.bgHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"13px 14px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Av text={u.avatar} color={RC[u.role]} size={30}/><div style={{color:C.text,fontSize:13,fontWeight:600}}>{u.name}</div></div></td>
                <td style={{padding:"13px 14px"}}><Bdg label={RL[u.role]} color={RC[u.role]}/></td>
                <td style={{padding:"13px 14px",color:hasData?C.text:C.textM,fontSize:13}}>{hasData?(r.base||0).toLocaleString()+" SAR":"—"}</td>
                <td style={{padding:"13px 14px",color:C.green,fontSize:13,fontWeight:600}}>{hasData?"+"+( r.commission||0).toLocaleString():"—"}</td>
                <td style={{padding:"13px 14px",color:C.blue,fontSize:13,fontWeight:600}}>{hasData?"+"+( r.bonus||0).toLocaleString():"—"}</td>
                <td style={{padding:"13px 14px",color:C.red,fontSize:13}}>{hasData?"-"+( r.deductions||0).toLocaleString():"—"}</td>
                <td style={{padding:"13px 14px"}}>{hasData?<span style={{color:C.green,fontSize:15,fontWeight:800}}>{net.toLocaleString()} SAR</span>:<span style={{color:C.textM,fontSize:12}}>لم يُحدَّد</span>}</td>
                <td style={{padding:"13px 14px",color:C.textM,fontSize:11,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.note||""}</td>
                <td style={{padding:"13px 14px"}}>
                  <button onClick={()=>openEdit(u)} style={{padding:"6px 12px",borderRadius:8,background:`${C.purple}18`,border:`1px solid ${C.purple}33`,color:C.purple,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"Cairo"}}>✏️ تعديل</button>
                </td>
              </tr>);
            })}</tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ═══ TEAM MANAGEMENT ═════════════════════════════════════════════════════════
function TeamMgmt({users,setUsers}){
  const [open,setOpen]=useState(false);const [edit,setEdit]=useState(null);
  const [f,setF]=useState({name:"",role:"media_buyer",email:"",password:""});
  const [err,setErr]=useState("");const [saving,setSaving]=useState(false);
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));

  const save=async()=>{
    if(!f.name.trim()||!f.email.trim()||!f.password){setErr("أكمل جميع الحقول");return;}
    setSaving(true);setErr("");
    const av=ini(f.name);
    try{
      if(edit){
        // Update existing
        setUsers(p=>p.map(u=>u.id===edit.id?{...u,...f,avatar:av}:u));
        if(window.__SB) await window.__SB.from("users").update({name:f.name,role:f.role,avatar:av}).eq("id",edit.id);
      }else{
        if(users.find(u=>u.email===f.email)){setErr("البريد مستخدم");setSaving(false);return;}
        // Create Supabase Auth login account (admin.createUser needs a service-role
        // key that can never be exposed client-side, so we go straight to signUp)
        let authId=null;
        if(window.__SB){
          const {data:sd,error:signErr}=await window.__SB.auth.signUp({email:f.email,password:f.password});
          if(signErr){
            console.error("فشل إنشاء حساب الدخول:",signErr.message);
          }else if(sd?.user){
            authId=sd.user.id;
          }
          // Insert into users table
          const {error:insErr}=await window.__SB.from("users").insert({name:f.name,email:f.email,role:f.role,avatar:av});
          if(insErr) console.error("فشل حفظ بيانات المستخدم في الجدول:",insErr.message);
        }
        setUsers(p=>[...p,{id:authId||Date.now(),...f,avatar:av}]);
      }
      setOpen(false);setErr("");
    }catch(e){setErr("حدث خطأ — تحقق من الاتصال");}
    setSaving(false);
  };
  return(
    <div>
      <Mdl open={open} onClose={()=>setOpen(false)} title={edit?"✏️ تعديل موظف":"➕ إضافة موظف"} width={420}>
        <Inp label="الاسم الكامل" value={f.name} onChange={v=>sf("name",v)} req placeholder="أحمد محمد"/>
        <Inp label="البريد الإلكتروني" value={f.email} onChange={v=>sf("email",v)} type="email" req placeholder="ahmed@wameed.sa"/>
        <Inp label="كلمة المرور" value={f.password} onChange={v=>sf("password",v)} req placeholder="••••••••"/>
        <Sel label="الدور" value={f.role} onChange={v=>sf("role",v)} opts={[{v:"admin",l:"مدير النظام (صلاحيات كاملة)"},{v:"media_buyer",l:"Media Buyer"},{v:"social_media",l:"Social Media"},{v:"account_manager",l:"Account Manager"},{v:"designer",l:"Designer"}]} req/>
        {err&&<div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:14,color:"#FCA5A5",fontSize:12}}>⚠️ {err}</div>}
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={save} style={{flex:1,padding:13,opacity:saving?0.7:1}}>
            {saving?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>جاري الحفظ...</span>:edit?"حفظ":"✓ إضافة وإنشاء حساب"}
          </Btn>
          <button onClick={()=>setOpen(false)} style={{padding:"12px 20px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:12,color:C.textS,fontSize:14,fontFamily:"Cairo",cursor:"pointer"}}>إلغاء</button>
        </div>
      </Mdl>
      <TB title="إدارة الفريق 🧑‍💼" sub={`${users.filter(u=>u.role!=="admin").length} موظف`}>
        <Btn onClick={()=>{setF({name:"",role:"media_buyer",email:"",password:""});setErr("");setEdit(null);setOpen(true)}}>+ إضافة</Btn>
      </TB>
      <div style={{padding:"0 32px"}}>
        {[["admin","مديرو النظام","👑"],["media_buyer","Media Buyers","📊"],["social_media","Social Media","📱"],["account_manager","Account Managers","📋"],["designer","Designers","🎨"]].map(([role,label,icon])=>(
          <div key={role} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><span style={{fontSize:16}}>{icon}</span><div style={{color:C.textS,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</div><Bdg label={`${users.filter(u=>u.role===role).length}`} color={RC[role]}/></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {users.filter(u=>u.role===role).map(u=>(
                <Card key={u.id}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><Av text={u.avatar} color={RC[u.role]} size={44}/><div style={{flex:1,minWidth:0}}><div style={{color:C.text,fontSize:13,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</div><div style={{color:RC[u.role],fontSize:10,fontWeight:500}}>{RL[u.role]}</div></div></div>
                  <div style={{padding:"7px 10px",background:"rgba(255,255,255,0.03)",borderRadius:8,marginBottom:10}}><div style={{color:C.textM,fontSize:10,marginBottom:1}}>البريد</div><div style={{color:C.textS,fontSize:11,direction:"ltr",textAlign:"left",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div></div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{setF({name:u.name,role:u.role,email:u.email,password:u.password});setErr("");setEdit(u);setOpen(true)}} style={{flex:1,padding:"7px",borderRadius:9,background:`${C.purple}18`,border:`1px solid ${C.purple}33`,color:C.purple,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Cairo"}}>✏️ تعديل</button>
                    <button onClick={()=>{if(window.confirm("حذف؟"))setUsers(p=>p.filter(x=>x.id!==u.id))}} style={{padding:"7px 11px",borderRadius:9,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",color:C.red,fontSize:11,cursor:"pointer",fontFamily:"Cairo"}}>🗑</button>
                  </div>
                </Card>
              ))}
              <button onClick={()=>{setF({name:"",role,email:"",password:""});setErr("");setEdit(null);setOpen(true)}} style={{border:`2px dashed ${C.border}`,borderRadius:14,background:"transparent",cursor:"pointer",padding:"20px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,minHeight:130}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderH} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:C.textM}}>+</div>
                <div style={{color:C.textM,fontSize:11}}>إضافة</div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ NOTIFICATIONS BELL ══════════════════════════════════════════════════════
function NotifBell({notifs,setNotifs,userId}){
  const [open,setOpen]=useState(false);
  const mine=notifs.filter(n=>!n.userId||n.userId===userId);
  const unread=mine.filter(n=>!n.read).length;
  return(
    <div style={{position:"relative"}}>
      <button onClick={()=>{setOpen(!open);if(!open)setNotifs(p=>p.map(n=>n.userId===userId||!n.userId?{...n,read:true}:n))}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:18}}>🔔</span>
        {unread>0&&<span style={{background:C.pink,color:"white",fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px"}}>{unread}</span>}
      </button>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 8px)",left:0,width:320,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,boxShadow:"0 16px 48px rgba(0,0,0,0.5)",zIndex:200,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{color:C.text,fontSize:13,fontWeight:700}}>الإشعارات</div>
            <button onClick={()=>setNotifs(p=>p.filter(n=>n.userId!==userId))} style={{background:"none",border:"none",color:C.textM,fontSize:11,cursor:"pointer",fontFamily:"Cairo"}}>مسح</button>
          </div>
          <div style={{maxHeight:300,overflowY:"auto"}}>
            {mine.length===0?<div style={{padding:"20px",textAlign:"center",color:C.textM,fontSize:13}}>لا توجد إشعارات</div>:
            mine.map(n=>(
              <div key={n.id} style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,background:n.read?"transparent":"rgba(232,121,160,0.04)"}}>
                <div style={{display:"flex",gap:8}}><div style={{width:7,height:7,borderRadius:"50%",background:n.read?C.textM:C.pink,flexShrink:0,marginTop:5}}/><div><div style={{color:C.text,fontSize:12,fontWeight:600,marginBottom:1}}>{n.title}</div><div style={{color:C.textS,fontSize:11,lineHeight:1.4}}>{n.body}</div><div style={{color:C.textM,fontSize:10,marginTop:3}}>{n.time}</div></div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ PDF GENERATOR ═══════════════════════════════════════════════════════════
function generatePDF(client, campaigns, users){
  const mb = users.find(u=>u.id===client.mb);
  const sm = users.find(u=>u.id===client.sm);
  const myCams = campaigns.filter(c=>c.clientId===client.id);
  const totalSpend = myCams.reduce((s,c)=>s+c.spend,0);
  const totalSales = myCams.reduce((s,c)=>s+(c.purchaseValue||0),0);
  const avgROAS = myCams.length?(myCams.reduce((s,c)=>s+c.roas,0)/myCams.length).toFixed(1):0;
  const today = new Date().toLocaleDateString("ar-EG");

  const html = `<!DOCTYPE html><html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>تقرير ${client.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Cairo,sans-serif;background:#fff;color:#111;direction:rtl;padding:40px}
  .header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #E879A0;padding-bottom:20px;margin-bottom:30px}
  .logo-text{font-size:28px;font-weight:900;background:linear-gradient(135deg,#E879A0,#7B6FE0);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .logo-sub{font-size:10px;letter-spacing:4px;color:#7B6FE0;font-weight:700}
  .client-name{font-size:22px;font-weight:800;color:#111}
  .date{color:#666;font-size:13px;margin-top:4px}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:30px}
  .kpi{background:#f8f9ff;border:1px solid #e8eaf6;border-radius:12px;padding:16px;text-align:center}
  .kpi-val{font-size:22px;font-weight:900;color:#7B6FE0;margin-bottom:4px}
  .kpi-label{font-size:11px;color:#666}
  .section-title{font-size:16px;font-weight:700;color:#111;margin-bottom:14px;padding-bottom:8px;border-bottom:2px solid #f0f0f0}
  .camp-card{background:#fafafa;border:1px solid #eee;border-radius:10px;padding:14px;margin-bottom:12px}
  .camp-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
  .plat-tag{background:#7B6FE022;color:#7B6FE0;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700}
  .roas-val{font-size:18px;font-weight:900;color:#34D399}
  .metrics{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
  .metric{text-align:center;background:#fff;border:1px solid #f0f0f0;border-radius:8px;padding:8px 4px}
  .metric-val{font-size:13px;font-weight:700;color:#333;margin-bottom:2px}
  .metric-label{font-size:9px;color:#999}
  .team{margin-top:24px;padding:16px;background:#fdf4ff;border-radius:12px;border:1px solid #e9d5ff}
  .team-title{font-size:13px;font-weight:700;color:#7B6FE0;margin-bottom:10px}
  .team-row{display:flex;gap:20px}
  .team-item{font-size:12px;color:#555}
  .team-item span{font-weight:700;color:#333}
  .footer{margin-top:30px;text-align:center;color:#999;font-size:11px;border-top:1px solid #eee;padding-top:16px}
  .renewal{margin-top:16px;background:${client.roas>=3?"#f0fdf4":"#fff7ed"};border:1px solid ${client.roas>=3?"#86efac":"#fed7aa"};border-radius:10px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center}
  .renew-label{font-size:12px;color:#666}
  .renew-val{font-size:15px;font-weight:700;color:${client.roas>=3?"#16a34a":"#ea580c"}}
</style></head><body>
<div class="header">
  <div><div class="logo-text">وميض</div><div class="logo-sub">WAMEED MEDIA</div></div>
  <div style="text-align:left"><div class="client-name">${client.name}</div><div class="date">تقرير بتاريخ: ${today}</div></div>
</div>

<div class="kpis">
  <div class="kpi"><div class="kpi-val">${avgROAS}</div><div class="kpi-label">متوسط ROAS</div></div>
  <div class="kpi"><div class="kpi-val">${totalSpend.toLocaleString()} SAR</div><div class="kpi-label">إجمالي الإنفاق</div></div>
  <div class="kpi"><div class="kpi-val">${totalSales.toLocaleString()} SAR</div><div class="kpi-label">إجمالي المبيعات</div></div>
  <div class="kpi"><div class="kpi-val">${myCams.reduce((s,c)=>s+c.purchases,0)}</div><div class="kpi-label">إجمالي الطلبات</div></div>
</div>

<div class="section-title">نتائج الحملات لكل منصة</div>
${myCams.map(c=>`
<div class="camp-card">
  <div class="camp-head">
    <span class="plat-tag">${c.platform}</span>
    <span class="roas-val">ROAS ${c.roas}</span>
  </div>
  <div class="metrics">
    <div class="metric"><div class="metric-val">${c.spend.toLocaleString()} SAR</div><div class="metric-label">الإنفاق</div></div>
    <div class="metric"><div class="metric-val">${c.clicks.toLocaleString()}</div><div class="metric-label">Clicks</div></div>
    <div class="metric"><div class="metric-val">${(c.impressions/1000).toFixed(0)}k</div><div class="metric-label">Impressions</div></div>
    <div class="metric"><div class="metric-val">${c.ctr}%</div><div class="metric-label">CTR</div></div>
    <div class="metric"><div class="metric-val">${c.purchases}</div><div class="metric-label">Purchases</div></div>
    <div class="metric"><div class="metric-val">${(c.purchaseValue/1000).toFixed(0)}k SAR</div><div class="metric-label">القيمة</div></div>
  </div>
</div>`).join("")}

<div class="renewal">
  <div><div class="renew-label">حالة الاشتراك</div><div class="renew-val">${client.status==="active"?"نشط ✓":"موقوف"}</div></div>
  <div style="text-align:left"><div class="renew-label">الباقة</div><div class="renew-val">${client.pkg.toLocaleString()} SAR / شهر</div></div>
  <div style="text-align:left"><div class="renew-label">تنتهي في</div><div class="renew-val">${new Date(client.end)>new Date()?`${Math.ceil((new Date(client.end)-new Date())/86400000)} يوم`:"انتهت"}</div></div>
</div>

<div class="team">
  <div class="team-title">الفريق المسؤول</div>
  <div class="team-row">
    ${mb?`<div class="team-item">Media Buyer: <span>${mb.name}</span></div>`:""}
    ${sm?`<div class="team-item">Social Media: <span>${sm.name}</span></div>`:""}
    <div class="team-item">المنصات: <span>${client.platforms.join(" · ")}</span></div>
  </div>
</div>

<div class="footer">وميض للتسويق الرقمي · تقرير خاص بـ ${client.name} · ${today} · لا يُشارك هذا التقرير مع أطراف أخرى</div>
</body></html>`;

  const win = window.open("","_blank");
  if(win){
    win.document.write(html);
    win.document.close();
    setTimeout(()=>win.print(),800);
  }
}

// ═══ CLIENT PORTAL ════════════════════════════════════════════════════════════
function ClientPortal({clientData, campaigns, users, onLogout, satisfaction, setSatisfaction}){
  const [page, setPage] = useState("overview");
  const [ratingDone,setRatingDone] = useState(false);
  const [ratingF,setRatingF] = useState({roas:0,speed:0,reports:0,overall:0,comment:""});
  const myCams = campaigns.filter(c=>c.clientId===clientData.id);
  const mb = users.find(u=>u.id===clientData.mb);
  const sm = users.find(u=>u.id===clientData.sm);
  const totalSpend = myCams.reduce((s,c)=>s+c.spend,0);
  const totalSales = myCams.reduce((s,c)=>s+(c.purchaseValue||0),0);
  const totalPurchases = myCams.reduce((s,c)=>s+c.purchases,0);
  const avgROAS = myCams.length?(myCams.reduce((s,c)=>s+c.roas,0)/myCams.length).toFixed(1):0;
  const d = dl(clientData.end);

  const NAV_CLIENT=[
    {id:"overview",icon:"⬡",label:"نظرة عامة"},
    {id:"campaigns",icon:"📊",label:"نتائج الحملات"},
    {id:"reports",icon:"📋",label:"التقارير"},
    {id:"rating",icon:"⭐",label:"تقييم الخدمة"},
    {id:"subscription",icon:"🔄",label:"الاشتراك"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Cairo",direction:"rtl",display:"flex"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet"/>
      {/* Sidebar */}
      <div style={{width:220,background:C.bgCard,borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",height:"100vh",position:"fixed",right:0,top:0}}>
        <div style={{padding:"20px 18px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <svg width={22} height={22} viewBox="0 0 60 60" fill="none"><defs><linearGradient id="sgc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#E879A0"/><stop offset="100%" stopColor="#7B6FE0"/></linearGradient></defs><path d="M30 2 L36 22 L56 22 L40 35 L46 55 L30 43 L14 55 L20 35 L4 22 L24 22 Z" fill="url(#sgc)"/></svg>
            <div><div style={{color:C.text,fontSize:14,fontWeight:900,lineHeight:1.1}}>وميض</div><div style={{fontSize:8,fontWeight:700,letterSpacing:3,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>WAMEED</div></div>
          </div>
          <div style={{background:`${C.purple}15`,border:`1px solid ${C.purple}33`,borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:10,color:C.textS,marginBottom:3}}>بوابة العميل</div>
            <div style={{color:C.text,fontSize:13,fontWeight:700}}>{clientData.name}</div>
            <div style={{marginTop:5}}><Bdg label={clientData.status==="active"?"نشط":"موقوف"} color={clientData.status==="active"?C.green:C.orange}/></div>
          </div>
        </div>
        <nav style={{flex:1,padding:"10px 8px"}}>
          {NAV_CLIENT.map(n=>{
            const a=page===n.id;
            return(<button key={n.id} onClick={()=>setPage(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,marginBottom:2,background:a?`${C.pink}18`:"transparent",border:a?`1px solid ${C.pink}33`:"1px solid transparent",cursor:"pointer",fontFamily:"Cairo",color:a?C.pink:C.textS,fontSize:13,fontWeight:a?600:400,textAlign:"right"}}
              onMouseEnter={e=>{if(!a)e.currentTarget.style.background="rgba(255,255,255,0.04)"}}
              onMouseLeave={e=>{if(!a)e.currentTarget.style.background="transparent"}}>
              <span style={{fontSize:15}}>{n.icon}</span>{n.label}
            </button>);
          })}
        </nav>
        <div style={{padding:14,borderTop:`1px solid ${C.border}`}}>
          <div style={{marginBottom:10,padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:9}}>
            {mb&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><Av text={mb.avatar} color={RC.media_buyer} size={24}/><div><div style={{color:C.text,fontSize:11,fontWeight:600}}>{mb.name}</div><div style={{color:C.textM,fontSize:9}}>Media Buyer</div></div></div>}
            {sm&&<div style={{display:"flex",alignItems:"center",gap:8}}><Av text={sm.avatar} color={RC.social_media} size={24}/><div><div style={{color:C.text,fontSize:11,fontWeight:600}}>{sm.name}</div><div style={{color:C.textM,fontSize:9}}>Social Media</div></div></div>}
          </div>
          <button onClick={onLogout} style={{width:"100%",padding:"7px",borderRadius:9,fontFamily:"Cairo",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",color:C.red,fontSize:12,fontWeight:600,cursor:"pointer"}}>خروج</button>
        </div>
      </div>

      {/* Main content */}
      <main style={{flex:1,marginRight:220,overflowY:"auto",minHeight:"100vh",paddingBottom:40}}>
        {/* Top bar */}
        <div style={{padding:"18px 32px",borderBottom:`1px solid ${C.border}`,background:`${C.bg}ee`,backdropFilter:"blur(10px)",position:"sticky",top:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{color:C.text,fontSize:16,fontWeight:700}}>مرحباً بك، {clientData.name} 👋</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{color:C.textS,fontSize:12}}>آخر تحديث: اليوم</div>
            <button onClick={()=>generatePDF(clientData,campaigns,users)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",background:C.grad,border:"none",borderRadius:10,color:"white",fontSize:12,fontWeight:700,fontFamily:"Cairo",cursor:"pointer"}}>
              📥 تحميل التقرير PDF
            </button>
          </div>
        </div>

        <div style={{padding:"28px 32px"}}>
          {/* OVERVIEW */}
          {page==="overview"&&(
            <div>
              <div style={{color:C.text,fontSize:20,fontWeight:800,marginBottom:6}}>نظرة عامة على أدائك</div>
              <div style={{color:C.textS,fontSize:13,marginBottom:24}}>جميع الأرقام منذ بداية التعامل · {clientData.platforms.join(" · ")}</div>

              {/* Main KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
                {[
                  {label:"متوسط ROAS",value:avgROAS,icon:"📈",color:avgROAS>=3?C.green:C.orange,sub:"عائد على الإنفاق"},
                  {label:"إجمالي المبيعات",value:`${totalSales.toLocaleString()} SAR`,icon:"💰",color:C.green,sub:"قيمة المبيعات الكلية"},
                  {label:"إجمالي الإنفاق",value:`${totalSpend.toLocaleString()} SAR`,icon:"💸",color:C.orange,sub:"الميزانية الإعلانية"},
                  {label:"إجمالي الطلبات",value:totalPurchases.toLocaleString(),icon:"🛒",color:C.purple,sub:"عدد عمليات الشراء"},
                ].map((k,i)=>(
                  <Card key={i}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                      <div style={{width:40,height:40,borderRadius:11,background:`${k.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{k.icon}</div>
                    </div>
                    <div style={{color:k.color,fontSize:22,fontWeight:800,marginBottom:3}}>{k.value}</div>
                    <div style={{color:C.textS,fontSize:12}}>{k.label}</div>
                    <div style={{color:C.textM,fontSize:11,marginTop:2}}>{k.sub}</div>
                  </Card>
                ))}
              </div>

              {/* Platform breakdown */}
              <Card s={{marginBottom:20}}>
                <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:16}}>أداء كل منصة</div>
                <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.max(1,myCams.length)},1fr)`,gap:12}}>
                  {myCams.length===0?<div style={{color:C.textM,fontSize:13,textAlign:"center",padding:"20px"}}>لا توجد بيانات حملات بعد</div>:
                  myCams.map(c=>(
                    <div key={c.id} style={{textAlign:"center",padding:"18px 12px",background:"rgba(255,255,255,0.03)",borderRadius:14,border:`1px solid ${C.border}`}}>
                      <PT name={c.platform}/>
                      <div style={{color:c.roas>=3?C.green:C.orange,fontSize:26,fontWeight:900,margin:"12px 0 4px"}}>ROAS {c.roas}</div>
                      <div style={{color:C.textS,fontSize:12,marginBottom:12}}>عائد على الإنفاق</div>
                      <div style={{display:"flex",justifyContent:"center",gap:16}}>
                        <div style={{textAlign:"center"}}><div style={{color:C.text,fontSize:14,fontWeight:700}}>{c.spend.toLocaleString()}</div><div style={{color:C.textM,fontSize:10}}>SAR إنفاق</div></div>
                        <div style={{textAlign:"center"}}><div style={{color:C.green,fontSize:14,fontWeight:700}}>{c.purchases}</div><div style={{color:C.textM,fontSize:10}}>طلب</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Subscription alert */}
              {d<=14&&d>0&&(
                <div style={{background:d<=7?"rgba(248,113,113,0.08)":"rgba(245,158,11,0.08)",border:`1px solid ${d<=7?"rgba(248,113,113,0.25)":"rgba(245,158,11,0.25)"}`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:24}}>{d<=7?"🚨":"⚠️"}</span>
                  <div><div style={{color:d<=7?C.red:C.orange,fontSize:13,fontWeight:700}}>اشتراكك ينتهي خلال {d} يوم</div><div style={{color:C.textS,fontSize:12,marginTop:2}}>تواصل مع فريق وميض للتجديد والاستمرار</div></div>
                </div>
              )}
            </div>
          )}

          {/* CAMPAIGNS */}
          {page==="campaigns"&&(
            <div>
              <div style={{color:C.text,fontSize:20,fontWeight:800,marginBottom:6}}>نتائج الحملات الإعلانية</div>
              <div style={{color:C.textS,fontSize:13,marginBottom:24}}>تفاصيل أداء حملاتك على كل منصة</div>
              {myCams.length===0?<Card s={{textAlign:"center",padding:"60px"}}><div style={{fontSize:40,marginBottom:12}}>📊</div><div style={{color:C.textS,fontSize:14}}>لا توجد بيانات حملات بعد</div></Card>:
              myCams.map(c=>(
                <Card key={c.id} s={{marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}><PT name={c.platform}/><span style={{color:C.textM,fontSize:12}}>أسبوع {fmtDate(c.week)}</span></div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{color:c.roas>=3?C.green:C.orange,fontSize:22,fontWeight:900}}>ROAS {c.roas}</div>
                      <div style={{fontSize:11,color:c.roas>=3?C.green:C.orange,background:c.roas>=3?`${C.green}18`:`${C.orange}18`,border:`1px solid ${c.roas>=3?C.green:C.orange}33`,borderRadius:8,padding:"3px 8px"}}>{c.roas>=4?"ممتاز":c.roas>=3?"جيد":"يحتاج تحسين"}</div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
                    {[["الإنفاق",`${c.spend.toLocaleString()} SAR`,C.orange],["إجمالي المبيعات",`${(c.purchaseValue||0).toLocaleString()} SAR`,C.green],["عدد الطلبات",c.purchases,C.purple]].map(([l,v,co])=>(
                      <div key={l} style={{textAlign:"center",padding:"14px",background:"rgba(255,255,255,0.03)",borderRadius:12}}>
                        <div style={{color:co,fontSize:18,fontWeight:800,marginBottom:4}}>{v}</div>
                        <div style={{color:C.textM,fontSize:11}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                    {[["Clicks",c.clicks.toLocaleString()],["Impressions",(c.impressions/1000).toFixed(0)+"k"],["CTR",c.ctr+"%"],["CPM",c.cpm+" SAR"]].map(([l,v])=>(
                      <div key={l} style={{textAlign:"center",padding:"10px 4px",background:"rgba(255,255,255,0.02)",borderRadius:8,border:`1px solid ${C.border}`}}>
                        <div style={{color:C.text,fontSize:13,fontWeight:700,marginBottom:2}}>{v}</div>
                        <div style={{color:C.textM,fontSize:10}}>{l}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* REPORTS */}
          {page==="reports"&&(
            <div>
              <div style={{color:C.text,fontSize:20,fontWeight:800,marginBottom:6}}>تقاريرك</div>
              <div style={{color:C.textS,fontSize:13,marginBottom:24}}>تقارير أدائك — يمكنك تحميلها بصيغة PDF</div>
              {[
                {title:`تقرير مايو 2025 — ${clientData.name}`,date:"15 مايو 2025",platforms:clientData.platforms,status:"جاهز"},
                {title:`تقرير أبريل 2025 — ${clientData.name}`,date:"30 أبريل 2025",platforms:clientData.platforms,status:"جاهز"},
                {title:`تقرير مارس 2025 — ${clientData.name}`,date:"31 مارس 2025",platforms:clientData.platforms,status:"جاهز"},
              ].map((r,i)=>(
                <Card key={i} s={{marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:44,height:44,borderRadius:12,background:`${C.purple}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📋</div>
                      <div>
                        <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:5}}>{r.title}</div>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          {r.platforms.map(p=><PT key={p} name={p}/>)}
                          <span style={{color:C.textM,fontSize:11}}>{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <Bdg label={r.status} color={C.green}/>
                      <button onClick={()=>generatePDF(clientData,campaigns,users)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",background:C.grad,border:"none",borderRadius:10,color:"white",fontSize:12,fontWeight:700,fontFamily:"Cairo",cursor:"pointer"}}>
                        📥 تحميل PDF
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
              <div style={{background:"rgba(123,111,224,0.08)",border:"1px solid rgba(123,111,224,0.2)",borderRadius:12,padding:"14px 18px",marginTop:16,display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:20}}>💡</span>
                <div style={{color:C.textS,fontSize:12}}>التقارير تُولَّد تلقائياً بناءً على أداء حملاتك الفعلي. لطلب تقرير مخصص تواصل مع فريق وميض.</div>
              </div>
            </div>
          )}

          {/* SUBSCRIPTION */}
          {page==="rating"&&(
            <div>
              <div style={{color:C.text,fontSize:20,fontWeight:800,marginBottom:6}}>تقييم الخدمة ⭐</div>
              <div style={{color:C.textS,fontSize:13,marginBottom:24}}>رأيك يهمنا — ساعدنا نتحسن لك أكثر</div>

              {ratingDone?(
                <Card s={{textAlign:"center",padding:"60px 20px"}}>
                  <div style={{fontSize:56,marginBottom:16}}>🎉</div>
                  <div style={{color:C.green,fontSize:20,fontWeight:800,marginBottom:8}}>شكراً على تقييمك!</div>
                  <div style={{color:C.textS,fontSize:13,marginBottom:20}}>تقييمك وصل لفريق وميض وسيتم الأخذ به لتحسين الخدمة</div>
                  <button onClick={()=>setRatingDone(false)} style={{padding:"9px 20px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:10,color:C.textS,fontSize:13,fontFamily:"Cairo",cursor:"pointer"}}>إرسال تقييم جديد</button>
                </Card>
              ):(
                <div>
                  {/* Rating questions */}
                  {[
                    {key:"roas",icon:"📈",title:"أداء الحملات والـ ROAS",desc:"هل أنت راضٍ عن نتائج الحملات الإعلانية؟"},
                    {key:"speed",icon:"⚡",title:"سرعة الرد والتواصل",desc:"كيف تقيّم سرعة استجابة الفريق لاستفساراتك؟"},
                    {key:"reports",icon:"📋",title:"جودة التقارير",desc:"هل التقارير واضحة وشاملة وفي وقتها؟"},
                    {key:"overall",icon:"🌟",title:"التقييم العام",desc:"ما مدى رضاك العام عن خدمة وميض؟"},
                  ].map(({key,icon,title,desc})=>(
                    <Card key={key} s={{marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
                        <div style={{width:44,height:44,borderRadius:12,background:`${C.purple}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
                        <div><div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:3}}>{title}</div><div style={{color:C.textS,fontSize:12}}>{desc}</div></div>
                      </div>
                      <div style={{display:"flex",gap:10,alignItems:"center"}}>
                        {[1,2,3,4,5].map(n=>(
                          <button key={n} onClick={()=>setRatingF(p=>({...p,[key]:n}))} style={{width:48,height:48,borderRadius:12,border:`2px solid ${ratingF[key]>=n?"#FFD700":C.border}`,background:ratingF[key]>=n?"rgba(255,215,0,0.15)":"rgba(255,255,255,0.03)",cursor:"pointer",fontSize:24,transition:"all .15s",transform:ratingF[key]===n?"scale(1.15)":"scale(1)"}}>
                            ★
                          </button>
                        ))}
                        {ratingF[key]>0&&(
                          <div style={{marginRight:8,display:"flex",flexDirection:"column"}}>
                            <span style={{color:"#FFD700",fontSize:16,fontWeight:800}}>{ratingF[key]}/5</span>
                            <span style={{color:C.textM,fontSize:10}}>{["","ضعيف","مقبول","جيد","جيد جداً","ممتاز"][ratingF[key]]}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}

                  {/* Comment */}
                  <Card s={{marginBottom:20}}>
                    <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:10}}>💬 تعليق إضافي (اختياري)</div>
                    <textarea value={ratingF.comment} onChange={e=>setRatingF(p=>({...p,comment:e.target.value}))} placeholder="شاركنا رأيك بحرية — ما تحب، ما تريد تحسينه..."
                      style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13,outline:"none",fontFamily:"Cairo",boxSizing:"border-box",resize:"vertical",minHeight:90,direction:"rtl"}}/>
                  </Card>

                  {/* Overall score preview */}
                  {(ratingF.roas||ratingF.speed||ratingF.reports||ratingF.overall)>0&&(
                    <div style={{background:`${C.purple}10`,border:`1px solid ${C.purple}25`,borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:C.textS,fontSize:13}}>متوسط تقييمك الكلي</span>
                      <span style={{color:C.purple,fontSize:20,fontWeight:800}}>
                        {([ratingF.roas,ratingF.speed,ratingF.reports,ratingF.overall].filter(x=>x>0).reduce((a,b)=>a+b,0)/[ratingF.roas,ratingF.speed,ratingF.reports,ratingF.overall].filter(x=>x>0).length).toFixed(1)} ★
                      </span>
                    </div>
                  )}

                  <button
                    disabled={!ratingF.overall&&!ratingF.roas}
                    onClick={()=>{
                      const avg=([ratingF.roas,ratingF.speed,ratingF.reports,ratingF.overall].filter(x=>x>0).reduce((a,b)=>a+b,0)/Math.max(1,[ratingF.roas,ratingF.speed,ratingF.reports,ratingF.overall].filter(x=>x>0).length));
                      setSatisfaction(p=>[...p,{id:Date.now(),clientId:clientData.id,month:new Date().toISOString().slice(0,7),score:Math.round(avg),roas:ratingF.roas,speed:ratingF.speed,reports:ratingF.reports,overall:ratingF.overall,comment:ratingF.comment}]);
                      setRatingDone(true);
                      setRatingF({roas:0,speed:0,reports:0,overall:0,comment:""});
                    }}
                    style={{width:"100%",padding:14,background:!ratingF.overall&&!ratingF.roas?"rgba(255,255,255,0.06)":C.grad,border:"none",borderRadius:12,color:"white",fontSize:14,fontWeight:700,fontFamily:"Cairo",cursor:!ratingF.overall&&!ratingF.roas?"not-allowed":"pointer",boxShadow:!ratingF.overall&&!ratingF.roas?"none":"0 6px 20px rgba(232,121,160,0.25)"}}>
                    ⭐ إرسال التقييم
                  </button>
                  {!ratingF.overall&&!ratingF.roas&&<div style={{color:C.textM,fontSize:11,textAlign:"center",marginTop:8}}>يرجى تقييم عنصر واحد على الأقل</div>}
                </div>
              )}
            </div>
          )}

          {page==="subscription"&&(
            <div>
              <div style={{color:C.text,fontSize:20,fontWeight:800,marginBottom:6}}>تفاصيل الاشتراك</div>
              <div style={{color:C.textS,fontSize:13,marginBottom:24}}>معلومات باقتك وتواريخ الاشتراك</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <Card>
                  <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:16}}>بيانات الباقة</div>
                  {[["اسم الباقة","باقة "+clientData.pkg.toLocaleString()+" SAR"],["القيمة الشهرية",clientData.pkg.toLocaleString()+" SAR"],["المنصات",clientData.platforms.join(" · ")],["تاريخ البداية",fmtDate(clientData.start)],["تاريخ الانتهاء",fmtDate(clientData.end)],["الحالة",clientData.status==="active"?"✅ نشط":"⏸ موقوف"]].map(([l,v],i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                      <span style={{color:C.textS,fontSize:12}}>{l}</span>
                      <span style={{color:C.text,fontSize:12,fontWeight:600}}>{v}</span>
                    </div>
                  ))}
                </Card>
                <Card>
                  <div style={{color:C.text,fontSize:14,fontWeight:700,marginBottom:16}}>حالة الاشتراك</div>
                  <div style={{textAlign:"center",padding:"30px 0"}}>
                    <div style={{fontSize:56,marginBottom:12}}>{d>0?"📅":"⏰"}</div>
                    <div style={{color:d<=7?C.red:d<=14?C.orange:C.green,fontSize:36,fontWeight:900,marginBottom:6}}>{d>0?`${d} يوم`:"انتهى"}</div>
                    <div style={{color:C.textS,fontSize:13,marginBottom:20}}>{d>0?"متبقي على انتهاء الاشتراك":"انتهى الاشتراك، تواصل للتجديد"}</div>
                    {d<=14&&<div style={{background:d<=7?`${C.red}15`:`${C.orange}15`,border:`1px solid ${d<=7?C.red:C.orange}33`,borderRadius:12,padding:"12px 16px",color:d<=7?C.red:C.orange,fontSize:12,fontWeight:600}}>
                      {d<=7?"🚨 يرجى التجديد فوراً للاستمرار":"⚠️ قارب الاشتراك على الانتهاء"}
                    </div>}
                  </div>
                  <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,textAlign:"center"}}>
                    <div style={{color:C.textM,fontSize:11,marginBottom:4}}>للتجديد أو الاستفسار</div>
                    <div style={{color:C.purple,fontSize:13,fontWeight:600}}>تواصل مع فريق وميض</div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ═══ LOGIN ════════════════════════════════════════════════════════════════════
function Login({onLogin}){
  const [em,setEm]=useState("");const [pw,setPw]=useState("");const [show,setShow]=useState(false);
  const [loading,setLoading]=useState(false);const [err,setErr]=useState("");const [foc,setFoc]=useState(null);
  const [shake,setShake]=useState(false);const [mt,setMt]=useState(false);
  useEffect(()=>{setTimeout(()=>setMt(true),80)},[]);

  const go=async()=>{
    if(!em||!pw){setErr("أدخل البيانات");setShake(true);setTimeout(()=>setShake(false),600);return;}
    setLoading(true);setErr("");
    try{
      // 1. Check team members FIRST (local users from localStorage or initial data)
      const localUsers=JSON.parse(localStorage.getItem("w_users")||JSON.stringify(IU));
      const teamUser=localUsers.find(u=>u.email===em&&u.password===pw);
      if(teamUser){onLogin({type:"team",...teamUser});setLoading(false);return;}

      // 2. Try Supabase Auth for team members
      if(window.__SB){
        try{
          const {data,error}=await window.__SB.auth.signInWithPassword({email:em,password:pw});
          if(!error&&data?.user){
            const {data:profile}=await window.__SB.from("users").select("*").eq("email",em).single();
            if(profile){onLogin({type:"team",...profile,avatar:profile.avatar||ini(profile.name)});setLoading(false);return;}
          }
        }catch(e){}
      }

      // 3. Check client portal accounts LAST
      const allClients=JSON.parse(localStorage.getItem("w_clients")||JSON.stringify(IC));
      const clientUser=allClients.find(c=>c.email===em&&c.password===pw);
      if(clientUser){onLogin({type:"client",...clientUser});setLoading(false);return;}

      throw new Error("not found");
    }catch(e){
      setErr("البريد أو كلمة المرور غير صحيحة");
      setShake(true);setTimeout(()=>setShake(false),600);
    }
    setLoading(false);
  };
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Cairo",direction:"rtl",position:"relative",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet"/>
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle, rgba(123,111,224,0.10) 0%, transparent 70%)",top:-200,right:-100,pointerEvents:"none"}}/>
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle, rgba(232,121,160,0.08) 0%, transparent 70%)",bottom:-150,left:0,pointerEvents:"none"}}/>
      <div style={{display:"flex",width:"100%",maxWidth:900,margin:"0 auto",minHeight:"100vh",opacity:mt?1:0,transition:"opacity .5s"}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:60,borderLeft:`1px solid ${C.border}`,background:"rgba(13,21,38,0.5)"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none" style={{marginBottom:16,filter:"drop-shadow(0 0 18px rgba(232,121,160,0.4))"}}>
              <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#E879A0"/><stop offset="100%" stopColor="#7B6FE0"/></linearGradient></defs>
              <path d="M30 2 L36 22 L56 22 L40 35 L46 55 L30 43 L14 55 L20 35 L4 22 L24 22 Z" fill="url(#lg)"/>
            </svg>
            <div style={{color:"white",fontSize:42,fontWeight:900,lineHeight:1,marginBottom:5}}>وميض</div>
            <div style={{fontSize:13,fontWeight:700,letterSpacing:7,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>WAMEED</div>
          </div>
          {[["📌","متابعات يومية لكل عميل"],["📊","تحليل الحملات عبر كل المنصات"],["🤖","AI تحليل ذكي وتوصيات"],["🏆","Scorecard وتقييم الأداء"],["🔔","إشعارات فورية"],["📉","Churn Tracker"]].map(([ic,t],i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,width:"100%",maxWidth:280}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{ic}</div>
              <div style={{color:"rgba(255,255,255,0.5)",fontSize:12}}>{t}</div>
            </div>
          ))}
          <div style={{marginTop:"auto",paddingTop:30,color:"rgba(255,255,255,0.2)",fontSize:11,textAlign:"center"}}>© 2025 وميض · بُني بواسطة أحمد علي</div>
        </div>
        <div style={{width:420,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"50px 44px"}}>
          <div style={{width:"100%",animation:shake?"sh .5s ease":"none"}}>
            <div style={{marginBottom:28}}><div style={{fontSize:23,fontWeight:800,color:"white",marginBottom:5}}>تسجيل الدخول</div><div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>أدخل بياناتك للوصول للنظام</div></div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.55)",marginBottom:6}}>البريد الإلكتروني</label>
              <div style={{position:"relative"}}>
                <input type="email" value={em} onChange={e=>{setEm(e.target.value);setErr("");}} onFocus={()=>setFoc("e")} onBlur={()=>setFoc(null)} placeholder="example@wameed.sa"
                  style={{width:"100%",padding:"12px 16px 12px 40px",background:foc==="e"?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.04)",border:`1px solid ${foc==="e"?"rgba(232,121,160,0.5)":err?"rgba(248,113,113,0.4)":C.border}`,borderRadius:12,color:"white",fontSize:13,outline:"none",fontFamily:"Cairo",boxSizing:"border-box",direction:"ltr",textAlign:"left"}}/>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:foc==="e"?C.pink:"rgba(255,255,255,0.25)",fontSize:15}}>✉</span>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.55)",marginBottom:6}}>كلمة المرور</label>
              <div style={{position:"relative"}}>
                <input type={show?"text":"password"} value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onFocus={()=>setFoc("p")} onBlur={()=>setFoc(null)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••"
                  style={{width:"100%",padding:"12px 44px",background:foc==="p"?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.04)",border:`1px solid ${foc==="p"?"rgba(123,111,224,0.5)":err?"rgba(248,113,113,0.4)":C.border}`,borderRadius:12,color:"white",fontSize:13,outline:"none",fontFamily:"Cairo",boxSizing:"border-box",letterSpacing:show?"normal":"2px"}}/>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:foc==="p"?C.purple:"rgba(255,255,255,0.25)",fontSize:15}}>🔒</span>
                <button onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.3)",fontSize:13}}>{show?"🙈":"👁"}</button>
              </div>
            </div>
            {err&&<div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:14,color:"#FCA5A5",fontSize:12,display:"flex",alignItems:"center",gap:8}}>⚠️ {err}</div>}
            <button onClick={go} disabled={loading} style={{width:"100%",padding:13,background:loading?"rgba(255,255,255,0.08)":C.grad,border:"none",borderRadius:12,color:"white",fontSize:14,fontWeight:700,fontFamily:"Cairo",cursor:loading?"not-allowed":"pointer",boxShadow:loading?"none":"0 8px 28px rgba(232,121,160,0.25)"}}>
              {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}><span style={{width:15,height:15,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>جاري التحقق...</span>:"دخول إلى النظام →"}
            </button>
          </div>
        </div>
      </div>
      <style>{`input::placeholder{color:rgba(255,255,255,0.18)}@keyframes spin{to{transform:rotate(360deg)}}@keyframes sh{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}button:hover:not(:disabled){filter:brightness(1.08)}`}</style>
    </div>
  );
}

// ═══ APP ══════════════════════════════════════════════════════════════════════
// Helper: save to Supabase + localStorage fallback
const SB = typeof window !== "undefined" && window.__SB;
const save = async (table, data) => {
  if(window.__SB) try { await window.__SB.from(table).insert(data); } catch(e) {}
};
const update = async (table, data, match) => {
  if(window.__SB) try { await window.__SB.from(table).update(data).match(match); } catch(e) {}
};
const del = async (table, match) => {
  if(window.__SB) try { await window.__SB.from(table).delete().match(match); } catch(e) {}
};
const ls = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch(e) { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} }
};

export default function App(){
  const [user, setUserRaw] = useState(() => ls.get("w_currentUser", null));
  const setUser = (u) => { setUserRaw(u); if(u) ls.set("w_currentUser", u); else ls.set("w_currentUser", null); };
  const [page, setPage] = useState("dashboard");
  const [dbReady, setDbReady] = useState(false);

  // ─── STATE (localStorage as persistence) ──────────────────────────────────
  const [users, setUsersRaw] = useState(() => ls.get("w_users", IU));
  const [clients, setClientsRaw] = useState(() => ls.get("w_clients", IC));
  const [followups, setFollowupsRaw] = useState(() => ls.get("w_followups", IFU));
  const [campaigns, setCampaignsRaw] = useState(() => ls.get("w_campaigns", ICAM));
  const [tasks, setTasksRaw] = useState(() => ls.get("w_tasks", ITasks));
  const [payroll, setPayrollRaw] = useState(() => ls.get("w_payroll", []));
  const [satisfaction, setSatisfactionRaw] = useState(() => ls.get("w_satisfaction", ISAT));
  const [creativeTasks, setCreativeTasksRaw] = useState(() => ls.get("w_creative", []));
  const [targets, setTargets] = useState(ITARGETS);
  const [notes, setNotes] = useState(INOTES);
  const [notifs, setNotifs] = useState(INF);

  // ─── PERSISTENT SETTERS ───────────────────────────────────────────────────
  const mk = (key, setter) => (fn) => setter(prev => {
    const next = typeof fn === "function" ? fn(prev) : fn;
    ls.set(key, next);
    return next;
  });
  const setUsers = mk("w_users", setUsersRaw);
  const setClients = mk("w_clients", setClientsRaw);
  const setFollowups = mk("w_followups", setFollowupsRaw);
  const setCampaigns = mk("w_campaigns", setCampaignsRaw);
  const setTasks = mk("w_tasks", setTasksRaw);
  const setPayroll = mk("w_payroll", setPayrollRaw);
  const setSatisfaction = mk("w_satisfaction", setSatisfactionRaw);
  const setCreativeTasks = mk("w_creative", setCreativeTasksRaw);

  // ─── SUPABASE INIT ────────────────────────────────────────────────────────
  useEffect(() => {
    // Hardcoded directly — Vercel's env var injection for this project wasn't
    // reliably reaching the build, so we bypass it entirely. The publishable
    // key is safe to ship in client code by design; real protection lives in
    // the RLS policies on each table.
    const url = "https://jokdohhukkbrergfauwc.supabase.co";
    const key = "sb_publishable_DkwiFcNG0im57wftL-lATw_l4Z1TCvs";
    if (!url || !key) return;
    import("https://esm.sh/@supabase/supabase-js@2").then(({createClient}) => {
      window.__SB = createClient(url, key);
      loadFromDB();
    }).catch((err) => console.error("Failed to load supabase-js:", err));
  }, []);

  // ─── CREATIVE MODULE — الجوجل شيت هو قاعدة البيانات، مباشرة، من غير Supabase ─
  const CREATIVE_API = "https://jokdohhukkbrergfauwc.supabase.co/functions/v1/creative-sheet-api";
  const CREATIVE_API_SECRET = "wameed-creative-9f3a7b2e1d8c4f6a";
  const loadCreativeFromSheet = async () => {
    try {
      const res = await fetch(CREATIVE_API, { headers: { "X-App-Secret": CREATIVE_API_SECRET } });
      const data = await res.json();
      if (data?.tasks) { setCreativeTasksRaw(data.tasks); ls.set("w_creative", data.tasks); }
    } catch(e) { console.error("Failed to load creative tasks from sheet:", e); }
  };
  useEffect(() => { if (page === "creative") loadCreativeFromSheet(); }, [page]);

  const loadFromDB = async () => {
    if (!window.__SB) return;
    try {
      const [
        {data:dU}, {data:dC}, {data:dF}, {data:dCa},
        {data:dT}, {data:dS}, {data:dP}
      ] = await Promise.all([
        window.__SB.from("users").select("*"),
        window.__SB.from("clients").select("*"),
        window.__SB.from("follow_ups").select("*").order("created_at",{ascending:false}),
        window.__SB.from("campaigns").select("*").order("week_start",{ascending:false}),
        window.__SB.from("tasks").select("*"),
        window.__SB.from("satisfaction").select("*"),
        window.__SB.from("payroll").select("*"),
      ]);
      if(dU?.length) {
        const v=dU.map(u=>({...u,avatar:u.avatar||ini(u.name)}));
        // الأدمن الأساسي (IU[0]) لازم يفضل موجود دايمًا حتى لو قاعدة البيانات
        // فيها بيانات، عشان تسجيل الدخول ميتقفلش عليه أبدًا.
        const hasSuperAdmin = v.some(u=>u.email===IU[0].email);
        const merged = hasSuperAdmin ? v : [IU[0], ...v];
        setUsersRaw(merged); ls.set("w_users",merged);
      }
      if(dC?.length) { const v=dC.map(c=>({...c,mb:c.mb_id,sm:c.sm_id,am:c.am_id,pkg:c.pkg_amount,start:c.start_date,end:c.end_date,spend:c.total_spend})); setClientsRaw(v); ls.set("w_clients",v); }
      if(dF?.length) { const v=dF.map(f=>({...f,clientId:f.client_id,userId:f.user_id,images:f.images||[]})); setFollowupsRaw(v); ls.set("w_followups",v); }
      if(dCa?.length) { const v=dCa.map(c=>({...c,clientId:c.client_id,week:c.week_start,purchaseValue:c.purchase_value})); setCampaignsRaw(v); ls.set("w_campaigns",v); }
      if(dT?.length) { const v=dT.map(t=>({...t,assignedTo:t.assigned_to,clientId:t.client_id,due:t.due_date})); setTasksRaw(v); ls.set("w_tasks",v); }
      if(dS?.length) { const v=dS.map(s=>({...s,clientId:s.client_id,score:s.score_overall,roas:s.score_roas,speed:s.score_speed,reports:s.score_reports})); setSatisfactionRaw(v); ls.set("w_satisfaction",v); }
      if(dP?.length) { const v=dP.map(p=>({...p,userId:p.user_id,base:p.base_salary})); setPayrollRaw(v); ls.set("w_payroll",v); }
      // creative_tasks بقى بيتقرا من الجوجل شيت مباشرة (loadCreativeFromSheet)، مش من هنا.
      setDbReady(true);
    } catch(e) { console.log("DB error:", e); }
  };

  // expose clients for client login
  useEffect(() => { window.__wameedClients = clients; }, [clients]);

  const addNotif = (n) => setNotifs(p => [{...n, id:Date.now(), time:"الآن", read:false}, ...p]);

  // late followup alerts
  useEffect(() => {
    if (!user || user.type === "client") return;
    clients.filter(c => c.status === "active").forEach(c => {
      const last = followups.filter(f => f.clientId === c.id).sort((a,b) => (b.date||"").localeCompare(a.date||""))[0];
      const diff = last ? Math.floor((new Date() - new Date(last.date)) / 86400000) : 999;
      if (diff > 1 && !notifs.find(n => n.type === "late" && n.body?.includes(c.name))) {
        addNotif({type:"late", title:"⚠️ تأخر فولو أب", body:`${c.name} — لم يُضَف فولو أب منذ ${diff===999?"البداية":`${diff} أيام`}`, userId:1});
      }
    });
  }, [followups]);

  // late creative-task alerts — deadline = task date + 4 days
  useEffect(() => {
    if (!user || user.type === "client") return;
    creativeTasks.filter(t => !t.done).forEach(t => {
      if (!t.deadLine || new Date(t.deadLine) >= new Date()) return;
      if (notifs.find(n => n.type === "creative_late" && n.creativeId === t.id)) return;
      const designer = users.find(u => u.id === t.designerId);
      addNotif({
        type: "creative_late",
        creativeId: t.id,
        title: "⚠️ تاسك كريتيف متأخر",
        body: `${t.agency}${designer ? " — " + designer.name : ""} — تجاوز الديدلاين (${fmtDate(t.deadLine)})`,
        userId: 1,
      });
      if (designer) addNotif({
        type: "creative_late",
        creativeId: t.id,
        title: "⚠️ عندك تاسك متأخر",
        body: `${t.agency} — كان لازم يتسلم بتاريخ ${fmtDate(t.deadLine)}`,
        userId: designer.id,
      });
    });
  }, [creativeTasks]);

  // ─── ROUTING ──────────────────────────────────────────────────────────────
  if (!user) return <Login onLogin={u => { setUser(u); setPage("dashboard"); }} />;

  if (user.type === "client") {
    const clientData = clients.find(c => c.id === user.id) || user;
    return <ClientPortal
      clientData={clientData}
      campaigns={campaigns}
      users={users}
      onLogout={() => setUser(null)}
      satisfaction={satisfaction}
      setSatisfaction={(fn) => {
        const next = typeof fn === "function" ? fn(satisfaction) : fn;
        setSatisfaction(next);
        if (next.length > satisfaction.length) {
          const s = next[next.length-1];
          save("satisfaction", {client_id:s.clientId, month:s.month, score_overall:s.score, score_roas:s.roas, score_speed:s.speed, score_reports:s.reports, comment:s.comment});
        }
      }}
    />;
  }

  const unread = notifs.filter(n => (!n.userId || n.userId === user?.id) && !n.read).length;
  const P = {
    dashboard: <Dashboard clients={clients} users={users} notifs={notifs} followups={followups} tasks={tasks} currentUser={user}/>,
    clients: <Clients
      clients={clients}
      setClients={(fn) => {
        const prev = clients;
        const next = typeof fn === "function" ? fn(prev) : fn;
        if (next.length > prev.length) {
          const cl = next[next.length-1];
          save("clients", {name:cl.name,email:cl.email,password:cl.password,pkg_amount:cl.pkg,platforms:cl.platforms,status:cl.status,mb_id:cl.mb,sm_id:cl.sm,am_id:cl.am,start_date:cl.start,end_date:cl.end,roas:cl.roas,total_spend:cl.spend,notes:cl.notes});
        } else if (next.length < prev.length) {
          const removed = prev.find(c => !next.find(x => x.id === c.id));
          if (removed) del("clients", {id: removed.id});
        }
        setClients(next);
      }}
      users={users} notes={notes} setNotes={setNotes} satisfaction={satisfaction} campaigns={campaigns}
    />,
    capacity: <Capacity clients={clients} users={users}/>,
    followup: <FollowUp
      clients={clients} users={users} followups={followups}
      setFollowups={(fn) => {
        const prev = followups;
        const next = typeof fn === "function" ? fn(prev) : fn;
        if (next.length > prev.length) {
          const f = next[next.length-1];
          save("follow_ups", {client_id:f.clientId, user_id:f.userId, date:f.date, text:f.text, images:f.images?.map(i=>i.name)||[]});
        }
        setFollowups(next);
      }}
      addNotif={addNotif} currentUser={user}
    />,
    creative: <CreativeTasks
      tasks={creativeTasks}
      setTasks={async (fn) => {
        const prev = creativeTasks;
        const next = typeof fn === "function" ? fn(prev) : fn;
        const opts = { headers: {"Content-Type":"application/json","X-App-Secret":CREATIVE_API_SECRET} };
        try{
          if (next.length > prev.length) {
            const t = next[next.length-1];
            await fetch(CREATIVE_API, {...opts, method:"POST", body: JSON.stringify(t)});
          } else if (next.length < prev.length) {
            const removed = prev.find(t => !next.find(x => x.id === t.id));
            if (removed) await fetch(CREATIVE_API, {...opts, method:"DELETE", body: JSON.stringify({id: removed.id})});
          } else {
            const changed = next.find((t,i) => JSON.stringify(t) !== JSON.stringify(prev[i]));
            if (changed) await fetch(CREATIVE_API, {...opts, method:"PUT", body: JSON.stringify(changed)});
          }
        }catch(e){ console.error("Creative sheet sync failed:", e); }
        setCreativeTasks(next);
        loadCreativeFromSheet();
      }}
      clients={clients} users={users} currentUser={user}
    />,
    campaigns: <Campaigns
      campaigns={campaigns}
      setCampaigns={(fn) => {
        const prev = campaigns;
        const next = typeof fn === "function" ? fn(prev) : fn;
        if (next.length > prev.length) {
          const c = next[next.length-1];
          save("campaigns", {client_id:c.clientId, platform:c.platform, week_start:c.week, spend:c.spend, clicks:c.clicks, impressions:c.impressions, purchases:c.purchases, purchase_value:c.purchaseValue, roas:c.roas, ctr:c.ctr, cpm:c.cpm, cpc:c.cpc});
        } else if (next.length < prev.length) {
          const removed = prev.find(c => !next.find(x => x.id === c.id));
          if (removed) del("campaigns", {id: removed.id});
        }
        setCampaigns(next);
      }}
      clients={clients} users={users} currentUser={user}
    />,
    ai: <AIAnalysis clients={clients} campaigns={campaigns} users={users}/>,
    tasks: <Tasks
      tasks={tasks}
      setTasks={(fn) => {
        const prev = tasks;
        const next = typeof fn === "function" ? fn(prev) : fn;
        if (next.length > prev.length) {
          const t = next[next.length-1];
          save("tasks", {title:t.title, assigned_to:t.assignedTo, client_id:t.clientId, due_date:t.due, priority:t.priority, status:t.status});
        } else if (next.length < prev.length) {
          const removed = prev.find(t => !next.find(x => x.id === t.id));
          if (removed) del("tasks", {id: removed.id});
        } else {
          const changed = next.find((t,i) => t.status !== prev[i]?.status);
          if (changed) update("tasks", {status:changed.status}, {id:changed.id});
        }
        setTasks(next);
      }}
      clients={clients} users={users} currentUser={user}
    />,
    reports: <Reports clients={clients} campaigns={campaigns} users={users}/>,
    churn: <ChurnTracker clients={clients} users={users}/>,
    targets: <Targets clients={clients} campaigns={campaigns} users={users} targets={targets} setTargets={setTargets}/>,
    scorecard: <Scorecard clients={clients} campaigns={campaigns} tasks={tasks} users={users}/>,
    satisfaction: <Satisfaction
      clients={clients} satisfaction={satisfaction}
      setSatisfaction={(fn) => {
        const prev = satisfaction;
        const next = typeof fn === "function" ? fn(prev) : fn;
        if (next.length > prev.length) {
          const s = next[next.length-1];
          save("satisfaction", {client_id:s.clientId, month:s.month, score_overall:s.score, comment:s.comment});
        }
        setSatisfaction(next);
      }}
      users={users}
    />,
    payroll: user.role === "admin"
      ? <Payroll users={users} clients={clients} payroll={payroll}
          setPayroll={(fn) => {
            const next = typeof fn === "function" ? fn(payroll) : fn;
            setPayroll(next);
            next.forEach(p => {
              if(window.__SB) window.__SB.from("payroll").upsert({user_id:p.userId||p.user_id, month:p.month||"2025-05", base_salary:p.base||0, commission:p.commission||0, bonus:p.bonus||0, deductions:p.deductions||0, note:p.note||""},{onConflict:"user_id,month"}).then(()=>{}).catch(()=>{});
            });
          }}
        />
      : <div style={{padding:32,color:C.red}}>غير مصرح</div>,
    team: user.role === "admin"
      ? <TeamMgmt users={users} setUsers={setUsers}/>
      : <div style={{padding:32,color:C.red}}>غير مصرح</div>,
  };

  return (
    <div style={{minHeight:"100vh", background:C.bg, fontFamily:"Cairo", direction:"rtl", display:"flex"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet"/>
      <Sidebar page={page} setPage={setPage} user={user} onLogout={() => setUser(null)} unread={unread}/>
      <main style={{flex:1, marginRight:230, overflowY:"auto", minHeight:"100vh", paddingBottom:40}}>
        <div style={{position:"sticky",top:0,zIndex:50,background:`${C.bg}ee`,backdropFilter:"blur(10px)",borderBottom:`1px solid ${C.border}`,padding:"9px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:600,color:dbReady?C.green:C.orange}}>
            {dbReady ? "● متصل بـ Supabase" : "● محفوظ محلياً — يتزامن مع Supabase تلقائياً"}
          </span>
          <NotifBell notifs={notifs} setNotifs={setNotifs} userId={user.id}/>
        </div>
        {P[page] || P.dashboard}
      </main>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}select option{background:#0D1526}button:hover:not(:disabled){filter:brightness(1.07)}`}</style>
    </div>
  );
}
