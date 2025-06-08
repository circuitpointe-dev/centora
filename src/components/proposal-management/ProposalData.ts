
export interface ProposalTeamMember {
  img?: string;
  label: string;
  bg?: string;
}

export interface Proposal {
  id: string;
  name: string;
  dueDate: string;
  team: ProposalTeamMember[];
  reviewer: string;
}

export const reviewerOptions = [
  "Winifred John",
  "Somachi Okafor",
  "Chioma Ike",
  "Richard Nwamadi",
  "Amina Yusuf"
];

export const proposals: Proposal[] = [
  {
    id: "p1",
    name: "Water Sanitation Initiative",
    dueDate: "May 14",
    team: [
      { img: "https://randomuser.me/api/portraits/women/85.jpg", label: "A" },
      { img: "https://randomuser.me/api/portraits/men/62.jpg", label: "B" },
      { img: "https://randomuser.me/api/portraits/men/12.jpg", label: "C" },
    ],
    reviewer: "Winifred John",
  },
  {
    id: "p2",
    name: "Education Empowerment Plan",
    dueDate: "June 02",
    team: [
      { label: "SO", bg: "bg-[#aecbf7]" },
      { img: "https://randomuser.me/api/portraits/men/32.jpg", label: "WT" },
      { label: "WT", bg: "bg-[#f7aeae]" },
    ],
    reviewer: "Somachi Okafor",
  },
  {
    id: "p3",
    name: "UNICEF Youth Innovation Proposal",
    dueDate: "May 20",
    team: [
      { img: "https://randomuser.me/api/portraits/women/23.jpg", label: "A" },
      { img: "https://randomuser.me/api/portraits/women/34.jpg", label: "B" },
    ],
    reviewer: "Winifred John",
  },
  {
    id: "p4",
    name: "Agricultural Modernization Project",
    dueDate: "June 10",
    team: [
      { img: "https://randomuser.me/api/portraits/men/41.jpg", label: "A" },
      { img: "https://randomuser.me/api/portraits/men/52.jpg", label: "B" },
      { img: "https://randomuser.me/api/portraits/men/53.jpg", label: "C" },
      { img: "https://randomuser.me/api/portraits/women/72.jpg", label: "D" },
    ],
    reviewer: "Winifred John",
  },
  {
    id: "p5",
    name: "Health Systems Strengthening",
    dueDate: "May 24",
    team: [
      { label: "SO", bg: "bg-[#aecbf7]" },
      { img: "https://randomuser.me/api/portraits/women/67.jpg", label: "B" },
      { label: "WT", bg: "bg-[#f7aeae]" },
    ],
    reviewer: "Somachi Okafor",
  },
  {
    id: "p6",
    name: "Public Sector Reform Strategy",
    dueDate: "June 18",
    team: [
      { img: "https://randomuser.me/api/portraits/women/25.jpg", label: "A" },
      { img: "https://randomuser.me/api/portraits/women/31.jpg", label: "B" },
      { img: "https://randomuser.me/api/portraits/men/21.jpg", label: "C" },
    ],
    reviewer: "Winifred John",
  }
];
