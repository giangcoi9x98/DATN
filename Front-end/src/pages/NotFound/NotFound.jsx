import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { COLORS, SIZETYPE, FONT } from '../../constants';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CardMedia, Container, Link, Typography,  } from '@material-ui/core';

import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';
const useStyle = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.background_gradiant,
    width: '100%',
    height: '1000px',
  },

  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  footer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  title: {
    color: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    fontWeight: 600,
    fontSize: '22px',
    lineHeight: '26px',
    marginTop: SIZETYPE.medium,
  },
  subTitle: {
    textAlign: 'center',
    fontWeight: 400,
    fontSize: '16px',
    fontFamily: FONT.default,
  },
  wrapTitle: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginTop: SIZETYPE.large,
  },
  link: {
    cursor: 'pointer',
  },
}));
function NotFound(props) {
  const classes = useStyle();
  const handleBackToHome = () => {
     props.history.push('/')
   }
  return (
  <div>  <NavBar></NavBar>
  <Container component='main' maxWidth='md' className={classes.container}>
    <Typography className={classes.title}>
      Sorry, this page isn't available.
    </Typography>
    <div className={classes.wrapTitle}>
      <Typography className={classes.subTitle}>
        The link you followed may be broken, or the page may have been
        removed. {<Link className={classes.link } onClick={handleBackToHome}> Go back to Codese</Link>}
      </Typography>
    </div>
    <Footer className={classes.footer} props={props}></Footer>
  </Container></div>
  );
}

export default withRouter(NotFound);
