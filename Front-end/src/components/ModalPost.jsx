import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SIZETYPE, COLORS } from '../constants';
import { makeStyles } from '@material-ui/core/styles';
import { Card, IconButton, TextField, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

const useStyles = makeStyles((theme) => ({
  btn_Post: {
    width: '100%',
    marginStart: '12px',
  },
  textField: {},
  wrap_add: {
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    marginStart: '8px',
    justifyContent: 'space-around',
  },
  text: {
    fontSize: '15px',
    fontWeight: 600,
    padding: SIZETYPE.small,
    marginStart: SIZETYPE.small,
  },
}));
function ModalPost(props) {
  const { isShowModal, isCloseModal } = props;
  const { t, i18n } = useTranslation('common');
  const classes = useStyles();
  const [content, setContent] = useState('');
  const [backgroundDisable, setBackgroundDisable] = useState('#e4e6eb');
  useEffect(() => {
    if (content) {
      setBackgroundDisable('#007bff');
    } else {
      setBackgroundDisable('#e4e6eb');
    }
  }, [content, backgroundDisable]);
  console.log('color', backgroundDisable);
  return (
    <>
      <Modal show={isShowModal} onHide={isCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal_post.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            id='outlined-full-width'
            label={t('modal_post.content')}
            style={{ margin: 8 }}
            placeholder={t('home.newPost')}
            fullWidth
            onChange={(e) => setContent(e.currentTarget.value)}
            margin='normal'
            InputLabelProps={{
              shrink: true,
            }}
            variant='outlined'
          />
          <Card className={classes.wrap_add}>
            <Typography className={classes.text}>
              {t('modal_post.add_on')}
            </Typography>
            <div>
              <IconButton component='label' variant='contained'>
                <input type='file' hidden />
                <ImageIcon></ImageIcon>
              </IconButton>
            </div>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={isCloseModal}>
            Close
          </Button> */}
          <Button
            style={{
              backgroundColor: backgroundDisable,
              borderColor: backgroundDisable,
            }}
            className={classes.btn_Post}
            variant='primary'
            onClick={isCloseModal}
          >
            {t('modal_post.post')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalPost;
