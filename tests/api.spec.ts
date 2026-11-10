import { test, expect } from '@playwright/test';

// API checks against the public JSONPlaceholder test API.
// They need no browser, so they run once (desktop project only).
test.describe('Posts API', () => {
  test.skip(({ isMobile }) => isMobile, 'API tests run once');
  const base = 'https://jsonplaceholder.typicode.com';

  test('GET a post returns the expected shape', async ({ request }) => {
    const res = await request.get(`${base}/posts/1`);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    const post = await res.json();
    expect(post).toMatchObject({ id: 1, userId: expect.any(Number), title: expect.any(String) });
  });

  test('a filtered list only returns records for that user', async ({ request }) => {
    const res = await request.get(`${base}/posts`, { params: { userId: 3 } });
    expect(res.ok()).toBeTruthy();
    const posts = await res.json();
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) expect(p.userId).toBe(3);
  });

  test('comments for a post all point back to that post (a join check)', async ({ request }) => {
    const [post, comments] = await Promise.all([
      request.get(`${base}/posts/5`).then(r => r.json()),
      request.get(`${base}/posts/5/comments`).then(r => r.json()),
    ]);
    expect(comments.length).toBeGreaterThan(0);
    for (const c of comments) {
      expect(c.postId).toBe(post.id);
      expect(c.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    }
  });

  test('POST returns what was sent', async ({ request }) => {
    const body = { title: 'QA sample', body: 'Created by a test', userId: 1 };
    const res = await request.post(`${base}/posts`, { data: body });
    expect(res.status()).toBe(201);
    expect(await res.json()).toMatchObject(body);
  });

  test('a missing post returns 404, not an empty 200', async ({ request }) => {
    const res = await request.get(`${base}/posts/999999`);
    expect(res.status()).toBe(404);
  });
});
