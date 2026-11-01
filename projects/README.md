# Project pages

`FYP.html` renders the ProBall Analytics final-year project using the shared
component system. Its page content and video live in `components/fyp.html`.
Edit its translations in `languages/english/fyp.json`,
`languages/chinese/fyp.json`, and `languages/japanese/fyp.json`.

The header, notes, additional links, and footer reuse the same components as
`index.html`. Language and theme preferences carry between both pages.
The root `FYP.html` redirects here to preserve existing links.

Preview using Live Server or another static web server. The nested page loads
`../shared/styles.css` and `../shared/render.js`; component and language paths
are resolved by the shared renderer.
