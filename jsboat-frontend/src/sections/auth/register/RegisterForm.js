import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Alert,
  Select,
  OutlinedInput,
  FormControl,
  InputLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import LoadingScreen from '../../../components/LoadingScreen';
// actions
import { registerAction } from '../../../redux/slices/user/userActions';
import { useDispatch, useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      prefrered_states: [],
    },
    validationSchema: RegisterSchema,
    onSubmit: async (data) => {
      dispatch(
        registerAction(data, (error) => {
          if (!error) {
            navigate('/auth/login', { replace: true });
          } else {
            setErrorMessage('Something went wrong! please try again.');
          }
        })
      );
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      {isLoading && <LoadingScreen />}
      {errorMessage && (
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open
          onClose={() => setErrorMessage('')}
          key={'top-right'}
        >
          <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <FormControl sx={{ m: 1 }}>
            <InputLabel id="prefered-state-label">Prefered State</InputLabel>
            <Select
              labelId="prefered-state-label"
              id="prefrered_states"
              multiple
              input={<OutlinedInput label="Prefered State" />}
              {...getFieldProps('prefrered_states')}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={'gujarat'}>Gujarat</MenuItem>
              <MenuItem value={'maharatra'}>Maharatra</MenuItem>
              <MenuItem value={'rajasthan'}>Rajsthan</MenuItem>
            </Select>
          </FormControl>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
