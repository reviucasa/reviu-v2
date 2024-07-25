import { db, firebase } from "@/firebase/config";
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
  addDoc,
  where,
  serverTimestamp,
  Timestamp,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { Apartment } from "./building";
import { User, getUsersById } from "./user";
import { shuffleArray } from "@/helpers/shuffleArray";

export enum ReviewStatus {
  Suspended = "suspended",
  Reported = "reported",
  Published = "published",
}

export type Review = {
  address: string;
  id: string;
  timeCreated: Timestamp;
  timeUpdated: Timestamp;
  status: ReviewStatus;
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
  updated: string;
};

export type ReviewImage = {
  url: string;
  caption: string;
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
  agencyId: string;
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
  images: ReviewImage[];
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
  toFirestore(r: Review): DocumentData {
    const { id, ...review } = r;
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

const draftConverter: FirestoreDataConverter<Review> = {
  toFirestore(r: Review): DocumentData {
    const { id, ...review } = r;
    return review;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Review {
    const doc = snapshot.data();
    return {
      ...doc,
      userId: snapshot.id,
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

const getDrafts = async ({
  count,
  startAfterDocId,
}: {
  count: number;
  startAfterDocId: string | null;
}): Promise<Review[]> => {
  const ref = collection(db, "drafts").withConverter(draftConverter);
  let q = query(ref, limit(count));

  if (startAfterDocId) {
    const lastDocRef = await getDoc(
      doc(db, "drafts", startAfterDocId).withConverter(draftConverter)
    );
    if (lastDocRef.exists()) {
      q = query(ref, startAfter(lastDocRef), limit(count));
    } else {
      console.error("The document to start after does not exist.");
      return [];
    }
  }

  return getDocs(q)
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No drafts.");
        return [];
      }
      return snapshot.docs.map((doc) => doc.data() as Review);
    })
    .catch((error) => {
      console.error("Error fetching drafts:", error);
      return [];
    });
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
  if (review.data) {
    const ref = collection(db, `reviews`).withConverter(reviewConverter);
    await addDoc(ref, {
      ...review,
      userId: uid,
      timeCreated: serverTimestamp(),
      timeUpdated: serverTimestamp(),
    });
  }
};

// Update an existing review
const updateReview = async (
  id: string,
  updatedFields: Partial<Review>
): Promise<void> => {
  const ref = doc(db, `review/${id}`).withConverter(reviewConverter);
  await updateDoc(ref, updatedFields);
};

// Suspend a review
const unsuspendReview = async (id: string): Promise<void> => {
  const ref = doc(db, "reviews", id);
  await updateDoc(ref, {
    status: ReviewStatus.Published,
    timeUpdated: serverTimestamp(),
  });
};

// Suspend a review
const suspendReview = async (id: string): Promise<void> => {
  const ref = doc(db, "reviews", id);
  await updateDoc(ref, {
    status: ReviewStatus.Suspended,
    timeUpdated: serverTimestamp(),
  });
};

// Delete a review
const deleteReview = async (id: string): Promise<void> => {
  const ref = doc(db, `reviews`, id);
  await deleteDoc(ref);
};

// Retrieve reviews
const getReviews = async ({
  count,
  startAfterTime,
  random = false,
}: {
  count: number;
  startAfterTime: Timestamp | null;
  random?: boolean;
}): Promise<Review[]> => {
  const ref = collection(db, `reviews`).withConverter(reviewConverter);
  let q = query(ref, where("status", "!=", ReviewStatus.Suspended));

  // Conditionally add a limit
  if (count) {
    if (!random) {
      q = query(q, orderBy("timeCreated", "desc"), limit(count));
    }
  }

  if (startAfterTime) {
    q = query(q, startAfter(startAfterTime));
  }

  return getDocs(q)
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No reviews.");
        return [];
      }
      if (random) {
        return shuffleArray(snapshot.docs.map((doc) => doc.data())).slice(
          0,
          count
        );
      }
      return snapshot.docs.map((doc) => doc.data());
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
      return [];
    });
};

// Retrieve reviews with user
const getReviewsWithUser = async ({
  count,
  startAfterTime,
}: {
  count: number;
  startAfterTime: Timestamp | null;
}): Promise<{ reviews: Review[]; users: User[]; count: number }> => {
  const docsCount = await getReviewsCount(ReviewStatus.Published);
  const reviews = await getReviews({ count, startAfterTime });
  const uids = Array.from(new Set(reviews.map((r) => r.userId)));
  const users = await getUsersById(uids);
  return { reviews, users, count: docsCount };
};

// Retrieve suspended reviews
const getSuspendedReviews = async (): Promise<Review[]> => {
  const ref = collection(db, `reviews`).withConverter(reviewConverter);
  let q = query(
    ref,
    orderBy("timeCreated", "desc"),
    where("status", "==", ReviewStatus.Suspended)
  );

  return getDocs(q)
    .then((snapshot) => {
      return snapshot.empty ? [] : snapshot.docs.map((doc) => doc.data());
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
      return [];
    });
};
// Retrieve reviews
const getSuspendedReviewsWithUser = async (): Promise<{
  reviews: Review[];
  users: User[];
  count: number;
}> => {
  const docsCount = await getReviewsCount(ReviewStatus.Suspended);
  const reviews = await getSuspendedReviews();
  const uids = Array.from(new Set(reviews.map((r) => r.userId)));
  const users = await getUsersById(uids);
  return { reviews, users, count: docsCount };
};

// Retrieve building reviews
const getReviewsByBuidingId = async (buildingId: string): Promise<Review[]> => {
  const ref = collection(db, "reviews").withConverter(reviewConverter);
  const q = query(
    ref,
    where("buildingId", "==", buildingId),
    where("status", "==", ReviewStatus.Published)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((e) => e.data());
};

const getReviewsByAgencyId = async (agencyId: string): Promise<Review[]> => {
  const ref = collection(db, "reviews").withConverter(reviewConverter);
  const q = query(
    ref,
    where("data.management.agencyId", "==", agencyId),
    where("status", "==", ReviewStatus.Published)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Review); // Cast to Review type if necessary
};

// Retrieve user reviews
const getReviewsFromUser = async (uid: string): Promise<Review[]> => {
  const ref = collection(db, "reviews").withConverter(reviewConverter);
  const q = query(ref, where("userId", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((e) => e.data());
};

// Retrieve reviews with user
const getDraftsWithUser = async ({
  count,
  startAfterDocId,
}: {
  count: number;
  startAfterDocId: string | null;
}): Promise<{ drafts: Review[]; users: User[]; count: number }> => {
  const docsCount = await getDraftsCount();
  const drafts = await getDrafts({ count, startAfterDocId });
  const uids = Array.from(new Set(drafts.map((d) => d.userId!)));
  const users = await getUsersById(uids);
  return { drafts, users, count: docsCount };
};

// Function to get the count of documents in the "drafts" collection
const getReviewsCount = async (status: ReviewStatus): Promise<number> => {
  const draftsCollection = collection(db, "reviews");
  const q = query(draftsCollection, where("status", "==", status));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

// Function to get the count of documents in the "drafts" collection
const getDraftsCount = async (): Promise<number> => {
  const draftsCollection = collection(db, "drafts");
  const q = query(draftsCollection);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
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
  suspendReview,
  unsuspendReview,
  deleteReview,
  getReviews,
  getReviewsWithUser,
  getSuspendedReviews,
  getSuspendedReviewsWithUser,
  getReviewsByBuidingId,
  getReviewsByAgencyId,
  getReviewsFromUser,
  reviewConverter,
  getDraftsWithUser,
  getDraftsCount,
  getReviewsCount,
};
