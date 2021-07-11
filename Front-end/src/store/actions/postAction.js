import api from '../../api'

export const GET_ALL_POST = 'GET_ALL_POST'
export const GET_NOTI_POST = 'GET_NOTI_POST'


export const fetchAllPost = () => {
  return async (dispatch) => {
    await api.post.getAllPost().then((res) => {
      dispatch({
        type: 'GET_ALL_POST',
        payload: res.data.data
      })
    })
  }
}

export const getAllNotiPost = () => {
  return async (dispatch) => {
    await api.post.getNotiPost().then((res) => {
      dispatch({
        type: 'GET_NOTI_POST',
        payload: res.data.data
      })
    })
  }
}