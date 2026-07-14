import React from 'react'

export default function PageImageTemp({ page, style }) {
  return (
    <img
      src={page.content.featuredImageUrl}
      alt="Magazine Page"
      style={{
        width: "100%",
        height: "auto",
        objectFit: "contain", // this fixes the zoom/cropping
        ...style,
      }}
    />
  );
}
