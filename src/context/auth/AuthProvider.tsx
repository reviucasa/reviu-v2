"use client";
import { auth } from "@/firebase/config";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

export const protectedUrls = [
  "/review",
  "/review/address",
  "/review/stay",
  "/review/valuation",
  "/review/opinion",
  "/review/management",
  "/review/community",
  "/review/neighbourhood",
  "/success",
  "/account",
];

interface AuthContextProps {
  user: FirebaseUser | null;
  initializing: boolean;
  children?: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  initializing: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUser(null);
        // User is signed out
        if (protectedUrls.includes(pathname)) {
          router.push("/auth/login");
        }
      } else if (user) {
        // User is signed in
        if (
          user.displayName ===
          null /* (user.metadata.creationTime === user.metadata.lastSignInTime) */
        ) {
          router.replace("/auth/register");
        }
        setUser(user);
        if (initializing) {
          setInitializing(false);
        }
        router.refresh();
        /* router.replace("/"); */
      }
    });

    return unsubscribe;
  }, [initializing, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};
