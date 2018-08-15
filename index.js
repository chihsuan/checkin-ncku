const puppeteer = require('puppeteer');
const mail = require("nodemailer").mail;
const credential = require('./credential.json');
const program = require('commander');

const screenshotPath = './screenshot.jpg';


program
  .version('0.1.0')
  .option('-a, -- [action]', 'Add the specified action', 'None')
  .option('-m, -- [sendMail]', 'Add the specified action', false)
  .parse(process.argv);

(async () => {
  const signInUrl = 'http://eadm.ncku.edu.tw/welldoc/ncku/iftwd/signIn.php';
  const browser = await puppeteer.launch({ headless: true});
  const page = await browser.newPage();

  const action = program.action;

  const signInSelector = '.span11 button:nth-child(1)';
  const signOutSelector = '.span11 button:nth-child(2)';
  const signInSystemSelector = '.row-fluid:nth-child(5) button';
  const lookupSelector = '.row-fluid:nth-child(4) button';

  // 打卡 or 登入
  await page.goto(signInUrl);
  await page.type('#psnCode', credential.id);
  await page.type('#password', credential.password);
  
  if (action === 'signin') {
    await page.click(signInSelector);
  } else if (action == 'signout') {
    await page.click(signOutSelector);
  } else {
    await page.click(signInSystemSelector);
  }

  // 查看結果
  await page.goto(signInUrl);
  await page.type('#psnCode', credential.id);
  await page.type('#password', credential.password);
  await page.keyboard.press('CapsLock');
  await page.click(lookupSelector);
  await page.screenshot({path: screenshotPath});

  if (program.sendMail) {
    mail({
      from: 'NCKU bot <bot@ncku.netdb>', // sender address
      to: 'Chi-Hsuan Huang <chihsuan.tw@gmail.com>', // list of receivers
      subject: '每日打卡結果', // Subject line
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
