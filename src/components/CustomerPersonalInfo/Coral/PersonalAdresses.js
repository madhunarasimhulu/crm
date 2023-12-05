import { useEffect, useState } from 'react';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Button } from '@material-ui/core';
export default function PersonalAdresses({ addresses }) {
  const [address, setAddress] = useState([]);

  useEffect(() => {
    if (!addresses || !Array.isArray(addresses)) return;
    let convertedAddress = addresses.map((obj) => {
      return [
        obj?.address,
        obj?.number,
        obj?.complementary_address,
        obj?.neighborhood,
        obj?.city,
        obj?.state,
        obj?.country,
        obj?.zipcode,
      ].join(', ');
    });
    setAddress(convertedAddress);
  }, [addresses]);

  return (
    <>
      {address.map((add, i) => {
        return (
          <div key={i} className="Cust_address">
            <h3>Address</h3>
            <div className="Cust_address_bar">
              <div className="cust_address_icon_bar">
                <Button className="custPhones_address_icon_button">
                  <LocationOnIcon className="custPhones_address_icon" />
                </Button>
              </div>
              <div className="custPhones_address">{add}.</div>
            </div>
          </div>
        );
      })}
    </>
  );
}
