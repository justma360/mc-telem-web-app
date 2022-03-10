import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from '../MapMarker/MapMarker';
import { ArduinoData } from '../../../../types/ArduinoData';

interface Coords {
  lat: number;
  lng: number;
}

interface TrackMCSettings {
  mapCenter?: Coords;
  mapZoom?: number;
  angleZ?: number;
  gpsAngle?: number;
  gpsSpeed?: number;
}

interface Props {
  defaultCenter: Coords;
  defaultZoom: number;
  trackingMC: boolean;
  arduinoData?: ArduinoData;
  center?: number;
  zoom?: number;
  style?: { [key: string]: string };
  children?: JSX.Element;
  onClick?: (value: GoogleMapReact.ClickEventValue) => void;
  // onIdle?: (map: google.maps.Map) => void;
}

const LocationMap = ({
  defaultCenter,
  defaultZoom,
  trackingMC,
  arduinoData,
  center,
  zoom,
  style,
  children,
  onClick,
  ...options
}: Props): JSX.Element => {
  const [trackMC, setTrackMC] = useState<TrackMCSettings | undefined>({ mapZoom: defaultZoom });
  const [mcLocation, setMcLocation] = useState<TrackMCSettings | undefined>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (arduinoData) {
        setMcLocation({
          mapCenter: {
            lat: arduinoData.gpsLat,
            lng: arduinoData.gpsLong,
          },
          angleZ: arduinoData.angleZ,
          gpsSpeed: arduinoData.gpsSpeed,
          gpsAngle: arduinoData.gpsAngle,
        });
      }
      if (trackingMC === true && mcLocation?.mapCenter !== undefined) {
        setTrackMC({
          mapZoom: 14,
          mapCenter: { lat: mcLocation.mapCenter.lat, lng: mcLocation.mapCenter.lng },
        });
      } else {
        setTrackMC({
          mapZoom: 11,
          mapCenter: undefined,
        });
      }
    }, 1);
    return () => clearInterval(intervalId); // This is important
  }, [arduinoData, mcLocation, trackMC, trackingMC]);

  return (
    <>
      <div style={style}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDqVBwLWJmQraO_Zz6PYAHze_vpcRbiQR0' }}
          defaultCenter={defaultCenter}
          defaultZoom={trackMC?.mapZoom}
          zoom={trackMC?.mapZoom}
          center={trackMC?.mapCenter}
          onClick={onClick}
        >
          {mcLocation?.mapCenter?.lat && (
            <MapMarker
              key="Daytona675R"
              lat={mcLocation.mapCenter.lat}
              lng={mcLocation.mapCenter.lng}
              angleZ={mcLocation.angleZ}
              gpsAngle={mcLocation.gpsAngle}
              gpsSpeed={mcLocation.gpsSpeed}
            />
          )}
        </GoogleMapReact>
      </div>
    </>
  );
};

export default LocationMap;
