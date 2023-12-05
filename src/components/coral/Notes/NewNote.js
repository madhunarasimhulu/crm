import { Grid, IconButton } from '@material-ui/core';
import { Loader } from 'components/commons';
import { useEffect, useState } from 'react';
import saveNoteIcon from '../../../assets/icons/coral/Notes/SaveNote.svg';
import { useDispatch } from 'react-redux';
import { showToast } from 'actions';
import { createNewNote } from 'utils/coral/NotesUtil';

export default function NewNote({ open }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  let showMessage = (message, style = 'error') =>
    dispatch(
      showToast({
        message,
        style,
      }),
    );

  const addNote = async () => {
    setLoading(true);
    let resp = await createNewNote({
      newNote: note,
    }).catch((e) => {
      showMessage(e?.message);
      return null;
    });
    setLoading(false);
    if (resp) setNote('');
  };

  useEffect(() => {
    if (!open) addNote();
  }, [open]);

  return (
    <Grid item className="notes-txt-left notes-new-note">
      <textarea
        value={note}
        autoFocus={true}
        onChange={(e) => setNote(e.target.value)}
        className="notes-content-textarea"
      ></textarea>
      <Grid direction="row" item container justifyContent="space-between">
        <div className="notes-len-limit">{`${note.length} / 512`}</div>
        <div className="notes-icon">
          {/* loader */}
          {loading ? (
            <div className="saveNoteIcon-loader">
              <Loader color="white" />
            </div>
          ) : (
            <IconButton onClick={addNote}>
              <img
                src={saveNoteIcon}
                alt="saveNoteIcon"
                className="saveNoteIcon"
              />
            </IconButton>
          )}
        </div>
      </Grid>
    </Grid>
  );
}
