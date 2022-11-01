import { ethers, hardhatArguments, artifacts } from "hardhat";

let DoomsDay: any

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
  //Test Dwarf Contract
  DoomsDay = await ethers.getContractFactory("DoomsDay");

  DoomsDay = await DoomsDay.deploy("https://www.twistedtech.wtf/gd/");
  await DoomsDay.deployed();
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
    JSON.stringify({ DoomsDay: DoomsDay.address}, undefined, 2)
  );

  let DoomsDayArtifact = artifacts.readArtifactSync("DoomsDay");

  fs.writeFileSync(
    contractsDir + "/abi/DoomsDay.json",
    JSON.stringify(DoomsDayArtifact, null, 2)
  );
}

function genDeploymentFiles(deployer: string) {
  const fs = require("fs");
  const contractsDir = __dirname + "";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // PlutoPawn
  let data = "module.exports = ['https://www.twistedtech.wtf/gd/'];";
  fs.writeFileSync(
    contractsDir + "/args/DoomsDay.ts", 
    data
  );
}

function getVerification() {
  let data = "npx hardhat verify --network " + hardhatArguments.network + " --constructor-args ./args/DoomsDay.ts " + DoomsDay.address;
  console.log(data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });