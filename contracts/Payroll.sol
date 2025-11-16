// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// We need the same ERC20 interface to interact with the USDC token contract.
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Payroll {
    // --- STATE VARIABLES ---

    address public owner; // The employer's wallet address
    IERC20 public usdcToken; // The contract instance of the USDC token

    // A 'struct' is like a custom data type. We use it to store employee info.
    struct Employee {
        address wallet; // The employee's wallet address
        uint256 monthlySalary; // Their salary in USDC (with decimals)
        bool isCurrentlyEmployed; // A flag to easily add/remove
    }

    // A 'mapping' is like a dictionary or hash map.
    // It maps an employee's wallet address to their Employee data.
    mapping(address => Employee) public employees;

    // We also keep a list of all employee addresses to make it easy to loop through them.
    address[] public employeeAddresses;

    // --- MODIFIERS ---

    // A modifier to ensure only the owner can call certain functions.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // --- CONSTRUCTOR ---

    // This runs ONCE when you deploy the contract.
    // We pass the official Sepolia USDC contract address to it.
    constructor(address _usdcTokenAddress) {
        owner = msg.sender; // The deployer is the owner.
        usdcToken = IERC20(_usdcTokenAddress);
    }

    // --- OWNER FUNCTIONS ---

    // Adds a new employee to the system.
    function addEmployee(address _wallet, uint256 _monthlySalary) external onlyOwner {
        require(_wallet != address(0), "Invalid wallet address");
        require(_monthlySalary > 0, "Salary must be greater than zero");
        // Ensure we aren't overwriting an existing, active employee.
        require(!employees[_wallet].isCurrentlyEmployed, "Employee already exists");

        // Store the employee data
        employees[_wallet] = Employee({
            wallet: _wallet,
            monthlySalary: _monthlySalary,
            isCurrentlyEmployed: true
        });

        // Add their address to our list for easy access
        employeeAddresses.push(_wallet);
    }

    // Marks an employee as no longer active. We don't delete them for historical records.
    function removeEmployee(address _wallet) external onlyOwner {
        require(employees[_wallet].isCurrentlyEmployed, "Employee not found");
        employees[_wallet].isCurrentlyEmployed = false;
    }

    // The main function to pay all active employees.
    function paySalaries() external onlyOwner {
        // We will loop through the list of all employee addresses we have stored.
        for (uint i = 0; i < employeeAddresses.length; i++) {
            address employeeWallet = employeeAddresses[i];
            
            // We only pay if they are marked as currently employed.
            if (employees[employeeWallet].isCurrentlyEmployed) {
                uint256 salary = employees[employeeWallet].monthlySalary;
                
                // IMPORTANT: The contract must have enough USDC to make this transfer.
                // The owner is responsible for sending USDC to this contract's address first.
                usdcToken.transfer(employeeWallet, salary);
            }
        }
    }

    // --- VIEW FUNCTIONS (Read-only) ---

    // A helper function to get the number of employees.
    function getEmployeeCount() external view returns (uint256) {
        return employeeAddresses.length;
    }
}