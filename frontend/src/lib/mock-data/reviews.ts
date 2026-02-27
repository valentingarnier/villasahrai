// Mock data for Villa Sahrai reviews module

export interface Review {
  id: string;
  source: "booking" | "google" | "expedia" | "tripadvisor";
  guestName: string;
  guestCountry: string;
  rating: number;
  normalizedRating: number;
  title: string;
  content: string;
  positives?: string;
  negatives?: string;
  stayDate: string;
  reviewDate: string;
  roomType: string;
  travelType: "couple" | "family" | "business" | "solo" | "group";
  response: {
    content: string;
    respondedAt: string;
    respondedBy: string;
  } | null;
  aiDraftResponse: string | null;
  status: "new" | "draft" | "responded";
  language: string;
}

export const mockReviews: Review[] = [
  // -----------------------------------------------------------------------
  // Booking.com reviews (rating out of 10)
  // -----------------------------------------------------------------------
  {
    id: "rev-001",
    source: "booking",
    guestName: "Laurent Dupont",
    guestCountry: "France",
    rating: 9.2,
    normalizedRating: 4.6,
    title: "Un sejour inoubliable",
    content:
      "Nous avons passe trois nuits a Villa Sahrai et c'etait un veritable enchantement. L'hotel est perche sur les hauteurs avec une vue panoramique spectaculaire. Le petit-dejeuner marocain est un moment de pure gourmandise.",
    positives:
      "Vue panoramique, petit-dejeuner marocain exceptionnel, personnel aux petits soins, piscine rooftop magnifique",
    negatives: "Parking un peu etroit pour les grandes voitures",
    stayDate: "2026-02-08",
    reviewDate: "2026-02-12T09:15:00Z",
    roomType: "Suite Junior",
    travelType: "couple",
    response: {
      content:
        "Cher Monsieur Dupont, nous vous remercions chaleureusement pour ce magnifique retour. Nous sommes ravis que la vue panoramique et notre petit-dejeuner marocain aient rendu votre sejour memorable. Nous prenons bonne note de votre remarque concernant le parking et travaillons a ameliorer l'acces. Au plaisir de vous reaccueillir tres bientot. L'equipe Villa Sahrai",
      respondedAt: "2026-02-13T10:30:00Z",
      respondedBy: "Samira Alaoui",
    },
    aiDraftResponse: null,
    status: "responded",
    language: "fr",
  },
  {
    id: "rev-002",
    source: "booking",
    guestName: "Emma Richardson",
    guestCountry: "UK",
    rating: 8.8,
    normalizedRating: 4.4,
    title: "Luxury with authentic Moroccan charm",
    content:
      "Villa Sahrai is a hidden gem. The rooftop pool has breathtaking views of the city and the Atlas Mountains in the distance. The hammam experience was divine and the staff remembered our names from the first day. The restaurant served some of the best Moroccan cuisine we've had.",
    positives:
      "Rooftop pool, hammam, incredible staff, authentic Moroccan restaurant",
    negatives: "WiFi was slow in the evenings, room could be slightly larger",
    stayDate: "2026-01-25",
    reviewDate: "2026-01-30T14:20:00Z",
    roomType: "Chambre Deluxe",
    travelType: "couple",
    response: {
      content:
        "Dear Emma, thank you so much for your wonderful review. We are delighted that you enjoyed the rooftop pool, our hammam, and the authentic flavours of our restaurant. We sincerely apologise for the WiFi inconvenience and are currently upgrading our infrastructure. We look forward to welcoming you back to Villa Sahrai. The Villa Sahrai Team",
      respondedAt: "2026-01-31T11:00:00Z",
      respondedBy: "Samira Alaoui",
    },
    aiDraftResponse: null,
    status: "responded",
    language: "en",
  },
  {
    id: "rev-003",
    source: "booking",
    guestName: "Hans Muller",
    guestCountry: "Germany",
    rating: 7.5,
    normalizedRating: 3.75,
    title: "Schones Hotel, aber einige Schwachen",
    content:
      "The hotel is beautiful with stunning architecture and great views. Breakfast was excellent with many Moroccan specialities. However, we were disturbed by street noise early in the morning and the air conditioning was noisy at night.",
    positives:
      "Beautiful architecture, excellent breakfast, friendly staff, great views",
    negatives:
      "Street noise in the morning, noisy air conditioning unit in our room",
    stayDate: "2026-02-02",
    reviewDate: "2026-02-06T16:45:00Z",
    roomType: "Chambre Superieure",
    travelType: "family",
    response: null,
    aiDraftResponse:
      "Dear Mr. Muller, thank you for taking the time to share your feedback. We are pleased that you appreciated our architecture, breakfast, and views. We sincerely apologise for the noise disturbances you experienced. We have since inspected and serviced all air conditioning units and are installing additional sound insulation in rooms facing the street. We hope to have the opportunity to welcome you again and provide a more restful experience. The Villa Sahrai Team",
    status: "draft",
    language: "en",
  },
  {
    id: "rev-004",
    source: "booking",
    guestName: "Rachid Amrani",
    guestCountry: "Morocco",
    rating: 9.6,
    normalizedRating: 4.8,
    title: "Le joyau de Casablanca",
    content:
      "Villa Sahrai est sans conteste le plus bel hotel de Casablanca. Le decor est raffine, melange parfait de tradition marocaine et de modernite. La suite royale est somptueuse. Le hammam est authentique et le personnel d'une gentillesse rare. Le restaurant gastronomique est a la hauteur des plus grandes tables.",
    positives:
      "Decor exceptionnel, suite royale magnifique, hammam authentique, restaurant gastronomique, personnel exemplaire",
    negatives: "Rien a signaler",
    stayDate: "2026-02-14",
    reviewDate: "2026-02-18T08:00:00Z",
    roomType: "Suite Royale",
    travelType: "couple",
    response: {
      content:
        "Cher Monsieur Amrani, votre avis nous va droit au coeur. Nous mettons tout en oeuvre pour offrir une experience qui celebre le meilleur de l'hospitalite marocaine et vos mots nous encouragent a continuer. Merci pour votre confiance et au plaisir de vous retrouver tres bientot. L'equipe Villa Sahrai",
      respondedAt: "2026-02-19T09:00:00Z",
      respondedBy: "Youssef Bennani",
    },
    aiDraftResponse: null,
    status: "responded",
    language: "fr",
  },
  {
    id: "rev-005",
    source: "booking",
    guestName: "Maria Garcia",
    guestCountry: "Spain",
    rating: 8.3,
    normalizedRating: 4.15,
    title: "Encantador hotel boutique",
    content:
      "A charming boutique hotel with wonderful Moroccan character. The terrace restaurant with views over the city was our favourite spot for dinner. Breakfast is generous and delicious. The spa treatments are top quality. Only downside was that the check-in process was a bit slow.",
    positives:
      "Terrace restaurant, generous breakfast, quality spa treatments, beautiful decor",
    negatives: "Slow check-in process",
    stayDate: "2026-01-18",
    reviewDate: "2026-01-22T11:30:00Z",
    roomType: "Chambre Deluxe",
    travelType: "solo",
    response: {
      content:
        "Dear Maria, thank you for your lovely feedback. We are thrilled that you enjoyed our terrace restaurant and spa treatments. We appreciate your patience regarding the check-in and have since streamlined the process to ensure a smoother arrival for all our guests. We hope to welcome you back to Villa Sahrai. The Villa Sahrai Team",
      respondedAt: "2026-01-23T14:00:00Z",
      respondedBy: "Samira Alaoui",
    },
    aiDraftResponse: null,
    status: "responded",
    language: "en",
  },

  // -----------------------------------------------------------------------
  // Google reviews (rating out of 5)
  // -----------------------------------------------------------------------
  {
    id: "rev-006",
    source: "google",
    guestName: "Pierre Moreau",
    guestCountry: "France",
    rating: 5,
    normalizedRating: 5,
    title: "Excellence a l'etat pur",
    content:
      "Un hotel d'exception. Le cadre est somptueux, la piscine sur le toit offre une vue a 360 degres sur Casablanca. Le personnel est d'une attention remarquable, rien n'est laisse au hasard. Le hammam traditionnel est un pur moment de detente. Le petit-dejeuner est un festin. Je recommande vivement.",
    stayDate: "2026-02-20",
    reviewDate: "2026-02-24T17:00:00Z",
    roomType: "Suite Royale",
    travelType: "business",
    response: null,
    aiDraftResponse:
      "Cher Monsieur Moreau, nous vous remercions infiniment pour ce commentaire elogieux. C'est un immense plaisir de savoir que chaque detail de votre sejour a ete a la hauteur de vos attentes. Notre equipe met tout son coeur a offrir une experience d'exception et vos mots sont notre plus belle recompense. Au plaisir de vous reaccueillir. L'equipe Villa Sahrai",
    status: "draft",
    language: "fr",
  },
  {
    id: "rev-007",
    source: "google",
    guestName: "David Thompson",
    guestCountry: "USA",
    rating: 4,
    normalizedRating: 4,
    title: "Beautiful hotel, minor issues",
    content:
      "Stayed for 4 nights on a business trip. The hotel is stunning with gorgeous Moroccan design. My room had a wonderful view. The concierge was excellent at arranging meetings and transport. However, I found the restaurant a bit pricey for what it offered and the gym equipment could use an update.",
    stayDate: "2026-02-03",
    reviewDate: "2026-02-08T20:00:00Z",
    roomType: "Suite Junior",
    travelType: "business",
    response: {
      content:
        "Dear Mr. Thompson, thank you for sharing your experience. We are glad our concierge team could support your business trip effectively. We appreciate your honest feedback about the restaurant pricing and gym facilities. We are reviewing our restaurant menu to offer better value and have already ordered new equipment for the gym. We hope to welcome you on your next visit to Casablanca. The Villa Sahrai Team",
      respondedAt: "2026-02-10T09:30:00Z",
      respondedBy: "Youssef Bennani",
    },
    aiDraftResponse: null,
    status: "responded",
    language: "en",
  },
  {
    id: "rev-008",
    source: "google",
    guestName: "Leila Fassi",
    guestCountry: "Morocco",
    rating: 5,
    normalizedRating: 5,
    title: "Notre adresse preferee a Casablanca",
    content:
      "Nous venons regulierement a Villa Sahrai pour des occasions speciales et a chaque fois c'est un bonheur. L'equipe nous reconnait et nous accueille comme des membres de la famille. La villa privee est un ecrin de luxe absolu. Le brunch du dimanche est incontournable.",
    stayDate: "2026-02-16",
    reviewDate: "2026-02-21T12:00:00Z",
    roomType: "Villa Privee",
    travelType: "family",
    response: {
      content:
        "Chere Madame Fassi, votre fidelite est un honneur pour toute notre equipe. Savoir que Villa Sahrai est le lieu de vos moments precieux nous remplit de fierte. Nous avons hate de vous retrouver pour votre prochain brunch dominical ! Avec toute notre gratitude. L'equipe Villa Sahrai",
      respondedAt: "2026-02-22T10:00:00Z",
      respondedBy: "Samira Alaoui",
    },
    aiDraftResponse: null,
    status: "responded",
    language: "fr",
  },
  {
    id: "rev-009",
    source: "google",
    guestName: "Yuki Tanaka",
    guestCountry: "Japan",
    rating: 4,
    normalizedRating: 4,
    title: "Unique Moroccan luxury experience",
    content:
      "A truly unique hotel that combines traditional Moroccan craftsmanship with modern luxury. The zellige tilework and carved plaster are works of art. The rooftop views at sunset are magical. Staff were very attentive. The only improvement would be adding Japanese tea options at breakfast.",
    stayDate: "2026-01-12",
    reviewDate: "2026-01-18T06:30:00Z",
    roomType: "Chambre Deluxe",
    travelType: "solo",
    response: null,
    aiDraftResponse: null,
    status: "new",
    language: "en",
  },
  {
    id: "rev-010",
    source: "google",
    guestName: "Khalid Al Rashid",
    guestCountry: "UAE",
    rating: 5,
    normalizedRating: 5,
    title: "Hospitalite exceptionnelle",
    content:
      "Un accueil chaleureux des notre arrivee. La suite royale est spacieuse et magnifiquement decoree. Le hammam prive est un veritable luxe. Le chef a prepare un diner special pour notre groupe et chaque plat etait une decouverte culinaire. Service irremprochable du debut a la fin.",
    stayDate: "2026-02-06",
    reviewDate: "2026-02-11T15:00:00Z",
    roomType: "Suite Royale",
    travelType: "group",
    response: null,
    aiDraftResponse:
      "Cher Monsieur Al Rashid, nous sommes profondement touches par votre retour. Accueillir votre groupe et creer des moments culinaires sur mesure est exactement ce qui anime notre equipe. Votre satisfaction est notre plus grande fierte. Nous esperons avoir le privilege de vous recevoir a nouveau. L'equipe Villa Sahrai",
    status: "draft",
    language: "fr",
  },

  // -----------------------------------------------------------------------
  // TripAdvisor reviews (rating out of 5)
  // -----------------------------------------------------------------------
  {
    id: "rev-011",
    source: "tripadvisor",
    guestName: "Catherine Blanc",
    guestCountry: "France",
    rating: 5,
    normalizedRating: 5,
    title: "Un bijou d'architecture et de service",
    content:
      "Deuxieme sejour a Villa Sahrai et toujours aussi enchantee. L'hotel a ete renove recemment et c'est encore plus beau qu'avant. La chambre superieure est confortable et elegante. Le spa propose des soins traditionnels marocains d'une qualite remarquable. Le toit-terrasse au coucher du soleil est un moment magique.",
    stayDate: "2026-02-11",
    reviewDate: "2026-02-16T10:00:00Z",
    roomType: "Chambre Superieure",
    travelType: "couple",
    response: {
      content:
        "Chere Madame Blanc, quel plaisir de vous lire ! Nous sommes ravis que vous ayez pu apprecier les recentes renovations. Votre fidelite nous honore et nous motive a toujours nous surpasser. Le coucher de soleil depuis notre toit-terrasse est effectivement un moment que nous cherissons aussi. A tres bientot. L'equipe Villa Sahrai",
      respondedAt: "2026-02-17T09:00:00Z",
      respondedBy: "Samira Alaoui",
    },
    aiDraftResponse: null,
    status: "responded",
    language: "fr",
  },
  {
    id: "rev-012",
    source: "tripadvisor",
    guestName: "Michael O'Brien",
    guestCountry: "USA",
    rating: 3,
    normalizedRating: 3,
    title: "Nice but overpriced",
    content:
      "The hotel is undeniably beautiful and the location offers great views. Staff were friendly. However, I felt the room was too small for the price point. The minibar was extremely overpriced. Breakfast was good but not outstanding. For the rate, I expected more from a luxury property. The pool area was lovely though.",
    stayDate: "2026-01-20",
    reviewDate: "2026-01-26T18:00:00Z",
    roomType: "Chambre Superieure",
    travelType: "business",
    response: null,
    aiDraftResponse:
      "Dear Mr. O'Brien, thank you for your candid feedback. We appreciate your kind words about our staff and pool area. We understand that value for money is important and we take your comments about room size and minibar pricing seriously. We are currently reviewing our pricing structure to better align with guest expectations. We would love the opportunity to welcome you again in one of our more spacious suites, which we believe would better meet your expectations. The Villa Sahrai Team",
    status: "draft",
    language: "en",
  },
  {
    id: "rev-013",
    source: "tripadvisor",
    guestName: "Giulia Rossi",
    guestCountry: "Italy",
    rating: 5,
    normalizedRating: 5,
    title: "Perfetto in ogni dettaglio",
    content:
      "We celebrated our anniversary here and it was absolutely perfect. The staff arranged rose petals in the room and a special dinner on the terrace. The suite was beautiful with traditional Moroccan decor. The views from the rooftop pool at night are incredible. Best hammam experience of our lives. This hotel understands luxury.",
    stayDate: "2026-02-14",
    reviewDate: "2026-02-19T13:30:00Z",
    roomType: "Suite Junior",
    travelType: "couple",
    response: null,
    aiDraftResponse: null,
    status: "new",
    language: "en",
  },
  {
    id: "rev-014",
    source: "tripadvisor",
    guestName: "Nabil Cherkaoui",
    guestCountry: "Morocco",
    rating: 4,
    normalizedRating: 4,
    title: "Tres bien mais peut mieux faire",
    content:
      "Hotel tres agreable avec une decoration soignee. Le personnel est professionnel et souriant. Le restaurant propose une belle carte de plats marocains revisites. Petit bemol sur le temps d'attente au restaurant le soir et le wifi qui rame un peu. Mais dans l'ensemble, une tres bonne adresse.",
    stayDate: "2026-02-09",
    reviewDate: "2026-02-13T11:00:00Z",
    roomType: "Chambre Deluxe",
    travelType: "family",
    response: null,
    aiDraftResponse: null,
    status: "new",
    language: "fr",
  },

  // -----------------------------------------------------------------------
  // Expedia reviews (rating out of 5)
  // -----------------------------------------------------------------------
  {
    id: "rev-015",
    source: "expedia",
    guestName: "Charlotte Petit",
    guestCountry: "France",
    rating: 4.5,
    normalizedRating: 4.5,
    title: "Superbe decouverte",
    content:
      "Premiere fois au Maroc et quel hotel pour commencer ! La decoration est absolument sublime, chaque coin est une oeuvre d'art. Le petit-dejeuner sur la terrasse avec les msemens et la harira etait un regal. L'equipe du spa nous a fait vivre un rituel hammam inoubliable. Seul regret : ne pas etre restees plus longtemps !",
    stayDate: "2026-01-28",
    reviewDate: "2026-02-02T09:45:00Z",
    roomType: "Chambre Deluxe",
    travelType: "group",
    response: {
      content:
        "Chere Charlotte, quel bonheur de lire que Villa Sahrai a ete votre porte d'entree vers la beaute du Maroc ! Nous sommes enchantes que notre petit-dejeuner traditionnel et notre hammam vous aient seduite. Nous vous attendons pour un sejour plus long la prochaine fois ! L'equipe Villa Sahrai",
      respondedAt: "2026-02-03T10:00:00Z",
      respondedBy: "Youssef Bennani",
    },
    aiDraftResponse: null,
    status: "responded",
    language: "fr",
  },
  {
    id: "rev-016",
    source: "expedia",
    guestName: "Andrew Clarke",
    guestCountry: "UK",
    rating: 4,
    normalizedRating: 4,
    title: "Solid luxury option in Casablanca",
    content:
      "Good hotel with beautiful design and attentive service. The villa privee was spacious and perfect for our family. Kids loved the pool. The restaurant quality was excellent, particularly the tagine and the pastilla. Two small complaints: street noise was noticeable at night and the parking situation needs improvement.",
    stayDate: "2026-02-01",
    reviewDate: "2026-02-05T19:00:00Z",
    roomType: "Villa Privee",
    travelType: "family",
    response: null,
    aiDraftResponse: null,
    status: "new",
    language: "en",
  },
  {
    id: "rev-017",
    source: "expedia",
    guestName: "Amira Bennis",
    guestCountry: "Morocco",
    rating: 5,
    normalizedRating: 5,
    title: "Notre coup de coeur absolu",
    content:
      "Nous avons reserve la suite royale pour l'anniversaire de mon mari et tout etait absolument parfait. L'equipe avait decore la chambre, le gateau etait magnifique, et le diner au restaurant etait digne d'un etoile Michelin. La vue depuis la suite au lever du soleil est inoubliable. Un grand merci a toute l'equipe.",
    stayDate: "2026-02-22",
    reviewDate: "2026-02-25T08:30:00Z",
    roomType: "Suite Royale",
    travelType: "couple",
    response: null,
    aiDraftResponse: null,
    status: "new",
    language: "fr",
  },
  {
    id: "rev-018",
    source: "expedia",
    guestName: "Thomas Weber",
    guestCountry: "Germany",
    rating: 3.5,
    normalizedRating: 3.5,
    title: "Good but room for improvement",
    content:
      "The hotel has a lot of potential. Lovely decor, great rooftop area, and the hammam was a highlight. Breakfast had excellent variety. On the negative side: our room faced the street and was noisy, the WiFi kept disconnecting during my video calls, and the room safe was broken. The staff were apologetic and tried to help, which we appreciated.",
    stayDate: "2026-01-15",
    reviewDate: "2026-01-20T14:00:00Z",
    roomType: "Chambre Superieure",
    travelType: "business",
    response: null,
    aiDraftResponse: null,
    status: "new",
    language: "en",
  },
];
