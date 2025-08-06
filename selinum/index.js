const { Builder, By, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function run() {
  let options = new chrome.Options();
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // 🌐 Step 1: Open your target page
    await driver.get('https://algeria.blsspainglobal.com/DZA/account/login'); // ⬅️ Replace with actual URL

    // ⏳ Step 2: Wait for the page to load
    await driver.sleep(3000);

    // 👆 Step 3: Click the link by visible text
    await driver.findElement(By.linkText('Visitez notre centre')).click();

    // ✅ Step 4: Wait after click (for navigation)
    await driver.sleep(3000);

    console.log('✔️ Clicked on "Visitez notre centre" successfully');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    // ❎ Step 5: Close browser
    await driver.quit();
  }
}

run();
