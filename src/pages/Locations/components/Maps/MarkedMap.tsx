import React, { useEffect } from 'react';
import { createCustomEqual } from 'fast-equals';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Marker } from 'google-maps-react';

interface Props extends google.maps.MapOptions {
  center: { lat: number; lng: number };
  zoom: number;
  style?: { [key: string]: string };
  children?: JSX.Element;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

const MarkedMap = ({
  center,
  zoom,
  style,
  children,
  onClick,
  onIdle,
  ...options
}: Props): JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  useDeepCompareEffect(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) => google.maps.event.clearListeners(map, eventName));

      if (onClick) {
        map.addListener('click', onClick);
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { center, zoom }));
    }
    console.log(map?.getBounds());
  }, [ref, map, center, zoom]);

  return (
    <>
      {/* <div ref={ref} id="map" style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && map) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
        return null;
      })} */}
      <div
        ref={ref}
        id="map"
        style={{ height: '50%', width: '95%', position: 'relative', padding: '1px' }}
      >
        <Marker
          position={{ lat: 22.462746, lng: 114.198723 }}
          title="The marker`s title will appear as a tooltip."
        />
      </div>
      <h1>hihi whatsup</h1>
    </>
  );
};

export default MarkedMap;
