export type Coordinates = {
  latitude: number;
  longitude: number;
};

export class Apartment {
  stair?: string;
  floor?: string;
  door?: string;

  constructor(floor?: string, stair?: string, door?: string) {
    this.floor = floor;
    this.stair = stair;
    this.door = door;
  }
}

export class Building {
  address: string;
  apartment?: Apartment;
  postalCode: string;
  location: Location;

  constructor(
    address: string,
    apartment: Apartment,
    postalCode: string,
    location: Location
  ) {
    this.address = address;
    this.apartment = apartment;
    this.postalCode = postalCode;
    this.location = location;
  }
}

export class Location {
  coordinates: Coordinates;
  district?: string;
  municipality: string;
  number: number;
  province: string;
  street: string;
  type: string;

  constructor(
    coordinates: Coordinates,
    district: string,
    municipality: string,
    province: string,
    street: string,
    number: number,
    type: string
  ) {
    this.coordinates = coordinates;
    this.district = district;
    this.municipality = municipality;
    this.province = province;
    this.street = street;
    this.number = number;
    this.type = type;
  }
}
