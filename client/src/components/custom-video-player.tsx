import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomVideoPlayerProps {
  videoId: string;
  title?: string;
  className?: string;
}

export default function CustomVideoPlayer({ videoId, title = "Vídeo", className = "" }: CustomVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Carregar API do YouTube
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Função global para callback do YouTube
    (window as any).onYouTubeIframeAPIReady = () => {
      youtubePlayerRef.current = new (window as any).YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          cc_load_policy: 0,
          playsinline: 1,
          title: 0,
          byline: 0,
          portrait: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [videoId]);

  const onPlayerReady = (event: any) => {
    setIsLoading(false);
    setDuration(event.target.getDuration());
    
    // Atualizar tempo atual
    const updateTime = () => {
      if (youtubePlayerRef.current) {
        setCurrentTime(youtubePlayerRef.current.getCurrentTime());
      }
    };
    
    setInterval(updateTime, 1000);
  };

  const onPlayerStateChange = (event: any) => {
    const YT = (window as any).YT;
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (youtubePlayerRef.current) {
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo();
      } else {
        youtubePlayerRef.current.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (youtubePlayerRef.current) {
      if (isMuted) {
        youtubePlayerRef.current.unMute();
      } else {
        youtubePlayerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const restart = () => {
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.seekTo(0);
      youtubePlayerRef.current.playVideo();
    }
  };

  const fullscreen = () => {
    if (playerRef.current) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (youtubePlayerRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const seekTime = (clickX / rect.width) * duration;
      youtubePlayerRef.current.seekTo(seekTime);
    }
  };

  return (
    <div 
      ref={playerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Player do YouTube */}
      <div className="relative aspect-video">
        <div id="youtube-player" className="absolute inset-0 w-full h-full"></div>
        

        
        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="animate-spin w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Overlay de controles */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Controles principais */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Barra de progresso */}
            <div 
              className="w-full h-2 bg-gray-600 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-netflix-red rounded-full transition-all duration-200"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>

            {/* Controles de botões */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={togglePlay}
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  onClick={restart}
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <Button
                  onClick={toggleMute}
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>

                <span className="text-white text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-white text-sm font-medium">{title}</span>
                
                <Button
                  onClick={fullscreen}
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}