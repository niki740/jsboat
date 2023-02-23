import { useEffect, useState } from 'react';
import io from 'socket.io-client';
// @mui
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from '@mui/material';
// components
import Page from '../components/Page';
import FilterPopover from '../components/FilterPopover';
// redux
import { dispatch, useDispatch, useSelector } from '../redux/store';
import Iconify from '../components/Iconify';
// service
import PlaceService from '../services/PlacesService';
import { setUserData } from '../redux/slices/user/userSlice';

const socket = io('http://localhost:3007/');

/* eslint-disable no-debugger */

// ----------------------------------------------------------------------

const columns = [
  { id: 'place_name', label: 'Place' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  {
    id: 'liked_count',
    label: 'Liks',
  },
  {
    id: 'popularity',
    label: 'Popularity',
  },
  {
    id: 'reaction',
    label: 'Reaction',
  },
];

export default function DashboardApp() {
  const { user } = useSelector((state) => state.user);
  const [rows, setRows] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [isConnected, setIsConnected] = useState(socket.connected);
  // socket setup
  useEffect(() => {
    socket.on('connection', () => {
      console.log('connect');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('like_response', (data) => {
      const updatedRecord = JSON.parse(data);
      const updatedRows = rows.map((place) => (updatedRecord.id === place.id ? updatedRecord : place));
      setRows(updatedRows);
      dispatch(setUserData(updatedRows));
      socket.emit('like_response', updatedRows);
    });
    return () => {
      socket.off('connect');
    };
  }, [rows, socket]);

  const emitLikeMessage = () => {
    socket.emit('like');
  };

  useEffect(async () => {
    const response = await PlaceService.getPlacesData(filterData);
    if (response?.data?.data) {
      setRows(response.data.data);
    }
  }, [filterData]);

  const applyFilter = (filterData) => {
    setFilterData(filterData);
  };

  const handleLike = async (isLiked, placeData) => {
    const response = await PlaceService.likePlace(!isLiked, placeData.id);
    emitLikeMessage();
    const updatedData = response.data.data;
    const updatedRows = rows.map((place) => (placeData.id === place.id ? updatedData : place));
    setRows(updatedRows);
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <FilterPopover applyFilter={applyFilter} />
        </Box>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} style={{ backgroundColor: 'white' }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row) => {
                    const isLiked = user?.liked_places?.includes(row.id);
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columns.map((column) => {
                          const value = row[column.id];

                          return column.id === 'reaction' ? (
                            <TableCell key={column.id}>
                              <Button>
                                <Iconify
                                  icon={isLiked ? 'icon-park-solid:like' : 'icon-park-outline:like'}
                                  width={20}
                                  height={20}
                                  onClick={() => handleLike(isLiked, row)}
                                />
                              </Button>
                            </TableCell>
                          ) : (
                            <TableCell key={column.id}>{value}</TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : (
                  <Typography variant="body1">No records found</Typography>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Page>
  );
}
