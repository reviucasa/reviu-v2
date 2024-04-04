import { db } from "@/firebase/config";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";

export type RealStateAgency = {
  documentId: string;
  id: string;
  name: string;
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
  const matchingAgencies = querySnapshot.docs.map((doc) => doc.data());
  return matchingAgencies;
}

export { getAgency, searchAgenciesByName };
