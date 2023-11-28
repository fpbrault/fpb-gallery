import React from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';

const Breadcrumbs = ({ items } : any) => {
  return (
    <ol className="flex items-center justify-center pb-4 mx-auto uppercase md:justify-left whitespace-nowrap" aria-label="Breadcrumb">
      <li className="inline-flex items-center">
        <Link className="flex items-center text-sm link-secondary " href="/">
            Home
        </Link>
        <svg
          className="flex-shrink-0 w-4 h-4 mx-2 overflow-visible text-base-content"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </li>
      {items.map((item: { url: string | UrlObject; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined; }, index: React.Key | null | undefined) => (
        <li key={index} className="inline-flex items-center">
          {item.url ? (
         <>   <Link href={item.url} className="flex items-center text-sm link-secondary ">
                {item.name}
               
            </Link> {index !== items.length - 1 && (
                  <svg
                    className="flex-shrink-0 w-4 h-4 mx-2 overflow-visible text-base-content"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                )}</>
          ) : (
            <span className="flex items-center text-sm font-semibold truncate text-secondary" aria-current="page">
              {item.name}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
};

export default Breadcrumbs;
