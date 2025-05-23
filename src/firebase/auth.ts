import {
  deleteUser,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  updateProfile,
} from "firebase/auth";
import { auth } from "./config";
import { useTranslations } from "next-intl";

export async function updateAuthUser(displayName: string) {
  try {
    await updateProfile(auth.currentUser!, {
      displayName,
    });
  } catch (error: any) {
    console.error("Error updating user", error);
  }
}

export async function deleteAuthUser() {
  if (auth.currentUser)
    try {
      await deleteUser(auth.currentUser!);
    } catch (error: any) {
      console.error("Error updating user", error);
    }
}

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: "http://localhost:3000/",
  // This must be true.
  handleCodeInApp: true,
};

export async function sendSignInLink(email: string) {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("email", email);
  } catch (error: any) {
    console.error("Error signing in with email link", error);
  }
}

export const verifyEmailLinkAndAuthenticate = async (t : ReturnType<typeof useTranslations>) => {
  const continueUrl = window.location.href;
  try {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("email");
      if (!email) {
        email = window.prompt(t("authCheck.provideEmail"));
      }
      const credentials = await signInWithEmailLink(auth, email!, continueUrl);
      window.localStorage.removeItem("email");
      return credentials;
    }
  } catch (error) {
    console.log(error);
  }
};

export async function signOut() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
