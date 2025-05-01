// components/AutoScrollGallery.tsx
import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./AutoScrollGallery.module.css"; // Usa módulos o tus estilos globales

const AutoScrollGallery = () => {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const images = [
    '/logo1.png',
    '/logo2.png',
    '/logo3.png',
    '/logo4.png',
    '/logo5.png',
    '/logo6.png',
    '/logo7.png',
    '/logo8.png',
    '/logo1.png',
    '/logo2.png',
    '/logo3.png',
    '/logo4.png',
    '/logo5.png',
    '/logo6.png',
    '/logo7.png',
    '/logo8.png'
  ];

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    let animationId: number;
    let position = 0;
    const speed = 0.85; // Ajusta la velocidad

    const animate = () => {
      position -= speed;
      if (position <= -gallery.scrollWidth / 2) {
        position = 0;
      }
      gallery.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className={styles.galleryContainer}>

      <article ref={galleryRef} className={styles.scrollingGallery}>
      
        {[...images, ...images].map((img, index) => (
      
          <div key={`${img}-${index}`} className={styles.galleryItem}>
            <Image 
              src={img} 
              alt={`Logo ${(index % images.length) + 1}`}
              width={500}
              height={500}
              className={styles.logoImage}
            />
          </div>
        ))}
      </article>
    </section>
  );
};

export default AutoScrollGallery;