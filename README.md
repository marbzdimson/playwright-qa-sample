# Playwright QA sample

A small test suite that shows how I test a web app and an API.

## What it covers

**UI tests** (`tests/todo.spec.ts`) on the public Playwright TodoMVC demo, at desktop and phone width:
- adding items and checking the counter
- input edge cases: extra spaces and empty input
- completing items and checking the Active and Completed filters
- data surviving a page reload
- editing an item to empty removes it
- every test also fails if the page logs a console error, because a page can look fine and still be broken

**API tests** (`tests/api.spec.ts`) on the public JSONPlaceholder API:
- status code, headers and response shape
- a filtered list only returns matching records
- related records point back to their parent (the same idea as checking a SQL join)
- POST returns what was sent
- a missing record returns 404, not an empty success

The UI tests use a small page object (`tests/todo.pages.ts`) so each test reads like a test case.

## Run it

```
npm install
npx playwright install chromium
npm test
npm run report
```

For each failed test Playwright keeps a screenshot and a trace.
