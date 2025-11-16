import { ethers } from "hardhat";

async function main() {
  // Correct Sepolia USDC address
  const sepoliaUsdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

  const Payroll = await ethers.getContractFactory("Payroll");
  const payroll = await Payroll.deploy(sepoliaUsdcAddress);

  await payroll.deployed();  // v5 uses .deployed() instead of .waitForDeployment()

  console.log(
    `Payroll contract deployed to: ${payroll.address}`  // v5 uses .address instead of .target
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

