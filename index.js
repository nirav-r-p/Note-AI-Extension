// let startActionModule
(async () => {
    const sec = chrome.runtime.getURL("./utils/startJS.js");
    const startAction = await import(sec);
    console.log(startAction.default);
    startAction.default();
    const sec1 = chrome.runtime.getURL("./Methods/addNotes.js");
    const createNote = await import(sec1);
    console.log("load Notes...");
    const data = localStorage.getItem('notes');
    if (!data) return;
    const url = window.location.pathname;
    const noteCollection = JSON.parse(data);
    noteCollection.forEach((note) => {
        if (url == note.url) {
            createNote.createNoteElement(note.position, note.url, note.content, note.id)
        }
    })
})();






