import PhotoGallery from '@/components/PhotoGallery';
import { promises as fs } from 'fs';
import path from 'path';
import sizeOf from 'image-size'
import Link from 'next/link';

export default async function Home() {

  function getNumberFromFilename(filename: string) {
    const matches = filename.match(/(\d+)/);
    return matches ? parseInt(matches[0], 10) : 0;
  }
  const imageDirectory = path.join(process.cwd(), '/public/images');
  const imageFilenames = await fs.readdir(imageDirectory);

  // Filter image filenames to include only JPG files
  const jpgFilenames = imageFilenames.filter((filename) =>
    filename.toLowerCase().endsWith('.jpg')
  );
  const sortedFilenames = jpgFilenames.sort((a, b) => {
    const aNumber = getNumberFromFilename(a);
    const bNumber = getNumberFromFilename(b);
    return aNumber - bNumber;
  });

  const imagePromises = sortedFilenames.map(async (image) => {
    const imagePath = path.join(imageDirectory, image);
    const dimensions = sizeOf(imagePath);

    if (dimensions && dimensions.width && dimensions.height) {
      return {
        src: "/images/" + image,
        original: "/images/" + image,
        width: dimensions.width || 600,
        height: dimensions.height || 400,
      };
    }
    return null;

  });


  const images: CustomImage[] = (await Promise.all(imagePromises)).filter(
    (image): image is CustomImage => image !== null
  );

  return (
    <main className="w-full h-full p-4">
      <h1 className='mt-8 mb-2 font-sans text-3xl font-light text-center'>Felix Perron-Brault | Photographe</h1>
      <div className='mb-2 font-sans text-center text-md'>Contact: <span className='font-medium text-green-600 dark:text-green-500 hover:underline'><Link target='_blank' href={'https://www.instagram.com/fpbrault/'}><svg className='inline mr-1 fill-green-600' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">{/* <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}<path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg>fpbrault</Link></span></div>
      <div>
        <PhotoGallery images={images}></PhotoGallery>
      </div>
      <div className='my-4 font-sans text-sm text-center'>Copyright {new Date().getFullYear()} Felix Perron-Brault. Tout Droits Reservés</div>
    </main>
  );
}
