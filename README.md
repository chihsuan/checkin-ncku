# checkin-ncku

## Feature

* 打卡完截屏並寄到信箱
* 每天隨機打卡
* 依據上班時間，在合法時間內進行隨機下班打卡
* 依據假期日，跳過打卡日期

## Install

```bash
yarn install
```

## Usage

填入所需的帳戶資訊到 `credential.json`

```bash
cp credential-template.json credential.json
```

簽到，參數 `-m` 為是否寄 email

```bash
node index.js -a 'signin' -m 'true'
```

簽退

```bash
node index.js -a 'signout' -m 'true'
```

## Batch Mode

Script 只能單人使用，那就依據每個人複製一份 script 吧 ！

複製 `index.js` 成 `<user>.js`

複製 `credential-template.json` 成 `credential-<user>.json`

`<user>` 請代入使用者名稱

```bash
cp index.js <user>.js
cp credential-template.json credential-<user>.json
```

更改 Credential 內容

更改 import 的 credential

```js
const credential = require('./credential-<user>.json'); //in <user>.js
```

新增假期資訊

文件命名： `holiday-of-month.txt`

以 `,` 分割，紀錄當月放假的日子，並與 `.js` 放在同一目錄。

```bash
touch holiday-of-month.txt

vim holiday-of-month.txt
1,2,8,9,15,16,22,23,29,30
```

更新 `signin.sh`

```bash
cd "$(dirname "$0")"
node <user-1>.js -a 'signin' &
node <user-2>.js -a 'signin' &
node <user-3>.js -a 'signin' &
```

更新 `signout.sh`

```bash
cd "$(dirname "$0")"
node <user-1>.js -a 'signout' -m 'true' &
node <user-2>.js -a 'signout' -m 'true' &
node <user-3>.js -a 'signout' -m 'true' &
```

Update Crontab (**Absolute Path is needed**)

```crontab
0 8 * * * sh ~/checkin-ncku-master/signin.sh > ~/in-log
0 17 * * * sh ~/checkin-ncku-master/signout.sh > ~/out-log
```
