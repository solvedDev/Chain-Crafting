var project = new JSZip();

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
  
	element.style.display = 'none';
	document.body.appendChild(element);
  
	element.click();
	
	document.body.removeChild(element);
}

function addToZip(pFileName, pText, pOption) {
	project.file(pFileName, pText, pOption);
}
async function downloadZip(pName) {
	project.generateAsync({type:"blob"})
	.then(function(content) {
		saveAs(content, pName);
	});
}