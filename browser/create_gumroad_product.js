/**
 * Gumroad Product Creator via Browser Automation
 */

const { chromium } = require('playwright');
const fs = require('fs');

const CREDENTIALS = JSON.parse(fs.readFileSync('/Users/mint/.openclaw/workspace/credentials.json', 'utf8'));
const EMAIL = CREDENTIALS.gumroad.email;
const PASSWORD = CREDENTIALS.gumroad.password;

const PRODUCT = {
  name: "The Cold Email Vault",
  price: "27",
  pdfPath: "/Users/mint/.openclaw/workspace/products/promptvault/the-cold-email-vault.pdf",
};

async function createProduct() {
  console.log('🚀 Starting Gumroad product creation...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    // Login
    console.log('🔐 Navigating to login...');
    await page.goto('https://gumroad.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Fill email
    await page.locator('input[type="email"]').fill(EMAIL);
    await page.waitForTimeout(500);
    
    // Fill password
    await page.locator('input[type="password"]').fill(PASSWORD);
    await page.waitForTimeout(500);

    // Click login button
    console.log('🖱️  Clicking login...');
    await page.locator('button[type="submit"]').click();
    
    // Wait for navigation
    await page.waitForTimeout(5000);
    const afterLoginUrl = page.url();
    console.log('📍 After login:', afterLoginUrl);

    if (afterLoginUrl.includes('/login')) {
      // Try pressing Enter instead
      await page.locator('input[type="password"]').press('Enter');
      await page.waitForTimeout(5000);
      console.log('📍 After Enter:', page.url());
    }

    if (page.url().includes('/login')) {
      throw new Error('Still on login page after attempts');
    }

    console.log('✅ Logged in!');

    // Go to new product page
    console.log('📦 Navigating to new product...');
    await page.goto('https://app.gumroad.com/products/new', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    console.log('📍 Product page:', page.url());
    await page.screenshot({ path: '/Users/mint/.openclaw/workspace/data/gumroad_new.png' });

    const bodyText = await page.locator('body').innerText().catch(() => '');
    console.log('📄 Page content preview:', bodyText.substring(0, 500));

    // Look for product type buttons
    const buttons = await page.locator('button, a, [role="button"]').allInnerTexts();
    console.log('🔘 Buttons found:', buttons.slice(0, 20));

    // Try to click "Digital product" or similar
    for (const text of ['Digital product', 'digital', 'File', 'file']) {
      const el = page.locator(`text="${text}"`).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click();
        console.log(`✅ Clicked: ${text}`);
        await page.waitForTimeout(2000);
        break;
      }
    }

    await page.screenshot({ path: '/Users/mint/.openclaw/workspace/data/gumroad_type_selected.png' });

    // Fill name
    for (const sel of ['input[name="name"]', 'input[placeholder*="name" i]', 'input[placeholder*="product" i]', '#name']) {
      const el = page.locator(sel).first();
      if (await el.isVisible().catch(() => false)) {
        await el.fill(PRODUCT.name);
        console.log('✅ Filled name');
        break;
      }
    }

    // Fill price
    for (const sel of ['input[name="price"]', 'input[placeholder*="price" i]', '#price', 'input[type="number"]']) {
      const el = page.locator(sel).first();
      if (await el.isVisible().catch(() => false)) {
        await el.fill(PRODUCT.price);
        console.log('✅ Filled price');
        break;
      }
    }

    await page.screenshot({ path: '/Users/mint/.openclaw/workspace/data/gumroad_filled.png' });
    console.log('📸 Screenshots saved to workspace/data/');

    // Get all input fields for debugging
    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const name = await input.getAttribute('name').catch(() => '');
      const placeholder = await input.getAttribute('placeholder').catch(() => '');
      const type = await input.getAttribute('type').catch(() => '');
      console.log(`  input: name="${name}" placeholder="${placeholder}" type="${type}"`);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    await page.screenshot({ path: '/Users/mint/.openclaw/workspace/data/gumroad_err.png' });
  } finally {
    await browser.close();
  }
}

createProduct().catch(console.error);
