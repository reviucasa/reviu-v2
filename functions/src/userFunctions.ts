import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const addCustomClaim = functions
  .region("europe-west1")
  .https.onCall(
    async (
      data: {email: string; claims: {[key: string]: any}},
      context: functions.https.CallableContext
    ) => {
      // Ensure the user is authenticated
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "Request not authenticated"
        );
      }

      // Check if the request is made by an admin
      if (!context.auth.token.admin) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only admins can add or update claims"
        );
      }

      try {
        // Get the user by email
        const user = await admin.auth().getUserByEmail(data.email);
        // Prepare new custom claims object
        const newCustomClaims = {...user.customClaims, ...data.claims};
        // Update the user's custom claims
        await admin.auth().setCustomUserClaims(user.uid, newCustomClaims);
        // Revoke user current session
        await admin.auth().revokeRefreshTokens(user.uid);

        return {
          message: `Custom claims updated successfully for ${data.email}.`,
        };
      } catch (err: any) {
        console.error("Error updating custom claims:", err);
        throw new functions.https.HttpsError("internal", err.message);
      }
    }
  );
