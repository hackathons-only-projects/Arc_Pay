import { ethers } from "hardhat";

async function main() {
  // Correct Sepolia USDC address
  const arcUsdcAddress = "0x3600000000000000000000000000000000000000";

  const Payroll = await ethers.getContractFactory("Payroll");
  const payroll = await Payroll.deploy(arcUsdcAddress);

  await payroll.deployed();  // v5 uses .deployed() instead of .waitForDeployment()

  console.log(
    `Payroll contract deployed to: ARC ${payroll.address}`  // v5 uses .address instead of .target
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
