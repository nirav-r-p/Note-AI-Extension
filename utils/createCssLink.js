export  function createCSSDom(url){
    const cssLink=document.createElement('link');
    cssLink.href=url;
    cssLink.rel="stylesheet";
    return cssLink;
}


