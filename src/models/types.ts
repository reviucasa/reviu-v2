import { ReviewData } from "./review";

export type Adress = {
  address: string;
};

export type AdressList = { results: Adress[] };

export type RealStateAgency = {
  id: string;
  agency_name: string;
};

export type RealStateAgencyList = { agencies: Array<RealStateAgency> };

export type Apartment = {
  id: string;
  stair: string;
  floor: string;
  door: string;
};

export type Floor = {
  stair: string;
  floor: string;
  apartments: Apartment[];
};

export type Stair = {
  stair: string;
  building_floors: Floor[];
};

export type Building = {
  id: string;
  block_id: string;
  address: string;
  number: string;
  latitude: number;
  longitude: number;
  building_stairs: Stair[];
};

export type BuildingResponse = {
  building: Building;
};

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
    reviews: ReviewData[];
    neighborhood: {
      word_cloud: WordCloud[];
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
  reviews: ReviewData[];
};

export type ConfigValue = {
  label: string;
  value: string;
};

export type Config = {
  review_config: {
    building_info: {
      current_residence: [];
      start_month: [];
      start_year: [];
      start_price: [];
    };
    building_quality: {
      summer_temperature: ConfigValue[];
      winter_temperature: ConfigValue[];
      noise: ConfigValue[];
      light: ConfigValue[];
      maintenance: ConfigValue[];
      services: ConfigValue[];
    };
    experience: {
      overall: [];
      positive_comments: [];
      negative_comments: [];
      recommend: [];
    };
    landlord: {
      is_agency: [];
      landlord_treatment: ConfigValue[];
      problem_solving: ConfigValue[];
      deposit: ConfigValue[];
      advices: [];
    };
    neighbors: {
      building_neighborhood: ConfigValue[];
      touristic_apartments: ConfigValue[];
      neighbors_relationship: ConfigValue[];
      building_maintenance: ConfigValue[];
      building_cleaning: ConfigValue[];
      services: ConfigValue[];
      comments: [];
    };
    neighborhood: {
      vibe: ConfigValue[];
      tourists: ConfigValue[];
      noise: ConfigValue[];
      security: ConfigValue[];
      cleaning: ConfigValue[];
      services: ConfigValue[];
      comments: [];
    };
  };
};
