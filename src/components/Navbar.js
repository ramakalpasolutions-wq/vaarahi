'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block" style={{
        background: 'linear-gradient(135deg, #df9b43, #c9bd9c)',
        padding: '8px 0',
        fontSize: '13px',
        borderBottom: '1px solid rgba(13,115,119,0.2)',
      }}>
        <div className="container-custom" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
              <FaPhone size={11} /> +91 90000 13471
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
              <FaEnvelope size={11} /> varahiinfratownships@gmail.com
            </span>
          </div>
          <div style={{ color: '#000000' }}>Your Dream Plot Awaits | RERA Approved</div>
        </div>
      </div>

      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: scrolled ? '#fdf6ecf7' : '#c6e4e2',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(13,115,119,0.15)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: scrolled ? '8px 0' : '14px 0',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div className="container-custom" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* ✅ LOGO ONLY - No text */}
          <Link href="/" style={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center',
          }}>
            <Image
              src="/logooo.png"
              alt="Akshaya builders & constructions"
              width={180}
              height={60}
              priority
              style={{
                width: 'auto',
                height: scrolled ? '90px' : '70px',
                objectFit: 'contain',
                transition: 'all 0.3s ease',
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ gap: '4px', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                style={{
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: '50px',
                  fontSize: '17px',
                  fontWeight: '500',
                  color: pathname === link.path ? '#ff0000f1' : '#1531ad',
                  background: pathname === link.path ? 'rgba(13,115,119,0.08)' : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0d7377',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 1001,
            }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <>
            <div
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 999,
              }}
              className="md:hidden"
            />
            <div className="md:hidden" style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '280px',
              height: '100vh',
              background: 'linear-gradient(180deg, #f5e6cc, #ff8826)',
              borderLeft: '1px solid rgba(13,115,119,0.15)',
              padding: '80px 20px 24px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              overflowY: 'auto',
            }}>
              {/* ✅ Logo at top of mobile menu */}
              <div style={{ 
                marginBottom: '20px', 
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(13,115,119,0.15)',
                display: 'flex',
                justifyContent: 'center',
              }}>
                <Image
                  src="/logooo.png"
                  alt="Akshaya builders & constructions"
                  width={150}
                  height={50}
                  style={{
                    width: 'auto',
                    height: '50px',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    textDecoration: 'none',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: pathname === link.path ? '#0d7377' : '#5a7a7c',
                    background: pathname === link.path ? 'rgba(13,115,119,0.08)' : 'transparent',
                    borderLeft: pathname === link.path ? '3px solid #0d7377' : '3px solid transparent',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>
    </>
  );
}