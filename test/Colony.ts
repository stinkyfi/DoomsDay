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

  describe("Whitelist", function () {
    it("Whitelist Users", async function () {
      await TheColony.addWhitelist([owner.address, addr1.address]);
      expect(await TheColony.isWhitelisted(owner.address)).to.be.true;
      expect(await TheColony.isWhitelisted(addr1.address)).to.be.true;
      expect(await TheColony.isWhitelisted(addr2.address)).to.be.false;      

      await expect(TheColony.connect(addr1).addWhitelist([owner.address, addr1.address])).to.be.reverted;
    });
    it("Mint from Whitelist", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);
      expect(await TheColony.isWhitelisted(owner.address)).to.be.equal(false);
      expect(await TheColony.isWhitelisted(addr1.address)).to.be.equal(false);

      await TheColony.addWhitelist([owner.address, addr1.address]);
      expect(await TheColony.isWhitelisted(owner.address)).to.be.equal(true);
      expect(await TheColony.isWhitelisted(addr1.address)).to.be.equal(true);    
      await TheColony.claim();
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(1);
      expect(await TheColony.isWhitelisted(owner.address)).to.be.equal(false);
      expect(await TheColony.isWhitelisted(addr1.address)).to.be.equal(true);

      await TheColony.connect(addr1).claim();
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(1);
      expect(await TheColony.isWhitelisted(owner.address)).to.be.equal(false);
      expect(await TheColony.isWhitelisted(addr1.address)).to.be.equal(false);
    });
    it("Non-Whitelist Attempt", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);
    
      await expect(TheColony.claim()).to.be.revertedWithCustomError(TheColony, "NotWhitelisted");
    });
  });
  describe("Public Mint", function () {    
    it("Mint", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);
    
      await TheColony.updateMintState();

      let override = {value: ethers.utils.parseEther("0.03")};
      await TheColony.mint(3, override);
    });
    it("Public mint during whitelist", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);

      let override = {value: ethers.utils.parseEther("0.03")};
      await expect(TheColony.mint(3, override)).to.be.revertedWithCustomError(TheColony, "NotPublicMint");
    });
    it("Update Price", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);
    
      await TheColony.updateMintState();
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

      await TheColony.addWhitelist([owner.address]);
      await expect(TheColony.claim()).to.be.revertedWithCustomError(TheColony, "MintClosed");
      let override = {value: ethers.utils.parseEther("0.1")};
      await expect(TheColony.connect(addr1).mint(10, override)).to.be.revertedWithCustomError(TheColony, "MintClosed");
    });
  });

  describe("Withdraw", function () {
    it("Audit Withdraw", async function () {
      expect(await provider.getBalance(owner.address)).to.be.equal(ethers.utils.parseEther("9999.937127078474801544"));
      expect(await provider.getBalance(addr1.address)).to.be.equal(ethers.utils.parseEther("9999.999829618426392043"));
      expect(await provider.getBalance(addr2.address)).to.be.equal(ethers.utils.parseEther("10000"));
      expect(await provider.getBalance(TheColony.address)).to.be.equal(ethers.utils.parseEther("0"));

      await TheColony.updateMintState();
      let override = {value: ethers.utils.parseEther("0.1")};
      await TheColony.mint(10, override);

      expect(await provider.getBalance(owner.address)).to.be.equal(ethers.utils.parseEther("9999.836978657115208079"));
      expect(await provider.getBalance(addr1.address)).to.be.equal(ethers.utils.parseEther("9999.999829618426392043"));
      expect(await provider.getBalance(addr2.address)).to.be.equal(ethers.utils.parseEther("10000"));
      expect(await provider.getBalance(TheColony.address)).to.be.equal(ethers.utils.parseEther("0.1"));

      await TheColony.withdraw();
      expect(await provider.getBalance(owner.address)).to.be.equal(ethers.utils.parseEther("9999.836942610216514819"));
      expect(await provider.getBalance(addr1.address)).to.be.equal(ethers.utils.parseEther("9999.999829618426392043"));
      expect(await provider.getBalance(addr2.address)).to.be.equal(ethers.utils.parseEther("10000.1"));
      expect(await provider.getBalance(TheColony.address)).to.be.equal(ethers.utils.parseEther("0"));
    });
  });

  describe("Airdrop", function () {
    it("Test Airdrop", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr2.address)).to.be.equal(0);

      await TheColony.airdrop([addr1.address, addr2.address, addr1.address]);

      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(2);
      expect(await TheColony.balanceOf(addr2.address)).to.be.equal(1);
    });
  });
});
