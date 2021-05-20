import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
  
  },
}))(MenuItem);

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        <MailIcon></MailIcon>
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem style={{height:"72px", width:"400px"}}>
          <ListItemIcon style={{width:"50px", height:"50px",}}>
            <div style={{width:"10px", height:"10px", position:"absolute", top:"68%", left:"13%"}}>
              <div style={{backgroundColor:"#31a24c", width:"10px", height:"10px", borderRadius:"50%"}}> </div>
            </div>
            <img style={{borderRadius:"50%", backgroundSize:"cover", width:"50px", height:"50px"}} src="img\profile-bg.jpg" alt="" />
          </ListItemIcon>
          <div style={{marginTop: "2px", marginLeft:"7px"}}>
            <p style={{margin:"0px", padding:"0px", fontSize:"17px", color:"#050505"}}>Giang</p>
            <p style={{margin:"0px", padding:"0px", fontSize:"13px", color:"#9a9b9d"}}>Da gui tin nhan cho b</p>
          </div>
        </StyledMenuItem>
        <StyledMenuItem style={{height:"72px", width:"400px"}}>
          <ListItemIcon style={{width:"50px", height:"50px",}}>
            <div style={{width:"10px", height:"10px", position:"absolute", top:"68%", left:"13%"}}>
              <div style={{backgroundColor:"#31a24c", width:"10px", height:"10px", borderRadius:"50%"}}> </div>
            </div>
            <img style={{borderRadius:"50%", backgroundSize:"cover", width:"50px", height:"50px"}} src="img\profile-bg.jpg" alt="" />
          </ListItemIcon>
          <div style={{marginTop: "2px", marginLeft:"7px"}}>
            <p style={{margin:"0px", padding:"0px", fontSize:"17px", color:"#050505"}}>Giang</p>
            <p style={{margin:"0px", padding:"0px", fontSize:"13px", color:"#9a9b9d"}}>Da gui tin nhan cho b</p>
          </div>
        </StyledMenuItem>
        <StyledMenuItem style={{height:"72px", width:"400px"}}>
          <ListItemIcon style={{width:"50px", height:"50px",}}>
            <div style={{width:"10px", height:"10px", position:"absolute", top:"68%", left:"13%"}}>
              <div style={{backgroundColor:"#31a24c", width:"10px", height:"10px", borderRadius:"50%"}}> </div>
            </div>
            <img style={{borderRadius:"50%", backgroundSize:"cover", width:"50px", height:"50px"}} src="img\profile-bg.jpg" alt="" />
          </ListItemIcon>
          <div style={{marginTop: "2px", marginLeft:"7px"}}>
            <p style={{margin:"0px", padding:"0px", fontSize:"17px", color:"#050505"}}>Giang</p>
            <p style={{margin:"0px", padding:"0px", fontSize:"13px", color:"#9a9b9d"}}>Da gui tin nhan cho b</p>
          </div>
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}
