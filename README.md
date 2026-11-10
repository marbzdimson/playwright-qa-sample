# playwright-qa-sample

Playwright tests I wrote for practice, against two public demo sites:

- the Playwright TodoMVC demo (UI, run on desktop Chrome and a Pixel 7 viewport)
- JSONPlaceholder (REST API)

My work code is under NDA, so I can't put it on GitHub. This is roughly how I set things up there, just pointed at public sites.

A few things I always add:

- the UI tests fail if the page logs a console error. A page can look fine while something underneath is throwing
- for the API I check the negative cases too, e.g. an id that doesn't exist should come back 404, not 200 with an empty body
- the comments test is basically a join check: every comment has to point back to the post I asked for

## Running it

```
npm install
npx playwright install chromium
npx playwright test
```

HTML report after a run: `npx playwright show-report`

Only the UI tests run on the mobile project, the API ones are skipped there since they don't use a browser.
