import { ethers } from "hardhat";

async function main() {
  // Correct Sepolia USDC address
  const bnbUsdcAddress = "0x6b9069420a3d4c6d9873807fd8a5d46c865e6699";

  const Payroll = await ethers.getContractFactory("Payroll");
  const payroll = await Payroll.deploy(bnbUsdcAddress);

  await payroll.deployed();  // v5 uses .deployed() instead of .waitForDeployment()

  console.log(
    `Payroll contract deployed to: BNB ${payroll.address}`  // v5 uses .address instead of .target
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
