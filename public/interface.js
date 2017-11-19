const candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

function voteForCandidate() {
    candidateName = $("#candidate").val();
    contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
    let div_id = candidates[candidateName];
    console.log(contractInstance.totalVotesFor.call("candidate-1"));
    $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
    });
}

$('document').ready(function() {
    candidateNames = Object.keys(candidates);
    for (var i = 0; i < candidateNames.length; i++) {
        let name = candidateNames[i];
        $.ajax({
            type: 'GET',
            url: `votes/${name}`,
            success: (response) => {
                console.log(response);
            }
        });
        let val = contractInstance.totalVotesFor.call(name).toString();;
        console.log(val)
        console.log(contractInstance.totalVotesFor.call("candidate-1"));
        $("#" + candidates[name]).html(val);
    }
});