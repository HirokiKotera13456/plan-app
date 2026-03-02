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
import { TimelineItem } from "@/src/lib/types";

export function useTimeline(tripId: string) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    const ref = collection(db, "trips", tripId, "timeline");
    const q = query(ref, orderBy("sortOrder"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as TimelineItem[];
    setItems(data);
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item: Omit<TimelineItem, "id" | "createdAt" | "updatedAt">) => {
    const ref = collection(db, "trips", tripId, "timeline");
    await addDoc(ref, {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    await fetchItems();
  };

  const updateItem = async (itemId: string, updates: Partial<TimelineItem>) => {
    const ref = doc(db, "trips", tripId, "timeline", itemId);
    await updateDoc(ref, { ...updates, updatedAt: Timestamp.now() });
    await fetchItems();
  };

  const deleteItem = async (itemId: string) => {
    const ref = doc(db, "trips", tripId, "timeline", itemId);
    await deleteDoc(ref);
    await fetchItems();
  };

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
}
