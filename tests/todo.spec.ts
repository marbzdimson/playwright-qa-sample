import { test, expect } from '@playwright/test';
import { TodoPage } from './todoPage';

let todoPage: TodoPage;
let errors: string[];

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  todoPage = new TodoPage(page);
  await todoPage.goto();
});

// fail the test if anything was logged to the console as an error
test.afterEach(() => {
  expect(errors).toEqual([]);
});

test('add 2 todos, counter says 2 items left', async () => {
  await todoPage.addTodos('buy milk', 'pay electric bill');
  await expect(todoPage.todos).toHaveText(['buy milk', 'pay electric bill']);
  await expect(todoPage.count).toHaveText('2 items left');
});

test('spaces are trimmed and a blank todo is not added', async () => {
  await todoPage.addTodos('   walk the dog   ', '   ');
  await expect(todoPage.todos).toHaveCount(1);
  await expect(todoPage.todos.first()).toHaveText('walk the dog');
});

test('mark one done, check active and completed filters', async () => {
  await todoPage.addTodos('buy milk', 'pay electric bill');
  await todoPage.markDone('buy milk');
  await expect(todoPage.count).toHaveText('1 item left');

  await todoPage.showOnly('Active');
  await expect(todoPage.todos).toHaveText(['pay electric bill']);

  await todoPage.showOnly('Completed');
  await expect(todoPage.todos).toHaveText(['buy milk']);
});

test('todos are still there after reload', async ({ page }) => {
  await todoPage.addTodos('call the dentist');
  await page.reload();
  await expect(todoPage.todos).toHaveText(['call the dentist']);
});

test('clearing the text while editing deletes the todo', async () => {
  await todoPage.addTodos('delete me');
  await todoPage.todo('delete me').dblclick();
  const editBox = todoPage.todos.getByRole('textbox', { name: 'Edit' });
  await editBox.fill('');
  await editBox.press('Enter');
  await expect(todoPage.todos).toHaveCount(0);
});
