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
import { ChecklistItem } from "@/src/lib/types";

export function useChecklist(tripId: string) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    const ref = collection(db, "trips", tripId, "checklist");
    const q = query(ref, orderBy("sortOrder"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as ChecklistItem[];
    setItems(data);
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item: Omit<ChecklistItem, "id" | "createdAt" | "updatedAt">) => {
    const ref = collection(db, "trips", tripId, "checklist");
    await addDoc(ref, {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    await fetchItems();
  };

  const updateItem = async (itemId: string, updates: Partial<ChecklistItem>) => {
    const ref = doc(db, "trips", tripId, "checklist", itemId);
    await updateDoc(ref, { ...updates, updatedAt: Timestamp.now() });
    await fetchItems();
  };

  const deleteItem = async (itemId: string) => {
    const ref = doc(db, "trips", tripId, "checklist", itemId);
    await deleteDoc(ref);
    await fetchItems();
  };

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
}
