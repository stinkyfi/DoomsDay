import { ethers, hardhatArguments, artifacts } from "hardhat";
const paydata = require("./args/Payment")

let Colony: any
let PaymentSplitter: any

async function main() {
  if (hardhatArguments.network === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());
  //PaymentSplitter Contract
  PaymentSplitter = await ethers.getContractFactory("PaymentSplitter");
  PaymentSplitter = await PaymentSplitter.deploy(paydata[0], paydata[1]);
  await PaymentSplitter.deployed();
  console.log("PaymentSplitter Deployed");

  //Colony Contract
  Colony = await ethers.getContractFactory("TheColony");
  Colony = await Colony.deploy('https://twistedtech.wtf/colony/json/', PaymentSplitter.address);
  await Colony.deployed();
  console.log("DoomsDay Deployed");

  saveFrontendFiles();
  let deployer_address = await deployer.getAddress()
  genDeploymentFiles(deployer_address);
  getVerification();
}

function saveFrontendFiles() {
  const fs = require("fs");
  const contractsDir = __dirname + "";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/abi/contract-addresses.json",
    JSON.stringify({ Colony: Colony.address}, undefined, 2)
  );

  fs.writeFileSync(
    contractsDir + "/abi/payment-addresses.json",
    JSON.stringify({ PaymentSplitter: PaymentSplitter.address}, undefined, 2)
  );

  let ColonyArtifact = artifacts.readArtifactSync("TheColony");

  fs.writeFileSync(
    contractsDir + "/abi/Colony.json",
    JSON.stringify(ColonyArtifact, null, 2)
  );

  let PaymentArtifact = artifacts.readArtifactSync("PaymentSplitter");

  fs.writeFileSync(
    contractsDir + "/abi/PaymentSplitter.json",
    JSON.stringify(PaymentArtifact, null, 2)
  );
}

function genDeploymentFiles(deployer: string) {
  const fs = require("fs");
  const contractsDir = __dirname + "";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Colony
  let data = "module.exports = [];";
  fs.writeFileSync(
    contractsDir + "/args/Colony.ts", 
    data
  );
}

function getVerification() {
  console.log("npx hardhat verify --network " + hardhatArguments.network + " --constructor-args ./scripts/args/Colony.ts " + Colony.address);
  console.log("npx hardhat verify --network " + hardhatArguments.network + " --constructor-args ./scripts/args/Payment.ts " + Colony.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });