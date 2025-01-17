/* import { db } from "@/firebase/config";
import { parseLocation } from "@/helpers/parseLocation";
import {
  removeAccents,
  removeAccents2,
  removeVowelAccents,
  removeVowelAccents2,
} from "@/helpers/removeAccents";
import { removePostAposSpace } from "@/helpers/removePostAposSpace";
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

// Retrieve all buildings
const getBuildings = async (): Promise<Building[] | undefined> => {
  const q = query(collection(db, "buildings").withConverter(buildingConverter));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

// Retrieve multiple buildings by a list of IDs
const getBuildingsByIds = async (
  ids: string[]
): Promise<(Building | undefined)[]> => {
  const results: (Building | undefined)[] = await Promise.all(
    ids.map(async (id) => {
      return await getBuilding(id);
    })
  );
  return results;
};

// Retrieve a building by ID
const getBuildingByAddress = async (
  street: string,
  number: string
): Promise<Building | undefined> => {
  // Create a reference to the collection of agencies
  const ref = collection(db, "buildings").withConverter(buildingConverter);

  // Build a query that matches the 'lowercase' field
  const q = query(ref, where("address", "==", street));

  // Execute the query
  const querySnapshot = await getDocs(q);

  // Return the first matching agency, or undefined if none are found
  if (!querySnapshot.empty) {
    const res = querySnapshot.docs.filter((q) => q.data().number == number);
    return res[0].data();
  } else {
    return undefined;
  }
};

// Retrieve multiple buildings by a list of addresses
const getBuildingsByAddresses = async (
  addresses: { street: string; number: string }[]
): Promise<(Building | undefined)[]> => {
  const results: (Building | undefined)[] = await Promise.all(
    addresses.map(async ({ street, number }) => {
      return await getBuildingByAddress(street, number);
    })
  );
  return results;
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
      where(
        "address",
        "==",
        removePostAposSpace(removeVowelAccents2(streetName.trim()))
      ),
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
  getBuildingByAddress,
  getBuildingsByAddresses,
  updateBuilding,
  deleteBuilding,
  getBuildings,
  getBuildingsByIds,
};
 */