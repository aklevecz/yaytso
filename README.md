# it is egg time

yaytso (яйцо)

live at https://yaytso.art

**the coop is currently only live on Rinkeby** - 0xb61e3f6c35d7ff5d38a64694c8be6eedd3d2a3a9
[Etherscan](https://rinkeby.etherscan.io/address/0xb61e3f6c35d7ff5d38a64694c8be6eedd3d2a3a9) (3/21/2021 5pm UTC)

# build your own local coop (using the existing contract)

## run the ipfs pinning service using [nft.storage](https://nft.storage)
1. move into that dir
- `cd ipfs-service`
2. install those deps
- `npm i`
3. create a file within this dir called `.secret` and plop in your api key from nft.storage(https://nft.storage/manage)
4. run this node service chick
- `npm run start`

## run the client app
1. move into that dir meow (assuming you are in ipfs-service still)
- `cd ../app`
2. install the deps
- `yarn`
3. run that app!
- `yarn start`

a browser should open automagically, otherwise navigate to `http://localhost:3000`
