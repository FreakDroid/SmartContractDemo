# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
```

To deploy it

```shell
npx hardhat compile --force //compiling the contract

# If you need to deploy it
npx hardhat run scripts/deploy-fund-me.js --network YOUR_NETWORK
```

To run the test

```shell
 npx hardhat run test/FundMe.test.js
```
