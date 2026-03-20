export interface Apartment {
  id: number;
  number: string;
  name: string;
  nameEn: string;
  sqm: number;
  view: string;
  floor: number;
  bedrooms: number;
  maxGuests: number;
  pricePerNight: number;
  description: string;
  features: string[];
  image: string;
  images: string[];
}

export const apartments: Apartment[] = [
  {
    id: 1,
    number: '01',
    name: 'ПЕНТХАУС СНЕЖЕН ВИЙ',
    nameEn: 'PENTHOUSE SNOW VIEW',
    sqm: 185,
    view: 'Панорамна гледка към върховете',
    floor: 6,
    bedrooms: 3,
    maxGuests: 6,
    pricePerNight: 1200,
    description: 'Върховното планинско бягство. Три спални, частна тераса с джакузи и директна гледка към заснежените върхове на Родопите.',
    features: ['Частна тераса с джакузи', 'Камина от натурален камък', 'Панорамни прозорци 180°', 'Кухня с оборудване Gaggenau', 'Частен паркинг'],
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/bedroom-mountain-HWogqgxqEQraABWJXnxQRw.webp',
    images: [
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/bedroom-mountain-HWogqgxqEQraABWJXnxQRw.webp',
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/interior-fireplace-DTitKvcxt75ynojrJjeN7p.webp',
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/spa-wellness-gbz8jLh2Navw2r8ii7AAne.webp',
    ],
  },
  {
    id: 2,
    number: '02',
    name: 'СТУДИО ГОРСКИ ПОКОЙ',
    nameEn: 'FOREST SERENITY STUDIO',
    sqm: 95,
    view: 'Гледка към вековната гора',
    floor: 4,
    bedrooms: 1,
    maxGuests: 2,
    pricePerNight: 580,
    description: 'Интимно студио за двама. Обграден от вековни ели, с уютна камина и директен достъп до ски пистата.',
    features: ['Камина от дъб', 'Ски-ин/ски-аут достъп', 'Хидромасажна вана', 'Кафемашина Nespresso', 'Балкон с гледка'],
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/interior-fireplace-DTitKvcxt75ynojrJjeN7p.webp',
    images: [
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/interior-fireplace-DTitKvcxt75ynojrJjeN7p.webp',
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/bedroom-mountain-HWogqgxqEQraABWJXnxQRw.webp',
    ],
  },
  {
    id: 3,
    number: '03',
    name: 'АПАРТАМЕНТ АЛПИЙСКИ',
    nameEn: 'ALPINE APARTMENT',
    sqm: 130,
    view: 'Ски писта и планински хоризонт',
    floor: 3,
    bedrooms: 2,
    maxGuests: 4,
    pricePerNight: 780,
    description: 'Две спални с директна гледка към ски пистата. Просторен хол с камина и трапезария за незабравими вечери.',
    features: ['Директна гледка към пистата', 'Две спални king-size', 'Камина и трапезария', 'Смарт ТВ система', 'Сушилня за ски оборудване'],
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/hero-pamporovo-hKcPiG4L4E98MCUqhhYFF2.webp',
    images: [
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/hero-pamporovo-hKcPiG4L4E98MCUqhhYFF2.webp',
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/bedroom-mountain-HWogqgxqEQraABWJXnxQRw.webp',
    ],
  },
  {
    id: 4,
    number: '04',
    name: 'ЛЮКС РОДОПСКА НОЩ',
    nameEn: 'RHODOPE NIGHT SUITE',
    sqm: 110,
    view: 'Звездно небе и планински силует',
    floor: 5,
    bedrooms: 2,
    maxGuests: 4,
    pricePerNight: 720,
    description: 'Романтичен апартамент с тераса за наблюдение на звездите. Идеален за двойки търсещи уединение и лукс.',
    features: ['Тераса за звездонаблюдение', 'Романтична вана за двама', 'Камина в спалнята', 'Вино при пристигане', 'Закуска в апартамента'],
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/spa-wellness-gbz8jLh2Navw2r8ii7AAne.webp',
    images: [
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/spa-wellness-gbz8jLh2Navw2r8ii7AAne.webp',
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/interior-fireplace-DTitKvcxt75ynojrJjeN7p.webp',
    ],
  },
  {
    id: 5,
    number: '05',
    name: 'ШАЛЕ СЕМЕЙНО',
    nameEn: 'FAMILY CHALET SUITE',
    sqm: 160,
    view: 'Широка панорама на долината',
    floor: 2,
    bedrooms: 3,
    maxGuests: 7,
    pricePerNight: 950,
    description: 'Просторен апартамент за семейства с три спални. Голяма всекидневна, напълно оборудвана кухня и детска стая.',
    features: ['Три спални', 'Детска стая с игри', 'Голяма кухня', 'Трапезария за 8', 'Две бани'],
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/concierge-chef-LGMZQLWm8HsTsMxr9jye96.webp',
    images: [
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/concierge-chef-LGMZQLWm8HsTsMxr9jye96.webp',
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/bedroom-mountain-HWogqgxqEQraABWJXnxQRw.webp',
    ],
  },
  {
    id: 6,
    number: '06',
    name: 'СТУДИО МИНИМАЛИСТ',
    nameEn: 'MINIMALIST STUDIO',
    sqm: 75,
    view: 'Гледка към горски масив',
    floor: 1,
    bedrooms: 1,
    maxGuests: 2,
    pricePerNight: 420,
    description: 'Архитектурно чисто студио с внимание към всеки детайл. Перфектно за соло пътешественика или двойка.',
    features: ['Дизайнерски интериор', 'Работно бюро', 'Висококачествено спално бельо', 'Мини бар', 'Бърз WiFi'],
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/bedroom-mountain-HWogqgxqEQraABWJXnxQRw.webp',
    images: [
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/bedroom-mountain-HWogqgxqEQraABWJXnxQRw.webp',
    ],
  },
  {
    id: 7,
    number: '07',
    name: 'GRAND SUITE ВЪРХА',
    nameEn: 'GRAND SUMMIT SUITE',
    sqm: 220,
    view: '360° панорама на Родопите',
    floor: 7,
    bedrooms: 4,
    maxGuests: 8,
    pricePerNight: 1800,
    description: 'Абсолютният върхов апартамент. Четири спални, частен СПА, вътрешен басейн и 360° гледка. Несравнимо.',
    features: ['Частен вътрешен басейн', 'СПА и сауна', '360° панорамна тераса', 'Четири спални', 'Личен консиерж 24/7', 'Трансфер с хеликоптер'],
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/hero-pamporovo-hKcPiG4L4E98MCUqhhYFF2.webp',
    images: [
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/hero-pamporovo-hKcPiG4L4E98MCUqhhYFF2.webp',
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/spa-wellness-gbz8jLh2Navw2r8ii7AAne.webp',
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/bedroom-mountain-HWogqgxqEQraABWJXnxQRw.webp',
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663457771596/CDGBXHppTB3VFJSZAKqvbh/interior-fireplace-DTitKvcxt75ynojrJjeN7p.webp',
    ],
  },
];
