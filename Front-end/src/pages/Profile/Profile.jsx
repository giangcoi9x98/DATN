import React, { useState, useEffect, useRef, useCallback } from "react";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import Contacts from "../../components/Contacts";
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
  Menu,
  MenuItem,
  Box,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Posts from "../../components/Post";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { makeStyles } from "@material-ui/core/styles";
import { COLORS, SIZETYPE, FONT } from "../../constants";
import noti from "../../components/Notification";
import api from "../../api";
import NavProfile from "./components/NavProfile";
import ModalUpload from "./components/ModalUpload";
import { getAllImages } from "../../store/actions/userAction";
import "./profile.css";
import config from "../../configs";
const useStyle = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: COLORS.background_gradiant,
    width: "100%",
  },
  backgroundCover: {
    //background: COLORS.background_gradiant,
    height: "fit-content",
    width: "100%",
  },
  imageCover: {
    borderRadius: SIZETYPE.large,
    height: "400px",
  },
  updateCover: {
    display: "flex",
    flexDirection: "row",
    width: "fit-content",
    padding: SIZETYPE.small,
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center",
  },
  editCover: {
    display: "flex",
    flexDirection: "row",
    width: "fit-content",
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    background: "#eff2f5",
    borderRadius: SIZETYPE.medium,
    paddingStart: SIZETYPE.small,
    paddingRight: SIZETYPE.small,
  },
  div_updateCover: {
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: SIZETYPE.medium,
    width: "43%",
  },
  containerCover: {
    display: "flex",
    flexDirection: "column",
    width: "72%",
    height: "400px",
    backgroundImage: "url(/img/bg3.jpg)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    borderRadius: SIZETYPE.large,
  },
  textEdit: {
    fontWeight: 600,
    marginStart: SIZETYPE.small,
    cursor: "pointer",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  avatar: {
    display: "flex",
    height: "168px",
    width: "168px",
  },
  uploadAvatar: {
    display: "flex",
    justifyContent: "center",
    height: "100%",
    alignItems: "flex-end",
    width: "100%",
  },
  wrapAvatar: {
    width: "57%",
  },
  wrapUpdateAvatar: {
    justifyContent: "flex-end",
    flexDirection: "row",
    display: "flex",
    backgroundImage: "url(/img/faces/kendall.jpg)",
    height: "168px",
    width: "168px",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    borderWidth: 4,
    borderColor: COLORS.text,
    borderStyle: "solid",
    borderRadius: 100,
  },
  photoIcon: {
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "row",
    color: "white",
    height: "54px",
    width: "30px",
  },
  photoIconCover: {
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "row",
    color: COLORS.text,
    height: "54px",
    width: "30px",
  },
  flex_end: {
    display: "flex",
    justifyContent: "flex-end",
  },
  align_end: {
    display: "flex",
    alignItems: "flex-end",
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    fontFamily: "none",
    fontWeight: 600,
    fontSize: "30px",
    marginTop: SIZETYPE.medium,
  },
  wrapNav: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorText: {
    color: COLORS.text,
  },
  // gridList: {
  //   width: 500,
  //   height: 450,
  // },
  
}));
const options = ["1", "2", "3"];

const ITEM_HEIGHT = 48;
function Profile(props) {
  const userData = useSelector((state) => state.user);
  const myPosts = useSelector((state) => state.post.myPosts);
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contact);
  const classes = useStyle();
  const [image, setImage] = useState("");
  const { t, i18n } = useTranslation("common");
  const [currentUser, setCurrentUser] = useState(
    props.location.pathname.split("/")[2]
  );
  const [navProfile, setNavProfile] = useState(0);
  const [user, setUser] = useState({});
  const handleChangeFile = (e) => {
    setImage(e.target.files[0]);
    setShowModal(true);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const posts = useSelector((state) => state.post);

  const [showModal, setShowModal] = useState(false);
  // console.log(image);
  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    await api.media.upload(formData);
  };

  useEffect(() => {
    async function fetchDataUser() {
      let email = currentUser + "@gmail.com";
      const res = await api.user.getByEmail(email);
      if (res.status) {
        await setUser(res.data.data[0]);
      }
      await dispatch(getAllImages(email));
    }
    fetchDataUser();
  }, [currentUser, showModal, dispatch]);
  const renderContent = useCallback(() => {
    if (navProfile === 0) {
      return myPosts?.map((post) => {
        return <Posts post={post.post}></Posts>;
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
                  width: "100%",
                  backgroundSize: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: "20ch",
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
            display:'flex',
            justifyContent:'center'
          }}
        >
          {contacts.contactData.map((tile) => (
            <Grid item sx={12} sm={5} spacing={2} >
              <Box
                boxShadow={3}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                  }}
                >
                  {/* <img src ={`${tile.contact.avatar}`} width ={80} height ={80} style= {{
                    boxShadow: '0px 0px 5px 0px #6c757d'
                  }}/> */}
                  <img
                    src="https://i.pinimg.com/564x/7c/29/9e/7c299e437d9b23f2abb82224eb6d564a.jpg"
                    width={80}
                    height={80}
                    style={{
                      boxShadow: "0px 0px 5px 0px #6c757d",
                    }}
                  />
                </div>
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Typography>{tile.contact.fullname}</Typography>
                </div>
                <div  style={{
                      display: "flex",
                      width: "100%",
                     
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }} >
                  <IconButton
                   
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreHorizIcon/>
                  </IconButton>
                  <Menu
                    style={{
                      boxShadow: "0px 0px 5px 0px #6c757d !important", 
                    }}
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem style={{
                       boxShadow: "0px 0px 5px 0px #6c757d !important", 
                    }} onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                  </Menu>
                </div>
              </Box>
            </Grid>
          ))}
        </GridList>
      );
    }
    return <div></div>;
  }, [navProfile, posts, userData, anchorEl, open, classes.gridList, contacts]);
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
            component="main"
            maxWidth="lg"
            className={classes.containerCover}
          >
            <div className={classes.uploadAvatar}>
              <div className={classes.wrapAvatar}>
                <div className={classes.flex_end}>
                  <div className={classes.wrapUpdateAvatar}>
                    <form className={classes.align_end} id="myForm">
                      <IconButton
                        variant="contained"
                        component="label"
                        className={classes.iconSize}
                        onChange={handleChangeFile}
                      >
                        <input type="file" hidden />
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
                    variant="contained"
                    component="label"
                    className={classes.iconSize}
                  >
                    <input type="file" hidden />
                    <PhotoCameraIcon
                      className={classes.photoIconCover}
                    ></PhotoCameraIcon>
                  </IconButton>{" "}
                  <div>
                    {renderModal(showModal)}

                    <Typography className={classes.textEdit}>
                      {t("profile.edit_cover")}
                    </Typography>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </div>
        <Typography className={classes.name}>
          {user.fullname ? user.fullname : " "}
        </Typography>
        <Container component="main" maxWidth="md" className={classes.wrapNav}>
          <NavProfile
            setNavProfile={(e) => {
              console.log("nac", e);
              setNavProfile(e);
            }}
            navProfile={navProfile}
          ></NavProfile>
          <div className={classes.editCover}>
            <IconButton
              variant="contained"
              component="label"
              className={classes.editIcon}
            >
              <EditIcon className={classes.colorText}></EditIcon>
            </IconButton>{" "}
            <div>
              <Typography className={classes.textEdit}>
                {t("profile.edit_prodile")}
              </Typography>
            </div>
          </div>
        </Container>
        <Divider></Divider>
      </div>
      {}
      <Container component="main" maxWidth="md" className={classes.container}>
        <Grid item xs={12} sm={12}>
          {renderContent()}
        </Grid>
      </Container>
    </div>
  );
}

export default withRouter(Profile);
