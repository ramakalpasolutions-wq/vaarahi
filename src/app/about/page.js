'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import HeroSlider from '../../components/HeroSlider';
import CTA from '../../components/CTA';
import Footer from '../../components/Footer';
import { 
  FaCheckCircle, FaMapMarkerAlt, FaTrophy, 
  FaHeadset, FaShieldAlt, FaAward, FaChartLine 
} from 'react-icons/fa';

export default function About() {
  const [hero, setHero] = useState(null);
  const [aboutImages, setAboutImages] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchHero();
    fetchGalleryData();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero?page=about');
      const data = await res.json();
      if (data.success && data.data) setHero(data.data);
    } catch (e) {}
  };

  const fetchGalleryData = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success) {
        const about = data.data.filter(g => g.category === 'about-section');
        setAboutImages(about);
        const team = data.data.filter(g => g.category === 'team');
        setTeamMembers(team);
      }
    } catch {}
  };

  const whyChooseFeatures = [
    {
      icon: <FaMapMarkerAlt size={26} />,
      title: 'Prime Locations with Growth Potential',
      desc: 'Akshaya builders & constructions offers open plots, villas, and apartments in fast-growing locations with excellent connectivity, promising high appreciation, modern comfort, and a smooth home-buying experience.',
      color: '#ff6b35',
    },
    {
      icon: <FaTrophy size={26} />,
      title: 'Uncompromising Quality',
      desc: 'We ensure superior construction with premium materials, precise execution, and fine finishing, making our CRDA-approved plots, villas, and apartments durable, aesthetic, and trustworthy.',
      color: '#3F9AAE',
    },
    {
      icon: <FaHeadset size={26} />,
      title: 'Comprehensive Post-Sales Support',
      desc: 'Our support continues beyond handover, including property maintenance and value-added services, ensuring your investment remains rewarding.',
      color: '#14919b',
    },
    {
      icon: <FaShieldAlt size={26} />,
      title: 'CRDA Approved Plots – Secure Your Future',
      desc: 'We provide CRDA-approved plots in Amaravathi, Guntur, Jonnalagadda, and Vijayawada, with clear titles and government-approved layouts for safe and legal investment.',
      color: '#0d7377',
    },
    {
      icon: <FaCheckCircle size={26} />,
      title: 'RERA Approved Plots',
      desc: 'Invest in legally approved plots with transparency and timely development, perfect for building your home or future investment with confidence.',
      color: '#ff8c5a',
    },
    {
      icon: <FaChartLine size={26} />,
      title: 'Future-Ready Investments',
      desc: 'Akshaya builders & constructions focuses on sustainable development and modern designs, ensuring every plot, villa, or apartment remains valuable for years to come.',
      color: '#d63384',
    },
  ];

  // ✅ Default team with LOCAL IMAGES from /public folder
  const defaultTeam = [
    {
      _id: 't1',
      title: 'Kondaveeti Srinivasa Rao',
      description: 'Chairman|Kondaveeti Srinivasa Rao brings extensive real estate expertise to Andhra Pradesh, delivering perfectly planned, CRDA-approved layouts near Amaravati.',
      imageUrl: '/Founder.jpg',  // ✅ from public folder
    },
    {
      _id: 't2',
      title: 'Kondaveeti Dheva Raaja',
      description: 'Director|Dheva Mithra Raaja Kondaveeti guides Akshaya builders & constructions Developers in Guntur with vision and integrity, creating innovative, high-quality real estate projects.',
      imageUrl: '/Director.jpg',  // ✅ from public folder
    },
  ];

  const displayTeam = teamMembers.length > 0 ? teamMembers : defaultTeam;

  // ✅ About section images - use admin upload OR local public files
  const defaultAboutImg1 = aboutImages[0]?.imageUrl || '/about1.png';
  const defaultAboutImg2 = aboutImages[1]?.imageUrl || '/about2.jpg';

  return (
    <>
      <Navbar />

  
      {/* HERO SLIDER */}
<HeroSlider
  slides={hero?.slides || []}
  autoScrollSeconds={hero?.autoScrollSeconds || 5}
  height="70vh"
/>
      {/* ====== STRATEGICALLY PLANNED PLOTS SECTION ====== */}
      <section style={{
        padding: 'clamp(60px, 10vw, 100px) 16px',
        background: '#ffffff',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '60px',
            alignItems: 'center',
          }}>
            {/* LEFT - TEXT */}
            <div>
              <span style={{
                display: 'inline-block',
                fontSize: '13px',
                fontWeight: '700',
                color: '#ff6b35',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}>About Akshaya builders & constructions</span>

              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: '800',
                color: '#0a1a1b',
                lineHeight: '1.2',
                marginBottom: '24px',
              }}>
                Strategically Planned <br />
                Plots for a <span style={{ color: '#0d7377' }}>Brighter Future</span>
              </h2>

              <p style={{
                color: '#5a7a7c',
                lineHeight: '1.9',
                fontSize: '15px',
                marginBottom: '32px',
              }}>
                Akshaya builders & constructions offers premium open plots in prime locations,
                thoughtfully planned for sustainable growth and long-term value.
                Build your dream home or invest confidently in projects designed
                with quality, transparency, and innovation.
              </p>

              {/* Mission & Vision */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginTop: '32px',
              }}>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#0a1a1b',
                    marginBottom: '12px',
                    fontFamily: "'Playfair Display', serif",
                  }}>Our Mission</h3>
                  <p style={{
                    color: '#5a7a7c',
                    fontSize: '13px',
                    lineHeight: '1.7',
                  }}>
                    To develop premium residential and commercial spaces that combine
                    modern design, strategic locations, and lasting value for our clients.
                  </p>
                </div>

                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#0a1a1b',
                    marginBottom: '12px',
                    fontFamily: "'Playfair Display', serif",
                  }}>Our Vision</h3>
                  <p style={{
                    color: '#5a7a7c',
                    fontSize: '13px',
                    lineHeight: '1.7',
                  }}>
                    To be a leading real estate developer known for transparency,
                    quality, and innovative projects that create thriving communities.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT - IMAGES */}
            <div style={{
              position: 'relative',
              minHeight: '500px',
            }}>
              {/* Big Image - Top Right */}
              <div style={{
                width: '85%',
                height: '380px',
                borderRadius: '20px',
                marginLeft: 'auto',
                background: `url(${defaultAboutImg1}) center/cover no-repeat`,
                boxShadow: '0 20px 60px rgba(13,115,119,0.2)',
                position: 'relative',
              }} />

              {/* Small Image - Bottom Left (overlapping) */}
              <div style={{
                width: '50%',
                height: '200px',
                borderRadius: '16px',
                position: 'absolute',
                bottom: '0',
                left: '0',
                background: `url(${defaultAboutImg2}) center/cover no-repeat`,
                boxShadow: '0 15px 40px rgba(255,107,53,0.3)',
                border: '6px solid #fff',
                zIndex: 2,
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====== WHY CHOOSE VARAHI SECTION ====== */}
      <section style={{
        padding: 'clamp(60px, 10vw, 100px) 16px',
        background: '#f5f0e6',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: '800',
              color: '#0a1a1b',
              marginBottom: '16px',
            }}>
              Why Choose Akshaya builders & constructions <br /> Townships?
            </h2>
            <p style={{
              color: '#5a7a7c',
              fontSize: '15px',
              lineHeight: '1.7',
              maxWidth: '750px',
              margin: '0 auto',
            }}>
              Akshaya builders & constructions offers well-planned open plots in prime locations
              with clear titles, quality infrastructure, and transparent dealings
              for a secure investment.
            </p>
          </div>

          {/* 6 Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '0',
            position: 'relative',
          }}>
            {whyChooseFeatures.map((feature, i) => (
              <div key={i} style={{
                padding: '32px 28px',
                borderRight: (i + 1) % 3 !== 0 ? '2px dashed rgba(13,115,119,0.2)' : 'none',
                borderBottom: i < 3 ? '2px dashed rgba(13,115,119,0.2)' : 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  marginBottom: '20px',
                  boxShadow: `0 8px 20px ${feature.color}40`,
                }}>
                  {feature.icon}
                </div>

                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#0a1a1b',
                  marginBottom: '12px',
                  lineHeight: '1.3',
                  fontFamily: "'Playfair Display', serif",
                }}>
                  {feature.title}
                </h3>

                <p style={{
                  color: '#5a7a7c',
                  fontSize: '13px',
                  lineHeight: '1.7',
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== MEET OUR TEAM SECTION ====== */}
      <section style={{
        padding: 'clamp(60px, 10vw, 100px) 16px',
        background: '#ffffff',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: '800',
              color: '#0a1a1b',
              marginBottom: '16px',
            }}>
              Meet Our Team
            </h2>
            <p style={{
              color: '#5a7a7c',
              fontSize: '15px',
              lineHeight: '1.7',
              maxWidth: '700px',
              margin: '0 auto',
            }}>
              Our leadership team brings decades of experience in real estate,
              guiding our projects with vision, integrity, and excellence.
              From strategic planning to client relations, our experts ensure
              every venture is built for success.
            </p>
          </div>

          {/* Team Members */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {displayTeam.slice(0, 2).map((member, i) => {
              const parts = (member.description || '').split('|');
              const role = parts[0] || 'Team Member';
              const bio = parts[1] || member.description || '';

              return (
                <div key={member._id || i} style={{
                  textAlign: 'center',
                }}>
                  {/* Team Image */}
                  <div style={{
                    width: '100%',
                    height: '380px',
                    borderRadius: '20px',
                    background: `url(${member.imageUrl}) center/cover no-repeat`,
                    marginBottom: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                    position: 'relative',
                    overflow: 'hidden',
                  }} />

                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '24px',
                    fontWeight: '800',
                    color: '#0a1a1b',
                    marginBottom: '6px',
                  }}>
                    {member.title}
                  </h3>

                  <p style={{
                    color: '#5a7a7c',
                    fontSize: '15px',
                    fontWeight: '500',
                    marginBottom: '14px',
                    fontStyle: 'italic',
                  }}>
                    {role}
                  </p>

                  <p style={{
                    color: '#3F9AAE',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    fontWeight: '500',
                  }}>
                    {bio}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </>
  );
}