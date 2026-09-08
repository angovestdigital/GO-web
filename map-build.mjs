import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('world-data.json','utf8'));const {scale,translate}=data.transform;
const arcs=data.arcs.map(a=>{let x=0,y=0;return a.map(p=>{x+=p[0];y+=p[1];return [(x*scale[0]+translate[0]+180)*1000/360,(90-(y*scale[1]+translate[1]))*500/180]})});
function ring(ids){return ids.flatMap(id=>id<0?[...arcs[~id]].reverse():arcs[id]).map((p,i)=>(i?'L':'M')+p.map(n=>n.toFixed(2)).join(',')).join('')+'Z'}
const paths=data.objects.countries.geometries.filter(g=>g.id!=='010').map(g=>{const polys=g.type==='Polygon'?[g.arcs]:g.arcs;return '<path d="'+polys.map(poly=>poly.map(ring).join('')).join('')+'"/>'}).join('');
fs.writeFileSync('public/assets/world.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500"><g fill="#7894a0" stroke="#071523" stroke-width=".5">'+paths+'</g></svg>');
