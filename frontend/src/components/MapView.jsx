import React from 'react';

const MapView = ({ location }) => {
  // Fallback map using iframe for visual demo if mapbox token isn't provided
  return (
    <div className="w-full h-[400px] bg-gray-200 rounded-2xl overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
        <span className="text-gray-400">Loading map...</span>
      </div>
      <iframe
        width="100%"
        height="100%"
        className="relative z-10"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
      ></iframe>
    </div>
  );
};

export default MapView;
