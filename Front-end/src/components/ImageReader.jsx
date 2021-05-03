import Reatc, { useState } from 'react';

function ImageReader(props) {
  const { image, width, height } = props;
  const [url, setUrl] = useState('');
  const reader = new FileReader();
  const imageUrl = reader.readAsDataURL(image);
  reader.onloadend = function (e) {
    setUrl(reader.result);
  };
  console.log(url); // Would see a path?
  console.log(props);
  return (
    <div

    >
      <img style={{
        width: width,
        height:height
      }} src={url} />
    </div>
  );
}

export default ImageReader;
