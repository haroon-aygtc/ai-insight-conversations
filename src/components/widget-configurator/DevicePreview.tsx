import { ReactNode, useState } from 'react';
import { Maximize, Minimize, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DevicePreviewProps {
  device: 'desktop' | 'tablet' | 'mobile';
  children: ReactNode;
}

const DevicePreview = ({ device, children }: DevicePreviewProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getDeviceStyles = () => {
    if (isFullscreen) {
      return {
        wrapper: 'fixed inset-0 z-50 flex items-center justify-center bg-black/80',
        frame: '',
        notch: false,
        scale: 1,
      };
    }

    switch (device) {
      case 'desktop':
        return {
          wrapper: 'w-full mx-auto flex justify-center',
          frame: 'rounded-lg border border-gray-200 shadow-md overflow-hidden bg-white',
          topBar: 'h-7 bg-gray-100 border-b border-gray-200 flex items-center px-3',
          notch: false,
          scale: 1,
        };
      case 'tablet':
        return {
          wrapper: 'mx-auto flex justify-center',
          frame: 'rounded-[20px] border-[12px] border-gray-800 overflow-hidden bg-white shadow-2xl',
          topBar: '',
          notch: false,
          scale: 0.85,
        };
      case 'mobile':
        return {
          wrapper: 'mx-auto flex justify-center',
          frame: 'rounded-[32px] border-[12px] border-gray-800 overflow-hidden bg-white shadow-2xl',
          topBar: '',
          notch: true,
          scale: 0.68,
        };
      default:
        return {
          wrapper: 'w-full mx-auto',
          frame: '',
          topBar: '',
          notch: false,
          scale: 1,
        };
    }
  };

  const { wrapper, frame, topBar, notch, scale } = getDeviceStyles();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    setIsFullscreen(false);
  };

  return (
    <div className={wrapper}>
      <div
        className={cn(
          "device-frame relative transition-all duration-300",
          frame
        )}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center top',
          maxWidth: '100%',
        }}
      >
        {/* Browser-like top bar for desktop */}
        {device === 'desktop' && !isFullscreen && (
          <div className={topBar}>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
          </div>
        )}

        {/* iPhone-like notch for mobile */}
        {notch && (
          <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
            <div className="bg-black w-1/3 h-5 rounded-b-2xl"></div>
          </div>
        )}

        {/* Content */}
        <div className="device-content">
          {children}
        </div>

        {/* Fullscreen controls */}
        {isFullscreen ? (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-gray-800/70 hover:bg-gray-800 text-white border-none"
              onClick={handleClose}
            >
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-gray-800/70 hover:bg-gray-800 text-white border-none"
              onClick={toggleFullscreen}
            >
              <Minimize className="h-4 w-4 mr-1" />
              Exit Fullscreen
            </Button>
          </div>
        ) : (
          <Button
            onClick={toggleFullscreen}
            className="absolute top-2 right-2 p-1.5 h-auto w-auto bg-gray-800/50 hover:bg-gray-800/80 rounded-full text-white transition-colors z-10"
            variant="ghost"
            size="sm"
          >
            <Maximize className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Device buttons for mobile & tablet */}
        {(device === 'mobile' || device === 'tablet') && !isFullscreen && (
          <>
            {/* Power button */}
            <div className="absolute right-[-16px] top-16 w-[4px] h-12 bg-gray-700 rounded-r-lg"></div>

            {/* Volume buttons */}
            <div className="absolute left-[-16px] top-16 w-[4px] h-8 bg-gray-700 rounded-l-lg"></div>
            <div className="absolute left-[-16px] top-28 w-[4px] h-8 bg-gray-700 rounded-l-lg"></div>

            {/* Home indicator for modern devices */}
            {device === 'mobile' && (
              <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                <div className="w-1/3 h-1 bg-black rounded-full"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DevicePreview;
