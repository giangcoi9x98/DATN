import { useSnackbar } from 'notistack';
import React, {memo} from 'react';

const InnerNotificator = memo((props)=> {
  props.setUseSnackbarRef(useSnackbar());
  return null;
})
let useSnackbarRef;
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp;
};
export const Notificator = memo(() => {
    return <InnerNotificator
      setUseSnackbarRef={setUseSnackbarRef} />;
})
const noti = {
  success(msg) {
    this.toast(msg, 'success');
  },
  warning(msg) {
    this.toast(msg, 'warning');
  },
  info(msg) {
    this.toast(msg, 'info');
  },
  error(msg) {
    this.toast(msg, 'error');
  },
  toast(msg, variant = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, { variant });
  },
};
export default noti;