import { db } from "@/firebase/config";
import { parseLocation } from "@/helpers/parseLocation";
import { removeAccents, removeAccents2 } from "@/helpers/removeAccents";
import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  FirestoreError,
  limit,
} from "firebase/firestore";

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

/* export type Building = {
  id: string;
  block_id: string;
  address: string;
  number: string;
  latitude: number;
  longitude: number;
  building_stairs: Stair[];
}; */

export type Building = {
  id: string;
  catastroId: string;
  address: string;
  blockCode: string;
  postalCode: string;
  neighbourhood: string;
  apartments: Apartment[];
  latitude: number; // Extracted from the location field
  longitude: number; // Extracted from the location field
  number: string; // Corresponds to streetNumber and converted to a string type
};

const buildingConverter: FirestoreDataConverter<Building> = {
  toFirestore(b: Building): DocumentData {
    const { id, ...building } = b;
    return building;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Building {
    const doc = snapshot.data();
    const { latitude, longitude } = parseLocation(doc.location);

    // Properly parse the apartments array
    const apartments =
      doc.apartments?.map((apartmentDoc: any) => ({
        id: apartmentDoc.apartmentCatastroId,
        floor: apartmentDoc.apartmentFloor || "",
        stair: apartmentDoc.apartmentStair || "",
        door: apartmentDoc.apartmentDoor || "",
      })) || [];

    return {
      ...doc,
      id: snapshot.id,
      catastroId: doc.catastroId,
      latitude,
      longitude,
      number: doc.streetNumber.toString(),
      apartments,
    } as Building;
  },
};

export function getBuildingStairs(building: Building): string[] {
  const stairSet = new Set(
    building.apartments.map((apartment) => apartment.stair)
  );
  return Array.from(stairSet);
}

export function getStairFloors(building: Building, stair: string): string[] {
  const floorsSet = new Set(
    building.apartments.filter((a) => a.stair == stair).map((a) => a.floor)
  );
  return Array.from(floorsSet);
}

// Create a new building
const createBuilding = async (building: Building): Promise<void> => {
  const ref = doc(db, `buildings/${building.id}`).withConverter(
    buildingConverter
  );
  await setDoc(ref, building);
};

// Retrieve a building by ID
const getBuilding = async (
  buildingId: string
): Promise<Building | undefined> => {
  const ref = doc(db, `buildings/${buildingId}`).withConverter(
    buildingConverter
  );
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : undefined;
};

// Retrieve a building by CatastroID
const findBuildingByCatastroId = async (
  catastroId: string
): Promise<Building | undefined> => {
  const ref = collection(db, `buildings/`).withConverter(buildingConverter);
  const q = query(ref, where("catastroId", "==", catastroId), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.empty ? undefined : snapshot.docs[0].data();
};

// Retrieve a building by Address
const findBuildingByAddress = async (
  fullAddress: string
): Promise<Building | null> => {
  try {
    // Regular expression to extract street name and number from an address
    // Adjust regex as needed based on expected address formats
    const addressRegex = /^(.*?),\s*(\d+)/;
    const match = fullAddress.match(addressRegex);

    if (!match) throw new Error("Invalid address format");

    const [, streetName, streetNumber] = match;

    const buildingsCol = collection(db, "buildings").withConverter(
      buildingConverter
    );
    const q = query(
      buildingsCol,
      where("address", "==", removeAccents(streetName.trim())),
      where("streetNumber", "==", streetNumber.trim())
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    // Assuming each address + number combination is unique, take the first match
    const buildingData = querySnapshot.docs.map((doc) => {
      return doc.data() as Building;
    })[0];

    return buildingData;
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Firestore error:", error.message);
    } else {
      console.error("Error:", error);
    }
    return null;
  }
};

// Update an existing building
const updateBuilding = async (
  buildingId: string,
  updatedFields: Partial<Building>
): Promise<void> => {
  const ref = doc(db, `buildings/${buildingId}`).withConverter(
    buildingConverter
  );
  await updateDoc(ref, updatedFields);
};

// Delete a building
const deleteBuilding = async (buildingId: string): Promise<void> => {
  const ref = doc(db, `buildings/${buildingId}`);
  await deleteDoc(ref);
};

export {
  createBuilding,
  findBuildingByAddress,
  findBuildingByCatastroId,
  getBuilding,
  updateBuilding,
  deleteBuilding,
};
