import * as functions from "firebase-functions";
import * as postmark from "postmark";
import * as admin from "firebase-admin";

/**
 * Cloud function that triggers when a new report is created in the Firestore
 * `reports` collection.
 *
 * It performs the following steps:
 *
 * 1. Fetches the reviewer data from the `users` collection based on the
 * `userId` from the associated review.
 * 2. Updates the newly created report document with the reviewer's details
 * (email, ID, full name).
 * 3. Constructs and sends an email notification to the Reviucasa support
 * team with the report details.
 *
 * @function
 * @param {functions.firestore.QueryDocumentSnapshot} snapshot
 * @param {functions.EventContext} context
 * @returns {Promise<void>}
 **/
export const onReportCreated = functions
  .region("europe-west1")
  .firestore.document("reports/{reportId}")
  .onCreate(async (snapshot, context) => {
    const reportData = snapshot.data();

    try {
      const reviewerSnapshot = await admin
        .firestore()
        .collection("users")
        .doc(reportData.review.userId)
        .get();

      if (!reviewerSnapshot.exists) {
        console.error("Reviewer not found in the users collection");
        return;
      }

      const reviewerData = reviewerSnapshot.data();

      await snapshot.ref.update({
        reviewer: {
          email: reviewerData?.email,
          id: reviewerSnapshot.id,
          name: `${reviewerData?.name} ${reviewerData?.lastname}`,
        },
      });

      const location = reportData.review.location;
      const reviewLink = [
        "https://reviucasa.com/review",
        location.province,
        location.municipality,
        location.type,
        location.street,
        location.number,
        reportData.review.id,
      ].join("/");

      const emailContent = `
<html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 14px;
        text-decoration: none;
      }

      p {
        margin: 4px 0;
        text-decoration: none;
      }

      .email-container {
        background-color: #f5f2fe;
        padding: 10px 0 20px 0;
        text-align: center;
        width: 100%;
      }

      .email-content {
        background-color: #ffffff;
        border-radius: 24px;
        margin: 0px auto;
        padding: 16px;
        width: 60%;
      }

      .image {
        height: auto;
        max-width: 100%;
        display: block;
        margin: 20px auto;
      }

      @media (max-width: 900px) {
        .email-content {
          width: 90%;
        }
      }
    </style>
  </head>

  <body class="email-container">
    <img
      src="https://reviucasa.com/images/logo.png"
      alt="Reviucasa Logo"
      width="80"
      class="image"
    />
    <div class="email-content">
      <h3 style="font-size: 16px; font-weight: 600">🚨 New Report Created</h3>
      <div style="text-align: left; max-width: 400px; margin: 32px auto">
        <p><strong>Issuer Email:</strong> ${reportData.issuer.email}</p>
        <p>
          <strong>Issuer Name:</strong> 
          ${reportData.issuer.name}
        </p>
        <br />
        <p><strong>Report ID:</strong> ${context.params.reportId}</p>
        <p>
          <strong>Reason:</strong> 
          ${reportData.reason || "No reason specified"}
        </p>
        <p>
          <strong>Comment:</strong>
          ${reportData.comment || "No comment specified"}
        </p>
        <br />
        
        <p>
          <strong>Review ID:</strong> ${reportData.review.id}${" "} 
          <a target="_blank" href="${reviewLink}">(open review)</a>
        </p>
        <p><strong>Review Address:</strong> ${reportData.review.address}</p>

        <br />
        <p><strong>Reviewer Email:</strong> ${reviewerData?.email}</p>
        <p>
          <strong>Reviewer Name:</strong> 
          ${reviewerData?.name + " " + reviewerData?.lastname} 
        </p>
        
      </div>
      <a style="color: red; margin: 32px 0; text-decoration: none;" target="_blank" href="https://reviucasa.com/admin/reviews">
        Check the report and take the necessary actions by clicking here
      </a>
      <br/>
    </div>
  </body>
</html>
      `;

      // Send an email:
      const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

      // Send the email to info@reviucasa.com
      const response = await client.sendEmail({
        From: "noreply@reviucasa.com",
        To: "info@reviucasa.com",
        Subject: "New Report - " + reportData.review.address,
        HtmlBody: emailContent,
        MessageStream: "outbound",
      });

      await client.sendEmail({
        From: "noreply@reviucasa.com",
        To: "nicolau.farre@gmail.com",
        Subject: "New Report - " + reportData.review.address,
        HtmlBody: emailContent,
        MessageStream: "outbound",
      });

      console.log("New report email sent successfully:", response);
    } catch (error) {
      console.error("Error sending new report email:", error);
    }
  });
