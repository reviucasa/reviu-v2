import { db } from "@/firebase/config";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  doc,
  endAt,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
  where,
} from "firebase/firestore";

export type RealStateAgency = {
  documentId: string;
  id: string;
  name: string;
  lowercase: string;
  timeCreated: Timestamp;
};

const realStateAgencyConverter: FirestoreDataConverter<RealStateAgency> = {
  toFirestore(a: RealStateAgency): DocumentData {
    const { documentId, ...agency } = a;
    return agency;
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): RealStateAgency {
    const data = snapshot.data();
    return {
      documentId: snapshot.id,
      ...data,
    } as RealStateAgency;
  },
};

// Create agency
const createAgency = async (agencyName: string): Promise<string> => {
  const ref = doc(collection(db, "agencies")).withConverter(
    realStateAgencyConverter
  );
  await setDoc(ref, {
    documentId: ref.id,
    id: "",
    name: agencyName,
    lowercase: agencyName.toLocaleLowerCase(),
    timeCreated: serverTimestamp(),
  });
  return ref.id;
};

// Retrieve a building by ID
const getAgency = async (
  agencyId: string
): Promise<RealStateAgency | undefined> => {
  const ref = doc(db, `agencies/${agencyId}`).withConverter(
    realStateAgencyConverter
  );
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : undefined;
};

const getAgencyByName = async (
  agency: string
): Promise<RealStateAgency | undefined> => {
  // Create a reference to the collection of agencies
  const agenciesRef = collection(db, "agencies").withConverter(
    realStateAgencyConverter
  );

  // Build a query that matches the 'lowercase' field
  const q = query(agenciesRef, where("lowercase", "==", agency.toLowerCase()));

  // Execute the query
  const querySnapshot = await getDocs(q);

  // Return the first matching agency, or undefined if none are found
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  } else {
    return undefined;
  }
};

const getAgencyCount = async (): Promise<number> => {
  const ref = collection(db, "agencies").withConverter(
    realStateAgencyConverter
  );
  const snapshot = await getCountFromServer(ref);
  return snapshot.data().count;
};

async function getAgencies(
  idx?: number, // Optional index parameter (for pagination)
  chunkSize?: number // Optional chunkSize parameter, if undefined, fetch all agencies
): Promise<RealStateAgency[]> {
  const ref = collection(db, "agencies").withConverter(
    realStateAgencyConverter
  );

  // If chunkSize is not provided, fetch all agencies
  if (!chunkSize) {
    const querySnapshot = await getDocs(ref);
    return querySnapshot.docs.map((doc) => doc.data() as RealStateAgency);
  }

  // Use orderBy, startAt, and limit to paginate the agencies if chunkSize is provided
  const q = query(
    ref,
    orderBy("lowercase"),
    startAt(idx ? idx * chunkSize : 0), // Start fetching from the idx * chunkSize
    limit(chunkSize) // Fetch only chunkSize number of agencies
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as RealStateAgency);
}

async function searchAgenciesByName(prefix: string) {
  const ref = collection(db, "agencies").withConverter(
    realStateAgencyConverter
  );
  // Use orderBy to enable range queries on 'name'
  const q = query(
    ref,
    orderBy("lowercase"),
    startAt(prefix),
    endAt(prefix + "\uf8ff") // '\uf8ff' is a high code point in the Unicode range, used to match anything that starts with 'prefix'
  );

  const querySnapshot = await getDocs(q);
  /* const matchingAgencies = querySnapshot.docs.map((doc) => doc.data());
  return matchingAgencies; */

  const allAgencies = querySnapshot.docs.map(
    (doc) => doc.data() as RealStateAgency
  );

  // Sort agencies by the length of their lowercase value (shortest first)
  allAgencies.sort((a, b) => a.lowercase.length - b.lowercase.length);

  const uniqueAgencies: RealStateAgency[] = [];

  for (const agency of allAgencies) {
    // Check if this agency's lowercase value is contained in any of the already selected unique agencies
    if (
      !uniqueAgencies.some(
        (uniqueAgency) =>
          uniqueAgency.lowercase.includes(agency.lowercase) ||
          agency.lowercase.includes(uniqueAgency.lowercase)
      )
    ) {
      uniqueAgencies.push(agency);
    }
  }

  return uniqueAgencies;
}

export {
  createAgency,
  getAgency,
  getAgencyByName,
  getAgencies,
  searchAgenciesByName,
  getAgencyCount,
};
