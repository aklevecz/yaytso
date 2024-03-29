# **This version of the app is likely deprecated in favor of the new fangled [yaytso-v2](https://github.com/aklevecz/yaytso-v2)**

# it is egg time

yaytso (яйцо)

live at https://yaytso.art

**MAINNEGG LIVE** - 0x155b65c62e2bf8214d1e3f60854df761b9aa92b3
[Etherscan](https://etherscan.io/address/0x155b65c62e2bf8214d1e3f60854df761b9aa92b3)

## yaytso Update - May 18th 2021

### Updates

No new release this week. We do have some new creations by inspired egg friends!
[luckyme](https://yaytso.art/egg/4)
[bilinda](https://yaytso.art/egg/5)

### Upcoming

More work and testing of the `Carton` contract was done. I created some barebones UI to test the entire loop of:

- creating a `yaytso`
- approving its transfer by the `Carton` contract
- creating a `carton` to hold a `yaytso`
- filling a `carton` with a `yaytso`, and in turn locking it
- signing a message with the `carton` id and nonce
- claiming the `yaytso` from the `carton` using the signed message from a different wallet

## yaytso Update - May 3rd 2021

### Mainnet

You can now mint yaytsos on Mainnet! [0x155b65c62e2bf8214d1e3f60854df761b9aa92b3](https://etherscan.io/address/0x155b65c62e2bf8214d1e3f60854df761b9aa92b3) -- I must say it does feel quite good to make an egg!

### Updates

Not many real updates to the release codebase beyond very necessary refactoring of various state flows. There is now much more structure for adding more wallets and controlling those interactions. I can now look at most of the code without throwing up in my mouth.

### Upcoming

I spent a good amount of time working out and testing concepts for `Carton`, the egg holding contract. `Carton` will be the preliminary vessel for allowing people to discover and claim `yaytsos`. The logic for this is a little funny, and requires a small degree of trust, but it will at least suffice for my own hiding purposes while I play with my own eggeractions and spread eggs about for the adventurous.

#### The basic interaction will be as follows:

- Create a burner wallet
- Don't look at the wallet's private key!!!! I'm watching you...
- Lay a `yaytso` into the burner wallet
- Create a `Carton`, giving it a `lat` and `lon` of the egg discovery location
  -- It will instantiate with an `id`, a `nonce`, and `!locked`
- Put the `yaytso` in the `Carton`! Referencing the `cartonId`, `address` of the yaytso owner, and the `tokenId`
  -- The `Carton` is now `locked`
- Approve the `Carton` contract to move the `yaytso` of the burner wallet
- Sign a message with the burner wallet providing the `cartonId` and its current `nonce`
- Burn the wallet
- Create a way for someone to discover the `signedMessage` (e.g. a QR code glued somewhere fun)
- Wait for someone to find the `signedMessage`
- Someone finds the `signedMessage`!
- This someone sends a claim to the `Carton` contract using the given `cartonId`, `nonce`, and `signedMessage`
- The contract recreates the message hash, and uses `ecrecover` to compare the given `address` to the `address` of the signer
- If they match, then the `yaytso` is transferred to the discoverer of the `signedMessage` who pays the `Transfer` cost

### Caveats

- Biggest caveat is that there is no guarantee that the `yaytso` remains where it is supposed to be before it is found
  -- If the creator looked at the burner wallet's private key then they can transfer the `yaytso` at will
  -- The `signedMessage` could be used to claim the `yaytso` before someone finds it
- Thus it is SUPER important that the `signedMessage` remain as secret as possible
  -- This is necessary because we are not prophets and we cannot foresee what address will find the `yaytso`, thus we are unable to define a recipient that would allow us to avoid being so secretive.

## yaytso Update - April 26th 2021

### New Features

- You can now draw on your egg in the browser!
- Wallet connect integration
- Naming and describing your egg
- Dedicated single egg viewer

### UI Changes

- More animations during the laying process

### Next

- Better modal experience
- Notify recipient
- Start building geocaching/hunting framework

## yaytso Update - April 19th 2021

### New Features

- Send a gift to a friend's address!

### UI Changes

- Background is now light grey and egg is a more pure white
- More in vogue pill buttons
- Reduced the amount of patterns on the egg and matched them naively with the SVG image
- Created a simple loading component for various egg-loading states
- Made the collection a 2 column grid
- Nav background is a gradient, button colors are simplified without stroke
- Better UX flow when creating and before minting the egg
- Receipt with transaction info upon a successful transaction

### Next

- More wallet connections
- Better wallet UX
- Individual egg view

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
