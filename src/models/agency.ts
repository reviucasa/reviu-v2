import { db } from "@/firebase/config";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
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

export { createAgency, getAgency, searchAgenciesByName };
