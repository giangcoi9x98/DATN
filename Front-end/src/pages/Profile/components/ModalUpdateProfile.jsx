import { Modal, Button } from 'react-bootstrap';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import UpdateProfile from './UpdateProfile';
import { useSelector, useDispatch } from 'react-redux';

const useStyle = makeStyles((theme) => ({
  wrapImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const ModalUpdateProfile = memo((props) => {
  const classes = useStyle();
  const {showModal, onClose } = props;
  const { t, i18n } = useTranslation('common');
  const userData = useSelector((state) => state.user);

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          onClose();
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{'UpdateProfile'}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          zIndex: 1000
        }}>
          <UpdateProfile profile={userData} onClose={ () => onClose()}/>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>
            {t('close')}
          </Button>
          <Button variant='primary'>
            {'Update Profile'}
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
});

export default ModalUpdateProfile;
