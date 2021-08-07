/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useCallback, memo } from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import {
  Card,
  Container,
  Divider,
  IconButton,
  Typography,
  Grid,
  GridList,
  GridListTile,
  Menu,
  MenuItem,
  Box,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Posts from '../../components/Post';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { makeStyles } from '@material-ui/core/styles';
import { COLORS, SIZETYPE, FONT } from '../../constants';
import api from '../../api';
import NavProfile from './components/NavProfile';
import ModalUpload from './components/ModalUpload';
import { getAllImages } from '../../store/actions/userAction';
import { fetchMyPosts } from '../../store/actions/postAction';
import { getContacts } from '../../store/actions/contactAction';

import './profile.css';
import config from '../../configs';
import ModalUpdateProfile from './components/ModalUpdateProfile';
import { Tooltip } from '@material-ui/core';
import noti from '../../components/Notification';
import { useHistory } from 'react-router-dom';

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
    // backgroundImage: 'url(/img/bg3.jpg)',
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
    // backgroundImage: 'url(/img/faces/kendall.jpg)',
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
const options = ['1', '2', '3'];

const ITEM_HEIGHT = 48;

const Profile = memo((props) => {
  const userData = useSelector((state) => state.user);
  const myPosts = useSelector((state) => state.post.myPosts);
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contact);
  const classes = useStyle();
  const [image, setImage] = useState('');
  const { t, i18n } = useTranslation('common');
  const [currentUser] = useState(props.location.pathname.split('/')[2]);
  const [navProfile, setNavProfile] = useState(0);
  const [user, setUser] = useState({});
  const handleChangeFile = (e) => {
    setImage(e.target.files[0]);
    setShowModal(true);
  };
  const history = useHistory();
  const [isFollow, setIsFollow] = useState('');
  useEffect(() => {
    if (user?.follows?.length) {
      user.follows.forEach((e) => {
        if (e.accountId === userData.userData.id) {
          setIsFollow(true);
        }
      });
    }
  }, [user, userData?.userData?.id]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [showModalUpdateProfile, setShowModalUpdateProfile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [typeUpdate, setTypeUpdate] = useState('');
  const handleUploadImage = useCallback(
    async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      await api.media.upload(formData);
      const fileName = file.name;
      const url = `${config.BASE_URL}${user.email}/${fileName}`;
      if (typeUpdate === 'avatar') {
        const res = await api.user.updateAvatar({
          avatar: url,
        });
        if (res) {
          noti.success('Update success', 'success');
        } else {
          noti.error('Update failed', 'error');
        }
      }
      if (typeUpdate === 'background') {
        const res = await api.user.updateBackground({
          background: url,
        });
        if (res) {
          noti.success('Update success', 'success');
        } else {
          noti.error('Update failed', 'error');
        }
      }
    },
    [typeUpdate, user.email]
  );
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    async function fetchDataUser() {
      let email = currentUser + '@gmail.com';
      const res = await api.user.getByEmail(email);
      if (res.status) {
        await setUser(res.data.data[0]);
        await dispatch(getAllImages(email));
        await dispatch(fetchMyPosts(email));
        await dispatch(getContacts(email));
      }
    }
    fetchDataUser();
  }, [currentUser, showModal, dispatch]);
  useEffect(() => {
    let email = currentUser + '@gmail.com';
    if (email === userData?.userData?.email) {
      setIsOwner(true);
    }
  }, [currentUser, userData]);
  const actionFollow = async () => {
    const res = await api.user.follow(user.id);
    if (res) {
      noti.success(res?.data?.data, 'success');
    }
  };
  const renderContent = useCallback(() => {
    if (navProfile === 0) {
      return myPosts?.map((post) => {
        return (
          <Posts
            post={post.post}
            user={userData.userData}
            key={post.post.id}
          ></Posts>
        );
      });
    }
    if (navProfile === 1) {
      return (
        <GridList cellHeight={160} className={classes.gridList} cols={3}>
          {userData.images.map((tile) => (
            <GridListTile cols={tile.cols || 1}>
              <img
                src={`${config.BASE_URL}${tile}`}
                alt={tile.title}
                style={{
                  width: '100%',
                  backgroundSize: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
              >
                <IconButton
                  aria-label='more'
                  aria-controls='long-menu'
                  aria-haspopup='true'
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id='long-menu'
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: '20ch',
                    },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => {
                        console.log(option);
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </GridListTile>
          ))}
        </GridList>
      );
    }
    if (navProfile === 2) {
      return (
        <GridList
          cellHeight={100}
          className={classes.gridList}
          cols={2}
          spacing={8}
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {contacts?.contactData?.map((tile) => (
            <Grid item sx={12} sm={5} spacing={2}>
              <Box
                boxShadow={3}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    padding: '10px',
                  }}
                >
                  {/* <img src ={`${tile.contact.avatar}`} width ={80} height ={80} style= {{
                    boxShadow: '0px 0px 5px 0px #6c757d'
                  }}/> */}
                  <img
                    src={tile?.contact?.avatar}
                    width={80}
                    height={80}
                    style={{
                      boxShadow: '0px 0px 5px 0px #6c757d',
                    }}
                  />
                </div>
                <div
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Typography>{tile?.contact?.fullname}</Typography>
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton
                    style={{
                      height: '50px',
                    }}
                    aria-controls='simple-menu'
                    aria-haspopup='true'
                    onClick={() =>
                      (window.location = `${
                        tile?.contact?.email?.split('@')[0]
                      }`)
                    }
                  >
                    <Tooltip title='View Profile' placement='top-end'>
                      <AccountCircleIcon />
                    </Tooltip>
                  </IconButton>
                </div>
              </Box>
            </Grid>
          ))}
        </GridList>
      );
    }
    return <div></div>;
  }, [
    navProfile,
    myPosts,
    userData.userData,
    userData.images,
    classes.gridList,
    anchorEl,
    open,
    contacts.contactData,
  ]);
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
            style={{
              background: `url(${user?.background ?? ''})`,
            }}
          >
            <div className={classes.uploadAvatar}>
              <div className={classes.wrapAvatar}>
                <div className={classes.flex_end}>
                  <div
                    className={classes.wrapUpdateAvatar}
                    style={{
                      backgroundImage: `url(${
                        user?.avatar ??
                        'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png'
                      })`,
                    }}
                  >
                    <form className={classes.align_end} id='myForm'>
                      <IconButton
                        variant='contained'
                        component='label'
                        className={classes.iconSize}
                        onChange={handleChangeFile}
                        onClick={() => setTypeUpdate('avatar')}
                      >
                        <input type='file' hidden />
                        <PhotoCameraIcon
                          className={classes.photoIcon}
                          style={{
                            display: isOwner ? 'block' : 'none',
                          }}
                        ></PhotoCameraIcon>
                      </IconButton>
                    </form>
                  </div>
                </div>
              </div>
              <div className={classes.div_updateCover}>
                <Card
                  className={classes.editCover}
                  style={{
                    display: isOwner ? 'flex' : 'none',
                  }}
                >
                  <IconButton
                    variant='contained'
                    component='label'
                    className={classes.iconSize}
                    onChange={handleChangeFile}
                  >
                    <input type='file' hidden />
                    <PhotoCameraIcon
                      onClick={() => setTypeUpdate('background')}
                      className={classes.photoIconCover}
                    ></PhotoCameraIcon>
                  </IconButton>{' '}
                  <div>
                    <Typography className={classes.textEdit}>
                      {t('profile.edit_cover')}
                    </Typography>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </div>
        {renderModal(showModal)}

        <Typography className={classes.name}>
          {user.fullname ? user.fullname : ' '}
        </Typography>
        <Container component='main' maxWidth='md' className={classes.wrapNav}>
          <NavProfile
            setNavProfile={(e) => {
              setNavProfile(e);
            }}
            navProfile={navProfile}
          ></NavProfile>
          <ModalUpdateProfile
            showModal={showModalUpdateProfile}
            onClose={() => setShowModalUpdateProfile(false)}
          />
          <Box
            style={{
              display: isOwner ? 'none' : 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4px',
              height: '36px',
              marginTop: '12px',
            }}
          >
            <Tooltip
              title='Follow'
              placement='top'
              style={{
                cursor: 'pointer',
              }}
            >
              <img
                src='https://static.xx.fbcdn.net/rsrc.php/v3/yF/r/qEUhBn_j7A2.png'
                w='24px'
                height='24px'
                onClick={actionFollow}
              />
            </Tooltip>
            <Typography
              style={{
                marginLeft: '12px',
              }}
            >
              {isFollow ? 'Followed' : 'Follow'}
            </Typography>
          </Box>
          <div
            className={classes.editCover}
            onClick={() => {
              setShowModalUpdateProfile(true);
            }}
            style={{
              display: isOwner ? 'flex' : 'none',
            }}
          >
            <IconButton component='label' className={classes.editIcon}>
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
});

export default withRouter(Profile);
