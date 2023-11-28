
import AlbumGallery from '@/components/AlbumGallery';
import Header from '@/components/Header';
import PhotoGallery from '@/components/PhotoGallery';
import useSWR from 'swr';

const fetcher = (url: RequestInfo | URL) => fetch(url).then(r => r.json())



export default function Home() {

  const { data, error } = useSWR('/api/categories', fetcher)

  if (!data || !data.length) {
    return null
  }
  return (
      <div className='my-4 font-sans text-sm text-center'>
        <AlbumGallery categories={true} albums={data} />
      </div>
  );
}
