(()=>{
const modal=document.getElementById('modal');const menu=document.getElementById('mnav');let returnFocus=null;
function focusable(root){return [...root.querySelectorAll('a[href],button,input,select,[tabindex="0"]')].filter(el=>el.offsetParent!==null)}
document.addEventListener('click',e=>{if(e.target.closest('[data-legal],#burger')){returnFocus=e.target.closest('button');setTimeout(()=>{const active=modal?.classList.contains('open')?modal:menu;focusable(active)[0]?.focus()},80)}if(e.target.closest('[data-close],#mclose'))returnFocus?.focus()});
document.addEventListener('keydown',e=>{const active=modal?.classList.contains('open')?modal:menu?.classList.contains('open')?menu:null;if(!active)return;if(e.key==='Escape'){returnFocus?.focus();return}if(e.key==='Tab'){const items=focusable(active);if(!items.length)return;const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
// Phone UI is an illustrative animation, not a live account form.
document.querySelectorAll('.phone input').forEach(el=>el.readOnly=true);
})();
