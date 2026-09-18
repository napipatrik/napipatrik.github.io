if (typeof moment === 'undefined') {
    var moment = require('./moment.min');
}

function loadSearch() {
	var list = document.getElementById("tutilist-inner");
	for (var i in patrikok) {
		var a = document.createElement('a');
		a.href = '/' + i + '/';
		a.innerHTML = patrikok[i].replace(/\n/g, '<br/>');
		a.onclick = showTutiSearchFactory(i);
		list.appendChild(a);
	}

	var overlay = document.getElementById("tutilist");
	// Clicking the backdrop (but not the panel itself) cancels the search.
	overlay.addEventListener("click", function (event) {
		if (event.target === overlay) {
			hideSearch();
		}
	});
	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape" && overlay.classList.contains("show")) {
			hideSearch();
		}
	});
}

function showSearch() {
	var overlay = document.getElementById("tutilist");
	overlay.classList.add("show");
	overlay.setAttribute("aria-hidden", "false");
	document.getElementById("tuti-search").focus();
}

function hideSearch() {
	var overlay = document.getElementById("tutilist");
	overlay.classList.remove("show");
	overlay.setAttribute("aria-hidden", "true");
}

function filterTuti() {
    var input = document.getElementById("tuti-search");
    var filter = unaccent(input.value.toUpperCase());
    var a = document.getElementById("tutilist").getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (unaccent(txtValue.toUpperCase()).indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

function showTutiSearchFactory(i) {
	return function () {
	    showTuti(i);
	    hideSearch();
	    return false;
	}
}

function showTuti(i, skipAddHistory) {
    let index = i % patrikok.length;
    document.getElementById('napituti').innerHTML = patrikok[index].replace(/\n/g, '<br/>');
    document.getElementById('tuti-id').innerHTML = '#' + index;
    document.getElementById('permalink').href = window.location.href.replace(/\d+/, index);

    if (!skipAddHistory) {
        window.history.pushState(index, "Napi Patrik - az elégedetlen DevOpsos oldala", '/' + index + '/');
    }
}

function shuffle() {
    showTuti(Math.floor(Math.random() * patrikok.length));
}

function getDefaultOffset() {
    return (moment().year() - 1970) * 365 + moment().dayOfYear();
}

function unaccent(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

if (typeof exports !== 'undefined') {
    exports.showTuti = showTuti;
    exports.shuffle = shuffle;
    exports.getDefaultOffset = getDefaultOffset;
}

