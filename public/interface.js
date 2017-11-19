const candidates = { "GreenParty": "candidate-0", "Conservative": "candidate-1", "Liberal": "candidate-2", "NDP": "candidate-3", "Bloc-Quebecois": "candidate-4" }

$('.btn-vote-choice').click(function () {
    $chosen = $('.vote-for-candidate');
    if ($(this).hasClass('button1')) { // Green
        $chosen.empty();
        $chosen.append('the Green Party');
        $chosen.val('candidate-0');
    } else if ($(this).hasClass('button2')) { // Conservative
        $chosen.empty();
        $chosen.append('the Conservative Party');
        $chosen.val('candidate-1');
    } else if ($(this).hasClass('button3')) { // Liberal
        $chosen.empty();
        $chosen.append('the Liberal Party');
        $chosen.val('candidate-2');
    } else if ($(this).hasClass('button4')) { // NDP
        $chosen.empty();
        $chosen.append('the NDP Party');
        $chosen.val('candidate-3');
    } else if ($(this).hasClass('button5')) { // Bloc
        $chosen.empty();
        $chosen.append('the Bloc-Qu&eacute;b&eacute;cois');
        $chosen.val('candidate-4');
    }

    $('.parentDisable').show();
    $('#vote-confirm-popup').show();
});

$('.submit-ballot-confirm').click(function(){
    $('#ballot').val($chosen.val())
    $('.submission-form').submit();
});

$('.submit-ballot-no').click(function(){
    $('.parentDisable').hide();
    $('#vote-confirm-popup').hide();
});

$('document').ready(function () {
    const candidateNames = Object.values(candidates);
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
