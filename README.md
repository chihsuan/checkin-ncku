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
