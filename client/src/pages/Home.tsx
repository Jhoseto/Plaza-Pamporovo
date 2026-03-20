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
import { format, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown, MapPin, Wind, Snowflake, Thermometer } from 'lucide-react';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import { apartments } from '@/lib/apartments';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/hero-pamporovo-hKcPiG4L4E98MCUqhhYFF2.webp';
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
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    message: '', 
    apartmentId: '',
    arrivalDate: undefined as Date | undefined,
    departureDate: undefined as Date | undefined 
  });
  const [formSent, setFormSent] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [nights, setNights] = useState<number | null>(null);

  // Calculate total price
  useEffect(() => {
    if (formData.arrivalDate && formData.departureDate && formData.apartmentId) {
      const days = differenceInDays(formData.departureDate, formData.arrivalDate);
      if (days > 0) {
        const apt = apartments.find(a => a.id.toString() === formData.apartmentId);
        if (apt) {
          setNights(days);
          setTotalPrice(days * apt.pricePerNight);
          
          // Animate price summary appearance
          setTimeout(() => {
            gsap.fromTo('.price-summary-reveal',
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
          }, 10);
        }
      } else {
        setNights(null);
        setTotalPrice(null);
      }
    } else {
      setNights(null);
      setTotalPrice(null);
    }
  }, [formData.arrivalDate, formData.departureDate, formData.apartmentId]);

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

      // Booking form fields stagger
      const bookingFields = document.querySelectorAll('.booking-field');
      if (bookingFields.length > 0) {
        gsap.fromTo(bookingFields,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#booking',
              start: 'top 60%',
            },
          }
        );
      }

      // Premium submit button reveal
      const submitBtn = document.querySelector('.premium-submit-btn');
      if (submitBtn) {
        gsap.fromTo(submitBtn,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            delay: 0.5,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '#booking',
              start: 'top 50%',
            },
          }
        );
      }

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
      desc: 'Външно джакузи con гледка към гората, йога сесии на открито и възстановяващи процедури.',
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

        {/* Hero content wrapper */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          padding: '0 4vw 8vh',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '4rem',
        }}>
          {/* Left: Main Titles */}
          <div style={{ flex: '1 1 500px' }}>
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
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="magnetic-btn"
                style={{
                  border: '1px solid rgba(197,160,89,0.5)',
                  padding: '1.2rem 2.5rem',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.3em',
                  color: '#EAEAEA',
                  textTransform: 'uppercase',
                  background: 'transparent',
                }}
                data-cursor="hover"
              >
                <span>РАЗГЛЕДАЙ КОЛЕКЦИЯТА</span>
              </button>
            </div>
          </div>

          {/* Right: Premium Widget Panel */}
          <div className="hero-right-panel" style={{ 
            flex: '0 1 380px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            opacity: 0,
            transform: 'translateX(30px)',
            animation: 'fadeInRight 1.2s ease 0.8s forwards',
          }}>
            {/* Weather & Ski Widget */}
            <div style={{
              background: 'rgba(15, 15, 15, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(197, 160, 89, 0.15)',
              padding: '1.5rem',
              borderRadius: '2px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: '#C5A059' }}>УСЛОВИЯ В ПАМПОРОВО</span>
                <span style={{ fontFamily: 'Satoshi, sans-serif', fontSize: '0.6rem', color: 'rgba(234,234,234,0.4)', letterSpacing: '0.1em' }}>LIVE UPDATE</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Thermometer size={16} color="#C5A059" />
                  <div>
                    <div style={{ fontSize: '1.2rem', color: '#EAEAEA', fontFamily: 'Tenor Sans, serif' }}>-2°C</div>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(234,234,234,0.4)', letterSpacing: '0.1em' }}>ТЕМПЕРАТУРА</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Snowflake size={16} color="#C5A059" />
                  <div>
                    <div style={{ fontSize: '1.2rem', color: '#EAEAEA', fontFamily: 'Tenor Sans, serif' }}>85 cm</div>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(234,234,234,0.4)', letterSpacing: '0.1em' }}>СНЕЖНА ПОКРИВКА</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Wind size={16} color="#C5A059" />
                  <div>
                    <div style={{ fontSize: '1.2rem', color: '#EAEAEA', fontFamily: 'Tenor Sans, serif' }}>12 km/h</div>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(234,234,234,0.4)', letterSpacing: '0.1em' }}>ВЯТЪР (СИ)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px rgba(74, 222, 128, 0.3)' }} />
                  <div>
                    <div style={{ fontSize: '1.2rem', color: '#EAEAEA', fontFamily: 'Tenor Sans, serif' }}>ОТВОРЕНИ</div>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(234,234,234,0.4)', letterSpacing: '0.1em' }}>СКИ ПИСТИ</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Button */}
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=41.643798,24.690415" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(197, 160, 89, 0.05)',
                border: '1px solid rgba(197, 160, 89, 0.2)',
                padding: '1.2rem 1.5rem',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              className="nav-btn-hover"
              data-cursor="hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <MapPin size={18} color="#C5A059" />
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.3em', color: '#EAEAEA' }}>НАВИГАЦИЯ</span>
              </div>
              <ChevronDown size={14} color="#C5A059" style={{ transform: 'rotate(-90deg)' }} />
            </a>

            {/* Compact Registration/Booking CTA */}
            <div style={{
              background: 'rgba(234, 234, 234, 0.03)',
              border: '1px solid rgba(234, 234, 234, 0.08)',
              padding: '1.5rem',
              borderRadius: '2px',
            }}>
              <h4 style={{ fontFamily: 'Tenor Sans, serif', fontSize: '1.1rem', color: '#EAEAEA', marginBottom: '0.5rem', fontWeight: 400 }}>БЪРЗА РЕЗЕРВАЦИЯ</h4>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: '0.75rem', color: 'rgba(234,234,234,0.4)', marginBottom: '1.5rem', lineHeight: 1.5 }}>Изберете дати и апартамент за Вашия престой.</p>
              
              <button 
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  width: '100%',
                  background: '#C5A059',
                  border: 'none',
                  padding: '1rem',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.65rem',
                  letterSpacing: '0.3em',
                  color: '#0A0A0A',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                className="hero-cta-btn"
                data-cursor="hover"
              >
                РЕЗЕРВИРАЙ СЕГА
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: PHILOSOPHY (The Parallax Split)
      ═══════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '15vh 4vw' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '2rem',
          alignItems: 'center',
        }}>
          <div className="scroll-reveal" style={{ gridColumn: '2 / 6' }}>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              color: '#C5A059',
              display: 'block',
              marginBottom: '2rem',
            }}>
              ФИЛОСОФИЯ
            </span>
            <h2 style={{
              fontFamily: 'Tenor Sans, serif',
              fontSize: 'clamp(1.8rem, 3vw, 3.5rem)',
              color: '#EAEAEA',
              lineHeight: 1.2,
              marginBottom: '2.5rem',
            }}>
              КЪДЕТО ЛУКСЪТ СРЕЩА <br /> ПЛАНИНАТА
            </h2>
            <p style={{
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '0.95rem',
              color: 'rgba(234,234,234,0.5)',
              lineHeight: 1.8,
              maxWidth: '400px',
            }}>
              Plaza Pamporovo не е просто място за нощувка. Това е внимателно проектирано пространство, в което всеки детайл е подчинен на Вашия комфорт. От селекцията на материалите до панорамните гледки — тук тишината е новият лукс.
            </p>
          </div>

          <div style={{
            gridColumn: '7 / 12',
            position: 'relative',
            height: '70vh',
            overflow: 'hidden',
          }}>
            <img
              className="parallax-img"
              src={FIREPLACE_IMAGE}
              alt="Plaza Interior"
              style={{
                width: '100%',
                height: '120%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
              }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: COLLECTION (Horizontal Scroll)
      ═══════════════════════════════════════════════════════ */}
      <section ref={hScrollRef} id="collection" style={{ background: '#0A0A0A' }}>
        <div ref={hScrollTrackRef} style={{
          display: 'flex',
          height: '100vh',
          width: 'max-content',
          alignItems: 'center',
          padding: '0 10vw',
        }}>
          {/* Section Intro Slide */}
          <div style={{ width: '40vw', paddingRight: '10vw' }}>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              color: '#C5A059',
              display: 'block',
              marginBottom: '2rem',
            }}>
              КОЛЕКЦИЯ
            </span>
            <h2 style={{
              fontFamily: 'Tenor Sans, serif',
              fontSize: '4rem',
              color: '#EAEAEA',
              lineHeight: 1.1,
              textTransform: 'uppercase',
            }}>
              ОТКРИЙТЕ <br /> ВАШИЯ <br /> ПРИЮТ
            </h2>
          </div>

          {/* Apartment Slides */}
          {apartments.map((apt, i) => (
            <div
              key={apt.id}
              style={{
                width: '75vw',
                height: '70vh',
                marginRight: '8vw',
                display: 'flex',
                gap: '4rem',
              }}
            >
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <img
                  src={apt.images[0]}
                  alt={apt.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '2rem',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '3rem',
                  color: 'rgba(234,234,234,0.1)',
                }}>
                  0{i + 1}
                </div>
              </div>
              <div style={{ width: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{
                  fontFamily: 'Tenor Sans, serif',
                  fontSize: '1.8rem',
                  color: '#EAEAEA',
                  marginBottom: '1.5rem',
                  textTransform: 'uppercase',
                }}>
                  {apt.name}
                </h3>
                <p style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '0.9rem',
                  color: 'rgba(234,234,234,0.4)',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}>
                  {apt.description}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  marginBottom: '3rem',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Cinzel, serif', color: '#C5A059', fontSize: '1.2rem' }}>{apt.size}</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(234,234,234,0.3)', letterSpacing: '0.1em' }}>КВ.М.</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Cinzel, serif', color: '#C5A059', fontSize: '1.2rem' }}>{apt.bedrooms}</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(234,234,234,0.3)', letterSpacing: '0.1em' }}>СПАЛНИ</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/apartment/${apt.id}`)}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #C5A059',
                    color: '#EAEAEA',
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    padding: '0.5rem 0',
                    cursor: 'pointer',
                  }}
                  data-cursor="hover"
                >
                  ВИЖТЕ ПОВЕЧЕ
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: CONCIERGE (Experiences)
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '20vh 4vw', background: '#0A0A0A' }}>
        <div style={{ textAlign: 'center', marginBottom: '10vh' }}>
          <h2 className="scroll-reveal" style={{
            fontFamily: 'Tenor Sans, serif',
            fontSize: 'clamp(2rem, 4vw, 4.5rem)',
            color: '#C5A059',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            НАШИТЕ ПРЕДЛОЖЕНИЯ
          </h2>
          <div className="gold-reveal-line" style={{
            width: '120px',
            height: '1px',
            background: '#C5A059',
            margin: '2rem auto',
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2px',
          background: 'rgba(197,160,89,0.1)',
          border: '1px solid rgba(197,160,89,0.1)',
        }}>
          {conciergeServices.map((service) => (
            <div
              key={service.number}
              className="service-card scroll-reveal"
              style={{
                position: 'relative',
                height: '500px',
                overflow: 'hidden',
                background: '#0A0A0A',
              }}
              data-cursor="hover"
            >
              <img
                src={service.image}
                alt={service.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.4,
                  transition: 'transform 1.2s ease, opacity 1.2s ease',
                }}
                className="service-img"
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)',
              }}>
                <span style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.7rem',
                  color: '#C5A059',
                  marginBottom: '1rem',
                }}>
                  {service.number}
                </span>
                <h3 style={{
                  fontFamily: 'Tenor Sans, serif',
                  fontSize: '1.5rem',
                  color: '#EAEAEA',
                  marginBottom: '1.2rem',
                  letterSpacing: '0.1em',
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '0.85rem',
                  color: 'rgba(234,234,234,0.5)',
                  lineHeight: 1.6,
                  transform: 'translateY(20px)',
                  opacity: 0,
                  transition: 'all 0.6s ease',
                }} className="service-desc">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5: BOOKING
      ═══════════════════════════════════════════════════════ */}
      <section id="booking" style={{ position: 'relative', padding: '15vh 4vw', background: '#0A0A0A', overflow: 'hidden' }}>
        {/* Decorative Background Text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Tenor Sans, serif',
          fontSize: '25vw',
          color: 'rgba(234,234,234,0.02)',
          whiteSpace: 'nowrap',
          zIndex: 0,
          pointerEvents: 'none',
          letterSpacing: '0.1em',
        }}>
          PLAZA
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '8vh' }}>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              color: '#C5A059',
              display: 'block',
              marginBottom: '2rem',
            }}>
              КОНТАКТИ
            </span>
            <h2 style={{
              fontFamily: 'Tenor Sans, serif',
              fontSize: 'clamp(2rem, 4vw, 4rem)',
              color: '#EAEAEA',
              textTransform: 'uppercase',
            }}>
              ВАШАТА РЕЗЕРВАЦИЯ ТУК
            </h2>
          </div>

          <div style={{
            background: 'rgba(15, 15, 15, 0.4)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(197, 160, 89, 0.15)',
            padding: '4rem',
            position: 'relative',
          }}>
            {formSent ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h3 style={{ fontFamily: 'Tenor Sans, serif', fontSize: '2rem', color: '#C5A059', marginBottom: '1.5rem' }}>БЛАГОДАРИМ ВИ!</h3>
                <p style={{ fontFamily: 'Satoshi, sans-serif', color: 'rgba(234,234,234,0.5)' }}>Вашето запитване беше изпратено успешно. Ще се свържем с Вас съвсем скоро.</p>
                <button 
                  onClick={() => setFormSent(false)}
                  style={{ marginTop: '2.5rem', background: 'transparent', border: '1px solid #C5A059', color: '#C5A059', padding: '1rem 2rem', fontFamily: 'Cinzel, serif', cursor: 'pointer' }}
                >
                  НОВО ЗАПИТВАНЕ
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2.5rem' }}>
                {/* Row 1: Name & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <div className="booking-field">
                    <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(197,160,89,0.6)', display: 'block', marginBottom: '0.8rem' }}>ВАШЕТО ИМЕ</label>
                    <input
                      type="text"
                      required
                      className="lux-input-v2"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="booking-field">
                    <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(197,160,89,0.6)', display: 'block', marginBottom: '0.8rem' }}>ИМЕЙЛ АДРЕС</label>
                    <input
                      type="email"
                      required
                      className="lux-input-v2"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Row 2: Apartment & Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '2.5rem' }}>
                  <div className="booking-field">
                    <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(197,160,89,0.6)', display: 'block', marginBottom: '0.8rem' }}>ИЗБЕРЕТЕ АПАРТАМЕНТ</label>
                    <Select onValueChange={(val) => setFormData(p => ({ ...p, apartmentId: val }))}>
                      <SelectTrigger className="lux-select-trigger">
                        <SelectValue placeholder="ИЗБЕРЕТЕ..." />
                      </SelectTrigger>
                      <SelectContent className="lux-select-content">
                        {apartments.map(apt => (
                          <SelectItem key={apt.id} value={apt.id.toString()} className="lux-select-item">
                            {apt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="booking-field">
                    <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(197,160,89,0.6)', display: 'block', marginBottom: '0.8rem' }}>ПРИСТИГАНЕ</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="lux-date-trigger">
                          {formData.arrivalDate ? format(formData.arrivalDate, 'dd/MM/yyyy') : 'ИЗБЕРЕТЕ ДАТА'}
                          <CalendarIcon size={14} style={{ opacity: 0.4 }} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="lux-popover-content">
                        <Calendar
                          mode="single"
                          selected={formData.arrivalDate}
                          onSelect={(date) => setFormData(p => ({ ...p, arrivalDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="booking-field">
                    <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(197,160,89,0.6)', display: 'block', marginBottom: '0.8rem' }}>ЗАМИНАВАНЕ</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="lux-date-trigger">
                          {formData.departureDate ? format(formData.departureDate, 'dd/MM/yyyy') : 'ИЗБЕРЕТЕ ДАТА'}
                          <CalendarIcon size={14} style={{ opacity: 0.4 }} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="lux-popover-content">
                        <Calendar
                          mode="single"
                          selected={formData.departureDate}
                          onSelect={(date) => setFormData(p => ({ ...p, departureDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Row 3: Message */}
                <div className="booking-field">
                  <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(197,160,89,0.6)', display: 'block', marginBottom: '0.8rem' }}>ДОПЪЛНИТЕЛНИ ЖЕЛАНИЯ</label>
                  <textarea
                    className="lux-input-v2"
                    rows={2}
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Price Summary Block */}
                {totalPrice !== null && nights !== null && (
                  <div className="price-summary-reveal" style={{ 
                    borderTop: '1px solid rgba(197, 160, 89, 0.2)', 
                    paddingTop: '2rem',
                    marginTop: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    <div>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(197,160,89,0.6)', display: 'block', marginBottom: '0.5rem' }}>ОБОБЩЕНИЕ НА ПРЕСТОЯ</span>
                      <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: '0.9rem', color: 'rgba(234,234,234,0.5)', letterSpacing: '0.05em' }}>
                        {nights} {nights === 1 ? 'нощувка' : 'нощувки'} × {apartments.find(a => a.id.toString() === formData.apartmentId)?.pricePerNight} лв.
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(197,160,89,0.6)', display: 'block', marginBottom: '0.5rem' }}>ОБЩА СУМА</span>
                      <div style={{ fontFamily: 'Tenor Sans, serif', fontSize: '2rem', color: '#C5A059', letterSpacing: '0.05em' }}>
                        {totalPrice.toLocaleString()} лв.
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '1rem' }}>
                  <button
                    type="submit"
                    className="premium-submit-btn"
                    data-cursor="hover"
                  >
                    <span>ИЗПРАТИ ЗАПИТВАНЕ</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '8vh 4vw', borderTop: '1px solid rgba(234,234,234,0.05)', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Tenor Sans, serif', fontSize: '1.5rem', color: '#EAEAEA', marginBottom: '2rem', letterSpacing: '0.2em' }}>
          PLAZA PAMPOROVO
        </div>
        <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: '0.7rem', color: 'rgba(234,234,234,0.3)', letterSpacing: '0.1em' }}>
          © 2024 ВСИЧКИ ПРАВА ЗАПАЗЕНИ. ДИЗАЙН И КОНЦЕПЦИЯ ОТ PLAZA GROUP.
        </div>
      </footer>
    </div>
  );
}
