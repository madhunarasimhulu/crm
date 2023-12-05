import { ClickAwayListener, Grid, IconButton } from '@material-ui/core';
import './Notes.scss';

import NotesIcon from '../../../assets/icons/coral/Notes/NotesnotesIcon.svg';
import { useEffect, useRef, useState } from 'react';
import NewNote from './NewNote';
import NotesList from './NotesList';
import { API, graphqlOperation } from 'aws-amplify';
import { getNotes } from 'utils/coral/NotesUtil';
import { useDispatch } from 'react-redux';
import { showToast } from 'actions';
import { awsConfiguration } from 'aws-configure';
import { onAddNote } from 'graphql/subscriptions';

export default function Notes() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const listRef = useRef(null);

  const dispatch = useDispatch();

  let showMessage = (message, style = 'error') =>
    dispatch(
      showToast({
        message,
        style,
      }),
    );

  let customer_id = sessionStorage.getItem('pismo-customer-id');
  let filter = {
    customer_id,
  };

  useEffect(() => {
    // Configuring API
    const appSync_Config = awsConfiguration[window.location.hostname]?.appSync;
    API.configure(appSync_Config);
    //First Getting Notes list
    fetNotes();
    //First Getting Notes list
    let onCreateNoteSubscription = API.graphql(
      graphqlOperation(onAddNote, filter),
    ).subscribe({
      next: ({ provider, value }) => {
        let note = value?.data?.onAddNote;
        setNotes((prev) => [...prev, note]);
      },
      error: (error) => console.warn(error),
    });

    return () => {
      onCreateNoteSubscription.unsubscribe();
    };
  }, []);

  const fetNotes = async () => {
    let allNotes = await getNotes().catch((e) => {
      showMessage(e?.message);
      return null;
    });
    if (allNotes) setNotes(allNotes);
  };

  return (
    <div className="note-icon-fixed ">
      <IconButton onClick={() => setOpen(true)}>
        <img src={NotesIcon} alt="Notes Icon" />
      </IconButton>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => setOpen(false)}
      >
        <div className={`notes-drawer ${open && 'open'}`}>
          <Grid item className="notes-Heading">
            Notes:
          </Grid>
          <Grid item className="notes-list" ref={listRef}>
            <NotesList
              notes={notes}
              updateRef={() => {
                setTimeout(() => {
                  listRef.current.scrollTop = listRef?.current?.scrollHeight;
                }, 200);
              }}
            />
          </Grid>
          <NewNote open={open} />
        </div>
      </ClickAwayListener>
    </div>
  );
}
