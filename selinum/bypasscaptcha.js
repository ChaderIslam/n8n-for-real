const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const axios = require('axios');

const API_KEY = 'YOUR_2CAPTCHA_API_KEY'; // Your 2Captcha API key
const PAGE_URL = 'https://example.com/recaptcha'; // URL with CAPTCHA
const SITE_KEY = '6Lc_XXXXXX_site_key'; // CAPTCHA sitekey from page source

async function solveCaptcha(apiKey, siteKey, pageUrl) {
  const requestUrl = `http://2captcha.com/in.php?key=${apiKey}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${pageUrl}&json=1`;
  const { data } = await axios.get(requestUrl);
  if (data.status !== 1) throw new Error('Failed to submit CAPTCHA to 2Captcha');

  const captchaId = data.request;

  for (let i = 0; i < 20; i++) {
    await new Promise(res => setTimeout(res, 5000)); // wait 5 seconds

    const { data: result } = await axios.get(
      `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}&json=1`
    );

    if (result.status === 1) {
      return result.request; // CAPTCHA token
    } else if (result.request !== 'CAPCHA_NOT_READY') {
      throw new Error('2Captcha error: ' + result.request);
    }
  }

  throw new Error('Captcha solve timed out');
}

async function run() {
  let options = new chrome.Options();
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(PAGE_URL);

    console.log('Solving CAPTCHA...');
    const token = await solveCaptcha(API_KEY, SITE_KEY, PAGE_URL);
    console.log('CAPTCHA solved:', token);

    // Inject token into the page
    await driver.executeScript(`
      document.getElementById("g-recaptcha-response").style.display = "block";
      document.getElementById("g-recaptcha-response").value = "${token}";
    `);

    // Submit the form or trigger the event
    await driver.findElement(By.css('form')).submit();

    console.log('Form submitted after CAPTCHA');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await driver.sleep(5000);
    await driver.quit();
  }
}

run();
