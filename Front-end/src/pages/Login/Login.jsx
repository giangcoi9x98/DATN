/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, memo } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  CssBaseline,
  Link,
  Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { Facebook as FacebookIcon } from '@material-ui/icons';
import { COLORS, SIZETYPE } from '../../constants';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import noti from '../../components/Notification';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '5%',
    zIndex: 1,
    paddingBottom: 80,
    paddingTop: 80,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: SIZETYPE.large,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  box: {
    margin: SIZETYPE.small,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    height: '100%',
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  icon_fb: {
    transform: ' scale(1.8)',
    marginRight: SIZETYPE.large,
    color: '#1976d2',
  },
  icon_ins: {
    maxHeight: SIZETYPE.icon,
    maxWidth: SIZETYPE.icon,
    marginLeft: SIZETYPE.large,
    color: '#f64f59',
  },
  submit: {
    borderRadius: SIZETYPE.large,
    background: COLORS.background_gradiant,
    margin: theme.spacing(3, 0, 2),
    fontFamily: '"Quicksand", Verdana, sans-serif;',
    fontSize: 'inherit',
  },
  wraper: {
    zIndex: 1,
    display: 'flex',
    borderRadius: SIZETYPE.large,
    background: COLORS.background_gradiant,
  },
}));

const SignIn = memo((props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t, i18n } = useTranslation('common');
  const lang = useSelector((state) => state.lang);

  useEffect(() => {
    async function changeLang() {
      await i18n.changeLanguage(lang.lang);
    }
    changeLang();
  }, [lang, i18n]);

  const loginHandler = async (email, password) => {
    const res = await api.auth.logIn({
      email,
      password,
    });

    if (res.status) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('refresh_token', res.data.data.refresh_token);
      noti.success('Login success', 'success')
      window.location = '/';
    } else {
      noti.error(res?.data?.data[0].message, 'error');
    }
  };
  const classes = useStyles();
  return (
    <div>
      <Container
        component='main'
        maxWidth='sm'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <CssBaseline />

        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
          <div
            style={{
              backgroundImage: `url('/logo192.svg')`,
              height: 80,
              width: 80,
              backgroundRepeat: 'no-repeat',
              marginRight: '10px',
            }}
          ></div>
          <Typography component='h1' variant='h5'>
            {t('login.title')}
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label={t('email')}
              name='email'
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label={t('password')}
              type='password'
              id='password'
              onKeyDown={(e) => {
                if ((e.code === 'Enter')) {
                  loginHandler(email, password);
                }
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label={t('login.remember_me')}
            /> */}
            <Button
              fullWidth
              onClick={() => loginHandler(email, password)}
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              {t('login.title')}
            </Button>
            <Box className={classes.box}>
              <FacebookIcon className={classes.icon_fb} />
              <div>
                <img style={{ height: '34px' }} src='/img/instagram.png' />
              </div>
            </Box>
            <Grid container>
              <Grid item xs>
                <Link href='#' variant='body2'>
                  {t('login.forgot_password')}
                </Link>
              </Grid>
              <Grid item>
                <Link
                  style={{ cursor: 'pointer' }}
                  onClick={() => props.history.push('/register')}
                  variant='body2'
                >
                  {t('login.has_account')}
                  {t('login.sign_up')}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
});

export default withRouter(SignIn);
