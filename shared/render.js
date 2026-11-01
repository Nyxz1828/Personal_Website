import { initProjects } from './projects.js';
import { languages, loadLanguage, componentNames } from './i18n.js';

const base = new URL('../', import.meta.url);
const components = new Set(componentNames);
const templates = new Map();
let language = readPreference('portfolio-language', 'en');
if (!Object.hasOwn(languages, language)) language = 'en';
let pack;
let languageRequest = 0;

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
  root.querySelectorAll('[data-i18n]').forEach(element => {
    if (pack[element.dataset.i18n] !== undefined) element.textContent = pack[element.dataset.i18n];
  });
  root.querySelectorAll('[data-i18n-aria]').forEach(element => {
    element.setAttribute('aria-label', pack[element.dataset.i18nAria]);
  });
  root.querySelectorAll('[data-i18n-title]').forEach(element => {
    if (pack[element.dataset.i18nTitle] !== undefined) element.title = pack[element.dataset.i18nTitle];
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
  root.querySelectorAll('#languageSelect').forEach(select => {
    select.replaceChildren(...Object.entries(languages).map(([code, metadata]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = metadata.label;
      return option;
    }));
    select.value = language;
  });
}

export async function setLanguage(nextLanguage) {
  if (!Object.hasOwn(languages, nextLanguage)) return;
  const request = ++languageRequest;
  let nextPack;
  try {
    nextPack = await loadLanguage(nextLanguage);
  } catch (error) {
    if (request === languageRequest) {
      document.querySelectorAll('#languageSelect').forEach(select => { select.value = language; });
    }
    console.error(error);
    return false;
  }
  if (request !== languageRequest) return false;
  pack = nextPack;
  language = nextLanguage;
  savePreference('portfolio-language', language);
  document.documentElement.lang = languages[language].htmlLang;
  await translate(document);
  document.dispatchEvent(new CustomEvent('portfolio:language', { detail: language }));
  return true;
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
      target.querySelectorAll('[data-site-home]').forEach(link => {
        link.href = new URL('index.html', base).href;
      });
      await translate(target);
      for (const link of target.querySelectorAll('[data-home-anchor]')) {
        if (document.querySelector('[data-component="' + link.dataset.homeAnchor + '"]')) {
          link.href = '#' + link.dataset.homeAnchor;
        } else {
          link.href = new URL(`index.html#${link.dataset.homeAnchor}`, base).href;
        }
      }
      await initProjects(target, () => pack, base);
      target.dataset.rendered = 'true';
    } catch (error) {
      target.textContent = 'Unable to load this section. 無法載入此區塊。読み込めませんでした。';
      target.setAttribute('role', 'alert');
      console.error(error);
    }
  }));
  document.documentElement.lang = languages[language].htmlLang;
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
try {
  pack = await loadLanguage(language);
} catch (error) {
  console.error(error);
  language = 'en';
  pack = await loadLanguage(language);
}
await renderComponents();
