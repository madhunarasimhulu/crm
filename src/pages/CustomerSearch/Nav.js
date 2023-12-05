import CoralLogo from '../../assets/img/coralLogo.png';
import CorolineLogo from '../../assets/img/coral/caroline_logo.svg';
import Profilebutton from './Profile';
import { useLocation } from 'react-router-dom';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { MenuItem, Select } from '@material-ui/core';
import {
  AdminGroups,
  TenantConfig,
  TenantSwitchOverGroups,
} from 'utils/coral/TenantConfig';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCustomerSearchResult } from 'actions';
import TimeoutTimer from './TimeoutTimer';
import RenderIf from 'components/RenderIf';
let hideUrls = ['/'];

export default function Nav() {
  const location = useLocation();
  const closeButtonHide = hideUrls.includes(String(location?.pathname));
  const [tenant, setTenant] = useState('-');
  const [role, setRole] = useState(null);
  const [logo, setLogo] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    if (event.target.value === '-') return;
    setTenant(event.target.value);
    localStorage.setItem('clientId', event.target.value);
    sessionStorage.setItem('clientId', event.target.value);
    dispatch(setCustomerSearchResult([]));
  };

  useEffect(() => {
    // Updating Logo

    let config = {
      [process.env.REACT_CORAL_HOST]: CoralLogo,
      [process.env.REACT_APP_CAROLINE_HOST]: CorolineLogo,
    };
    let logo = config[window.location.host];
    if (logo) setLogo(logo);
    else setLogo(CoralLogo);

    // Updating Logo
    const tenant = localStorage.getItem('clientId');
    // Updating Role
    setRole(sessionStorage.getItem('role'));
    if (tenant && TenantConfig[tenant]?.tenantId !== '') {
      setTenant(tenant);
      sessionStorage.setItem('clientId', tenant);
    } else setTenant('-');
  }, []);

  return (
    <div className="navBar">
      <div className="redBar"></div>
      <div>
        <div
          className="close_btn"
          style={{ visibility: closeButtonHide ? 'hidden' : 'visible' }}
        >
          <CloseOutlinedIcon
            onClick={() => {
              sessionStorage.removeItem('pismo-passport-token');
              sessionStorage.removeItem('pismo-customer-id');
              sessionStorage.removeItem('pismo-document-number');
              sessionStorage.removeItem('pismo-account-id');
              window.location.href = '/';
            }}
          />
        </div>
        <div
          className="logo"
          style={{ borderLeft: closeButtonHide ? '' : '1px solid white' }}
        >
          <img
            src={logo}
            style={{ width: '100%', height: 'auto' }}
            alt="coralLogo"
          />
        </div>
      </div>
      <div className="CS_Tenant">
        <TimeoutTimer hide={closeButtonHide} />
        {closeButtonHide ? (
          <RenderIf
            render={
              AdminGroups.includes(role) ||
              TenantSwitchOverGroups.includes(role)
            }
          >
            <div className="CS_Tenant_select">
              <Select value={tenant} onChange={handleChange}>
                <MenuItem
                  disabled={true}
                  className="CS_TenantSelectItem"
                  value={'-'}
                  key={''}
                >
                  Select A Tenant
                </MenuItem>
                {Object.entries(TenantConfig).map(
                  ([ClientId, ClientDetails]) => {
                    if (ClientDetails?.tenantId === '') return <></>;
                    return (
                      <MenuItem
                        className="CS_TenantSelectItem"
                        value={ClientId}
                        key={ClientId}
                      >
                        {ClientDetails?.name}
                      </MenuItem>
                    );
                  },
                )}
              </Select>
            </div>
          </RenderIf>
        ) : (
          <></>
        )}
        <div className="profileLogo">
          <Profilebutton />
        </div>
      </div>
    </div>
  );
}
