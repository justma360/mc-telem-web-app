import Switch from '@mui/material/Switch';
import { red, green, blue } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Stack from '@mui/material/Stack';

const BootstrapButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#0063cc',
  borderColor: '#0063cc',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: '#0069d9',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    borderColor: '#005cbf',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});

const ConnectedButton = styled(Button)<ButtonProps>(({ theme }) => ({
  font: '-apple-system',
  color: theme.palette.getContrastText(green[500]),
  backgroundColor: green[500],
  '&:hover': {
    backgroundColor: green[700],
  },
}));

const DisconnectedButton = styled(Button)<ButtonProps>(({ theme }) => ({
  font: '-apple-system',
  color: theme.palette.getContrastText(red[500]),
  backgroundColor: red[500],
  '&:hover': {
    backgroundColor: red[700],
  },
}));

export { DisconnectedButton, ConnectedButton };
