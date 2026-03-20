/**
 * DESIGN: Dark Cinematic Minimalist × Swiss Design Precision
 * Palette: #0A0A0A | #EAEAEA | #C5A059 (gold accent only)
 * Fonts: Tenor Sans (display) | Cinzel (numbers) | Satoshi (body)
 * Motion: GSAP ScrollTrigger + Lenis smooth scroll
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import { apartments } from '@/lib/apartments';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/hero-pamporovo-hKcPiG4L4E98MCUqhhYFF2.webp';
// Mux Playback/Asset ID (goes into the stream URL)
// Example: `https://stream.mux.com/<id>.mp4` or `.m3u8`
// NOTE: Mux `player.mux.com/<id>` uses a *playback id*.
// Direct stream URLs also expect the playback id, not necessarily the asset id.
const MUX_VIDEO_ID = 'rR8P8mSaKDzz02TsftugTUdI00cQPJX00oy';
const HERO_VIDEO_MP4 = `https://stream.mux.com/${MUX_VIDEO_ID}.mp4`;
const HERO_VIDEO_HLS = `https://stream.mux.com/${MUX_VIDEO_ID}.m3u8`;
const FIREPLACE_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/interior-fireplace-DTitKvcxt75ynojrJjeN7p.webp';
const BEDROOM_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/bedroom-mountain-HWogqgxqEQraABWJXnxQRw.webp';
const CHEF_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/concierge-chef-LGMZQLWm8HsTsMxr9jye96.webp';
const SPA_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/spa-wellness-gbz8jLh2Navw2r8ii7AAne.webp';

export default function Home() {
  const [, navigate] = useLocation();
  const [activeApt, setActiveApt] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', dates: '' });
  const [formSent, setFormSent] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const hScrollTrackRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero image zoom
      if (heroBgRef.current) {
        gsap.fromTo(heroBgRef.current,
          { scale: 1.12 },
          {
            scale: 1,
            duration: 2.2,
            ease: 'power3.out',
          }
        );
      }

      // Hero title letter stagger
      if (heroTitleRef.current) {
        const letters = heroTitleRef.current.querySelectorAll('.hero-letter');
        gsap.fromTo(letters,
          { y: 120, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.04,
            ease: 'power4.out',
            delay: 0.3,
          }
        );
      }

      // Scroll-triggered reveals
      gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((el) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Parallax on images
      gsap.utils.toArray<HTMLElement>('.parallax-img').forEach((img) => {
        gsap.to(img, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Horizontal scroll section
      if (hScrollRef.current && hScrollTrackRef.current) {
        const track = hScrollTrackRef.current;
        const totalWidth = track.scrollWidth - hScrollRef.current.offsetWidth;
        gsap.to(track, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: hScrollRef.current,
            start: 'top top',
            end: () => `+=${totalWidth + 400}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }

      // Gold line animation
      gsap.utils.toArray<HTMLElement>('.gold-reveal-line').forEach((line) => {
        gsap.fromTo(line,
          { scaleX: 0, transformOrigin: 'left' },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 90%',
            },
          }
        );
      });

    });

    return () => ctx.revert();
  }, []);

  // Smooth scroll with Lenis
  useEffect(() => {
    let lenis: any;
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="hero-letter"
        style={{
          display: 'inline-block',
          opacity: 0,
          whiteSpace: char === ' ' ? 'pre' : 'normal',
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const conciergeServices = [
    {
      number: '01',
      title: 'РЕСТОРАНТ',
      desc: 'Изискана кухня и уютна атмосфера. Насладете се на традиционни родопски ястия и модерна гастрономия.',
      image: CHEF_IMAGE,
    },
    {
      number: '02',
      title: 'СПА ЦЕНТЪР',
      desc: 'Пълноценен релакс и възстановяване. Басейн, сауна и парни бани за вашето здраве и тонус.',
      image: SPA_IMAGE,
    },
    {
      number: '03',
      title: 'СКИ ГАРДЕРОБ',
      desc: 'Модерно оборудване и сигурност за вашата екипировка. Комфорт само на крачки от пистите.',
      image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663458413005/uhXRuwuHobPnKCev.jpg',
    },
    {
      number: '04',
      title: 'ЗИМНИ ПРИКЛЮЧЕНИЯ',
      desc: 'Нощно каране на писта "Снежанка 2", преходи с моторни шейни до връх Мургавец и панорамен тур с ратрак.',
      image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663458413005/SuvwgckREWHBVDuC.jpg',
    },
    {
      number: '05',
      title: 'ВЕЛОПАРК ПАМПОРОВО',
      desc: 'Най-големият велопарк на Балканите с над 35 км трасета за планинско колоездене от всяко ниво.',
      image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663458413005/hVSJWZloYUlFmSFD.jpg',
    },
    {
      number: '06',
      title: 'ПРИКЛЮЧЕНСКИ ПАРК "ЯЗОВИРА"',
      desc: 'Алпийски тролей, въжена градина, спортен риболов и зони за релакс сред чистия боров въздух.',
      image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663458413005/DPwHoRbKyayssQHA.jpg',
    },
    {
      number: '07',
      title: 'КУЛТУРА И ПРИРОДА',
      desc: 'Посещение на обсерватория Рожен, пещерите Дяволското гърло и Ягодинска, и панорамни преходи.',
      image: BEDROOM_IMAGE,
    },
    {
      number: '08',
      title: 'РЕЛАКС И УЕЛНЕС',
      desc: 'Външно джакузи с гледка към гората, йога сесии на открито и възстановяващи процедури.',
      image: FIREPLACE_IMAGE,
    },
  ];

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navigation />

      {/* ═══════════════════════════════════════════════════════
          SECTION 1: HERO
      ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
        }}
      >
        {/* Background video (fallbacks to HERO_IMAGE if video doesn't load) */}
        <div
          ref={heroBgRef}
          style={{
            position: 'absolute',
            inset: '-10%',
            zIndex: 0,
            overflow: 'hidden',
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform',
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
            }}
          >
            <source src={HERO_VIDEO_MP4} type="video/mp4" />
            <source src={HERO_VIDEO_HLS} type="application/x-mpegURL" />
          </video>
        </div>

        {/* Dark overlay (stronger near the top where the hero text lives) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.55) 38%, rgba(10,10,10,0.18) 100%)',
          }}
        />

        {/* Gold top line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.4), transparent)',
            zIndex: 2,
          }}
        />

        {/* Hero content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: '0 4vw 8vh',
          maxWidth: '90vw',
        }}>
          {/* Label */}
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.65rem',
            letterSpacing: '0.4em',
            color: '#C5A059',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            opacity: 0,
            animation: 'fadeInUp 0.8s ease 0.1s forwards',
          }}>
            ПАМПОРОВО · РОДОПИ · БЪЛГАРИЯ
          </div>

          {/* Main title */}
          <div
            ref={heroTitleRef}
            style={{
              overflow: 'hidden',
              lineHeight: 1,
              marginBottom: '0.3rem',
            }}
          >
            <h1 style={{
              fontFamily: 'Tenor Sans, serif',
              fontSize: 'clamp(2.2rem, 5.5vw, 6.5rem)',
              color: '#EAEAEA',
              letterSpacing: '0.05em',
              margin: 0,
              lineHeight: 1,
              fontWeight: 400,
              whiteSpace: 'nowrap',
            }}>
              {splitText('PLAZA')}
            </h1>
          </div>
          <div style={{ overflow: 'hidden', lineHeight: 1 }}>
            <h1 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(2.2rem, 5.5vw, 6.5rem)',
              color: '#C5A059',
              letterSpacing: '0.05em',
              margin: 0,
              lineHeight: 1,
              fontWeight: 400,
              whiteSpace: 'nowrap',
            }}>
              {splitText('APARTMENTS')}
            </h1>
          </div>

          {/* Subtitle */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            opacity: 0,
            animation: 'fadeInUp 0.8s ease 1.4s forwards',
          }}>
            <div style={{ width: '40px', height: '1px', background: '#C5A059' }} />
            <p style={{
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '0.85rem',
              color: 'rgba(234,234,234,0.6)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              Седем изключителни апартамента. Едно неповторимо преживяване.
            </p>
          </div>

          {/* CTA */}
          <div style={{
            marginTop: '3rem',
            opacity: 0,
            animation: 'fadeInUp 0.8s ease 1.7s forwards',
          }}>
            <button
              onClick={() => {
                const el = document.querySelector('#collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="magnetic-btn"
              style={{
                border: '1px solid rgba(197,160,89,0.5)',
                padding: '1rem 3rem',
                fontFamily: 'Cinzel, serif',
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                color: '#EAEAEA',
                textTransform: 'uppercase',
                background: 'transparent',
              }}
              data-cursor="hover"
            >
              <span>ИЗСЛЕДВАЙ КОЛЕКЦИЯТА</span>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          right: '3rem',
          bottom: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0,
          animation: 'fadeInUp 0.8s ease 2s forwards',
        }}>
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.55rem',
            letterSpacing: '0.3em',
            color: 'rgba(197,160,89,0.6)',
            writingMode: 'vertical-rl',
            textTransform: 'uppercase',
          }}>
            СКРОЛИРАЙ
          </span>
          <div style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, rgba(197,160,89,0.6), transparent)',
            animation: 'scrollLine 2s ease-in-out infinite',
          }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: PHILOSOPHY
      ═══════════════════════════════════════════════════════ */}
      <section
        id="philosophy"
        style={{
          background: '#FFFFFF',
          padding: 'clamp(5rem, 10vw, 10rem) 0',
          overflow: 'hidden',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0',
          maxWidth: '1440px',
          margin: '0 auto',
        }}>
          {/* Left: Text */}
          <div style={{
            padding: 'clamp(3rem, 6vw, 6rem) clamp(2rem, 5vw, 6rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div className="scroll-reveal">
              <span style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.6rem',
                letterSpacing: '0.4em',
                color: '#C5A059',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '2rem',
              }}>
                02 — ФИЛОСОФИЯ
              </span>
            </div>

            <div className="scroll-reveal" style={{ transitionDelay: '0.1s' }}>
              <h2 style={{
                fontFamily: 'Tenor Sans, serif',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                color: '#1A1A1A',
                lineHeight: 1.15,
                letterSpacing: '0.02em',
                marginBottom: '2rem',
                fontWeight: 400,
              }}>
                Не просто нощувка.<br />
                <em style={{ fontStyle: 'normal', color: '#C5A059' }}>Преживяване.</em>
              </h2>
            </div>

            <div className="scroll-reveal" style={{ transitionDelay: '0.2s' }}>
              <div style={{
                width: '40px',
                height: '1px',
                background: '#C5A059',
                marginBottom: '2rem',
              }} />
              <p style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '1rem',
                color: '#555',
                lineHeight: 1.8,
                fontWeight: 300,
                maxWidth: '420px',
              }}>
                В сърцето на Родопите, на 1650 метра, седем апартамента преосмислят понятието за планински лукс. Всяко пространство е проектирано с хирургична прецизност — материали, светлина, тишина.
              </p>
            </div>

            <div className="scroll-reveal" style={{ transitionDelay: '0.3s', marginTop: '2.5rem' }}>
              <p style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '1rem',
                color: '#555',
                lineHeight: 1.8,
                fontWeight: 300,
                maxWidth: '420px',
              }}>
                Тук не се идва да се спи. Тук се идва да се живее — макар и за кратко — по различен начин.
              </p>
            </div>

            <div className="scroll-reveal" style={{ transitionDelay: '0.4s', marginTop: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {[
                  { num: '7', label: 'Изключителни апартамента' },
                  { num: '1650м', label: 'Надморска височина' },
                  { num: '24/7', label: 'Консиерж услуга' },
                  { num: '100%', label: 'Лично пространство' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{
                      fontFamily: 'Cinzel, serif',
                      fontSize: '1.8rem',
                      color: '#C5A059',
                      letterSpacing: '0.05em',
                    }}>
                      {item.num}
                    </div>
                    <div style={{
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.7rem',
                      color: '#999',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginTop: '0.3rem',
                    }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Image with parallax */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '600px',
            }}
            data-cursor="view"
          >
            <img
              src={FIREPLACE_IMAGE}
              alt="Luxury interior"
              className="parallax-img"
              style={{
                width: '100%',
                height: '120%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
            {/* Gold overlay strip */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '3px',
              background: 'linear-gradient(to bottom, transparent, #C5A059, transparent)',
            }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: THE COLLECTION
      ═══════════════════════════════════════════════════════ */}
      <section
        id="collection"
        ref={collectionRef}
        style={{
          background: '#0A0A0A',
          padding: 'clamp(5rem, 8vw, 8rem) 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ghost number background */}
        <div style={{
          position: 'absolute',
          right: '-2vw',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(12rem, 25vw, 28rem)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(197,160,89,0.06)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'opacity 0.5s ease',
        }}>
          {apartments[activeApt].number}
        </div>

        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 4vw' }}>
          {/* Section header */}
          <div className="scroll-reveal" style={{ marginBottom: '4rem' }}>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              color: '#C5A059',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '1rem',
            }}>
              03 — КОЛЕКЦИЯТА
            </span>
            <h2 style={{
              fontFamily: 'Tenor Sans, serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              color: '#EAEAEA',
              letterSpacing: '0.05em',
              fontWeight: 400,
              margin: 0,
            }}>
              Седем пространства.<br />
              <span style={{ color: 'rgba(234,234,234,0.35)' }}>Един стандарт.</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'start',
          }}>
            {/* Left: Apartment list */}
            <div>
              {apartments.map((apt, i) => (
                <div
                  key={apt.id}
                  className="apt-row"
                  onClick={() => setActiveApt(i)}
                  style={{
                    padding: '1.8rem 0',
                    cursor: 'none',
                    display: 'grid',
                    gridTemplateColumns: '3rem 1fr auto',
                    alignItems: 'center',
                    gap: '1.5rem',
                    borderBottom: `1px solid ${activeApt === i ? 'rgba(197,160,89,0.5)' : 'rgba(234,234,234,0.06)'}`,
                    transition: 'all 0.3s ease',
                    background: activeApt === i ? 'rgba(197,160,89,0.03)' : 'transparent',
                  }}
                  data-cursor="hover"
                >
                  <span style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.75rem',
                    color: activeApt === i ? '#C5A059' : 'rgba(197,160,89,0.4)',
                    letterSpacing: '0.1em',
                    transition: 'color 0.3s ease',
                  }}>
                    {apt.number}
                  </span>

                  <div>
                    <div style={{
                      fontFamily: 'Tenor Sans, serif',
                      fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
                      color: activeApt === i ? '#EAEAEA' : 'rgba(234,234,234,0.55)',
                      letterSpacing: '0.08em',
                      transition: 'color 0.3s ease',
                      marginBottom: '0.3rem',
                    }}>
                      {apt.name}
                    </div>
                    <div style={{
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.7rem',
                      color: 'rgba(234,234,234,0.3)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}>
                      {apt.sqm} м² · {apt.view}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/apartment/${apt.id}`);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${activeApt === i ? 'rgba(197,160,89,0.6)' : 'rgba(234,234,234,0.15)'}`,
                      padding: '0.5rem 1.2rem',
                      fontFamily: 'Cinzel, serif',
                      fontSize: '0.55rem',
                      letterSpacing: '0.25em',
                      color: activeApt === i ? '#C5A059' : 'rgba(234,234,234,0.4)',
                      textTransform: 'uppercase',
                      transition: 'all 0.3s ease',
                      cursor: 'none',
                    }}
                    data-cursor="hover"
                  >
                    ИЗСЛЕДВАЙ
                  </button>
                </div>
              ))}
            </div>

            {/* Right: Active apartment preview */}
            <div style={{ position: 'sticky', top: '120px' }}>
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                }}
                data-cursor="view"
              >
                {apartments.map((apt, i) => (
                  <img
                    key={apt.id}
                    src={apt.image}
                    alt={apt.name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: activeApt === i ? 1 : 0,
                      transition: 'opacity 0.8s cubic-bezier(0.23,1,0.32,1)',
                      transform: 'scale(1.02)',
                    }}
                  />
                ))}

                {/* Overlay info */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)',
                  padding: '2rem',
                }}>
                  <div style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.6rem',
                    letterSpacing: '0.3em',
                    color: '#C5A059',
                    marginBottom: '0.5rem',
                  }}>
                    {apartments[activeApt].number} / 07
                  </div>
                  <div style={{
                    fontFamily: 'Tenor Sans, serif',
                    fontSize: '1.3rem',
                    color: '#EAEAEA',
                    letterSpacing: '0.08em',
                  }}>
                    {apartments[activeApt].name}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginTop: '0.8rem',
                  }}>
                    {[
                      `${apartments[activeApt].sqm} м²`,
                      `${apartments[activeApt].bedrooms} спалн${apartments[activeApt].bedrooms === 1 ? 'я' : 'и'}`,
                      `от ${apartments[activeApt].pricePerNight} лв/нощ`,
                    ].map(info => (
                      <span key={info} style={{
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.7rem',
                        color: 'rgba(234,234,234,0.5)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}>
                        {info}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                {apartments[activeApt].features.slice(0, 3).map(feat => (
                  <span key={feat} style={{
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '0.65rem',
                    color: 'rgba(234,234,234,0.4)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(234,234,234,0.1)',
                    padding: '0.3rem 0.8rem',
                  }}>
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: CONCIERGE (Horizontal Scroll)
      ═══════════════════════════════════════════════════════ */}
      <section
        id="concierge"
        ref={hScrollRef}
        style={{
          background: '#111111',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div style={{
          padding: '6rem 4vw 3rem',
          position: 'relative',
          zIndex: 2,
        }}>
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.6rem',
            letterSpacing: '0.4em',
            color: '#C5A059',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '1rem',
          }}>
            04 — КОНСИЕРЖ
          </span>
          <h2 style={{
            fontFamily: 'Tenor Sans, serif',
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            color: '#EAEAEA',
            letterSpacing: '0.05em',
            fontWeight: 400,
            margin: 0,
            textAlign: 'center',
            width: '100%',
          }}>
            <span style={{ color: '#C5A059' }}>НАШИТЕ ПРЕДЛОЖЕНИЯ</span>
          </h2>
        </div>

        <div
          ref={hScrollTrackRef}
          style={{
            display: 'flex',
            gap: '2px',
            paddingLeft: '4vw',
            paddingBottom: '6rem',
            paddingTop: '2rem',
          }}
        >
          {conciergeServices.map((service) => (
            <div
              key={service.number}
              style={{
                width: 'clamp(320px, 35vw, 480px)',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                aspectRatio: '3/4',
              }}
              data-cursor="view"
            >
              <img
                src={service.image}
                alt={service.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.8s cubic-bezier(0.23,1,0.32,1)',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.1) 60%)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem',
              }}>
                <div style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.3em',
                  color: '#C5A059',
                  marginBottom: '0.8rem',
                }}>
                  {service.number}
                </div>
                <h3 style={{
                  fontFamily: 'Tenor Sans, serif',
                  fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
                  color: '#EAEAEA',
                  letterSpacing: '0.08em',
                  marginBottom: '0.8rem',
                  fontWeight: 400,
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '0.8rem',
                  color: 'rgba(234,234,234,0.55)',
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}>
                  {service.desc}
                </p>
              </div>
            </div>
          ))}

          {/* End spacer */}
          <div style={{ width: '4vw', flexShrink: 0 }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5: BOOKING
      ═══════════════════════════════════════════════════════ */}
      <section
        id="booking"
        style={{
          background: '#0A0A0A',
          padding: 'clamp(6rem, 10vw, 10rem) 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ghost text background */}
        <div style={{
          position: 'absolute',
          left: '-5vw',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'Tenor Sans, serif',
          fontSize: 'clamp(6rem, 15vw, 16rem)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(197,160,89,0.04)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>
          РЕЗЕРВАЦИЯ
        </div>

        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 4vw' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6rem',
            alignItems: 'center',
          }}>
            {/* Left: Text */}
            <div>
              <div className="scroll-reveal">
                <span style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.4em',
                  color: '#C5A059',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '2rem',
                }}>
                  05 — РЕЗЕРВАЦИЯ
                </span>
              </div>

              <div className="scroll-reveal">
                <h2 style={{
                  fontFamily: 'Tenor Sans, serif',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  color: '#EAEAEA',
                  letterSpacing: '0.03em',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: '2rem',
                }}>
                  ВАШЕТО БЯГСТВО<br />
                  <span style={{ color: '#C5A059' }}>ЗАПОЧВА ТУК.</span>
                </h2>
              </div>

              <div className="scroll-reveal">
                <p style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '0.95rem',
                  color: 'rgba(234,234,234,0.5)',
                  lineHeight: 1.8,
                  fontWeight: 300,
                  maxWidth: '400px',
                  marginBottom: '3rem',
                }}>
                  Свържете се с нашия консиерж екип за персонализирана оферта. Отговаряме в рамките на 2 часа.
                </p>
              </div>

              <div className="scroll-reveal">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { icon: '→', text: 'Персонализирана оферта в 2 часа' },
                    { icon: '→', text: 'Безплатна анулация до 48 часа' },
                    { icon: '→', text: 'Директна комуникация с консиерж' },
                  ].map(item => (
                    <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: '#C5A059', fontFamily: 'Cinzel, serif' }}>{item.icon}</span>
                      <span style={{
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.8rem',
                        color: 'rgba(234,234,234,0.45)',
                        letterSpacing: '0.08em',
                      }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="scroll-reveal">
              {formSent ? (
                <div style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  border: '1px solid rgba(197,160,89,0.2)',
                }}>
                  <div style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '2rem',
                    color: '#C5A059',
                    marginBottom: '1rem',
                    letterSpacing: '0.1em',
                  }}>
                    ✓
                  </div>
                  <h3 style={{
                    fontFamily: 'Tenor Sans, serif',
                    fontSize: '1.5rem',
                    color: '#EAEAEA',
                    letterSpacing: '0.1em',
                    marginBottom: '1rem',
                    fontWeight: 400,
                  }}>
                    ПОЛУЧИХМЕ ЗАЯВКАТА ВИ
                  </h3>
                  <p style={{
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '0.85rem',
                    color: 'rgba(234,234,234,0.4)',
                    letterSpacing: '0.08em',
                  }}>
                    Ще се свържем с вас в рамките на 2 часа.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <input
                        type="text"
                        placeholder="ИМЕ И ФАМИЛИЯ"
                        className="lux-input"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="ИМЕЙЛ"
                        className="lux-input"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <input
                        type="tel"
                        placeholder="ТЕЛЕФОН"
                        className="lux-input"
                        value={formData.phone}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="ЖЕЛАНИ ДАТИ"
                        className="lux-input"
                        value={formData.dates}
                        onChange={e => setFormData(p => ({ ...p, dates: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      placeholder="ВАШЕТО СЪОБЩЕНИЕ"
                      className="lux-input"
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      style={{
                        resize: 'none',
                        fontFamily: 'Satoshi, sans-serif',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(234, 234, 234, 0.2)',
                        color: '#EAEAEA',
                        fontWeight: 300,
                        padding: '1rem 0',
                        width: '100%',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        fontSize: '0.95rem',
                        letterSpacing: '0.05em',
                      }}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="magnetic-btn"
                      style={{
                        width: '100%',
                        border: '1px solid rgba(197,160,89,0.5)',
                        padding: '1.2rem',
                        fontFamily: 'Cinzel, serif',
                        fontSize: '0.7rem',
                        letterSpacing: '0.3em',
                        color: '#EAEAEA',
                        textTransform: 'uppercase',
                        background: 'transparent',
                      }}
                      data-cursor="hover"
                    >
                      <span>ИЗПРАТИ ЗАЯВКА</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════ */}
      <footer style={{
        background: '#060606',
        borderTop: '1px solid rgba(197,160,89,0.1)',
        padding: '4rem 4vw',
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '3rem',
          alignItems: 'start',
        }}>
          {/* Logo */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.6rem',
                letterSpacing: '0.5em',
                color: '#C5A059',
                display: 'block',
              }}>PLAZA</span>
              <span style={{
                fontFamily: 'Tenor Sans, serif',
                fontSize: '1.2rem',
                letterSpacing: '0.3em',
                color: '#EAEAEA',
                display: 'block',
              }}>APARTMENTS</span>
              <span style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.55rem',
                letterSpacing: '0.5em',
                color: 'rgba(234,234,234,0.3)',
                display: 'block',
              }}>PAMPOROVO</span>
            </div>
            <p style={{
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '0.75rem',
              color: 'rgba(234,234,234,0.3)',
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: '260px',
            }}>
              Седем изключителни апартамента в сърцето на Пампорово. Премиум планинско бягство.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              color: '#C5A059',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}>
              НАВИГАЦИЯ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {['Колекцията', 'Философия', 'Консиерж', 'Резервация'].map(link => (
                <button
                  key={link}
                  onClick={() => {
                    const el = document.querySelector(`#${link.toLowerCase().replace('я', 'ia').replace('ц', 'ts')}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '0.8rem',
                    color: 'rgba(234,234,234,0.35)',
                    letterSpacing: '0.1em',
                    cursor: 'none',
                    padding: 0,
                    transition: 'color 0.3s ease',
                  }}
                  data-cursor="hover"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              color: '#C5A059',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}>
              КОНТАКТ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                '+359 888 000 000',
                'info@plaza-pamporovo.bg',
                'Пампорово, Родопи',
                'България',
              ].map(info => (
                <span key={info} style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '0.8rem',
                  color: 'rgba(234,234,234,0.35)',
                  letterSpacing: '0.05em',
                }}>
                  {info}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          maxWidth: '1440px',
          margin: '3rem auto 0',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(234,234,234,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '0.65rem',
            color: 'rgba(234,234,234,0.2)',
            letterSpacing: '0.1em',
          }}>
            © 2025 Mountain Ultra-Lux Pamporovo. Всички права запазени.
          </span>
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.6rem',
            color: 'rgba(197,160,89,0.3)',
            letterSpacing: '0.2em',
          }}>
            01 — 07
          </span>
        </div>
      </footer>

      {/* Global animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section > div[style*="grid-template-columns: 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
