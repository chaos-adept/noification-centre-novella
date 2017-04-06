function isCurrentAppUrl(url) { //it will be handled in the BUS
  return url.startsWith("/noification-centre-novella/spr/");
}

function renderApplication() {
    document.querySelector('.spr-app').innerHTML = `<b>it is SPR application , it exports function <strong> isCurrentAppUrl <strong>`;
}

renderApplication();
