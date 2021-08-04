import { Modal} from 'react-bootstrap';
import React, { memo } from 'react';
import UpdateProfile from './UpdateProfile';
import { useSelector } from 'react-redux';

const ModalUpdateProfile = memo((props) => {
  const {showModal, onClose } = props;
  // const { t, i18n } = useTranslation('common');
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
      </Modal>
    </>
  );
});

export default ModalUpdateProfile;
