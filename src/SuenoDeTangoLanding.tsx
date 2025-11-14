import React, { useEffect, useState, useCallback, useRef } from "react";

// Sueño de Tango — Variant 6 (compact, optimized)
// RO default, EN/RU supported, 24‑hour time, Monday‑first week, lightbox, i18n, CTA, contact form.
// Fonts: Cormorant Garamond (brand) + Lato (text)
// Animations & hover effects live in styles/app.css. Only Hero uses an image background; site-wide bg removed.

// -----------------------------
// Types & locales
// -----------------------------

type Locale = 'en' | 'ro' | 'ru';

type TitleKey = 'basicCourse'|'musicalityImprovisation'|'techniqueAxisPivots'|'partnerWorkAbrazo'|'tangoVals'|'practicaMilonga'|'intensiveVals'|'bootcampFromScratch';

type LevelKey = 'beginners'|'improvers'|'allLevels'|'mixedBegImp'|'intermediatePlus'|'open';

type RoomKey = 'roomA'|'roomB'|'mainHall';

const DAYS: Record<Locale,string[]> = {
  en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  ro:['Du','Lu','Ma','Mi','Jo','Vi','Sâ'],
  ru:['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
};

const I18N = {
  en:{
    siteTitle:'Sueño de Tango',
    nav:{gallery:'Gallery',schedule:'Schedule',about:'About',join:'Join',contact:'Sign up'},
    hero:{
      title:'Sueño de Tango', slogan:'El arte del encuentro',
      subtitle:"Sueño de Tango is a space where tango becomes a way to feel, not just to move. Here, contact, breath, and the silence between steps matter; technique is only a means to express what is inside. It’s not just a school—it’s an atmosphere of encounter, dream, and depth.",
      ctaTrial:'Book a trial lesson', ctaGallery:'View gallery'
    },
    gallery:{title:'Gallery',intro:'Contrast light, living pauses and the breath of dance. Click a photo to open full‑screen.'},
    schedule:{
      title:'Schedule', intro:'Pick a weekday to see classes and events.', note:'* The schedule may change. Please confirm before visiting.', cta:'Ask / Enroll',
      titles:{
        basicCourse:'Basic Course', musicalityImprovisation:'Musicality & Improvisation', techniqueAxisPivots:'Technique: Axis & Pivots', partnerWorkAbrazo:'Partner Work: Abrazo', tangoVals:'Tango‑Vals', practicaMilonga:'Practice / Milonga', intensiveVals:'Intensive: Vals', bootcampFromScratch:'Bootcamp from Zero'
      },
      levels:{beginners:'Beginners',improvers:'Improvers',allLevels:'All Levels',mixedBegImp:'Beginners/Improvers',intermediatePlus:'Intermediate+',open:'Open'},
      rooms:{roomA:'Room A',roomB:'Room B',mainHall:'Main Hall'}
    },
    about:{
      title:'About the School', p1:'We teach authentic Argentine tango: from first steps to deep nuances of improvisation.', p2:'We focus on musicality, axis, the quality of the embrace, and dancefloor culture.',
      bullets:['Groups for all levels','Regular practices and milongas','Private lessons and intensives'],
      whyTitle:'Why “Sueño de Tango”', whyText:'Our visual philosophy is contrast of light and shadow where every pause and pivot reads like a film frame. We carefully build dance as a dialogue and invite you into this story.', join:'Join', ask:'Ask a question'
    },
    cta:{title:'Ready for the first step?',text:'Book a trial lesson — we’ll find a comfortable level and partnership.',btn:'Enroll'},
    contact:{
      title:'Contact',intro:'We are in the city center. Message us or leave a request.', addressLabel:'Address',address:'Strada Vlaicu Vodă 7, București', phoneLabel:'Phone', instagram:'Instagram', emailLabel:'Email',
      form:{title:'Send a request',name:'Name',phone:'Phone',email:'Email',level:'Level',levels:['Beginners','Improvers','Intermediate / Advanced','Private Lessons'],message:'Message',messagePh:'Ask a question or tell us the time that suits you',submit:'Send',consent:'By sending, you agree to data processing.'},
      alert:'Thank you! We will contact you soon.'
    },
    lightbox:{close:'Close',prev:'Previous',next:'Next'}
  },
  ro:{
    siteTitle:'Sueño de Tango',
    nav:{gallery:'Galerie',schedule:'Orar',about:'Despre',join:'Alătură-te',contact:'Înscriere'},
    hero:{
      title:'Sueño de Tango', slogan:'El arte del encuentro',
      subtitle:'Sueño de Tango este un spațiu în care tangoul devine o manieră de a simți, nu doar de a te mișca. Aici contează contactul, respirația și liniștea dintre pași; tehnica este doar un mijloc de a-ți exprima simțirile. Nu este doar o școală — este o atmosferă a întâlnirii, a visului și a profunzimii.',
      ctaTrial:'Programează o lecție de probă', ctaGallery:'Vezi galeria'
    },
    gallery:{title:'Galerie',intro:'Lumină de contrast, pauze vii și respirația dansului. Click pe fotografie pentru ecran complet.'},
    schedule:{
      title:'Orar', intro:'Alege ziua săptămânii pentru a vedea cursurile și evenimentele.', note:'* Orarul se poate modifica. Vă rugăm să confirmați înainte de vizită.', cta:'Întreabă / Înscrie-te',
      titles:{
        basicCourse:'Curs de bază', musicalityImprovisation:'Muzicalitate & Improvizație', techniqueAxisPivots:'Tehnică: axă și pivotări', partnerWorkAbrazo:'Lucru în cuplu: abrazo', tangoVals:'Tango‑vals', practicaMilonga:'Practica / Milonga', intensiveVals:'Intensiv: vals', bootcampFromScratch:'Bootcamp de la zero'
      },
      levels:{beginners:'Începători', improvers:'Continuați', allLevels:'Toate nivelurile', mixedBegImp:'Începători/Continuați', intermediatePlus:'Intermediar+', open:'Deschis'},
      rooms:{roomA:'Sala A',roomB:'Sala B',mainHall:'Sala principală'}
    },
    about:{
      title:'Despre școală', p1:'Predăm tango argentinian autentic: de la primii pași la nuanțe profunde ale improvizației.', p2:'Acordăm atenție muzicalității, axei, calității abraço și culturii de sală.',
      bullets:['Grupe pentru toate nivelurile','Practice regulate și milongi','Lecții private și intensive'],
      whyTitle:'De ce „Sueño de Tango”', whyText:'Filosofia noastră vizuală — contrastul dintre lumină și umbră, unde fiecare pauză și pivot se citesc ca un cadru de film. Construim dansul ca dialog și te invităm în această poveste.', join:'Alătură-te', ask:'Pune o întrebare'
    },
    cta:{title:'Pregătit pentru primul pas?',text:'Programează o lecție de probă — găsim nivelul și parteneriatul potrivit.',btn:'Înscrie-te'},
    contact:{
      title:'Contact',intro:'Suntem în centrul orașului. Scrie-ne pe rețele sau lasă o cerere.', addressLabel:'Adresă',address:'Strada Vlaicu Vodă 7, București', phoneLabel:'Telefon', instagram:'Instagram', emailLabel:'Email',
      form:{title:'Trimite o cerere',name:'Nume',phone:'Telefon',email:'Email',level:'Nivel',levels:['Începători','Continuați','Intermediar / Avansat','Lecții private'],message:'Mesaj',messagePh:'Întreabă ceva sau spune-ne ora preferată',submit:'Trimite',consent:'Prin trimitere, ești de acord cu prelucrarea datelor.'},
      alert:'Mulțumim! Te contactăm în curând.'
    },
    lightbox:{close:'Închide',prev:'Anterior',next:'Următor'}
  },
  ru:{
    siteTitle:'Sueño de Tango',
    nav:{gallery:'Галерея',schedule:'Расписание',about:'О школе',join:'Присоединиться',contact:'Записаться'},
    hero:{
      title:'Sueño de Tango', slogan:'El arte del encuentro',
      subtitle:'Sueño de Tango — это пространство, где танго становится способом чувствовать, а не просто двигаться. Здесь важны контакт, дыхание, тишина между шагами, а техника — лишь средство выразить внутреннее. Это не просто школа — это атмосфера встречи, мечты и глубины.',
      ctaTrial:'Записаться на пробное занятие', ctaGallery:'Смотреть галерею'
    },
    gallery:{title:'Галерея',intro:'Контраст света, живые паузы и дыхание танца. Нажмите на фото, чтобы открыть полноэкранный режим.'},
    schedule:{
      title:'Расписание', intro:'Выберите день недели, чтобы увидеть занятия и события.', note:'* Расписание может меняться. Пожалуйста, уточняйте перед визитом.', cta:'Спросить / Записаться',
      titles:{
        basicCourse:'Базовый курс', musicalityImprovisation:'Музыкальность и импровизация', techniqueAxisPivots:'Техника: ось и пивоты', partnerWorkAbrazo:'Работа в паре: абразо', tangoVals:'Танго‑Вальс', practicaMilonga:'Практика / милонга', intensiveVals:'Интенсив: вальс', bootcampFromScratch:'Буткемп с нуля'
      },
      levels:{beginners:'Новички',improvers:'Продолжающие',allLevels:'Все уровни',mixedBegImp:'Новички/Продолжающие',intermediatePlus:'Средний+',open:'Открыто'},
      rooms:{roomA:'Зал A',roomB:'Зал B',mainHall:'Большой зал'}
    },
    about:{
      title:'О школе', p1:'Мы обучаем аутентичному аргентинскому танго: от первых шагов до тонких нюансов импровизации.', p2:'Мы уделяем внимание музыкальности, оси, качеству абразо и культуре танцпола.',
      bullets:['Группы для всех уровней','Регулярные практики и милонги','Индивидуальные занятия и интенсивы'],
      whyTitle:'Почему «Sueño de Tango»', whyText:'Наша визуальная философия — это контраст света и тени, где каждая пауза и поворот читаются как кадр фильма. Мы строим танец как диалог и приглашаем вас в эту историю.', join:'Присоединиться', ask:'Задать вопрос'
    },
    cta:{title:'Готовы сделать первый шаг?',text:'Запишитесь на пробный урок — подберём комфортный уровень и партнёрство.',btn:'Записаться'},
    contact:{
      title:'Контакты',intro:'Мы в центре города. Напишите нам или оставьте заявку.', addressLabel:'Адрес',address:'Strada Vlaicu Vodă 7, București', phoneLabel:'Телефон', instagram:'Instagram', emailLabel:'Email',
      form:{title:'Отправить заявку',name:'Имя',phone:'Телефон',email:'Email',level:'Уровень',levels:['Новички','Продолжающие','Средний / Продвинутый','Индивидуальные занятия'],message:'Сообщение',messagePh:'Задайте вопрос или укажите удобное время',submit:'Отправить',consent:'Отправляя форму, вы соглашаетесь на обработку данных.'},
      alert:'Спасибо! Мы свяжемся с вами в ближайшее время.'
    },
    lightbox:{close:'Закрыть',prev:'Назад',next:'Вперёд'}
  }
} as const;

// -----------------------------
// Assets
// -----------------------------

// Base URL for GitHub Pages compatibility (Vite injects base path)
const BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.BASE_URL) ? (import.meta as any).env.BASE_URL as string : '/';

const HERO_BANNER_RAW = BASE_URL + 'images/my-hero.webp';
const HERO_BANNER = encodeURI(HERO_BANNER_RAW);
const FALLBACK_HERO = BASE_URL + 'images/fallback-hero.webp';

const CTA_BG_SRCSET = `${BASE_URL}images/cta-bg-800.webp 800w, ${BASE_URL}images/cta-bg-1200.webp 1200w, ${BASE_URL}images/cta-bg-1600.webp 1600w, ${BASE_URL}images/cta-bg-2000.webp 2000w`;
const CTA_BG_DEFAULT = `${BASE_URL}images/cta-bg-1600.webp`;
const CTA_BG_SIZES = '100vw';

// Google Maps location
const MAPS_URL = 'https://maps.app.goo.gl/Xe1dM73d6raCRfNU7';

// Contact
const CONTACT_EMAIL = 'info@sueno-de-tango.org';
const CONTACT_PHONE = '+40 728 717 412';
const CONTACT_PHONE_TEL = '+40728717412';

// -----------------------------
// Hover sounds (WebAudio, no assets)
// -----------------------------
let audioCtx: AudioContext | null = null;
let unlocked = false;
let lastHoverAt = 0;
const MIN_INTERVAL = 0.06; // seconds
function ensureAudio(){
  try{
    if(!audioCtx){
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if(audioCtx && !unlocked){
      const resume = () => { audioCtx!.resume().catch(()=>{}); unlocked = true; };
      window.addEventListener('pointerdown', resume, { once:true });
      window.addEventListener('keydown', resume, { once:true });
    }
  }catch{}
}
function playHover(freq=920){
  try{
    ensureAudio();
    if(!audioCtx || audioCtx.state!=='running') return;
    const now = audioCtx.currentTime;
    if (now - lastHoverAt < MIN_INTERVAL) return;
    lastHoverAt = now;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(now); o.stop(now + 0.10);
  }catch{}
}
function useHoverSounds(){
  // Inject Google Fonts + app CSS + preload hero (guarded)
  useEffect(()=>{
    if (!document.querySelector('link[data-gf]')) {
      const pre1 = document.createElement('link'); pre1.rel='preconnect'; pre1.href='https://fonts.googleapis.com'; pre1.setAttribute('data-gf',''); document.head.appendChild(pre1);
      const pre2 = document.createElement('link'); pre2.rel='preconnect'; pre2.href='https://fonts.gstatic.com'; pre2.crossOrigin='anonymous'; pre2.setAttribute('data-gf',''); document.head.appendChild(pre2);
      const css = document.createElement('link'); css.rel='stylesheet'; css.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Lato:ital,wght@0,100..900;1,100..900&display=swap'; css.setAttribute('data-gf',''); document.head.appendChild(css);
    }
    if (!document.querySelector('link[data-app-css]')) {
      const l = document.createElement('link');
      l.rel='stylesheet';
      l.href=BASE_URL+'styles/app.css?v=hero-override-3';
      l.setAttribute('data-app-css','');
      document.head.appendChild(l);
    }
    if (!document.querySelector('link[data-preload-hero]')) {
      const l=document.createElement('link'); l.rel='preload'; l.as='image'; l.href=HERO_BANNER; l.setAttribute('data-preload-hero',''); document.head.appendChild(l);
    }
  },[]);

  // Override styles: slogan no glow; title breathing glow
  useEffect(()=>{
    if (document.getElementById('hero-override-style')) return;
    const s = document.createElement('style');
    s.id = 'hero-override-style';
    s.textContent = `
.hero-slogan{animation:none !important;text-shadow:none !important;-webkit-text-stroke:0 !important;color:#fff !important;font-weight:700 !important;}
.hero-title{--g1:rgba(255,255,255,.25);--g2:rgba(255,255,255,.6);--g3:rgba(255,255,255,.85);text-shadow:0 0 .25rem var(--g1),0 0 .9rem var(--g2),0 0 1.8rem var(--g1);} 
.hero-title.glow-breath{animation:glow-breath 3.4s ease-in-out infinite;}
@keyframes glow-breath{0%,100%{text-shadow:0 0 .2rem var(--g1),0 0 1.0rem var(--g2),0 0 2.0rem var(--g2);}50%{text-shadow:0 0 .35rem var(--g2),0 0 1.5rem var(--g3),0 0 2.6rem rgba(255,255,255,.95);}}
`;
    document.head.appendChild(s);
    return ()=>{ try{ s.remove(); }catch{} };
  },[]);

  // Favicons (local files)
  useEffect(()=>{
    if (document.querySelector('link[data-local-favicon]')) return;
    const add = (rel:string, href:string, attrs?:Record<string,string>)=>{
      const l = document.createElement('link'); l.rel = rel; l.href = href; if(attrs){ for(const [k,v] of Object.entries(attrs)) l.setAttribute(k,v); } l.setAttribute('data-local-favicon',''); document.head.appendChild(l);
    };
    const base = BASE_URL + 'images/';
    add('icon', base + 'favicon.svg', { type:'image/svg+xml' });
    add('icon', base + 'favicon-32.png', { type:'image/png', sizes:'32x32' });
    add('icon', base + 'favicon-192.png', { type:'image/png', sizes:'192x192' });
    add('apple-touch-icon', base + 'apple-touch-icon.png', { sizes:'180x180' });
  },[]);

  // Hover sound listener
  useEffect(()=>{
    const onEnter = (e: MouseEvent) => {
      const el = e.target as EventTarget | null;
      if (!el || !(el instanceof Element)) return;
      const target = el.closest('[data-snd="hover"]');
      if (target) playHover();
    };
    document.addEventListener('mouseenter', onEnter, true);
    return ()=> document.removeEventListener('mouseenter', onEnter, true);
  },[]);

  // Sanity logs
  useEffect(()=>{ try{ console.log('[SANITY] running'); runSanityChecks(); }catch{} },[]);
}

// -----------------------------
// Gallery
// -----------------------------

const GALLERY_FILES = ['gallery-01.webp','gallery-02.webp','gallery-03.webp','gallery-04.webp','gallery-05.webp','gallery-06.webp'];
const IMG_SRC = GALLERY_FILES.map(f => BASE_URL + 'images/' + f);
const ALT = {
  en:['Silhouette couple in dramatic light','Close-up tango steps','Abrazo in backlight','Pivot with torso twist','Couple on an empty stage','Dancers\' shoes details'],
  ro:['Siluetă de cuplu în lumină dramatică','Prim-plan pași de tango','Abrazo în contralumină','Pivot cu răsucire a trunchiului','Cuplu pe o scenă goală','Detalii de încălțăminte'],
  ru:['Силуэт пары в драматичном свете','Крупный план шагов танго','Абразо на контровом свете','Пивот с разворотом корпуса','Пара на пустой сцене','Детали танцевальной обуви']
};
const IMAGES = IMG_SRC.map((src,i)=>({src,alt:{en:ALT.en[i],ro:ALT.ro[i],ru:ALT.ru[i]}}));

// -----------------------------
// Helpers & sanity tests
// -----------------------------

function wrapIndex(len:number,index:number,delta:number){return (index+delta+len)%len}

function chooseFitMode(imgAR:number, vpAR:number): 'contain' | 'cover' {
  // Prefer cover when aspect ratios are close to maximize screen usage, contain otherwise to avoid heavy cropping
  const diff = Math.abs(imgAR - vpAR) / vpAR;
  return diff <= 0.18 ? 'cover' : 'contain';
}

function runSanityChecks(){
  const group=(name:string)=>{try{console.groupCollapsed?.(`[SANITY] ${name}`)}catch{};return()=>{try{console.groupEnd?.()}catch{}}};
  const LOCALES = Object.keys(I18N) as Locale[];

  let end=group('DAYS length = 7 for all locales'); const badDays=Object.entries(DAYS).filter(([,a])=>a.length!==7); badDays.length?console.error('[SANITY] DAYS invalid',badDays):console.log('[SANITY] OK'); end();

  end=group('wrapIndex boundaries'); const L=IMAGES.length,t1=wrapIndex(L,0,-1)===L-1,t2=wrapIndex(L,L-1,1)===0,t3=wrapIndex(L,2,-3)===L-1; !(t1&&t2&&t3)?console.error('[SANITY] wrapIndex failed',{t1,t2,t3,L}):console.log('[SANITY] OK'); end();

  end=group('Images alt per locale'); const miss: Array<{idx:number;missing:Locale[]}> = []; IMAGES.forEach((img,i)=>{const m:Locale[]=[]; LOCALES.forEach(Lc=>{if(!img.alt[Lc])m.push(Lc)}); if(m.length)miss.push({idx:i,missing:m})}); miss.length?console.error('[SANITY] Missing alts',miss):console.log('[SANITY] OK'); end();

  end=group('Gallery file extensions are .webp'); const wrongExt=GALLERY_FILES.filter(f=>!f.endsWith('.webp')); wrongExt.length?console.error('[SANITY] Non-webp images',wrongExt):console.log('[SANITY] OK'); end();

  end=group('Hero assets are .webp'); const heroOk=HERO_BANNER.endsWith('.webp')&&FALLBACK_HERO.endsWith('.webp'); !heroOk?console.error('[SANITY] Hero not webp'):
  console.log('[SANITY] OK'); end();

  end=group('I18N core fields present'); const fieldsOk=(['en','ro','ru'] as Locale[]).every(Lc=>!!I18N[Lc]?.hero?.title && !!I18N[Lc]?.hero?.slogan); !fieldsOk?console.error('[SANITY] Missing core i18n fields'):console.log('[SANITY] OK'); end();

  // Extra: Schedule keys exist in i18n
  end=group('Schedule keys exist');
  const keysOk = (['en','ro','ru'] as Locale[]).every(Lc =>
    SCHEDULE.every(s => (I18N[Lc].schedule.titles as any)[s.titleKey] && (I18N[Lc].schedule.levels as any)[s.levelKey] && (I18N[Lc].schedule.rooms as any)[s.roomKey])
  );
  !keysOk?console.error('[SANITY] Missing schedule keys in i18n') : console.log('[SANITY] OK'); end();
}

// -----------------------------
// Schedule (Monday‑first UI)
// -----------------------------

type ScheduleItem = { dayIndex:number; time:string; titleKey:TitleKey; levelKey:LevelKey; teacher:string; roomKey:RoomKey };
const SCHEDULE: ScheduleItem[] = [
  { dayIndex:1,time:'18:30–19:30',titleKey:'basicCourse',levelKey:'beginners',teacher:'Anna & Mark',roomKey:'roomA' },
  { dayIndex:1,time:'19:45–21:00',titleKey:'musicalityImprovisation',levelKey:'improvers',teacher:'Anna & Mark',roomKey:'roomA' },
  { dayIndex:2,time:'19:00–20:15',titleKey:'techniqueAxisPivots',levelKey:'allLevels',teacher:'Irina',roomKey:'roomB' },
  { dayIndex:3,time:'19:00–20:15',titleKey:'partnerWorkAbrazo',levelKey:'mixedBegImp',teacher:'Anna',roomKey:'roomB' },
  { dayIndex:4,time:'19:30–20:45',titleKey:'tangoVals',levelKey:'intermediatePlus',teacher:'Mark',roomKey:'roomA' },
  { dayIndex:5,time:'20:30–23:30',titleKey:'practicaMilonga',levelKey:'open',teacher:'DJ Hernán',roomKey:'mainHall' },
  { dayIndex:6,time:'12:00–13:30',titleKey:'intensiveVals',levelKey:'intermediatePlus',teacher:'Anna & Mark',roomKey:'roomA' },
  { dayIndex:0,time:'12:00–13:00',titleKey:'bootcampFromScratch',levelKey:'beginners',teacher:'Irina',roomKey:'roomA' }
];
const WEEK_ORDER = [1,2,3,4,5,6,0];

// -----------------------------
// Form sending
// -----------------------------

const FORM_MODE: 'auto' | 'formspree' | 'mailto' = 'formspree';

function getFormspreeId(): string | null {
  try{
    const m = document.querySelector('meta[name="formspree-id"]') as HTMLMetaElement | null;
    if (m && m.content) return m.content.trim();
    // optional global hook for quick tests
    const win: any = window as any;
    if (win && typeof win.FORMSPREE_ID === 'string') return win.FORMSPREE_ID;
  }catch{}
  return null;
}

function sendMailto(obj: Record<string, FormDataEntryValue>, loc: Locale){
  const subject = encodeURIComponent('New request — Sueño de Tango');
  const lines: string[] = [];
  for (const [k,v] of Object.entries(obj)) lines.push(`${k}: ${String(v)}`);
  lines.push(`locale: ${loc}`);
  const body = encodeURIComponent(lines.join('
'));
  const href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  window.location.href = href;
}

async function sendFormData(obj: Record<string, FormDataEntryValue>, loc: Locale): Promise<void>{
  const id = getFormspreeId();
  const useFs = (FORM_MODE==='formspree') || (FORM_MODE==='auto' && !!id);
  if (useFs && id){
    const fd = new FormData();
    for (const [k,v] of Object.entries(obj)) fd.append(k, String(v));
    fd.append('_subject','New request — Sueño de Tango');
    fd.append('_replyto', String(obj.email || CONTACT_EMAIL));
    fd.append('_locale', loc);

    const ctrl = new AbortController();
    const t = setTimeout(()=>ctrl.abort(), 12000);
    try{
      const res = await fetch(`https://formspree.io/f/${id}?nocache=${Date.now()}`, {
        method:'POST',
        body: fd,
        headers: { 'Accept':'application/json' },
        signal: ctrl.signal,
        mode: 'cors',
        credentials: 'omit'
      });
      clearTimeout(t);
      if (res.ok) return;
      console.warn('[Form] Formspree non-OK status', res.status);
      // fallback to mailto if blocked or non-OK
      sendMailto(obj, loc);
      return;
    }catch(err){
      console.warn('[Form] Formspree fetch failed', err);
      sendMailto(obj, loc);
      return;
    }
  }
  // Mailto path
  sendMailto(obj, loc);
}

// -----------------------------
// Component
// -----------------------------

export default function SuenoDeTangoLanding(){
  const [menuOpen,setMenuOpen]=useState(false);
  const [lightboxIndex,setLightboxIndex]=useState<number|null>(null);
  const [fitMode,setFitMode]=useState<'contain'|'cover'>('contain');
  const [locale,setLocale]=useState<Locale>(()=>{if(typeof window==='undefined')return 'ro'; const s=window.localStorage.getItem('tango_locale') as Locale|null; return (s&&(['en','ro','ru'] as Locale[]).includes(s))?s:'ro'});
  const [submitting,setSubmitting]=useState(false);
  const t=I18N[locale];
  const todayIndex=new Date().getDay();
  const [activeDay,setActiveDay]=useState<number>(todayIndex);
  const imgRef = useRef<HTMLImageElement|null>(null);
  // Swipe navigation (mobile/lightbox)
  const SWIPE_THRESH = 60; // px to trigger slide left/right
  const SWIPE_CLOSE = 90;  // px to close by vertical swipe
  const VERT_LOCK = 24; // px vertical movement cancels horizontal intent
  const startX = useRef<number|null>(null);
  const startY = useRef<number|null>(null);
  const dragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);     // X translate for slide feedback
  const [dragOffsetY, setDragOffsetY] = useState(0);   // Y translate for close feedback
  const offsetXRef = useRef(0);
  const offsetYRef = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    dragging.current = true;
    setDragOffset(0);
    setDragOffsetY(0);
    offsetXRef.current = 0;
    offsetYRef.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || startX.current == null || startY.current == null) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    offsetXRef.current = dx; offsetYRef.current = dy;
    const absX = Math.abs(dx), absY = Math.abs(dy);
    // Prevent page scroll while interacting with lightbox
    e.preventDefault();
    if (absY > absX && absY > VERT_LOCK) { // vertical gesture dominates
      setDragOffset(0);
      setDragOffsetY(dy);
    } else { // horizontal gesture
      setDragOffset(dx);
      setDragOffsetY(0);
    }
  };
  const onTouchEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = offsetXRef.current;
    const dy = offsetYRef.current;
    setDragOffset(0);
    setDragOffsetY(0);
    if (Math.abs(dx) > SWIPE_THRESH && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) nextImage(); else prevImage();
      return;
    }
    if (Math.abs(dy) > SWIPE_CLOSE && Math.abs(dy) > Math.abs(dx)) {
      closeLightbox();
      return;
    }
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.buttons !== 1) return;
    startX.current = e.clientX; startY.current = e.clientY; dragging.current = true; setDragOffset(0); setDragOffsetY(0);
    offsetXRef.current = 0; offsetYRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || startX.current == null || startY.current == null) return;
    const dx = e.clientX - startX.current; const dy = e.clientY - startY.current;
    offsetXRef.current = dx; offsetYRef.current = dy;
    const absX = Math.abs(dx), absY = Math.abs(dy);
    if (absY > absX && absY > VERT_LOCK) { // treat as vertical drag feedback
      setDragOffset(0); setDragOffsetY(dy);
    } else {
      setDragOffset(dx); setDragOffsetY(0);
    }
    e.preventDefault();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return; (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); onTouchEnd();
  };

  useEffect(()=>{try{window.localStorage.setItem('tango_locale',locale)}catch{}},[locale]);
  useEffect(()=>{ try{ document.documentElement.lang = locale; }catch{} }, [locale]);
  useHoverSounds();

  const openLightbox=useCallback((i:number)=>{setLightboxIndex(i)},[]);
  const closeLightbox=useCallback(()=>{setLightboxIndex(null)},[]);
  const prevImage=useCallback(()=>{if(lightboxIndex===null)return; setLightboxIndex(i=>wrapIndex(IMAGES.length,i!,-1))},[lightboxIndex]);
  const nextImage=useCallback(()=>{if(lightboxIndex===null)return; setLightboxIndex(i=>wrapIndex(IMAGES.length,i!,1))},[lightboxIndex]);

  useEffect(()=>{ if(lightboxIndex===null) return; const onKey=(e:KeyboardEvent)=>{ if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowLeft') prevImage(); if(e.key==='ArrowRight') nextImage(); if(e.key==='f'||e.key==='F') setFitMode(m=>m==='contain'?'cover':'contain') }; window.addEventListener('keydown',onKey); return()=>window.removeEventListener('keydown',onKey) },[lightboxIndex,closeLightbox,prevImage,nextImage]);

  // Recalculate fit on resize/orientation while lightbox open
  useEffect(()=>{
    if(lightboxIndex===null) return;
    const onResize = () => {
      const img = imgRef.current; if(!img) return;
      const vw = Math.min(window.innerWidth, Number.MAX_SAFE_INTEGER);
      const vh = window.innerHeight * 0.92;
      const vp = vw / vh;
      const ar = (img.naturalWidth||1)/(img.naturalHeight||1);
      setFitMode(chooseFitMode(ar, vp));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return ()=>{ window.removeEventListener('resize', onResize); window.removeEventListener('orientationchange', onResize); };
  },[lightboxIndex]);

  const handleSubmit=async (e:React.FormEvent)=>{
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const f=e.target as HTMLFormElement;
    const data=new FormData(f);
    const obj=Object.fromEntries(data.entries()) as Record<string,FormDataEntryValue>;
    try{
      await sendFormData(obj, locale);
      alert(I18N[locale].contact.alert);
      f.reset();
    }catch(err){
      console.warn('[Form] submit failed', err);
      alert('Sorry, the request could not be sent. Please try again later or write to '+CONTACT_EMAIL);
    } finally {
      setSubmitting(false);
    }
  };

  const daysMondayFirst = [1,2,3,4,5,6,0].map(d=>({ idx:d, label:DAYS[locale][d] }));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-red-600/40 font-text">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="#hero" data-snd="hover" className="font-brand text-xl tracking-wide inline-block hz-sm">{t.siteTitle}</a>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            <a data-snd="hover" className="hover:text-red-400/90 inline-flex hz-nav transform-gpu" href="#gallery">{t.nav.gallery}</a>
            <a data-snd="hover" className="hover:text-red-400/90 inline-flex hz-nav transform-gpu" href="#schedule">{t.nav.schedule}</a>
            <a data-snd="hover" className="hover:text-red-400/90 inline-flex hz-nav transform-gpu" href="#about">{t.nav.about}</a>
            <a data-snd="hover" className="hover:text-red-400/90 inline-flex hz-nav transform-gpu" href="#cta">{t.nav.join}</a>
            <a data-snd="hover" className="rounded-full border border-red-600/60 px-4 py-1.5 text-sm hover:bg-red-600/20 hz-sm transform-gpu" href="#contact">{t.nav.contact}</a>
          </nav>
          <div className="flex items-center gap-2">
            <select aria-label="Language selector" value={locale} onChange={(e)=>{const v=e.target.value as Locale; setLocale(v);}} className="hidden md:block rounded-xl border border-white/15 bg-neutral-900 px-3 py-2 text-sm">
              <option value="en">EN</option><option value="ro">RO</option><option value="ru">RU</option>
            </select>
            <button aria-label="Open menu" data-snd="hover" className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 hz-sm" onClick={()=>{setMenuOpen(s=>!s)}}>
              <span className="sr-only">Menu</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-white/10 md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3" onClick={(e)=>{ const el = e.target as HTMLElement; if (el && el.closest('a')) setMenuOpen(false); }}>
              <div className="mb-2">
                <label className="mr-2 text-sm text-neutral-400" htmlFor="locale-sm">Lang</label>
                <select id="locale-sm" value={locale} onChange={(e)=>{const v=e.target.value as Locale; setLocale(v);}} className="rounded-lg border border-white/15 bg-neutral-900 px-2 py-1 text-sm">
                  <option value="en">EN</option><option value="ro">RO</option><option value="ru">RU</option>
                </select>
              </div>
              <a data-snd="hover" className="py-2 inline-flex hz-nav transform-gpu" href="#gallery">{t.nav.gallery}</a>
              <a data-snd="hover" className="py-2 inline-flex hz-nav transform-gpu" href="#schedule">{t.nav.schedule}</a>
              <a data-snd="hover" className="py-2 inline-flex hz-nav transform-gpu" href="#about">{t.nav.about}</a>
              <a data-snd="hover" className="py-2 inline-flex hz-nav transform-gpu" href="#cta">{t.nav.join}</a>
              <a data-snd="hover" className="py-2 inline-flex hz-nav transform-gpu" href="#contact">{t.nav.contact}</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="hero" className="relative isolate">
        <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-950">
          <img
            src={HERO_BANNER}
            alt={IMAGES[0].alt[locale]}
            className="h-full w-full object-cover opacity-70"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width={2000}
            height={1200}
            onError={(e)=>{(e.currentTarget as HTMLImageElement).src = FALLBACK_HERO}}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-neutral-950" />
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-28 md:py-40 lg:py-48">
          <h1 className="hero-title max-w-3xl font-brand font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.92] text-left transform-gpu hz-md hero-anim glow-breath">
            <span className="hero-line hero-line1">Sueño</span>
            <span className="hero-line hero-line2">de Tango</span>
          </h1>
          <p className="hero-slogan font-brand font-bold tracking-wide text-2xl md:text-3xl lg:text-4xl text-left text-white" style={{ textShadow: 'none', WebkitTextStroke: '0', color: '#fff', fontWeight: 700 }}>{t.hero.slogan}</p>
          <p className="max-w-xl text-neutral-300 md:text-lg">{t.hero.subtitle}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a data-snd="hover" href="#contact" className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-medium tracking-wide hover:bg-red-500 hz-sm transform-gpu">{t.hero.ctaTrial}</a>
            <a data-snd="hover" href="#gallery" className="rounded-2xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10">{t.hero.ctaGallery}</a>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" aria-label={t.nav.gallery} className="mx-auto max-w-7xl px-4 py-16">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-brand text-3xl md:text-4xl">{t.gallery.title}</h2>
            <p className="mt-2 max-w-2xl text-neutral-400">{t.gallery.intro}</p>
          </div>
          <a data-snd="hover" href="#contact" className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10 md:inline-block hz-sm transform-gpu">{t.nav.contact}</a>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {IMAGES.map((img,i)=>(
            <button data-snd="hover" key={i} onClick={()=>openLightbox(i)} className="group relative overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-inset ring-white/10 hz-md transform-gpu">
              <div className="relative h-64 w-full md:h-60 lg:h-72">
                <img src={img.src} alt={img.alt[locale]} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-3 left-3 text-xs text-neutral-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">{img.alt[locale]}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-brand text-3xl md:text-4xl">{t.schedule.title}</h2>
        <p className="mt-2 text-neutral-300">{t.schedule.intro}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {daysMondayFirst.map(({idx,label})=> (
            <button data-snd="hover" key={idx} onClick={()=>setActiveDay(idx)} className={`rounded-full border px-3 py-1.5 text-sm hz-sm ${activeDay===idx? 'border-red-600 bg-red-600/20' : 'border-white/15 hover:bg-white/10'}`}>{label}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SCHEDULE.filter(s=>s.dayIndex===activeDay).map((s, i)=> (
            <div key={i} className="rounded-2xl border border-white/10 bg-neutral-900 p-4 hz-sm transform-gpu">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{t.schedule.titles[s.titleKey]}</h3>
                  <p className="text-sm text-neutral-300">{t.schedule.levels[s.levelKey]} • {s.teacher}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono">{s.time}</p>
                  <p className="text-xs text-neutral-400">{t.schedule.rooms[s.roomKey]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-400">{t.schedule.note}</p>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-brand text-3xl md:text-4xl">{t.about.title}</h2>
        <div className="mt-4 grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-neutral-300">{t.about.p1}</p>
            <p className="mt-3 text-neutral-300">{t.about.p2}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-neutral-300">
              {t.about.bullets.map((b,i)=>(<li key={i}>{b}</li>))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <h3 className="mb-2 font-brand text-2xl">{t.about.whyTitle}</h3>
            <p className="text-neutral-300">{t.about.whyText}</p>
            <div className="mt-4 flex gap-3">
              <a data-snd="hover" href="#cta" className="rounded-xl bg-red-600 px-4 py-2 text-sm hover:bg-red-500 hz-sm transform-gpu">{t.about.join}</a>
              <a data-snd="hover" href="#contact" className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10 hz-sm transform-gpu">{t.about.ask}</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA (plain color background, no image) */}
      <section id="cta" className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-neutral-950" />
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-8 backdrop-blur">
            <h2 className="font-brand text-3xl md:text-4xl">{t.cta.title}</h2>
            <p className="mt-2 max-w-2xl text-neutral-300">{t.cta.text}</p>
            <a data-snd="hover" href="#contact" className="mt-5 inline-block rounded-2xl bg-red-600 px-5 py-3 text-sm font-medium hover:bg-red-500 hz-sm transform-gpu">{t.cta.btn}</a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <h2 className="font-brand text-3xl md:text-4xl">{t.contact.title}</h2>
            <p className="mt-3 text-neutral-300">{t.contact.intro}</p>
            <div className="mt-4 space-y-2 text-neutral-300">
              <p><strong>{t.contact.addressLabel}:</strong> <a data-snd="hover" className="underline decoration-white/30 underline-offset-4 hover:text-red-400" href={MAPS_URL} target="_blank" rel="noreferrer noopener">{t.contact.address}</a></p>
              <p><strong>{t.contact.phoneLabel}:</strong> <a data-snd="hover" className="underline decoration-white/30 underline-offset-4 hover:text-red-400" href={'tel:'+CONTACT_PHONE_TEL}>{CONTACT_PHONE}</a></p>
              <p><strong>{t.contact.emailLabel}:</strong> <a data-snd="hover" className="underline decoration-white/30 underline-offset-4 hover:text-red-400" href={'mailto:'+CONTACT_EMAIL}>{CONTACT_EMAIL}</a></p>
              <p><strong>Instagram:</strong> <a data-snd="hover" className="underline decoration-white/30 underline-offset-4 hover:text-red-400" href="https://instagram.com/sueno_de_tango" target="_blank" rel="noreferrer noopener">@sueno_de_tango</a></p>
            </div>
            <div className="mt-6 h-56 md:h-72 w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-800 shadow">
              <iframe
                title="Google Maps — Strada Vlaicu Vodă 7, București"
                src={`https://www.google.com/maps?q=${encodeURIComponent(t.contact.address)}&z=16&output=embed`}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, filter: 'grayscale(20%) contrast(110%) brightness(95%)' }}
              />
            </div>
            <div className="mt-2 text-sm">
              <a data-snd="hover" className="underline decoration-white/30 underline-offset-4 hover:text-red-400" href={MAPS_URL} target="_blank" rel="noreferrer noopener">Open in Google Maps</a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <h3 className="text-xl font-semibold">{t.contact.form.title}</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><label className="mb-1 block text-sm text-neutral-300" htmlFor="name">{t.contact.form.name}</label><input id="name" name="name" required placeholder="Irina" className="w-full rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 outline-none ring-0 focus:border-red-500"/></div>
              <div><label className="mb-1 block text-sm text-neutral-300" htmlFor="phone">{t.contact.form.phone}</label><input id="phone" name="phone" required placeholder="+40 ..." className="w-full rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 outline-none focus:border-red-500"/></div>
              <div><label className="mb-1 block text-sm text-neutral-300" htmlFor="email">{t.contact.form.email}</label><input id="email" name="email" type="email" placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 outline-none focus:border-red-500"/></div>
              <div><label className="mb-1 block text-sm text-neutral-300" htmlFor="level">{t.contact.form.level}</label><select id="level" name="level" className="w-full rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 outline-none focus:border-red-500">{t.contact.form.levels.map((lvl,i)=>(<option key={i}>{lvl}</option>))}</select></div>
              <div className="md:col-span-2"><label className="mb-1 block text-sm text-neutral-300" htmlFor="message">{t.contact.form.message}</label><textarea id="message" name="message" rows={4} placeholder={t.contact.form.messagePh} className="w-full rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 outline-none focus:border-red-500"/></div>
            </div>
            <div className="mt-5 flex items-center gap-3"><button data-snd="hover" type="submit" disabled={submitting} aria-busy={submitting} className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-medium hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed">{t.contact.form.submit}</button><span className="text-xs text-neutral-400">{t.contact.form.consent}</span></div>
          </form>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex!==null && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button data-snd="hover" aria-label={t.lightbox.close} className="absolute right-4 top-4 rounded-xl border border-white/20 p-2 hover:bg-white/10 hz-sm" onClick={closeLightbox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <button data-snd="hover" aria-label={t.lightbox.prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/20 p-3 hover:bg-white/10 hz-sm" onClick={prevImage}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button data-snd="hover" aria-label={t.lightbox.next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/20 p-3 hover:bg-white/10 hz-sm" onClick={nextImage}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <div className="lb-frame relative w-[96vw] h-[92dvh] max-h-[92vh] flex items-center justify-center" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
            <img
              ref={imgRef}
              src={IMAGES[lightboxIndex].src}
              alt={IMAGES[lightboxIndex].alt[locale]}
              className={"lb-img rounded-2xl shadow-2xl ring-1 ring-white/10 transition-transform "+(fitMode==='cover'?'w-full h-full object-cover':'max-w-full max-h-[92dvh] w-auto h-auto object-contain')}
              style={{ transform: dragOffset || dragOffsetY ? (`translate3d(${dragOffset}px, ${dragOffsetY}px, 0)`) : undefined }}
              onLoad={(e)=>{ const img=e.currentTarget; const vw=Math.min(window.innerWidth, Number.MAX_SAFE_INTEGER); const vh=window.innerHeight*0.92; const vp=vw/vh; const ar=(img.naturalWidth||1)/(img.naturalHeight||1); setFitMode(chooseFitMode(ar,vp)); }}
              onDoubleClick={()=> setFitMode(m=>m==='contain'?'cover':'contain')}
            />
            <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-center text-sm text-neutral-300">{IMAGES[lightboxIndex].alt[locale]}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-neutral-950/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <p className="text-sm text-neutral-400">© {new Date().getFullYear()} {t.siteTitle}</p>
          <div className="flex items-center gap-4 text-neutral-300">
            <a data-snd="hover" href="https://instagram.com/sueno_de_tango" className="hover:text-red-400 inline-flex hz-sm" aria-label="Instagram" target="_blank" rel="noreferrer noopener">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <path d="M17.5 6.5h+.01" />
              </svg>
            </a>
            <a data-snd="hover" href="https://www.facebook.com/suenodetango/" className="hover:text-red-400 inline-flex hz-sm" aria-label="Facebook" target="_blank" rel="noreferrer noopener">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a data-snd="hover" href="https://www.youtube.com/@dimadiamante" className="hover:text-red-400 inline-flex hz-sm" aria-label="YouTube" target="_blank" rel="noreferrer noopener">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 3.8 12 3.8 12 3.8s-6.88 0-8.59.62a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20.2 12 20.2 12 20.2s6.88 0 8.59-.62a2.78 2.78 0 0 0 1.95-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <path d="M9.75 15.02 15.5 12 9.75 8.98v6.04z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
