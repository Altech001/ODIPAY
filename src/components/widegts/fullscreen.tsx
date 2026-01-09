import { Maximize, Minimize } from "lucide-react";
import { useEffect, useRef } from 'react';
import { useFullscreen } from 'react-haiku';

const FullscreenWidget = () => {
    const documentRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        documentRef.current = document.documentElement;
    }, []);

    const { isFullscreen, toggleFullscreen } = useFullscreen(documentRef);

    return (
        <button
            onClick={toggleFullscreen}
            className="relative flex items-center justify-center w-10 h-10 text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg hover:text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
            {isFullscreen ? (
                <Minimize className="w-5 h-5" />
            ) : (
                <Maximize className="w-5 h-5" />
            )}
        </button>
    );
};

export default FullscreenWidget;
