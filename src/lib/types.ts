import { Timestamp } from "firebase/firestore";

export interface Trip {
  id: string;
  name: string;
  tripDate: string;
  inviteCode: string;
  createdBy: string;
  memberIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Member {
  id: string;
  displayName: string;
  role: "owner" | "member";
  joinedAt: Timestamp;
}

export interface TimelineItem {
  id: string;
  timeStart: string;
  timeEnd: string;
  title: string;
  subtitle: string;
  icon: string;
  category: "transport" | "attraction" | "meal";
  note: string;
  isDone: boolean;
  sortOrder: number;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChecklistItem {
  id: string;
  text: string;
  detail: string;
  isChecked: boolean;
  assignee: string;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Hotel {
  id: string;
  name: string;
  note: string;
  prices: Record<string, string>;
  sortOrder: number;
  createdAt: Timestamp;
}

export interface Cost {
  id: string;
  label: string;
  amountMin: number;
  amountMax: number | null;
  sortOrder: number;
  createdAt: Timestamp;
}
