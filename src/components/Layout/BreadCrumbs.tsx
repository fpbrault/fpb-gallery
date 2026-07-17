"use client";

import React from "react";
import Link from "next/link";
import { FaHouse } from "react-icons/fa6";
import { localizePath } from "@/i18n/config";
import { useLocale } from "../context/LocaleContext";

type BreadcrumbItem = { name?: string | null; url?: string };

const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  const { locale } = useLocale();
  return (
    <div className="flex">
      <div className="mx-auto uppercase breadcrumbs">
        <ul aria-label="Breadcrumb">
          <li className="inline-flex items-center">
            <Link
              aria-label="Home"
              className="flex items-center w-4 h-4 text-sm link-secondary "
              href={localizePath("/", locale)}
            >
              <FaHouse></FaHouse>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              {item.url ? (
                <Link
                  href={localizePath(String(item.url), locale)}
                  className="flex items-center text-sm link-secondary"
                >
                  {item?.name?.length && item?.name?.length > 30
                    ? item?.name?.slice(0, 30) + "..."
                    : item?.name}
                </Link>
              ) : (
                <span
                  className="flex items-center text-sm font-semibold truncate text-secondary"
                  aria-current="page"
                >
                  {item?.name?.length && item?.name?.length > 30
                    ? item?.name?.slice(0, 30) + "..."
                    : item?.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumbs;
