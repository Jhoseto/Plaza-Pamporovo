/**
 * Availability data for each apartment
 * Defines booked dates and pricing for each unit
 */

export interface AvailabilityData {
  apartmentId: number;
  bookedDates: string[]; // ISO date strings (YYYY-MM-DD)
  pricePerNight: number;
  minStay: number; // minimum nights
}

export const apartmentAvailability: AvailabilityData[] = [
  {
    apartmentId: 1,
    bookedDates: [
      '2026-03-22', '2026-03-23', '2026-03-24',
      '2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13',
      '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05',
    ],
    pricePerNight: 1200,
    minStay: 2,
  },
  {
    apartmentId: 2,
    bookedDates: [
      '2026-03-25', '2026-03-26',
      '2026-04-15', '2026-04-16', '2026-04-17',
      '2026-05-10', '2026-05-11',
    ],
    pricePerNight: 850,
    minStay: 2,
  },
  {
    apartmentId: 3,
    bookedDates: [
      '2026-03-20', '2026-03-21',
      '2026-04-05', '2026-04-06', '2026-04-07', '2026-04-08',
      '2026-05-15', '2026-05-16', '2026-05-17',
    ],
    pricePerNight: 950,
    minStay: 2,
  },
  {
    apartmentId: 4,
    bookedDates: [
      '2026-03-27', '2026-03-28', '2026-03-29',
      '2026-04-20', '2026-04-21',
      '2026-05-08', '2026-05-09',
    ],
    pricePerNight: 900,
    minStay: 2,
  },
  {
    apartmentId: 5,
    bookedDates: [
      '2026-03-30',
      '2026-04-25', '2026-04-26', '2026-04-27', '2026-04-28',
      '2026-05-20', '2026-05-21',
    ],
    pricePerNight: 1100,
    minStay: 3,
  },
  {
    apartmentId: 6,
    bookedDates: [
      '2026-04-01', '2026-04-02',
      '2026-04-30',
      '2026-05-25', '2026-05-26', '2026-05-27',
    ],
    pricePerNight: 750,
    minStay: 2,
  },
  {
    apartmentId: 7,
    bookedDates: [
      '2026-03-31',
      '2026-04-03', '2026-04-04',
      '2026-05-05', '2026-05-06', '2026-05-07',
    ],
    pricePerNight: 1400,
    minStay: 3,
  },
];

export function getApartmentAvailability(apartmentId: number): AvailabilityData | undefined {
  return apartmentAvailability.find(a => a.apartmentId === apartmentId);
}

export function isDateBooked(apartmentId: number, date: Date): boolean {
  const availability = getApartmentAvailability(apartmentId);
  if (!availability) return false;
  
  const dateStr = date.toISOString().split('T')[0];
  return availability.bookedDates.includes(dateStr);
}

export function getAvailableDatesInMonth(apartmentId: number, year: number, month: number): Date[] {
  const availability = getApartmentAvailability(apartmentId);
  if (!availability) return [];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const availableDates: Date[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (!isDateBooked(apartmentId, date)) {
      availableDates.push(date);
    }
  }

  return availableDates;
}
