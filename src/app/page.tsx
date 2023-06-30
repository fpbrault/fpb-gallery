import Header from '@/components/Header';
import getImages from '@/components/ImageUtils';
import PhotoGallery from '@/components/PhotoGallery';


export default async function Home() {

  const images = await getImages('s3');

  return (
    <main className="w-full h-full p-4">
      <Header title="Felix Perron-Brault | Photographe" contactText="fpbrault" contactUrl="https://www.instagram.com/fpbrault/" />
      <div>
        {Array.isArray(images) && images.length > 0 ? (
          <PhotoGallery shuffle={true} images={images as CustomImage[]} />
        ) : null}
      </div>
      <div className='my-4 font-sans text-sm text-center'>Copyright {new Date().getFullYear()} Felix Perron-Brault. Tout Droits Reservés</div>
    </main >
  );
}
