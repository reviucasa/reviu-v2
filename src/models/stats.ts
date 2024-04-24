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
  startAt,
} from "firebase/firestore";

export type WeeklyStats = {
  documentId: string;
  reviewsCount: number;
  reviewsWeekly: number;
  usersCount: number;
  usersWeekly: number;
  reportsCount: number;
  reportsWeekly: number;
  timestamp: Timestamp;
};

const weeklyStatsConverter: FirestoreDataConverter<WeeklyStats> = {
  toFirestore(s: WeeklyStats): DocumentData {
    const { documentId, ...stats } = s;
    return stats;
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): WeeklyStats {
    const data = snapshot.data();
    return {
      documentId: snapshot.id,
      ...data,
    } as WeeklyStats;
  },
};

// Retrieve a building by ID
const getWeeklyStats = async (
  isoDate: string
): Promise<WeeklyStats | undefined> => {
  const ref = doc(db, `stats/*/weekly/${isoDate}`).withConverter(
    weeklyStatsConverter
  );
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : undefined;
};

const getAllWeeklyStats = async (): Promise<WeeklyStats[]> => {
  const q = query(
    collection(db, "stats/*/weekly").withConverter(weeklyStatsConverter),
    orderBy("timestamp", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

export { getAllWeeklyStats, getWeeklyStats };
