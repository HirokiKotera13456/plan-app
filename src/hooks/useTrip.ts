import { useCallback, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Trip } from "@/src/lib/types";
import {
  INITIAL_TIMELINE,
  INITIAL_CHECKLIST,
  INITIAL_HOTELS,
  INITIAL_COSTS,
} from "@/src/lib/seed-data";

export function useTrips(userId: string | undefined) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const ref = collection(db, "trips");
    const q = query(ref, where("memberIds", "array-contains", userId));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Trip[];
    setTrips(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const createTrip = async (name: string, tripDate: string) => {
    if (!userId) return;
    const batch = writeBatch(db);

    const tripRef = doc(collection(db, "trips"));
    const inviteCode = Math.random().toString(36).substring(2, 10);
    batch.set(tripRef, {
      name,
      tripDate,
      inviteCode,
      createdBy: userId,
      memberIds: [userId],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const memberRef = doc(
      collection(db, "trips", tripRef.id, "members"),
      userId
    );
    batch.set(memberRef, {
      displayName: "",
      role: "owner",
      joinedAt: Timestamp.now(),
    });

    for (const item of INITIAL_TIMELINE) {
      const ref = doc(collection(db, "trips", tripRef.id, "timeline"));
      batch.set(ref, {
        ...item,
        isDone: false,
        note: "",
        createdBy: userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    for (const item of INITIAL_CHECKLIST) {
      const ref = doc(collection(db, "trips", tripRef.id, "checklist"));
      batch.set(ref, {
        ...item,
        isChecked: false,
        assignee: "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    for (const item of INITIAL_HOTELS) {
      const ref = doc(collection(db, "trips", tripRef.id, "hotels"));
      batch.set(ref, {
        ...item,
        createdAt: Timestamp.now(),
      });
    }

    for (const item of INITIAL_COSTS) {
      const ref = doc(collection(db, "trips", tripRef.id, "costs"));
      batch.set(ref, {
        ...item,
        createdAt: Timestamp.now(),
      });
    }

    await batch.commit();
    await fetchTrips();
    return tripRef.id;
  };

  const deleteTrip = async (tripId: string) => {
    await deleteDoc(doc(db, "trips", tripId));
    await fetchTrips();
  };

  return { trips, loading, createTrip, deleteTrip, refetch: fetchTrips };
}

export function useTripDetail(tripId: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrip = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    const snap = await getDoc(doc(db, "trips", tripId));
    if (snap.exists()) {
      setTrip({ id: snap.id, ...snap.data() } as Trip);
    }
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  const updateTrip = async (updates: Partial<Trip>) => {
    await updateDoc(doc(db, "trips", tripId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    await fetchTrip();
  };

  return { trip, loading, updateTrip, refetch: fetchTrip };
}
