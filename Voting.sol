pragma solidity ^0.4.16;
// We have to specify what version of compiler this code will compile with

contract Voting {

  struct Voter {
    bool voted;
    bytes32 votedFor;
    string firstName;
    string lastName;
  }

  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping is candidate name stored as type bytes32 and value is
  an unsigned integer to store the vote count
  */
  mapping (address => Voter) public voters;
  mapping (bytes32 => uint8) public votesReceived;
  
  /* Solidity doesn't let you pass in an array of strings in the constructor (yet).
  We will use an array of bytes32 instead to store the list of candidates
  */
  
  bytes32[] public candidateList;

  address public voteRegulator;

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  we will pass an array of candidates who will be contesting in the election
  */
  function Voting(bytes32[] candidateNames) public {
    voteRegulator = msg.sender;
    candidateList = candidateNames;
  }

  // This function can be used to authorize a user to vote,
  // should they not have actually voted for someone,
  // but have still triggered the voted status.
  function authorizeVote(address voter) {
    require((msg.sender == voteRegulator) && voters[voter].votedFor == bytes32(0));
    voters[voter].voted = false;
  }

  // This function returns the total votes a candidate has received so far
  function totalVotesFor(bytes32 candidate) view public returns (uint8) {
    require(validCandidate(candidate));
    return votesReceived[candidate];
  }

  // This function increments the vote count for the specified candidate. This
  // is equivalent to casting a vote
  function voteForCandidate(bytes32 candidate) public returns (bool) {
    require(validCandidate(candidate) && !voters[msg.sender].voted);
    votesReceived[candidate] += 1;
    voters[msg.sender].voted = true;
    voters[msg.sender].votedFor = candidate;
    return true;
  }

  // This function ensures that the candidate being voted for
  // is actually a candidate in the list.
  function validCandidate(bytes32 candidate) view public returns (bool) {
    for (uint i = 0; i < candidateList.length; i++) {
      if (candidateList[i] == candidate) {
        return true;
      }
    }
    return false;
  }

  // Returns whether or not the user can vote in the current election
  function canVote() view public returns (bool) {
    return voters[msg.sender].voted;
  }

  // Sets the user's first name
  function setFirstName(string fname) public returns (bool) {
    voters[msg.sender].firstName = fname;
    return true;
  }

  // Set the user's last name
  function setLastName(string lname) public returns (bool) {
    voters[msg.sender].lastName = lname;
    return true;
  }

  // Returns the sender's first name from the blockchain
  function getFirstName() view public returns (string) {
    return voters[msg.sender].firstName;
  }

  // Returns the sender's last name from the blockchain
  function getLastName() view public returns (string) {
    return voters[msg.sender].lastName;
  }

  // Returns the who the sender voted for, if they voted
  function getVotedFor() view public returns (string) {
    require(voters[msg.sender].voted);
    return bytes32ToString(voters[msg.sender].votedFor);
  }

  // Converts a bytes32 variable to a human-readable string
  // (Special thanks to the internet for this!)
  function bytes32ToString(bytes32 x) private pure returns (string) {
    bytes memory bytesString = new bytes(32);
    uint charCount = 0;
    for (uint j = 0; j < 32; j++) {
        byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
        if (char != 0) {
            bytesString[charCount] = char;
            charCount++;
        }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (j = 0; j < charCount; j++) {
        bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
  }
}