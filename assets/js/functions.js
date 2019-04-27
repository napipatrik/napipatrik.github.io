function showPatrik(i) {
    let index = i % patrikok.length;

    document.getElementById('napituti').innerText = patrikok[index];
    document.getElementById('permalink').href = window.location.href.replace(window.location.hash, '') + '#' + index;
}

function shuffle() {
    showPatrik(Math.floor(Math.random() * patrikok.length));
}

function getDefaultOffset() {
    return moment().year() * moment().dayOfYear();
}
