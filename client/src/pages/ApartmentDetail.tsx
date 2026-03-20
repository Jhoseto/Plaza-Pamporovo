/**
 * DESIGN: Dark Cinematic Minimalist × Swiss Design Precision
 * Apartment Detail Page: Drag gallery with inertia + animated SVG floor plan
 */

import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { apartments } from '@/lib/apartments';

gsap.registerPlugin(ScrollTrigger);

export default function ApartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const apt = apartments.find(a => a.id === Number(id));

  const [currentImg, setCurrentImg] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!apt) navigate('/');
  }, [apt, navigate]);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.detail-reveal').forEach((el) => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          }
        );
      });

      // Animate SVG floor plan paths
      const paths = svgRef.current?.querySelectorAll('path, line, rect, polyline');
      if (paths && paths.length > 0) {
        gsap.fromTo(paths,
          { strokeDashoffset: '100%', strokeDasharray: '100%' },
          {
            strokeDashoffset: '0%',
            duration: 2,
            stagger: 0.1,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: svgRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [apt]);

  // Drag gallery with inertia
  const onMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    lastX.current = e.pageX;
    cancelAnimationFrame(rafId.current);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    velocity.current = e.pageX - lastX.current;
    lastX.current = e.pageX;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    applyInertia();
  };

  const applyInertia = () => {
    if (!trackRef.current) return;
    const decelerate = () => {
      if (!trackRef.current) return;
      velocity.current *= 0.92;
      trackRef.current.scrollLeft -= velocity.current;
      if (Math.abs(velocity.current) > 0.5) {
        rafId.current = requestAnimationFrame(decelerate);
      }
    };
    rafId.current = requestAnimationFrame(decelerate);
  };

  if (!apt) return null;

  const floorPlanRooms = [
    { x: 20, y: 20, w: 120, h: 80, label: 'Хол' },
    { x: 150, y: 20, w: 90, h: 80, label: 'Кухня' },
    { x: 20, y: 110, w: 100, h: 70, label: 'Спалня 1' },
    { x: 130, y: 110, w: 110, h: 70, label: 'Спалня 2' },
    { x: 20, y: 190, w: 60, h: 50, label: 'Баня' },
    { x: 90, y: 190, w: 150, h: 50, label: 'Тераса' },
  ];

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', overflowX: 'hidden' }}>
      <div className="noise-overlay" />
      <CustomCursor />
      <Navigation />

      {/* ── HERO GALLERY ── */}
      <section style={{ paddingTop: '80px', position: 'relative' }}>
        {/* Main drag gallery */}
        <div
          ref={galleryRef}
          style={{
            position: 'relative',
            height: '75vh',
            overflow: 'hidden',
            cursor: isDragging.current ? 'grabbing' : 'none',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          data-cursor="view"
        >
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              height: '100%',
              overflowX: 'scroll',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              userSelect: 'none',
            }}
          >
            {apt.images.map((img, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: '100vw',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <img
                  src={img}
                  alt={`${apt.name} - ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none',
                    display: 'block',
                  }}
                  draggable={false}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 60%, rgba(10,10,10,0.7) 100%)',
                }} />
              </div>
            ))}
          </div>

          {/* Drag hint */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            pointerEvents: 'none',
          }}>
            <div style={{ width: '30px', height: '1px', background: 'rgba(197,160,89,0.5)' }} />
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.55rem',
              letterSpacing: '0.3em',
              color: 'rgba(197,160,89,0.6)',
              textTransform: 'uppercase',
            }}>
              ВЛАЧИ ЗА ПОВЕЧЕ
            </span>
            <div style={{ width: '30px', height: '1px', background: 'rgba(197,160,89,0.5)' }} />
          </div>

          {/* Image counter */}
          <div style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'rgba(197,160,89,0.7)',
          }}>
            {apt.images.length} СНИМКИ
          </div>
        </div>
      </section>

      {/* ── APARTMENT INFO ── */}
      <section style={{ padding: 'clamp(4rem, 7vw, 7rem) 4vw' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5rem',
            alignItems: 'start',
          }}>
            {/* Left */}
            <div>
              <div className="detail-reveal">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.6rem',
                    letterSpacing: '0.4em',
                    color: '#C5A059',
                    textTransform: 'uppercase',
                  }}>
                    АПАРТАМЕНТ {apt.number}
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(197,160,89,0.2)' }} />
                </div>

                <h1 style={{
                  fontFamily: 'Tenor Sans, serif',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  color: '#EAEAEA',
                  letterSpacing: '0.05em',
                  fontWeight: 400,
                  lineHeight: 1.15,
                  marginBottom: '1rem',
                }}>
                  {apt.name}
                </h1>

                <p style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '0.85rem',
                  color: '#C5A059',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '2rem',
                }}>
                  {apt.view}
                </p>
              </div>

              <div className="detail-reveal">
                <p style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '1rem',
                  color: 'rgba(234,234,234,0.6)',
                  lineHeight: 1.8,
                  fontWeight: 300,
                  marginBottom: '3rem',
                }}>
                  {apt.description}
                </p>
              </div>

              {/* Stats */}
              <div className="detail-reveal">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1px',
                  background: 'rgba(234,234,234,0.05)',
                  marginBottom: '3rem',
                }}>
                  {[
                    { label: 'ПЛОЩ', value: `${apt.sqm} м²` },
                    { label: 'СПАЛНИ', value: String(apt.bedrooms) },
                    { label: 'ГОСТИ', value: String(apt.maxGuests) },
                    { label: 'ЕТАЖ', value: String(apt.floor) },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      padding: '1.5rem 1rem',
                      background: '#0A0A0A',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: '1.4rem',
                        color: '#C5A059',
                        letterSpacing: '0.05em',
                        marginBottom: '0.4rem',
                      }}>
                        {stat.value}
                      </div>
                      <div style={{
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.6rem',
                        color: 'rgba(234,234,234,0.3)',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="detail-reveal">
                <div style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.3em',
                  color: '#C5A059',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                }}>
                  ВКЛЮЧЕНО
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {apt.features.map(feat => (
                    <div key={feat} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.8rem 0',
                      borderBottom: '1px solid rgba(234,234,234,0.05)',
                    }}>
                      <span style={{ color: '#C5A059', fontSize: '0.7rem' }}>—</span>
                      <span style={{
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.85rem',
                        color: 'rgba(234,234,234,0.55)',
                        letterSpacing: '0.05em',
                      }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Pricing + CTA */}
            <div>
              <div className="detail-reveal" style={{
                border: '1px solid rgba(197,160,89,0.15)',
                padding: '3rem',
                marginBottom: '2rem',
              }}>
                <div style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.3em',
                  color: '#C5A059',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                }}>
                  ЦЕНА
                </div>
                <div style={{
                  fontFamily: 'Tenor Sans, serif',
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  color: '#EAEAEA',
                  letterSpacing: '0.02em',
                  marginBottom: '0.5rem',
                }}>
                  {apt.pricePerNight.toLocaleString()} лв
                </div>
                <div style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '0.75rem',
                  color: 'rgba(234,234,234,0.3)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '2.5rem',
                }}>
                  на нощ · включва всички такси
                </div>

                <button
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      const el = document.querySelector('#booking');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}
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
                  <span>РЕЗЕРВИРАЙ СЕГА</span>
                </button>

                <div style={{
                  marginTop: '1.5rem',
                  textAlign: 'center',
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '0.7rem',
                  color: 'rgba(234,234,234,0.25)',
                  letterSpacing: '0.1em',
                }}>
                  Безплатна анулация до 48 часа
                </div>
              </div>

              {/* Calendar */}
              <div className="detail-reveal" style={{ marginBottom: '2rem' }}>
                <AvailabilityCalendar
                  apartmentId={apt.id}
                  onDateSelect={(date) => setSelectedDate(date)}
                />
              </div>

              {/* Contact */}
              <div className="detail-reveal" style={{
                padding: '2rem',
                background: 'rgba(197,160,89,0.03)',
                border: '1px solid rgba(197,160,89,0.08)',
              }}>
                <div style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '0.8rem',
                  color: 'rgba(234,234,234,0.4)',
                  lineHeight: 1.7,
                  letterSpacing: '0.05em',
                }}>
                  {selectedDate ? (
                    <>
                      Избрали сте: <strong style={{ color: '#C5A059' }}>{selectedDate.toLocaleDateString('bg-BG')}</strong><br />
                      Свържете се с нашия консиерж за потвърждение.
                    </>
                  ) : (
                    <>
                      Имате въпроси? Нашият консиерж е на ваше<br />
                      разположение 24/7.
                    </>
                  )}
                </div>
                <a
                  href="tel:+359888000000"
                  style={{
                    display: 'inline-block',
                    marginTop: '1rem',
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.75rem',
                    color: '#C5A059',
                    letterSpacing: '0.15em',
                    textDecoration: 'none',
                  }}
                  data-cursor="hover"
                >
                  +359 888 000 000
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANIMATED FLOOR PLAN ── */}
      <section style={{
        padding: 'clamp(4rem, 7vw, 7rem) 4vw',
        background: '#0D0D0D',
        borderTop: '1px solid rgba(197,160,89,0.08)',
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div className="detail-reveal" style={{ marginBottom: '3rem' }}>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              color: '#C5A059',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '1rem',
            }}>
              ПЛАН НА АПАРТАМЕНТА
            </span>
            <h2 style={{
              fontFamily: 'Tenor Sans, serif',
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              color: '#EAEAEA',
              letterSpacing: '0.05em',
              fontWeight: 400,
            }}>
              Разпределение на пространството
            </h2>
          </div>

          {/* Animated SVG Floor Plan */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '3rem 0',
          }}>
            <svg
              ref={svgRef}
              viewBox="0 0 260 250"
              style={{
                width: '100%',
                maxWidth: '700px',
                height: 'auto',
              }}
            >
              {/* Outer wall */}
              <rect
                x="10"
                y="10"
                width="240"
                height="230"
                fill="none"
                stroke="rgba(197,160,89,0.6)"
                strokeWidth="2"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                style={{ animation: 'drawPath 2s ease forwards 0.2s' }}
              />

              {/* Room dividers */}
              <line x1="150" y1="10" x2="150" y2="100" stroke="rgba(197,160,89,0.3)" strokeWidth="1"
                strokeDasharray="200" strokeDashoffset="200"
                style={{ animation: 'drawPath 1.5s ease forwards 0.5s' }} />
              <line x1="10" y1="100" x2="250" y2="100" stroke="rgba(197,160,89,0.3)" strokeWidth="1"
                strokeDasharray="300" strokeDashoffset="300"
                style={{ animation: 'drawPath 1.5s ease forwards 0.7s' }} />
              <line x1="120" y1="100" x2="120" y2="190" stroke="rgba(197,160,89,0.3)" strokeWidth="1"
                strokeDasharray="200" strokeDashoffset="200"
                style={{ animation: 'drawPath 1.5s ease forwards 0.9s' }} />
              <line x1="10" y1="190" x2="250" y2="190" stroke="rgba(197,160,89,0.3)" strokeWidth="1"
                strokeDasharray="300" strokeDashoffset="300"
                style={{ animation: 'drawPath 1.5s ease forwards 1.1s' }} />
              <line x1="80" y1="190" x2="80" y2="240" stroke="rgba(197,160,89,0.3)" strokeWidth="1"
                strokeDasharray="100" strokeDashoffset="100"
                style={{ animation: 'drawPath 1.5s ease forwards 1.3s' }} />

              {/* Room labels */}
              {[
                { x: 80, y: 55, label: 'ХОЛ', sub: `${Math.round(apt.sqm * 0.3)} м²` },
                { x: 200, y: 55, label: 'КУХНЯ', sub: `${Math.round(apt.sqm * 0.15)} м²` },
                { x: 65, y: 145, label: 'СПАЛНЯ', sub: `${Math.round(apt.sqm * 0.2)} м²` },
                { x: 185, y: 145, label: 'СПАЛНЯ', sub: `${Math.round(apt.sqm * 0.2)} м²` },
                { x: 45, y: 215, label: 'БАНЯ', sub: '' },
                { x: 165, y: 215, label: 'ТЕРАСА', sub: '' },
              ].map((room, i) => (
                <g key={i} style={{ opacity: 0, animation: `fadeIn 0.5s ease forwards ${1.5 + i * 0.15}s` }}>
                  <text
                    x={room.x}
                    y={room.y}
                    textAnchor="middle"
                    fill="rgba(234,234,234,0.5)"
                    fontSize="7"
                    fontFamily="Cinzel, serif"
                    letterSpacing="1"
                  >
                    {room.label}
                  </text>
                  {room.sub && (
                    <text
                      x={room.x}
                      y={room.y + 10}
                      textAnchor="middle"
                      fill="rgba(197,160,89,0.5)"
                      fontSize="6"
                      fontFamily="Satoshi, sans-serif"
                    >
                      {room.sub}
                    </text>
                  )}
                </g>
              ))}

              {/* Door indicators */}
              <path d="M 150 10 Q 165 10 165 25" fill="none" stroke="rgba(197,160,89,0.4)" strokeWidth="0.8"
                strokeDasharray="50" strokeDashoffset="50"
                style={{ animation: 'drawPath 1s ease forwards 1.8s' }} />
            </svg>
          </div>
        </div>
      </section>

      {/* Back button */}
      <div style={{ padding: '3rem 4vw', background: '#0A0A0A' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'none',
          }}
          data-cursor="hover"
        >
          <span style={{ color: '#C5A059', fontSize: '1.2rem' }}>←</span>
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            color: 'rgba(234,234,234,0.4)',
            textTransform: 'uppercase',
          }}>
            ОБРАТНО КЪМ КОЛЕКЦИЯТА
          </span>
        </button>
      </div>

      <style>{`
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
