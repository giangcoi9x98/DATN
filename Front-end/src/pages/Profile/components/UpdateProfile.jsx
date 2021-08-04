import React, { memo, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tooltip,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@material-ui/core';
import moment from 'moment';
import api from '../../../api';
import { Button } from 'react-bootstrap';
import noti from '../../../components/Notification';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const UpdateProfile = memo((props) => {
  const classes = useStyles();
  const { profile, onClose } = props;
  const [phone, setPhone] = useState(profile?.userData?.phone);
  const [fullName, setFullName] = useState(profile?.userData?.fullname);
  const [company, setCompany] = useState(profile?.userData?.company);
  const [gender, setGender] = useState(profile?.userData?.gender);
  const [birthday, setBirthday] = useState(profile?.userData?.birthday);
  // const { t, i18n } = useTranslation('common');

  const handlerUpdateProfile = async () => {
    const res = await api.user.updateAccount({
      fullname: fullName,
      company,
      phone: phone.toString(),
      birthday: birthday.toString(),
      gender,
    });
    if (res.status) {
      noti.success('Update success', 'successs')
    } else {
      noti.error('Update failed', 'error')
    }
  };
  return (
    <form className={classes.root} noValidate autoComplete='off'>
      <div>
        <TextField
          variant='outlined'
          label='Fullname'
          defaultValue={profile?.userData?.fullname}
          helperText={
            <Tooltip title='The field cannot be empty' arrow placement='bottom'>
              <Typography
                style={{
                  fontSize: '12px',
                }}
              >
                Required(*)
              </Typography>
            </Tooltip>
          }
          onChange={(e) => {
            setFullName(e.target.value);
          }}
        />
        <TextField
          label='Company'
          variant='outlined'
          defaultValue={profile?.userData.company}
          onChange={(e) => {
            setCompany(e.target.value);
          }}
        />
      </div>
      <div>
        <TextField
          label='Birthday'
          defaultValue={moment(profile?.userData?.birthday).format(
            'YYYY-MM-DD'
          )}
          variant='outlined'
          type='date'
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            setBirthday(e.target.value);
          }}
        />
        <TextField
          variant='outlined'
          label='Phone'
          defaultValue={profile?.userData?.phone}
          // type='number'
          onKeyPress={(e) => {
            const keyCode = e.charCode;
            if (e.target.value.length > 9) {
              e.preventDefault();
            }
            if (keyCode === 46) {
              e.preventDefault();
              return 0;
            }
            if (
              keyCode <= 45 ||
              (keyCode > 57 && keyCode !== 47 && keyCode !== 48)
            ) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/[^0-9]/g, '');
            setPhone(onlyNums);
          }}
        />
      </div>
      <div>
        <FormControl
          variant='outlined'
          style={{
            width: '43%',
            marginTop: '16px',
            marginLeft: '8px',
          }}
        >
          <InputLabel id='demo-simple-select-outlined-label'>Gender</InputLabel>
          <Select
            labelId='demo-simple-select-outlined-label'
            id='demo-simple-select-outlined'
            value={profile?.userData?.gender}
            onChange={(e) => setGender(e.target.value)}
            label='Gender'
          >
            <MenuItem value={'Male'}>Male</MenuItem>
            <MenuItem value={'Female'}>Female</MenuItem>
            <MenuItem value={'Other'}>Other</MenuItem>
          </Select>
        </FormControl>
        <Divider
          style={{
            width:"100%",
            marginTop: '12px',
            marginBottom: '12px',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant='secondary'
          style={{
            width: '45%',
          }}
          onClick = {() => onClose()}
        >
          Close
        </Button>
        <Button
          variant='primary'
          onClick={handlerUpdateProfile}
          style={{
            width: '45%',
          }}
        >
          Update
        </Button>
      </div>
    </form>
  );
});

export default UpdateProfile;
