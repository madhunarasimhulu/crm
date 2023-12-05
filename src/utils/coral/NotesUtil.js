import { Auth, API } from 'aws-amplify';
import { addNote as createNotes } from 'graphql/mutations';
import { name as appName } from '../../../package.json';
import { getNotes as listNotes } from 'graphql/queries';
import { awsConfiguration } from 'aws-configure';

export const createNewNote = async ({ newNote: note, prevNotes = [] }) => {
  const appSync_Config = awsConfiguration[window.location.hostname]?.appSync;
  API.configure(appSync_Config);
  let customer_id = sessionStorage.getItem('pismo-customer-id');
  let account_id = sessionStorage.getItem('pismo-account-id');
  //Validating Note
  if (note.trim() === '') return;
  //Validating the notes characters to 512
  if (note.length > 512) {
    return Promise.reject(`Note should be below 512 Characters only`);
  }
  //Verifying if Customer id present in session Storage
  if (!!!customer_id) {
    return Promise.reject('No Customer id Found');
  }
  //Verifying if account_id No present in session Storage
  if (!!!account_id) {
    return Promise.reject('No Account Id No Found');
  }
  //Getting CRM-User Details
  let { attributes: user } = (await Auth.currentAuthenticatedUser()) ?? {};
  //Not Doing Any Action
  if (!user) {
    return Promise.reject('No Logged in user found');
  }

  let res = await API.graphql({
    query: createNotes,
    variables: {
      account_id,
      customer_id,
      note: JSON.stringify({
        timestamp: new Date(),
        data: note.trim(),
        createdBy: {
          sourceSystem: appName,
          sourceUserId: account_id,
          coral_user: user,
        },
      }),
    },
  }).catch((e) => {
    alert('Unable to Save the Note');
    return null;
  });
  if (res) return Promise.resolve('Note added Successfully');
  return Promise.reject('Unable to add Note');
};

const getNotes = async () => {
  const appSync_Config = awsConfiguration[window.location.hostname]?.appSync;
  API.configure(appSync_Config);
  let customer_id = sessionStorage.getItem('pismo-customer-id');

  try {
    const allNotes = await API.graphql({
      query: listNotes,
      variables: { customer_id: customer_id },
    });
    return allNotes['data']['getNotes'];
  } catch (err) {
    console.log('error: ', err);
    return err;
  }
};

export { getNotes };
