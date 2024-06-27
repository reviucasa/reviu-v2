import { db } from "@/firebase/config";
import { normalizeString } from "@/helpers/normalizeString";
import {
  Timestamp,
  FirestoreDataConverter,
  doc,
  getDoc,
  collection,
  query,
  getDocs,
  orderBy,
  setDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export enum PostStatus {
  active = "active",
  archived = "archived",
}

// Define the Post type
export type Post = {
  id: string;
  translations: {
    ca: {
      title: string;
      subtitle: string | null;
      content: string;
    };
    es: {
      title: string;
      subtitle: string | null;
      content: string;
    };
    en: {
      title: string;
      subtitle: string | null;
      content: string;
    };
  };
  timeCreated: Timestamp;
  timeUpdated?: Timestamp;
  imageUrl: string;
  status?: PostStatus;
};

// Firestore data converter for Post
export const postConverter: FirestoreDataConverter<Post> = {
  toFirestore: (p: Post) => {
    const { id, ...post } = p;
    return post;
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    } as Post;
  },
};

const getPost = async (id: string): Promise<Post | undefined> => {
  const reportRef = doc(db, "posts-test", id).withConverter(postConverter);
  const snapshot = await getDoc(reportRef);
  return snapshot.exists() ? snapshot.data() : undefined;
};

const getPosts = async (): Promise<Post[]> => {
  const q = query(
    collection(db, "posts-test").withConverter(postConverter),
    orderBy("timeCreated", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

const createPost = async (post: Partial<Post>): Promise<void> => {
  const postId = normalizeString(
    post.translations!.ca.title!.toLowerCase().replaceAll(" ", "-")
  );
  const ref = doc(collection(db, `posts-test`), postId).withConverter(
    postConverter
  );
  await setDoc(ref, {
    ...post,
    timeCreated: serverTimestamp(),
  });
};

const updatePost = async (
  id: string,
  updatedFields: Partial<Post>
): Promise<void> => {
  const ref = doc(db, `posts/${id}`).withConverter(postConverter);
  await updateDoc(ref, updatedFields);
};

// Delete a report
const deletePost = async (id: string): Promise<void> => {
  const ref = doc(db, "posts", id);
  await deleteDoc(ref);
};

export { getPost, getPosts, createPost, updatePost, deletePost };
