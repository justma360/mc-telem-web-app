import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import styles from 'style.module.scss';
import { relative } from 'path';
import pin from './pin.png';
import motorcyclePin from './motorcycleSidePin.png';

interface Props {
  lat: number | undefined;
  lng: number | undefined;
  angleZ?: number;
  gpsAngle?: number;
  gpsSpeed?: number;
  key?: string;
}

interface markerStyleProp {
  top?: string;
  left?: string;
  transform?: string;
}

const MapMarker = ({ lat, lng, angleZ, gpsAngle, gpsSpeed, ...restProps }: Props): JSX.Element => {
  const [clickedMarker, setClickedMarker] = useState<boolean>(false);
  const [inHover, setHover] = useState<boolean>(false);

  let markerStyle: markerStyleProp = {
    top: '100%',
    left: '50%',
    transform: `translate(-50%, -100%) rotate(${angleZ}deg)`,
  };

  const handleMarkerClick = () => {
    setClickedMarker(!clickedMarker);
    setHover(false);
  };

  const handleHover = () => {
    if (clickedMarker !== true) {
      setHover(true);
    } else {
      setHover(false);
    }
  };

  if (gpsAngle && gpsSpeed && gpsSpeed > 10) {
    markerStyle = { transform: `translate(-50%, -100%) rotate(${gpsAngle}deg)` };
    if (gpsAngle > 180) {
      markerStyle = {
        transform: `translate(-50%, -100%) rotate(${gpsAngle}deg) scaleX(-1)`,
      };
    }
  } else if (angleZ && angleZ > 180) {
    markerStyle = {
      transform: `translate(-50%, -100%) rotate(${angleZ}deg) scaleX(-1)`,
    };
  }

  return (
    <>
      <div
        className="MapMarkers"
        onMouseEnter={handleHover}
        onMouseLeave={() => setHover(false)}
        onClick={handleMarkerClick}
        key={restProps.key}
      >
        <img style={markerStyle} src={motorcyclePin} alt="mcPin" width={22} height={39} />
        {/* <img style={markerStyle} src={pin} alt="pin" /> */}
        {clickedMarker && (
          <Box
            sx={{
              position: 'relative',
              top: '-2rem',
              width: 250,
              height: 50,
              backgroundColor: 'white',
              border: '1px solid lightgray',
              padding: '2px',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'white',
                opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
            <Typography>
              {`Position: ${lat},${lng?.toPrecision(9)}`}
              <br />
              {`Speed: ${gpsSpeed}kmph`}
            </Typography>
          </Box>
        )}
        {inHover && (
          <Box
            sx={{
              position: 'relative',
              top: '-2rem',
              width: 140,
              height: 25,
              backgroundColor: 'white',
              border: '1px solid lightgray',
              opacity: [0.9, 0.8, 0.7],
              padding: '2px',
              borderRadius: 2,
            }}
          >
            <Typography>{`Speed: ${gpsSpeed}kmph`}</Typography>
          </Box>
        )}
      </div>
    </>
  );
};

export default MapMarker;
