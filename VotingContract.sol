
pragma solidity ^0.4.16;

interface token {
    function transfer(address receiver, uint amount);
}

contract SafeVote {
    address public votingCommission;
    uint public fundingGoal;
    uint public amountRaised;
    uint public deadline;
    token public tokenReward;
    mapping(address => uint256) public balanceOf;
    bool fundingGoalReached = false;
    bool votingSessionClosed = false;

    // This is a type for a single proposal.
    struct Candidate {
        string name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    string[] candidateTitles = ["Liberal", "Conservative", "NDP", "Bloc-Quebecois", "Green Party"];
    Candidate[] public candidates;

    event GoalReached(address recipient, uint totalAmountRaised);
    event FundTransfer(address backer, uint amount, bool isContribution);

    /**
     * Constrctor function
     *
     * Setup the owner
     */
    function SafeVote(
        address ifSuccessfulSendTo,
        uint fundingGoalInEthers,
        uint durationInMinutes,
        address addressOfTokenUsedAsReward
    ) {
        votingCommission = ifSuccessfulSendTo;
        fundingGoal = fundingGoalInEthers * 1 ether;
        deadline = now + durationInMinutes * 1 minutes; // timeout if logged on for too long
        tokenReward = token(addressOfTokenUsedAsReward);

        for (uint i = 0; i < candidateTitles.length; i++) {
            candidates.push(Candidate({
                name: candidateTitles[i],
                voteCount: 0
            }));
        }
    }

    /**
     * Fallback function
     *
     * The function without name is the default function that is called whenever anyone sends funds to a contract
     */
    function () payable {
        require(!votingSessionClosed);
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
     * Checks if the goal or time limit has been reached and ends the session
     */
    function checkGoalReached() afterDeadline {
        if (amountRaised >= fundingGoal){
            fundingGoalReached = true;
            GoalReached(votingCommission, amountRaised);
        }
        votingSessionClosed = true;
    }
}
