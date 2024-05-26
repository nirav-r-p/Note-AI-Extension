class Note{

    constructor(id,url,content="",position){
        this.id=id;
        this.url=url;
        this.content=content;
        this.position=position;
    };
    updateNote(note) {
        this.content=note.content;
        this.position=note.position;
    }
}

export {Note};
