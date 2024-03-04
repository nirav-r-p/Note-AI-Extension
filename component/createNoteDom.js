const AsyncImoprt = async (url) => {
    const src = chrome.runtime.getURL(url);
    const ImpoprtModule = await import(src);
    return ImpoprtModule;
}
const COLOR = ["#00A5E3", "#8DD7BF", "#FF96C5", "#FF5768", "#FFBF65", "#FC6238", "#FFD872", "#FFD872", "F2D4CC", "E77577", "6C88C4", "CO5780", "FF828B", "E7C582", "OOB0BA"];
let createImage=await AsyncImoprt("./utils/createImageDom.js");


export function createNoteDom(position,content){
    const {top,left}=position;

    const noteDom=document.createElement('div');
    noteDom.classList.add('note-box');
    noteDom.style.zIndex="10004";
    noteDom.style.top=top;
    noteDom.style.left=left;

    const textFiled=document.createElement('div');
    textFiled.contentEditable=true+"";
    textFiled.classList.add('note-content');
    textFiled.innerHTML=content;

    const noteFieldContent=document.createElement('div');
    noteFieldContent.classList.add('note-filed-content');
    noteFieldContent.style.backgroundColor=COLOR[randomNumber(0,14)];
    textFiled.style.backgroundColor=noteFieldContent.style.backgroundColor;

    /** speek*/
    const micImageDom=createImage.createImageDom(chrome.runtime.getURL("images/mic.svg"),'mic');
 

    /**delete */
    const deleteImageDom=createImage.createImageDom(chrome.runtime.getURL("images/trash.svg"),"trash");

    
    /**save */
    const saveImageDom=createImage.createImageDom(chrome.runtime.getURL("images/download.svg"),'save');
 
    /**pin Note Position */
    const bookMarkIconDom=createImage.createImageDom(chrome.runtime.getURL("images/bookmarks-fill.svg"),'bookmarks');
    bookMarkIconDom.style.visibility='hidden';
    bookMarkIconDom.style.left=left;
    bookMarkIconDom.style.top=top;
    const pinNoteImageDom=createImage.createImageDom(chrome.runtime.getURL("images/pin-angle-fill.svg"),'pin');
    
    
    const bottomBar=document.createElement('div');
    deleteImageDom.classList.add("bi-trash");
    bottomBar.classList.add("Bottom-bar");
    bottomBar.appendChild(micImageDom);
    bottomBar.appendChild(deleteImageDom);
    bottomBar.appendChild(saveImageDom);
    bottomBar.appendChild(pinNoteImageDom);

    noteFieldContent.appendChild(textFiled);
    noteFieldContent.appendChild(bottomBar);
    noteDom.appendChild(noteFieldContent);
    noteDom.appendChild(bookMarkIconDom);
    return noteDom;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
