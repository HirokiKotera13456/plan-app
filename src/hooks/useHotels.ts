import { useCallback, useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Hotel } from "@/src/lib/types";

export function useHotels(tripId: string) {
  const [items, setItems] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    const ref = collection(db, "trips", tripId, "hotels");
    const q = query(ref, orderBy("sortOrder"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Hotel[];
    setItems(data);
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item: Omit<Hotel, "id" | "createdAt">) => {
    const ref = collection(db, "trips", tripId, "hotels");
    await addDoc(ref, {
      ...item,
      createdAt: Timestamp.now(),
    });
    await fetchItems();
  };

  const updateItem = async (itemId: string, updates: Partial<Hotel>) => {
    const ref = doc(db, "trips", tripId, "hotels", itemId);
    await updateDoc(ref, updates);
    await fetchItems();
  };

  const deleteItem = async (itemId: string) => {
    const ref = doc(db, "trips", tripId, "hotels", itemId);
    await deleteDoc(ref);
    await fetchItems();
  };

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
}
