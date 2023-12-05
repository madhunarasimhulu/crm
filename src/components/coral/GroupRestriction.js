import { LinearProgress } from '@material-ui/core';
import { Auth, Hub } from 'aws-amplify';
import React from 'react';
import { AdminGroups, TenantConfig } from 'utils/coral/TenantConfig';
import NoGroupsFound from './Aws-UI/NoGroupsFound';
import { cloneDeep } from 'lodash';

export default function GroupRestriction({ children }) {
  let [group, setGroup] = React.useState(null);
  let [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Hub.listen('auth', (data) => {
      const { payload } = data;
      if (payload.event === 'signOut') {
        sessionStorage.clear();
        localStorage.clear();
      }
      if (payload.event === 'signIn') window.location.replace('/');
    });
  }, []);

  React.useEffect(() => {
    (async function () {
      const user = await Auth.currentAuthenticatedUser();
      try {
        group = cloneDeep(
          user?.signInUserSession?.accessToken?.payload?.['cognito:groups'],
        );
        if (Array.isArray(group) && group.length > 0) {
          let [clientId] = group;
          // Setting into SessionStorage LoggedIn Group
          sessionStorage.setItem('role', clientId);
          // Splitting the user group and taking first element from array as client id
          try {
            clientId = String(clientId).split('|')[0];
          } catch (error) {
            clientId = null;
          }

          if (
            !localStorage.getItem('clientId') &&
            !AdminGroups.includes(clientId)
          )
            localStorage.setItem('clientId', clientId);
        }
      } catch (error) {
        group = null;
      }
      setLoading(false);
      setGroup(group);
    })();
  }, []);

  if (isLoading) return <LinearProgress />;
  if (group && Array.isArray(group) && !TenantConfig.hasOwnProperty(group[0]))
    return <NoGroupsFound msg={`"${group[0]}"  Role Not Found`} />;
  if (group) return children;
  else return <NoGroupsFound msg={`No Roles Found Contact Administrator`} />;
}
