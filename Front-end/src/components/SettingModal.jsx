import { Modal, Button } from 'react-bootstrap';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  TextField,
  Divider,
  AccordionActions,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import { useState } from 'react';
import api from '../api';
import noti from './Notification';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const SettingModal = memo((props) => {
  const { showModal, onClose } = props;
  const { t, i18n } = useTranslation('common');
  const classes = useStyles();
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [repeatPassword, setRepeatPassword] = useState();
  const handlerChangePassword = async () => {
    const res = await api.user.changePassword({
      currentPassword,
      newPassword,
      repeatPassword,
    });
    if (res.status) {
      if (res.success === false) {
        noti.error(res?.data?.msg, 'error');
      } else {
        noti.success('Successful change password', 'success');
      }    
    } else {
      if (res?.data?.data) {
          noti.error(res?.data?.data[0]?.message, 'error'); 
      } else {
        noti.error(res?.data?.msg, 'error');
      }
    }
  };
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
          <Modal.Title>{'Setting'}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            zIndex: 1000,
          }}
        >
          <div className={classes.root}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1c-content'
                id='panel1c-header'
              >
                <div className={classes.column}>
                  <Typography className={classes.heading}>
                    Change Password
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Typography
                      style={{
                        width: '50%',
                      }}
                    >
                      Current Password
                    </Typography>
                    <TextField
                      style={{
                        marginLeft: '24px',
                      }}
                      type='password'
                      autoComplete='current-password'
                      variant='outlined'
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      style={{
                        width: '50%',
                      }}
                    >
                      New Password
                    </Typography>
                    <TextField
                      style={{
                        marginLeft: '24px',
                      }}
                      type='password'
                      autoComplete='current-password'
                      variant='outlined'
                      onChange={(e) => setNewPassword(e.target.value)}
                    />{' '}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      style={{
                        width: '50%',
                      }}
                    >
                      Repeat Password
                    </Typography>
                    <TextField
                      style={{
                        marginLeft: '24px',
                      }}
                      type='password'
                      autoComplete='current-password'
                      variant='outlined'
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />{' '}
                  </div>
                </div>
              </AccordionDetails>
              <Divider />
            </Accordion>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <AccordionActions>
            <Button size='small'>Cancel</Button>
            <Button
              size='small'
              color='primary'
              onClick={() => handlerChangePassword()}
            >
              Save
            </Button>
          </AccordionActions>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default SettingModal;
