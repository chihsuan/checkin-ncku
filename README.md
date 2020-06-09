# checkin-ncku

### Install

```
yarn install
```

### Usage

填入所需的帳戶資訊到 `credential.json`
```
cp credential-template.json credential.json
```

簽到，參數 `-m` 為是否寄 email 

```
node index.js -a 'signin' -m 'true'
```


簽退

```
node index.js -a 'signout' -m 'true'
```

### Batch Mode

Script 只能單人使用，那就依據每個人複製一份 script 吧 ！

複製 `index.js` `crendential-<user>.json`
```
cp index.js <user>.js
cp credential-template.json crendential-<user>.json
``` 

更改 Credential 內容

更改 import 的 credential
```
const credential = require('./credential-<user>.json'); //in <user>.js
```

更新 `signin.sh`
```
cd "$(dirname "$0")"
node <user-1>.js -a 'signin' &
node <user-2>.js -a 'signin' &
node <user-3>.js -a 'signin' &
```

更新 `signout.sh`
```
cd "$(dirname "$0")"
node <user-1>.js -a 'signout' -m 'true' &
node <user-2>.js -a 'signout' -m 'true' &
node <user-3>.js -a 'signout' -m 'true' &
```

Update Crontab (**Absolute Path is needed**)
```
0 8 * * 1-5 sh ~/checkin-ncku-master/signin.sh > ~/in-log
30 17 * * 1-5 sh ~/checkin-ncku-master/signout.sh > ~/out-log
```
