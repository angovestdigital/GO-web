/* Portrait composition; native scrolling drives the same narrative. */
mm.add('(max-width:1100px)',()=>{
  if(RM)return;
  let current=-1;
  const phoneWrap=$('.app-phone-wrap');
  const sizePhone=()=>phoneWrap.style.setProperty('--phone-scale',Math.min(.72,phoneWrap.clientHeight/744,(innerWidth-44)/360));
  sizePhone();
  ScrollTrigger.addEventListener('refreshInit',sizePhone);
  const select=i=>{if(i===current)return;current=i;setStep(i);};
  select(0);
  ScrollTrigger.create({trigger:'.app-grid',start:()=>`top ${$('.nav').getBoundingClientRect().bottom+14}px`,end:()=>'+='+steps.length*innerHeight*.65,pin:true,anticipatePin:1,invalidateOnRefresh:true,
    onUpdate:s=>select(Math.min(steps.length-1,Math.floor(s.progress*steps.length)))});

  const card=$('#chargeCard'),status=$('.live',card),rows=$$('.cc-rows .l b',card);
  card.removeAttribute('aria-hidden');
  const session={progress:0};
  function charging(){
    const p=session.progress,connected=p>=.18,active=p>=.3;
    const amount=gsap.utils.clamp(0,1,(p-.3)/.7);
    status.textContent=active?'Charging':connected?'Connected':'Waiting';
    card.dataset.state=active?'charging':connected?'connected':'waiting';
    $('#ccPct').textContent=Math.round(amount*68)+'%';
    $('#ccKw').textContent=active?Math.round(18+amount*29)+' kW':'0 kW';
    $('#ccArc').style.strokeDashoffset=326.7*(1-amount*.68);
    rows[1].textContent=active?'≈ '+Math.round(48-amount*24)+' min':'—';
    const solar=Math.round(40+amount*23),storage=Math.round(30-amount*8);
    rows[2].textContent=active?`Solar ${solar}% · Storage ${storage}% · Grid ${100-solar-storage}%`:'Awaiting connection';
    $('#enCap').textContent=active?'Charging · energy flowing to your vehicle':connected?'Connection confirmed':'Preparing your charging session';
    $('#enStage').classList.toggle('energy-flowing',active);
  }
  charging();
  gsap.set('.en-lbl',{opacity:0});
  gsap.timeline({scrollTrigger:{trigger:'#enPin',start:'top top',end:'+=340%',pin:true,scrub:.65,anticipatePin:1,invalidateOnRefresh:true}})
    .fromTo('#enStage',{scale:.85,opacity:.5},{scale:1,opacity:1,duration:.65},0)
    .to('.en-lbl',{opacity:1,duration:.3,stagger:.1},.2)
    .fromTo(card,{opacity:0,y:35},{opacity:1,y:0,duration:.4},.35)
    .to('#enCable',{strokeDashoffset:0,duration:.5},.7)
    .fromTo('#enCar',{scale:.5,opacity:0,svgOrigin:'700 540'},{scale:1,opacity:1,duration:.35},.9)
    .to(session,{progress:1,duration:3.3,ease:'none',onUpdate:charging},0)
    .to({},{duration:.45});
  return ()=>{$('#enStage').classList.remove('energy-flowing');ScrollTrigger.removeEventListener('refreshInit',sizePhone);};
});

// Decode nearby media before entering pinned scenes. Coalesce refreshes rather
// than remeasuring on every load/scroll or mobile address-bar movement.
ScrollTrigger.config({ignoreMobileResize:true});
let mediaRefresh;
const refreshMedia=()=>{clearTimeout(mediaRefresh);mediaRefresh=setTimeout(()=>{ScrollTrigger.sort();ScrollTrigger.refresh();},160);};
const mediaObserver=new IntersectionObserver(entries=>entries.forEach(({isIntersecting,target})=>{
  if(!isIntersecting)return;
  target.loading='eager';
  target.decode().catch(()=>{}).then(refreshMedia);
  mediaObserver.unobserve(target);
}),{rootMargin:'100% 0px'});
document.querySelectorAll('.veh-pin img,.en-pin img,.people-chapter img').forEach(img=>mediaObserver.observe(img));
window.addEventListener('orientationchange',()=>setTimeout(refreshMedia,300));
document.fonts.ready.then(refreshMedia);
