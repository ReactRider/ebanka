import { useEffect,useState } from 'react';

const CustomHook = () => {
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
      const updateScrollProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        setScrollPercent(Math.min(Math.max(scrolled, 0), 100));
      };

      window.addEventListener('scroll', updateScrollProgress);
      window.addEventListener('resize', updateScrollProgress);
      updateScrollProgress();

      return () => {
        window.removeEventListener('scroll', updateScrollProgress);
        window.removeEventListener('resize', updateScrollProgress);
      };
    },[]);

    return scrollPercent;
}

export default CustomHook
