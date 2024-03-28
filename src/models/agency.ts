import { db } from "@/firebase/config";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";

export type RealStateAgency = {
  id: string;
  name: string;
};

const realStateAgencyConverter: FirestoreDataConverter<RealStateAgency> = {
  toFirestore(realStateAgency: RealStateAgency): DocumentData {
    return realStateAgency;
  },

  // Converts a Firestore document to a RealStateAgency object
  fromFirestore(snapshot: QueryDocumentSnapshot): RealStateAgency {
    const data = snapshot.data();
    return {
      ...data,
    } as RealStateAgency;
  },
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

export { searchAgenciesByName };
