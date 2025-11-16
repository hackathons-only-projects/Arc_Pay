// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseUnits, formatUnits, isAddress } from 'viem';
import {EmployeeRoster} from './components/Employees';

// =================================================================================
// ===== HARDCODED CONSTANTS =======================================================
// =================================================================================

// 👇 PASTE YOUR DEPLOYED PAYROLL CONTRACT ADDRESS HERE
const payrollContractAddress = '0xCaf871e75Fb2040BD185B35031Bb7B1CEb1B2486' //'0x19bf25AC85AeF02ce105B8DC49e6f6aa7C420820';

// 👇 PASTE YOUR ABI FROM Payroll.json HERE
const payrollContractABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_usdcTokenAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_wallet",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_monthlySalary",
          "type": "uint256"
        }
      ],
      "name": "addEmployee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "employeeAddresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "employees",
      "outputs": [
        {
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "monthlySalary",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isCurrentlyEmployed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEmployeeCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paySalaries",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_wallet",
          "type": "address"
        }
      ],
      "name": "removeEmployee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "usdcToken",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const;

// Hardcoded Sepolia USDC address
const usdcContractAddress = '0x3600000000000000000000000000000000000000';

// Minimal ABI to check USDC balance
const erc20ABI = [
    { "constant": true, "inputs": [{"name": "_owner", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}], "type": "function" }
] as const;

// =================================================================================
// ===== MAIN PAGE COMPONENT =======================================================
// =================================================================================

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);

  const [newEmployeeAddress, setNewEmployeeAddress] = useState('');
  const [newEmployeeSalary, setNewEmployeeSalary] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const { writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const { data: usdcBalance, refetch: refetchUsdcBalance } = useReadContract({
    address: usdcContractAddress, abi: erc20ABI, functionName: 'balanceOf', args: [payrollContractAddress],
  });

  useEffect(() => {
    if (isConfirmed) {
      setSuccessMessage('Transaction Successful! Updating list...');
      // Force both balances and the employee list to refetch
      refetchUsdcBalance();
      // NOTE: We don't need to call refetchEmployees here anymore because the EmployeeRoster component will
      // automatically refetch when its underlying data (employeeCount) changes after a successful add/remove.
      setTxHash(undefined);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  }, [isConfirmed, refetchUsdcBalance]);

  const handleAddEmployee = () => {
    if (!isAddress(newEmployeeAddress) || !newEmployeeSalary) return alert('Invalid address or salary.');
    const salaryInSmallestUnit = parseUnits(newEmployeeSalary, 6);
    writeContract({ address: payrollContractAddress, abi: payrollContractABI, functionName: 'addEmployee', args: [newEmployeeAddress, salaryInSmallestUnit] }, { onSuccess: setTxHash });
  };

  const handlePaySalaries = () => {
    writeContract({ address: payrollContractAddress, abi: payrollContractABI, functionName: 'paySalaries' }, { onSuccess: setTxHash });
  };

  const handleRemoveEmployee = (employeeAddress: string) => {
    writeContract({ address: payrollContractAddress, abi: payrollContractABI, functionName: 'removeEmployee', args: [employeeAddress] }, { onSuccess: setTxHash });
  };

  if (!isClient) {
    return null; // This definitively fixes the hydration error.
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-900 text-white font-sans">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl font-bold mb-4">Simple Payroll DApp</h1>
        <p className="text-gray-400 mb-8">Manage and pay your team with USDC on Sepolia.</p>

        {successMessage && (
          <div className="mb-4 p-3 text-center bg-green-500 text-white rounded-lg animate-pulse">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Wallet</h2>
              {isConnected ? (
                <div>
                  <p className="truncate">Connected: {address}</p>
                  <button onClick={() => disconnect()} className="mt-2 w-full bg-red-500 hover:bg-red-600 font-bold py-2 px-4 rounded">Disconnect</button>
                </div>
              ) : (
                 <button onClick={() => connect({ connector: injected() })} className="w-full bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded">Connect Wallet</button>
              )}
            </div>

            {isConnected && (
              <>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4">Contract Funds</h2>
                  <p className="text-3xl font-mono">{usdcBalance !== undefined ? formatUnits(usdcBalance, 6) : '0.00'} <span className="text-xl">USDC</span></p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4">Add Employee</h2>
                  <input type="text" placeholder="Employee Address (0x...)" value={newEmployeeAddress} onChange={(e) => setNewEmployeeAddress(e.target.value)} className="w-full p-2 rounded bg-gray-700 mb-3" />
                  <input type="number" placeholder="Monthly Salary (USDC)" value={newEmployeeSalary} onChange={(e) => setNewEmployeeSalary(e.target.value)} className="w-full p-2 rounded bg-gray-700 mb-4" />
                  <button onClick={handleAddEmployee} disabled={isPending || isConfirming} className="w-full bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded disabled:bg-gray-500">
                    {isPending ? 'Check Wallet...' : isConfirming ? 'Confirming...' : 'Add Employee'}
                  </button>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Pay Day</h2>
                    <button onClick={handlePaySalaries} disabled={isPending || isConfirming} className="w-full bg-purple-600 hover:bg-purple-700 font-bold py-3 px-4 rounded text-lg disabled:bg-gray-500">
                      {isPending ? 'Check Wallet...' : isConfirming ? 'Paying...' : 'PAY ALL SALARIES'}
                    </button>
                </div>
              </>
            )}
          </div>

          <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Employee Roster</h2>
            {isConnected ? (
              <EmployeeRoster 
                payrollContractAddress={payrollContractAddress}
                payrollContractABI={payrollContractABI}
                onRemoveEmployee={handleRemoveEmployee}
              />
            ) : (
              <p className="text-gray-500">Connect your wallet to see the roster.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}