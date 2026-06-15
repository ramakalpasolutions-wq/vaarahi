'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import HeroSlider from '../../components/HeroSlider';
import CTA from '../../components/CTA';
import Footer from '../../components/Footer';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/hero?page=projects')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setHero(d.data);
      })
      .catch(() => {});

    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data && d.data.length > 0) {
          setProjects(d.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch:', err);
        setLoading(false);
      });
  }, []);

  const FALLBACK_IMAGE = '/project.png';

  const getProjectImage = (project) => {
    if (project.heroImage) return project.heroImage;
    if (project.images && project.images.length > 0) return project.images[0];
    return FALLBACK_IMAGE;
  };

  return (
    <>
      <Navbar />

      {/* HERO SLIDER */}
      <HeroSlider
        slides={hero?.slides || []}
        autoScrollSeconds={hero?.autoScrollSeconds || 5}
        height="100vh"
      />

      {/* PROJECTS GRID */}
      <section style={{
        padding: 'clamp(60px, 10vw, 100px) 16px',
        background: '#ffffff',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '13px',
              fontWeight: '700',
              color: '#ff6b35',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}>
              Our Premium Projects
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(26px, 4vw, 44px)',
              fontWeight: '800',
              color: '#0a1a1b',
              marginBottom: '16px',
            }}>
              Discover Our <span style={{ color: '#0d7377' }}>Developments</span>
            </h2>
            <div style={{
              width: '60px',
              height: '4px',
              background: 'linear-gradient(135deg, #ff6b35, #0d7377)',
              borderRadius: '2px',
              margin: '0 auto',
            }} />
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '50px', height: '50px',
                border: '4px solid #f0e8d8',
                borderTop: '4px solid #0d7377',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }} />
              <p style={{ color: '#5a7a7c', fontSize: '15px' }}>Loading projects...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && projects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏗️</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#0a1a1b',
                marginBottom: '8px',
                fontFamily: "'Playfair Display', serif",
              }}>No Projects Yet</h3>
              <p style={{ color: '#5a7a7c', fontSize: '14px' }}>
                Admin will add projects soon. Check back later!
              </p>
            </div>
          )}

          {/* Projects Grid - MOBILE RESPONSIVE */}
          {!loading && projects.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? '1fr' 
                : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: isMobile ? '24px' : '32px',
            }}>
              {projects.map((p, i) => {
                const projectImage = getProjectImage(p);

                return (
                  <Link
                    key={p._id || i}
                    href={`/projects/${p._id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) e.currentTarget.style.transform = 'translateY(-8px)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Image Container - RESPONSIVE */}
                    <div style={{
                      width: '100%',
                      height: isMobile ? '200px' : '220px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '18px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                      position: 'relative',
                      background: '#f5f5f5',
                    }}>
                      <img
                        src={projectImage}
                        alt={p.title || 'Project'}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_IMAGE;
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
                          transition: 'transform 0.6s ease',
                        }}
                        className="project-card-img"
                      />
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: isMobile ? '17px' : '18px',
                      fontWeight: '700',
                      color: '#0a1a1b',
                      marginBottom: '10px',
                      lineHeight: '1.3',
                    }}>
                      {p.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      color: '#5a7a7c',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      marginBottom: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {p.description || 'Click to view project details'}
                    </p>

                    {/* Footer */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid #f0e8d8',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#0d7377',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}>
                        <FaMapMarkerAlt size={11} /> {p.location}
                      </span>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#ff6b35',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        click  <FaArrowRight size={10} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CTA
        title="Interested in Any Project?"
        subtitle="Get in touch for site visits and exclusive offers."
      />
      <Footer />

      <style>{`
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        
        a:hover .project-card-img {
          transform: scale(1.08);
        }
        
        @media (max-width: 768px) {
          a:hover .project-card-img {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}