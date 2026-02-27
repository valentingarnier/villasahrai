// --- Voice Agent module types ---

export interface VoiceAgentConfig {
  name: string;
  phoneNumber: string;
  languages: string[];
  greeting: string;
  fallbackMessage: string;
  knowledgeBase: {
    restaurantMenu: boolean;
    spaServices: boolean;
  };
  eatNowIntegration: {
    lastSync: string;
    apiEndpoint: string;
  };
}

export interface Call {
  id: string;
  callerPhone: string;
  startTime: string;
  duration: number;
  intent:
    | "restaurant_reservation"
    | "spa_booking"
    | "information"
    | "complaint"
    | "other";
  outcome:
    | "reservation_made"
    | "transferred_to_human"
    | "information_provided"
    | "callback_scheduled"
    | "abandoned";
  reservationType?: "restaurant" | "spa";
  reservationDetails?: {
    date: string;
    time: string;
    partySize?: number;
    service?: string;
  };
  transcript: {
    speaker: "agent" | "caller";
    text: string;
    timestamp: string;
  }[];
  sentiment: "positive" | "neutral" | "negative";
}

export interface VoiceAgentAnalytics {
  callsToday: number;
  restaurantReservations: number;
  spaBookings: number;
  callsByDay: { day: string; count: number }[];
}

// --- Outreach module types ---

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  source: "manual" | "import" | "booking";
  stayDate: string;
  roomType: string;
  tags: string[];
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  channel: "email" | "whatsapp";
  subject?: string;
  body: string;
  variables: string[];
  language: "fr" | "en" | "ar";
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  direction: "outbound" | "inbound";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  contact: Contact;
  channel: "email" | "whatsapp";
  status: "sent" | "delivered" | "opened" | "replied" | "failed";
  messages: ConversationMessage[];
}

export const mockVoiceAgentConfig: VoiceAgentConfig = {
  name: "Sahrai",
  phoneNumber: "+212 5 24 42 41 00",
  languages: ["fr", "en"],
  greeting:
    "Bienvenue au Villa Sahrai, je suis Sahrai, votre assistant vocal. Comment puis-je vous aider aujourd'hui ?",
  fallbackMessage:
    "Je suis désolé, je n'ai pas bien compris. Souhaitez-vous que je vous transfère à un membre de notre équipe ?",
  knowledgeBase: {
    restaurantMenu: true,
    spaServices: true,
  },
  eatNowIntegration: {
    lastSync: "2026-02-27T10:25:00Z",
    apiEndpoint: "https://api.eatnow.ma/v2/villasahrai",
  },
};

export const mockCalls: Call[] = [
  {
    id: "call-001",
    callerPhone: "+212 6 12 34 56 78",
    startTime: "2026-02-27T12:30:00Z",
    duration: 204,
    intent: "restaurant_reservation",
    outcome: "reservation_made",
    reservationType: "restaurant",
    reservationDetails: {
      date: "2026-02-28",
      time: "20:00",
      partySize: 4,
    },
    transcript: [
      {
        speaker: "agent",
        text: "Bienvenue au Villa Sahrai, je suis Sahrai, votre assistant vocal. Comment puis-je vous aider aujourd'hui ?",
        timestamp: "2026-02-27T12:30:00Z",
      },
      {
        speaker: "caller",
        text: "Bonjour, je voudrais réserver une table pour ce soir au restaurant.",
        timestamp: "2026-02-27T12:30:08Z",
      },
      {
        speaker: "agent",
        text: "Avec plaisir ! Pour combien de personnes souhaitez-vous réserver ?",
        timestamp: "2026-02-27T12:30:12Z",
      },
      {
        speaker: "caller",
        text: "Nous serons quatre personnes.",
        timestamp: "2026-02-27T12:30:18Z",
      },
      {
        speaker: "agent",
        text: "Parfait. J'ai une table disponible pour 4 personnes demain soir à 20h. Cela vous convient ?",
        timestamp: "2026-02-27T12:30:22Z",
      },
      {
        speaker: "caller",
        text: "Oui, c'est parfait, merci.",
        timestamp: "2026-02-27T12:30:28Z",
      },
      {
        speaker: "agent",
        text: "Votre réservation est confirmée pour le 28 février à 20h, table pour 4 personnes au nom de Laurent. Bonne soirée !",
        timestamp: "2026-02-27T12:30:32Z",
      },
    ],
    sentiment: "positive",
  },
  {
    id: "call-002",
    callerPhone: "+44 7911 123456",
    startTime: "2026-02-27T11:15:00Z",
    duration: 282,
    intent: "spa_booking",
    outcome: "reservation_made",
    reservationType: "spa",
    reservationDetails: {
      date: "2026-03-01",
      time: "14:00",
      service: "Hammam traditionnel + massage",
    },
    transcript: [
      {
        speaker: "agent",
        text: "Welcome to Villa Sahrai, I'm Sahrai, your voice assistant. How may I help you today?",
        timestamp: "2026-02-27T11:15:00Z",
      },
      {
        speaker: "caller",
        text: "Hi, I'd like to book a spa treatment for next Sunday.",
        timestamp: "2026-02-27T11:15:06Z",
      },
      {
        speaker: "agent",
        text: "Of course! We offer several treatments. Would you be interested in our traditional Hammam, a massage, or a combination package?",
        timestamp: "2026-02-27T11:15:12Z",
      },
      {
        speaker: "caller",
        text: "The combination with Hammam and massage sounds great.",
        timestamp: "2026-02-27T11:15:20Z",
      },
      {
        speaker: "agent",
        text: "Excellent choice. I have availability at 10am and 2pm. Which would you prefer?",
        timestamp: "2026-02-27T11:15:26Z",
      },
      {
        speaker: "caller",
        text: "2pm works perfectly.",
        timestamp: "2026-02-27T11:15:30Z",
      },
      {
        speaker: "agent",
        text: "Your spa appointment is confirmed for March 1st at 2pm — traditional Hammam followed by a relaxation massage. Enjoy your experience!",
        timestamp: "2026-02-27T11:15:36Z",
      },
    ],
    sentiment: "positive",
  },
  {
    id: "call-004",
    callerPhone: "+33 6 45 67 89 01",
    startTime: "2026-02-27T09:30:00Z",
    duration: 378,
    intent: "complaint",
    outcome: "transferred_to_human",
    transcript: [
      {
        speaker: "agent",
        text: "Bienvenue au Villa Sahrai, je suis Sahrai, votre assistant vocal. Comment puis-je vous aider ?",
        timestamp: "2026-02-27T09:30:00Z",
      },
      {
        speaker: "caller",
        text: "J'ai un probl\u00e8me avec ma r\u00e9servation de chambre. La climatisation ne fonctionne pas correctement.",
        timestamp: "2026-02-27T09:30:10Z",
      },
      {
        speaker: "agent",
        text: "Je suis vraiment d\u00e9sol\u00e9 pour ce d\u00e9sagr\u00e9ment, Monsieur Dubois. Je vais vous transf\u00e9rer imm\u00e9diatement \u00e0 notre responsable pour r\u00e9soudre ce probl\u00e8me.",
        timestamp: "2026-02-27T09:30:18Z",
      },
    ],
    sentiment: "negative",
  },
  {
    id: "call-005",
    callerPhone: "+212 5 22 33 44 55",
    startTime: "2026-02-27T08:15:00Z",
    duration: 225,
    intent: "restaurant_reservation",
    outcome: "reservation_made",
    reservationType: "restaurant",
    reservationDetails: {
      date: "2026-02-27",
      time: "13:00",
      partySize: 2,
    },
    transcript: [
      {
        speaker: "agent",
        text: "Bienvenue au Villa Sahrai. Comment puis-je vous aider ?",
        timestamp: "2026-02-27T08:15:00Z",
      },
      {
        speaker: "caller",
        text: "Je voudrais r\u00e9server une table pour le d\u00e9jeuner aujourd'hui.",
        timestamp: "2026-02-27T08:15:06Z",
      },
      {
        speaker: "agent",
        text: "Bien s\u00fbr ! Pour combien de personnes et \u00e0 quelle heure ?",
        timestamp: "2026-02-27T08:15:10Z",
      },
      {
        speaker: "caller",
        text: "Pour deux personnes, vers 13h si possible.",
        timestamp: "2026-02-27T08:15:16Z",
      },
      {
        speaker: "agent",
        text: "C'est not\u00e9. Table pour 2 personnes \u00e0 13h aujourd'hui. Votre r\u00e9servation est confirm\u00e9e au nom d'Alami. Bon app\u00e9tit !",
        timestamp: "2026-02-27T08:15:22Z",
      },
    ],
    sentiment: "positive",
  },
  {
    id: "call-006",
    callerPhone: "+1 555 0123",
    startTime: "2026-02-26T16:20:00Z",
    duration: 150,
    intent: "information",
    outcome: "information_provided",
    transcript: [
      {
        speaker: "agent",
        text: "Welcome to Villa Sahrai. How may I assist you?",
        timestamp: "2026-02-26T16:20:00Z",
      },
      {
        speaker: "caller",
        text: "What time does the restaurant close tonight?",
        timestamp: "2026-02-26T16:20:06Z",
      },
      {
        speaker: "agent",
        text: "Our restaurant is open until 11pm tonight. Would you like to make a reservation?",
        timestamp: "2026-02-26T16:20:10Z",
      },
      {
        speaker: "caller",
        text: "No thanks, just wanted to know. Thank you!",
        timestamp: "2026-02-26T16:20:16Z",
      },
    ],
    sentiment: "positive",
  },
  {
    id: "call-007",
    callerPhone: "+212 6 11 22 33 44",
    startTime: "2026-02-26T14:00:00Z",
    duration: 252,
    intent: "spa_booking",
    outcome: "reservation_made",
    reservationType: "spa",
    reservationDetails: {
      date: "2026-02-28",
      time: "10:00",
      service: "Massage relaxant",
    },
    transcript: [
      {
        speaker: "agent",
        text: "Bienvenue au Villa Sahrai. Comment puis-je vous aider ?",
        timestamp: "2026-02-26T14:00:00Z",
      },
      {
        speaker: "caller",
        text: "Je souhaite r\u00e9server un massage au spa.",
        timestamp: "2026-02-26T14:00:08Z",
      },
      {
        speaker: "agent",
        text: "Avec plaisir. Nous proposons plusieurs types de massages. Souhaitez-vous un massage relaxant, sportif ou un soin signature ?",
        timestamp: "2026-02-26T14:00:14Z",
      },
      {
        speaker: "caller",
        text: "Un massage relaxant, s'il vous pla\u00eet.",
        timestamp: "2026-02-26T14:00:20Z",
      },
      {
        speaker: "agent",
        text: "J'ai un cr\u00e9neau disponible samedi 28 f\u00e9vrier \u00e0 10h. Cela vous convient ?",
        timestamp: "2026-02-26T14:00:26Z",
      },
      {
        speaker: "caller",
        text: "Parfait, merci.",
        timestamp: "2026-02-26T14:00:30Z",
      },
      {
        speaker: "agent",
        text: "Votre massage relaxant est r\u00e9serv\u00e9 pour le 28 f\u00e9vrier \u00e0 10h. \u00c0 bient\u00f4t !",
        timestamp: "2026-02-26T14:00:36Z",
      },
    ],
    sentiment: "positive",
  },
  {
    id: "call-008",
    callerPhone: "+33 6 78 90 12 34",
    startTime: "2026-02-26T11:30:00Z",
    duration: 65,
    intent: "other",
    outcome: "abandoned",
    transcript: [],
    sentiment: "neutral",
  },
  {
    id: "call-009",
    callerPhone: "+212 6 55 66 77 88",
    startTime: "2026-02-26T09:45:00Z",
    duration: 210,
    intent: "restaurant_reservation",
    outcome: "callback_scheduled",
    transcript: [
      {
        speaker: "agent",
        text: "Bienvenue au Villa Sahrai. Comment puis-je vous aider ?",
        timestamp: "2026-02-26T09:45:00Z",
      },
      {
        speaker: "caller",
        text: "Bonjour, je voudrais organiser un d\u00eener pour un groupe de 15 personnes.",
        timestamp: "2026-02-26T09:45:08Z",
      },
      {
        speaker: "agent",
        text: "Pour un groupe de cette taille, je vous propose de vous rappeler avec notre responsable \u00e9v\u00e9nementiel qui pourra vous proposer un menu personnalis\u00e9. Quel serait le meilleur moment pour vous contacter ?",
        timestamp: "2026-02-26T09:45:16Z",
      },
      {
        speaker: "caller",
        text: "Demain matin vers 10h, ce serait parfait.",
        timestamp: "2026-02-26T09:45:24Z",
      },
      {
        speaker: "agent",
        text: "C'est not\u00e9. Nous vous rappellerons demain \u00e0 10h. Merci et \u00e0 bient\u00f4t !",
        timestamp: "2026-02-26T09:45:30Z",
      },
    ],
    sentiment: "neutral",
  },
  {
    id: "call-010",
    callerPhone: "+44 7700 900000",
    startTime: "2026-02-25T17:00:00Z",
    duration: 225,
    intent: "restaurant_reservation",
    outcome: "reservation_made",
    reservationType: "restaurant",
    reservationDetails: {
      date: "2026-02-26",
      time: "19:30",
      partySize: 6,
    },
    transcript: [
      {
        speaker: "agent",
        text: "Welcome to Villa Sahrai. How may I assist you?",
        timestamp: "2026-02-25T17:00:00Z",
      },
      {
        speaker: "caller",
        text: "I'd like to reserve a table for dinner tomorrow evening for 6 people.",
        timestamp: "2026-02-25T17:00:08Z",
      },
      {
        speaker: "agent",
        text: "Certainly! I can offer you a table at 7:30pm or 9pm. Which would you prefer?",
        timestamp: "2026-02-25T17:00:14Z",
      },
      {
        speaker: "caller",
        text: "7:30 would be perfect.",
        timestamp: "2026-02-25T17:00:20Z",
      },
      {
        speaker: "agent",
        text: "Wonderful. Your table for 6 is confirmed for tomorrow at 7:30pm under Wilson. Enjoy your evening!",
        timestamp: "2026-02-25T17:00:26Z",
      },
    ],
    sentiment: "positive",
  },
];

export const mockVoiceAgentAnalytics: VoiceAgentAnalytics = {
  callsToday: 23,
  restaurantReservations: 142,
  spaBookings: 89,
  callsByDay: [
    { day: "Lun", count: 45 },
    { day: "Mar", count: 52 },
    { day: "Mer", count: 48 },
    { day: "Jeu", count: 61 },
    { day: "Ven", count: 58 },
    { day: "Sam", count: 42 },
    { day: "Dim", count: 41 },
  ],
};

/** Voice agent online status (not part of analytics, used for UI status dot) */
export const mockVoiceAgentStatus = {
  status: "online" as const,
};

// --- Overview dashboard mock data ---

export const mockOverviewData = {
  totalReviews: 728,
  averageRating: 3.77,
  ratingTrend: -7,
  responseRate: 40,
  currentWeekResponseRate: 0,
  reviewsByMonth: [
    { month: "Fév 01", count: 45 },
    { month: "Mar 01", count: 52 },
    { month: "Avr 01", count: 68 },
    { month: "Mai 01", count: 72 },
    { month: "Juin 01", count: 78 },
    { month: "Juil 01", count: 75 },
    { month: "Aoû 01", count: 71 },
    { month: "Sep 01", count: 65 },
    { month: "Oct 01", count: 62 },
    { month: "Nov 01", count: 58 },
    { month: "Déc 01", count: 55 },
    { month: "Jan 01", count: 48 },
    { month: "Fév 01", count: 39 },
  ],
  trends: [
    { name: "Nuisances sonores", score: 40, trend: 18, direction: "up" as const },
    { name: "Politiques de gestion", score: 25, trend: -38, direction: "down" as const },
  ],
  sentimentByMonth: [
    { month: "Fév 01", overall: 68, positive: 75, negative: 25 },
    { month: "Avr 01", overall: 65, positive: 72, negative: 28 },
    { month: "Juin 01", overall: 70, positive: 78, negative: 22 },
    { month: "Aoû 01", overall: 75, positive: 82, negative: 18 },
    { month: "Oct 01", overall: 73, positive: 80, negative: 20 },
    { month: "Déc 01", overall: 82, positive: 88, negative: 12 },
    { month: "Fév 01", overall: 10, positive: 15, negative: 85 },
  ],
  responseRateByMonth: [
    { month: "Fév 01", rate: 0 },
    { month: "Avr 01", rate: 85 },
    { month: "Juin 01", rate: 65 },
    { month: "Aoû 01", rate: 55 },
    { month: "Oct 01", rate: 75 },
    { month: "Déc 01", rate: 90 },
    { month: "Fév 01", rate: 0 },
  ],
  lastMessages: [
    {
      channel: "whatsapp" as const,
      contactName: "Pierre Dubois",
      content: "Bonjour Pierre ! Merci d'avoir séjourné à Villa Sahrai. Nous espérons que votre séjour en Chambre Supérieure était parfait.",
      sentAt: "2026-02-27T08:00:00Z",
      campaign: "Suivi WhatsApp Janvier",
    },
    {
      channel: "whatsapp" as const,
      contactName: "Nadia Cherkaoui",
      content: "Bonjour Nadia, pour vous remercier de votre fidélité, nous avons le plaisir de vous offrir -20% sur votre prochain séjour.",
      sentAt: "2026-02-27T10:00:00Z",
      campaign: "Offre Printemps VIP",
    },
  ],
  aiReceptionist: {
    bookingsToday: 5,
    callsToday: 23,
  },
};

// --- Outreach mock data ---

export const mockContacts: Contact[] = [
  { id: "ct1", firstName: "Karim", lastName: "Benjelloun", email: "karim.benjelloun@email.com", phone: "+212 661 234 567", source: "booking", stayDate: "2026-02-15", roomType: "Suite Royale", tags: ["VIP", "Spa"], createdAt: "2026-02-15T10:00:00Z" },
  { id: "ct2", firstName: "Sophie", lastName: "Martin", email: "sophie.martin@email.com", phone: null, source: "booking", stayDate: "2026-02-10", roomType: "Chambre Deluxe", tags: ["Repeat"], createdAt: "2026-02-10T14:30:00Z" },
  { id: "ct3", firstName: "James", lastName: "Mitchell", email: "james.mitchell@email.com", phone: "+44 7700 900123", source: "booking", stayDate: "2026-02-08", roomType: "Suite Panoramique", tags: ["VIP", "Anniversary"], createdAt: "2026-02-08T09:15:00Z" },
  { id: "ct4", firstName: "Fatima", lastName: "El Amrani", email: "fatima.elamrani@email.com", phone: "+212 662 345 678", source: "manual", stayDate: "2026-02-05", roomType: "Chambre Supérieure", tags: ["Spa"], createdAt: "2026-02-05T11:00:00Z" },
  { id: "ct5", firstName: "Marco", lastName: "Rossi", email: "marco.rossi@email.com", phone: "+39 333 456 7890", source: "import", stayDate: "2026-01-28", roomType: "Suite Royale", tags: ["VIP"], createdAt: "2026-01-28T16:45:00Z" },
  { id: "ct6", firstName: "Amina", lastName: "Tazi", email: null, phone: "+212 663 456 789", source: "manual", stayDate: "2026-01-25", roomType: "Chambre Deluxe", tags: [], createdAt: "2026-01-25T08:30:00Z" },
  { id: "ct7", firstName: "Pierre", lastName: "Dubois", email: "pierre.dubois@email.com", phone: "+33 6 12 34 56 78", source: "booking", stayDate: "2026-01-20", roomType: "Chambre Supérieure", tags: ["Repeat", "Spa"], createdAt: "2026-01-20T12:00:00Z" },
  { id: "ct8", firstName: "Leila", lastName: "Benkirane", email: "leila.benkirane@email.com", phone: "+212 664 567 890", source: "booking", stayDate: "2026-01-18", roomType: "Suite Panoramique", tags: ["VIP", "Birthday"], createdAt: "2026-01-18T15:20:00Z" },
  { id: "ct9", firstName: "Hans", lastName: "Weber", email: "hans.weber@email.com", phone: "+49 170 1234567", source: "import", stayDate: "2026-01-15", roomType: "Chambre Deluxe", tags: [], createdAt: "2026-01-15T10:30:00Z" },
  { id: "ct10", firstName: "Nadia", lastName: "Cherkaoui", email: "nadia.cherkaoui@email.com", phone: "+212 665 678 901", source: "manual", stayDate: "2026-01-12", roomType: "Suite Royale", tags: ["VIP", "Repeat"], createdAt: "2026-01-12T09:00:00Z" },
  { id: "ct11", firstName: "Emma", lastName: "Thompson", email: "emma.thompson@email.com", phone: "+44 7911 123456", source: "booking", stayDate: "2026-01-10", roomType: "Chambre Supérieure", tags: ["Spa"], createdAt: "2026-01-10T13:15:00Z" },
  { id: "ct12", firstName: "Youssef", lastName: "Alaoui", email: "youssef.alaoui@email.com", phone: "+212 666 789 012", source: "booking", stayDate: "2026-01-08", roomType: "Suite Panoramique", tags: ["VIP"], createdAt: "2026-01-08T17:00:00Z" },
  { id: "ct13", firstName: "Claire", lastName: "Bernard", email: "claire.bernard@email.com", phone: "+33 6 98 76 54 32", source: "import", stayDate: "2026-01-05", roomType: "Chambre Deluxe", tags: ["Repeat"], createdAt: "2026-01-05T11:45:00Z" },
  { id: "ct14", firstName: "Omar", lastName: "Fassi", email: null, phone: "+212 667 890 123", source: "manual", stayDate: "2026-01-03", roomType: "Suite Royale", tags: ["VIP", "Spa", "Repeat"], createdAt: "2026-01-03T14:00:00Z" },
];

export const mockTemplates: Template[] = [
  { id: "t1", name: "Bienvenue post-séjour", channel: "email", subject: "Merci pour votre séjour, {firstName} !", body: "Cher(e) {firstName},\n\nNous espérons que votre séjour dans notre {roomType} du {stayDate} vous a laissé des souvenirs inoubliables.\n\nVotre avis compte énormément pour nous. Pourriez-vous prendre quelques instants pour partager votre expérience ?\n\nÀ très bientôt à Villa Sahrai.\n\nCordialement,\nL'équipe Villa Sahrai", variables: ["firstName", "roomType", "stayDate"], language: "fr", createdAt: "2026-01-15T10:00:00Z", updatedAt: "2026-02-20T14:30:00Z" },
  { id: "t2", name: "Offre spéciale retour", channel: "email", subject: "Une offre exclusive pour vous, {firstName}", body: "Bonjour {firstName},\n\nPour vous remercier de votre fidélité, nous avons le plaisir de vous offrir -20% sur votre prochain séjour.\n\nUtilisez le code SAHRAI20 lors de votre réservation.\n\nCette offre est valable jusqu'au 30 avril 2026.\n\nChaleureusement,\nVilla Sahrai", variables: ["firstName"], language: "fr", createdAt: "2026-01-20T09:00:00Z", updatedAt: "2026-02-18T11:00:00Z" },
  { id: "t3", name: "Suivi WhatsApp post-séjour", channel: "whatsapp", body: "Bonjour {firstName} ! Merci d'avoir séjourné à Villa Sahrai. Nous espérons que votre séjour en {roomType} était parfait. N'hésitez pas à nous faire part de vos impressions. A bientôt !", variables: ["firstName", "roomType"], language: "fr", createdAt: "2026-02-01T08:00:00Z", updatedAt: "2026-02-22T16:00:00Z" },
  { id: "t4", name: "Welcome follow-up", channel: "email", subject: "Thank you for staying with us, {firstName}!", body: "Dear {firstName},\n\nThank you for choosing Villa Sahrai for your recent stay. We hope your experience in our {roomType} exceeded your expectations.\n\nWe would love to hear your feedback.\n\nWarm regards,\nThe Villa Sahrai Team", variables: ["firstName", "roomType"], language: "en", createdAt: "2026-02-05T10:00:00Z", updatedAt: "2026-02-21T09:30:00Z" },
  { id: "t5", name: "Rappel spa", channel: "whatsapp", body: "Bonjour {firstName}, nous avons remarqué que vous avez apprécié notre spa lors de votre séjour du {stayDate}. Découvrez nos nouveaux soins exclusifs ! Réservez dès maintenant : villasahrai.com/spa", variables: ["firstName", "stayDate"], language: "fr", createdAt: "2026-02-10T14:00:00Z", updatedAt: "2026-02-25T10:00:00Z" },
  { id: "t6", name: "ترحيب بعد الإقامة", channel: "email", subject: "شكراً لإقامتكم، {firstName}", body: "عزيزي/عزيزتي {firstName}،\n\nنأمل أن إقامتكم في {roomType} كانت مميزة.\n\nرأيكم يهمنا كثيراً.\n\nمع أطيب التحيات،\nفريق فيلا سهراي", variables: ["firstName", "roomType"], language: "ar", createdAt: "2026-02-12T11:00:00Z", updatedAt: "2026-02-24T15:00:00Z" },
];

export const mockConversations: Conversation[] = [
  { id: "cv1", contactId: "ct1", contact: { id: "ct1", firstName: "Karim", lastName: "Benjelloun", email: "karim.benjelloun@email.com", phone: "+212 661 234 567", source: "booking", stayDate: "2026-02-15", roomType: "Suite Royale", tags: ["VIP", "Spa"], createdAt: "2026-02-15T10:00:00Z" }, channel: "email", status: "replied", messages: [{ direction: "outbound", content: "Cher Karim, nous espérons que votre séjour dans notre Suite Royale vous a laissé des souvenirs inoubliables...", timestamp: "2026-02-12T09:00:00Z" }, { direction: "inbound", content: "Merci beaucoup ! Le séjour était exceptionnel. Le spa en particulier était incroyable.", timestamp: "2026-02-12T14:30:00Z" }] },
  { id: "cv2", contactId: "ct2", contact: { id: "ct2", firstName: "Sophie", lastName: "Martin", email: "sophie.martin@email.com", phone: null, source: "booking", stayDate: "2026-02-10", roomType: "Chambre Deluxe", tags: ["Repeat"], createdAt: "2026-02-10T14:30:00Z" }, channel: "email", status: "opened", messages: [{ direction: "outbound", content: "Chère Sophie, nous espérons que votre séjour dans notre Chambre Deluxe vous a laissé des souvenirs inoubliables...", timestamp: "2026-02-12T09:00:00Z" }] },
  { id: "cv3", contactId: "ct3", contact: { id: "ct3", firstName: "James", lastName: "Mitchell", email: "james.mitchell@email.com", phone: "+44 7700 900123", source: "booking", stayDate: "2026-02-08", roomType: "Suite Panoramique", tags: ["VIP", "Anniversary"], createdAt: "2026-02-08T09:15:00Z" }, channel: "email", status: "delivered", messages: [{ direction: "outbound", content: "Dear James, we hope your stay in our Suite Panoramique left you with unforgettable memories...", timestamp: "2026-02-12T09:00:00Z" }] },
  { id: "cv4", contactId: "ct4", contact: { id: "ct4", firstName: "Fatima", lastName: "El Amrani", email: "fatima.elamrani@email.com", phone: "+212 662 345 678", source: "manual", stayDate: "2026-02-05", roomType: "Chambre Supérieure", tags: ["Spa"], createdAt: "2026-02-05T11:00:00Z" }, channel: "email", status: "replied", messages: [{ direction: "outbound", content: "Chère Fatima, nous espérons que votre séjour vous a laissé des souvenirs inoubliables...", timestamp: "2026-02-12T09:00:00Z" }, { direction: "inbound", content: "Un séjour merveilleux, merci. Le petit-déjeuner en terrasse était un moment magique.", timestamp: "2026-02-13T08:15:00Z" }] },
  { id: "cv5", contactId: "ct5", contact: { id: "ct5", firstName: "Marco", lastName: "Rossi", email: "marco.rossi@email.com", phone: "+39 333 456 7890", source: "import", stayDate: "2026-01-28", roomType: "Suite Royale", tags: ["VIP"], createdAt: "2026-01-28T16:45:00Z" }, channel: "email", status: "failed", messages: [{ direction: "outbound", content: "Cher Marco, nous espérons que votre séjour vous a laissé des souvenirs inoubliables...", timestamp: "2026-02-12T09:00:00Z" }] },
  { id: "cv6", contactId: "ct7", contact: { id: "ct7", firstName: "Pierre", lastName: "Dubois", email: "pierre.dubois@email.com", phone: "+33 6 12 34 56 78", source: "booking", stayDate: "2026-01-20", roomType: "Chambre Supérieure", tags: ["Repeat", "Spa"], createdAt: "2026-01-20T12:00:00Z" }, channel: "whatsapp", status: "replied", messages: [{ direction: "outbound", content: "Bonjour Pierre ! Merci d'avoir séjourné à Villa Sahrai.", timestamp: "2026-02-01T08:00:00Z" }, { direction: "inbound", content: "Bonjour ! Oui, c'était parfait comme d'habitude. J'ai déjà hâte de revenir !", timestamp: "2026-02-01T09:45:00Z" }] },
  { id: "cv7", contactId: "ct8", contact: { id: "ct8", firstName: "Leila", lastName: "Benkirane", email: "leila.benkirane@email.com", phone: "+212 664 567 890", source: "booking", stayDate: "2026-01-18", roomType: "Suite Panoramique", tags: ["VIP", "Birthday"], createdAt: "2026-01-18T15:20:00Z" }, channel: "whatsapp", status: "replied", messages: [{ direction: "outbound", content: "Bonjour Leila ! Merci d'avoir séjourné à Villa Sahrai.", timestamp: "2026-02-01T08:00:00Z" }, { direction: "inbound", content: "Merci ! Mon anniversaire à Villa Sahrai restera un souvenir inoubliable.", timestamp: "2026-02-01T10:20:00Z" }] },
  { id: "cv8", contactId: "ct9", contact: { id: "ct9", firstName: "Hans", lastName: "Weber", email: "hans.weber@email.com", phone: "+49 170 1234567", source: "import", stayDate: "2026-01-15", roomType: "Chambre Deluxe", tags: [], createdAt: "2026-01-15T10:30:00Z" }, channel: "whatsapp", status: "delivered", messages: [{ direction: "outbound", content: "Bonjour Hans ! Merci d'avoir séjourné à Villa Sahrai.", timestamp: "2026-02-01T08:00:00Z" }] },
  { id: "cv9", contactId: "ct10", contact: { id: "ct10", firstName: "Nadia", lastName: "Cherkaoui", email: "nadia.cherkaoui@email.com", phone: "+212 665 678 901", source: "manual", stayDate: "2026-01-12", roomType: "Suite Royale", tags: ["VIP", "Repeat"], createdAt: "2026-01-12T09:00:00Z" }, channel: "email", status: "opened", messages: [{ direction: "outbound", content: "Bonjour Nadia, pour vous remercier de votre fidélité, -20% sur votre prochain séjour...", timestamp: "2026-02-27T10:00:00Z" }] },
  { id: "cv10", contactId: "ct12", contact: { id: "ct12", firstName: "Youssef", lastName: "Alaoui", email: "youssef.alaoui@email.com", phone: "+212 666 789 012", source: "booking", stayDate: "2026-01-08", roomType: "Suite Panoramique", tags: ["VIP"], createdAt: "2026-01-08T17:00:00Z" }, channel: "email", status: "sent", messages: [{ direction: "outbound", content: "Bonjour Youssef, pour vous remercier de votre fidélité...", timestamp: "2026-02-27T10:00:00Z" }] },
];

// --- Smart Collector types & data ---

export interface ReviewRequestMessage {
  id: string;
  order: number;
  body: string;
  delayDays: number;
}

export interface ReviewMessageTemplate {
  id: string;
  language: "fr" | "en" | "ar";
  channel: "whatsapp" | "email";
  messages: ReviewRequestMessage[];
  status: "approved" | "draft";
  updatedAt: string;
}

export interface ReviewRequest {
  id: string;
  method: "csv" | "single" | "pms";
  channel: "whatsapp" | "email";
  guestCount: number;
  sentCount: number;
  status: "sent" | "pending" | "failed";
  createdAt: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export const mockReviewMessageTemplates: ReviewMessageTemplate[] = [
  {
    id: "rmt1",
    language: "fr",
    channel: "whatsapp",
    messages: [
      { id: "rm1", order: 1, body: "Bonjour {{1}},\nMerci d'avoir choisi Villa Sahrai pour votre séjour.\n\nNous espérons que vous avez passé un moment inoubliable. Pourriez-vous prendre un instant pour partager votre expérience ?\n\nDe 1 (faible) à 5 (excellent), comment évaluez-vous votre séjour ?", delayDays: 0 },
    ],
    status: "approved",
    updatedAt: "2026-02-25T14:00:00Z",
  },
  {
    id: "rmt2",
    language: "en",
    channel: "whatsapp",
    messages: [
      { id: "rm3", order: 1, body: "Dear {{1}},\nThis is the Guest Relations team from Villa Sahrai.\n\nAs we look to constantly improve the quality of our guest experience, we are reaching out to understand how your stay went, and how you would rate it.\n\nFrom 1 (low) to 5 (high) how would you rate your stay?", delayDays: 0 },
    ],
    status: "approved",
    updatedAt: "2026-02-24T10:00:00Z",
  },
  {
    id: "rmt3",
    language: "ar",
    channel: "whatsapp",
    messages: [
      { id: "rm4", order: 1, body: "\u0645\u0631\u062d\u0628\u0627 {{1}}\u060c\n\u0634\u0643\u0631\u0627 \u0644\u0627\u062e\u062a\u064a\u0627\u0631\u0643\u0645 \u0641\u064a\u0644\u0627 \u0633\u0647\u0631\u0627\u064a.\n\n\u0646\u0623\u0645\u0644 \u0623\u0646 \u0625\u0642\u0627\u0645\u062a\u0643\u0645 \u0643\u0627\u0646\u062a \u0645\u0645\u064a\u0632\u0629. \u0645\u0646 1 (\u0636\u0639\u064a\u0641) \u0625\u0644\u0649 5 (\u0645\u0645\u062a\u0627\u0632)\u060c \u0643\u064a\u0641 \u062a\u0642\u064a\u0645\u0648\u0646 \u0625\u0642\u0627\u0645\u062a\u0643\u0645\u061f", delayDays: 0 },
    ],
    status: "draft",
    updatedAt: "2026-02-20T16:00:00Z",
  },
];

export const mockReviewRequests: ReviewRequest[] = [
  { id: "rr1", method: "csv", channel: "whatsapp", guestCount: 24, sentCount: 24, status: "sent", createdAt: "2026-02-25T10:00:00Z" },
  { id: "rr2", method: "single", channel: "whatsapp", guestCount: 1, sentCount: 1, status: "sent", createdAt: "2026-02-26T14:30:00Z" },
  { id: "rr3", method: "csv", channel: "whatsapp", guestCount: 12, sentCount: 0, status: "pending", createdAt: "2026-02-27T09:00:00Z" },
];

export const mockRoutingRules: RoutingRule[] = [
  { id: "route1", name: "Avis positifs vers Google", condition: "note >= 4", action: "Rediriger vers Google Reviews", enabled: true },
  { id: "route2", name: "Avis n\u00e9gatifs vers formulaire", condition: "note < 4", action: "Rediriger vers formulaire de feedback interne", enabled: true },
  { id: "route3", name: "Clients VIP vers TripAdvisor", condition: "tag == VIP", action: "Rediriger vers TripAdvisor", enabled: false },
];
