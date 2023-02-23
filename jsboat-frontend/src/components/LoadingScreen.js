import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Backdrop, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

export default function LoadingScreen() {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
