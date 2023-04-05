# DoomsDay NFT
[![Colony Test](https://github.com/stinkyfi/DoomsDay/actions/workflows/colony.yml/badge.svg)](https://github.com/stinkyfi/DoomsDay/actions/workflows/colony.yml)
[![Doomsday Test](https://github.com/stinkyfi/DoomsDay/actions/workflows/Doomsday.yml/badge.svg)](https://github.com/stinkyfi/DoomsDay/actions/workflows/Doomsday.yml)
[![Solhint Linter](https://github.com/stinkyfi/DoomsDay/actions/workflows/solhint_lint.yml/badge.svg)](https://github.com/stinkyfi/DoomsDay/actions/workflows/solhint_lint.yml)

Deployed on Arbitrum:
```0xD81345187c8e2A24419996D0FEA18AC60464CeB2```

## Install Requirements
The first steps are to clone the repository and install its dependencies:
```sh
git clone https://github.com/stinkyfi/DoomsDay.git
cd DoomsDay
npm i --force
```

Make a copy of the sample hardhat config file, git ignores the hardhatconfig file.
This file is sensitive, because it may contain private keys
```sh
cp sample.hardhat.config.ts hardhat.config.ts
```

## Test
Go to the repository's root folder and run this to
test the contract:

```sh
npx hardhat test
```

## Deploy
### Doomsday
Go to the repository's root folder and run this to
deploy the contract test:

```sh
npx hardhat run scripts/Doomsday/deploy.ts --network <network>
```
### The Colony
Go to the repository's root folder and run this to
deploy the contract test:

```sh
npx hardhat run scripts/Colony/deploy.ts --network <network>
```

## Solidity-Coverage Report
<p align="center">
  <img src="https://github.com/stinkyfi/DoomsDay/blob/main/images/coverage_report.PNG">
</p>

Run the following command:
```sh
npx hardhat coverage
```

## Solhint
Run the following command:
```sh
solhint 'contracts/**/*.sol'
```
