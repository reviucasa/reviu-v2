import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {CollectionReference, QuerySnapshot} from "firebase-admin/firestore";

export const computeWeeklyStats = functions
  .region("europe-west1")
  .pubsub.schedule("0 0 * * 1") // Runs at 00:00 every Monday
  .timeZone("Europe/Madrid")
  .onRun(async () => {
    const reviewsRef = admin.firestore().collection("reviews");
    const reviewsSnapshot = await fetchDocumentsFromLastWeek(reviewsRef);
    const reviewsCount = await reviewsRef.count().get();

    const usersRef = admin.firestore().collection("users");
    const usersSnapshot = await fetchDocumentsFromLastWeek(usersRef);
    const usersCount = await usersRef.count().get();

    const reportsRef = admin.firestore().collection("reports");
    const reportsSnapshot = await fetchDocumentsFromLastWeek(reportsRef);
    const reportsCount = await reportsRef.count().get();

    const stats = {
      reviewsCount,
      usersCount,
      reportsCount,
      reviewsWeekly: reviewsSnapshot.size,
      usersWeekly: usersSnapshot.size,
      reportsWeekly: reportsSnapshot.size,
    };

    // Generate a unique document ID based on the current date
    const statsId = `${new Date().toISOString().split("T")[0]}`;
    // Save the computed statistics
    const statsRef = admin
      .firestore()
      .collection("stats/*/weekly")
      .doc(statsId);
    await statsRef.set({
      ...stats,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

/**
 * Fetches documents from the specified Firestore collection where the
 * `timeCreated` field is within the last week. This function calculates
 * the date one week ago from the current date and uses this to filter
 * documents based on their creation time.
 *
 * @param {CollectionReference} ref - The Firestore collection reference
 * @return {Promise<QuerySnapshot>} A promise resolving with a QuerySnapshot
 */
async function fetchDocumentsFromLastWeek(
  ref: CollectionReference
): Promise<QuerySnapshot> {
  // Calculate the date one week ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Subtract 7 days

  // Convert JavaScript Date to Firestore Timestamp
  const oneWeekAgoTimestamp = admin.firestore.Timestamp.fromDate(oneWeekAgo);

  // Get snapshot
  const snapshot = await ref
    .where("timeCreated", ">=", oneWeekAgoTimestamp)
    .get();

  return snapshot;
}
