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
import { Cost } from "@/src/lib/types";

export function useCosts(tripId: string) {
  const [items, setItems] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    const ref = collection(db, "trips", tripId, "costs");
    const q = query(ref, orderBy("sortOrder"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Cost[];
    setItems(data);
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item: Omit<Cost, "id" | "createdAt">) => {
    const ref = collection(db, "trips", tripId, "costs");
    await addDoc(ref, {
      ...item,
      createdAt: Timestamp.now(),
    });
    await fetchItems();
  };

  const updateItem = async (itemId: string, updates: Partial<Cost>) => {
    const ref = doc(db, "trips", tripId, "costs", itemId);
    await updateDoc(ref, updates);
    await fetchItems();
  };

  const deleteItem = async (itemId: string) => {
    const ref = doc(db, "trips", tripId, "costs", itemId);
    await deleteDoc(ref);
    await fetchItems();
  };

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
}
