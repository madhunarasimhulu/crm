import { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
// import config from './aws-exports';
import citiesData from './in.json';
import GoogleMapReact from 'google-map-react';

import moment from 'moment';
import { cloneDeep } from 'lodash';
import Marker from './Marker';
import { listNetworkAuthTTLS } from './graphql/queries';
// import { onCreateNetworkAuthTTL } from './graphql/subscriptions';
import Reports from '../Reports';
import { useDispatch } from 'react-redux';
import { showToast } from 'actions';
import RenderIfAdmin from '../RenderIfAdmin';

//Dummy Markers
const initialRefreshTime = 15 * 1000;

export default function Map() {
  const [serverTransactions, setServerTransactions] = useState([]);
  const [trns, setTrns] = useState({});
  const [mode, setMode] = useState('MAP');
  const [otherTrns, setOtherTrns] = useState([]);
  const [delTrns, setDelTrns] = useState([]);
  const [refreshTime, setRefreshTime] = useState(null);
  const dispatch = useDispatch();

  const showMessage = (message) =>
    dispatch(
      showToast({
        message,
        style: 'error',
      }),
    );

  let last30min = moment()
    .subtract(moment.duration({ minutes: 30 }))
    .toISOString();

  let filter = { filter: { timestamp: { ge: last30min } } };

  useEffect(() => {
    // API.configure(config);
    fetchTransactions();
    setRefreshTime(initialRefreshTime);
    //----------This is commented code for Subscription----------------
    // API.graphql(graphqlOperation(listNetworkAuthTTLS, filter))
    //   .then((res) => {
    //     if (res?.data?.listNetworkAuthTTLS?.items)
    //       setServerTransactions(res?.data?.listNetworkAuthTTLS?.items);
    //   })
    //   .catch((e) => {
    //     console.log(e, 'err');
    //   });

    // API.graphql(graphqlOperation(onCreateNetworkAuthTTL)).subscribe({
    //   next: ({ provider, value }) => {
    //     let trn = value?.data?.onCreateNetworkAuthTTL;
    //     setServerTransactions((prev) => [...prev, trn]);
    //   },
    //   error: (error) => console.log(error, 'oncreate error'),
    // });
  }, []);

  useEffect(() => {
    if (!refreshTime) return;
    let TimeOut;

    TimeOut = setTimeout(() => {
      API.graphql(graphqlOperation(listNetworkAuthTTLS, filter))
        .then((res) => {
          if (res?.data?.listNetworkAuthTTLS?.items)
            setServerTransactions(res?.data?.listNetworkAuthTTLS?.items);
        })
        .catch((e) => {
          showMessage('Unable To Fetch Transactions');
        });
    }, refreshTime);

    return () => {
      clearTimeout(TimeOut);
    };
  }, [refreshTime, serverTransactions]);

  const fetchTransactions = () => {
    let timeout;
    API.graphql(graphqlOperation(listNetworkAuthTTLS, filter))
      .then((res) => {
        if (res?.data?.listNetworkAuthTTLS?.items) {
          setServerTransactions(res?.data?.listNetworkAuthTTLS?.items);
        }
      })
      .catch((e) => {
        showMessage('Unable To Fetch Transactions');
      });

    return timeout;
  };

  // const removeBefore30minTransactions = () => {
  //   let sTrns = cloneDeep(serverTransactions);
  //   let last30min = moment().subtract(moment.duration({ minutes: 30 }));
  //   sTrns = sTrns.filter((x) => {
  //     return moment(x?.timestamp).isAfter(moment(last30min));
  //   });
  //   setServerTransactions([...sTrns]);
  // };

  const getCityLatLong = (city) => {
    return citiesData.find(
      (x) =>
        String(x.city).trim().toLocaleLowerCase() ===
        String(city).trim().toLocaleLowerCase(),
    );
  };

  useEffect(() => {
    // Converting Stringified JSON
    let othTrns = [];
    let serverTransactionsDelIndexs = [];
    let cTrans = serverTransactions.reduce((prev, cur, index) => {
      try {
        let parsedJson = JSON.parse(cur?.data);
        //Now Getting Lat & Long of city
        let city = getCityLatLong(parsedJson?.merchant_city);
        let authorization_category = parsedJson?.authorization_category;
        if (!!city) {
          //If city found then only preparing obj and pushing
          parsedJson.city_data = city;
          if (authorization_category !== 'CONFIRMATION') prev.push(parsedJson);
        } else {
          othTrns.push(cloneDeep(serverTransactions[index]));
          serverTransactionsDelIndexs.push(index);
        }
      } catch (error) {}
      return prev;
    }, []);

    //Now Grouping cities
    let key = 'city';
    let grouped = cTrans.reduce((prev, cur) => {
      (prev[cur['city_data'][key]] = prev[cur['city_data'][key]] || []).push(
        cur,
      );
      return prev;
    }, {});

    setTrns(grouped);
    setOtherTrns(othTrns);
    setDelTrns(serverTransactionsDelIndexs);

    // let timer = setInterval(() => {
    //   removeBefore30minTransactions();
    // }, 1000 * 60);
    // return () => {
    //   clearInterval(timer);
    // };
  }, [serverTransactions]);

  const defaultProps = {
    center: {
      lat: 23.192882,
      lng: 77.318313,
    },
    zoom: 4.5,
  };

  const highlitIndia = ({ map, maps }) => {
    map.data.setStyle({
      fillColor: 'green',
      strokeWeight: 1,
    });
    map.data.loadGeoJson(
      'https://raw.githubusercontent.com/datameet/maps/master/Country/india-soi.geojson',
    );
  };

  const getUpdatedTrns = () => {
    let serverTransactionsClone = cloneDeep(serverTransactions);
    serverTransactionsClone = serverTransactionsClone.filter((trn, i) => {
      return !delTrns.includes(i);
    });
    return serverTransactionsClone;
  };

  return (
    <RenderIfAdmin>
      <div style={{ height: 'calc(100vh - 3rem)' }}>
        <div
          style={{
            display: 'flex',
            position: 'fixed',
            left: '50%',
            top: 10,
          }}
        >
          <button
            onClick={() => {
              setMode((prev) => (prev === 'MAP' ? 'List' : 'MAP'));
            }}
            style={{
              background: 'red',
              color: '#214d72',
              borderRadius: 5,
              border: 'none',
              zIndex: 999999,
              width: 100,
              height: 30,
            }}
          >
            {mode === 'MAP' ? 'Show List' : 'Show Map'}
          </button>
        </div>
        {mode === 'MAP' ? (
          <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals={true}
            bootstrapURLKeys={{
              key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
              language: 'en',
              region: 'India',
              libraries: ['places', 'geometry', 'drawing', 'visualization'],
            }}
            options={{
              mapTypeId: 'roadmap',
              overviewMapControl: true,
              overviewMapControlOptions: {
                opened: false,
              },
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            onGoogleApiLoaded={highlitIndia}
          >
            {Object.entries(trns).map(([key, val], i) => {
              return (
                <Marker
                  key={i}
                  city={key}
                  transactions={val}
                  lat={val[0]?.city_data?.lat}
                  lng={val[0]?.city_data?.lng}
                />
              );
            })}
          </GoogleMapReact>
        ) : (
          <Reports trns={getUpdatedTrns()} otherTrns={otherTrns} />
        )}
      </div>
    </RenderIfAdmin>
  );
}
