const puppeteer = require('puppeteer');
const mail = require("nodemailer").mail;
const credential = require('./credential.json');
const program = require('commander');

const screenshotPath = './screenshot.jpg';


program
  .version('0.1.0')
  .option('-a, --action [action]', 'Add the specified action', 'login-system')
  .option('-m, --sendMail [sendMail]', 'Send screenshot or not', false)
  .parse(process.argv);

const delay = (ms) => (new Promise(r => setTimeout(r, ms)));
const login = async (page, url, id, pw) => {
  await page.goto(url);
  await delay(3000);
  await page.type('#psnCode', id);
  await page.type('#password', pw);
  await page.keyboard.press('CapsLock');
  await delay(3000);
}

(async () => {
  // Random delay in 30 mins, 不然人家覺得你固定時間打卡會被罵喔
  var waitMilliSec = Math.floor(Math.random() * 1000 * 60 * 30);
  console.log(`${process.argv[1]\nWaiting Time: ${waitMilliSec/(60 * 1000)} mins`);
  await delay(waitMilliSec);
  const signInUrl = 'http://eadm.ncku.edu.tw/welldoc/ncku/iftwd/signIn.php';
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();

  page.setViewport({
    width: 1024,
    height: 728
  });
  const signInSelector = '.row-fluid:nth-child(3) button:nth-child(1)';
  const signOutSelector = '.row-fluid:nth-child(3) button:nth-child(2)';
  const signInSystemSelector = '.row-fluid:nth-child(6) button';
  const lookupSelector = '.row-fluid:nth-child(5) button';
  // 學校日曆
  const calendarUrl = 'https://eadm.ncku.edu.tw/welldoc/iftwf/WF8F11A.php?f_menuname=%AD%D3%A4H%AEt%B0%B2%A4%EB%BE%E4%AA%ED'
  // 登入行政 e 化系統
  const eSystemSelector = '.row-fluid:nth-child(6) button';
  const action = program.action;

  // 打卡 or 登入
  await login(page, signInUrl, credential.id, credential.password);
  // 取得放假日
  await page.click(eSystemSelector);
  // 一定要等久一點，不然會非法登入
  await delay(3000);
  await page.goto(calendarUrl);
  // 抓取 紅色日子
  await delay(3000);
  const text = await page.evaluate(() => Array.from(document.querySelectorAll('table:nth-child(2) :nth-child(1) td[bgcolor="#FFCCCC"]'), element => element.textContent));
  const holidays = text.map(Number);
  console.log(`假期:\n${holidays}`);
  // 與今天比較，如果今天是假期，就不打卡
  var today = new Date();
  console.log(today);
  if (holidays.includes(today.getDate())) {
    console.log(`今天(${today})放假嚕～ 不用打卡`)
    await browser.close();
    process.exit();
  }

  // 再次登入簽到/簽退
  await login(page, signInUrl, credential.id, credential.password);
  if (action === 'signin') {
    await page.click(signInSelector);
  } else if (action == 'signout') {
    await page.click(signOutSelector);
  } else {
    await page.click(signInSystemSelector);
  }

  // 查看結果
  await login(page, signInUrl, credential.id, credential.password);
  await page.click(lookupSelector);
  await delay(3000);
  await page.screenshot({
    path: screenshotPath
  });

  if (program.sendMail) {
    mail({
      from: 'NCKU Bot <bot@ncku.netdb>', // sender address
      to: credential.email, // list of receivers
      subject: '線上簽到退作業結果', // Subject line
      text: '', // plaintext body
      attachments: [{
        filePath: screenshotPath,
      }, ]
    });
  }
  await browser.close();
})();
