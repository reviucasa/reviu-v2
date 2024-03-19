import { doc, getDoc, Firestore } from "firebase/firestore";

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
