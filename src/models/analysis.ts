import { Review } from "./review";

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
  statDisplayText: string;
  values: Value[];
};

export class Analysis {
  buildingId: string;
  address: string;
  reviews: Review[];
  neighbourhood: {
    wordCloud: WordCloud[];
    stats: Stat[];
  };
  latitude: number;
  longitude: number;

  constructor({
    buildingId,
    address,
    reviews,
    neighbourhood,
    latitude,
    longitude,
  }: Analysis) {
    this.buildingId = buildingId;
    this.address = address;
    this.reviews = reviews;
    this.neighbourhood = neighbourhood;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
