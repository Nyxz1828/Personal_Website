import { initProjects } from './projects.js';

const base = new URL('../', import.meta.url);
const components = new Set(['header', 'intro', 'about', 'education', 'projects', 'notes', 'additional', 'footer']);
const templates = new Map();
const dictionaries = fetch(new URL('shared/translations.json', base)).then(response => {
  if (!response.ok) throw new Error('Unable to load translations');
  return response.json();
});
let language = readPreference('portfolio-language', 'en');
if (!['en', 'zh', 'jp'].includes(language)) language = 'en';

function readPreference(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function savePreference(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Private browsing may disable storage. */ }
}

function forestText(parent, text) {
  for (const char of text) {
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.className = char === ' ' ? 'forest-space' : 'forest-hover';
    if (char !== ' ') {
      span.tabIndex = 0;
      const letter = document.createElement('span');
      letter.className = 'forest-char';
      letter.textContent = char;
      span.append(letter);
    }
    parent.append(span);
  }
}

async function translate(root) {
  const pack = (await dictionaries)[language];
  root.querySelectorAll('[data-i18n]').forEach(element => {
    if (pack[element.dataset.i18n] !== undefined) element.textContent = pack[element.dataset.i18n];
  });
  root.querySelectorAll('[data-i18n-aria]').forEach(element => {
    element.setAttribute('aria-label', pack[element.dataset.i18nAria]);
  });
  root.querySelectorAll('#Self_into_text').forEach(intro => {
    intro.replaceChildren();
    intro.setAttribute('aria-label', `${pack.Self_into_text.trim()} ${pack.name_text}`);
    forestText(intro, pack.Self_into_text.trim() + ' ');
    const name = document.createElement('span');
    name.id = 'name_text';
    name.className = 'border-b-4 border-indigo-500 pb-1';
    forestText(name, pack.name_text);
    intro.append(name);
  });
  root.querySelectorAll('#languageSelect').forEach(select => { select.value = language; });
}

export async function setLanguage(nextLanguage) {
  if (!['en', 'zh', 'jp'].includes(nextLanguage)) return;
  language = nextLanguage;
  savePreference('portfolio-language', language);
  document.documentElement.lang = { en: 'en', zh: 'zh-Hant', jp: 'ja' }[language];
  await translate(document);
  document.dispatchEvent(new CustomEvent('portfolio:language', { detail: language }));
}

function refreshTheme() {
  const dark = document.documentElement.classList.contains('dark');
  document.querySelectorAll('#themeToggle').forEach(button => {
    button.setAttribute('aria-pressed', String(dark));
    const icon = document.createElement('i');
    icon.dataset.feather = dark ? 'moon' : 'sun';
    button.replaceChildren(icon);
  });
  window.feather?.replace();
}

/** Render any unloaded data-component placeholders within root (including root itself). */
export async function renderComponents(root = document) {
  const targets = [...root.querySelectorAll('[data-component]:not([data-rendered])')];
  if (root.matches?.('[data-component]:not([data-rendered])')) targets.unshift(root);
  await Promise.all(targets.map(async target => {
    const name = target.dataset.component;
    try {
      if (!components.has(name)) throw new Error(`Unknown component: ${name}`);
      if (!templates.has(name)) {
        templates.set(name, fetch(new URL(`components/${name}.html`, base)).then(response => {
          if (!response.ok) throw new Error(`Unable to load ${name}`);
          return response.text();
        }).catch(error => { templates.delete(name); throw error; }));
      }
      const markup = await templates.get(name);
      // A second render call may have finished while this request was pending.
      if (target.dataset.rendered) return;
      target.innerHTML = markup;
      await translate(target);
      for (const link of target.querySelectorAll('[data-home-anchor]')) {
        if (document.querySelector('[data-component="' + link.dataset.homeAnchor + '"]')) {
          link.href = '#' + link.dataset.homeAnchor;
        } else {
          link.href = new URL(`home.html#${link.dataset.homeAnchor}`, base).href;
        }
      }
      await initProjects(target, () => language, base);
      target.dataset.rendered = 'true';
    } catch (error) {
      target.textContent = 'Unable to load this section. 無法載入此區塊。読み込めませんでした。';
      target.setAttribute('role', 'alert');
      console.error(error);
    }
  }));
  document.documentElement.lang = { en: 'en', zh: 'zh-Hant', jp: 'ja' }[language];
  refreshTheme();
  // Sections are fetched after the browser's initial fragment navigation.
  if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
}

document.addEventListener('change', event => {
  if (event.target.matches('#languageSelect')) setLanguage(event.target.value);
});
document.addEventListener('click', event => {
  if (!event.target.closest('#themeToggle')) return;
  document.documentElement.classList.toggle('dark');
  savePreference('portfolio-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  refreshTheme();
});
document.documentElement.classList.toggle('dark', readPreference('portfolio-theme', 'dark') === 'dark');
await renderComponents();
