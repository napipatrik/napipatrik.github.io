if (typeof moment === 'undefined') {
    var moment = require('./moment.min');
}

function loadSearch() {
	var list = document.getElementById("tutilist-inner");
	for (var i in patrikok) {
		var a = document.createElement('a');
		a.href = '#' + i;
		a.innerText = patrikok[i].replace('\n', '<br/>');
		a.onclick = showPatrikSearchFactory(i);
		list.appendChild(a);
	}
}

function showSearch() {
	document.getElementById("tutilist").classList.toggle("show");
}

function filterTuti() {
    var input = document.getElementById("tuti-search");
    var filter = input.value.toUpperCase();
    var a = document.getElementById("tutilist").getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

function showPatrikSearchFactory(i) {
	return function () {
	    showPatrik(i);
	    window.location.hash = i;
	    document.getElementById("tutilist").classList.toggle("show");
	    return false;
	}
}

function showPatrik(i) {
    let index = i % patrikok.length;
console.log(i);
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

