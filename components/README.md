# Reusable portfolio sections

Open `index.html` through a local web server (VS Code Live Server works). The
renderer fetches HTML and JSON, so opening the file directly with `file://`
will not work. No build command is needed.

`index.html` and `home.html` use the shared component implementation. Pages
that use these components share updates automatically.

## Render sections on another page

Copy the `<head>` setup from `index.html` (Tailwind configuration, Feather icons,
shared stylesheet, and module script), then include the sections you want:

```html
<div data-component="header"></div>
<main>
  <div data-component="intro"></div>
  <div data-component="about"></div>
  <div data-component="education"></div>
  <div data-component="projects"></div>
  <div data-component="notes"></div>
  <div data-component="additional"></div>
</main>
<div data-component="footer"></div>
```

Use each section once per page. Omit or reorder sections as needed. Paths to
the stylesheet and module must be relative to your page; for a nested page,
use `../shared/styles.css` and `../shared/render.js`. The renderer resolves
its component files, project links, and data relative to the site root folder.
Header links navigate to a local section when included, otherwise to `index.html`.
Do not also load `index.js` or the old `projects.js` on a component page.

## Edit shared content

- `components/*.html`: section structure, links, images, and technology lists.
- `shared/styles.css`: typography, colors, and hover effects.
- `languages/english/`, `languages/chinese/`, `languages/japanese/`: each folder
  has a JSON language file for every component (for example, `about.json`).
  Match `data-i18n` attributes to translation keys.
  Edit translated text here; it replaces the HTML fallback text on render.
- `shared/projects.json`: project IDs, links, images, and tags. Card titles and
  descriptions live under `projects` in each language folder's `projects.json`.
- `shared/i18n.js`: language registry, dynamic loading, caching, and English fallback.
- `shared/render.js`: section loading, language switching, intro animation,
  navigation, and theme controls.
- `shared/projects.js`: shared carousel behavior.

Language and theme preferences persist across pages that use this renderer.
The Japanese selector uses `jp` internally; the document language is set to `ja`.

`projects/FYP.html` renders its overview and video with `data-component="fyp"`.
Edit `components/fyp.html` for layout and each language folder's `fyp.json`
for text. Its header, notes, additional links, and footer are shared with home.

## Render sections added by JavaScript

The module renders placeholders automatically on page load. If you add more
placeholders later, render them explicitly:

```js
const { renderComponents, setLanguage } = await import('./shared/render.js');
const section = document.createElement('div');
section.dataset.component = 'education';
document.querySelector('main').append(section);
await renderComponents(section);
await setLanguage('zh'); // en, zh, or jp
```

Repeated render calls leave already rendered sections intact. Reload the page
to pick up edits to a shared HTML file.

## Verify behavior

Run `node scripts/home.cjs` from the project folder. It uses the existing
Puppeteer dependency and an installed Chromium browser, starts a temporary local
server, and checks all three languages, carousel controls, preferences, and
reuse on a page containing only the header and education sections. External
CDNs are stubbed; this checks behavior rather than CDN availability or styling.
