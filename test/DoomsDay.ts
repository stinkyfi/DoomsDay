import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Initialization", function () {
  let DoomsDay: any
  let owner: any
  let addr1: any
  let addr2: any
  let addrs: any

  beforeEach(async function () {

    DoomsDay = await ethers.getContractFactory("DoomsDay");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    //Deploy DoomsDay.sol
    DoomsDay = await DoomsDay.deploy("https://www.twistedtech.wtf/gd/");
    await DoomsDay.deployed();
  });

  describe("Verify Deployment", function () {
    it("Verify Token", async function () {
      expect(await DoomsDay.name()).to.equal("Doomsday: Adventure Into The Gloomyverse");
      expect(await DoomsDay.symbol()).to.equal("GMVS");
    });
  });

  describe("Whitelist", function () {
    it("Whitelist Users", async function () {
      await DoomsDay.addWhitelist(1, [owner.address, addr1.address]);
      expect(await DoomsDay.isWhitelisted(1, owner.address)).to.be.true;
      expect(await DoomsDay.isWhitelisted(1, addr1.address)).to.be.true;
      expect(await DoomsDay.isWhitelisted(1, addr2.address)).to.be.false;      
    });
  });

  describe("Minting", function () {
    it("Mint from Whitelist", async function () {
      await DoomsDay.addWhitelist(1, [owner.address, addr1.address]);
      await DoomsDay.mint(1,'0x00');
      await DoomsDay.connect(addr1).mint(1, '0x00');
      await expect(DoomsDay.connect(addr2).mint(1, '0x00')).to.be.revertedWithCustomError(DoomsDay, "NotAuthorized");
      await expect(DoomsDay.connect(addr1).mint(1, '0x00')).to.be.revertedWithCustomError(DoomsDay, "NotAuthorized");
      await expect(DoomsDay.connect(addr1).mint(2, '0x00')).to.be.revertedWithCustomError(DoomsDay, "NotAuthorized");
    });
  });
});
