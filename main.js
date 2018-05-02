const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

const saveAsDataUri = img => {
  if (isDataURL(img.srcUrl)) {
    copy(img.srcUrl, 'text/plain');
    alert('data uri copied to clipboard');
  } else {
    toDataURL(img.srcUrl)
      .then(dataUrl => {
        copy(dataUrl, 'text/plain');
        alert('data uri copied to clipboard');
      });
  }
};

chrome.contextMenus.create({
  title: 'Save as Uri',
  contexts: ['image'],
  onclick: saveAsDataUri
});

const copy = (str, mimetype) => {
  document.oncopy = function (event) {
    event.clipboardData.setData(mimetype, str);
    event.preventDefault();
  };
  document.execCommand("Copy", false, null);
}

const isDataURL = s => {
  return !!s.match(isDataURL.regex);
}
isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
