// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUSDC {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SimpleTreasury {
    IUSDC public usdc;
    address public owner;
    
    struct Employee {
        uint256 monthlyPay;  // USDC amount (6 decimals, so 100000000 = $100)
        bool active;
    }
    
    mapping(address => Employee) public employees;
    
    constructor(address _usdc) {
        usdc = IUSDC(_usdc);
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // Add employee with monthly salary
    function addEmployee(address _employee, uint256 _monthlyPay) external onlyOwner {
        employees[_employee] = Employee({
            monthlyPay: _monthlyPay,
            active: true
        });
    }
    
    // Remove employee
    function removeEmployee(address _employee) external onlyOwner {
        employees[_employee].active = false;
    }
    
    // Pay single employee
    function payEmployee(address _employee) external onlyOwner {
        Employee memory emp = employees[_employee];
        require(emp.active, "Not active employee");
        require(emp.monthlyPay > 0, "No salary set");
        
        require(usdc.transfer(_employee, emp.monthlyPay), "Transfer failed");
    }
    
    // Check treasury balance
    function getTreasuryBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}