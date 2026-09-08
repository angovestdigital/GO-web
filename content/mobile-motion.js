/* Portrait composition; native scrolling drives the same narrative. */
mm.add('(max-width:1100px)',()=>{
  if(RM)return;
  const ecoPin=$('.eco-pin');
  let ecoPhase=-1;
  const setEcoPhase=(index,ready)=>{
    if(index!==ecoPhase){ecoPhase=index;autoEco=index;if(ecoManual===null)setEcoActive(index);}
    ecoPin.classList.toggle('copy-ready',ready);
  };
  gsap.set(ecoLayers[1],{x:28,y:0});
  gsap.set(ecoLayers[2],{x:52,y:0});
  gsap.set('#ecoSpine',{scaleY:0,transformOrigin:'top'});
  gsap.set('#ecoRing',{opacity:0});
  setEcoPhase(0,true);
  gsap.timeline({scrollTrigger:{trigger:ecoPin,start:'top top',end:'+=115%',scrub:.65,pin:true,anticipatePin:1,invalidateOnRefresh:true,
    onUpdate:self=>{
      const p=self.progress;
      ecoPin.dataset.finalTransition=p>=.58?'true':'false';
      if(p<.18)setEcoPhase(0,true);
      else if(p<.42)setEcoPhase(0,false);
      else if(p<.58)setEcoPhase(1,true);
      else if(p<.82)setEcoPhase(1,false);
      else setEcoPhase(2,true);
    }}})
    .to(ecoLayers[1],{x:0,duration:.42,ease:'power2.inOut'},.5)
    .to(ecoLayers[2],{x:24,duration:.42,ease:'power2.inOut'},.5)
    .to('#ecoSpine',{scaleY:.5,duration:.42,ease:'power2.inOut'},.5)
    .to('#ecoRing',{opacity:.35,duration:.24},.94)
    .to(ecoLayers[2],{x:0,duration:.42,ease:'power2.inOut'},1.55)
    .to('#ecoSpine',{scaleY:1,duration:.42,ease:'power2.inOut'},1.55)
    .to('#ecoRing',{opacity:1,duration:.2},1.98)
    .to({},{duration:.4});

  let current=-1;
  const phoneWrap=$('.app-phone-wrap');
  const sizePhone=()=>{
    const landscape=innerWidth>innerHeight;
    const scale=landscape
      ?Math.min(.52,phoneWrap.clientHeight/744,phoneWrap.clientWidth/360)
      :Math.min(.9,Math.max(.72,(innerWidth*.76)/360),(innerHeight-96)/744);
    phoneWrap.style.setProperty('--phone-scale',scale.toFixed(4));
  };
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
  return ()=>{$('#enStage').classList.remove('energy-flowing');ecoPin.classList.remove('copy-ready');delete ecoPin.dataset.finalTransition;ScrollTrigger.removeEventListener('refreshInit',sizePhone);};
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
