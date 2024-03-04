const AsyncImoprt = async (url) => {
    const src = chrome.runtime.getURL(url);
    const ImpoprtModule = await import(src);
    console.log("add note", ImpoprtModule)
    return ImpoprtModule;
}
const createCss = await AsyncImoprt("./utils/createCssLink.js");
const createNote = await AsyncImoprt("./component/createNoteDom.js");
const noteObject=await AsyncImoprt("./data_Model/node.model.js");


export function createNoteElement(
    position,
    url = "",
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
    //     deleteImageDom.addEventListener("click",()=>{
    //         console.log("delete ...");
    //    });

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
 
    // noteDOM.addEventListener('pointerout',()=>{
    //     const note=new noteObject.Note(
    //         id,
    //         url,
    //         content,
    //         position
    //     )
    //     updateNote(note)
    // })
}

// function updateNote(note_id){
//     const data = localStorage.getItem('notes');
//     if (data === null) return;
//     const noteObject = JSON.parse(data);
//     noteObject.forEach((note)=>{
//         if(note.id===note_id){

//         }
//     })
// }
function generateId() {
    var id = Math.floor(Math.random() * 1000);
    return `notes-id-${id}`;
}

