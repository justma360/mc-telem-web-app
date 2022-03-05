import React, { useEffect } from 'react';
import { createCustomEqual } from 'fast-equals';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';

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

  // useDeepCompareEffect(() => {
  //   if (map) {
  //     map.setOptions(options);
  //   }
  // }, [map, options]);

  useDeepCompareEffectForMaps(() => {
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
  }, [ref, map, center, zoom]);

  return (
    <>
      <div ref={ref} id="map" style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && map) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
        return null;
      })}
      {/* <div ref={ref} id="map" style={{ height: `50%` }} /> */}
    </>
  );
};

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a: any, b: any) => {
  if (
    isLatLngLiteral(a) ||
    a instanceof google.maps.LatLng ||
    isLatLngLiteral(b) ||
    b instanceof google.maps.LatLng
  ) {
    return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
  }

  // TODO extend to other types

  // use fast-equals for other objects
  return deepEqual(a, b);
});

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(callback: React.EffectCallback, dependencies: any[]) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default MarkedMap;
