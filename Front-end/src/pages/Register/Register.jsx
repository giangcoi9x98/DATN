import React, { useState, useEffect } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { COLORS, SIZETYPE } from '../../constants';
import api from '../../api';
import noti from '../../components/Notification';
const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 80,
    paddingTop: 80,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: SIZETYPE.large,
  },
  label: {
    cursor: 'pointer',
    paddingLeft: '0',
    color: 'rgba(0, 0, 0, 0.26)',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    display: 'inline-flex',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    borderRadius: SIZETYPE.large,
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    borderRadius: SIZETYPE.large,
    background: COLORS.background_gradiant,
    margin: theme.spacing(3, 0, 2),
    fontFamily: '"Quicksand", Verdana, sans-serif;',
    fontSize: 'inherit',
  },
  datePicker: {
    marginBottom: SIZETYPE.small,
  },
}));

function SignUp(props) {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState();
  const { t, i18n } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const lang = useSelector((state) => state.lang);
  console.log(t('email'), lang);
  useEffect(() => {
    return i18n.changeLanguage(lang.lang);
  }, [lang,i18n]);
  console.log(props);
  const handleSignup = async (email, password, fullname, birthday) => {
    const res = await api.user.signUp({
      email: email,
      password: password,
      fullname: fullname,
      birthday: birthday,
    });
    if (res.status) {
      noti.success('Signup is success!')
    } else {
      noti.error(res?.data?.data[0]?.message, 'error')
    }
  };
  return (
    <Container component='main' maxWidth='sm' style={{ zIndex: 1 }}>
      <CssBaseline />
      <div className={classes.paper}>
        <div style={{
          backgroundImage: `url('/logo192.svg')`,
          height: 80,
          width: 80,
          backgroundRepeat: 'no-repeat',
          marginRight:'10px'
        }}>
        </div>
        <Typography component='h1' variant='h5'>
          {t('signup.title')}
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='fname'
                name='firstName'
                variant='outlined'
                required
                fullWidth
                id='firstName'
                label={t('signup.name')}
                autoFocus
                onChange={(e) => setFullname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginTop: 6 }}>
              <TextField
                id='date'
                fullWidth
                label={t('signup.birthday')}
                type='date'
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                }}
                defaultValue='2017-05-24'
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='email'
                label={t('email')}
                name='email'
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label={t('password')}
                type='password'
                id='password'
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value='allowExtraEmails' color='primary' />}
                label='I want to receive inspiration, marketing promotions and updates via email.'
              />
            </Grid> */}
          </Grid>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={() => {
              handleSignup(email, password, fullname, selectedDate);
            }}
          >
            {t('signup.title')}
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link
                style={{ cursor: 'pointer' }}
                onClick={() => props.history.push('/login')}
                variant='body2'
              >
                {t('signup.has_account')}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
export default withRouter(SignUp);
