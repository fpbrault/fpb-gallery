import React from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';
import {
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Breadcrumbs = ({ items, context }: any) => {
  return (<div className='flex'>
    <div className="max-w-xs mx-auto uppercase md:max-w-3xl sm:max-w-xl lg:max-w-4xl breadcrumbs">
      <ul aria-label="Breadcrumb">
        <li className="inline-flex items-center">
          <Link className="flex items-center w-4 h-4 text-sm link-secondary " href="/">
            <FontAwesomeIcon icon={faHome} />
          </Link>
        </li>
        {items.map((item: { url: string | UrlObject; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined; }, index: React.Key | null | undefined) => (
          <li key={index} className="inline-flex items-center">
            {item.url ? (
              <Link href={item.url} className="flex items-center text-sm link-secondary ">
                {item.name}

              </Link>
            ) : (
              <span className="flex items-center text-sm font-semibold truncate text-secondary" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div></div>
  );
};

export default Breadcrumbs;
