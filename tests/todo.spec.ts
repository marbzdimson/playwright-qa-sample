import { test, expect } from '@playwright/test';
import { TodoPage } from './todo.pages';

test.describe('Todo list', () => {
  let todo: TodoPage;
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    todo = new TodoPage(page);
    await todo.open();
  });

  test.afterEach(() => {
    // A page can look fine and still throw errors in the console.
    expect(consoleErrors, 'console errors on the page').toEqual([]);
  });

  test('adds items and shows the right counter', async () => {
    await todo.add('Reproduce the bug', 'Write the ticket');
    await expect(todo.items).toHaveText(['Reproduce the bug', 'Write the ticket']);
    await expect(todo.counter).toHaveText('2 items left');
  });

  test('trims spaces and ignores an empty item', async () => {
    await todo.add('   Retest the fix   ', '   ');
    await expect(todo.items).toHaveCount(1);
    await expect(todo.items.first()).toHaveText('Retest the fix');
  });

  test('completing an item updates the counter and the filters', async () => {
    await todo.add('Reproduce the bug', 'Write the ticket');
    await todo.complete('Reproduce the bug');
    await expect(todo.counter).toHaveText('1 item left');

    await todo.filter('Active');
    await expect(todo.items).toHaveText(['Write the ticket']);

    await todo.filter('Completed');
    await expect(todo.items).toHaveText(['Reproduce the bug']);
  });

  test('items survive a page reload', async ({ page }) => {
    await todo.add('Follow up with the reporter');
    await page.reload();
    await expect(todo.items).toHaveText(['Follow up with the reporter']);
  });

  test('editing an item to empty removes it', async () => {
    await todo.add('Temporary item');
    await todo.item('Temporary item').dblclick();
    const edit = todo.items.getByRole('textbox', { name: 'Edit' });
    await edit.fill('');
    await edit.press('Enter');
    await expect(todo.items).toHaveCount(0);
  });
});
