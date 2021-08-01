import { Modal, Button } from 'react-bootstrap';
import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import ImageReader from '../../../components/ImageReader';

const useStyle = makeStyles((theme) => ({
  wrapImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const ModalPost = memo((props) => {
  const classes = useStyle();
  const { image, handleUploadImage } = props;

  const [show] = useState(props.showModal);
  const { t, i18n } = useTranslation('common');
  const handleClose = () => {
    console.log('close');
    props.onClose();
  };
  const handleUpload = () => handleUploadImage(image);
  // const handleShow = () => setShow(true);
  console.log(props.image);
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modalUpload.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={classes.wrapImg}>
            <ImageReader image={image} height={168} width={168} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            {t('close')}
          </Button>
          <Button variant='primary' onClick={handleUpload}>
            {t('modalUpload.upload')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
})

export default ModalPost;
