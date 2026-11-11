/* Nikan Education — shared content data (edited by admin.html) */
var CATS = {
  heart:{fa:'قلب و عروق',en:'Heart',c:'#e57f93'},
  women:{fa:'زنان و نوزاد',en:'Women & Newborn',c:'#b39ae8'},
  digest:{fa:'گوارش',en:'Digestive',c:'#3cbfa6'},
  imaging:{fa:'تصویربرداری',en:'Imaging',c:'#5fa8e8'},
  surgery:{fa:'جراحی',en:'Surgery',c:'#1c8c95'},
  critical:{fa:'مراقبت ویژه',en:'Critical Care',c:'#e0a95e'}
};
var PH = {before:{fa:'قبل از بستری',en:'Before'},during:{fa:'حین بستری',en:'During'},after:{fa:'بعد از ترخیص',en:'After'}};
var LIB = [
  {k:'angioplasty',cat:'heart',ph:['before','after'],m:6,v:1,fa:['آنژیوپلاستی و استنت','چه انتظاری داشته باشید، مراقبت از محل کاتتر و زمان بازگشت به فعالیت.'],en:['Angioplasty & stents','What to expect, caring for the catheter site and returning to activity.']},
  {k:'heart failure',cat:'heart',ph:['after'],m:7,v:1,fa:['زندگی با نارسایی قلبی','وزن روزانه، محدودیت نمک و مایعات، و علائمی که باید گزارش شوند.'],en:['Living with heart failure','Daily weights, salt and fluid limits, and symptoms to report.']},
  {k:'heart attack self-care',cat:'heart',ph:['after'],m:6,v:1,fa:['خودمراقبتی بعد از سکته قلبی','داروها، توان‌بخشی قلبی و بازگشت به کار.'],en:['After a heart attack','Medicines, cardiac rehab and getting back to work.']},
  {k:'pacemaker',cat:'heart',ph:['after'],m:5,v:0,fa:['پیس‌میکر در خانه','مراقبت از زخم، استفاده از موبایل و مراجعه برای کنترل دستگاه.'],en:['Your pacemaker at home','Wound care, phones and devices, and follow-up checks.']},
  {k:'blood thinner anticoagulant',cat:'heart',ph:['after'],m:4,v:1,fa:['داروهای ضدانعقاد','مصرف درست، تداخل غذایی و نشانه‌های خونریزی.'],en:['Blood thinners','Taking them safely, food interactions and bleeding signs.']},
  {k:'cesarean c-section',cat:'women',ph:['before','after'],m:6,v:1,fa:['سزارین','آمادگی قبل از عمل، کنترل درد و مراقبت از برش بعد از ترخیص.'],en:['Cesarean section','Getting ready, pain control and incision care at home.']},
  {k:'breastfeeding',cat:'women',ph:['after'],m:5,v:1,fa:['شیردهی در هفته اول','وضعیت صحیح شیردهی، دفعات و زمان کمک گرفتن.'],en:['Breastfeeding: the first week','Latch and positions, how often, and when to get help.']},
  {k:'newborn baby care',cat:'women',ph:['after'],m:6,v:0,fa:['مراقبت از نوزاد','بند ناف، خواب ایمن، زردی و علائم هشدار.'],en:['Caring for your newborn','Cord care, safe sleep, jaundice and warning signs.']},
  {k:'endoscopy',cat:'digest',ph:['before'],m:3,v:1,fa:['آمادگی آندوسکوپی','ناشتایی، داروهایی که باید قطع شوند و همراه داشتن.'],en:['Preparing for endoscopy','Fasting, which medicines to pause, and bringing a companion.']},
  {k:'colonoscopy',cat:'digest',ph:['before'],m:4,v:1,fa:['آمادگی کولونوسکوپی','رژیم مایعات، مصرف محلول آمادگی و برنامه روز قبل.'],en:['Colonoscopy prep','Clear-liquid diet, the prep solution and the day-before plan.']},
  {k:'mri ct scan imaging',cat:'imaging',ph:['before'],m:3,v:0,fa:['آمادگی ام‌آر‌آی و سی‌تی','فلزات، ماده حاجب، ناشتایی و مدت انجام.'],en:['Preparing for MRI & CT','Metal, contrast dye, fasting and how long it takes.']},
  {k:'fasting surgery anesthesia',cat:'surgery',ph:['before'],m:3,v:0,fa:['ناشتایی قبل از عمل','از کی غذا و آب را قطع کنیم و داروهای صبح عمل.'],en:['Fasting before surgery','When to stop food and drink, and morning medicines.']},
  {k:'wound care incision',cat:'surgery',ph:['after'],m:4,v:1,fa:['مراقبت از زخم جراحی','پانسمان، استحمام و نشانه‌های عفونت.'],en:['Surgical wound care','Dressings, showering and signs of infection.']},
  {k:'icu family visiting',cat:'critical',ph:['during'],m:5,v:0,fa:['راهنمای ICU برای خانواده','ساعات ملاقات، تجهیزات اتاق و نحوه ارتباط با تیم درمان.'],en:['ICU guide for families','Visiting hours, the equipment around the bed and talking to the team.']},
  {k:'fall prevention hospital',cat:'critical',ph:['during'],m:2,v:0,fa:['پیشگیری از زمین خوردن','نکات ایمنی برای بیمار و همراه در طول بستری.'],en:['Preventing falls','Safety tips for patients and companions during your stay.']}
];
var COURSES = [
  {id:'aide',k:'skill',g:'linear-gradient(140deg,#e6eaf9,#cfd8f5)',d:{fa:'۱۵ آذر',en:'Dec 6'},fill:.6,cap:25,fa:['دوره کمک‌پرستاری','آموزش نظری و کارورزی در بخش‌های بیمارستان، با گواهی پایان دوره.',['حضوری','گواهی','مهارتی']],en:['Nursing Aide Course','Theory plus supervised ward practice, with a completion certificate.',['In-person','Certificate','Skills']]},
  {id:'elder',k:'skill',g:'linear-gradient(140deg,#eceefb,#d9d6f5)',d:{fa:'۶ دی',en:'Dec 27'},fill:.35,cap:20,fa:['سالمندیاری','مراقبت ایمن از سالمند در خانه و مرکز نگهداری.',['حضوری','گواهی','مهارتی']],en:['Elderly Care Aide','Safe care for older adults at home and in care facilities.',['In-person','Certificate','Skills']]},
  {id:'acls',k:'staff',g:'linear-gradient(140deg,#dff4ee,#cbe3f0)',d:{fa:'۲۰ آذر',en:'Dec 11'},fill:.8,cap:16,fa:['احیای قلبی‌ریوی پیشرفته','ویژه پرستاران بخش‌های ویژه، با مانور عملی در اتاق مهارت.',['حضوری','امتیاز بازآموزی','کادر']],en:['Advanced Life Support (ACLS)','For critical-care nurses, with hands-on code drills.',['In-person','CME credit','Staff']]},
  {id:'infection',k:'staff',g:'linear-gradient(140deg,#e6ebfa,#cfd8f5)',d:{fa:'هر فصل',en:'Quarterly'},fill:.45,cap:60,fa:['بازآموزی کنترل عفونت','دوره آنلاین با آزمون و ثبت در پرونده آموزشی.',['آنلاین','امتیاز بازآموزی','کادر']],en:['Infection Control Refresher','Online module with a quiz logged to your training record.',['Online','CME credit','Staff']]},
  {id:'birth',k:'comm',g:'linear-gradient(140deg,#eceffb,#d8dcf6)',d:{fa:'۲۴ آذر',en:'Dec 15'},fill:.5,cap:30,fa:['کلاس آمادگی زایمان','روزهای زوج، برای مادران از هفته ۲۰ بارداری به بعد.',['حضوری','رایگان','جامعه']],en:['Childbirth Preparation','Even days, for mothers from week 20 of pregnancy.',['In-person','Free','Community']]},
  {id:'webinar',k:'comm',g:'linear-gradient(140deg,#e3f0f6,#d0e6f2)',d:{fa:'ماهانه',en:'Monthly'},fill:.25,cap:300,fa:['وبینار سلامت قلب','گفت‌وگوی زنده با متخصصان قلب و پاسخ به سؤالات.',['آنلاین','رایگان','جامعه']],en:['Heart Health Webinar','Live Q&A with Nikan cardiologists.',['Online','Free','Community']]}
];
