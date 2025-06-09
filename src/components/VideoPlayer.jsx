import { Play } from "lucide-react";

const { useState, useRef } = require("react");

const VideoPlayer = ({ src, type }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
  
    const handlePlayPause = (e) => {
      e.stopPropagation();
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };
  
    return (
      <div className="relative flex item-center justify-center w-full h-full">
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full rounded-md"
          muted
          playsInline
          onClick={handlePlayPause}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        >
          <source src={src} type={type} />
          Your browser does not support the video tag.
        </video>
        {/* <iframe
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full rounded-md"
          muted
          playsInline
          onClick={handlePlayPause}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        >
          <source src={src} type={type} />
          Your browser does not support the video tag.
        </iframe> */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-opacity duration-200"
              onClick={handlePlayPause}
            >
              <Play className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
      </div>
    );
  };

  export default VideoPlayer;