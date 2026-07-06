'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaFacebookF, FaInstagram, FaTwitter,
  FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaArrowRight, FaChevronDown,
} from 'react-icons/fa';

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [projects, setProjects] = useState([]); // ✅ Real projects from DB

  // ✅ Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Fetch real projects from API
  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          // Show only latest 4 projects in footer
          setProjects(d.data.slice(0, 4));
        }
      })
      .catch(err => console.error('Footer projects fetch error:', err));
  }, []);

  const toggleSection = (section) => {
    if (!isMobile) return;
    setOpenSection(openSection === section ? null : section);
  };

  const socialLinks = [
    {
      Icon: FaFacebookF,
      url: 'https://facebook.com/share/1HtNautrcm',
      label: 'Facebook',
      color: '#1877f2',
    },
    {
      Icon: FaInstagram,
      url: 'https://instagram.com/Akshaya Builders & Developers_infra_townships?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      label: 'Instagram',
      color: '#e4405f',
    },
    {
      Icon: FaTwitter,
      url: 'https://x.com/Akshaya Builders & DevelopersT56830',
      label: 'Twitter',
      color: '#1da1f2',
    },
  ];

  const quickLinks = [
    { n: 'Home', p: '/' },
    { n: 'About Us', p: '/about' },
    { n: 'Projects', p: '/projects' },
    { n: 'Gallery', p: '/gallery' },
    { n: 'Contact', p: '/contact' },
  ];

  const isVisible = (section) => {
    if (!isMobile) return true;
    return openSection === section;
  };

  const SectionHeader = ({ title, section }) => (
    <button
      onClick={() => toggleSection(section)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'transparent',
        border: 'none',
        padding: isMobile ? '16px 0' : '0',
        cursor: isMobile ? 'pointer' : 'default',
        textAlign: 'left',
        marginBottom: isMobile ? '0' : '24px',
        borderBottom: isMobile ? '1px solid rgba(13,115,119,0.15)' : 'none',
      }}
    >
      <h3 style={{
        fontSize: '17px',
        fontWeight: '700',
        color: '#0d7377',
        margin: 0,
      }}>
        {title}
      </h3>
      {isMobile && (
        <FaChevronDown
          size={14}
          style={{
            color: '#0d7377',
            transition: 'transform 0.3s ease',
            transform: openSection === section ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      )}
    </button>
  );

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #fdf6ecf7, #fdf6ecf7)',
      color: '#0a1a1b',
    }}>
      <div className="container-custom" style={{
        padding: isMobile ? '50px 20px 30px' : '80px 20px 40px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: isMobile ? '0' : '48px',
        }}>

          {/* ✅ LOGO + DESCRIPTION + SOCIALS */}
          <div style={{
            marginBottom: isMobile ? '30px' : '0',
            textAlign: isMobile ? 'center' : 'left',
          }}>
            <div style={{ marginBottom: '20px' }}>
              <Link href="/" style={{ display: 'inline-block' }}>
                <Image
  src="/logooo.png"
  alt="Akshaya Builders & Developers"
  width={320}
  height={120}
  style={{
    width: 'auto',
    height: isMobile ? '90px' : '120px', // Increased logo size
    objectFit: 'contain',
  }}
/>
              </Link>
            </div>

            <p style={{
              color: '#5a7a7c',
              lineHeight: '1.8',
              fontSize: '14px',
              marginBottom: '24px',
              maxWidth: isMobile ? '320px' : 'none',
              margin: isMobile ? '0 auto 24px' : '0 0 24px 0',
            }}>
              Building dreams, creating communities. Premium residential plots with world-class amenities.
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}>
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(13,115,119,0.15)',
                    border: '1px solid rgba(13,115,119,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#14919b',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = social.color;
                    e.currentTarget.style.borderColor = social.color;
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${social.color}66`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(13,115,119,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(13,115,119,0.25)';
                    e.currentTarget.style.color = '#14919b';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <social.Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ✅ QUICK LINKS */}
          <div>
            <SectionHeader title="Quick Links" section="links" />
            <div style={{
              maxHeight: isMobile ? (isVisible('links') ? '500px' : '0') : 'none',
              overflow: 'hidden',
              transition: 'max-height 0.4s ease, padding 0.4s ease',
              paddingTop: isMobile && isVisible('links') ? '12px' : '0',
              paddingBottom: isMobile && isVisible('links') ? '16px' : '0',
            }}>
              {quickLinks.map(l => (
                <Link
                  key={l.n}
                  href={l.p}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#5a7a7c',
                    textDecoration: 'none',
                    padding: '8px 0',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0d7377';
                    e.currentTarget.style.paddingLeft = '6px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#5a7a7c';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  <FaArrowRight size={10} style={{ color: '#14919b' }} />
                  {l.n}
                </Link>
              ))}
            </div>
          </div>

          {/* ✅ OUR PROJECTS - NOW DYNAMIC FROM DATABASE */}
          <div>
            <SectionHeader title="Our Projects" section="projects" />
            <div style={{
              maxHeight: isMobile ? (isVisible('projects') ? '500px' : '0') : 'none',
              overflow: 'hidden',
              transition: 'max-height 0.4s ease, padding 0.4s ease',
              paddingTop: isMobile && isVisible('projects') ? '12px' : '0',
              paddingBottom: isMobile && isVisible('projects') ? '16px' : '0',
            }}>
              {projects.length === 0 ? (
                // ✅ Fallback when loading or no projects
                <p style={{ 
                  color: '#5a7a7c', 
                  fontSize: '13px', 
                  padding: '8px 0',
                  fontStyle: 'italic',
                }}>
                  Loading projects...
                </p>
              ) : (
                <>
                  {projects.map(project => (
                    <Link
                      key={project._id}
                      href={`/projects/${project._id}`} // ✅ Dynamic link to project detail
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#5a7a7c',
                        textDecoration: 'none',
                        padding: '8px 0',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#0d7377';
                        e.currentTarget.style.paddingLeft = '6px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#5a7a7c';
                        e.currentTarget.style.paddingLeft = '0';
                      }}
                      title={project.title}
                    >
                      <FaArrowRight size={10} style={{ color: '#14919b', flexShrink: 0 }} />
                      <span style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {project.title}
                      </span>
                    </Link>
                  ))}
                  
                  {/* ✅ "View All" link if more than 4 projects */}
                  <Link
                    href="/projects"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#ff6b35',
                      textDecoration: 'none',
                      padding: '12px 0 4px',
                      fontSize: '13px',
                      fontWeight: '700',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ff8c5a';
                      e.currentTarget.style.paddingLeft = '4px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#ff6b35';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    View All Projects <FaArrowRight size={10} />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ✅ CONTACT */}
          <div>
            <SectionHeader title="Contact" section="contact" />
            <div style={{
              maxHeight: isMobile ? (isVisible('contact') ? '500px' : '0') : 'none',
              overflow: 'hidden',
              transition: 'max-height 0.4s ease, padding 0.4s ease',
              paddingTop: isMobile && isVisible('contact') ? '12px' : '0',
              paddingBottom: isMobile && isVisible('contact') ? '16px' : '0',
            }}>
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                marginBottom: '14px',
              }}>
                <span style={{ color: '#14919b', marginTop: '3px', flexShrink: 0 }}>
                  <FaMapMarkerAlt />
                </span>
                <span style={{ color: '#5a7a7c', fontSize: '14px', lineHeight: '1.6' }}>
                  #134-13, Amaravathi Rd, Nagaralu<br />
                  Beside Kaveri Tiffins, Guntur, 522034
                </span>
              </div>

              <a
                href="tel:+919000013471"
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  marginBottom: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('span:last-child').style.color = '#0d7377';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('span:last-child').style.color = '#5a7a7c';
                }}
              >
                <span style={{ color: '#14919b' }}>
                  <FaPhone />
                </span>
                <span style={{
                  color: '#5a7a7c',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                }}>
                  +91 90000 13471
                </span>
              </a>

              <a
                href="mailto:Akshaya Builders & Developersinfratownships@gmail.com"
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  marginBottom: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('span:last-child').style.color = '#0d7377';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('span:last-child').style.color = '#5a7a7c';
                }}
              >
                <span style={{ color: '#14919b' }}>
                  <FaEnvelope />
                </span>
                <span style={{
                  color: '#5a7a7c',
                  fontSize: '14px',
                  wordBreak: 'break-all',
                  transition: 'color 0.3s ease',
                }}>
                  Akshaya Builders & Developersinfratownships@gmail.com
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(13,115,119,0.15)',
        padding: '20px',
        textAlign: 'center',
        background: 'rgba(13,115,119,0.04)',
      }}>
        <p style={{
          color: '#5a7a7c',
          fontSize: isMobile ? '12px' : '13px',
          margin: 0,
        }}>
          © {new Date().getFullYear()} Akshaya Builders & Developers. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}