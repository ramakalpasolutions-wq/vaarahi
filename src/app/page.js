'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { FaBuilding, FaUsers, FaAward, FaMapMarkerAlt, FaArrowRight, FaMapPin, FaTrophy, FaCheckCircle, FaShieldAlt, FaHeadset } from 'react-icons/fa';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [hero, setHero] = useState(null);
  const [plotTypes, setPlotTypes] = useState([]);
  const [advantageImages, setAdvantageImages] = useState([]);
  const [currentAdvImage, setCurrentAdvImage] = useState(0);

  useEffect(() => {
    fetchHero();
    fetchProjects();
    fetchGalleryData();
  }, []);

  useEffect(() => {
    if (advantageImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentAdvImage((prev) => (prev + 1) % advantageImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [advantageImages.length]);

  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero?page=home');
      const data = await res.json();
      if (data.success && data.data) setHero(data.data);
    } catch (e) { }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setProjects(data.data.slice(0, 3));
      } else {
        setProjects([
          { _id: '1', title: 'Akshaya builders & constructions Green City', location: 'Hyderabad', status: 'ongoing', images: [], description: 'Premium plots with lush green surroundings' },
          { _id: '2', title: 'Akshaya builders & constructions Royal Gardens', location: 'Shamshabad', status: 'ongoing', images: [], description: 'Royal living with world-class amenities' },
          { _id: '3', title: 'Akshaya builders & constructions Palm Meadows', location: 'Maheshwaram', status: 'upcoming', images: [], description: 'Peaceful meadow living at affordable prices' },
        ]);
      }
    } catch { }
  };

  const fetchGalleryData = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success) {
        const plots = data.data.filter(g => g.category === 'plot-type');
        setPlotTypes(plots);
        const advImgs = data.data.filter(g => g.category === 'advantage');
        setAdvantageImages(advImgs);
      }
    } catch { }
  };

  

  const advantages = [
    {
      icon: <FaMapPin size={22} />,
      title: 'Prime Locations',
      desc: 'Strategically located in the most promising areas with excellent connectivity to major highways, airports, and IT hubs.',
      color: '#ff6b35',
    },
    {
      icon: <FaTrophy size={22} />,
      title: 'Uncompromising Quality',
      desc: 'Premium quality infrastructure with BT roads, underground drainage, and world-class amenities at every project.',
      color: '#3F9AAE',
    },
    {
      icon: <FaHeadset size={22} />,
      title: 'Post-Sales Support',
      desc: 'At Akshaya builders & constructions, our commitment doesn\'t end at handover. We offer continued customer support, assistance with property maintenance, and value-added services to ensure your investment remains rewarding long after purchase.',
      color: '#14919b',
    },
    {
      icon: <FaCheckCircle size={22} />,
      title: 'CRDA Approved Plots',
      desc: 'All our plots are CRDA approved with government certification ensuring 100% legal compliance and clear titles.',
      color: '#0d7377',
    },
    {
      icon: <FaShieldAlt size={22} />,
      title: 'RERA Approved',
      desc: 'RERA registered projects with complete transparency, legal documentation, and timely delivery guarantee.',
      color: '#ff8c5a',
    },
  ];

  const defaultPlotTypes = [
    { _id: 'p1', title: 'Residential Plots', description: 'Perfect plots for building your dream home with modern amenities and peaceful surroundings.', imageUrl: '' },
    { _id: 'p2', title: 'Commercial Plots', description: 'Strategic commercial spaces ideal for business, retail, and investment opportunities.', imageUrl: '' },
    { _id: 'p3', title: 'Agricultural Plots', description: 'Fertile agricultural lands perfect for farming, plantations, and long-term investment.', imageUrl: '' },
  ];

  const displayPlotTypes = plotTypes.length > 0 ? plotTypes : defaultPlotTypes;

  return (
    <>
      <Navbar />

      {/* HERO SLIDER */}
      <HeroSlider
        slides={hero?.slides || []}
        autoScrollSeconds={hero?.autoScrollSeconds || 5}
        height="90vh"
      />

      

      {/* ====== PLOT TYPES SECTION ====== */}
      <section style={{
        padding: 'clamp(60px, 10vw, 100px) 16px',
        background: '#fdf6ec',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(26px, 4vw, 42px)',
              fontWeight: '800',
              color: '#0a1a1b',
            }}>
              Our <span style={{ color: '#0d7377' }}>Plot Types</span>
            </h2>
            <div style={{
              width: '60px', height: '4px',
              background: 'linear-gradient(135deg, #ff6b35, #3F9AAE)',
              borderRadius: '2px',
              margin: '16px auto 0',
            }} />
            <p style={{
              color: '#5a7a7c',
              fontSize: '15px',
              marginTop: '16px',
              maxWidth: '600px',
              margin: '16px auto 0',
            }}>
              Discover the perfect plot that matches your dreams and investment goals
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
          }}>
            {displayPlotTypes.slice(0, 3).map((plot, i) => (
              <div key={plot._id || i} style={{
                background: '#FFF7FC',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(13,115,119,0.08)',
                border: '1px solid rgba(13,115,119,0.08)',
                borderBottom: '5px solid #0d7377', 
                transition: 'all 0.4s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(13,115,119,0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(13,115,119,0.08)';
              }}
              >
                <div style={{
                  height: '380px',
                  background: plot.imageUrl
                    ? `url(${plot.imageUrl}) center/cover`
                    : `linear-gradient(135deg, ${i === 0 ? '#0d7377, #14919b' : i === 1 ? '#ff6b35, #ff8c5a' : '#3F9AAE, #14919b'})`,
                }} />

                <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#0a1a1b',
                    marginBottom: '10px',
                  }}>{plot.title}</h3>

                  <p style={{
                    color: '#3a5a5c',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    marginBottom: '18px',
                  }}>{plot.description}</p>

                  <Link href="/projects" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 28px',
                    background: 'linear-gradient(135deg, #3F9AAE, #14919b)',
                    color: '#fff',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 6px 18px rgba(63,154,174,0.35)',
                    transition: 'all 0.3s ease',
                  }}>
                    Explore <FaArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌊 WAVE + HEADING 1 - Trusted Real Estate Excellence (TEXT MOVED UP) */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #fdf6ec, #f5e6cc)',
        paddingTop: '0',
        paddingBottom: '20px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '280px',
          overflow: 'hidden',
        }}>
          <img
            src="/wave.png"
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '73%',
              objectFit: 'cover',
              opacity: 0.5,
            }}
          />

          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '40px 20px 0',
            zIndex: 2,
            textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(26px, 4vw, 44px)',
              fontWeight: '800',
              color: '#0a1a1b',
              marginBottom: '12px',
              textShadow: '0 2px 8px rgba(255,255,255,0.5)',
            }}>
              Trusted Real Estate <span style={{ color: '#0d7377' }}>Excellence</span>
            </h2>
            <div style={{
              width: '60px',
              height: '4px',
              background: 'linear-gradient(135deg, #0d7377, #14919b)',
              borderRadius: '2px',
              marginBottom: '14px',
            }} />
            <p style={{
              color: '#3a5a5c',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: '500',
            }}>
              Discover what makes us the preferred choice for thousands of happy families
            </p>
          </div>
        </div>
      </section>

      {/* ====== WHY CHOOSE US CONTENT (Features + Auto Image Slider) ====== */}
      <section style={{
        padding: 'clamp(20px, 4vw, 50px) 16px clamp(60px, 10vw, 100px)',
        background: 'linear-gradient(180deg, #f5e6cc, #fdf6ec)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 1.6fr)',
            gap: '40px',
            alignItems: 'stretch',
          }}
          className="why-grid-responsive"
          >
            {/* LEFT SIDE - 5 Features */}
            <div style={{ display: 'grid', gap: '12px' }}>
              {advantages.map((adv, i) => (
                <div key={i} style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  border: '1px solid rgba(13,115,119,0.08)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(6px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(13,115,119,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                }}
                >
                  <div style={{
                    minWidth: '42px',
                    width: '42px',
                    height: '42px',
                    borderRadius: '11px',
                    background: `linear-gradient(135deg, ${adv.color}, ${adv.color}dd)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: `0 4px 12px ${adv.color}40`,
                  }}>{adv.icon}</div>
                  <div>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#0a1a1b',
                      marginBottom: '4px',
                      fontFamily: "'Playfair Display', serif",
                    }}>{adv.title}</h3>
                    <p style={{
                      color: '#5a7a7c',
                      fontSize: '12px',
                      lineHeight: '1.5',
                    }}>{adv.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE - Auto Scroll Images */}
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              minHeight: '600px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(13,115,119,0.2)',
              background: 'linear-gradient(135deg, #0d7377, #14919b)',
            }}>
              {advantageImages.length > 0 ? (
                <>
                  {advantageImages.map((img, i) => (
                    <div key={img._id || i} style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: currentAdvImage === i ? 1 : 0,
                      transition: 'opacity 1s ease-in-out',
                      background: `url(${img.imageUrl}) center/cover`,
                    }} />
                  ))}

                  <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 10,
                    padding: '8px 16px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '50px',
                    backdropFilter: 'blur(10px)',
                  }}>
                    {advantageImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentAdvImage(i)}
                        style={{
                          width: currentAdvImage === i ? '32px' : '10px',
                          height: '10px',
                          borderRadius: '5px',
                          background: currentAdvImage === i ? '#ff6b35' : 'rgba(255,255,255,0.8)',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fdf6ec',
                  textAlign: 'center',
                  padding: '20px',
                }}>
                  <FaBuilding size={60} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>Admin can upload images</p>
                  <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '6px' }}>
                    Go to Admin → Advantage Images
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🌊 WAVE + HEADING 2 - Premium Developments (73% HEIGHT, TEXT UP) */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #fdf6ec, #ffffff)',
        paddingTop: '0',
        paddingBottom: '20px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          overflow: 'hidden',
        }}>
          <img
            src="/wave.png"
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '73%',
              objectFit: 'cover',
              opacity: 0.5,
            }}
          />

          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '40px 20px 0',
            zIndex: 2,
            textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: '800',
              color: '#0a1a1b',
              marginBottom: '12px',
              textShadow: '0 2px 8px rgba(255,255,255,0.5)',
              lineHeight: '1.2',
            }}>
              Premium <span style={{
                background: 'linear-gradient(135deg, #0d7377, #3F9AAE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Developments</span>
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(135deg, #0d7377, #3F9AAE)',
              borderRadius: '2px',
              marginBottom: '14px',
            }} />
            <p style={{
              color: '#3a5a5c',
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: '500',
            }}>
              Explore our handpicked collection of premium projects designed for modern living
            </p>
          </div>
        </div>
      </section>

      {/* ====== PREMIUM DEVELOPMENTS CARDS (NO EXPLORE BUTTON) ====== */}
      <section style={{
        padding: 'clamp(20px, 4vw, 50px) 16px clamp(60px, 10vw, 100px)',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(63,154,174,0.05), transparent)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.05), transparent)',
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
          }}>
            {projects.map((p, i) => (
              <div key={p._id || i} style={{
                background: '#FFF2EB',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255,107,53,0.15)',
                boxShadow: '0 10px 40px rgba(13,115,119,0.08)',
                transition: 'all 0.4s ease',
                position: 'relative',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(13,115,119,0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(13,115,119,0.08)';
              }}
              >
                <div style={{
                  height: '260px',
                  background: p.images?.[0]
                    ? `url(${p.images[0]}) center/cover`
                    : 'linear-gradient(135deg, #0d7377, #3F9AAE)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)',
                  }} />

                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}>
                    <FaMapMarkerAlt size={14} /> {p.location}
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    marginBottom: '12px',
                    fontFamily: "'Playfair Display', serif",
                    color: '#0a1a1b',
                    lineHeight: '1.2',
                  }}>{p.title}</h3>

                  <p style={{
                    color: '#5a7a7c',
                    fontSize: '14px',
                    marginBottom: '20px',
                    lineHeight: '1.7',
                    minHeight: '48px',
                  }}>{p.description}</p>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '20px',
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      background: 'rgba(63,154,174,0.15)',
                      color: '#3F9AAE',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>✓ RERA Approved</span>
                    <span style={{
                      padding: '4px 12px',
                      background: 'rgba(255,107,53,0.15)',
                      color: '#ff6b35',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>✓ Clear Title</span>
                    <span style={{
                      padding: '4px 12px',
                      background: 'rgba(13,115,119,0.15)',
                      color: '#0d7377',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>✓ Prime Location</span>
                  </div>

                  <Link href="/projects" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #3F9AAE, #14919b)',
                    color: '#fff',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 8px 20px rgba(63,154,174,0.35)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #14919b, #0d7377)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #3F9AAE, #14919b)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  >
                    View Project Details <FaArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .why-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}