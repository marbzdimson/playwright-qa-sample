import { expect, type Locator, type Page } from '@playwright/test';

export class TodoPage {
  readonly input: Locator;
  readonly todos: Locator;
  readonly count: Locator;

  constructor(readonly page: Page) {
    this.input = page.getByPlaceholder('What needs to be done?');
    this.todos = page.getByTestId('todo-item');
    this.count = page.getByTestId('todo-count');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/#/');
    await expect(this.input).toBeVisible();
  }

  async addTodos(...names: string[]) {
    for (const name of names) {
      await this.input.fill(name);
      await this.input.press('Enter');
    }
  }

  todo(name: string) {
    return this.todos.filter({ hasText: name });
  }

  async markDone(name: string) {
    await this.todo(name).getByRole('checkbox').check();
  }

  async showOnly(filter: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name: filter, exact: true }).click();
  }
}
