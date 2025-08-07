const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function fillInputByXPathWithProxy() {
    // === 1. Proxy Setup ===
    const proxy = '152.53.107.230:80'; // format: "ip:port" or "username:password@ip:port"

    const options = new chrome.Options();

    // If proxy has username and password, use Chrome extension workaround (requires extra setup)
    if (proxy.includes('@')) {
        console.error("Authenticated proxies (user:pass@ip:port) need an extension-based workaround.");
        process.exit(1);
    }

    options.addArguments(`--proxy-server=http://${proxy}`);
    // options.addArguments('--headless'); // Uncomment to run headless

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // 2. Open the target login page
        await driver.get('https://algeria.blsspainglobal.com/DZA/account/login');

        // 3. Wait until the input field is present
        const inputField = await driver.wait(
            until.elementLocated(By.xpath("/html/body/main/main/div/div/div[2]/div[2]/form/div[3]/input")),
            15000
        );

        // 4. Scroll input field into view
        await driver.executeScript("arguments[0].scrollIntoView(true);", inputField);
        await driver.sleep(1000); // Optional wait for animations

        // 5. Forcefully remove restrictions and set value
        await driver.executeScript(`
            arguments[0].removeAttribute('readonly');
            arguments[0].removeAttribute('disabled');
            arguments[0].classList.remove('entry-disabled');
            arguments[0].value = 'chaiding@gmail.com';
            arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
            arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
        `, inputField);

        console.log('✅ Input field value set successfully.');

        // 6. Wait and click the "Verify" button (or equivalent)
        const verifyButton = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(text(), 'Verify') or contains(text(), 'Continue') or contains(text(), 'Next')]")),
            10000
        );
        await verifyButton.click();
        console.log('✅ Clicked the verify/continue button.');

        // 7. Wait for any response (adjust selector as needed)
        await driver.wait(
            until.elementLocated(By.css("#result-message, .success, .error")),
            10000
        );
        console.log('✅ Result message appeared.');

    } catch (err) {
        console.error('❌ ERROR:', err);
    } finally {
        await driver.sleep(3000); // optional pause to see results
        await driver.quit();
    }
})();
