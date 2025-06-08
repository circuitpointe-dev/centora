
export type StaffRole = "Review" | "Assign" | "Create" | "Approve" | "Process" | "Monitor";

export interface StaffMember {
  name: string;
  title: string;
  roles: StaffRole[];
}

export const staffData: StaffMember[] = [
  {
    name: "Chioma Ike",
    title: "NGO Manager",
    roles: ["Review", "Assign", "Create"],
  },
  {
    name: "Winnifred John",
    title: "Finance Manager",
    roles: ["Review", "Approve"],
  },
  {
    name: "Millicent Igwe",
    title: "Project Manager",
    roles: ["Assign", "Create", "Monitor"],
  },
  {
    name: "Richard Nwamadi",
    title: "Development Officer",
    roles: ["Create", "Monitor"],
  },
  {
    name: "Chinma Syliva",
    title: "Account Officer",
    roles: ["Process", "Approve"],
  },
];
