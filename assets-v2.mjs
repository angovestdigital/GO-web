import sharp from 'sharp';
const base='C:/Users/manym/.codex/generated_images/01a07c6d-8557-7b41-8a19-7e18633b4f25/';
for(const [source,target] of [['exec-c3d5943e-c7c9-40af-9e62-1611ed2d19e9.png','luanda-taxi'],['exec-a06fcfc0-f369-46f2-bf2f-c7bfde325c41.png','xyami-hub'],['exec-9a370ec6-fb0a-4086-ac65-697e409e0fa6.png','luanda-charging']]){await sharp(base+source).webp({quality:90}).toFile('public/assets/'+target+'.webp');}
await sharp('C:/Users/manym/AppData/Local/Temp/go-official-cutouts/atto-grey.png').trim().resize({width:1500,withoutEnlargement:true}).webp({quality:94}).toFile('public/assets/atto-cutout.webp');
