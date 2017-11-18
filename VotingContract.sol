
pragma solidity ^0.4.16;

interface token {
    function transfer(address receiver, uint amount);
}

contract VotingSystem {
    address public votingHead;
    uint public fundingGoal;
    uint public amountRaised;
    uint public deadline;
    token public tokenReward;
    mapping(address => uint256) public balanceOf;
    bool fundingGoalReached = false;
    bool vottingSessionClosed = false;

    event GoalReached(address recipient, uint totalAmountRaised);
    event FundTransfer(address backer, uint amount, bool isContribution);

    /**
     * Constrctor function
     *
     * Setup the owner
     */
    function VotingSystem(
        uint fundingGoalInEthers,
        uint etherCostOfEachToken,
        address addressOfTokenUsedAsReward
    ) {
        votingHead = 0xc4Ca2A205D6EC66ff58BE2D13D41b923E32Cb354;
        fundingGoal = fundingGoalInEthers * 1 ether;
        deadline = now + 2 * 1 minutes; // only 2 minutes allowed
        tokenReward = token(addressOfTokenUsedAsReward);
    }

    /**
     * Fallback function
     *
     * The function without name is the default function that is called whenever anyone sends funds to a contract
     */
    function () payable {
        require(!vottingSessionClosed);
        uint amount = msg.value;
        balanceOf[msg.sender] += amount;
        amountRaised += amount;
        tokenReward.transfer(msg.sender, amount);
        FundTransfer(msg.sender, amount, true);
    }

    modifier afterDeadline() { if (now >= deadline) _; }

    /**
     * Check if goal was reached
     *
     * Checks if the goal or time limit has been reached and ends the campaign
     */
    function checkGoalReached() afterDeadline {
        if (amountRaised >= fundingGoal){
            fundingGoalReached = true;
            GoalReached(votingHead, amountRaised);
        }
        vottingSessionClosed = true;
    }


    /**
     * Withdraw the funds
     *
     * Checks to see if goal or time limit has been reached, and if so, and the funding goal was reached,
     * sends the entire amount to the votingHead. If goal was not reached, each contributor can withdraw
     * the amount they contributed.
     */
    function safeWithdrawal() afterDeadline {
        if (!fundingGoalReached) {
            uint amount = balanceOf[msg.sender];
            balanceOf[msg.sender] = 0;
            if (amount > 0) {
                if (msg.sender.send(amount)) {
                    FundTransfer(msg.sender, amount, false);
                } else {
                    balanceOf[msg.sender] = amount;
                }
            }
        }

        if (fundingGoalReached && votingHead == msg.sender) {
            if (votingHead.send(amountRaised)) {
                FundTransfer(votingHead, amountRaised, false);
            } else {
                //If we fail to send the funds to votingHead, unlock funders balance
                fundingGoalReached = false;
            }
        }
    }
}
