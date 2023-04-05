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
    it("Updated Price", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);
    
      await TheColony.updatePrice(ethers.utils.parseEther("0.001"));

      let override = {value: ethers.utils.parseEther("0.003")};
      TheColony.mint(3, override);
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(3);
    });

    it("Mint Closed", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);
    
      await TheColony.updateMintStatus();

      let override = {value: ethers.utils.parseEther("0.1")};
      await expect(TheColony.connect(addr1).mint(10, override)).to.be.revertedWithCustomError(TheColony, "MintClosed");
    });

    it("Overpayment Fail", async function () {
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(addr1.address)).to.be.equal(0);

      //overpaying for NFT
      let override = {value: ethers.utils.parseEther("0.1")};
      await expect(TheColony.mint(1, override)).to.be.revertedWith("ETH value incorrect");
      expect(await provider.getBalance(TheColony.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
    });

    it("Underpayment Fail", async function () {
      expect(await provider.getBalance(TheColony.address)).to.be.equal(ethers.utils.parseEther("0"));
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);

      //underpaying for NFT
      let override = {value: ethers.utils.parseEther("0.0001")};
      await expect(TheColony.mint(1, override)).to.be.revertedWith("ETH value incorrect");
      expect(await provider.getBalance(TheColony.address)).to.be.equal(0);
      expect(await TheColony.balanceOf(owner.address)).to.be.equal(0);
      });
  });

  describe("Withdraw", function () {
    it("Audit Withdraw", async function () {
      expect(await provider.getBalance(owner.address)).to.be.equal(ethers.utils.parseEther("9999.940825952321464704"));
      expect(await provider.getBalance(addr1.address)).to.be.equal(ethers.utils.parseEther("9999.999968238437921093"));
      expect(await provider.getBalance(addr2.address)).to.be.equal(ethers.utils.parseEther("10000"));
      expect(await provider.getBalance(TheColony.address)).to.be.equal(ethers.utils.parseEther("0"));

      let override = {value: ethers.utils.parseEther("0.1")};
      await TheColony.mint(10, override);

      expect(await provider.getBalance(owner.address)).to.be.equal(ethers.utils.parseEther("9999.840714696462674189"));
      expect(await provider.getBalance(addr1.address)).to.be.equal(ethers.utils.parseEther("9999.999968238437921093"));
      expect(await provider.getBalance(addr2.address)).to.be.equal(ethers.utils.parseEther("10000"));
      expect(await provider.getBalance(TheColony.address)).to.be.equal(ethers.utils.parseEther("0.1"));

      await TheColony.withdraw();
      expect(await provider.getBalance(owner.address)).to.be.equal(ethers.utils.parseEther("9999.84067474504720359"));
      expect(await provider.getBalance(addr1.address)).to.be.equal(ethers.utils.parseEther("9999.999968238437921093"));
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
