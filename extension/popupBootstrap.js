document.getElementById("header-link").addEventListener("click", () => { window.close(); } );
document.getElementById("copy-permalink-btn").addEventListener("click", () => { copyPermalink(); } );
document.getElementById("copy-daily-pic-btn").addEventListener("click", copyNapiKep);
document.getElementById("expand-search-btn").addEventListener("click", expandTutikereso);
document.getElementById("tuti-search").addEventListener("keyup", searchInList);

fetch('https://napipatrik.hu/napipatrik')
  .then(response => response.text())
  .then(raw => raw.trim().replace(/\n/g, '<br/>'))
  .then(data => document.getElementById('napipatrik').innerHTML = data);

fetch('https://napipatrik.hu/napipatrik.id')
  .then(response => response.text())
  .then(raw => raw.trim())
  .then(data => window.napiId = data);

loadSearch();
