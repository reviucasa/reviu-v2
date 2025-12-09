import { db } from "@/firebase/config";
import { getDocumentsByIds } from "@/firebase/helpers";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  collection,
  where,
  query,
  getDocs,
  setDoc,
  Timestamp,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from "firebase/firestore";

export enum UserStatus {
  Active = "active",
  Suspended = "suspended",
}

export enum UserType {
  User = "user",
  Agency = "agency",
  Admin = "admin",
}

export type User = {
  acceptedTerms: boolean;
  birthday: string;
  country: string | null;
  dateAcceptedTerms: string | null;
  gender: string | null;
  id: string;
  email: string;
  lastname: string;
  name: string;
  status: UserStatus;
  type: UserType;
  subscribedToNewsletter: boolean;
  timeCreated: Timestamp;
};

const userConverter: FirestoreDataConverter<User> = {
  toFirestore(u: User): DocumentData {
    const { id, ...user } = u;
    return user;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): User {
    const data = snapshot.data();
    return {
      ...data,
      id: snapshot.id,
    } as User;
  },
};

// Create a new user
const createUser = async (uid: string, user: Partial<User>): Promise<void> => {
  const ref = doc(db, `users/${uid}`).withConverter(userConverter); // Get a reference to the document with the specific ID
  const data = {
    ...user,
    status: UserStatus.Active,
    type: UserType.User,
    timeCreated: serverTimestamp(),
  };
  await setDoc(ref, data);
};

// Retrieve a user
const getUser = async (uid: string): Promise<User | undefined> => {
  const ref = doc(db, `users/${uid}`).withConverter(userConverter);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : undefined;
};

const getUsersById = async (uids: string[]): Promise<User[]> => {
  const users = await getDocumentsByIds<User>(db, "users", userConverter, uids);
  return users;
};

// Retrieve users
const getUsers = async ({
  count,
  startAfterTime,
}: {
  count?: number;
  startAfterTime?: Timestamp | null;
}): Promise<User[]> => {
  const ref = collection(db, `users`).withConverter(userConverter);
  let q = query(ref);

  // Conditionally add a limit
  if (count) {
    q = query(q, orderBy("timeCreated", "desc"), limit(count));
  }

  if (startAfterTime) {
    q = query(q, startAfter(startAfterTime));
  }

  return getDocs(q)
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No users.");
        return [];
      }
      return snapshot.docs.map((doc) => doc.data());
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      return [];
    });
};

// Update an existing user
const updateUser = async (
  userId: string,
  updatedFields: Partial<User>
): Promise<void> => {
  const ref = doc(db, `users/${userId}`).withConverter(userConverter);
  await updateDoc(ref, updatedFields);
};

// Delete a user
const deleteUser = async (userId: string): Promise<void> => {
  const ref = doc(db, `users/${userId}`);
  await deleteDoc(ref);
};

const searchUsers = async (text: string): Promise<User[]> => {
  const ref = collection(db, "users").withConverter(userConverter);
  const q = query(ref, where("username", ">=", text));

  return getDocs(q)
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching users.");
        return [];
      }
      return snapshot.docs.map((doc) => doc.data());
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      return [];
    });
};

export {
  userConverter,
  createUser,
  getUser,
  getUsers,
  getUsersById,
  updateUser,
  deleteUser,
  searchUsers,
};
