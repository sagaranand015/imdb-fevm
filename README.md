### Web3-Imdb 
Movies rater on Web3, deployed on Wallaby Testnet with every movie being treated as an ERC721 token and token metadata stored on IPFS (via nft.storage)

### Project Structure
1. _backend: contains the backend smart contract code compiling and deploying the Movies Contracts
2. demo-app: Demo app for integrating with the deployed smart contract. Functions within this demo-app show how to interact with the platforms, perform user ratings and see average ratings for any creation
3. admin-app: Admin app for creating a new movie/creation with data being stored on IPFS

### Live Demo
Demo App: https://creative-bubblegum-21e318.netlify.app/
Admin App: https://w3mdb-admin.netlify.app

### Demo link & Txns
1. [Demo Video is available here](https://youtu.be/n64VPoRAPKI)
2. TxnId for creating the Dark Knight Movie: 0x677c7fc7dca1d7dcaf416946670d49b11ec302d2ae79706be4f2ae0b829ad9ab. [Explorer Link is here](https://explorer.glif.io/tx/0x677c7fc7dca1d7dcaf416946670d49b11ec302d2ae79706be4f2ae0b829ad9ab/?network=wallabynet)
3. TxnId for creating rating the Batman Begins Movie: 0x48061ae87ca42c561e6a318fbb556436ec97245173cbca2f48245a6a787d9eca. [Explorer Link is here](https://explorer.glif.io/tx/0x48061ae87ca42c561e6a318fbb556436ec97245173cbca2f48245a6a787d9eca/?network=wallabynet)

### Running the user-app
1. Change directory to demo-app
```
cd demo-app
```
2. Install dependencies
```
npm install
```
3. Start demo-app
```
npm start
```

### Running the admin-app
1. Change directory to admin-app
```
cd admin-app
```
2. Install dependencies
```
npm install
```
3. Start admin-app
```
npm start
```

### Notes:
1. Please make sure you're using a funded account to perform operations on user-app and admin-app
2. Wallaby testbed faucet: http://wallaby.network