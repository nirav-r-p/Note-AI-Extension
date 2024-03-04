export  function createImageDom(url,className){
    const imageDom=document.createElement('img');
    imageDom.src=url;
    imageDom.role='img';
    imageDom.classList.add(className);
    return imageDom;
}

