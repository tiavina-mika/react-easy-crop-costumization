import React, { useState, useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Slider from '@material-ui/core/Slider'
import Cropper from 'react-easy-crop'
import './styles.css'
import imageMask from './mask-circle.png'
import image from './image.jpg'

const MASK_WIDTH = 614
const MASK_HEIGHT = 591

const App = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [initialZoom, setInitialZoom] = useState(1)
  const [originalImageSize, setOriginalImageSize] = useState(null)

  const onMediaLoaded = (mediaSize) => {
    setOriginalImageSize({
      width: mediaSize.naturalWidth,
      height: mediaSize.naturalHeight,
    })
    let defaultZoom

    if (mediaSize.naturalHeight >= mediaSize.naturalWidth) {
      defaultZoom = MASK_WIDTH / mediaSize.naturalWidth
    } else {
      defaultZoom = MASK_WIDTH / mediaSize.naturalHeight
    }

    setZoom(defaultZoom)
    setInitialZoom(defaultZoom)
  }

  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      if (!originalImageSize) return
      console.log('originalImageSize: ', originalImageSize)
      const zoomedImageWidth = originalImageSize.width * zoom
      const zoomedImageHeight = originalImageSize.height * zoom

      const top = (originalImageSize.height - croppedAreaPixels.height) / 2
      console.log('top', top)
      const left = (originalImageSize.width - croppedAreaPixels.width) / 2
      console.log('left', left)
      console.log('finalImage: ', {
        width: Math.round(zoomedImageWidth),
        height: Math.round(zoomedImageHeight),
      })
      console.log(croppedArea, croppedAreaPixels)
    },
    [originalImageSize, zoom]
  )

  return (
    <div
      style={{
        position: 'relative',
        height: MASK_HEIGHT + 550,
        display: 'flex',
      }}
    >
      <div className="App">
        <div className="crop-container">
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              width: MASK_WIDTH,
              height: MASK_HEIGHT,
              zIndex: 20,

              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              overflow: 'hidden',

              boxShadow: '0 0 0 9999em',

              WebkitMaskImage: `url(${imageMask})`,
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              zIndex: 12,

              boxSizing: 'border-box',
              boxShadow: '0 0 0 9999em',
              color: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          />
          <Cropper
            image={image}
            crop={crop}
            minZoom={initialZoom}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropSize={{ width: MASK_WIDTH, height: MASK_HEIGHT }}
            style={{ cropAreaStyle: { opacity: 0 } }}
            onMediaLoaded={onMediaLoaded}
          />
        </div>
        <div className="controls">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoom) => setZoom(zoom)}
            classes={{ container: 'slider' }}
          />
        </div>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
