import { cp, copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const output = resolve(root, 'dist');

await mkdir(output, { recursive: true });
await cp(resolve(root, 'public'), output, { recursive: true, force: true });
await copyFile(resolve(root, 'content', 'immersive.html'), resolve(output, 'index.html'));

console.log('Hostinger static output prepared in dist/.');
