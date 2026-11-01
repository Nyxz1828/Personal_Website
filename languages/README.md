# Language packs

- `english/`: English and fallback text.
- `chinese/`: Traditional Chinese.
- `japanese/`: Japanese (document language `ja`).

Each folder contains `header.json`, `intro.json`, `about.json`, `education.json`,
`projects.json`, `notes.json`, `additional.json`, `footer.json`, and `fyp.json`.
For example, edit `chinese/about.json` to update the Chinese About Me section.
Edit `chinese/fyp.json` to update the Chinese final-year project detail page.

Edit a component's language file to update it across every page using the shared
renderer. Top-level keys match `data-i18n` in the component HTML. The `projects`
object in each folder's `projects.json` contains card titles and descriptions, keyed by stable project IDs from
`shared/projects.json`. Keep the same keys in each language. Values are plain text.

Only English and the selected language's component packs are fetched in parallel. Requests are cached for the
current page. Missing keys and missing project fields fall back to English.
If a requested pack fails to load, the current language stays active and the
selection resets; a saved pack that fails during startup falls back to English.
Rapid switching always applies the most recently requested language.

To add a language, copy the `english/` folder, translate each component file, and add
its code, folder name, selector label, and HTML language tag to `languages` in `shared/i18n.js`.
The selector populates automatically from that registry. No renderer changes needed.

Reload the page after editing a pack. Preview with a local web server, not `file://`.
Both `index.html` and `home.html` use these component language packs.
