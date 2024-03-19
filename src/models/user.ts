import { db } from "@/firebase/config";
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
} from "firebase/firestore";

export type User = {
  acceptedTerms: boolean;
  birthday: string;
  country: string | null;
  dateAcceptedTerms: string | null;
  gender: string | null;
  id: string;
  lastname: string;
  name: string;
  subscribedToNewsletter: boolean;
};

/* class User {
  acceptedTerms: boolean;
  birthday: string;
  country: string;
  dateAcceptedTerms: string;
  email: string;
  gender: string;
  id: string;
  lastname: string;
  name: string;
  subscribedToNewsletter: boolean;

  constructor({
    acceptedTerms,
    birthday,
    country,
    dateAcceptedTerms,
    email,
    gender,
    id,
    lastname,
    name,
    subscribedToNewsletter,
  }: UserData) {
    this.acceptedTerms = acceptedTerms;
    this.birthday = birthday;
    this.country = country;
    this.dateAcceptedTerms = dateAcceptedTerms;
    this.email = email;
    this.gender = gender;
    this.id = id;
    this.lastname = lastname;
    this.name = name;
    this.subscribedToNewsletter = subscribedToNewsletter;
  }
} */

const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    return {
      name: user.name,
      lastname: user.lastname,
      country: user.country ?? null,
      gender: user.gender ?? null,
      birthday: user.birthday,
      acceptedTerms: user.acceptedTerms,
      dateAcceptedTerms: user.dateAcceptedTerms ?? null,
      subscribedToNewsletter: user.subscribedToNewsletter,
    };
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
  await setDoc(ref, user);

  /* const ref = collection(db, `users`).withConverter(userConverter);
  await addDoc(ref, user); */
};

// Retrieve a user
const getUser = async (uid: string): Promise<User | undefined> => {
  const ref = doc(db, `users/${uid}`).withConverter(userConverter);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : undefined;
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
  updateUser,
  deleteUser,
  searchUsers,
};
