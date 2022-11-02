# DoomsDay NFT
[![Hardhat Test](https://github.com/stinkyfi/DoomsDay/actions/workflows/hardhat_test.yml/badge.svg)](https://github.com/stinkyfi/DoomsDay/actions/workflows/hardhat_test.yml)
[![Solhint Linter](https://github.com/stinkyfi/DoomsDay/actions/workflows/solhint_lint.yml/badge.svg)](https://github.com/stinkyfi/DoomsDay/actions/workflows/solhint_lint.yml)

## Install Requirements
The first steps are to clone the repository and install its dependencies:
```sh
git clone https://github.com/stinkyfi/DoomsDay.git
cd DoomsDay
npm install
```

Make a copy of the sample hardhat config file, git ignores the hardhatconfig file.
This file is sensitive, because it may contain private keys
```sh
cp sample.hardhat.config.ts hardhat.config.ts
```

## Test
On a new terminal, go to the repository's root folder and run this to
test the contract:

```sh
npx hardhat test
```

## Deploy Test
On a new terminal, go to the repository's root folder and run this to
deploy the contract test:

```sh
npx hardhat run scripts/deploy.ts --network <network>
```
