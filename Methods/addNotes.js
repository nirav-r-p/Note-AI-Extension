const AsyncImoprt = async (url) => {
    const src = chrome.runtime.getURL(url);
    const ImpoprtModule = await import(src);
    console.log("add note", ImpoprtModule)
    return ImpoprtModule;
}
const createCss = await AsyncImoprt("./utils/createCssLink.js");
const createNote = await AsyncImoprt("./component/createNoteDom.js");
const noteObject = await AsyncImoprt("./data_Model/node.model.js");


export function createNoteElement(
    position,
    url = window.location.pathname,
    content = "",
    id = generateId()

) {
    let noteDOM = document.createElement('high-notes');
    const noteShadowRoot = noteDOM.attachShadow({ mode: 'open' });

    noteDOM.classList.add('note');
    noteDOM.id = id;
    const cssLink = createCss.createCSSDom("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css");
    const noteCSSLink = createCss.createCSSDom(chrome.runtime.getURL('note.css'));

    noteShadowRoot.appendChild(cssLink);
    noteShadowRoot.appendChild(noteCSSLink);

    const noteFildDom = createNote.createNoteDom(position, content);
    console.log("notesElement", noteFildDom);
    noteShadowRoot.appendChild(noteFildDom);
    document.body.appendChild(noteDOM);
    /**speek  */
    //     micImageDom.addEventListener('click',()=>{
    //         console.log("speek ...");
    //     });

    //     /**delete */
    const deleteImageDom = noteFildDom.querySelector('.trash');
    console.log("delete Componenet",deleteImageDom);
    deleteImageDom.addEventListener("click", () => {
        console.log("delete ...",id);
        removeNotes(id)
        return
    });

    //    /**download */
    //     saveImageDom.addEventListener('click',()=>{
    //         console.log("save");
    //     })

    /**pin logic */
    const pinNoteImageDom = noteFildDom.querySelector(".pin");
    const bookMarkIconDom = noteFildDom.querySelector(".bookmarks");
    let pin_note = false
    pinNoteImageDom.addEventListener("click", () => {
        console.log("pin Note....");
        pin_note = !pin_note;
        if (pin_note) {
            pinNoteImageDom.src = chrome.runtime.getURL("images/pin-angle.svg");
        } else {
            pinNoteImageDom.src = chrome.runtime.getURL("images/pin-angle-fill.svg");
        }
        if (!pin_note) {
            noteDOM.addEventListener('pointerout', () => {
                noteFildDom.style.visibility = 'hidden';
                bookMarkIconDom.style.visibility = 'visible';
            })
        } else {
            noteDOM.addEventListener("pointerout", () => {
                noteFildDom.style.visibility = 'visible';
                bookMarkIconDom.style.visibility = 'hidden';
            })
        }
        bookMarkIconDom.addEventListener('click', () => {
            noteFildDom.style.visibility = 'visible';
            bookMarkIconDom.style.visibility = 'hidden';
        })
        noteFildDom.addEventListener('pointerover', () => {
            noteFildDom.style.zIndex = 100004;
        })
        noteFildDom.addEventListener('pointerout', () => {
            noteFildDom.style.zIndex = 10004;
        })

        if (pin_note) {
            noteFildDom.onmousedown = function (e) {
                let shift_x = e.clientX - noteFildDom.getBoundingClientRect().left;
                let shift_y = e.clientY - noteFildDom.getBoundingClientRect().top;
                noteFildDom.style.position = 'absolute';
                moveAt(e.pageX, e.pageY);
                function moveAt(pageX, pageY) {
                    noteFildDom.style.left = pageX - shift_x + 'px';
                    noteFildDom.style.top = pageY - shift_y + 'px';
                }

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }
                document.addEventListener('mousemove', onMouseMove);
                noteFildDom.onmouseup = function () {
                    document.removeEventListener('mousemove', onMouseMove);
                    noteFildDom.onmouseup = null;
                };
                noteFildDom.ondragstart = function () {
                    return false;
                }
            }
        } else {
            noteFildDom.onmousedown = null;
        }
    });





    // console.log(noteObject);
    const contentNote=noteFildDom.querySelector('.note-content');
    noteDOM.addEventListener('pointerout', () => {
        const note = new noteObject.Note(
            id,
            url,
            content=contentNote.innerHTML,
            position
        )
        console.log('call save...',note);
        updateNotes(note)
    })
}



function updateNotes(noteObj) {
    const data = localStorage.getItem('notes');
    
    if (data === null || data == '[]') {
        const noteObjects = data===null?[]:Array.from(JSON.parse(data));
        noteObjects.push(noteObj)
        console.log("call save in DB");
        localStorage.setItem('notes', JSON.stringify(noteObjects));
        return;
    }
    const noteObjectList = Array.from(JSON.parse(data));
    var flag=false;
    console.log('get browser', noteObjectList);
    noteObjectList.forEach((note,index) => {
        if (note.id === noteObj.id) {
            console.log(note,'updated',note.id ,"===" ,noteObj.id);
           const updatedNote= Object.assign(new noteObject.Note(),note);
           console.log("type of obj",typeof updatedNote,updatedNote);
            updatedNote.updateNote(noteObj);
            console.log("upteded nn",updatedNote);
            noteObjectList[index]=updatedNote
            flag=true;
        }
    })
    console.log("afert update",noteObjectList);
    if(!flag){
        noteObjectList.push(noteObj);
    }
    localStorage.setItem('notes', JSON.stringify(noteObjectList));
}
function removeNotes(note) {
    
    const data = localStorage.getItem('notes');
    console.log("call remove",data);
    if (data == null || data == '[]') return
    var noteObject = Array.from(JSON.parse(data));
    noteObject=noteObject.filter((e) => {
        note != e.id
    })
    let notDiv=document.getElementById(note);
    notDiv.remove();
    console.log('get after delete',noteObject);
    localStorage.setItem('notes', JSON.stringify(noteObject));
}

function generateId() {
    var id = Math.floor(Math.random() * 1000);
    return `notes-id-${id}`;
}

