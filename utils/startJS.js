const AsyncImoprt = async (url) => {
    const src = chrome.runtime.getURL(url);
    const ImpoprtModule = await import(src);
    console.log(ImpoprtModule.default);
    return ImpoprtModule;
}
const createNote=await AsyncImoprt("./Methods/addNotes.js");

const createButton=()=>{
    const topDiv=document.createElement('div');
    topDiv.style.position='absolute';
    topDiv.style.width='fit-content';
    const shadowRoot=topDiv.attachShadow({mode:'open'});

    const cssLink=document.createElement('link');
    cssLink.href = chrome.runtime.getURL("note.css");
    cssLink.rel = "stylesheet";
    shadowRoot.appendChild(cssLink);
    
    const customContext=document.createElement('div');
    const addNoteDiv=document.createElement('div');
    const addSpeekDiv=document.createElement('div');
    const addNoteIcon=document.createElement('img');
    const addSpeekIcon=document.createElement('img');
    addNoteIcon.style.height='30px';
    addNoteIcon.style.cursor='pointer';
    addNoteIcon.style.zIndex="100047";
    addSpeekIcon.style.height='40px';
    addSpeekIcon.style.cursor='pointer';
    addSpeekIcon.style.zIndex="100047";
    addNoteIcon.src=chrome.runtime.getURL("images/add_icon-removebg-preview.png");
    addSpeekIcon.src=chrome.runtime.getURL("images/text-speech.png")
    customContext.classList.add('custom');
    addNoteDiv.classList.add('addnotebtn');
    addSpeekDiv.classList.add('addspeekbtn');

    
    addNoteDiv.appendChild(addNoteIcon);
    addSpeekDiv.appendChild(addSpeekIcon);
    customContext.appendChild(addNoteDiv);
    customContext.appendChild(addSpeekDiv);
    shadowRoot.appendChild(customContext);
    return {topDiv,addSpeekIcon,addNoteIcon,customContext};
}


export default function startAction(){
    const {topDiv,addSpeekIcon,addNoteIcon,customContext} = createButton();
    let top,left
    window.addEventListener('contextmenu', (e) => {
       
       topDiv.style.top=e.clientY+'px';
       topDiv.style.left=e.clientX-85+'px';
       top=e.pageY+'px';
       left=e.pageX+'px';
        document.body.appendChild(topDiv)
    })
    console.log(topDiv)
    console.log(customContext); 
    console.log(addNoteIcon);
    addNoteIcon.addEventListener("click", () => {
        console.log("add Notes")
        console.log(left, top);
        createNote.createNoteElement({top,left});
    })
   addSpeekIcon.addEventListener("click",()=>{
    console.log("speek");
   })
    customContext.addEventListener('pointerout', () => {
        document.body.removeChild(topDiv);
    })
}
