import React from 'react';

type WebViewProps = {
  url: string | null; // The URL can be null if not provided
};

const WebView = ({ url }: WebViewProps) => {
  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No URL provided
      </div>
    );
  }

  return (
    <div className="relative w-[200px] h-[150px] p-1 overflow-hidden">
      <iframe
        src={url}
        title="Web View"
        style={{
          width: '700px',
          height: '560px',
          transform: 'scale(0.2857)',
          transformOrigin: '0 0',
        }}
        className="m-4 mx-auto"
        allowFullScreen
      />
    </div>
  );
};
export default WebView;
