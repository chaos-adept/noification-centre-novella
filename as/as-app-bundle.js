function isCurrentAppUrl(url) { //it will be handled in the BUS
  return url.startsWith("/noification-centre-novella/as/");
}

function renderApplication() {
    document.querySelector('.as-app').innerHTML = `<b>it is AS application , it exports function <strong> isCurrentAppUrl <strong>`;
}

renderApplication();
