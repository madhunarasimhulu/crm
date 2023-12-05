import React from 'react';
import { AdminGroups } from 'utils/coral/TenantConfig';

export default function RenderIfAdmin({ children }) {
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const loggedInRole = sessionStorage.getItem('role');
    setIsAdmin(AdminGroups.includes(loggedInRole));
  });

  if (isAdmin) return children;
  return <></>;
}
