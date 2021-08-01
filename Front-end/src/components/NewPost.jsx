import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ModalPost from './ModalPost';
import { useSelector } from 'react-redux';

import { SIZETYPE, COLORS } from '../constants';
import { Avatar, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import noti from './Notification';

const useStyle = makeStyles((theme) => ({
  title: {
    maxWidth: '500px',
    padding: SIZETYPE.small,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    cursor: 'pointer',
  },
  text_hidden: {
    marginLeft: 5,
    display: 'flex',
    color: COLORS.hidden_text,
    fontSize: SIZETYPE.icon,
    fontWeight: 300,
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
}));

function NewPost(props) {
  const classes = useStyle();
  const { t, i18n } = useTranslation('common');
  const user = useSelector((state) => state.user);
  const [isShowModal, setIsShowModal] = useState(false);
  const handleShowModal = () => {
    setIsShowModal(true);
  };
  useEffect(() => {}, [user.userData]);
  return (
    <div
      style={{
        cursor: 'pointer',
      }}
    >
      <div className={classes.title} onClick={() => handleShowModal()}>
        <div>
          <Avatar src='/img/faces/kendall.jpg' className={classes.large} />
        </div>
        <div className={classes.bg_text}>
          <Typography className={classes.text_hidden}>
            {t('home.newPost')}
            {`${user?.userData?.fullname ? user?.userData?.fullname : ''}  ?`}
          </Typography>
        </div>
      </div>
      <ModalPost
        isShowModal={isShowModal}
        isCloseModal={() => setIsShowModal(false)}
      ></ModalPost>
    </div>
  );
}

export default NewPost;
