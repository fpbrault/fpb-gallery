import { useEffect, useState, useCallback } from 'react';
export function useScrollToTop(threshold: number = 300) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const scrollCallback = () => {
            const scrolledFromTop = window.scrollY;
            setShown(() => scrolledFromTop > threshold);
        };
        window.addEventListener('scroll', scrollCallback);
        scrollCallback();
        return () => {
            window.removeEventListener('scroll', scrollCallback);
        };
    }, [threshold]);
    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    return { shown, scrollToTop };
}


const ScrollToTopButton = () => {
    const { shown, scrollToTop } = useScrollToTop(300);
    return (
        <button
            aria-label='scroll to top'
            onClick={scrollToTop}
            className={`${shown ? 'scale-100' : 'scale-0'
                } w-12 h-12 transition-transform duration-200 flex fixed right-10 bottom-10 rounded-full bg-primary shadow-lg shadow-gray-900 justify-center items-center`}
        ><svg className='fill-black' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>
        </button>
    );
};
export default ScrollToTopButton;