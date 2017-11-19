const candidates = {"Rama": "candidate-0", "Nick": "candidate-1", "Jose": "candidate-2"}

const voteForCandidate = (candidateName) => {
    candidateName = $("#candidate").val();
    contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
    let div_id = candidates[candidateName];
    $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
    });
}

$('document').ready(function() {
    const candidateNames = Object.keys(candidates);
    const scores = [];
    for (let i = 0; i < candidateNames.length; i++) {
        const name = candidateNames[i];
        const index = i;
        $.ajax({
            type: 'GET',
            url: `votes/${name}`,
            success: (voteCount) => {
                $("#candidate-" + index).html(voteCount);
            }
        });
    }
});