'use client'
import Header from '@/components/Header';
import PhotoGallery from '@/components/PhotoGallery';
import useSWR from 'swr';

const fetcher = (url: RequestInfo | URL) => fetch(url).then(r => r.json())



export default function Home() {

  const { data, error } = useSWR('/api/data', fetcher)

  if (!data || !data.length) {
    return null
  }

  return (
    <main className="w-full h-full p-4">
      <Header title="Felix Perron-Brault | Photographe" contactText="fpbrault" contactUrl="https://www.instagram.com/fpbrault/" />
      <div>
        <PhotoGallery shuffle={true} images={data} />

      </div>
      <div className='my-4 font-sans text-sm text-center'>Copyright {new Date().getFullYear()} Felix Perron-Brault. Tout Droits Reservés</div>
    </main >
  );
}
