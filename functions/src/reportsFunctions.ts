import * as functions from "firebase-functions";
import * as postmark from "postmark";

export const sendNewReportNotification = functions
  .region("europe-west1")
  .firestore.document("reports/{reportId}")
  .onCreate(async (snapshot, context) => {
    const reportData = snapshot.data();

    try {
      // Prepare the email content
      const emailContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: Helvetica, Arial, sans-serif;
                color: #161925;
                text-decoration: none;
              }
              .email-container {
                background-color: #f5f2fe;
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
                margin: 32px auto;
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
              width="100"
              class="image"
            />
            <div class="email-content">
              <h2 style="font-size: 24px; font-weight: 600">
                New Report Created
              </h2>
              <div style="justify-content: end; 
                          text-align:left; 
                          margin: 40px 60px
              ">
                <p>
                  <strong>Report ID:</strong> ${context.params.reportId}
                </p>
                <p>
                  <strong>Review ID:</strong> ${reportData.reviewId}
                </p>
                <p>
                  <strong>Reason:</strong> $
                  {reportData.reason || "No reason specified"}
                </p>
                <p>
                  <strong>Comment:</strong> $
                  {reportData.comment || "No comment specified"}
                </p>
                <br />
                <p>
                  <strong>Reporting User Email: </strong>
                  ${reportData.user.email}
                </p>
                <p>
                  <strong>Reporting User Name: </strong>
                  ${reportData.user.name}
                </p>
              </div>

              <p style="color:red; margin-bottom: 40px;">
                Check the report and take the necessary actions
              </p>
            </div>
          </body>
        </html>
      `;

      // Send an email:
      const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

      // Send the email to info@reviucasa.com
      const response = await client.sendEmail({
        From: "info@reviucasa.com",
        To: "nicolau.farre@gmail.com",
        Subject: "New Review Report Notification",
        HtmlBody: emailContent,
        MessageStream: "outbound",
      });

      console.log("New report email sent successfully:", response);
    } catch (error) {
      console.error("Error sending new report email:", error);
    }
  });
