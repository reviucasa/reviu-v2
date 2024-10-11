"use client";
import { removeLocaleFromPath } from "@/components/atoms/DropDownLanguages";
import { auth } from "@/firebase/config";
import { UserStatus } from "@/models/user";
import {
  User as FirebaseUser,
  ParsedToken,
  getIdTokenResult,
  onAuthStateChanged,
} from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

export const protectedUrls = [
  "/newReview",
  "/newReview/address",
  "/newReview/stay",
  "/newReview/valuation",
  "/newReview/opinion",
  "/newReview/management",
  "/newReview/community",
  "/newReview/neighbourhood",
  "/success",
  "/account",
];

export const adminUrls = [
  "/admin",
  "/admin/reviews",
  "/admin/reviews/suspended",
  "/admin/reviews/reported",
  "/admin/users",
  "/admin/blog",
  "/admin/blog/new",
];

interface AuthContextProps {
  user: FirebaseUser | null;
  initializing: boolean;
  claims: any;
  children?: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  initializing: true,
  claims: {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [claims, setClaims] = useState<ParsedToken>();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        // User is signed out
        if (adminUrls.includes(removeLocaleFromPath(pathname))) {
          router.replace("/");
          return;
        }
        if (protectedUrls.includes(removeLocaleFromPath(pathname))) {
          router.push("/auth/login");
        }
      } else if (user) {
        const tokenResult = await getIdTokenResult(user);
        setClaims(tokenResult.claims);

        if (
          tokenResult.claims.status == UserStatus.Suspended &&
          (adminUrls.includes(removeLocaleFromPath(pathname)) ||
            protectedUrls.includes(removeLocaleFromPath(pathname)))
        ) {
          /* await auth.signOut(); */
          router.replace("/suspended");
          return;
        }

        if (
          tokenResult.claims.admin != true &&
          adminUrls.includes(removeLocaleFromPath(pathname))
        ) {
          router.replace("/");
          return;
        }
        // User is signed in
        if (
          user.displayName ===
          null /* (user.metadata.creationTime === user.metadata.lastSignInTime) */
        ) {
          router.replace("/auth/register");
        }
        setUser(user);

        /* router.refresh(); */
        /* router.replace("/"); */
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, initializing, claims }}>
      {children}
    </AuthContext.Provider>
  );
};
