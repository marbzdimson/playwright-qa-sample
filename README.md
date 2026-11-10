# playwright-qa-sample

Playwright tests I wrote for practice, against two public demo sites:

- the Playwright TodoMVC demo (UI, run on desktop Chrome and a Pixel 7 viewport)
- JSONPlaceholder (REST API)

My work code is under NDA, so I can't put it on GitHub. This is roughly how I set things up there, just pointed at public sites.

A few things I always add:

- the UI tests fail if the page logs a console error. A page can look fine while something underneath is throwing
- for the API I check the negative cases too, e.g. an id that doesn't exist should come back 404, not 200 with an empty body
- the comments test is basically a join check: every comment has to point back to the post I asked for

## Setup on your machine

You need:

- Node.js 18 or newer (check with `node -v`), from https://nodejs.org
- Git
- internet access, since the tests hit the two public sites

Clone it and install:

```
git clone https://github.com/marbzdimson/playwright-qa-sample.git
cd playwright-qa-sample
npm install
npx playwright install chromium
```

The last command downloads the Chromium browser Playwright uses (around 150 MB, only the first time). On Linux, if it complains about missing libraries, run `npx playwright install --with-deps chromium` instead.

## Running the tests

```
npx playwright test
```

You should see 15 passed and 5 skipped. Only the UI tests run on the mobile project, the API ones are skipped there since they don't use a browser.

Some other ways I run it:

```
npx playwright test tests/api.spec.ts      # only the API tests
npx playwright test tests/todo.spec.ts     # only the UI tests
npx playwright test --project=desktop      # desktop only, skip the phone viewport
npx playwright test --headed               # watch the browser while it runs
npx playwright test --ui                   # Playwright's UI mode, step through each test
npx playwright show-report                 # open the HTML report from the last run
```

If a test fails, the report has a screenshot and a trace for it. Open the trace to see every step, the network calls and the console.
