import React, { useEffect, useRef } from 'react';

import IframeResizer from '@iframe-resizer/react';

type WebViewProps = {
  url: string | null; // The URL can be null if not provided
};

const WebView = ({ url }: WebViewProps) => {
  const iframeRef = useRef(null);

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No URL provided
      </div>
    );
  }

  return (
    <IframeResizer
      license="GPLv3"
      src={url}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '120%',
        height: '120%',
        pointerEvents: 'none',
      }}
      loading="eager"
      forwardRef={iframeRef}
      inPageLinks
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  );
};

export default WebView;
