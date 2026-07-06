'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import CTA from '../../components/CTA';
import Footer from '../../components/Footer';
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlayCircle, FaExpand, FaTrophy } from 'react-icons/fa';

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [autoScrollSeconds, setAutoScrollSeconds] = useState(5);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [columnCount, setColumnCount] = useState(4);
  const [bestPropertyLightbox, setBestPropertyLightbox] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/hero?page=gallery').then(r => r.json()).then(d => {
      if (d.success && d.data) {
        const heroData = d.data;
        if (heroData.slides && heroData.slides.length > 0) {
          setHeroSlides(heroData.slides);
          setAutoScrollSeconds(heroData.autoScrollSeconds || 5);
        }
      }
    }).catch(() => {});

    fetch('/api/gallery').then(r => r.json()).then(d => {
      if (d.success && d.data.length > 0) {
        setGallery(d.data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % heroSlides.length);
      }, autoScrollSeconds * 1000);
      return () => clearInterval(interval);
    }
  }, [heroSlides.length, autoScrollSeconds]);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 500) setColumnCount(1);
      else if (width < 800) setColumnCount(2);
      else if (width < 1200) setColumnCount(3);
      else setColumnCount(4);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const images = gallery.filter(g =>
    g.mediaType !== 'youtube' &&
    !['plot-type', 'advantage', 'best-property'].includes(g.category)
  );
  const videos = gallery.filter(g => g.mediaType === 'youtube' && g.youtubeId);
  const bestProperties = gallery.filter(g => g.category === 'best-property');

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setLightbox(null);
        setBestPropertyLightbox(null);
      }
      if (lightbox !== null) {
        if (e.key === 'ArrowLeft') setLightbox(lightbox > 0 ? lightbox - 1 : images.length - 1);
        if (e.key === 'ArrowRight') setLightbox(lightbox < images.length - 1 ? lightbox + 1 : 0);
      }
      if (bestPropertyLightbox !== null) {
        if (e.key === 'ArrowLeft') setBestPropertyLightbox(bestPropertyLightbox > 0 ? bestPropertyLightbox - 1 : bestProperties.length - 1);
        if (e.key === 'ArrowRight') setBestPropertyLightbox(bestPropertyLightbox < bestProperties.length - 1 ? bestPropertyLightbox + 1 : 0);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, bestPropertyLightbox, images.length, bestProperties.length]);

  const getMasonryHeight = (index) => {
    const pattern = [380, 260, 320, 420, 280, 350, 240, 400, 300, 360];
    return pattern[index % pattern.length];
  };

  const activeSlide = heroSlides[currentSlide] || null;
  const hasText = activeSlide && (activeSlide.title || activeSlide.subtitle || activeSlide.description || activeSlide.ctaText);

  return (
    <>
      <Navbar />

      {/* ===== ✅ HERO SLIDER ===== */}
      <section style={{
        position: 'relative',
        height: isMobile ? 'auto' : '70vh',
        minHeight: isMobile ? 'auto' : '500px',
        overflow: 'hidden',
        background: '#0a1a1b',
        display: isMobile ? 'flex' : 'block',
        flexDirection: isMobile ? 'column' : 'row',
      }}>
        {heroSlides.length === 0 ? (
          <div style={{
            width: '100%',
            minHeight: isMobile ? '400px' : '100%',
            height: isMobile ? 'auto' : '100%',
            background: 'linear-gradient(135deg, #0d7377, #14919b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center',
            padding: '40px 20px',
          }}>
            <div>
              <div style={{ fontSize: '64px', marginBottom: '14px' }}>🏗️</div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 5vw, 56px)',
                fontWeight: '800',
                marginBottom: '12px',
              }}>Welcome to Akshaya Builders & Developers</h1>
              <p style={{ fontSize: '15px', opacity: 0.85 }}>
                Admin can add hero slides from the dashboard
              </p>
            </div>
          </div>
        ) : isMobile ? (
          // ✅ MOBILE LAYOUT - With Blurred Background
          <>
            <div style={{
              width: '100%',
              aspectRatio: '16 / 10',
              position: 'relative',
              background: '#0a1a1b',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {heroSlides.map((slide, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: currentSlide === i ? 1 : 0,
                    transition: 'opacity 0.6s ease-in-out',
                    zIndex: currentSlide === i ? 2 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* ✅ BLURRED BACKGROUND IMAGE */}
                  {slide.mediaUrl && slide.mediaType !== 'video' && (
                    <img
                      src={slide.mediaUrl}
                      alt=""
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(25px) brightness(0.6)',
                        transform: 'scale(1.15)',
                        zIndex: 0,
                      }}
                    />
                  )}

                  {slide.mediaType === 'video' ? (
                    <video
                      src={slide.mediaUrl}
                      autoPlay muted loop playsInline
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <img
                      src={slide.mediaUrl}
                      alt={slide.title || 'Hero'}
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  )}
                </div>
              ))}

              {heroSlides.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 5,
                  display: 'flex',
                  gap: '6px',
                  padding: '5px 12px',
                  background: 'rgba(0,0,0,0.45)',
                  borderRadius: '50px',
                  backdropFilter: 'blur(8px)',
                }}>
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      style={{
                        width: currentSlide === i ? '22px' : '8px',
                        height: '8px',
                        borderRadius: '50px',
                        border: 'none',
                        background: currentSlide === i ? '#ff6b35' : 'rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {hasText && (
              <div style={{
                width: '100%',
                padding: '28px 20px 36px',
                background: '#0a1a1b',
                textAlign: 'center',
                color: '#fff',
                boxSizing: 'border-box',
              }}>
                {activeSlide.subtitle && (
                  <p style={{
                    color: '#ff6b35',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    marginBottom: '14px',
                  }}>
                    {activeSlide.subtitle}
                  </p>
                )}

                {activeSlide.title && (
                  <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '26px',
                    fontWeight: '800',
                    lineHeight: '1.25',
                    marginBottom: '14px',
                    color: '#ffffff',
                  }}>
                    {activeSlide.title}
                  </h1>
                )}

                {activeSlide.description && (
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(253,246,236,0.85)',
                    lineHeight: '1.6',
                    marginBottom: '22px',
                    padding: '0 4px',
                  }}>
                    {activeSlide.description}
                  </p>
                )}

                {(activeSlide.ctaText || activeSlide.secondaryCTA) && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    alignItems: 'center',
                  }}>
                    {activeSlide.ctaText && activeSlide.ctaLink && (
                      <Link href={activeSlide.ctaLink} style={{
                        width: '85%',
                        maxWidth: '300px',
                        padding: '14px 24px',
                        background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
                        color: '#fff',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 6px 18px rgba(255,107,53,0.45)',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}>
                        {activeSlide.ctaText}
                      </Link>
                    )}

                    {activeSlide.secondaryCTA && activeSlide.secondaryCTALink && (
                      <Link href={activeSlide.secondaryCTALink} style={{
                        width: '85%',
                        maxWidth: '300px',
                        padding: '14px 24px',
                        background: 'transparent',
                        color: '#fff',
                        border: '2px solid rgba(255,255,255,0.45)',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}>
                        {activeSlide.secondaryCTA}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // ✅ DESKTOP LAYOUT - With Blurred Background
          <>
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: currentSlide === i ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                  zIndex: currentSlide === i ? 2 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* ✅ BLURRED BACKGROUND IMAGE (Desktop) */}
                {slide.mediaUrl && slide.mediaType !== 'video' && (
                  <img
                    src={slide.mediaUrl}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'blur(40px) brightness(0.5)',
                      transform: 'scale(1.2)',
                      zIndex: 0,
                    }}
                  />
                )}

                {slide.mediaType === 'video' ? (
                  <video
                    src={slide.mediaUrl}
                    autoPlay muted loop playsInline
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                ) : (
                  <img
                    src={slide.mediaUrl}
                    alt={slide.title || 'Hero'}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                )}
              </div>
            ))}

            {activeSlide && (activeSlide.title || activeSlide.subtitle || activeSlide.description) && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.4))',
                zIndex: 3,
                pointerEvents: 'none',
              }} />
            )}

            {activeSlide && hasText && (
              <div style={{
                position: 'absolute',
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 4,
                width: '90%',
                maxWidth: '900px',
                padding: '28px 36px',
                background: 'rgba(10, 26, 27, 0.65)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderRadius: '20px',
                border: '1px solid rgba(253,246,236,0.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                textAlign: 'center',
                color: '#fff',
              }}>
                {activeSlide.subtitle && (
                  <p style={{
                    color: '#ff6b35',
                    fontSize: '14px',
                    fontWeight: '700',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    marginBottom: '14px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}>
                    {activeSlide.subtitle}
                  </p>
                )}

                {activeSlide.title && (
                  <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(28px, 5vw, 52px)',
                    fontWeight: '800',
                    lineHeight: '1.2',
                    marginBottom: '14px',
                    textShadow: '0 4px 24px rgba(0,0,0,0.6)',
                  }}>
                    {activeSlide.title}
                  </h1>
                )}

                {activeSlide.description && (
                  <p style={{
                    fontSize: 'clamp(14px, 1.6vw, 17px)',
                    maxWidth: '700px',
                    margin: '0 auto 22px',
                    opacity: 0.95,
                    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                    lineHeight: '1.6',
                  }}>
                    {activeSlide.description}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {activeSlide.ctaText && activeSlide.ctaLink && (
                    <Link href={activeSlide.ctaLink} style={{
                      padding: '13px 32px',
                      background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
                      color: '#fff',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      boxShadow: '0 10px 30px rgba(255,107,53,0.4)',
                    }}>
                      {activeSlide.ctaText}
                    </Link>
                  )}

                  {activeSlide.secondaryCTA && activeSlide.secondaryCTALink && (
                    <Link href={activeSlide.secondaryCTALink} style={{
                      padding: '13px 28px',
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(15px)',
                      color: '#fff',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      {activeSlide.secondaryCTA}
                    </Link>
                  )}
                </div>
              </div>
            )}

            {heroSlides.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 5,
                display: 'flex',
                gap: '10px',
                padding: '8px 16px',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '50px',
                backdropFilter: 'blur(10px)',
              }}>
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    style={{
                      width: currentSlide === i ? '32px' : '10px',
                      height: '10px',
                      borderRadius: '50px',
                      border: 'none',
                      background: currentSlide === i ? '#ff6b35' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ===== IMAGES SECTION ===== */}
      <section style={{
        padding: 'clamp(60px, 10vw, 100px) 16px',
        background: '#fdf6ec',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '50px' }}>
            <p style={{
              color: '#ff6b35', fontSize: '13px', fontWeight: '700',
              letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px',
            }}>Photo Gallery</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(26px, 4vw, 44px)',
              fontWeight: '800', color: '#0d7377', marginBottom: '14px',
            }}>Our Stunning Collection</h2>
            <div style={{
              width: '70px', height: '4px',
              background: 'linear-gradient(135deg, #ff6b35, #0d7377)',
              borderRadius: '2px', margin: '0 auto',
            }} />
          </div>

          {images.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: '#fff', borderRadius: '20px',
              border: '1px solid #f0e8d8',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '14px' }}>📷</div>
              <h3 style={{
                fontSize: '20px', color: '#0a1a1b', marginBottom: '8px',
                fontWeight: '700', fontFamily: "'Playfair Display', serif",
              }}>No Images Yet</h3>
            </div>
          ) : (
            <div style={{
              columnCount: columnCount,
              columnGap: isMobile ? '14px' : '20px',
            }}>
              {images.map((item, i) => (
                <div
                  key={item._id || i}
                  onClick={() => setLightbox(i)}
                  style={{
                    breakInside: 'avoid',
                    WebkitColumnBreakInside: 'avoid',
                    pageBreakInside: 'avoid',
                    marginBottom: isMobile ? '14px' : '20px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: isMobile ? '240px' : `${getMasonryHeight(i)}px`,
                    background: `url(${item.imageUrl}) center/cover, #0d7377`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.25)';
                    const overlay = e.currentTarget.querySelector('.hover-overlay');
                    if (overlay) overlay.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                    const overlay = e.currentTarget.querySelector('.hover-overlay');
                    if (overlay) overlay.style.opacity = '0';
                  }}
                >
                  <div className="hover-overlay" style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(13,115,119,0.7), rgba(255,107,53,0.5))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.4s ease',
                  }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255,255,255,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '20px',
                    }}>
                      <FaExpand />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== BEST PROPERTIES ===== */}
      {bestProperties.length > 0 && (
        <section style={{
          padding: 'clamp(60px, 10vw, 100px) 16px',
          background: 'linear-gradient(180deg, #ffffff 0%, #fdf6ec 100%)',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '50px' }}>
              <p style={{
                color: '#f39c12', fontSize: '13px', fontWeight: '700',
                letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}>
                <FaTrophy /> Best Properties
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(26px, 4vw, 44px)',
                fontWeight: '800', color: '#0d7377', marginBottom: '14px',
              }}>Featured Premium Properties</h2>
              <div style={{
                width: '70px', height: '4px',
                background: 'linear-gradient(135deg, #f39c12, #0d7377)',
                borderRadius: '2px', margin: '0 auto 16px',
              }} />
              <p style={{
                color: '#5a7a7c', fontSize: '14px',
                maxWidth: '600px', margin: '0 auto',
              }}>
                Discover our handpicked selection of premium properties
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: isMobile ? '16px' : '24px',
            }}>
              {bestProperties.map((property, i) => (
                <div
                  key={property._id || i}
                  onClick={() => setBestPropertyLightbox(i)}
                  style={{
                    borderRadius: '20px', overflow: 'hidden',
                    background: '#fff',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(243,156,18,0.15)',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(243,156,18,0.25)';
                    const img = e.currentTarget.querySelector('.property-img');
                    if (img) img.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (isMobile) return;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
                    const img = e.currentTarget.querySelector('.property-img');
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{
                    position: 'relative', width: '100%',
                    height: isMobile ? '220px' : '260px',
                    overflow: 'hidden',
                  }}>
                    <div className="property-img" style={{
                      width: '100%', height: '100%',
                      background: `url(${property.imageUrl}) center/cover, #0d7377`,
                      transition: 'transform 0.6s ease',
                    }} />
                    <div style={{
                      position: 'absolute', top: '14px', left: '14px',
                      background: 'linear-gradient(135deg, #f39c12, #f1c40f)',
                      color: '#fff', padding: '6px 14px',
                      borderRadius: '50px', fontSize: '11px', fontWeight: '700',
                      letterSpacing: '1px', textTransform: 'uppercase',
                      boxShadow: '0 4px 14px rgba(243,156,18,0.5)',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      <FaTrophy size={10} /> Premium
                    </div>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(10,26,27,0.4) 0%, transparent 50%)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== VIDEOS ===== */}
      {videos.length > 0 && (
        <section style={{
          padding: 'clamp(60px, 10vw, 100px) 16px',
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f9fa 100%)',
        }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '50px' }}>
              <p style={{
                color: '#ff0000', fontSize: '13px', fontWeight: '700',
                letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}>
                <FaPlayCircle />
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(26px, 4vw, 44px)',
                fontWeight: '800', color: '#0d7377', marginBottom: '14px',
              }}>Watch Our Projects in Motion</h2>
              <div style={{
                width: '70px', height: '4px',
                background: 'linear-gradient(135deg, #ff0000, #0d7377)',
                borderRadius: '2px', margin: '0 auto',
              }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: isMobile ? '16px' : '24px',
            }}>
              {videos.map((video, i) => (
                <div key={video._id || i} style={{
                  borderRadius: '16px', overflow: 'hidden',
                  background: '#000',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transition: 'all 0.4s ease',
                  border: playingVideo === i ? '2px solid #ff0000' : '2px solid transparent',
                }}>
                  <div style={{
                    position: 'relative', width: '100%',
                    paddingBottom: '56.25%', background: '#000',
                  }}>
                    {playingVideo === i ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                        title="Video Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          position: 'absolute', top: 0, left: 0,
                          width: '100%', height: '100%', border: 'none',
                        }}
                      />
                    ) : (
                      <div onClick={() => setPlayingVideo(i)} style={{
                        position: 'absolute', inset: 0,
                        background: `url(https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg) center/cover, #000`,
                        cursor: 'pointer', transition: 'all 0.3s ease',
                      }}>
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(0,0,0,0.35)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{
                            width: '50px', height: '50px', borderRadius: '50%',
                            background: '#ff0000',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 6px 20px rgba(255,0,0,0.5)',
                          }}>
                            <div style={{
                              width: 0, height: 0,
                              borderTop: '8px solid transparent',
                              borderBottom: '8px solid transparent',
                              borderLeft: '13px solid #fff',
                              marginLeft: '3px',
                            }} />
                          </div>
                        </div>
                      </div>
                    )}
                    {playingVideo === i && (
                      <button onClick={() => setPlayingVideo(null)} style={{
                        position: 'absolute', top: '10px', right: '10px',
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'rgba(255,0,0,0.9)',
                        border: '2px solid #fff', color: '#fff',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        zIndex: 10, fontSize: '14px',
                      }} title="Close video">
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== LIGHTBOXES ===== */}
      {lightbox !== null && images[lightbox] && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(10,26,27,0.97)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '10px' : '20px', backdropFilter: 'blur(8px)',
        }}>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(null); }} style={{
            position: 'absolute',
            top: isMobile ? '10px' : '20px',
            right: isMobile ? '10px' : '20px',
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: isMobile ? '40px' : '50px',
            height: isMobile ? '40px' : '50px',
            color: '#fff', fontSize: isMobile ? '16px' : '20px',
            cursor: 'pointer', zIndex: 2001,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FaTimes />
          </button>

          {images.length > 1 && !isMobile && (
            <button onClick={(e) => {
              e.stopPropagation();
              setLightbox(lightbox > 0 ? lightbox - 1 : images.length - 1);
            }} style={{
              position: 'absolute', left: '20px',
              background: 'rgba(13,115,119,0.5)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50%', width: '55px', height: '55px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer', zIndex: 2001,
            }}>
              <FaChevronLeft />
            </button>
          )}

          <div onClick={(e) => e.stopPropagation()} style={{
            maxWidth: '1100px', width: '100%',
          }}>
            <div style={{
              borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)', background: '#000',
            }}>
              <img src={images[lightbox].imageUrl} alt="" style={{
                width: '100%',
                maxHeight: isMobile ? '70vh' : '85vh',
                objectFit: 'contain', display: 'block',
              }} />
            </div>
            <div style={{
              marginTop: '14px', textAlign: 'center',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '12px', fontWeight: '600', letterSpacing: '2px',
            }}>
              {lightbox + 1} / {images.length}
            </div>

            {images.length > 1 && isMobile && (
              <div style={{
                display: 'flex', justifyContent: 'center',
                gap: '14px', marginTop: '16px',
              }}>
                <button onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(lightbox > 0 ? lightbox - 1 : images.length - 1);
                }} style={{
                  background: 'rgba(13,115,119,0.7)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%', width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', cursor: 'pointer',
                }}>
                  <FaChevronLeft />
                </button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(lightbox < images.length - 1 ? lightbox + 1 : 0);
                }} style={{
                  background: 'rgba(13,115,119,0.7)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%', width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', cursor: 'pointer',
                }}>
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>

          {images.length > 1 && !isMobile && (
            <button onClick={(e) => {
              e.stopPropagation();
              setLightbox(lightbox < images.length - 1 ? lightbox + 1 : 0);
            }} style={{
              position: 'absolute', right: '20px',
              background: 'rgba(13,115,119,0.5)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50%', width: '55px', height: '55px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer', zIndex: 2001,
            }}>
              <FaChevronRight />
            </button>
          )}
        </div>
      )}

      {bestPropertyLightbox !== null && bestProperties[bestPropertyLightbox] && (
        <div onClick={() => setBestPropertyLightbox(null)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(10,26,27,0.97)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '10px' : '20px', backdropFilter: 'blur(8px)',
        }}>
          <button onClick={(e) => { e.stopPropagation(); setBestPropertyLightbox(null); }} style={{
            position: 'absolute',
            top: isMobile ? '10px' : '20px',
            right: isMobile ? '10px' : '20px',
            background: 'rgba(243,156,18,0.8)',
            border: '2px solid #fff', borderRadius: '50%',
            width: isMobile ? '40px' : '50px',
            height: isMobile ? '40px' : '50px',
            color: '#fff', fontSize: isMobile ? '16px' : '20px',
            cursor: 'pointer', zIndex: 2001,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FaTimes />
          </button>

          {bestProperties.length > 1 && !isMobile && (
            <button onClick={(e) => {
              e.stopPropagation();
              setBestPropertyLightbox(bestPropertyLightbox > 0 ? bestPropertyLightbox - 1 : bestProperties.length - 1);
            }} style={{
              position: 'absolute', left: '20px',
              background: 'rgba(243,156,18,0.5)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50%', width: '55px', height: '55px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer', zIndex: 2001,
            }}>
              <FaChevronLeft />
            </button>
          )}

          <div onClick={(e) => e.stopPropagation()} style={{
            maxWidth: '1100px', width: '100%',
          }}>
            <div style={{
              borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(243,156,18,0.4)', background: '#000',
            }}>
              <img src={bestProperties[bestPropertyLightbox].imageUrl} alt="" style={{
                width: '100%',
                maxHeight: isMobile ? '70vh' : '85vh',
                objectFit: 'contain', display: 'block',
              }} />
            </div>
            <div style={{
              marginTop: '14px', textAlign: 'center',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '12px', fontWeight: '600', letterSpacing: '2px',
            }}>
              {bestPropertyLightbox + 1} / {bestProperties.length}
            </div>

            {bestProperties.length > 1 && isMobile && (
              <div style={{
                display: 'flex', justifyContent: 'center',
                gap: '14px', marginTop: '16px',
              }}>
                <button onClick={(e) => {
                  e.stopPropagation();
                  setBestPropertyLightbox(bestPropertyLightbox > 0 ? bestPropertyLightbox - 1 : bestProperties.length - 1);
                }} style={{
                  background: 'rgba(243,156,18,0.7)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%', width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', cursor: 'pointer',
                }}>
                  <FaChevronLeft />
                </button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  setBestPropertyLightbox(bestPropertyLightbox < bestProperties.length - 1 ? bestPropertyLightbox + 1 : 0);
                }} style={{
                  background: 'rgba(243,156,18,0.7)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%', width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', cursor: 'pointer',
                }}>
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>

          {bestProperties.length > 1 && !isMobile && (
            <button onClick={(e) => {
              e.stopPropagation();
              setBestPropertyLightbox(bestPropertyLightbox < bestProperties.length - 1 ? bestPropertyLightbox + 1 : 0);
            }} style={{
              position: 'absolute', right: '20px',
              background: 'rgba(243,156,18,0.5)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50%', width: '55px', height: '55px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer', zIndex: 2001,
            }}>
              <FaChevronRight />
            </button>
          )}
        </div>
      )}

      <CTA />
      <Footer />
    </>
  );
}