import React, { useRef, useState, useEffect } from 'react';
import { useGesture } from '@use-gesture/react';

export default function PageImageTemp({ page, style }) {
  const imageRef = useRef(null); 
  const imageContainerRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });

  // 1. Store latest state in a Ref to defeat stale closures in the gesture hook
  const cropRef = useRef(crop);
  useEffect(() => {
    cropRef.current = crop;
  }, [crop]);

  useGesture(
    {
      // 2. Use `offset` instead of `movement` to receive the cumulative offset (from + movement)
      onDrag: ({ offset: [x, y] }) => {
        setCrop((c) => ({ ...c, x, y }));
      },
      onPinch: ({memo, origin: [pinchOriginX, pinchOriginY], movement: [md], offset: [d] }) => {
        memo ??= {bounds: imageRef.current.getBoundingClientRect(), crop}
        
        const transformOriginX = memo.bounds.x + memo.bounds.width / 2;
        const transformOriginY = memo.bounds.y + memo.bounds.height / 2;

        const displacementX = (transformOriginX - pinchOriginX) / memo.crop.scale;
        const displacementY = (transformOriginY - pinchOriginY) /memo.crop.scale;

        const initialOffsetDistance = (memo.crop.scale - 1) * 50;
        const movementDistance = d - initialOffsetDistance;

        setCrop((crop) => ({
          ...crop,
          scale: 1 + d / 50,
          x: memo.crop.x + (displacementX * movementDistance) / 50,
          y: memo.crop.y + (displacementY * movementDistance) / 50,

        }));



        // setCrop((c) => ({ ...c, scale: 1 + d / 15 }));
      },
      onDragEnd: AdjustImage,
      onPinchEnd: AdjustImage,
    },
    {
      drag: {
        // 3. Read directly from cropRef.current so `from` always gets the current state
        from: () => [cropRef.current.x, cropRef.current.y],
      },
      pinch:{
        distanceBounds: {min: 0},
      },
      target: imageRef,
      eventOptions: { passive: false }, 
    }
  );

  function AdjustImage(){
    const imageBounds = imageRef.current?.getBoundingClientRect();
    const containerBounds = imageContainerRef.current?.getBoundingClientRect();
    const originalWidth = imageRef.current.clientWidth;
    const widthOverhang = (imageBounds.width - originalWidth) /2;
    const originalHeight = imageRef.current.clientHeight;
    const heightOverhang = (imageBounds.height - originalHeight) / 2;

    if (imageBounds && containerBounds) {
      setCrop((prevCrop) => {
        const updated = { ...prevCrop };
        if (imageBounds.left > containerBounds.left) {
          updated.x = widthOverhang;
        } else if (imageBounds.right < containerBounds.right) {
          updated.x = -(imageBounds.width - containerBounds.width) + widthOverhang;
        }

        if (imageBounds.top > containerBounds.top) {
          updated.y = heightOverhang;
        } else if (imageBounds.bottom < containerBounds.bottom) {
          updated.y = -(imageBounds.height - containerBounds.height) + heightOverhang;
        }
        return updated;
      });
    }
  }

  return (
    <div className="overflow-hidden ring-4 ring-blue-500 aspect-w-3 aspect-h-4">
      <div ref={imageContainerRef}>
        <img
          ref={imageRef}
          src={page.content.featuredImageUrl}
          alt="Magazine Page"          
          style={{
            transform: `translate3d(${crop.x}px, ${crop.y}px, 0) scale(${crop.scale})`,
            width: "100%",
            height: "auto",
            objectFit: "contain",
            touchAction: "none", 
            ...style,
          }}
          className="relative w-full h-auto object-contain max-w-none touch-none"
        />
      </div>
    </div>
  );
}