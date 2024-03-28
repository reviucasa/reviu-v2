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
import { Apartment } from "./types";

export type Review = {
  address: string;
  id: string;
  timestamp: string;
  updated: string;
  draft: boolean;
  apartment?: Apartment;
  data: Partial<ReviewData>;
  buildingId: string;
  userId: string;
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

// Create a new review
const createDraft = async (
  uid: string,
  review: Partial<Review>
): Promise<void> => {
  const ref = doc(db, `drafts/${uid}`).withConverter(reviewConverter);
  await setDoc(ref, review);
};

// Retrieve user draft review
const getDraft = async (uid: string): Promise<Review | undefined> => {
  const ref = doc(db, `drafts/${uid}`).withConverter(reviewConverter);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : undefined;
};

const updateDraftData = async <K extends keyof ReviewData>(
  uid: string,
  dataField: K | `${K}.${string}`, // Allows for nested fields like "community.services"
  fieldValue: ReviewData[K] | any, // Use 'any' for nested fields to bypass deep type checks
  nextStep: number
): Promise<void> => {
  const ref = doc(db, `drafts/${uid}`).withConverter(reviewConverter);

  await updateDoc(ref, {
    [`data.${dataField}`]: fieldValue,
    "data.step": nextStep,
  });
};

// Update an existing review
const updateDraft = async (
  uid: string,
  updatedFields: Partial<Review>
): Promise<void> => {
  const ref = doc(db, `drafts/${uid}`).withConverter(reviewConverter);
  await updateDoc(ref, updatedFields);
};

// Delete a draft
const deleteDraft = async (uid: string): Promise<void> => {
  const ref = doc(db, `drafts/${uid}`);
  await deleteDoc(ref);
};

// Retrieve user draft review
const getReview = async (id: string): Promise<Review | undefined> => {
  const ref = doc(db, `reviews/${id}`).withConverter(reviewConverter);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : undefined;
};

// Create a new review
const publishReview = async (
  uid: string,
  review: Partial<Review>
): Promise<void> => {
  const ref = doc(db, `reviews/`).withConverter(reviewConverter);
  await setDoc(ref, { ...review, userId: uid });
};

// Update an existing review
const updateReview = async (
  id: string,
  updatedFields: Partial<Review>
): Promise<void> => {
  const ref = doc(db, `review/${id}`).withConverter(reviewConverter);
  await updateDoc(ref, updatedFields);
};

// Delete a review
const deleteReview = async (uid: string): Promise<void> => {
  const ref = doc(db, `drafts/${uid}`);
  await deleteDoc(ref);
};

// Retrieve reviews
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

export {
  getDraft,
  createDraft,
  updateDraft,
  updateDraftData,
  deleteDraft,
  getReview,
  publishReview,
  updateReview,
  getReviews,
};
