import { Modal, Button } from "react-bootstrap";
import React, { useState, useEffect, memo } from "react";
import { useTranslation } from "react-i18next";
import { SIZETYPE } from "../constants";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  LinearProgress,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import ImageReader from "../components/ImageReader";
import api from "../api";
import noti from "./Notification";
import { fetchAllPost } from "../store/actions/postAction";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  btn_Post: {
    width: "100%",
  },
  textField: {},
  wrap_add: {
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  text: {
    fontSize: "15px",
    fontWeight: 600,
    padding: SIZETYPE.small,
    marginStart: SIZETYPE.small,
  },
  wrapImg: {
    display: "flex",
    flexDirection: "row",
    margin: SIZETYPE.small,
  },
  linerProgress: {
    width: "100%",
  },
}));

const ModalPost = memo((props) => {
  const { isShowModal, isCloseModal } = props;
  const { t, i18n } = useTranslation("common");
  const [imgUrl, setImgUrl] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [pendingReq, setPendingReq] = useState(false);
  const [content, setContent] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [backgroundDisable, setBackgroundDisable] = useState("#e4e6eb");
  const handleUploadImage = (e) => {
    let newArr = [];
    for (let i = 0; i < e.target.files.length; i++) {
      newArr.push(e.target.files[i]);
    }
    setImgUrl(newArr);
  };
  const handlePost = async (content, file = []) => {
    const resUpload = await Promise.all(
      file.map(async (e) => {
        const formData = new FormData();
        formData.append("file", e);
        return await api.media.upload(formData);
      })
    );
    const resPost = await api.post.newPost({
      content: content,
      img: file.map((e) => e.name),
    });
    if (resPost.status) {
      setTimeout(async () => {
        await dispatch(fetchAllPost());
        setPendingReq(false);
        isCloseModal();
        noti.success(t("modal_post.success"));
      }, 2000);
    }
  };

  useEffect(() => {
    if (content) {
      setIsDisable(false);
      setBackgroundDisable("#007bff");
    } else {
      setIsDisable(true);
      setBackgroundDisable("#e4e6eb");
    }
  }, [content, backgroundDisable, imgUrl]);
  const linearProgess = () => {
    if (pendingReq) {
      return (
        <div className={classes.linerProgress}>
          <LinearProgress></LinearProgress>
        </div>
      );
    }
    return <div></div>;
  };

  const renderImage = (
    <div className={classes.wrapImg}>
      {imgUrl.map((e) => (
        <ImageReader
          image={e}
          width={200}
          height={230}
          handleCloseImg={async (name) => {
            const newArr = [...imgUrl.filter((e) => e.name !== name)];
            await setImgUrl(newArr);
            if (!imgUrl.length) {
              document.getElementById("upload").value = "";
            }
          }}
        ></ImageReader>
      ))}
    </div>
  );
  return (
    <>
      <Modal show={isShowModal} onHide={isCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t("modal_post.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            id="outlined-full-width"
            label={t("modal_post.content")}
            placeholder={t("home.newPost")}
            fullWidth
            onChange={(e) => setContent(e.currentTarget.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
          <div>{imgUrl ? renderImage : ""}</div>
          <Card className={classes.wrap_add}>
            <Typography className={classes.text}>
              {t("modal_post.add_on")}
            </Typography>
            <form>
              <IconButton component="label" variant="contained">
                <input
                  onChange={handleUploadImage}
                  type="file"
                  id="upload"
                  accept="image/*"
                  multiple="multiple"
                  hidden
                />
                <ImageIcon></ImageIcon>
              </IconButton>
            </form>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={isCloseModal}>
            Close
          </Button> */}
          <Button
            disabled={isDisable}
            style={{
              backgroundColor: backgroundDisable,
              borderColor: backgroundDisable,
            }}
            className={classes.btn_Post}
            variant="primary"
            onClick={async () => {
              setPendingReq(true);
              //await handleUpload(imgUrl);
              await handlePost(content, imgUrl);
              //setTimeout(() => setPendingReq(false), 1000);
            }}
          >
            {t("modal_post.post")}
          </Button>
          {linearProgess()}
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default ModalPost;
