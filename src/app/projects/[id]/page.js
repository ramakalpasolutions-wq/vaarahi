'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CTA from '../../../components/CTA'; // ✅ ADD THIS IMPORT
import {
  FaMapMarkerAlt, FaCheckCircle, FaArrowLeft,
  FaWater, FaBolt, FaTree, FaRoad, FaShieldAlt,
  FaChild, FaSwimmingPool, FaDumbbell, FaParking,
  FaLightbulb, FaWifi, FaHome, FaBuilding,
  FaSchool, FaUniversity, FaHospital, FaShoppingCart,
  FaBusAlt, FaTrain, FaPlane, FaClipboardCheck,
  FaTint, FaSign, FaBroom,
} from 'react-icons/fa';

const ICON_MAP = {
  check: FaCheckCircle, water: FaWater, electricity: FaBolt,
  tree: FaTree, road: FaRoad, security: FaShieldAlt,
  children: FaChild, pool: FaSwimmingPool, gym: FaDumbbell,
  parking: FaParking, light: FaLightbulb, wifi: FaWifi,
  home: FaHome, building: FaBuilding, school: FaSchool,
  university: FaUniversity, hospital: FaHospital,
  shopping: FaShoppingCart, bus: FaBusAlt, train: FaTrain,
  plane: FaPlane, layout: FaClipboardCheck, drop: FaTint,
  sign: FaSign, clean: FaBroom,
};

const getIcon = (name) => ICON_MAP[name] || FaCheckCircle;

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!params?.id) return;
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          const found = d.data.find(p => p._id === params.id);
          setProject(found || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '60vh', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '50px', height: '50px',
            border: '4px solid #f0e8d8',
            borderTop: '4px solid #0d7377',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
        <Footer />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '60vh', display: 'flex',
          flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '40px 20px',
        }}>
          <div style={{ fontSize: '64px' }}>🏗️</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '32px', color: '#0a1a1b', margin: '12px 0',
          }}>Project Not Found</h1>
          <Link href="/projects" style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #0d7377, #14919b)',
            color: '#fff', borderRadius: '50px',
            textDecoration: 'none', fontWeight: '700',
          }}>← Back to Projects</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* 🎬 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        height: isMobile ? 'auto' : '90vh',
        minHeight: isMobile ? 'auto' : '500px',
        overflow: 'hidden',
        background: '#0a1a1b',
        display: isMobile ? 'flex' : 'block',
        flexDirection: isMobile ? 'column' : 'unset',
      }}>
        <div style={{
          position: isMobile ? 'relative' : 'absolute',
          inset: isMobile ? 'auto' : 0,
          width: '100%',
          height: isMobile ? '300px' : '100%',
        }}>
          {project.heroImage ? (
            <div className="ken-burns-image" style={{
              width: '100%', height: '100%', position: 'relative',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.heroImage} alt={project.title}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  display: 'block',
                }} />
            </div>
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #0d7377, #14919b)',
            }} />
          )}

          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(10,26,27,0.3), rgba(10,26,27,0.75))',
            zIndex: 1,
          }} />
        </div>

        <div className="hero-content-fade" style={{
          position: isMobile ? 'relative' : 'absolute',
          inset: isMobile ? 'auto' : 0,
          zIndex: 2,
          width: '100%',
          height: isMobile ? 'auto' : '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: isMobile ? '30px 16px' : '20px',
          background: isMobile ? '#0a1a1b' : 'transparent',
        }}>
          <Link href="/projects" className="hero-back-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            color: '#fff', borderRadius: '50px',
            textDecoration: 'none', fontSize: '12px', fontWeight: '600',
            marginBottom: '20px',
            border: '1px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
          }}>
            <FaArrowLeft size={11} /> Back to Projects
          </Link>

          <h1 className="hero-title" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? '26px' : 'clamp(36px, 6vw, 64px)',
            fontWeight: '800', color: '#fff',
            lineHeight: '1.2', marginBottom: '16px',
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            maxWidth: '900px',
            padding: isMobile ? '0 8px' : 0,
          }}>{project.title}</h1>

          <p className="hero-location" style={{
            color: '#fff',
            fontSize: isMobile ? '14px' : '17px',
            fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '10px',
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <FaMapMarkerAlt /> {project.location}
          </p>
        </div>

        {!isMobile && (
          <div className="scroll-indicator" style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            color: '#fff',
            textAlign: 'center',
            opacity: 0.7,
          }}>
            <div style={{
              width: '24px', height: '40px',
              border: '2px solid rgba(255,255,255,0.6)',
              borderRadius: '20px',
              position: 'relative',
              margin: '0 auto',
            }}>
              <div className="scroll-dot" style={{
                position: 'absolute',
                top: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '4px',
                height: '8px',
                background: '#fff',
                borderRadius: '2px',
              }} />
            </div>
          </div>
        )}
      </section>

      {/* 2. PROJECT OVERVIEW */}
      {project.about && (
        <section style={{
          padding: 'clamp(60px, 10vw, 100px) 16px',
          background: '#ffffff',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: '800', color: '#0d7377', marginBottom: '16px',
              }}>Project Overview</h2>
              <div style={{
                width: '60px', height: '4px',
                background: 'linear-gradient(135deg, #ff6b35, #0d7377)',
                borderRadius: '2px',
                margin: '0 auto 30px',
              }} />
            </div>

            <div style={{
              color: '#3a5a5c',
              fontSize: '15px',
              lineHeight: '2',
              whiteSpace: 'pre-line',
              background: '#fdf6ec',
              padding: isMobile ? '20px' : '32px',
              borderRadius: '20px',
              border: '1px solid #f0e8d8',
            }}>
              {project.about}
            </div>
          </div>
        </section>
      )}

      {/* 3. SHORT DESCRIPTION */}
      {project.description && !project.about && (
        <section style={{
          padding: 'clamp(60px, 10vw, 100px) 16px',
          background: '#fdf6ec',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: '#3a5a5c',
              lineHeight: '1.8',
              fontStyle: 'italic',
            }}>
              {project.description}
            </p>
          </div>
        </section>
      )}

      {/* 4. VIDEO */}
      {project.video && (
        <section style={{
          padding: 'clamp(40px, 6vw, 60px) 16px',
          background: '#fafafa',
        }}>
          <div style={{ maxWidth: '1430px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: '800', color: '#0d7377',
              }}>Project Video</h2>
            </div>
            <div style={{
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              background: '#000',
              position: 'relative',
              aspectRatio: isMobile ? '16/9' : '21/9',
              borderRadius: isMobile ? '12px' : '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}>
              <video controls autoPlay muted loop playsInline
                style={{
                  width: '100%', height: '100%',
                  display: 'block',
                  objectFit: isMobile ? 'contain' : 'cover',
                }}>
                <source src={project.video} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>
      )}

      {/* 5. LOCATION HIGHLIGHTS */}
      {project.locationHighlights?.length > 0 && (
        <section style={{
          padding: 'clamp(60px, 10vw, 100px) 16px',
          background: 'linear-gradient(180deg, #f5f9fa, #ffffff)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: '800', color: '#0d7377', marginBottom: '14px',
              }}>Location Highlights</h2>
              <p style={{
                color: '#5a7a7c', fontSize: '14px',
                maxWidth: '600px', margin: '0 auto',
              }}>
                Located in a prime area with excellent connectivity to schools,
                hospitals, and shopping centers.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? 'repeat(2, 1fr)'
                : 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: isMobile ? '12px' : '20px',
            }}>
              {project.locationHighlights.map((loc, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: '16px',
                  padding: isMobile ? '20px 12px' : '28px 20px',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: '#1e88e5', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', color: '#fff', fontSize: '16px',
                  }}><FaMapMarkerAlt /></div>
                  <h4 style={{
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: '700',
                    color: '#0a1a1b', marginBottom: '8px',
                  }}>{loc.name}</h4>
                  {loc.distance && (
                    <>
                      <p style={{
                        color: '#5a7a7c', fontSize: '12px', marginBottom: '10px',
                      }}>{loc.distance}</p>
                      <div style={{
                        width: '24px', height: '3px',
                        background: '#1e88e5', margin: '0 auto', borderRadius: '2px',
                      }} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. AMENITIES */}
      {project.amenities?.length > 0 && (
        <section style={{
          padding: 'clamp(60px, 10vw, 100px) 16px',
          background: 'linear-gradient(180deg, #fdf6ec, #f5e6cc)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: '800', color: '#0d7377', marginBottom: '14px',
              }}>Project Amenities</h2>
              <p style={{
                color: '#5a7a7c', fontSize: '14px',
                maxWidth: '600px', margin: '0 auto',
              }}>
                Experience modern amenities designed for comfort, convenience, and luxury.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? 'repeat(2, 1fr)'
                : 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: isMobile ? '12px' : '20px',
            }}>
              {project.amenities.map((am, i) => {
                const Icon = getIcon(am.icon);
                return (
                  <div key={i} style={{
                    background: '#fff', borderRadius: '16px',
                    padding: isMobile ? '20px 12px' : '28px 20px',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '1px solid #f0e8d8',
                    transition: 'all 0.3s ease',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{
                      width: '50px', height: '50px', borderRadius: '50%',
                      background: '#1e88e5', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px', color: '#fff', fontSize: '20px',
                      boxShadow: '0 6px 16px rgba(30,136,229,0.3)',
                    }}><Icon /></div>
                    <h4 style={{
                      fontSize: isMobile ? '13px' : '15px',
                      fontWeight: '700',
                      color: '#0a1a1b', marginBottom: '8px',
                    }}>{am.title}</h4>
                    {am.description && (
                      <p style={{
                        color: '#5a7a7c', fontSize: '12px', lineHeight: '1.6',
                      }}>{am.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. HIGHLIGHTS */}
      {project.highlights?.length > 0 && (
        <section style={{
          padding: 'clamp(60px, 10vw, 100px) 16px',
          background: '#ffffff',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: '800', color: '#0d7377', marginBottom: '14px',
              }}>Key Highlights</h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: isMobile ? '14px' : '20px',
            }}>
              {project.highlights.map((h, i) => {
                const Icon = getIcon(h.icon);
                return (
                  <div key={i} style={{
                    background: '#fdf6ec', borderRadius: '16px',
                    padding: isMobile ? '18px' : '24px',
                    display: 'flex', gap: '14px',
                    alignItems: 'flex-start',
                    border: '1px solid #f0e8d8',
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '18px', flexShrink: 0,
                    }}><Icon /></div>
                    <div>
                      <h4 style={{
                        fontSize: '15px', fontWeight: '700',
                        color: '#0a1a1b', marginBottom: '4px',
                      }}>{h.title}</h4>
                      {h.description && (
                        <p style={{
                          color: '#5a7a7c', fontSize: '13px', lineHeight: '1.6',
                        }}>{h.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. GALLERY */}
      {project.images?.length > 0 && (
        <section style={{
          padding: 'clamp(60px, 10vw, 100px) 16px',
          background: '#fdf6ec',
        }}>
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: '800', color: '#0d7377', marginBottom: '14px',
              }}>Project Gallery</h2>
              <p style={{
                color: '#5a7a7c', fontSize: '14px',
                maxWidth: '600px', margin: '0 auto',
              }}>
                Explore our project gallery to see the design and ambiance.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: isMobile ? '14px' : '20px',
            }}>
              {project.images.map((img, i) => (
                <div key={i} style={{
                  width: '100%',
                  height: isMobile ? '200px' : '220px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: `url(${img}) center/cover no-repeat`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ✅ 9. CTA SECTION WITH BROCHURE DOWNLOAD - USING NEW COMPONENT */}
      <CTA
        showBrochure={true}
        brochurePdf={project.brochurePdf}
        projectTitle={project.title}
        projectId={project._id}
        backgroundImage={project.ctaImage}
        brochureButtonText="Download Project Brochure Pdf"
      />

      <Footer />
    </>
  );
}