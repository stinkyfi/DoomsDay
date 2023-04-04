import { expect } from "chai";
import { ethers } from "hardhat";

describe("The Colony Test", function () {
  let TheColony: any
  let owner: any
  let addr1: any
  let addr2: any
  let addrs: any
  let provider: any

  beforeEach(async function () {

    TheColony = await ethers.getContractFactory("TheColony");
    provider = ethers.provider;

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    //Deploy TheColony.sol
    TheColony = await TheColony.deploy('https://twistedtech.wtf/colony/json/', addr2.address);
    await TheColony.deployed();
  });

  describe("Verify Deployment", function () {
    it("Verify Token", async function () {
      expect(await TheColony.name()).to.equal("The Colony");
      expect(await TheColony.symbol()).to.equal("COLON");
      expect(await TheColony.totalSupply()).to.equal(0);
      expect(await TheColony.tokenURI(0)).to.equal('https://twistedtech.wtf/colony/json/0.json')
    });
  });

  describe("Public Mint", function () {    
    it("Mint", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);

      let override = {value: ethers.utils.parseEther("0.03")};
      await TheColony.mint(3, override);
    });
    it("Update Price", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);
    
      await TheColony.updatePrice(ethers.utils.parseEther("0.001"));

      let override = {value: ethers.utils.parseEther("0.03")};
      await expect(TheColony.mint(3, override)).to.be.revertedWithCustomError(TheColony, "InsufficientFunds");

      override = {value: ethers.utils.parseEther("0.015")};
      TheColony.mint(3, override);
    });

    it("Mint Closed", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);
    
      await TheColony.updateMintStatus();

      let override = {value: ethers.utils.parseEther("0.1")};
      await expect(TheColony.connect(addr1).mint(10, override)).to.be.revertedWithCustomError(TheColony, "MintClosed");
    });
  });

  describe("Withdraw", function () {
    it("Audit Withdraw", async function () {
      expect(await provider.getBalance(owner.address)).to.be.equal(ethers.utils.parseEther("9999.95041789846984583"));
      expect(await provider.getBalance(addr1.address)).to.be.equal(ethers.utils.parseEther("9999.999969236492327139"));
      expect(await provider.getBalance(addr2.address)).to.be.equal(ethers.utils.parseEther("10000"));
      expect(await provider.getBalance(TheColony.address)).to.be.equal(ethers.utils.parseEther("0"));

      let override = {value: ethers.utils.parseEther("0.1")};
      await TheColony.mint(10, override);

      expect(await provider.getBalance(owner.address)).to.be.equal(ethers.utils.parseEther("9999.850300232529253014"));
      expect(await provider.getBalance(addr1.address)).to.be.equal(ethers.utils.parseEther("9999.999969236492327139"));
      expect(await provider.getBalance(addr2.address)).to.be.equal(ethers.utils.parseEther("10000"));
      expect(await provider.getBalance(TheColony.address)).to.be.equal(ethers.utils.parseEther("0.1"));

      await TheColony.withdraw();
      expect(await provider.getBalance(owner.address)).to.be.equal(ethers.utils.parseEther("9999.850258221140234414"));
      expect(await provider.getBalance(addr1.address)).to.be.equal(ethers.utils.parseEther("9999.999969236492327139"));
      expect(await provider.getBalance(addr2.address)).to.be.equal(ethers.utils.parseEther("10000.1"));
      expect(await provider.getBalance(TheColony.address)).to.be.equal(ethers.utils.parseEther("0"));
    });
  });

  describe("Airdrop", function () {
    it("Test Airdrop", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr2.address)).to.be.equal(0);

      await TheColony.airdrop([addr1.address, addr2.address, addr1.address], [2, 2, 1]);

      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(3);
      expect(await TheColony.balanceOf(addr2.address)).to.be.equal(2);
    });
  });
});
