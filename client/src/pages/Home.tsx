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
import { Calendar as CalendarIcon, MapPin, Snowflake, Thermometer } from 'lucide-react';
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
const HERO_VIDEO_MP4 = 'https://res.cloudinary.com/dlzujc8v5/video/upload/v1773994846/Untitled_hvh0hg.mp4';
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

  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const hScrollTrackRef = useRef<HTMLDivElement>(null);
  const [isHoveringConcierge, setIsHoveringConcierge] = useState(false);

  // Calculate total price
  useEffect(() => {
    if (formData.arrivalDate && formData.departureDate && formData.apartmentId) {
      const days = differenceInDays(formData.departureDate, formData.arrivalDate);
      if (days > 0) {
        const apt = apartments.find(a => a.id.toString() === formData.apartmentId);
        if (apt) {
          setNights(days);
          setTotalPrice(days * apt.pricePerNight);
          gsap.fromTo('.price-summary-reveal', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
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

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero image zoom
      if (heroBgRef.current) {
        gsap.fromTo(heroBgRef.current, { scale: 1.12 }, { scale: 1, duration: 2.2, ease: 'power3.out' });
      }

      // Hero title letter stagger
      if (heroTitleRef.current) {
        const letters = heroTitleRef.current.querySelectorAll('.hero-letter');
        gsap.fromTo(letters, { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.04, ease: 'power4.out', delay: 0.3 });
      }

      // Scroll-triggered reveals
      gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((el) => {
        gsap.fromTo(el, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });

      // Parallax on images
      gsap.utils.toArray<HTMLElement>('.parallax-img').forEach((img) => {
        gsap.to(img, { yPercent: -15, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      // Horizontal scroll section (CONCIERGE)
      if (hScrollRef.current && hScrollTrackRef.current) {
        const track = hScrollTrackRef.current;
        const totalWidth = track.scrollWidth - hScrollRef.current.offsetWidth;
        
        gsap.to(track, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: hScrollRef.current,
            start: 'top top',
            end: () => `+=${totalWidth + 600}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
      }

      // Gold line animation
      gsap.utils.toArray<HTMLElement>('.gold-reveal-line').forEach((line) => {
        gsap.fromTo(line, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: line, start: 'top 90%' } });
      });
    });

    return () => ctx.revert();
  }, []);

  // Smooth scroll with Lenis
  useEffect(() => {
    let lenis: any;
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    });
    return () => { if (lenis) lenis.destroy(); };
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="hero-letter" style={{ display: 'inline-block', opacity: 0, whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const conciergeServices = [
    { number: '01', title: 'РЕСТОРАНТ', desc: 'Изискана кухня и уютна атмосфера. Насладете се на традиционни родопски ястия и модерна гастрономия.', image: CHEF_IMAGE },
    { number: '02', title: 'СПА ЦЕНТЪР', desc: 'Пълноценен релакс и възстановяване. Басейн, сауна и парни бани за вашето здраве и тонус.', image: SPA_IMAGE },
    { number: '03', title: 'СКИ ГАРДЕРОБ', desc: 'Модерно оборудване и сигурност за вашата екипировка. Комфорт само на крачки от пистите.', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663458413005/uhXRuwuHobPnKCev.jpg' },
    { number: '04', title: 'ЗИМНИ ПРИКЛЮЧЕНИЯ', desc: 'Нощно каране на писта "Снежанка 2", преходи с моторни шейни до връх Мургавец и панорамен тур с ратрак.', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663458413005/SuvwgckREWHBVDuC.jpg' },
    { number: '05', title: 'ВЕЛОПАРК ПАМПОРОВО', desc: 'Най-големият велопарк на Балканите с над 35 км трасета за планинско колоездене от всяко ниво.', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663458413005/hVSJWZloYUlFmSFD.jpg' },
    { number: '06', title: 'ПРИКЛЮЧЕНСКИ ПАРК "ЯЗОВИРА"', desc: 'Алпийски тролей, въжена градина, спортен риболов и зони за релакс сред чистия боров въздух.', image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663458413005/DPwHoRbKyayssQHA.jpg' },
    { number: '07', title: 'КУЛТУРА И ПРИРОДА', desc: 'Посещение на обсерватория Рожен, пещерите Дяволското гърло и Ягодинска, и панорамни преходи.', image: BEDROOM_IMAGE },
    { number: '08', title: 'РЕЛАКС И УЕЛНЕС', desc: 'Външно джакузи с гледка към гората, йога сесии на открито и възстановяващи процедури.', image: FIREPLACE_IMAGE },
  ];

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', overflowX: 'hidden' }}>
      <div className="noise-overlay" />
      <CustomCursor />
      <Navigation />

      {/* HERO SECTION */}
      <section ref={heroRef} style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <div ref={heroBgRef} style={{ position: 'absolute', inset: '-10%', backgroundImage: `url(${HERO_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
            <source src={HERO_VIDEO_MP4} type="video/mp4" />
          </video>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.4) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: '0 4vw 8vh', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '4rem' }}>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', letterSpacing: '0.4em', color: '#C5A059', marginBottom: '1.5rem', opacity: 0, animation: 'fadeInUp 0.8s ease forwards' }}>ПАМПОРОВО · РОДОПИ · БЪЛГАРИЯ</div>
            <div ref={heroTitleRef} style={{ overflow: 'hidden' }}>
              <h1 style={{ fontFamily: 'Tenor Sans, serif', fontSize: 'clamp(2.2rem, 5.5vw, 6.5rem)', color: '#EAEAEA', textTransform: 'uppercase', margin: 0 }}>{splitText('PLAZA')}</h1>
              <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2.2rem, 5.5vw, 6.5rem)', color: '#C5A059', textTransform: 'uppercase', margin: 0 }}>{splitText('APARTMENTS')}</h1>
            </div>
          </div>

          <div className="hero-right-panel" style={{ flex: '0 1 380px', display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0, animation: 'fadeInRight 1.2s ease 0.8s forwards' }}>
            <div style={{ background: 'rgba(15, 15, 15, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(197, 160, 89, 0.15)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', color: '#C5A059' }}>УСЛОВИЯ В ПАМПОРОВО</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Thermometer size={16} color="#C5A059" /><div><div style={{ color: '#EAEAEA' }}>-2°C</div></div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Snowflake size={16} color="#C5A059" /><div><div style={{ color: '#EAEAEA' }}>85 cm</div></div></div>
              </div>
            </div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=41.643798,24.690415" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(197, 160, 89, 0.05)', border: '1px solid rgba(197, 160, 89, 0.2)', padding: '1.2rem', textDecoration: 'none', color: '#EAEAEA' }}>
              <MapPin size={18} color="#C5A059" /> <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem' }}>НАВИГАЦИЯ</span>
            </a>
            <button onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: '#C5A059', border: 'none', padding: '1rem', fontFamily: 'Cinzel, serif', color: '#0A0A0A', fontWeight: 700 }}>РЕЗЕРВИРАЙ СЕГА</button>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section style={{ padding: '15vh 4vw' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', alignItems: 'center' }}>
          <div className="scroll-reveal" style={{ gridColumn: '2 / 6' }}>
            <span className="section-label">ФИЛОСОФИЯ</span>
            <h2 style={{ fontFamily: 'Tenor Sans, serif', fontSize: '3rem', color: '#EAEAEA', lineHeight: 1.2 }}>КЪДЕТО ЛУКСЪТ СРЕЩА ПЛАНИНАТА</h2>
            <p style={{ color: 'rgba(234,234,234,0.5)', lineHeight: 1.8 }}>Plaza Pamporovo не е просто място за нощувка. Това е внимателно проектирано пространство, в което всеки детайл е подчинен на Вашия комфорт.</p>
          </div>
          <div style={{ gridColumn: '7 / 12', height: '70vh', overflow: 'hidden' }}>
            <img className="parallax-img" src={FIREPLACE_IMAGE} style={{ width: '100%', height: '120%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* COLLECTION SECTION (Vertical List as requested) */}
      <section id="collection" style={{ background: '#0A0A0A', padding: 'clamp(5rem, 8vw, 8rem) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-2vw', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Cinzel, serif', fontSize: 'clamp(12rem, 25vw, 28rem)', color: 'transparent', WebkitTextStroke: '1px rgba(197,160,89,0.06)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{apartments[activeApt].number}</div>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 4vw' }}>
          <div className="scroll-reveal" style={{ marginBottom: '4rem' }}>
            <span className="section-label">03 — КОЛЕКЦИЯ АПАРТАМЕНТИ</span>
            <h2 style={{ fontFamily: 'Tenor Sans, serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#EAEAEA', letterSpacing: '0.05em', fontWeight: 400, margin: 0 }}>Седем пространства.<br /><span style={{ color: 'rgba(234,234,234,0.35)' }}>Един стандарт.</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
            <div>
              {apartments.map((apt, i) => (
                <div key={apt.id} className="apt-row" onClick={() => setActiveApt(i)} style={{ padding: '1.8rem 0', cursor: 'none', display: 'grid', gridTemplateColumns: '3rem 1fr auto', alignItems: 'center', gap: '1.5rem', borderBottom: `1px solid ${activeApt === i ? 'rgba(197, 160, 89, 0.5)' : 'rgba(234, 234, 234, 0.06)'}`, transition: 'all 0.3s ease', background: activeApt === i ? 'rgba(197, 160, 89, 0.03)' : 'transparent' }} data-cursor="hover">
                  <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', color: activeApt === i ? '#C5A059' : 'rgba(197, 160, 89, 0.4)', letterSpacing: '0.1em' }}>{apt.number}</span>
                  <div>
                    <div style={{ fontFamily: 'Tenor Sans, serif', fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: activeApt === i ? '#EAEAEA' : 'rgba(234, 234, 234, 0.55)', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{apt.name}</div>
                    <div style={{ fontFamily: 'Satoshi, sans-serif', fontSize: '0.7rem', color: 'rgba(234, 234, 234, 0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{apt.sqm} м² · {apt.view}</div>
                  </div>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#C5A059', opacity: activeApt === i ? 1 : 0, transition: 'opacity 0.3s ease' }} />
                </div>
              ))}
            </div>
            <div style={{ position: 'sticky', top: '15vh', height: '70vh', overflow: 'hidden' }}>
              <img key={activeApt} src={apartments[activeApt].images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'fadeIn 0.8s ease' }} />
              <button onClick={() => navigate(`/apartment/${apartments[activeApt].id}`)} className="magnetic-btn" style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: '#C5A059', color: '#0A0A0A', border: 'none', padding: '1rem 2rem', fontFamily: 'Cinzel, serif', fontSize: '0.7rem', letterSpacing: '0.2em' }}>ОТКРИЙТЕ ПОВЕЧЕ</button>
            </div>
          </div>
        </div>
      </section>

      {/* CONCIERGE SECTION (Horizontal Scroll as requested) */}
      <section 
        ref={hScrollRef} 
        className="concierge-section"
        style={{ background: '#0A0A0A', position: 'relative' }}
      >
        <div ref={hScrollTrackRef} style={{ display: 'flex', height: '100vh', width: 'max-content', alignItems: 'center', padding: '0 10vw' }}>
          <div style={{ width: '40vw', paddingRight: '10vw' }}>
            <span className="section-label">04 — ПРЕДЛОЖЕНИЯ</span>
            <h2 style={{ fontFamily: 'Tenor Sans, serif', fontSize: '4.5rem', color: '#C5A059', lineHeight: 1.1, textTransform: 'uppercase' }}>НАШИТЕ <br /> ПРЕДЛОЖЕНИЯ</h2>
          </div>
          {conciergeServices.map((service) => (
            <div 
              key={service.number} 
              className="concierge-card"
              style={{ 
                width: '450px', 
                height: '65vh', 
                marginRight: '4vw', 
                position: 'relative', 
                overflow: 'hidden', 
                background: '#0A0A0A',
                transition: 'all 0.5s ease'
              }}
            >
              <img 
                src={service.image} 
                className="concierge-img"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  opacity: 0.4,
                  transition: 'all 0.5s ease'
                }} 
              />
              <div style={{ position: 'absolute', inset: 0, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)' }}>
                <span style={{ fontFamily: 'Cinzel, serif', color: '#C5A059', marginBottom: '1rem' }}>{service.number}</span>
                <h3 style={{ fontFamily: 'Tenor Sans, serif', fontSize: '1.8rem', color: '#EAEAEA', marginBottom: '1.2rem' }}>{service.title}</h3>
                <p style={{ color: 'rgba(234,234,234,0.5)', lineHeight: 1.6 }}>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" style={{ position: 'relative', padding: '15vh 4vw', background: '#0A0A0A', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Tenor Sans, serif', fontSize: '25vw', color: 'rgba(234,234,234,0.02)', whiteSpace: 'nowrap', zIndex: 0, pointerEvents: 'none' }}>PLAZA</div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '8vh' }}>
            <span className="section-label">КОНТАКТИ</span>
            <h2 style={{ fontFamily: 'Tenor Sans, serif', fontSize: '4rem', color: '#EAEAEA' }}>ВАШАТА РЕЗЕРВАЦИЯ ТУК</h2>
          </div>
          <div style={{ background: 'rgba(15, 15, 15, 0.4)', backdropFilter: 'blur(30px)', border: '1px solid rgba(197, 160, 89, 0.15)', padding: '4rem' }}>
            {formSent ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h3 style={{ fontFamily: 'Tenor Sans, serif', fontSize: '2rem', color: '#C5A059' }}>БЛАГОДАРИМ ВИ!</h3>
                <button onClick={() => setFormSent(false)} style={{ marginTop: '2.5rem', background: 'transparent', border: '1px solid #C5A059', color: '#C5A059', padding: '1rem 2rem', fontFamily: 'Cinzel, serif' }}>НОВО ЗАПИТВАНЕ</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setFormSent(true); }} style={{ display: 'grid', gap: '2.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <div className="booking-field"><label className="section-label" style={{ fontSize: '0.55rem', marginBottom: '0.8rem', display: 'block' }}>ВАШЕТО ИМЕ</label><input type="text" required className="lux-input-v2" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></div>
                  <div className="booking-field"><label className="section-label" style={{ fontSize: '0.55rem', marginBottom: '0.8rem', display: 'block' }}>ИМЕЙЛ АДРЕС</label><input type="email" required className="lux-input-v2" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '2.5rem' }}>
                  <div className="booking-field">
                    <label className="section-label" style={{ fontSize: '0.55rem', marginBottom: '0.8rem', display: 'block' }}>ИЗБЕРЕТЕ АПАРТАМЕНТ</label>
                    <Select onValueChange={(val) => setFormData(p => ({ ...p, apartmentId: val }))}>
                      <SelectTrigger className="lux-select-trigger"><SelectValue placeholder="ИЗБЕРЕТЕ..." /></SelectTrigger>
                      <SelectContent className="lux-select-content">{apartments.map(apt => <SelectItem key={apt.id} value={apt.id.toString()} className="lux-select-item">{apt.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="booking-field">
                    <label className="section-label" style={{ fontSize: '0.55rem', marginBottom: '0.8rem', display: 'block' }}>ПРИСТИГАНЕ</label>
                    <Popover><PopoverTrigger asChild><button className="lux-date-trigger">{formData.arrivalDate ? format(formData.arrivalDate, 'dd/MM/yyyy') : 'ИЗБЕРЕТЕ ДАТА'}<CalendarIcon size={14} style={{ opacity: 0.4 }} /></button></PopoverTrigger>
                    <PopoverContent className="lux-popover-content"><Calendar mode="single" selected={formData.arrivalDate} onSelect={(date) => setFormData(p => ({ ...p, arrivalDate: date }))} /></PopoverContent></Popover>
                  </div>
                  <div className="booking-field">
                    <label className="section-label" style={{ fontSize: '0.55rem', marginBottom: '0.8rem', display: 'block' }}>ЗАМИНАВАНЕ</label>
                    <Popover><PopoverTrigger asChild><button className="lux-date-trigger">{formData.departureDate ? format(formData.departureDate, 'dd/MM/yyyy') : 'ИЗБЕРЕТЕ ДАТА'}<CalendarIcon size={14} style={{ opacity: 0.4 }} /></button></PopoverTrigger>
                    <PopoverContent className="lux-popover-content"><Calendar mode="single" selected={formData.departureDate} onSelect={(date) => setFormData(p => ({ ...p, departureDate: date }))} /></PopoverContent></Popover>
                  </div>
                </div>
                {totalPrice !== null && (
                  <div className="price-summary-reveal" style={{ borderTop: '1px solid rgba(197, 160, 89, 0.2)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div><span className="section-label" style={{ fontSize: '0.55rem' }}>ОБОБЩЕНИЕ НА ПРЕСТОЯ</span><div style={{ color: 'rgba(234,234,234,0.5)' }}>{nights} нощувки × {apartments.find(a => a.id.toString() === formData.apartmentId)?.pricePerNight} лв.</div></div>
                    <div style={{ textAlign: 'right' }}><span className="section-label" style={{ fontSize: '0.55rem' }}>ОБЩА СУМА</span><div style={{ fontFamily: 'Tenor Sans, serif', fontSize: '2.5rem', color: '#C5A059' }}>{totalPrice.toLocaleString()} лв.</div></div>
                  </div>
                )}
                <button type="submit" className="premium-submit-btn"><span>ИЗПРАТИ ЗАПИТВАНЕ</span></button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer style={{ padding: '8vh 4vw', borderTop: '1px solid rgba(234,234,234,0.05)', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Tenor Sans, serif', fontSize: '1.8rem', color: '#EAEAEA', marginBottom: '1.5rem' }}>PLAZA PAMPOROVO</div>
        <div style={{ color: 'rgba(234,234,234,0.3)', fontSize: '0.7rem' }}>© 2024 ВСИЧКИ ПРАВА ЗАПАЗЕНИ. ДИЗАЙН И КОНЦЕПЦИЯ ОТ PLAZA GROUP.</div>
      </footer>
    </div>
  );
}
