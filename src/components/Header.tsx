import React from 'react'
import Link from 'next/link';
import ThemeSelector from './ThemeSelector';
import { getSocialIcon } from './lib/getSocialIcon';
import { useRouter } from 'next/router';
import { FaArrowDown } from 'react-icons/fa6';


type HeaderLink = {
    title: string;
    slug: string;
    _translations: any;
}

type Props = {
    title: string;
    contactUrl: string;
    contactText: string;
    contactType: string;
    headerData: Array<HeaderLink>;
    context: any;
}



function LanguageSwitcher(props: any) {
    return (<button className='flex flex-row justify-end flex-grow gap-1 px-2 text-lg font-bold no-underline uppercase rounded-full link' onClick={() => {
        
        props.router.push(props.context?.otherLocale?.slug?.current ?? props.router.asPath, props.context?.otherLocale?.slug?.current ?? props.router.asPath, {
            locale: props.context?.locales?.find((locale: string) => locale != props.context.locale)
        });
    }}>{props.context?.locales?.find((locale: string) => locale != props.context?.locale)}{/* <span className='w-6 h-6 mt-0.5'><FontAwesomeIcon icon={faEarth}></FontAwesomeIcon> </span> */}</button>);
}


export default function Header({ title, contactUrl, contactText, contactType, headerData, context }: Props) {
    const router = useRouter()
    const icon = getSocialIcon(contactType)

    return (
        <header className="sticky top-0 z-50 flex flex-col w-full px-4 py-2 mx-auto rounded lg:max-w-4xl xl:max-w-6xl lg:top-4 sm:py-3 lg:py-4 bg-base-200/70 backdrop-blur-lg">
            <h1 className='py-1 font-sans text-2xl font-light text-center sm:text-4xl lg:text-5xl'><Link className='link link-hover' href="/">{title}</Link></h1>

            <nav className='flex py-1 font-bold uppercase sm:justify-around '>

                <ul className='flex flex-wrap justify-center flex-grow-0 gap-3 mx-auto text-lg font-bold'>

                    <li><Link className='mx-auto link link-hover link-primary' href={"/"}>{context?.locale == "en" ? "Home" : "Accueil"}</Link></li>
                    {headerData ? headerData.map(
                        headerLink => {
                            const translations = headerData.find(data => data.slug == headerLink.slug)?._translations._translations;
                            const translatedHeaderLink = translations.find((translation: { language: any; }) => translation.language == context.locale) ?? null

                            return (
                                <li key={headerLink?.slug}><Link className='mx-auto link link-hover link-primary' href={translatedHeaderLink?.slug?.current ?? headerLink?.slug}>{translatedHeaderLink?.title ?? headerLink?.title}</Link></li>
                            )
                        }
                    )
                        : <li><Link className='mx-auto link link-hover link-primary' href={"/blog"}>Blog</Link></li>}
                   {/*  <li><Link className='flex h-4 mx-auto link link-hover link-primary' href={contactUrl}>
                        <div className='w-4 mt-1 mr-1 '>{icon}</div>{contactText}</Link></li> */}
                </ul>


            </nav>

            <div className="flex justify-center mx-auto mt-1 sm:mt-0">
                    <LanguageSwitcher context={context} router={router}></LanguageSwitcher>
                    <ThemeSelector></ThemeSelector>
                </div>

        </header>
    )
}