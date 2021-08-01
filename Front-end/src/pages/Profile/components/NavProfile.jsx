import React, { useEffect, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  root: {
    width: 500,
    fontSize: '1rem',
  },
  label: {
    color: 'black',
    fontSize: '1rem',
    fontWeight: 500,
  },
});

const SimpleBottomNavigation = memo(({setNavProfile, navProfile}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { t, i18n } = useTranslation('common');
  useEffect(() => {
    setNavProfile(value)
  }, [setNavProfile, value])
  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setNavProfile(newValue)
        setValue(newValue)
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        className={classes.label}
        label={t('profile.post')}
      />
      <BottomNavigationAction
        className={classes.label}
        label={t('profile.image')}
      />
      <BottomNavigationAction
        className={classes.label}
        label={t('profile.friend')}
      />
    </BottomNavigation>
  );
})

export default SimpleBottomNavigation