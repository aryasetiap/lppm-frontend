import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        const previousBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = previousBehavior;
    }, [pathname]);

    return null;
};

export default ScrollToTop;
