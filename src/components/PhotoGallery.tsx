'use client'
import * as React from "react";

import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { NextJsImage, NextJsImageAlbum } from "./NextJsImage";

type Props = { images: CustomImage[] };

function PhotoGallery({ images }: Props) {
    const [index, setIndex] = React.useState(-1);
    return (
        <>

            <PhotoAlbum
                layout="rows"
                photos={images}
                targetRowHeight={500}
                renderPhoto={NextJsImageAlbum}
                sizes={{ size: "800px" }}
                onClick={({ index: current }) => setIndex(current)}
            />

            <Lightbox
                index={index}
                slides={images}
                render={{ slide: NextJsImage }}
                open={index >= 0}
                close={() => setIndex(-1)}
            />
        </>
    );
}

export default PhotoGallery;