import { useState, useEffect, useRef } from 'react';
import pandaPic from './assets/panda-ears-possibly-nose.png';

const MAX_WIDTH = 500;

const Drawer = () => {
  const canvasRef = useRef(null);
  const hiddenFileInput = useRef(null);
  const hiddenFileLink = useRef(null);

  const [pandaImage, setPandaImage ] = useState({
    src: '',
    width: 0,
    height: 0
  });
  const [userImage, setUserImage ] = useState({
    src: '',
    width: 0,
    height: 0
  });
  const [pandaRatio, setPandaRatio] = useState(1);
  const [pandaRatioY, setPandaRatioY] = useState(1);
  const [pandaCoords, setPandaCoords] = useState({
    x: 0,
    y: 0
  });

  const [startMouseX, setStartMouseX] = useState(0);
  const [startMouseY, setStartMouseY] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);


  useEffect(() => {
    uploadPandaEarsAndPossiblyNose();
  }, [])

  useEffect(() => {
    if (canvasRef && userImage.src && pandaImage.src) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      let width = userImage.width;
      let height = userImage.height;

      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }

      canvasRef.current.width = width;
      canvasRef.current.height = height;

      context.drawImage(userImage.src, 0, 0, width, height);
      context.drawImage(pandaImage.src, pandaCoords.x, pandaCoords.y, 300 * pandaRatio, 300 * pandaRatioY * pandaRatio);
    }
  }, [userImage, pandaImage, pandaRatio, pandaCoords, pandaRatioY])


  function uploadPandaEarsAndPossiblyNose() {
    if (pandaImage.src) {
      return;
    }

    const img = new Image;
    img.onload = function(){
      setPandaImage({
        src: img,
        height: img.height,
        width: img.width
      })
    };
    img.src = pandaPic;
  }

  function handleChange(e) {
    const reader = new FileReader();
    reader.onload = function(e) {
      let img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        setUserImage({
          src: img,
          height: img.height,
          width: img.width
        })
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  function handleDownload() {
    if (!userImage.src || !hiddenFileLink) {
      return;
    }

    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/png");
    const link = hiddenFileLink.current;
    link.download = 'photo-ears.png';
    link.href = url;
    link.click();
  }

  function handleMouseDown(e) {
    setDragStartX(pandaCoords.x);
    setDragStartY(pandaCoords.y);
    setStartMouseX(e.clientX);
    setStartMouseY(e.clientY);
  }
  function handleMouseUp() {
    setStartMouseX(0);
    setStartMouseY(0);
  }

  function handleMouseMove(e) {
    if (!startMouseX || !startMouseY) {
      return;
    }

    setPandaCoords({
      x: dragStartX + e.clientX - startMouseX,
      y: dragStartY + e.clientY - startMouseY
    })

  }

  return <>
    <canvas ref={canvasRef} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />
    <div>Drag ears to position it</div>
    <div>
      <button onClick={() => setPandaRatio(prev => prev + 0.1)}> Bigger </button>
      <button onClick={() => setPandaRatio(prev => prev - 0.1)}> Smaller </button>
      <button onClick={() => setPandaRatioY(prev => prev + 0.1)}> Taller </button>
      <button onClick={() => setPandaRatioY(prev => prev - 0.1)}> Shorter </button>
    </div>
    <div>
      <button onClick={() => hiddenFileInput && hiddenFileInput.current.click()}>Upload image</button>
      <button onClick={handleDownload} disabled={!userImage.src}>Download image</button>
    </div>
    <input className="hiddenControl" ref={hiddenFileInput} type="file" accept="image/*" onChange={handleChange} />
    <a className="hiddenControl" ref={hiddenFileLink} ></a>
    </>
}

export default Drawer;