'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email === 'admin@Akshaya Builders & Developers.com' && password === 'Akshaya Builders & Developers@2024') {
        localStorage.setItem('adminAuth', JSON.stringify({ email, loggedIn: true, time: Date.now() }));
        toast.success('Welcome back, Admin!');
        router.push('/admin/dashboard');
      } else {
        toast.error('Invalid credentials!');
      }
      setLoading(false);
    }, 500);
  };

  const fillCredentials = () => {
    setEmail('admin@Akshaya Builders & Developers.com');
    setPassword('Akshaya Builders & Developers@2024');
    toast.success('Credentials filled!');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        /* ---- BACKGROUND ANIMATIONS ---- */

        @keyframes aurora1 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.5; }
          33%  { transform: translate(60px, -80px) scale(1.15); opacity: 0.7; }
          66%  { transform: translate(-40px, 60px) scale(0.95); opacity: 0.4; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
        }

        @keyframes aurora2 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33%  { transform: translate(-80px, 50px) scale(1.1); opacity: 0.6; }
          66%  { transform: translate(50px, -70px) scale(1.05); opacity: 0.3; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
        }

        @keyframes aurora3 {
          0%   { transform: translate(0, 0) scale(1.05); opacity: 0.35; }
          50%  { transform: translate(40px, 40px) scale(0.95); opacity: 0.55; }
          100% { transform: translate(0, 0) scale(1.05); opacity: 0.35; }
        }

        @keyframes hexFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.06; }
          50%       { transform: translateY(-20px) rotate(10deg); opacity: 0.12; }
        }

        @keyframes hexFloat2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.04; }
          50%       { transform: translateY(18px) rotate(-8deg); opacity: 0.09; }
        }

        @keyframes dotPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.4;  transform: scale(1.6); }
        }

        @keyframes beamMove {
          0%   { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(200vw) skewX(-20deg); opacity: 0; }
        }

        @keyframes ringPulse {
          0%   { transform: scale(0.85); opacity: 0.15; }
          50%  { transform: scale(1.1);  opacity: 0.05; }
          100% { transform: scale(0.85); opacity: 0.15; }
        }

        @keyframes ringPulse2 {
          0%   { transform: scale(1);    opacity: 0.08; }
          50%  { transform: scale(1.18); opacity: 0.02; }
          100% { transform: scale(1);    opacity: 0.08; }
        }

        @keyframes starTwinkle {
          0%, 100% { opacity: 0.1; }
          50%       { opacity: 0.7; }
        }

        /* ===== PAGE WRAP ===== */
        .page-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background: #040c0d;
          font-family: 'Poppins', sans-serif;
        }

        /* ===== AURORA BLOBS ===== */
        .aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .blob-1 {
          width: 700px; height: 700px;
          top: -20%; left: -15%;
          background: radial-gradient(circle, rgba(13,115,119,0.55), rgba(13,115,119,0.1) 60%, transparent);
          animation: aurora1 18s ease-in-out infinite;
        }

        .blob-2 {
          width: 600px; height: 600px;
          bottom: -25%; right: -10%;
          background: radial-gradient(circle, rgba(20,145,155,0.5), rgba(20,145,155,0.08) 60%, transparent);
          animation: aurora2 22s ease-in-out infinite;
        }

        .blob-3 {
          width: 450px; height: 450px;
          top: 30%; right: 20%;
          background: radial-gradient(circle, rgba(6,80,85,0.45), transparent 65%);
          animation: aurora3 14s ease-in-out infinite;
        }

        .blob-4 {
          width: 350px; height: 350px;
          bottom: 10%; left: 25%;
          background: radial-gradient(circle, rgba(10,100,105,0.3), transparent 65%);
          animation: aurora1 20s ease-in-out infinite reverse;
          animation-delay: -7s;
        }

        /* ===== FINE GRID ===== */
        .grid-layer {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(20,145,155,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,145,155,0.04) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 1;
          pointer-events: none;
        }

        /* ===== DIAGONAL BEAMS ===== */
        .beam {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }

        .beam-line {
          position: absolute;
          top: -10%;
          height: 120%;
          width: 60px;
          background: linear-gradient(90deg, transparent, rgba(20,145,155,0.06), transparent);
          animation: beamMove linear infinite;
        }

        /* ===== HEXAGONS ===== */
        .hex-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }

        .hex {
          position: absolute;
          border: 1px solid rgba(20,145,155,0.15);
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
          background: rgba(20,145,155,0.03);
        }

        /* ===== DOTS GRID ===== */
        .dots-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }

        .dot {
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(20,145,155,0.5);
          animation: dotPulse ease-in-out infinite;
        }

        /* ===== RINGS ===== */
        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(20,145,155,0.12);
          pointer-events: none;
          z-index: 2;
        }

        /* ===== STARS ===== */
        .star {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          pointer-events: none;
          z-index: 2;
          animation: starTwinkle ease-in-out infinite;
        }

        /* ===== CARD ===== */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: rgba(8, 22, 23, 0.85);
          border: 1px solid rgba(20,145,155,0.2);
          border-radius: 20px;
          padding: 40px 36px;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(20,145,155,0.05),
            0 20px 60px rgba(0,0,0,0.5),
            0 0 80px rgba(13,115,119,0.08);
          animation: cardIn 0.7s ease-out both;
        }

        .card-top-line {
          position: absolute;
          top: 0; left: 15%; right: 15%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #14919b, transparent);
          border-radius: 2px;
        }

        /* ===== LOGO ===== */
        .logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          position: relative;
        }

        .logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(20,145,155,0.35), transparent 65%);
          filter: blur(15px);
          z-index: 0;
        }

        .logo-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          position: relative;
          z-index: 1;
          animation: logoFloat 4s ease-in-out infinite;
          filter: drop-shadow(0 8px 20px rgba(13,115,119,0.5));
        }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          margin-bottom: 6px;
        }

        .card-sub {
          font-size: 13px;
          color: rgba(20,145,155,0.8);
          text-align: center;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 32px;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 7px;
        }

        .field-wrap {
          position: relative;
          margin-bottom: 18px;
        }

        .field-icon {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(20,145,155,0.5);
          font-size: 13px;
          pointer-events: none;
        }

        .field-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
          color: #fff;
          font-size: 14px;
          font-family: 'Poppins', sans-serif;
          outline: none;
          transition: all 0.3s ease;
        }

        .field-input::placeholder { color: rgba(255,255,255,0.2); }

        .field-input:focus {
          border-color: rgba(20,145,155,0.6);
          background: rgba(20,145,155,0.05);
          box-shadow: 0 0 0 3px rgba(20,145,155,0.08);
        }

        .eye-btn {
          position: absolute;
          right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: rgba(20,145,155,0.5);
          cursor: pointer; font-size: 14px;
          padding: 4px;
          transition: color 0.3s;
        }

        .eye-btn:hover { color: #14919b; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #0d7377, #14919b);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 6px;
          box-shadow: 0 6px 20px rgba(13,115,119,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(13,115,119,0.5);
        }

        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }

        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }

        .divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .demo-box {
          background: rgba(20,145,155,0.05);
          border: 1px solid rgba(20,145,155,0.12);
          border-radius: 12px;
          padding: 14px 16px;
        }

        .demo-head {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(20,145,155,0.7);
          margin-bottom: 10px;
        }

        .demo-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .demo-lbl { font-size: 12px; color: rgba(255,255,255,0.35); }

        .demo-val {
          font-family: monospace;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          background: rgba(20,145,155,0.1);
          padding: 2px 8px;
          border-radius: 5px;
        }

        .fill-btn {
          width: 100%;
          margin-top: 10px;
          padding: 9px;
          border-radius: 8px;
          border: 1px solid rgba(20,145,155,0.25);
          background: transparent;
          color: rgba(20,145,155,0.8);
          font-size: 11px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .fill-btn:hover {
          background: rgba(20,145,155,0.1);
          border-color: rgba(20,145,155,0.5);
          color: #14919b;
        }

        .footer-note {
          text-align: center;
          margin-top: 22px;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="page-wrap">

        {/* === AURORA BLOBS === */}
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
        <div className="aurora-blob blob-4" />

        {/* === GRID === */}
        <div className="grid-layer" />

        {/* === DIAGONAL BEAMS === */}
        <div className="beam">
          <div className="beam-line" style={{ animationDuration: '8s',  animationDelay: '0s',   left: '10%' }} />
          <div className="beam-line" style={{ animationDuration: '12s', animationDelay: '3s',   left: '35%' }} />
          <div className="beam-line" style={{ animationDuration: '10s', animationDelay: '6s',   left: '60%' }} />
          <div className="beam-line" style={{ animationDuration: '14s', animationDelay: '1.5s', left: '80%' }} />
        </div>

        {/* === HEXAGONS === */}
        <div className="hex-wrap">
          <div className="hex" style={{ width: 120, height: 140, top: '8%',  left: '5%',  animation: 'hexFloat 9s ease-in-out infinite' }} />
          <div className="hex" style={{ width: 80,  height: 92,  top: '20%', right: '7%', animation: 'hexFloat2 11s ease-in-out infinite' }} />
          <div className="hex" style={{ width: 160, height: 185, bottom: '10%', left: '8%',  animation: 'hexFloat 13s ease-in-out infinite', animationDelay: '-4s' }} />
          <div className="hex" style={{ width: 100, height: 115, bottom: '15%', right: '5%', animation: 'hexFloat2 8s ease-in-out infinite' }} />
          <div className="hex" style={{ width: 60,  height: 70,  top: '50%', left: '3%',  animation: 'hexFloat 7s ease-in-out infinite', animationDelay: '-2s' }} />
          <div className="hex" style={{ width: 90,  height: 104, top: '65%', right: '12%', animation: 'hexFloat2 15s ease-in-out infinite' }} />
        </div>

        {/* === DOT GRID === */}
        <div className="dots-layer">
          {[
            { top: '15%', left: '18%', delay: '0s',   dur: '3s'  },
            { top: '25%', left: '75%', delay: '1s',   dur: '4s'  },
            { top: '45%', left: '10%', delay: '0.5s', dur: '5s'  },
            { top: '55%', left: '88%', delay: '2s',   dur: '3.5s'},
            { top: '70%', left: '30%', delay: '1.5s', dur: '4.5s'},
            { top: '80%', left: '65%', delay: '0.8s', dur: '3.2s'},
            { top: '10%', left: '50%', delay: '2.5s', dur: '5s'  },
            { top: '90%', left: '20%', delay: '1.2s', dur: '3.8s'},
            { top: '35%', left: '92%', delay: '0.3s', dur: '4.2s'},
            { top: '60%', left: '48%', delay: '1.8s', dur: '3s'  },
          ].map((d, i) => (
            <div key={i} className="dot" style={{
              top: d.top, left: d.left,
              animationDelay: d.delay,
              animationDuration: d.dur,
            }} />
          ))}
        </div>

        {/* === RINGS === */}
        <div className="ring" style={{
          width: 500, height: 500,
          top: '50%', left: '50%',
          marginLeft: -250, marginTop: -250,
          animation: 'ringPulse 8s ease-in-out infinite',
        }} />
        <div className="ring" style={{
          width: 750, height: 750,
          top: '50%', left: '50%',
          marginLeft: -375, marginTop: -375,
          animation: 'ringPulse2 12s ease-in-out infinite',
        }} />

        {/* === STARS === */}
        {[
          { top: '5%',  left: '12%', size: 2, dur: '2.5s', delay: '0s'   },
          { top: '12%', left: '82%', size: 3, dur: '3.5s', delay: '1s'   },
          { top: '30%', left: '95%', size: 2, dur: '4s',   delay: '0.5s' },
          { top: '68%', left: '4%',  size: 2, dur: '3s',   delay: '2s'   },
          { top: '85%', left: '78%', size: 3, dur: '5s',   delay: '1.5s' },
          { top: '92%', left: '45%', size: 2, dur: '2.8s', delay: '0.8s' },
          { top: '48%', left: '97%', size: 2, dur: '3.2s', delay: '2.5s' },
          { top: '22%', left: '55%', size: 2, dur: '4.5s', delay: '1.2s' },
        ].map((s, i) => (
          <div key={i} className="star" style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            animationDuration: s.dur,
            animationDelay: s.delay,
            boxShadow: `0 0 ${s.size * 3}px rgba(255,255,255,0.6)`,
          }} />
        ))}

        {/* ===== LOGIN CARD ===== */}
        <div className="login-card">
          <div className="card-top-line" />

          {/* LOGO with glow */}
          <div className="logo-wrap">
            <div className="logo-glow" />
            <img src="/logooo.png" alt="Akshaya Builders & Developers Logo" className="logo-img" />
          </div>

          <h1 className="card-title">Admin Panel</h1>
          <p className="card-sub">Akshaya Builders & Developers</p>

          <form onSubmit={handleLogin}>
            <div>
              <label className="field-label">Email Address</label>
              <div className="field-wrap">
                <FaEnvelope className="field-icon" />
                <input
                  className="field-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@Akshaya Builders & Developers.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <FaLock className="field-icon" />
                <input
                  className="field-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ paddingRight: '42px' }}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Signing In...</>
                : '🔐 Sign In'
              }
            </button>
          </form>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Demo</span>
            <div className="divider-line" />
          </div>

          <div className="demo-box">
            <div className="demo-head"><FaUserShield size={11} /> Demo Credentials</div>
            <div className="demo-row">
              <span className="demo-lbl">Email</span>
              <span className="demo-val">admin@Akshaya Builders & Developers.com</span>
            </div>
            <div className="demo-row">
              <span className="demo-lbl">Password</span>
              <span className="demo-val">Akshaya Builders & Developers@2024</span>
            </div>
            <button className="fill-btn" onClick={fillCredentials}>⚡ Auto-Fill</button>
          </div>

          <p className="footer-note">🔒 Secured Access · Authorized Only</p>
        </div>
      </div>
    </>
  );
}