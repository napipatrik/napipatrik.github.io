function copyPermalink(i) {
	const link = 'https://napipatrik.hu/' + (i ? i : napiId) + '/';
	copyTextToClipboard(link);
	document.getElementById("tuti-search").value = '';
	window.close();
}

function copyNapiKep() {
	const link = 'https://napipatrik.hu/napipatrik.jpg';
	copyTextToClipboard(link);
	window.close();
}

function expandTutikereso() {
	document.getElementById('tutikereso-gomb-container').style.display = 'none';
	const divs = document.getElementsByClassName('tutikereso');
	for (div of divs) {
		div.style.display = 'flex';
	}
	document.getElementById("tuti-search").focus();
}

function loadSearch() {
	var list = document.getElementById("tutilist");
	for (var i in patrikok) {
		var p = document.createElement('p');
		p.href = '#' + i;
		p.innerHTML = patrikok[i].replace(/\n/g, '<br/>');

		var pContainer = document.createElement('div');
		pContainer.classList.add('col');
		pContainer.appendChild(p);

		var copyBtn = document.createElement('button');
		copyBtn.type = 'button';
		copyBtn.classList.add('btn');
		copyBtn.classList.add('btn-outline-light');
		copyBtn.classList.add('btn-sm');
		copyBtn.onclick = function (i) { return () => copyPermalink(i); }(i);
		copyBtn.innerText = 'Permalink';

		var btnContainer = document.createElement('div');
		btnContainer.classList.add('col-3');
		btnContainer.appendChild(copyBtn);

		var container = document.createElement('div');
		container.classList.add('row');
		container.appendChild(pContainer);
		container.appendChild(btnContainer);

		list.appendChild(container);
	}
}

function searchInList() {
    var input = document.getElementById("tuti-search");
    var filter = input.value.toUpperCase();
    var items = document.getElementById("tutilist").children;
    for (var i = 0; i < items.length; i++) {
    	const p = items[i].firstChild.firstChild;
        txtValue = p.textContent || p.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}

function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to. 
  var copyFrom = document.createElement("textarea");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child. 
  //"execCommand()" only works when there exists selected text, and the text is inside 
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand('copy');

  //(Optional) De-select the text using blur(). 
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor 
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}