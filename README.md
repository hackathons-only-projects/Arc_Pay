# 💸 ArcPay: Automated On-Chain Payroll Protocol

[![Hackathon](https://img.shields.io/badge/Encode%20Club%20x%20Circle-%20Hackathon-blue)](https://www.encode.club/circle-hackathon)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Deployed-brightgreen)](YOUR_VERCEL_LINK_HERE)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A decentralized, on-chain payroll and value distribution protocol built on the Arc blockchain, showcasing the power of programmable stablecoins.**

---

## 🚀 Live Demo & Video Walkthrough

-   **View Live Demo:** [**arcpay-nine.vercel.app**](https://arcpay-nine.vercel.app/)
-   **Watch the Video Walkthrough:** [**Loom Video Link**](https://www.loom.com/share/b068eaaaaea446af9b2b3ecd962786b3)

---

## 💡 The Problem

Traditional payroll and corporate treasury operations are slow, opaque, and expensive. They rely on a web of intermediaries (banks, payment processors), leading to high fees, settlement delays (especially for international teams), and a lack of transparency. These legacy systems are not programmable and cannot keep up with the pace of modern, global organizations.

## ✨ The Solution: ArcPay

ArcPay is the foundational infrastructure for a modern, decentralized treasury. By leveraging smart contracts on the Arc blockchain, we enable any organization to manage and execute complex, one-to-many USDC payments with complete automation and transparency.

Our protocol allows a treasury owner to:
1.  Fund a secure, on-chain contract with USDC.
2.  Manage a registry of payees (employees, contractors, etc.) directly on the blockchain.
3.  Execute the entire payroll for all registered employees in a **single, atomic transaction**.

This is programmable money in action, solving real-world business problems.

---

## 🏆 Hackathon Tracks

This project is submitted for the following tracks:

1.  **Best Smart Contracts on Arc with Advanced Stablecoin Logic:** ArcPay is more than a simple transfer. It's an automated financial system. The `paySalaries` function is a programmable trigger that executes a conditional, one-to-many distribution of USDC, governed by an on-chain registry and role-based access control (`onlyOwner`).

2.  **Best Smart Contract Wallet Infrastructure for Treasury Management:** We have built the core smart contract infrastructure for automated treasury operations. The system handles on-chain allocations (salaries) and distributions (payroll) securely. Our roadmap includes direct integration with **Circle Gateway** to create a seamless fiat-to-payroll pipeline.

---

## 📋 Features

-   **Secure On-Chain Treasury:** A single smart contract to hold and manage USDC funds.
-   **Role-Based Access Control:** Only the designated owner can manage employees and trigger payments.
-   **Dynamic Employee Roster:** Easily add or remove payees and their salaries directly on-chain.
-   **One-Click Automated Payroll:** The `paySalaries` function iterates through all active employees and pays them in a single transaction, saving gas and time.
-   **Reactive UI:** A clean, user-friendly interface built with Next.js and Wagmi that provides real-time feedback on transactions and on-chain state.
-   **Multi-Chain Ready:** The core contract logic is EVM-compatible and has been successfully deployed and tested on Arc, BNB Testnet, and Sepolia.

---

## 🛠️ Tech Stack & Architecture

-   **Blockchain:** Solidity, Hardhat
-   **Network:** Arc Testnet
-   **Frontend:** Next.js, React, TypeScript
-   **Web3 Libraries:** Wagmi, Viem
-   **Styling:** Tailwind CSS
-   **Deployment:** Vercel

The architecture is a classic two-part system: a robust smart contract backend and a decentralized frontend that interacts directly with it.

---

## 🏁 Getting Started & Running Locally

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hackathons-only-projects/Arc_Pay.git
    cd arcpay
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser. You will need the MetaMask extension installed and configured for the Arc Testnet.

---

## 🗺️ Future Roadmap

ArcPay is a powerful foundation. Our next steps include:

-   **Circle Gateway Integration:** Implement a feature to allow treasuries to be funded directly from fiat via Circle's APIs, completing the Web2-to-Web3 payroll pipeline.
-   **Multi-Sig Approvals:** Integrate a Gnosis Safe or similar multi-signature wallet for owner actions, increasing security for larger organizations.
-   **Payment Streaming:** Evolve from monthly payroll to real-time salary streaming using protocols like Sablier.
-   **Cross-Chain Treasury Management:** Utilize Circle's CCTP to enable the treasury to be managed and funded across multiple EVM chains seamlessly.