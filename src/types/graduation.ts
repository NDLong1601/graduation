export interface EventConfig {
  graduate: {
    fullName: string;
    degree: string;
    major: string;
    university: string;
    faculty: string;
    avatarUrl?: string;
    classCode: string;
    studentId: string;
  };
  event: {
    title: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    isoDateTime: string; // For countdown calculation
    locationName: string;
    hall: string;
    address: string;
    googleMapsUrl: string;
    googleMapsEmbedUrl: string;
  };
  dresscode: {
    title: string;
    description: string;
    colors: { name: string; hex: string; desc: string }[];
  };
  timeline: {
    time: string;
    title: string;
    description: string;
    icon: string;
  }[];
  memories: {
    phase: string;
    year: string;
    title: string;
    description: string;
    tags: string[];
    imagePlaceholderBg: string;
  }[];
  contact: {
    phone: string;
    facebookUrl?: string;
    zaloUrl?: string;
  };
}

export interface WishMessage {
  id: string;
  name: string;
  relation: string;
  message: string;
  timestamp: string;
  avatarEmoji: string;
}
