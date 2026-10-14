import { readFile, writeFile, mkdir, cp, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const profile = JSON.parse(await readFile(path.join(root, 'content/profile.json'), 'utf8'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function url(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) { new URL(value); return esc(value); }
  if (/^(assets\/)[\w./-]+$/.test(value) && !value.includes('..')) return esc(value);
  throw new Error(`Unsupported link: ${value}`);
}
function external(href, text, className='') {
  return `<a href="${url(href)}" class="${className}" target="_blank" rel="noopener noreferrer">${esc(text)}<span class="external" aria-hidden="true">↗</span></a>`;
}
for (const key of ['name','affiliation','email','scholarUrl','photo']) {
  if (typeof profile[key] !== 'string' || !profile[key].trim()) throw new Error(`Missing field: ${key}`);
}
if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(profile.email)) throw new Error('Invalid email');
if (!profile.photo.startsWith('assets/') || profile.photo.includes('..')) throw new Error('Photo must be in assets/');
await access(path.join(root, profile.photo));
for (const pub of profile.publications) {
  if (!pub.title || !pub.authors || !pub.venue || !pub.url) throw new Error('Publication has missing fields');
  if (pub.year !== null && (!Number.isInteger(pub.year) || pub.year < 1900 || pub.year > 2200)) throw new Error('Invalid publication year');
  url(pub.url);
}
const publications = [...profile.publications].sort((a,b)=>(b.year ?? 0)-(a.year ?? 0));
const authors = text => esc(text).replace(/\b(B\. Chi|Ben Chi)\b/g, '<strong>$1</strong>');
const paperHtml = publications.map(p => `<li class="publication">
  <div class="pub-year">${p.year ?? '—'}</div>
  <article><h3 class="pub-title"><a href="${url(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.title)}</a></h3>
  <p class="pub-authors">${authors(p.authors)}</p>
  <p class="pub-venue"><em>${esc(p.venue)}</em>${p.details ? ` · ${esc(p.details)}` : ''}</p>
  <div class="pub-links">${external(p.url, p.venue === 'SSRN' ? 'SSRN' : 'Paper')}${p.pdf ? external(p.pdf,'PDF') : ''}${p.code ? external(p.code,'Code') : ''}</div></article></li>`).join('\n');
const news = profile.news?.length ? `<section class="section" id="news"><div class="section-heading"><h2>News</h2></div><ul class="news-list">${profile.news.map(n=>`<li><time>${esc(n.date)}</time>${esc(n.text)}</li>`).join('')}</ul></section>` : '';
const description = `${profile.name} at ${profile.affiliation}. Research in smart cities, human mobility, and artificial intelligence.`;
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(profile.name)} | ${esc(profile.affiliation)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#fcfcf9">
  <meta property="og:type" content="website"><meta property="og:title" content="${esc(profile.name)} | ${esc(profile.affiliation)}"><meta property="og:description" content="${esc(description)}">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="shell">
  <header class="topbar"><a class="wordmark" href="#about" aria-label="${esc(profile.name)} home">bc<span>.</span></a><nav aria-label="Main navigation"><a href="#about">About</a><a href="#research">Research</a><a href="#publications">Publications</a><a href="#contact">Contact</a></nav></header>
  <main id="main">
  <section class="hero" id="about" aria-labelledby="name">
    <div class="hero-copy"><h1 id="name">${esc(profile.name)}<span class="chinese-name" lang="zh-CN">${esc(profile.nameChinese)}</span></h1>
    <p class="affiliation"><a href="${url(profile.affiliationUrl)}">${esc(profile.affiliation)}</a></p>
    <div class="bio">${profile.bio.map(p=>`<p>${esc(p)}</p>`).join('')}</div>
    <div class="links"><a href="mailto:${esc(profile.email)}">Email <span aria-hidden="true">↗</span></a>${external(profile.scholarUrl,'Google Scholar')}${profile.cvUrl ? external(profile.cvUrl,'CV') : ''}${profile.githubUrl ? external(profile.githubUrl,'GitHub') : ''}</div></div>
    <figure class="portrait"><img src="${url(profile.photo)}" alt="${esc(profile.photoAlt)}" width="1254" height="1254" fetchpriority="high"></figure>
  </section>
  <section class="section" id="research" aria-labelledby="research-heading"><div class="section-heading"><h2 id="research-heading"><span class="section-number" aria-hidden="true">01</span>Research interests</h2></div><div class="research-grid">${profile.research.map(r=>`<div class="research-item"><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p></div>`).join('')}</div></section>
  ${news}
  <section class="section" id="publications" aria-labelledby="publications-heading"><div class="section-heading"><h2 id="publications-heading"><span class="section-number" aria-hidden="true">02</span>Publications</h2>${external(profile.scholarUrl,'Google Scholar','section-link')}</div><ol class="publication-list">${paperHtml}</ol></section>
  <section class="section contact" id="contact" aria-labelledby="contact-heading"><div><h2 id="contact-heading"><span class="section-number" aria-hidden="true">03</span>Get in touch</h2><p>For research conversations and academic exchange.</p></div><a class="email-link" href="mailto:${esc(profile.email)}">${esc(profile.email)} <span aria-hidden="true">↗</span></a></section>
  </main>
  <footer><span>© ${new Date().getUTCFullYear()} ${esc(profile.name)}</span><span>${esc(profile.affiliation)}</span></footer>
  </div>
</body>
</html>`;
await mkdir(path.join(root,'dist'), {recursive:true});
await cp(path.join(root,'assets'),path.join(root,'dist/assets'),{recursive:true});
await writeFile(path.join(root,'dist/index.html'),html);
await writeFile(path.join(root,'dist/.nojekyll'),'');
console.log(`Built dist/index.html · ${publications.length} publications · no runtime dependencies`);
