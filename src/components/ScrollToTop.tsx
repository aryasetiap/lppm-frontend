import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Disable default browser scroll restoration to ensure we start at top
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        window.scrollTo(0, 0);

        // Optional: Re-enable auto restoration on unmount if needed, 
        // but usually manual control is preferred for SPA.
    }, [pathname]);

    return null;
};

export default ScrollToTop;
