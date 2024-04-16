import { db } from "@/firebase/config";
import {
  Timestamp,
  FirestoreDataConverter,
  doc,
  getDoc,
  collection,
  query,
  getDocs,
  orderBy,
  where,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { UserType } from "./user";

// Define the ReviewReport type
export type ReviewReport = {
  id: string;
  reviewId: string;
  timeCreated: Timestamp;
  reason: string | null;
  comment?: string;
  user: {
    id: string;
    email: string;
    name: string;
    type: UserType;
  };
};

// Firestore data converter for ReviewReport
export const reviewReportConverter: FirestoreDataConverter<ReviewReport> = {
  toFirestore: (r: ReviewReport) => {
    const { id, ...report } = r;
    return report;
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    } as ReviewReport;
  },
};

const getReviewReport = async (
  id: string
): Promise<ReviewReport | undefined> => {
  const reportRef = doc(db, "reports", id).withConverter(reviewReportConverter);
  const snapshot = await getDoc(reportRef);

  return snapshot.exists() ? snapshot.data() : undefined;
};

const getReviewReports = async (): Promise<ReviewReport[]> => {
  const q = query(
    collection(db, "reports").withConverter(reviewReportConverter),
    orderBy("timeCreated", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

const getReviewReportsFromUser = async (
  uid: string
): Promise<ReviewReport[]> => {
  const q = query(
    collection(db, "reports").withConverter(reviewReportConverter),
    where("user.id", "==", uid)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

const createReviewReport = async (
  reviewReport: Partial<ReviewReport>
): Promise<void> => {
  const ref = doc(collection(db, "reports")).withConverter(
    reviewReportConverter
  );
  await setDoc(ref, { ...reviewReport, timeCreated: serverTimestamp() });
};

// Delete a report
const deleteReport = async (id: string): Promise<void> => {
  const ref = doc(db, `reports`, id);
  await deleteDoc(ref);
};

export {
  getReviewReport,
  getReviewReports,
  getReviewReportsFromUser,
  createReviewReport,
  deleteReport,
};
