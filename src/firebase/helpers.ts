import { doc, getDoc, Firestore } from "firebase/firestore";
import { storage } from "./config";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export async function getDocumentsByIds<T>(
  firestore: Firestore,
  collectionPath: string,
  ids: string[]
): Promise<T[]> {
  const promises = ids.map((id) => {
    const docRef = doc(firestore, collectionPath, id);
    return getDoc(docRef);
  });

  const documents = await Promise.all(promises);
  return documents
    .filter((docSnapshot) => docSnapshot.exists())
    .map((docSnapshot) => docSnapshot.data() as T);
}

export async function uploadImage(
  imageData: string,
  path: string
): Promise<string> {
  const imageRef = ref(storage, path);
  await uploadString(imageRef, imageData, "data_url");
  const url = await getDownloadURL(imageRef);
  return url;
}
