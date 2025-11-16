// app/components/EmployeeRoster.tsx
'use client';

import { useReadContract, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';

// We need to pass these in from the main page
interface EmployeeRosterProps {
  payrollContractAddress: `0x${string}`;
  payrollContractABI: any;
  onRemoveEmployee: (address: string) => void;
}

export function EmployeeRoster({ payrollContractAddress, payrollContractABI, onRemoveEmployee }: EmployeeRosterProps) {
  // 1. First, we get the total number of employees
  const { data: employeeCount, isLoading: isCountLoading } = useReadContract({
    address: payrollContractAddress,
    abi: payrollContractABI,
    functionName: 'getEmployeeCount',
  });

  // 2. Prepare the calls to get each employee address by its index
  const employeeAddressContracts = [];
  if (employeeCount) {
    for (let i = 0; i < employeeCount; i++) {
      employeeAddressContracts.push({
        address: payrollContractAddress,
        abi: payrollContractABI,
        functionName: 'employeeAddresses',
        args: [BigInt(i)],
      });
    }
  }

  // 3. Use `useReadContracts` (plural) to fetch all addresses in one batch
  const { data: employeeAddressResults, isLoading: areAddressesLoading } = useReadContracts({
    contracts: employeeAddressContracts,
    // Only run this query if we have a valid count
    query: { enabled: employeeCount !== undefined && employeeCount > 0 },
  });

  if (isCountLoading) return <p className="text-gray-500">Loading employee count...</p>;

  // Filter out any failed results and extract the addresses
  const validAddresses = employeeAddressResults?.filter(r => r.status === 'success').map(r => r.result as string) ?? [];

  return (
    <div className="space-y-3">
      {areAddressesLoading && <p className="text-gray-500">Fetching employee list...</p>}
      
      {validAddresses.length > 0 ? (
        validAddresses.map(addr => (
          <EmployeeCard 
            key={addr} 
            employeeAddress={addr} 
            payrollContractAddress={payrollContractAddress}
            payrollContractABI={payrollContractABI}
            onRemove={() => onRemoveEmployee(addr)} 
          />
        ))
      ) : (
        !areAddressesLoading && <p className="text-gray-500">No employees have been added yet.</p>
      )}
    </div>
  );
}

// EmployeeCard component remains largely the same
function EmployeeCard({ employeeAddress, payrollContractAddress, payrollContractABI, onRemove }: any) {
  const { data: employeeData } = useReadContract({
    address: payrollContractAddress,
    abi: payrollContractABI,
    functionName: 'employees',
    args: [employeeAddress],
  });

  if (!employeeData) return <div className="bg-gray-700 p-3 rounded-md animate-pulse">Loading details for {employeeAddress.substring(0, 8)}...</div>;

  const salary = formatUnits(employeeData[1], 6);
  const isEmployed = employeeData[2];

  return (
    <div className={`p-4 rounded-md flex justify-between items-center ${isEmployed ? 'bg-gray-700' : 'bg-red-900/50'}`}>
      <div>
        <p className="font-mono text-sm break-all">{employeeAddress}</p>
        <p className="font-bold text-lg">{salary} USDC / month</p>
        {!isEmployed && <p className="text-red-400 font-bold">REMOVED</p>}
      </div>
      {isEmployed && <button onClick={onRemove} className="bg-red-600 hover:bg-red-700 text-xs font-bold py-1 px-2 rounded">Remove</button>}
    </div>
  );
}