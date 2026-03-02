import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Member } from "@/src/lib/types";

export function useMembers(tripId: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    const ref = collection(db, "trips", tripId, "members");
    const snapshot = await getDocs(ref);
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Member[];
    setMembers(data);
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, refetch: fetchMembers };
}
