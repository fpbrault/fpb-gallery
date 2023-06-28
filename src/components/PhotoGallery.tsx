'use client';
import * as React from 'react';

import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import { NextJsImage, NextJsImageAlbum } from './NextJsImage';

type Props = {
    images: CustomImage[];
};

function PhotoGallery({ images }: Props) {
    const [shuffledImages, setShuffledImages] = React.useState<CustomImage[]>([]);
    const [isLightboxEnabled, setIsLightboxEnabled] = React.useState(true);

    React.useEffect(() => {
        const shuffled = [...images]; // Create a new array to avoid mutating the original array
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setShuffledImages(shuffled);

        // Disable lightbox on mobile devices
        setIsLightboxEnabled(!window.matchMedia('(max-width: 768px)').matches);

        // Add event listener for window resize
        window.addEventListener('resize', handleWindowResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [images]);

    const [index, setIndex] = React.useState(-1);

    const handleWindowResize = React.useCallback(() => {
        setIsLightboxEnabled(!window.matchMedia('(max-width: 768px)').matches);
    }, []);

    return (
        <>
            <PhotoAlbum
                layout="rows"
                photos={shuffledImages}
                targetRowHeight={500}
                renderPhoto={NextJsImageAlbum}
                sizes={{ size: '800px' }}
                onClick={({ index: current }) => isLightboxEnabled && setIndex(current)}
            />

            {isLightboxEnabled && (
                <Lightbox
                    index={index}
                    slides={shuffledImages}
                    plugins={[Fullscreen]}
                    render={{ slide: NextJsImage }}
                    open={index >= 0}
                    close={() => setIndex(-1)}
                />
            )}
        </>
    );
}

export default PhotoGallery;
