import Head from "next/head";
import { NextStudio } from "next-sanity/studio";
import { metadata } from "next-sanity/studio/metadata";
import config from "../../../sanity.config";
import { NextPage } from "next";
import { Config } from "sanity";

export default function StudioPage() {
  return (
    <>
      <Head>
        {Object.entries(metadata).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}
      </Head>
      <NextStudio config={config as Config} />
    </>
  );
}

StudioPage.getLayout = function getLayout(page: NextPage) {
  return <>{page}</>;
};
