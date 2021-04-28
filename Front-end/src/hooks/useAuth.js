import jwt from 'jsonwebtoken';
const useAuth = () => {
  const token = localStorage.getItem('token');
  if (jwt.decode(token)) {
    return true;
  } else {
    return false;
  }
};

export {
  useAuth
};
