import React, { memo, useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
const Comment = memo((props) => {
  const [comment, setComment] = useState(null);

  useEffect(() => {
    setComment(props.comment);
  }, [props.comment]);
  return (
    <div>
      <Typography paragraph>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '40px', height: '40px', marginRight: '10px' }}>
            <img
              style={{
                borderRadius: '50%',
                backgroundSize: 'cover',
                width: '40px',
                height: '40px',
              }}
              src={comment?.detailUserComment?.avatar}
              alt=''
            />
          </div>
          <div
            style={{
              paddingLeft: '10px',
              width: '100%',
              backgroundColor: '#f0f2f5',
              borderRadius: '15px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <p style={{ padding: '0px', margin: '0px' }}>
                {comment?.detailUserComment?.fullname}{' '}
              </p>
              <Typography
                style={{
                  marginRight: '12px',
                }}
              >
                {moment(comment?.create_at).format('MM-DD-YYYY, h:mm:ss a')}
              </Typography>
            </div>
            <p
              style={{
                fontSize: '13px',
                color: ' rgba(0, 0, 0, 0.54)',
                padding: '0px',
                margin: '0px',
              }}
            >
              {' '}
              {comment?.content}
            </p>
            <span style={{ fontSize: '13px' }}> Thich </span>
            <span style={{ fontSize: '13px', paddingLeft: '10px' }}>
              {' '}
              Trả lời
            </span>
          </div>
        </div>
        {/* <div
              style={{
                display: 'flex',
                marginBottom: '10px',
                marginLeft: '40px',
                marginTop: '10px',
              }}
            >
              <div style={{ width: '25px', height: '25px' }}>
                <img
                  style={{
                    borderRadius: '50%',
                    backgroundSize: 'cover',
                    width: '25px',
                    height: '25px',
                  }}
                  src='img\instagram.png'
                  alt=''
                />
              </div>
              <div
                style={{
                  paddingLeft: '10px',
                  width: '100%',
                  backgroundColor: '#f0f2f5',
                  borderRadius: '15px',
                }}
              >
                <p style={{ padding: '0px', margin: '0px', fontSize: '13px' }}>
                  {' '}
                  Giang Tran{' '}
                </p>
                <p style={{ fontSize: '13px', color: ' rgba(0, 0, 0, 0.54)' }}>
                  {' '}
                  Xin chao moi ng{' '}
                </p>
              </div>
            </div> */}
      </Typography>
    </div>
  );
});

export default Comment;
