'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaDownload } from 'react-icons/fa';

export default function CTA({
  title = "Ready to Own Your",
  highlightText = "Dream Plot?",
  subtitle = "Get in touch with us for site visits and exclusive offers",
  ctaText = "Contact Us Now",
  ctaLink = "/contact",
  showBrochure = false,
  brochurePdf = '',
  projectTitle = '',
  projectId = '',
  brochureButtonText = "Download Brochure",
  backgroundImage = '',
}) {
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [brochureForm, setBrochureForm] = useState({
    name: '', email: '', phone: '',
  });

  const handleBrochureSubmit = async (e) => {
    e.preventDefault();

    if (!brochurePdf) {
      alert('📞 Brochure is being prepared. Please contact us at +91-XXXXXXXXXX for project details!');
      setShowBrochureModal(false);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/brochure-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...brochureForm,
          projectTitle,
          projectId,
          brochureUrl: brochurePdf,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const link = document.createElement('a');
        link.href = brochurePdf;
        link.download = `${projectTitle || 'Project'}-Brochure.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('✅ Success! Brochure is downloading. Check your email too.');
        setBrochureForm({ name: '', email: '', phone: '' });
        setShowBrochureModal(false);
      } else {
        alert('❌ ' + (data.error || 'Failed. Please try again.'));
      }
    } catch (err) {
      alert('❌ Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section style={{
        position: 'relative',
        padding: '120px 0',
        overflow: 'hidden',
        minHeight: '400px',
        background: backgroundImage
          ? 'transparent'
          : 'linear-gradient(135deg, #0a1a1b 0%, #0d7377 50%, #14919b 100%)',
      }}>
        {backgroundImage && (
          <>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0,
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(13,115,119,0.85), rgba(20,145,155,0.80))',
              zIndex: 1,
            }} />
          </>
        )}

        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,107,53,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(253,246,236,0.08) 0%, transparent 50%)
          `,
          pointerEvents: 'none', zIndex: 1,
        }} />

        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          border: '2px solid rgba(253,246,236,0.1)',
          pointerEvents: 'none', zIndex: 1,
        }} />
        <div style={{
          position: 'absolute', top: '40px', right: '180px',
          width: '180px', height: '180px', borderRadius: '50%',
          border: '1px solid rgba(255,107,53,0.2)',
          pointerEvents: 'none', zIndex: 1,
        }} />
        <div style={{
          position: 'absolute', bottom: '-120px', left: '-120px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.15), transparent)',
          pointerEvents: 'none', zIndex: 1,
        }} />
        <div style={{
          position: 'absolute', bottom: '80px', left: '120px',
          width: '120px', height: '120px', borderRadius: '50%',
          border: '1px solid rgba(253,246,236,0.1)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        <div style={{
          position: 'absolute',
          top: '15%', right: '8%',
          width: '120px', height: '120px',
          backgroundImage: 'radial-gradient(circle, rgba(253,246,236,0.2) 1px, transparent 1px)',
          backgroundSize: '15px 15px',
          opacity: 0.4,
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* ✅ CONTENT - Same beautiful design for BOTH modes */}
        <div className="container-custom" style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}>
          {/* ✅ TITLE - Always shown */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '800',
            color: '#ffffff',
            margin: 0,
            lineHeight: '1.2',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}>
            {title} <span style={{ color: '#ff8c5a' }}>{highlightText}</span>
          </h2>

          {/* ✅ SUBTITLE - Always shown */}
          <p style={{
            fontSize: '17px',
            color: 'rgba(253,246,236,0.9)',
            maxWidth: '600px',
            margin: 0,
            lineHeight: '1.7',
          }}>
            {subtitle}
          </p>

          {/* ✅ BUTTON - Changes based on mode */}
          {showBrochure ? (
            // 📥 BROCHURE DOWNLOAD BUTTON (Same style as Contact button)
            <button
              onClick={() => setShowBrochureModal(true)}
              className="btn-cream"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <FaDownload size={14} /> {brochureButtonText}
            </button>
          ) : (
            // 📞 CONTACT US BUTTON (Original)
            <Link href={ctaLink} className="btn-cream" style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '12px',
            }}>
              {ctaText} <FaArrowRight />
            </Link>
          )}
        </div>
      </section>

      {/* ✅ BROCHURE DOWNLOAD MODAL */}
      {showBrochureModal && (
        <div
          onClick={() => !submitting && setShowBrochureModal(false)}
          className="brochure-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,26,27,0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="brochure-modal-content"
            style={{
              background: '#fff',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #0d7377, #14919b)',
              padding: '32px 28px 28px',
              textAlign: 'center',
              color: '#fff',
              borderRadius: '20px 20px 0 0',
              position: 'relative',
            }}>
              <button
                onClick={() => !submitting && setShowBrochureModal(false)}
                disabled={submitting}
                style={{
                  position: 'absolute',
                  top: '14px', right: '14px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#fff',
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                }}
              >×</button>

              <div style={{
                width: '60px', height: '60px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                fontSize: '26px',
              }}>📥</div>

              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '22px',
                fontWeight: '800',
                marginBottom: '6px',
              }}>Download Brochure</h3>
              <p style={{ fontSize: '13px', opacity: 0.9 }}>
                Enter your details to get the {projectTitle || 'project'} brochure
              </p>
            </div>

            <form onSubmit={handleBrochureSubmit} style={{ padding: '28px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block', fontSize: '12px', fontWeight: '700',
                  color: '#0d7377', marginBottom: '6px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={brochureForm.name}
                  onChange={(e) => setBrochureForm({ ...brochureForm, name: e.target.value })}
                  placeholder="Your full name"
                  disabled={submitting}
                  className="brochure-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #e8dfd0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block', fontSize: '12px', fontWeight: '700',
                  color: '#0d7377', marginBottom: '6px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={brochureForm.email}
                  onChange={(e) => setBrochureForm({ ...brochureForm, email: e.target.value })}
                  placeholder="you@example.com"
                  disabled={submitting}
                  className="brochure-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #e8dfd0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block', fontSize: '12px', fontWeight: '700',
                  color: '#0d7377', marginBottom: '6px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={brochureForm.phone}
                  onChange={(e) => setBrochureForm({ ...brochureForm, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="10-digit mobile number"
                  disabled={submitting}
                  className="brochure-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #e8dfd0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: submitting
                    ? '#999'
                    : 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: submitting ? 'none' : '0 8px 24px rgba(255,107,53,0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {submitting ? (
                  <>
                    <span className="brochure-spinner" style={{
                      width: '16px', height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                    }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaDownload size={13} /> Download Now
                  </>
                )}
              </button>

              <p style={{
                fontSize: '11px',
                color: '#888',
                textAlign: 'center',
                marginTop: '14px',
                lineHeight: 1.5,
              }}>
                🔒 Your information is secure. We&apos;ll only use it to share project updates.
              </p>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes brochureFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes brochureSlideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes brochureSpin {
          to { transform: rotate(360deg); }
        }
        .brochure-modal-overlay {
          animation: brochureFadeIn 0.3s ease;
        }
        .brochure-modal-content {
          animation: brochureSlideUp 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .brochure-spinner {
          animation: brochureSpin 0.8s linear infinite;
        }
        .brochure-input:focus {
          border-color: #0d7377 !important;
        }
      `}</style>
    </>
  );
}