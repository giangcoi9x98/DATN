import React, { useState, useEffect, useRef, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import Contacts from '../../components/Contacts';
import {
  Avatar,
  Button,
  Card,
  CardMedia,
  Container,
  Divider,
  IconButton,
  Typography,
  Grid,
  GridList,
  GridListTile,
} from '@material-ui/core';
import Posts from '../../components/Post';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { makeStyles } from '@material-ui/core/styles';
import { COLORS, SIZETYPE, FONT } from '../../constants';
import noti from '../../components/Notification';
import api from '../../api';
import NavProfile from './components/NavProfile';
import ModalUpload from './components/ModalUpload';
import { getAllImages } from '../../store/actions/userAction';
import './profile.css';
import config from '../../configs';
const useStyle = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.background_gradiant,
    width: '100%',
  },
  backgroundCover: {
    //background: COLORS.background_gradiant,
    height: 'fit-content',
    width: '100%',
  },
  imageCover: {
    borderRadius: SIZETYPE.large,
    height: '400px',
  },
  updateCover: {
    display: 'flex',
    flexDirection: 'row',
    width: 'fit-content',
    padding: SIZETYPE.small,
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editCover: {
    display: 'flex',
    flexDirection: 'row',
    width: 'fit-content',
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    background: '#eff2f5',
    borderRadius: SIZETYPE.medium,
    paddingStart: SIZETYPE.small,
    paddingRight: SIZETYPE.small,
  },
  div_updateCover: {
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: SIZETYPE.medium,
    width: '43%',
  },
  containerCover: {
    display: 'flex',
    flexDirection: 'column',
    width: '72%',
    height: '400px',
    backgroundImage: 'url(/img/bg3.jpg)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    borderRadius: SIZETYPE.large,
  },
  textEdit: {
    fontWeight: 600,
    marginStart: SIZETYPE.small,
    cursor: 'pointer',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    display: 'flex',
    height: '168px',
    width: '168px',
  },
  uploadAvatar: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'flex-end',
    width: '100%',
  },
  wrapAvatar: {
    width: '57%',
  },
  wrapUpdateAvatar: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    display: 'flex',
    backgroundImage: 'url(/img/faces/kendall.jpg)',
    height: '168px',
    width: '168px',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    borderWidth: 4,
    borderColor: COLORS.text,
    borderStyle: 'solid',
    borderRadius: 100,
  },
  photoIcon: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    color: 'white',
    height: '54px',
    width: '30px',
  },
  photoIconCover: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    color: COLORS.text,
    height: '54px',
    width: '30px',
  },
  flex_end: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  align_end: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  iconSize: {
    height: 40,
    width: 40,
  },
  editIcon: {
    height: 30,
    width: 30,
  },
  wrapProfile: {},
  name: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    fontFamily: 'none',
    fontWeight: 600,
    fontSize: '30px',
    marginTop: SIZETYPE.medium,
  },
  wrapNav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorText: {
    color: COLORS.text,
  },
  // gridList: {
  //   width: 500,
  //   height: 450,
  // },
}));

function Profile(props) {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = useStyle();
  const [image, setImage] = useState('');
  const { t, i18n } = useTranslation('common');
  const [currentUser, setCurrentUser] = useState(
    props.location.pathname.split('/')[2]
  );
  const [navProfile, setNavProfile] = useState(0);
  const [user, setUser] = useState({});
  const handleChangeFile = (e) => {
    setImage(e.target.files[0]);
    setShowModal(true);
  };
  const posts = useSelector((state) => state.post);

  const [showModal, setShowModal] = useState(false);
  // console.log(image);
  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await api.media.upload(formData);
  };

  useEffect(() => {
    async function fetchDataUser() {
      let email = currentUser + '@gmail.com';
      const res = await api.user.getByEmail(email);
      console.log(res, email);
      if (res.status) {
        await setUser(res.data.data[0]);
      }
      await dispatch(getAllImages(email));
    }
    fetchDataUser();
  }, [currentUser, showModal, dispatch]);
  const renderContent = useCallback(() => {
    console.log('navProfile', posts);
    if (navProfile === 0) {
      return posts.postData.map((post) => {
        return <Posts post={post}></Posts>;
      });
    }
    if (navProfile == 1) {
      return (
        <GridList cellHeight={160} className={classes.gridList} cols={3}>
          {userData.images.map((tile) => (
            <GridListTile cols={tile.cols || 1}>
              <img src={`${config.BASE_URL}${tile}`} alt={tile.title} />
              {/* <div
                style={{
                  backgroundImage: `url(${config.BASE_URL}${tile})`,
                  height: "100%",
                  width: "100%",
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                }}
              ></div> */}
            </GridListTile>
          ))}
        </GridList>
      );
    }
    return <div></div>;
  }, [navProfile, posts, userData]);
  console.log(userData.images);
  const renderModal = (key) => {
    if (key) {
      return (
        <ModalUpload
          showModal={showModal}
          onClose={() => setShowModal(false)}
          image={image}
          handleUploadImage={(img) => handleUploadImage(img)}
        ></ModalUpload>
      );
    }
  };

  return (
    <div className={classes.wrapProfile}>
      <div className={classes.backgroundCover}>
        <div>
          <Container
            component='main'
            maxWidth='lg'
            className={classes.containerCover}
          >
            <div className={classes.uploadAvatar}>
              <div className={classes.wrapAvatar}>
                <div className={classes.flex_end}>
                  <div className={classes.wrapUpdateAvatar}>
                    <form className={classes.align_end} id='myForm'>
                      <IconButton
                        variant='contained'
                        component='label'
                        className={classes.iconSize}
                        onChange={handleChangeFile}
                      >
                        <input type='file' hidden />
                        <PhotoCameraIcon
                          className={classes.photoIcon}
                        ></PhotoCameraIcon>
                      </IconButton>
                    </form>
                  </div>
                </div>
              </div>
              <div className={classes.div_updateCover}>
                <Card className={classes.editCover}>
                  <IconButton
                    variant='contained'
                    component='label'
                    className={classes.iconSize}
                  >
                    <input type='file' hidden />
                    <PhotoCameraIcon
                      className={classes.photoIconCover}
                    ></PhotoCameraIcon>
                  </IconButton>{' '}
                  <div>
                    {renderModal(showModal)}

                    <Typography className={classes.textEdit}>
                      {t('profile.edit_cover')}
                    </Typography>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </div>
        <Typography className={classes.name}>
          {user.fullname ? user.fullname : ' '}
        </Typography>
        <Container component='main' maxWidth='md' className={classes.wrapNav}>
          <NavProfile
            setNavProfile={(e) => {
              console.log('nac', e);
              setNavProfile(e);
            }}
            navProfile={navProfile}
          ></NavProfile>
          <div className={classes.editCover}>
            <IconButton
              variant='contained'
              component='label'
              className={classes.editIcon}
            >
              <EditIcon className={classes.colorText}></EditIcon>
            </IconButton>{' '}
            <div>
              <Typography className={classes.textEdit}>
                {t('profile.edit_prodile')}
              </Typography>
            </div>
          </div>
        </Container>
        <Divider></Divider>
      </div>
      {}
      <Container component='main' maxWidth='md' className={classes.container}>
        <Grid item xs={12} sm={12}>
          {renderContent()}
        </Grid>
      </Container>
    </div>
  );
}

export default withRouter(Profile);
