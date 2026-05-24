import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

Given("I am on the landing page", async ({ page }) => {
  await page.goto("/");
});

Then("I should see a {string} button", async ({ page }, text: string) => {
  await expect(page.getByRole("button", { name: text })).toBeVisible();
});

Then("I should see a meeting PIN input", async ({ page }) => {
  await expect(page.getByPlaceholder(/pin|meeting/i)).toBeVisible();
});

Then("I should see a name input", async ({ page }) => {
  await expect(page.getByLabel(/name/i)).toBeVisible();
});

When("I clear the name input", async ({ page }) => {
  const nameInput = page.getByLabel(/name/i);
  await nameInput.clear();
});

When("I click {string}", async ({ page }, text: string) => {
  await page.getByRole("button", { name: text }).click();
});

Then("I should see a validation error", async ({ page }) => {
  await expect(page.getByRole("alert")).toBeVisible();
});
