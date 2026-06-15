'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import CTA from '../../components/CTA';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

export default function ContactPage() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [autoScrollSeconds, setAutoScrollSeconds] = useState(5);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/hero?page=contact').then(r => r.json()).then(d => {
      if (d.success && d.data) {
        const heroData = d.data;
        if (heroData.slides && heroData.slides.length > 0) {
          setHeroSlides(heroData.slides);
          setAutoScrollSeconds(heroData.autoScrollSeconds || 5);
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else toast.error(data.error || 'Something went wrong');
    } catch { toast.error('Failed to send'); }
    setLoading(false);
  };

  const contactInfo = [
    { icon: <FaMapMarkerAlt size={22} />, title: 'Visit Us', info: '#134-13, Amaravathi Rd, Nagaralu, Beside Kaveri Tiffin\'s, Guntur, 522034' },
    { icon: <FaPhone size={22} />, title: 'Call Us', info: '+91 90000 13471' },
    { icon: <FaEnvelope size={22} />, title: 'Email Us', info: 'varahiinfratownships@gmail.com' },
    { icon: <FaClock size={22} />, title: 'Hours', info: 'Mon-Sat: 9AM - 7PM' },
  ];

  const activeSlide = heroSlides[currentSlide] || null;
  const hasText = activeSlide && (activeSlide.title || activeSlide.subtitle || activeSlide.description || activeSlide.ctaText);

  return (
    <>
      <Navbar />

      {/* ===== ✅ HERO SLIDER ===== */}
      <section style={{
        position: 'relative',
        height: isMobile ? 'auto' : '60vh',
        minHeight: isMobile ? 'auto' : '450px',
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
              <p style={{
                color: '#ff8c5a',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>Contact Us</p>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 5vw, 56px)',
                fontWeight: '800',
                marginBottom: '12px',
              }}>Get In Touch With Us</h1>
              <p style={{ fontSize: '15px', opacity: 0.85 }}>
                Have questions? We&apos;re here to help.
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
                      alt={slide.title || 'Contact'}
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
                    alt={slide.title || 'Contact'}
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
                bottom: '50px',
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

      {/* Contact Cards */}
      <section style={{ marginTop: isMobile ? '20px' : '-60px', position: 'relative', zIndex: 10, paddingBottom: '40px' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
            {contactInfo.map((c, i) => (
              <div key={i} className="card-hover" style={{
                background: '#ffffff',
                border: '1px solid rgba(13,115,119,0.08)',
                borderBottom: '5px solid #0d7377',
                borderRadius: '20px',
                padding: '28px 20px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                marginTop: isMobile ? '0' : '90px',
              }}
                onMouseEnter={(e) => {
                  if (isMobile) return;
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(13,115,119,0.15)';
                  e.currentTarget.style.borderBottomColor = '#14919b';
                }}
                onMouseLeave={(e) => {
                  if (isMobile) return;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderBottomColor = '#0d7377';
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(13,115,119,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  color: '#0d7377',
                }}>{c.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px', color: '#0d7377' }}>{c.title}</h3>
                <p style={{ color: '#5a7a7c', fontSize: '13px', lineHeight: '1.5' }}>{c.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="section-padding" style={{ paddingTop: '40px' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid rgba(13,115,119,0.08)',
              borderBottom: '5px solid #0d7377',
              borderRadius: '24px',
              padding: isMobile ? '24px' : '40px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '24px' : '28px', fontWeight: '800', marginBottom: '8px', color: '#0a1a1b' }}>
                Send a <span className="teal-text">Message</span>
              </h2>
              <p style={{ color: '#5a7a7c', fontSize: '14px', marginBottom: '28px' }}>We&apos;ll respond within 24 hours.</p>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                    gap: '16px' 
                  }}>
                    <input className="input-teal" placeholder="Your Name *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input className="input-teal" placeholder="Phone *" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                  </div>
                  <input className="input-teal" type="email" placeholder="Email *" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  <input className="input-teal" placeholder="Subject" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                  <textarea className="input-teal" placeholder="Message *" rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required style={{ resize: 'vertical' }} />
                  <button type="submit" className="btn-teal" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>

            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              minHeight: isMobile ? '350px' : '500px',
              border: '1px solid rgba(13,115,119,0.08)',
              borderBottom: '5px solid #0d7377',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}>
              <iframe
                title="Varahi Infra Townships Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7658.116035831448!2d80.42525939436054!3d16.319979534157184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8aee628e6d051e9f%3A0x19cd66b1013ac846!2sVarahi%20Infra%20Townships!5e0!3m2!1sen!2sin!4v1780638278745!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: isMobile ? '350px' : '500px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </>
  );
}