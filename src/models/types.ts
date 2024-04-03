import { Review } from "./review";

export type Address =
  /* {
  address: string;
} */
  {
    id: string | undefined;
    address: {
      string: string;
    };
  };

export type AddressList = { results: Address[] };



export type ReviewRequest = {
  buildingId?: string;
  apartmentId?: string;
  review?: any;
  draft?: boolean;
};

export type WordCloud = {
  group: string;
  words: { word: string; count: number }[];
};
export type Value = {
  key: string;
  value: number;
  percentage: number;
};
export type Stat = {
  stat: string;
  total: number;
  stat_display_text: string;
  values: Value[];
};
export type Analisis = {
  building: {
    id: string;
    address: string;
    reviews: Review[];
    neighbourhood: {
      wordCloud: WordCloud[];
      stats: Stat[];
    };
    latitude: number;
    longitude: number;
  };
};

export type AgencyReviews = {
  agency: {
    id: string;
    agency_name: string;
  };
  reviews: Review[];
};

export type ConfigValue = {
  label: string;
  value: string;
};

export type Config = {
  buildingInfo: {
    currentResidence: [];
    startMonth: [];
    startYear: [];
    startPrice: [];
  };
  buildingQuality: {
    summerTemperature: ConfigValue[];
    winterTemperature: ConfigValue[];
    noise: ConfigValue[];
    light: ConfigValue[];
    maintenance: ConfigValue[];
    services: ConfigValue[];
  };
  experience: {
    overall: [];
    positiveComments: [];
    negativeComments: [];
    recommend: [];
  };
  landlord: {
    isAgency: [];
    landlordTreatment: ConfigValue[];
    problemSolving: ConfigValue[];
    deposit: ConfigValue[];
    advices: [];
  };
  neighbors: {
    buildingNeighborhood: ConfigValue[];
    touristicApartments: ConfigValue[];
    neighborsRelationship: ConfigValue[];
    buildingMaintenance: ConfigValue[];
    buildingCleaning: ConfigValue[];
    services: ConfigValue[];
    comments: [];
  };
  neighbourhood: {
    vibe: ConfigValue[];
    tourists: ConfigValue[];
    noise: ConfigValue[];
    security: ConfigValue[];
    cleaning: ConfigValue[];
    services: ConfigValue[];
    comments: [];
  };
};
