const puppeteer = require('puppeteer');
const mail = require("nodemailer").mail;
const credential = require('./credential.json');
const program = require('commander');

const screenshotPath = './screenshot.jpg';


program
  .version('0.1.0')
  .option('-a, --action [action]', 'Add the specified action', 'login-system')
  .option('-m, --sendMail [sendMail]', 'Send screenshot or not', false)
  .option('-h, --headless [headless]', 'Use headless mode', true)
  .parse(process.argv);

const delay = (ms) => (new Promise(r => setTimeout(r, ms)));

(async () => {
  const signInUrl = 'http://eadm.ncku.edu.tw/welldoc/ncku/iftwd/signIn.php';
  const browser = await puppeteer.launch({ headless: Boolean(program.headless)});
  const page = await browser.newPage();

  page.setViewport({
    width: 1024,
    height: 728
  });
  const signInSelector = '.span11 button:nth-child(1)';
  const signOutSelector = '.span11 button:nth-child(2)';
  const signInSystemSelector = '.row-fluid:nth-child(5) button';
  const lookupSelector = '.row-fluid:nth-child(4) button';

  const action = program.action;

  // 打卡 or 登入
  await page.goto(signInUrl);
  await page.type('#psnCode', credential.id);
  await page.type('#password', credential.password);
  await page.keyboard.press('CapsLock');
  
  if (action === 'signin') {
    await page.click(signInSelector);
  } else if (action == 'signout') {
    await page.click(signOutSelector);
  } else {
    await page.click(signInSystemSelector);
  }

  // 查看結果
  await page.goto(signInUrl);
  await page.keyboard.press('CapsLock');
  await page.type('#psnCode', credential.id);
  await page.type('#password', credential.password);
  await page.click(lookupSelector);
  await delay(1000);
  await page.screenshot({path: screenshotPath});

  if (program.sendMail) {
    mail({
      from: 'NCKU Bot <bot@ncku.netdb>', // sender address
      to: credential.email, // list of receivers
      subject: '線上簽到退作業結果', // Subject line
      text: '', // plaintext body
      attachments: [
        {   
          filePath : screenshotPath,
        },
      ]
    });
  }

  await browser.close();
})();

