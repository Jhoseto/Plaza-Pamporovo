/**
 * DESIGN: Dark Cinematic Minimalist × Swiss Design Precision
 * Premium availability calendar with GSAP animations
 */

import { useState, useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import gsap from 'gsap';
import { trpc } from '@/lib/trpc';
import 'react-day-picker/dist/style.css';

interface AvailabilityCalendarProps {
  apartmentId: number;
  onDateSelect?: (date: Date) => void;
}

export default function AvailabilityCalendar({ apartmentId, onDateSelect }: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [month, setMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Fetch availability from API
  const { data: availability, isLoading } = trpc.reservations.getAvailability.useQuery({
    apartmentId,
    year: month.getFullYear(),
    month: month.getMonth() + 1,
  });

  // GSAP entrance animation
  useEffect(() => {
    if (calendarRef.current) {
      gsap.fromTo(calendarRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  const handleDayClick = (date: Date | undefined) => {
    if (date && availability && !availability.booked.some(d => d.toDateString() === date.toDateString())) {
      setSelectedDate(date);
      onDateSelect?.(date);
    }
  };

  const bookedDates = availability?.booked || [];

  return (
    <div
      ref={calendarRef}
      style={{
        background: 'rgba(197,160,89,0.03)',
        border: '1px solid rgba(197,160,89,0.15)',
        padding: '2rem',
        borderRadius: '0.65rem',
      }}
    >
      <div style={{
        fontFamily: 'Cinzel, serif',
        fontSize: '0.6rem',
        letterSpacing: '0.3em',
        color: '#C5A059',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
      }}>
        ИЗБЕРЕТЕ ДАТИ
      </div>

      <style>{`
        .rdp {
          --rdp-cell-size: 45px;
          --rdp-accent-color: #C5A059;
          --rdp-background-color: rgba(197, 160, 89, 0.1);
          margin: 0;
        }

        .rdp-months {
          width: 100%;
        }

        .rdp-month {
          width: 100%;
        }

        .rdp-caption {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0 1.5rem 0;
          font-family: 'Tenor Sans', serif;
          font-size: 1rem;
          color: #EAEAEA;
          letter-spacing: 0.05em;
        }

        .rdp-caption_label {
          font-family: 'Tenor Sans', serif;
          font-size: 1rem;
          color: #EAEAEA;
          letter-spacing: 0.05em;
        }

        .rdp-head_cell {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          color: #C5A059;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          padding: 0.8rem 0;
          border-bottom: 1px solid rgba(197, 160, 89, 0.1);
        }

        .rdp-cell {
          padding: 0.3rem;
        }

        .rdp-day {
          font-family: 'Satoshi', sans-serif;
          font-size: 0.8rem;
          color: rgba(234, 234, 234, 0.6);
          border-radius: 0.4rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .rdp-day:hover:not(.rdp-day_disabled) {
          background: rgba(197, 160, 89, 0.2);
          color: #EAEAEA;
        }

        .rdp-day_selected:not([disabled]) {
          background: #C5A059;
          color: #0A0A0A;
          font-weight: 600;
        }

        .rdp-day_today {
          font-weight: 600;
          color: #C5A059;
        }

        .rdp-day_disabled {
          color: rgba(234, 234, 234, 0.15);
          cursor: not-allowed;
          opacity: 0.4;
        }

        .rdp-day_outside {
          color: rgba(234, 234, 234, 0.1);
        }

        .rdp-button {
          border-radius: 0.4rem;
        }

        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background: rgba(197, 160, 89, 0.15);
        }

        .rdp-nav {
          display: flex;
          gap: 0.5rem;
        }

        .rdp-nav_button {
          background: transparent;
          border: 1px solid rgba(197, 160, 89, 0.3);
          color: #C5A059;
          font-size: 0.8rem;
          padding: 0.5rem 0.8rem;
          border-radius: 0.4rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Cinzel', serif;
        }

        .rdp-nav_button:hover {
          background: rgba(197, 160, 89, 0.1);
          border-color: #C5A059;
        }
      `}</style>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#C5A059' }}>
          Зареждане...
        </div>
      ) : (
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDayClick}
          month={month}
          onMonthChange={setMonth}
          disabled={bookedDates}
          showOutsideDays={false}
        />
      )}

      {/* Legend */}
      <div style={{
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(197,160,89,0.1)',
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: 'rgba(197,160,89,0.2)',
            borderRadius: '0.3rem',
          }} />
          <span style={{
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '0.75rem',
            color: 'rgba(234,234,234,0.5)',
            letterSpacing: '0.05em',
          }}>
            СВОБОДНО
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: 'rgba(234,234,234,0.1)',
            borderRadius: '0.3rem',
          }} />
          <span style={{
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '0.75rem',
            color: 'rgba(234,234,234,0.5)',
            letterSpacing: '0.05em',
          }}>
            ЗАЕТО
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: '#C5A059',
            borderRadius: '0.3rem',
          }} />
          <span style={{
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '0.75rem',
            color: 'rgba(234,234,234,0.5)',
            letterSpacing: '0.05em',
          }}>
            ИЗБРАНО
          </span>
        </div>
      </div>

      {/* Info */}
      {availability && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(197,160,89,0.05)',
          borderRadius: '0.4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '0.8rem',
            color: 'rgba(234,234,234,0.5)',
            letterSpacing: '0.05em',
          }}>
            Свободни дати: <strong style={{ color: '#C5A059' }}>{availability.available.length}</strong>
          </div>
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '1.1rem',
            color: '#C5A059',
            letterSpacing: '0.05em',
          }}>
            Заети дати: <strong>{availability.booked.length}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
