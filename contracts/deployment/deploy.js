async function main() {
    const Erc20Contract = await ethers.getContractFactory("FusionContract");
    const erc20 = await Erc20Contract.deploy();
    console.log("Contract erc20 Deployed to Address:", erc20.address);

    const FusionContract = await ethers.getContractFactory("FusionContract");
    const fushion_contract = await FusionContract.deploy();
    console.log("Contract erc721 Deployed to Address:", fushion_contract.address);
  }
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });