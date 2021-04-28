import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography } from '@material-ui/core';
import { COLORS, SIZETYPE } from '../../constants';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import ModalPost from '../../components/ModalPost';
import { Card, Avatar, Button } from '@material-ui/core';
import noti from '../../components/Notification';

const useStyle = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.background_gradiant,
    width: '100%',
    height: '1000px',
  },
  bg_text: {
    marginStart: SIZETYPE.medium,
    marginRight: SIZETYPE.medium,
    height: '100%',
    width: '100%',
    backgroundColor: '#eff2f5',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: SIZETYPE.medium,
    borderRadius: SIZETYPE.homeIcon,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  title: {
    maxWidth: 423,
    padding: SIZETYPE.small,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_hidden: {
    color: COLORS.hidden_text,
    fontSize: SIZETYPE.icon,
    fontWeight: 300,
  },
}));

function Home(props) {
  const classes = useStyle();
  const { t, i18n } = useTranslation('common');
  const user = useSelector((state) => state.user);
  return (
    <Container component='main' maxWidth='md' className={classes.container}>
      <div className={classes.title}>
        <div>
          <Avatar src='/img/faces/kendall.jpg' className={classes.large} />
        </div>
        <div className={classes.bg_text}>
          <Typography className={classes.text_hidden}>
            {t('home.newPost')}
          </Typography>
        </div>
      </div>
      <Button onClick={() => noti.success('ok')}>testnoti</Button>
      <ModalPost></ModalPost>
    </Container>
  );
}

export default Home;
