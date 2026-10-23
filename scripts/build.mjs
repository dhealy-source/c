import {readFile, mkdir, writeFile, cp} from 'node:fs/promises';
const base = new URL('../', import.meta.url);
const read = p => readFile(new URL(p,base),'utf8');
const [html,css,app,creative,svg] = await Promise.all(['web/index.html','web/style.css','web/app.js','web/creative.js','web/assets/coast.svg'].map(read));
const data = 'data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64');
const script = creative.replace(/^export /gm,'')+'\nconst esc = escapeHTML;\n'+app.replace(/^import .*\n/,'').replace("const coast = await fetch('/assets/coast.svg').then(r=>r.text());",'').replace("const imageData='data:image/svg+xml;base64,'+btoa(coast);",`const imageData=${JSON.stringify(data)};`).replaceAll('/assets/coast.svg', data);
const output = html.replace('<link rel="stylesheet" href="/style.css">', '<style>'+css.replace(/^@import[^\n]*\n/,'')+'</style>').replaceAll('/assets/coast.svg',data).replace('<a class="brand" href="/">','<a class="brand" href="#">').replace('<script type="module" src="/app.js"></script>',()=>'<script type="module">'+script.replaceAll('</script','<\\/script')+'</script>');
await mkdir(new URL('dist/',base),{recursive:true});
await writeFile(new URL('dist/ad-studio.html',base),output);
console.log('Built dist/ad-studio.html — open directly in a browser, no server required.');

await cp(new URL('web/',base), new URL('dist/site/',base), {recursive:true});
console.log('Built dist/site/ — upload this folder to a static website host.');
