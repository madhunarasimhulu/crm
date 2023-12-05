import React, { useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Avatar, Grid, ListItemIcon, Typography } from '@material-ui/core';

//Svgs
import logoutIcon from '../../assets/icons/coral/Icons_LOG OUT.svg';
import tenant_id_icon from '../../assets/icons/coral/tenant_id_icon.svg';
import ProfileIcon from '../../assets/icons/coral/Icons_PROFILE.svg';
import ProfileIcon_orange from '../../assets/icons/coral/Profile_iocn_orange.svg';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import './CustomerSearch.scss';
import PinDropIcon from '@material-ui/icons/PinDrop';

import { version } from './../../../package.json';
import { TenantConfig } from 'utils/coral/TenantConfig';

export default function ProfileButton() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState({ name: '', email: '' });
  const [tenant, setTenant] = React.useState(null);
  const open = Boolean(anchorEl);

  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    Auth.currentUserInfo().then(({ attributes }) => {
      setUserInfo({
        name: attributes?.name,
        email: attributes?.email,
        initial: getInitals(attributes?.name),
      });
    });
  }, []);

  const getTenant = () => {
    const tenant = localStorage.getItem('clientId');
    setTenant(TenantConfig[tenant]);
  };

  const getInitals = (name) => {
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let initials = [...name.matchAll(rgx)] || [];

    initials = (
      (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase();
    return initials;
  };

  useEffect(() => {
    // Get Tenant
    getTenant();
  });

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="profileIconButton"
      >
        <div>
          <img
            src={!open ? ProfileIcon : ProfileIcon_orange}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ horizontal: 'center' }}
        PaperProps={{
          style: {
            alignContent: 'center',
            // maxHeight: ITEM_HEIGHT * 4.5,
            width: '300px',
            background: '#0B749C',
            color: 'white',
            padding: 20,
          },
        }}
      >
        <Grid container item style={{ padding: 0 }}>
          <Grid item container justifyContent="space-between" direction="row">
            <Grid item sm={2} md={2} lg={2} style={{ padding: 5 }}>
              <Avatar
                style={{
                  background: '#F4DFCC',
                  color: '#FE6F61',
                  fontWeight: '700',
                }}
              >
                {userInfo?.initial}
              </Avatar>
            </Grid>
            <Grid
              item
              sm={10}
              md={10}
              lg={10}
              container
              direction="column"
              justifyContent="center"
              style={{ paddingLeft: 10 }}
            >
              <Grid
                item
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                {userInfo.name}
              </Grid>
              <Grid
                item
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                }}
              >
                {userInfo.email}
              </Grid>
            </Grid>
          </Grid>
          <Grid item container className="PROFILE">
            <Item
              title={'Profile'}
              Icon={<img src={ProfileIcon} style={{ width: 30, height: 30 }} />}
            />
            <Item
              title={tenant?.name || 'Tenant ID'}
              Icon={
                <img
                  src={tenant_id_icon}
                  alt="icon"
                  style={{ width: 30, height: 30 }}
                />
              }
            />
            <Item
              title={'Log Out'}
              Icon={
                <img
                  src={logoutIcon}
                  alt="Logo"
                  style={{ width: 30, height: 30 }}
                />
              }
              handleClick={async () => {
                await Auth.signOut();
                localStorage.clear();
                history.push('/#');
              }}
            />
          </Grid>
          <Grid item container direction="row" justifyContent="flex-end">
            <Grid item>Ver {version}</Grid>
          </Grid>
        </Grid>
      </Menu>
    </div>
  );
}

function Item({ title, Icon, handleClick }) {
  return (
    <MenuItem style={{ width: '100%' }} onClick={handleClick}>
      <ListItemIcon>{Icon}</ListItemIcon>
      <Typography variant="body2">{title}</Typography>
    </MenuItem>
  );
}
