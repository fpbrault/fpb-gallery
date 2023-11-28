// pages/album/[albumId].tsx
import { useRouter } from 'next/router';
import PhotoGallery from '@/components/PhotoGallery';
import useSWR from 'swr';
import Breadcrumbs from '@/components/BreadCrumbs';
import { PortableText } from '@portabletext/react'
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';


const fetcher = (url: RequestInfo | URL) => fetch(url).then(r => r.json())

const myPortableTextComponents = {
  types: {
    image: ({ value } : any) => {
      const src = urlForImage(value).url();
      return (
        <Image width={200} height={200} alt="" quality={75} {...value} src={src} />
      );
    },
  },
};


const AlbumPage = () => {
  const router = useRouter();
  const { albumId } = router.query;
  const shouldFetch = albumId ?? false

  const { data, error } = useSWR(shouldFetch ? ('/api/albums/' + albumId):null, fetcher)

  if (!data) {
    return null
  }

  // Fetch data for the specific album using albumId

  return (

    <>
      <Breadcrumbs items={[{ "name": data.category.categoryName, "url": "/category/" + data.category.categoryName }, { "name": data.albumName }]
      }></Breadcrumbs>
      <div className='max-w-xl pb-8 mx-auto prose text-center text-sans'>
        <h2>{data.albumName}</h2>
        <PortableText value={data.description}  components={myPortableTextComponents}/>
      </div>
      <PhotoGallery mode={data.display} columns={data.columns} images={data.images} albumId={data.albumId} />
    </>
  );
};

export default AlbumPage;
