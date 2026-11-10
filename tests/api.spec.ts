import { test, expect } from '@playwright/test';

const API = 'https://jsonplaceholder.typicode.com';

// no browser needed here, so skip the mobile run
test.skip(({ isMobile }) => isMobile, 'api tests only run once');

test('get post 1', async ({ request }) => {
  const res = await request.get(`${API}/posts/1`);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/json');

  const post = await res.json();
  expect(post.id).toBe(1);
  expect(typeof post.userId).toBe('number');
  expect(typeof post.title).toBe('string');
});

test('filter posts by userId', async ({ request }) => {
  const res = await request.get(`${API}/posts?userId=3`);
  expect(res.ok()).toBeTruthy();

  const posts = await res.json();
  expect(posts.length).toBeGreaterThan(0);
  for (const p of posts) {
    expect(p.userId).toBe(3);
  }
});

test('comments belong to the right post', async ({ request }) => {
  const post = await (await request.get(`${API}/posts/5`)).json();
  const comments = await (await request.get(`${API}/posts/5/comments`)).json();

  expect(comments.length).toBeGreaterThan(0);
  for (const c of comments) {
    expect(c.postId).toBe(post.id);
    expect(c.email).toContain('@');
  }
});

test('create a post', async ({ request }) => {
  const newPost = { title: 'test post', body: 'hello', userId: 1 };
  const res = await request.post(`${API}/posts`, { data: newPost });
  expect(res.status()).toBe(201);

  const created = await res.json();
  expect(created).toMatchObject(newPost);
  expect(created.id).toBeDefined();
});

test('unknown id gives 404', async ({ request }) => {
  const res = await request.get(`${API}/posts/999999`);
  expect(res.status()).toBe(404);
});
