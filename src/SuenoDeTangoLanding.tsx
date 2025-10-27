import React, { useEffect, useState, useCallback } from "react";

// Sueño de Tango — Variant 6 (compact, optimized)
// RO default, EN/RU/FR supported, 24‑hour time, Monday‑first week, lightbox, i18n, CTA, contact form.
// Fonts: Cormorant Garamond (brand) + Lato (text)
// Animations & hover effects are in styles/app.css. Hero uses local static image.

// -----------------------------
// Types & locales
// -----------------------------

type Locale = 'en' | 'ro' | 'ru' | 'fr';

type TitleKey = 'basicCourse'|'musicalityImprovisation'|'techniqueAxisPivots'|'partnerWorkAbrazo'|'tangoVals'|'practicaMilonga'|'intensiveVals'|'bootcampFromScratch';

type LevelKey = 'beginners'|'improvers'|'allLevels'|'mixedBegImp'|'intermediatePlus'|'open';

type RoomKey = 'roomA'|'roomB'|'mainHall';

const DAYS: Record<Locale,string[]> = {
  en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  ro:['Du','Lu','Ma','Mi','Jo','Vi','Sâ'],
  ru:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
  fr:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
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
      subtitle:'Sueño de Tango este un spațiu în care tangoul devine o manieră de a simți, nu doar de a te mișca. Aici contează contactul, respirația și liniștea dintre pași; tehnica este doar un mijloc de a exprima interiorul. Nu este doar o școală — este o atmosferă a întâlnirii, a visului și a profunzimii.',
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
      title:'Despre școală', p1:'Predăm tango argentinian autentic: de la primii pași la nuanțe profunde ale improvizației.', p2:'Acordăm atenție muzicalității, axei, calității abrazo și culturii de sală.',
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
  },
  fr:{
    siteTitle:'Sueño de Tango',
    nav:{gallery:'Galerie',schedule:'Horaires',about:'À propos',join:'Rejoindre',contact:'S’inscrire'},
    hero:{
      title:'Sueño de Tango', slogan:'El arte del encuentro',
      subtitle:"Sueño de Tango est un espace où le tango devient une manière de ressentir, pas seulement de bouger. Ici, le contact, la respiration et le silence entre les pas comptent ; la technique n’est qu’un moyen d’exprimer ce qui est à l’intérieur. Ce n’est pas seulement une école — c’est une atmosphère de rencontre, de rêve et de profondeur.",
      ctaTrial:'Réserver une leçon d’essai', ctaGallery:'Voir la galerie'
    },
    gallery:{title:'Galerie',intro:'Lumière en contraste, pauses vivantes et souffle de la danse. Cliquez sur une photo pour l’ouvrir en plein écran.'},
    schedule:{
      title:'Horaires', intro:'Choisissez un jour de la semaine pour voir les cours et les événements.', note:'* L’horaire peut changer. Merci de confirmer avant la visite.', cta:'Demander / S’inscrire',
      titles:{
        basicCourse:'Cours de base', musicalityImprovisation:'Musicalité & Improvisation', techniqueAxisPivots:'Technique : axe & pivots', partnerWorkAbrazo:'Travail en couple : abrazo', tangoVals:'Tango‑Vals', practicaMilonga:'Pratique / Milonga', intensiveVals:'Intensif : Vals', bootcampFromScratch:'Bootcamp depuis zéro'
      },
      levels:{beginners:'Débutants',improvers:'Intermédiaires',allLevels:'Tous niveaux',mixedBegImp:'Débutants/Intermédiaires',intermediatePlus:'Intermédiaire+',open:'Ouvert'},
      rooms:{roomA:'Salle A',roomB:'Salle B',mainHall:'Grande salle'}
    },
    about:{
      title:'À propos de l’école', p1:'Nous enseignons le tango argentin authentique : des premiers pas aux nuances profondes de l’improvisation.', p2:'Nous accordons une attention particulière à la musicalité, à l’axe, à la qualité de l’abrazo et à la culture de la piste.',
      bullets:['Groupes pour tous niveaux','Pratiques régulières et milongas','Cours particuliers et stages intensifs'],
      whyTitle:'Pourquoi « Sueño de Tango »', whyText:'Notre philosophie visuelle — le contraste entre la lumière et l’ombre, où chaque pause et pivot se lit comme un plan de cinéma. Nous construisons la danse comme un dialogue et vous invitons dans cette histoire.', join:'Rejoindre', ask:'Poser une question'
    },
    cta:{title:'Prêt pour le premier pas ?',text:'Réservez une leçon d’essai — nous trouverons un niveau et un partenariat confortables.',btn:'S’inscrire'},
    contact:{
      title:'Contact',intro:'Nous sommes au centre-ville. Écrivez‑nous ou laissez une demande.', addressLabel:'Adresse',address:'Strada Vlaicu Vodă 7, București', phoneLabel:'Téléphone', instagram:'Instagram', emailLabel:'E‑mail',
      form:{title:'Envoyer une demande',name:'Nom',phone:'Téléphone',email:'E‑mail',level:'Niveau',levels:['Débutants','Intermédiaires','Intermédiaire / Avancé','Cours particuliers'],message:'Message',messagePh:'Posez une question ou indiquez l’horaire qui vous convient',submit:'Envoyer',consent:'En envoyant, vous acceptez le traitement des données.'},
      alert:'Merci ! Nous vous contacterons bientôt.'
    },
    lightbox:{close:'Fermer',prev:'Précédent',next:'Suivant'}
  }
} as const;

// -----------------------------
// Assets
// -----------------------------

// Base URL for GitHub Pages compatibility (Vite injects base path)
const BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.BASE_URL) ? (import.meta as any).env.BASE_URL as string : '/';

const HERO_BANNER_RAW = BASE_URL + "images/my-hero.webp";
const HERO_BANNER = encodeURI(HERO_BANNER_RAW);
const FALLBACK_HERO = BASE_URL + "images/fallback-hero.webp";

const CTA_BG_SRCSET = `${BASE_URL}images/cta-bg-800.webp 800w, ${BASE_URL}images/cta-bg-1200.webp 1200w, ${BASE_URL}images/cta-bg-1600.webp 1600w, ${BASE_URL}images/cta-bg-2000.webp 2000w`;
const CTA_BG_DEFAULT = `${BASE_URL}images/cta-bg-1600.webp`;
const CTA_BG_SIZES = '100vw';

// Google Maps location
const MAPS_URL = 'https://maps.app.goo.gl/Xe1dM73d6raCRfNU7';

// Contact
const CONTACT_EMAIL = '7437976@gmail.com';
const CONTACT_PHONE = '+40 749 901 534';
const CONTACT_PHONE_TEL = '+40749901534';

// -----------------------------
// Gallery
// -----------------------------

const GALLERY_FILES = ['gallery-01.webp','gallery-02.webp','gallery-03.webp','gallery-04.webp','gallery-05.webp','gallery-06.webp'];
const IMG_SRC = GALLERY_FILES.map(f => BASE_URL + 'images/' + f);
const ALT = {
  en:['Silhouette couple in dramatic light','Close‑up tango steps','Abrazo in backlight','Pivot with torso twist','Couple on an empty stage','Dancers’ shoes details'],
  ro:['Siluetă de cuplu în lumină dramatică','Prim‑plan pași de tango','Abrazo în contralumină','Pivot cu răsucire a trunchiului','Cuplu pe o scenă goală','Detalii de încălțăminte'],
  ru:['Силуэт пары в драматичном свете','Крупный план шагов танго','Абразо на контровом свете','Пивот с разворотом корпуса','Пара на пустой сцене','Детали танцевальной обуви'],
  fr:['Silhouette d’un couple en lumière dramatique','Gros plan des pas de tango','Abrazo à contre‑jour','Pivot avec torsion du buste','Couple sur une scène vide','Détails des chaussures des danseurs']
};
const IMAGES = IMG_SRC.map((src,i)=>({src,alt:{en:ALT.en[i],ro:ALT.ro[i],ru:ALT.ru[i],fr:ALT.fr[i]}}));

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
// Utils & Sanity tests (act like lightweight test cases)
// -----------------------------

function wrapIndex(len:number,index:number,delta:number){return (index+delta+len)%len}

function runSanityChecks(){
  const group=(name:string)=>{try{console.groupCollapsed?.(`[SANITY] ${name}`)}catch{};return()=>{try{console.groupEnd?.()}catch{}}};
  const LOCALES = Object.keys(I18N) as Locale[];

  let end=group('DAYS length = 7 for all locales'); const badDays=Object.entries(DAYS).filter(([,a])=>a.length!==7); badDays.length?console.error('[SANITY] DAYS invalid',badDays):console.log('[SANITY] OK'); end();

  end=group('Schedule dayIndex within range'); const oor=SCHEDULE.filter(s=>s.dayIndex<0||s.dayIndex>6); oor.length?console.error('[SANITY] dayIndex out of range',oor):console.log('[SANITY] OK'); end();

  end=group('wrapIndex boundaries'); const L=IMAGES.length,t1=wrapIndex(L,0,-1)===L-1,t2=wrapIndex(L,L-1,1)===0,t3=wrapIndex(L,2,-3)===L-1; !(t1&&t2&&t3)?console.error('[SANITY] wrapIndex failed',{t1,t2,t3,L}):console.log('[SANITY] OK'); end();

  end=group('Images alt per locale'); const miss: Array<{idx:number;missing:Locale[]}> = []; IMAGES.forEach((img)=>{const m:Locale[]=[]; LOCALES.forEach(Lc=>{if(!img.alt[Lc])m.push(Lc)}); if(m.length)miss.push({idx:IMAGES.indexOf(img),missing:m})}); miss.length?console.error('[SANITY] Missing alts',miss):console.log('[SANITY] OK'); end();

  end=group('Schedule keys present in I18N'); const missing:any[]=[]; SCHEDULE.forEach((s,i)=>{LOCALES.forEach(Lc=>{const tt=I18N[Lc].schedule; if(!tt.titles[s.titleKey])missing.push({i,Lc,key:s.titleKey,type:'title'}); if(!tt.levels[s.levelKey])missing.push({i,Lc,key:s.levelKey,type:'level'}); if(!tt.rooms[s.roomKey])missing.push({i,Lc,key:s.roomKey,type:'room'})})}); missing.length?console.error('[SANITY] Missing schedule translations',missing):console.log('[SANITY] OK'); end();

  end=group('WEEK_ORDER Monday‑first'); const isPerm=WEEK_ORDER.slice().sort().every((v,i)=>v===i); !(WEEK_ORDER[0]===1&&WEEK_ORDER[6]===0&&isPerm)?console.error('[SANITY] WEEK_ORDER invalid',WEEK_ORDER):console.log('[SANITY] OK: Monday‑first'); end();

  end=group('Schedule time 24h format'); const re=/^([01]\d|2[0-3]):[0-5]\d–([01]\d|2[0-3]):[0-5]\d$/; const badTimes=SCHEDULE.filter(s=>!re.test(s.time)); badTimes.length?console.error('[SANITY] Bad time format',badTimes):console.log('[SANITY] OK'); end();

  end=group('Exactly one EN DASH in each time'); const split=SCHEDULE.filter(s=>s.time.split('–').length!==2); split.length?console.error('[SANITY] Multiple or missing EN DASH',split):console.log('[SANITY] OK'); end();

  end=group('CTA srcset sanity'); const ok=['800w','1200w','1600w','2000w'].every(k=>CTA_BG_SRCSET.includes(k)); !ok?console.error('[SANITY] CTA_BG_SRCSET missing sizes'):console.log('[SANITY] OK'); end();
}

// -----------------------------
// Component
// -----------------------------

export default function SuenoDeTangoLanding(){
  const [menuOpen,setMenuOpen]=useState(false);
  const [lightboxIndex,setLightboxIndex]=useState<number|null>(null);
  const [fitMode,setFitMode]=useState<'contain'|'cover'>('contain');
  const [locale,setLocale]=useState<Locale>(()=>{if(typeof window==='undefined')return 'ro'; const s=window.localStorage.getItem('tango_locale') as Locale|null; return (s&&(['en','ro','ru','fr'] as Locale[]).includes(s))?s:'ro'});
  const t=I18N[locale];
  const todayIndex=new Date().getDay();
  const [activeDay,setActiveDay]=useState<number>(todayIndex);

  useEffect(()=>{try{window.localStorage.setItem('tango_locale',locale)}catch{}},[locale]);
  useEffect(()=>{ try{ document.documentElement.lang = locale; }catch{} }, [locale]);

  // Google Fonts + App CSS + Preload hero (guarded)
  useEffect(()=>{
    if (!document.querySelector('link[data-gf]')) {
      const pre1 = document.createElement('link'); pre1.rel='preconnect'; pre1.href='https://fonts.googleapis.com'; pre1.setAttribute('data-gf',''); document.head.appendChild(pre1);
      const pre2 = document.createElement('link'); pre2.rel='preconnect'; pre2.href='https://fonts.gstatic.com'; pre2.crossOrigin='anonymous'; pre2.setAttribute('data-gf',''); document.head.appendChild(pre2);
      const css = document.createElement('link'); css.rel='stylesheet'; css.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Lato:ital,wght@0,100..900;1,100..900&display=swap'; css.setAttribute('data-gf',''); document.head.appendChild(css);
    }
    if (!document.querySelector('link[data-app-css]')) {
      const l = document.createElement('link');
      l.rel='stylesheet';
      l.href=BASE_URL+'styles/app.css';
      l.setAttribute('data-app-css','');
      document.head.appendChild(l);
    }
    if (!document.querySelector('link[data-preload-hero]')) {
      const l=document.createElement('link'); l.rel='preload'; l.as='image'; l.href=HERO_BANNER; l.setAttribute('data-preload-hero',''); document.head.appendChild(l);
    }
  },[]);

  // Favicons (local files, no external links)
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

  useEffect(()=>{console.log('[SANITY] running'); runSanityChecks()},[]);

  const openLightbox=useCallback((i:number)=>{setLightboxIndex(i)},[]);
  const closeLightbox=useCallback(()=>{setLightboxIndex(null)},[]);
  const prevImage=useCallback(()=>{if(lightboxIndex===null)return; setLightboxIndex(i=>wrapIndex(IMAGES.length,i!,-1))},[lightboxIndex]);
  const nextImage=useCallback(()=>{if(lightboxIndex===null)return; setLightboxIndex(i=>wrapIndex(IMAGES.length,i!,1))},[lightboxIndex]);

  useEffect(()=>{ if(lightboxIndex===null) return; const onKey=(e:KeyboardEvent)=>{ if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowLeft') prevImage(); if(e.key==='ArrowRight') nextImage(); if(e.key==='f'||e.key==='F') setFitMode(m=>m==='contain'?'cover':'contain') }; window.addEventListener('keydown',onKey); return()=>window.removeEventListener('keydown',onKey) },[lightboxIndex,closeLightbox,prevImage,nextImage]);

  const handleSubmit=(e:React.FormEvent)=>{e.preventDefault(); const f=e.target as HTMLFormElement; const data=new FormData(f); const obj=Object.fromEntries(data.entries()) as Record<string,FormDataEntryValue>; const subject = `${t.siteTitle} — Contact form`; const body = `Name: ${obj.name||''}\nPhone: ${obj.phone||''}\nEmail: ${obj.email||''}\nLevel: ${obj.level||''}\nMessage: ${obj.message||''}`; const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; try{ window.location.href = mailto; }catch(err){ console.warn('[Form] mailto failed', err); } alert(t.contact.alert); f.reset();};

  const daysMondayFirst = [1,2,3,4,5,6,0].map(d=>({ idx:d, label:DAYS[locale][d] }));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-red-600/40 font-text">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="#hero" className="font-brand text-xl tracking-wide inline-block hz-sm">{t.siteTitle}</a>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            <a className="hover:text-red-400/90 inline-flex hz-nav transform-gpu" href="#gallery">{t.nav.gallery}</a>
            <a className="hover:text-red-400/90 inline-flex hz-nav transform-gpu" href="#schedule">{t.nav.schedule}</a>
            <a className="hover:text-red-400/90 inline-flex hz-nav transform-gpu" href="#about">{t.nav.about}</a>
            <a className="hover:text-red-400/90 inline-flex hz-nav transform-gpu" href="#cta">{t.nav.join}</a>
            <a className="rounded-full border border-red-600/60 px-4 py-1.5 text-sm hover:bg-red-600/20 hz-sm transform-gpu" href="#contact">{t.nav.contact}</a>
          </nav>
          <div className="flex items-center gap-2">
            <select aria-label="Language selector" value={locale} onChange={(e)=>{const v=e.target.value as Locale; setLocale(v);}} className="hidden md:block rounded-xl border border-white/15 bg-neutral-900 px-3 py-2 text-sm">
              <option value="en">EN</option><option value="ro">RO</option><option value="ru">RU</option><option value="fr">FR</option>
            </select>
            <button aria-label="Open menu" className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 hz-sm" onClick={()=>{setMenuOpen(s=>!s)}}>
              <span className="sr-only">Menu</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-white/10 md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3" onClick={()=>setMenuOpen(false)}>
              <div className="mb-2"><label className="mr-2 text-sm text-neutral-400" htmlFor="locale-sm">Lang</label>
                <select id="locale-sm" value={locale} onChange={(e)=>{const v=e.target.value as Locale; setLocale(v);}} className="rounded-lg border border-white/15 bg-neutral-900 px-2 py-1 text-sm"><option value="en">EN</option><option value="ro">RO</option><option value="ru">RU</option><option value="fr">FR</option></select>
              </div>
              <a className="py-2 inline-flex hz-nav transform-gpu" href="#gallery">{t.nav.gallery}</a>
              <a className="py-2 inline-flex hz-nav transform-gpu" href="#schedule">{t.nav.schedule}</a>
              <a className="py-2 inline-flex hz-nav transform-gpu" href="#about">{t.nav.about}</a>
              <a className="py-2 inline-flex hz-nav transform-gpu" href="#cta">{t.nav.join}</a>
              <a className="py-2 inline-flex hz-nav transform-gpu" href="#contact">{t.nav.contact}</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="hero" className="relative isolate">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={HERO_BANNER}
            alt={IMAGES[0].alt[locale]}
            className="h-full w-full object-cover opacity-70"
            loading="eager" decoding="async" fetchpriority="high" width={2000} height={1200}
            onError={(e)=>{(e.currentTarget as HTMLImageElement).src = FALLBACK_HERO}}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-neutral-950"/>
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-28 md:py-40 lg:py-48">
          <h1 className="hero-title max-w-3xl font-brand font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.92] text-left transform-gpu hz-md hero-anim glow-breath">
            <span className="hero-line hero-line1">Sueño</span>
            <span className="hero-line hero-line2">de Tango</span>
          </h1>
          <p className="hero-slogan font-brand font-bold tracking-wide text-2xl md:text-3xl lg:text-4xl text-left glow-breath">{t.hero.slogan}</p>
          <p className="max-w-xl text-neutral-300 md:text-lg">{t.hero.subtitle}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#contact" className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-medium tracking-wide hover:bg-red-500 hz-sm transform-gpu">{t.hero.ctaTrial}</a>
            <a href="#gallery" className="rounded-2xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10">{t.hero.ctaGallery}</a>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" aria-label={t.nav.gallery} className="mx-auto max-w-7xl px-4 py-16">
        <header className="mb-8 flex items-end justify-between">
          <div><h2 className="font-brand text-3xl md:text-4xl">{t.gallery.title}</h2><p className="mt-2 max-w-2xl text-neutral-400">{t.gallery.intro}</p></div>
          <a href="#contact" className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10 md:inline-block hz-sm transform-gpu">{t.nav.contact}</a>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {IMAGES.map((img,i)=>(
            <button key={i} onClick={()=>openLightbox(i)} className="group relative overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-inset ring-white/10 hz-md transform-gpu">
              <div className="relative h-64 w-full md:h-60 lg:h-72">
                <img src={img.src} alt={img.alt[locale]} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-95"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"/>
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
            <button key={idx} onClick={()=>setActiveDay(idx)} className={`rounded-full border px-3 py-1.5 text-sm hz-sm ${activeDay===idx? 'border-red-600 bg-red-600/20' : 'border-white/15 hover:bg-white/10'}`}>{label}</button>
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
              <a href="#cta" className="rounded-xl bg-red-600 px-4 py-2 text-sm hover:bg-red-500 hz-sm transform-gpu">{t.about.join}</a>
              <a href="#contact" className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10 hz-sm transform-gpu">{t.about.ask}</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <picture>
            <source type="image/webp" srcSet={CTA_BG_SRCSET} sizes={CTA_BG_SIZES} />
            <img
              src={CTA_BG_DEFAULT}
              alt={IMAGES[5].alt[locale]}
              className="h-full w-full object-cover opacity-40 cta-image"
              loading="lazy"
              onError={(e)=>{(e.currentTarget as HTMLImageElement).src = FALLBACK_HERO}}
            />
          </picture>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-8 backdrop-blur">
            <h2 className="font-brand text-3xl md:text-4xl">{t.cta.title}</h2>
            <p className="mt-2 max-w-2xl text-neutral-300">{t.cta.text}</p>
            <a href="#contact" className="mt-5 inline-block rounded-2xl bg-red-600 px-5 py-3 text-sm font-medium hover:bg-red-500 hz-sm transform-gpu">{t.cta.btn}</a>
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
              <p><strong>{t.contact.addressLabel}:</strong> <a className="underline decoration-white/30 underline-offset-4 hover:text-red-400" href={MAPS_URL} target="_blank" rel="noreferrer noopener">{t.contact.address}</a></p>
              <p><strong>{t.contact.phoneLabel}:</strong> <a className="underline decoration-white/30 underline-offset-4 hover:text-red-400" href={'tel:'+CONTACT_PHONE_TEL}>{CONTACT_PHONE}</a></p>
              <p><strong>{t.contact.emailLabel}:</strong> <a className="underline decoration-white/30 underline-offset-4 hover:text-red-400" href={'mailto:'+CONTACT_EMAIL}>{CONTACT_EMAIL}</a></p>
              <p><strong>Instagram:</strong> <a className="underline decoration-white/30 underline-offset-4 hover:text-red-400" href="https://www.instagram.com/dimon_yachmen?igsh=MWxtN2kxcnVsdmI3bg==" target="_blank" rel="noreferrer noopener">@dimon_yachmen</a></p>
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
              <a className="underline decoration-white/30 underline-offset-4 hover:text-red-400" href={MAPS_URL} target="_blank" rel="noreferrer noopener">Open in Google Maps</a>
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
            <div className="mt-5 flex items-center gap-3"><button type="submit" className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-medium hover:bg-red-500">{t.contact.form.submit}</button><span className="text-xs text-neutral-400">{t.contact.form.consent}</span></div>
          </form>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex!==null && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button aria-label={t.lightbox.close} className="absolute right-4 top-4 rounded-xl border border-white/20 p-2 hover:bg-white/10 hz-sm" onClick={closeLightbox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <button aria-label={t.lightbox.prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/20 p-3 hover:bg-white/10 hz-sm" onClick={prevImage}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button aria-label={t.lightbox.next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/20 p-3 hover:bg-white/10 hz-sm" onClick={nextImage}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l6 6-6 6"/></svg>
          </button>
          <div className="w-[min(96vw,1600px)] lb-wrap">
            <img
              src={IMAGES[lightboxIndex].src}
              alt={IMAGES[lightboxIndex].alt[locale]}
              className={"lb-img rounded-2xl shadow-2xl ring-1 ring-white/10 "+(fitMode==='cover'?'object-cover':'object-contain')}
              onLoad={(e)=>{ const img=e.currentTarget; const vw=Math.min(window.innerWidth,1600); const vh=window.innerHeight*0.92; const vp=vw/vh; const ar=img.naturalWidth/img.naturalHeight; const mode=((Math.abs(ar - vp)/vp) <= 0.12)?'cover':'contain'; setFitMode(mode as 'contain'|'cover'); }}
              onDoubleClick={()=> setFitMode(m=>m==='contain'?'cover':'contain')}
            />
            <p className="mt-3 text-center text-sm text-neutral-300">{IMAGES[lightboxIndex].alt[locale]}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-neutral-950/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <p className="text-sm text-neutral-400">© {new Date().getFullYear()} {t.siteTitle}</p>
          <div className="flex items-center gap-4 text-neutral-300">
            <a href="https://www.instagram.com/dimon_yachmen?igsh=MWxtN2kxcnVsdmI3bg==" className="hover:text-red-400 inline-flex hz-sm" aria-label="Instagram" target="_blank" rel="noreferrer noopener">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/></svg>
            </a>
            <a href="https://www.facebook.com/dimon.yachmen" className="hover:text-red-400 inline-flex hz-sm" aria-label="Facebook" target="_blank" rel="noreferrer noopener">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://www.youtube.com/@dimadiamante" className="hover:text-red-400 inline-flex hz-sm" aria-label="YouTube" target="_blank" rel="noreferrer noopener">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 3.8 12 3.8 12 3.8s-6.88 0-8.59.62a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20.2 12 20.2 12 20.2s6.88 0 8.59-.62a2.78 2.78 0 0 0 1.95-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><path d="M9.75 15.02 15.5 12 9.75 8.98v6.04z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
