import {Page} from '@playwright/test';
import {test as fixtureTest, expect} from '@playwright/test';

export {expect};
export const test = fixtureTest;

export async function navigateToURL(page: Page, url: string) {
  await page.goto(url);
}