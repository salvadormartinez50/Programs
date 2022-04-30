/**
 * Obtener blob
   * @param {String} dirección del archivo de destino de la URL
 * @return {Promise} 
 */
function getBlob(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
 
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
        };
 
        xhr.send();
    });
}
 
/**
   * Salvar
 * @param  {Blob} blob     
   * @param {String} nombre de archivo El nombre del archivo que desea guardar
 */
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        const body = document.querySelector('body');
 
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
 
        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
        
        link.click();
        body.removeChild(link);
 
        window.URL.revokeObjectURL(link.href);
    }
}
 
/**
   * Descarga
   * @param {String} dirección del archivo de destino de la URL
   * @param {String} nombre de archivo El nombre del archivo que desea guardar
 */
function download(url, filename) {
    getBlob(url).then(blob => {
        saveAs(blob, filename);
    });
}