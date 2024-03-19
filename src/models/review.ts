import { db } from "@/firebase/config";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { Apartment } from "./types";

export type ReviewData = {
  address: string;
  id: string;
  timestamp: string;
  updated: string;
  draft: boolean;
  apartmentId: string;
  review: Partial<Review>;
  buildingId: string;
};

export type Review = {
  community: Community;
  management?: Management;
  neighbourhood: Neighbourhood;
  opinion: Opinion;
  stay: Stay;
  step: number;
  valuation?: Valuation;
  timestamp: string;
  updated: string;
};

export type Community = {
  building_cleaning?: string;
  building_maintenance?: string;
  building_neighborhood?: string[];
  neighbors_relationship?: string;
  services?: string[];
  touristic_apartments?: string;
  comment?: string;
};

export type Management = {
  advice_landlord: string;
  advice_real_state: string;
  deposit: string;
  is_real_state_agency: boolean;
  landlord_dealing: string;
  problem_solving: string;
  real_state_agency_id?: string;
  real_state_agency: string;
  real_state_dealing: string;
};
export type Neighbourhood = {
  cleaning: string;
  comments: string;
  noise: string;
  security: string;
  services: string[];
  tourists: string;
  vibe: string[];
};
export type Opinion = {
  negative: string;
  positive: string;
  recomend: boolean;
  title: string;
};
export type Stay = {
  current_residence: boolean;
  start_month: string;
  end_month: string;
  start_price: string;
  end_price: string;
  start_year: string;
  end_year: string;
};
export type Valuation = {
  light: string;
  maintenance: string;
  noise: string;
  services: string[];
  summer_temperature: string;
  winter_temperature: string;
};

const reviewConverter: FirestoreDataConverter<ReviewData> = {
  toFirestore(review: ReviewData): DocumentData {
    return review;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): ReviewData {
    const data = snapshot.data();
    return {
      ...data,
      id: snapshot.id,
    } as ReviewData;
  },
};

// Create a new user
const createReview = async (
  uid: string,
  user: Partial<ReviewData>
): Promise<void> => {
  const ref = doc(db, `users/${uid}`).withConverter(reviewConverter); // Get a reference to the document with the specific ID
  await setDoc(ref, user);

  /* const ref = collection(db, `users`).withConverter(userConverter);
  await addDoc(ref, user); */
};

// Retrieve user draft review
const getReview = async (uid: string): Promise<ReviewData | undefined> => {
  const ref = doc(db, `drafts/${uid}`).withConverter(reviewConverter);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : undefined;
};

// Update an existing user
const updateReview = async (
  uid: string,
  updatedFields: Partial<ReviewData>
): Promise<void> => {
  const ref = doc(db, `drafts/${uid}`).withConverter(reviewConverter);
  await updateDoc(ref, updatedFields);
};

// Delete a user
const deleteReview = async (uid: string): Promise<void> => {
  const ref = doc(db, `drafts/${uid}`);
  await deleteDoc(ref);
};

export { reviewConverter, createReview, getReview, updateReview };
