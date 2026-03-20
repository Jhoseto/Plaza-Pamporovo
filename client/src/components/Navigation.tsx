import { useState, useEffect } from 'react';
import { Link } from 'wouter';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'КОЛЕКЦИЯТА', href: '#collection' },
    { label: 'ФИЛОСОФИЯ', href: '#philosophy' },
    { label: 'КОНСИЕРЖ', href: '#concierge' },
    { label: 'РЕЗЕРВАЦИЯ', href: '#booking' },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '1.5rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 0.5s ease, padding 0.5s ease',
          background: scrolled ? 'rgba(10, 10, 10, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(197, 160, 89, 0.1)' : 'none',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.7rem',
              letterSpacing: '0.4em',
              color: '#C5A059',
              textTransform: 'uppercase',
            }}>
              PLAZA
            </span>
            <span style={{
              fontFamily: 'Tenor Sans, serif',
              fontSize: '1rem',
              letterSpacing: '0.25em',
              color: '#EAEAEA',
              textTransform: 'uppercase',
            }}>
              APARTMENTS
            </span>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.55rem',
              letterSpacing: '0.5em',
              color: 'rgba(234,234,234,0.4)',
              textTransform: 'uppercase',
            }}>
              PAMPOROVO
            </span>
          </div>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            cursor: 'none',
          }}
          aria-label="Menu"
          data-cursor="hover"
        >
          <span style={{
            display: 'block',
            width: '28px',
            height: '1px',
            background: '#EAEAEA',
            transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.3s ease',
            transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block',
            width: '20px',
            height: '1px',
            background: '#C5A059',
            transition: 'opacity 0.3s ease',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block',
            width: '28px',
            height: '1px',
            background: '#EAEAEA',
            transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.3s ease',
            transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </nav>

      {/* Fullscreen Menu */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0 10vw',
          transition: 'opacity 0.5s cubic-bezier(0.23,1,0.32,1), transform 0.5s cubic-bezier(0.23,1,0.32,1)',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-20px)',
          pointerEvents: menuOpen ? 'all' : 'none',
        }}
      >
        {/* Gold line top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #C5A059, transparent)',
        }} />

        <div style={{ marginBottom: '3rem' }}>
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.6rem',
            letterSpacing: '0.4em',
            color: '#C5A059',
            textTransform: 'uppercase',
          }}>
            НАВИГАЦИЯ
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {navLinks.map((link, i) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '1.2rem 0',
                borderBottom: '1px solid rgba(234,234,234,0.06)',
                cursor: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                transition: 'opacity 0.3s ease',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateX(0)' : 'translateX(-30px)',
                transitionDelay: menuOpen ? `${i * 0.07 + 0.1}s` : '0s',
              }}
              data-cursor="hover"
            >
              <span style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.6rem',
                color: '#C5A059',
                letterSpacing: '0.2em',
                minWidth: '2rem',
              }}>
                0{i + 1}
              </span>
              <span style={{
                fontFamily: 'Tenor Sans, serif',
                fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                color: '#EAEAEA',
                letterSpacing: '0.1em',
              }}>
                {link.label}
              </span>
            </button>
          ))}
        </nav>

        <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }}>
          <a href="tel:+359888000000" style={{ textDecoration: 'none' }} data-cursor="hover">
            <span style={{
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '0.75rem',
              color: 'rgba(234,234,234,0.4)',
              letterSpacing: '0.15em',
            }}>
              +359 888 000 000
            </span>
          </a>
          <span style={{ color: 'rgba(197,160,89,0.4)' }}>—</span>
          <a href="mailto:info@plaza-pamporovo.bg" style={{ textDecoration: 'none' }} data-cursor="hover">
            <span style={{
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '0.75rem',
              color: 'rgba(234,234,234,0.4)',
              letterSpacing: '0.15em',
            }}>
              info@plaza-pamporovo.bg
            </span>
          </a>
        </div>

        {/* Bottom gold line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #C5A059, transparent)',
        }} />
      </div>
    </>
  );
}
