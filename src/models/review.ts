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
  collection,
  query,
  limit,
  getDocs,
  orderBy,
} from "firebase/firestore";

export type Apartment = {
  id: string;
  stair: string;
  floor: string;
  door: string;
};

export type Review = {
  address: string;
  id: string;
  timestamp: string;
  updated: string;
  draft: boolean;
  apartment?: Partial<Apartment>;
  data: Partial<ReviewData>;
  buildingId: string;
};

export type ReviewData = {
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
  buildingCleaning?: string;
  buildingMaintenance?: string;
  buildingNeighborhood?: string[];
  neighborsRelationship?: string;
  services?: string[];
  touristicApartments?: string;
  comment?: string;
};

export type Management = {
  adviceLandlord: string;
  adviceRealState: string;
  deposit: string;
  isRealStateAgency: boolean;
  landlordDealing: string;
  problemSolving: string;
  realStateAgency_id?: string;
  realStateAgency: string;
  realStateDealing: string;
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
  currentResidence: boolean;
  startMonth: string;
  endMonth: string;
  startPrice: string;
  endPrice: string;
  startYear: string;
  endYear: string;
};
export type Valuation = {
  light: string;
  maintenance: string;
  noise: string;
  services: string[];
  summerTemperature: string;
  winterTemperature: string;
};

const reviewConverter: FirestoreDataConverter<Review> = {
  toFirestore(review: Review): DocumentData {
    return review;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Review {
    const doc = snapshot.data();
    return {
      ...doc,
      id: snapshot.id,
    } as Review;
  },
};

// Create a new user
const createReview = async (
  uid: string,
  review: Partial<Review>
): Promise<void> => {
  const ref = doc(db, `users/${uid}`).withConverter(reviewConverter);
  await setDoc(ref, review);

  /* const ref = collection(db, `users`).withConverter(userConverter);
  await addDoc(ref, user); */
};

// Retrieve user draft review
const getReview = async (uid: string): Promise<Review | undefined> => {
  const ref = doc(db, `drafts/${uid}`).withConverter(reviewConverter);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : undefined;
};

// Update an existing user
const updateReview = async (
  uid: string,
  updatedFields: Partial<Review>
): Promise<void> => {
  const ref = doc(db, `drafts/${uid}`).withConverter(reviewConverter);
  await updateDoc(ref, updatedFields);
};

// Delete a user
const deleteReview = async (uid: string): Promise<void> => {
  const ref = doc(db, `drafts/${uid}`);
  await deleteDoc(ref);
};

// Retrieve user draft review
const getReviews = async (count?: number): Promise<Review[]> => {
  const ref = collection(db, `reviews`).withConverter(reviewConverter);
  let q = query(ref);

  // Conditionally add a limit
  if (count) {
    q = query(q, orderBy("timeCreated", "desc"), limit(count));
  }

  return getDocs(q)
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No reviews.");
        return [];
      }
      return snapshot.docs.map((doc) => doc.data());
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
      return [];
    });
};

export { reviewConverter, createReview, getReview, updateReview, getReviews };
