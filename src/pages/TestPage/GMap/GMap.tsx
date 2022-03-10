import React, { memo } from 'react';
import { Map, GoogleApiWrapper, Marker, IMapProps } from 'google-maps-react';

// const markerStyle = {
//   position: 'absolute',
//   top: '100%',
//   left: '50%',
//   transform: 'translate(-50%, -100%)',
// };

// const GMap = ({ center, zoom, style, children, onClick, ...options }: Props): JSX.Element => {
//   // const points = [
//   //   { lat: 42.02, lng: -77.01 },
//   //   { lat: 42.03, lng: -77.02 },
//   //   { lat: 41.03, lng: -77.04 },
//   //   { lat: 42.05, lng: -77.02 },
//   // ];
//   // const bounds = new google.maps.LatLngBounds();
//   // for (let i = 0; i < points.length; i++) {
//   //   bounds.extend(points[i]);
//   // }
//   const MarkersC = ({ text }) => <div className="contact">{text}</div>;

//   return (
//     // Important! Always set the container height explicitly
//     <>
//       <div style={{ height: '50vh', width: '100%' }}>
//         <Map
//           key={{ key: 'AIzaSyDqVBwLWJmQraO_Zz6PYAHze_vpcRbiQR0' }}
//           defaultCenter={center}
//           defaultZoom={zoom}
//           onClick={onClick}
//         />
//         {/* <Link to="/hello" key="hello" lat={center.lat} lng={center.lng}>
//           <img src={pin} alt="pin" />
//         </Link> */}
//       </div>
//     </>
//   );
// };

// const MapContainer = ({
//   // center,
//   // zoom,
//   // style,
//   // children,
//   // ...options,
//   // google,
// }: Props): JSX.Element => {
//   return (
//     <Map google={google} initialCenter={center} style={{ height: '50vh', width: '100%' }}>
//       {/* <Marker onClick={this.onMarkerClick} name="Current location" /> */}
//     </Map>
//   );
// };

// Deep level container
const MapContainer = memo(({ center, zoom, onClick, ...restProps }: IMapProps): JSX.Element => {
  return (
    <>
      <Map
        {...restProps}
        google={google}
        initialCenter={center}
        zoom={zoom}
        onClick={onClick}
        style={{ height: '50%', width: '95%', position: 'relative', padding: '1px' }}
        key="hello"
      >
        <Marker
          position={{ lat: 22.462746, lng: 114.198723 }}
          title="The marker`s title will appear as a tooltip."
        />
      </Map>
    </>
  );
});
MapContainer.displayName = 'LocationMap';

// Upper lever wrapper
interface Props {
  center: { lat: number; lng: number };
  zoom: number;
  style?: { [key: string]: string };
  onClick?: (e: any) => void; // Any because GMaps is weird
}

const GMap = (wrapperProps: Props): JSX.Element => {
  const ApiWrapper = GoogleApiWrapper({
    apiKey: 'AIzaSyDqVBwLWJmQraO_Zz6PYAHze_vpcRbiQR0',
  })(MapContainer);

  return (
    <>
      <ApiWrapper {...wrapperProps} key="hello1" />
    </>
  );
};

export default GMap;
