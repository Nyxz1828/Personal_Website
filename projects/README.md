# Project pages

## English Teaching Platform

`English_teaching_Platform.html` uses `components/english_teaching.html` for its
project overview, collaborator links, video, and course document. Edit the
`english_teaching.json` file in `languages/english/`, `languages/chinese/`, or
`languages/japanese/` to update its text. The header, notes, additional links,
and footer share the same components as the index and FYP pages.
The original root URL redirects to this page.

## ProBall Analytics

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
