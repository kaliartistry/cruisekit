/** Group member role */
export type GroupRole = "organizer" | "member";

/** Group member */
export interface GroupMember {
  userId: string;
  displayName: string;
  email: string;
  role: GroupRole;
  joinedAt: string;
  documentsComplete: boolean;
}

/** Group trip */
export interface Group {
  id: string;
  name: string;
  createdBy: string;
  inviteCode: string;
  members: Record<string, GroupMember>;
  tripDetails: {
    cruiseLine: string;
    ship: string;
    sailDate: string;
    duration: number;
    ports: string[];
  };
  createdAt: string;
}

/** Poll in a group */
export interface Poll {
  id: string;
  groupId: string;
  question: string;
  options: {
    text: string;
    votes: string[];
  }[];
  createdBy: string;
  allowMultiple: boolean;
  closedAt: string | null;
  createdAt: string;
}

/** Shared expense */
export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  category: "excursion" | "dining" | "transport" | "accommodation" | "other";
  settled: boolean;
  createdAt: string;
}
