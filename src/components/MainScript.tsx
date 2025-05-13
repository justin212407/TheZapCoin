
import React, { useEffect } from 'react';

const MainScript: React.FC = () => {
  useEffect(() => {
    // Handle interactive background effects
    const interactiveBg = document.querySelector('.interactive-bg');
    
    if (interactiveBg) {
      const handleMouseMove = (e: MouseEvent) => {
        const bgRect = interactiveBg.getBoundingClientRect();
        const mouseX = e.clientX - bgRect.left;
        const mouseY = e.clientY - bgRect.top;
        
        (interactiveBg as HTMLElement).style.setProperty('--mouse-x', `${mouseX}px`);
        (interactiveBg as HTMLElement).style.setProperty('--mouse-y', `${mouseY}px`);
        
        // Move the effect to follow cursor
        const beforeElement = interactiveBg.querySelector(':before') as HTMLElement;
        if (beforeElement) {
          beforeElement.style.left = `${mouseX - 100}px`;
          beforeElement.style.top = `${mouseY - 100}px`;
        }
        
        interactiveBg.classList.add('active');
      };
      
      const handleMouseLeave = () => {
        interactiveBg.classList.remove('active');
      };
      
      interactiveBg.addEventListener('mousemove', handleMouseMove);
      interactiveBg.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        interactiveBg.removeEventListener('mousemove', handleMouseMove);
        interactiveBg.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
    
    // Handle scroll animations
    const handleScrollAnimations = () => {
      const scrollElements = document.querySelectorAll('.scroll-animation:not(.visible)');
      
      scrollElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementHeight = (element as HTMLElement).offsetHeight;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - elementHeight / 3) {
          element.classList.add('visible');
        }
      });
    };
    
    // Initial check for elements already in view
    handleScrollAnimations();
    
    // Add event listener for scroll
    window.addEventListener('scroll', handleScrollAnimations);
    
    return () => {
      window.removeEventListener('scroll', handleScrollAnimations);
    };
  }, []);

  return null;
};

export default MainScript;
