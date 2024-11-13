const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert } = require("chai");

const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER_V3_AGGREGATOR,
} = require("../networkConfig");

const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Fund me Project", () => {
  async function deployFundMeLockFixture() {
    const ammountSent = ethers.parseEther("1");
    const [owner, account2, account3] = await ethers.getSigners();
    const mocks = await ethers.getContractFactory("MockV3Aggregator");
    const mockV3Aggregator = await mocks.deploy(
      DECIMALS,
      INITIAL_ANSWER_V3_AGGREGATOR
    );

    const TestContract = await ethers.getContractFactory("FundMe");
    const contract = await TestContract.deploy(mockV3Aggregator.getAddress());

    return {
      contract,
      owner,
      account2,
      account3,
      mockV3Aggregator,
      ammountSent,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { owner, contract } = await loadFixture(deployFundMeLockFixture);

      expect(await contract.getOwner()).to.equal(owner.address);
    });

    it("Should init the contract with 0", async function () {
      const { owner, contract } = await loadFixture(deployFundMeLockFixture);

      expect(await ethers.provider.getBalance(contract.target)).to.equal(0);
    });
  });

  describe("Fund", () => {
    it("Should send fund to the contract and revert it because you didn't sent enough funds", async () => {
      const { contract } = await loadFixture(deployFundMeLockFixture);

      await expect(contract.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });

    it("Should send money to the contract using fund", async () => {
      const { contract, ammountSent, owner } = await loadFixture(
        deployFundMeLockFixture
      );

      await contract.fund({
        value: ammountSent,
      });

      const response = await contract.getAddressToAmountFunded(
        owner.getAddress()
      );
      const balanceFromContract = await ethers.provider.getBalance(
        contract.target
      );

      // Testing the method
      assert.equal(response.toString(), ammountSent.toString());

      // Another way to test it. The only problem is if we receive more transactions the balance will encrease and this
      // Won't match. Potential Flaky
      assert.equal(balanceFromContract, ammountSent.toString());
    });

    it("Should widthdraw money from the contract using fund account", async () => {
      const { contract, ammountSent, owner } = await loadFixture(
        deployFundMeLockFixture
      );

      // This should be 0 because the contract doens't have any money there.
      const initialContractBalance = await ethers.provider.getBalance(
        contract.getAddress()
      );

      const initialOwnerBalance = await ethers.provider.getBalance(
        owner.getAddress()
      );

      await contract.fund({
        value: ammountSent,
      });

      const withdraw = await contract.withdraw();
      const transactionReceipt = await withdraw.wait();

      // verify this later because I have some questions related with that.
      //   const { gasUsed, effectiveGasPrice } = transactionReceipt;
      //   console.log("effectiveGasPrice", effectiveGasPrice ?? 0);
      //   const gasTotalUsed = BigInt(gasUsed) * BigInt(effectiveGasPrice ?? 0);

      const endContractBalance = await ethers.provider.getBalance(
        contract.getAddress()
      );

      const endOwnerBalance = await ethers.provider.getBalance(
        owner.getAddress()
      );

      assert.equal(endContractBalance, 0);

      //   assert.equal(withdraw.value.toString(), response.toString());

      //   assert.equal(
      //     (initialContractBalance + initialOwnerBalance).toString(),
      //     (endOwnerBalance + gasUsed).toString()
      //   );
    });

    it("Only allows the owner to withdraw", async function () {
      const { contract, ammountSent, account2 } = await loadFixture(
        deployFundMeLockFixture
      );

      await contract.fund({
        value: ammountSent,
      });

      const fundMeConnectedContract = await contract.connect(account2);

      // how we are creating a custom error, we need to specify it.
      await expect(
        fundMeConnectedContract.withdraw()
      ).to.be.revertedWithCustomError(contract, "FundMe_NotOwner");
    });
  });
});
