import React from 'react';
import NotePannel from './NotePannel';

export default function NotesList(props) {
  let [notes, setNotes] = React.useState([]);

  //Modifing the logic

  React.useEffect(() => {
    props.updateRef();
    props?.notes?.length > 0 && setNotes(props.notes);
  }, [props]);

  return (
    <>
      {notes?.map((note, i) => {
        return (
          <NotePannel isLastEle={i + 1 === notes.length} key={i} note={note} />
        );
      })}
    </>
  );
}
