'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function HeroSlider({ slides = [], autoScrollSeconds = 5, height = '90vh' }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef(null);
  const videoRefs = useRef({});

  const slideCount = slides?.length || 0;

  // ✅ Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (slideCount <= 1 || isPaused) return;
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, autoScrollSeconds * 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, slideCount, autoScrollSeconds, isPaused]);

  useEffect(() => {
    slides.forEach((slide, index) => {
      const video = videoRefs.current[index];
      if (!video) return;
      if (index === current) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [current, slides]);

  const goNext = useCallback(() => setCurrent((p) => (p + 1) % slideCount), [slideCount]);
  const goPrev = useCallback(() => setCurrent((p) => (p - 1 + slideCount) % slideCount), [slideCount]);
  const goTo = useCallback((i) => setCurrent(i), []);

  if (!slides || slides.length === 0) {
    return (
      <section style={{
        height: isMobile ? '400px' : height,
        minHeight: isMobile ? '400px' : '500px',
        background: 'linear-gradient(135deg, #0a1a1b, #0d7377)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏗️</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: '800',
            color: '#fdf6ec',
            marginBottom: '16px',
          }}>
            Welcome to Akshaya builders & constructions
          </h1>
          <p style={{ color: 'rgba(253,246,236,0.7)', fontSize: '16px' }}>
            Admin can add hero slides from the dashboard
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        position: 'relative',
        height: isMobile ? 'auto' : height,
        minHeight: isMobile ? 'auto' : '500px',
        background: '#0a1a1b',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => {
        const isActive = current === index;
        const hasError = imgErrors[index];
        const hasText = slide.title || slide.subtitle || slide.description || slide.ctaText;

        // ✅ MOBILE LAYOUT - Stacked (media on top, text below)
        if (isMobile) {
          return (
            <div
              key={`slide-${index}`}
              style={{
                position: isActive ? 'relative' : 'absolute',
                inset: isActive ? 'auto' : 0,
                width: '100%',
                opacity: isActive ? 1 : 0,
                visibility: isActive ? 'visible' : 'hidden',
                transition: 'opacity 0.6s ease-in-out',
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 2 : 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* MEDIA - TOP - RESPONSIVE FIX */}
             <div style={{
  width: '100%',
  aspectRatio: '16 / 10',
  background: '#0a1a1b',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}}>
                {slide.mediaType === 'video' && slide.mediaUrl ? (
                  <video
                    ref={(el) => { if (el) videoRefs.current[index] = el; }}
                    muted
                    loop
                    playsInline
                    preload={index === 0 ? 'auto' : 'metadata'}
                  style={{
  width: '100%',
  height: '100%',
  objectFit: 'contain',    // ← Shows FULL image
  objectPosition: 'center',
  display: 'block',
}}
                  >
                    <source src={slide.mediaUrl} type="video/mp4" />
                    <source src={slide.mediaUrl} type="video/webm" />
                  </video>
                ) : slide.mediaType === 'image' && slide.mediaUrl && !hasError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.mediaUrl}
                    alt={slide.title || `Slide ${index + 1}`}
                    onError={() => setImgErrors((p) => ({ ...p, [index]: true }))}
                    style={{
  width: '100%',
  height: '100%',
  objectFit: 'contain',    // ← Shows FULL image
  objectPosition: 'center',
  display: 'block',
}}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0a1a1b, #0d7377)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fdf6ec',
                  }}>
                    <span style={{ fontSize: '48px' }}>🖼️</span>
                  </div>
                )}
              </div>

              {/* TEXT - BOTTOM */}
              {hasText && (
                <div style={{
                  width: '100%',
                  padding: '28px 20px 36px',
                  background: '#0a1a1b',
                  textAlign: 'center',
                  color: '#fdf6ec',
                  boxSizing: 'border-box',
                }}>
                  {slide.subtitle && (
                    <div style={{
                      display: 'inline-block',
                      padding: '5px 14px',
                      background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
                      borderRadius: '50px',
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#ffffff',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      marginBottom: '14px',
                    }}>
                      {slide.subtitle}
                    </div>
                  )}

                  {slide.title && (
                    <h1 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '26px',
                      fontWeight: '800',
                      lineHeight: '1.25',
                      marginBottom: '12px',
                      color: '#ffffff',
                    }}>
                      {slide.title}
                    </h1>
                  )}

                  {slide.description && (
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(253,246,236,0.85)',
                      lineHeight: '1.6',
                      marginBottom: '22px',
                      padding: '0 4px',
                    }}>
                      {slide.description}
                    </p>
                  )}

                  {(slide.ctaText || slide.secondaryCTA) && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      alignItems: 'center',
                    }}>
                      {slide.ctaText && (
                        <Link href={slide.ctaLink || '#'} style={{
                          width: '85%',
                          maxWidth: '300px',
                          padding: '14px 24px',
                          background: 'linear-gradient(135deg, #0d7377, #14919b)',
                          color: '#ffffff',
                          borderRadius: '50px',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          boxShadow: '0 6px 18px rgba(13,115,119,0.45)',
                          textAlign: 'center',
                          boxSizing: 'border-box',
                        }}>
                          {slide.ctaText}
                        </Link>
                      )}
                      {slide.secondaryCTA && (
                        <Link href={slide.secondaryCTALink || '#'} style={{
                          width: '85%',
                          maxWidth: '300px',
                          padding: '14px 24px',
                          background: 'transparent',
                          color: '#fdf6ec',
                          border: '2px solid rgba(253,246,236,0.45)',
                          borderRadius: '50px',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          textAlign: 'center',
                          boxSizing: 'border-box',
                        }}>
                          {slide.secondaryCTA}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        // ✅ DESKTOP LAYOUT (UNCHANGED)
        return (
          <div
            key={`slide-${index}`}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: isActive ? 2 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {slide.mediaType === 'image' && slide.mediaUrl && !hasError && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.mediaUrl}
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(40px) brightness(0.6)',
                  transform: 'scale(1.15)', zIndex: 0,
                }}
              />
            )}

            {slide.mediaType === 'video' && slide.mediaUrl ? (
              <video
                ref={(el) => { if (el) videoRefs.current[index] = el; }}
                muted loop playsInline
                preload={index === 0 ? 'auto' : 'metadata'}
                style={{
                  position: 'relative', zIndex: 1,
                  width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                }}
              >
                <source src={slide.mediaUrl} type="video/mp4" />
                <source src={slide.mediaUrl} type="video/webm" />
              </video>
            ) : slide.mediaType === 'image' && slide.mediaUrl && !hasError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.mediaUrl}
                alt={slide.title || `Slide ${index + 1}`}
                onError={() => setImgErrors((p) => ({ ...p, [index]: true }))}
                style={{
                  position: 'relative', zIndex: 1,
                  maxWidth: '100%', maxHeight: '100%',
                  width: 'auto', height: 'auto',
                  objectFit: 'contain', display: 'block',
                }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #0a1a1b, #0d7377)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '12px', color: '#fdf6ec',
              }}>
                <span style={{ fontSize: '48px' }}>🖼️</span>
                <p style={{ fontSize: '14px', opacity: 0.7 }}>
                  {hasError ? 'Image could not be loaded' : 'No media'}
                </p>
              </div>
            )}

            {hasText && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
                zIndex: 3, pointerEvents: 'none',
              }} />
            )}

            {hasText && (
              <div style={{
                position: 'absolute', bottom: '80px', left: '50%',
                transform: 'translateX(-50%)', textAlign: 'center',
                width: '90%', maxWidth: '900px', padding: '28px 36px',
                background: 'rgba(10, 26, 27, 0.7)',
                backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                borderRadius: '20px', border: '1px solid rgba(253,246,236,0.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)', zIndex: 5,
              }}>
                {slide.subtitle && (
                  <div style={{
                    display: 'inline-block', padding: '6px 18px',
                    background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
                    borderRadius: '50px', fontSize: '11px', fontWeight: '700',
                    color: '#ffffff', letterSpacing: '2px',
                    textTransform: 'uppercase', marginBottom: '14px',
                  }}>
                    {slide.subtitle}
                  </div>
                )}

                {slide.title && (
                  <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(24px, 4vw, 48px)',
                    fontWeight: '800', lineHeight: '1.2', marginBottom: '12px',
                    color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  }}>
                    {slide.title}
                  </h1>
                )}

                {slide.description && (
                  <p style={{
                    fontSize: 'clamp(13px, 1.5vw, 16px)',
                    color: 'rgba(253,246,236,0.95)',
                    lineHeight: '1.7', maxWidth: '700px', margin: '0 auto 22px',
                  }}>
                    {slide.description}
                  </p>
                )}

                {(slide.ctaText || slide.secondaryCTA) && (
                  <div style={{
                    display: 'flex', gap: '12px',
                    justifyContent: 'center', flexWrap: 'wrap',
                  }}>
                    {slide.ctaText && (
                      <Link href={slide.ctaLink || '#'} style={{
                        padding: '13px 34px',
                        background: 'linear-gradient(135deg, #0d7377, #14919b)',
                        color: '#ffffff', borderRadius: '50px',
                        textDecoration: 'none', fontSize: '13px', fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: '1px',
                        boxShadow: '0 8px 24px rgba(13,115,119,0.5)',
                      }}>
                        {slide.ctaText}
                      </Link>
                    )}
                    {slide.secondaryCTA && (
                      <Link href={slide.secondaryCTALink || '#'} style={{
                        padding: '13px 34px', background: 'transparent',
                        color: '#fdf6ec', border: '2px solid rgba(253,246,236,0.5)',
                        borderRadius: '50px', textDecoration: 'none',
                        fontSize: '13px', fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: '1px',
                      }}>
                        {slide.secondaryCTA}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* ARROWS - Desktop only */}
      {slideCount > 1 && !isMobile && (
        <button onClick={goPrev} style={{
          position: 'absolute', left: '20px', top: '50%',
          transform: 'translateY(-50%)', width: '48px', height: '48px',
          borderRadius: '50%', background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff',
          cursor: 'pointer', fontSize: '18px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(13,115,119,0.9)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}>
          <FaChevronLeft />
        </button>
      )}

      {slideCount > 1 && !isMobile && (
        <button onClick={goNext} style={{
          position: 'absolute', right: '20px', top: '50%',
          transform: 'translateY(-50%)', width: '48px', height: '48px',
          borderRadius: '50%', background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff',
          cursor: 'pointer', fontSize: '18px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(13,115,119,0.9)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}>
          <FaChevronRight />
        </button>
      )}

      {/* DOTS */}
      {slideCount > 1 && (
        <div style={{
          position: 'absolute',
          bottom: isMobile ? '12px' : '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10,
          padding: '6px 14px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50px',
          backdropFilter: 'blur(10px)',
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: current === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '5px',
                background: current === i
                  ? 'linear-gradient(135deg, #ff6b35, #ff8c5a)'
                  : 'rgba(255,255,255,0.5)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease', padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* COUNTER - Desktop only */}
      {slideCount > 1 && !isMobile && (
        <div style={{
          position: 'absolute', top: '20px', right: '20px',
          padding: '6px 14px', background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)', borderRadius: '50px',
          fontSize: '12px', fontWeight: '700', color: '#ffffff',
          zIndex: 10, border: '1px solid rgba(255,255,255,0.2)',
        }}>
          {current + 1} / {slideCount}
        </div>
      )}

      {/* PROGRESS BAR - Desktop only */}
      {slideCount > 1 && !isMobile && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '3px', background: 'rgba(0,0,0,0.2)', zIndex: 10,
        }}>
          <div
            key={`progress-${current}`}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #0d7377, #14919b, #ff6b35)',
              transformOrigin: 'left center',
              animationName: 'fillBar',
              animationDuration: `${autoScrollSeconds}s`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards',
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fillBar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}