import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, TextField, Button } from '@mui/material';
// components
import MenuPopover from './MenuPopover';
// Redux
import { logoutAction } from '../redux/slices/user/userActions';
import { useDispatch } from '../redux/store';
import Iconify from './Iconify';

// ----------------------------------------------------------------------

export default function FilterPopover({ applyFilter }) {
  const anchorRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [filterData, setFilterData] = useState({
    state: '',
    city: '',
    place_name: ''
  });
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleChange = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { name, value } = event.target;
    setFilterData({
      ...filterData,
      [name]: value
    });
  }

  const handleApplyFilter = () => {
    applyFilter(filterData);
    handleClose();
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Iconify icon="material-symbols:filter-list-rounded" width={30} height={30} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Stack sx={{ p: 1, my: 2 }} spacing={2}>
          <TextField
            key='state'
            label="State"
            name='state'
            value={filterData.state}
            onChange={handleChange}
          />
          <TextField
            key='city'
            label="City"
            name='city'
            value={filterData.city}
            onChange={handleChange}
          />
          <TextField
            id="place_name"
            label="Place"
            name='place_name'
            value={filterData.place_name}
            onChange={handleChange}
          />
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ m: 1, justifyContent: 'center' }}>
          {/* <Button color='primary' variant='con'>
            Apply filter
          </Button> */}
          <Button variant="contained" onClick={handleApplyFilter}>
            Apply filter
          </Button>
        </MenuItem>
      </MenuPopover>
    </>
  );
}
