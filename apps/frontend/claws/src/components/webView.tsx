import React from 'react';

type WebViewProps = {
  url: string | null; // The URL can be null if not provided
};

const WebView = ({ url }: WebViewProps) => {
  if (!url) {
    return <div className="w-full h-full flex items-center justify-center text-gray-500">No URL provided</div>;
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[700px] h-[560px]">
        <iframe
          src={url}
          title="Web View"
          className="w-full h-full border-none"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default WebView;
