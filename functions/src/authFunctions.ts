import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as postmark from "postmark";
import {MessageSendingResponse} from "postmark/dist/client/models";
import translations from "./translations";

export const sendSignInLinkToEmail = functions
  .region("europe-west1")
  .https.onCall(async (data) => {
    const {email, locale, url} = data;

    const actionCodeSettings = {
      // URL must be in the authorized domains list in the Firebase Console.
      url:
        url ||
        "https://reviu.vercel.app/" /* "https://reviu-git-admin-dashboard-and-improvements-nicolaufs-projects.vercel.app/" */ /* "https://reviu-git-dev-nicolaufs.vercel.app" */ /* "https://reviu.vercel.app/" */ /* http://localhost:3000/ */ /* "https://www.reviucasa.com/", */,
      // This must be true.
      handleCodeInApp: true,
    };

    return admin
      .auth()
      .generateSignInWithEmailLink(email, actionCodeSettings)
      .then((link) => {
        return sendSignInEmail(email, locale, link);
      })
      .catch((error) => {
        console.error("Error sending sign-in email link: ", error);
        throw new functions.https.HttpsError(
          "unknown",
          "Failed to send sign-in link"
        );
      });
  });

/**
 * Asynchronously sends a sign-in email to the specified user
 * with a unique sign-in link.
 *
 * The email includes a custom HTML template featuring a primary
 * call-to-action button that directs the user to the sign-in
 * page using the provided link.
 *
 * @param {string} email - The email address of the recipient.
 * @param {string} locale - Locale in which the mail will be sent
 * @param {string} link - The unique sign-in link embedded in
 * the email.
 * @return {Promise<MessageSendingResponse>} Resolves when the email is
 * successfully sent or rejects with an error.
 *
 * @example
 * await sendSignInEmail(
 *  'user@example.com',
 *  'en',
 *  'https://example.com/auth?token=abc123'
 * );
 */
async function sendSignInEmail(
  email: string,
  locale: string,
  link: string
): Promise<MessageSendingResponse> {
  // Default to English if the provided locale is not supported
  const translation = translations[locale] || translations["en"];

  const htmlContent = `
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
        .btn-primary {
          background-color: #124a36;
          width: 120px;
          color: #ffffff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: block;
          margin: 40px auto;
        }
        .signin-link {
          color: #9e80f7;
          text-decoration: underline;
          font-size: 12px;
          max-width: 400px;
          margin: 20px auto;
          word-break: break-all;
        }
        .image {
          height: auto;
          max-width: 100%;
          display: block;
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
        src="https://reviu.vercel.app/images/logo.png"
        alt="Check Email"
        width="120"
        style="margin: 20px auto"
      />
      <div class="email-content">
        <h2 style="font-size: 28px; font-weight: 600">
          ${translation.welcome}
        </h2>
        <p>${translation.clickComment}</p>
        <a href="${link}" style="color: white" class="btn-primary"
          >${translation.signIn}</a
        >
        <img
          src="https://reviu.vercel.app/images/check-email2.png"
          alt="Check Email"
          width="120"
          style="margin: 0px auto 32px auto; padding-left: 14px"
        />
        <!--  <p style="padding: 0 24px; max-width: 400px; margin: 0 auto">
          ${translation.copyComment}
        </p>  -->
        <!-- <p class="signin-link" style="padding-top: 0px;">${link}</p> -->
      </div>
      <div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div style="display: flex; margin: 20px auto">
            <a
              href="https://www.instagram.com/reviu_casa"
              target="_blank"
              rel="nofollow noreferrer"
            >
              <div
                style="
                  width: 32px;
                  height: 32px;
                  background-color: #719286;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 15px;
                "
              >
                <img
                  src="https://reviu.vercel.app/images/IconInstagram.png"
                  alt="icon instagram"
                  style="height: auto; width: 36px"
                />
              </div>
            </a>
            <a
              href="https://twitter.com/reviu_casa"
              target="_blank"
              rel="nofollow noreferrer"
            >
              <div
                style="
                  width: 32px;
                  height: 32px;
                  background-color: #719286;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <img
                  src="https://reviu.vercel.app/images/IconTwitter.png"
                  alt="icon twitter"
                  style="height: auto; width: 36px"
                />
              </div>
            </a>
            <a
              href="https://www.tiktok.com/@reviu_casa"
              target="_blank"
              rel="nofollow noreferrer"
            >
              <div
                style="
                  width: 32px;
                  height: 32px;
                  background-color: #719286;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-left: 15px;
                "
              >
                <img
                  src="https://reviu.vercel.app/images/IconTikTok.png"
                  alt="icon tiktok"
                  style="height: auto; width: 36px"
                />
              </div>
            </a>
          </div>
        </div>
        <p style="
          color: #b5b2be !important;
          padding: 0 0 20px 0;
          text-decoration: none;
          "
        >
          reviucasa
        </p>
      </div>
    </body>
  </html>
`;

  // Send an email:
  const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

  const res = await client
    .sendEmail({
      From: "info@reviucasa.com",
      To: email,
      Subject: translation.subject,
      HtmlBody: htmlContent,
      MessageStream: "outbound",
    })
    .then((response) => {
      console.log("Sending message to", response.To);
      return response;
    });

  return res;
}
