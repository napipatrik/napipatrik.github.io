if (typeof moment === 'undefined') {
    var moment = require('./moment.min');
}

function showPatrik(i) {
    let index = i % patrikok.length;

    document.getElementById('napituti').innerHTML = patrikok[index].replace('\n', '<br/>');
    document.getElementById('permalink').href = window.location.href.replace(window.location.hash, '') + '#' + index;
}

function shuffle() {
    showPatrik(Math.floor(Math.random() * patrikok.length));
}

function getDefaultOffset() {
    return (moment().year() - 1970) * 365 + moment().dayOfYear();
}

if (typeof exports !== 'undefined') {
    exports.showPatrik = showPatrik;
    exports.shuffle = shuffle;
    exports.getDefaultOffset = getDefaultOffset;
}

