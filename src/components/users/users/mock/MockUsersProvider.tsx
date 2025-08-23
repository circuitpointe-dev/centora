// src/components/users/mock/MockUsersProvider.tsx
import * as React from "react";

export type MockUser = {
  id: string;
  full_name: string;
  email: string;
  status: "active" | "inactive" | "deactivated";
  department: string;
  modules: string[];
  roles: string[]; // legacy display
};

const seed: MockUser[] = [
  { id: "u_1", full_name: "Jane Doe", email: "jane@example.org", status: "active", department: "Finance", modules: ["Finance & Control", "Procurement"], roles: ["Finance Admin"] },
  { id: "u_2", full_name: "Ifeanyi Okafor", email: "ifeanyi@org.org", status: "inactive", department: "Human Resources", modules: ["HR Management"], roles: ["HR Viewer"] },
  { id: "u_3", full_name: "Mary Grant", email: "mary@ngo.org", status: "active", department: "Programmes", modules: ["Programme Management", "Documents Manager"], roles: ["Programme Owner"] },
];

type Ctx = {
  users: MockUser[];
  addUser: (u: MockUser) => void;
  updateUser: (u: MockUser) => void;
  removeUser: (id: string) => void;
  reset: (next?: MockUser[]) => void;
};

const MockUsersContext = React.createContext<Ctx | null>(null);

export const MockUsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = React.useState<MockUser[]>(seed);

  const addUser = (u: MockUser) => setUsers(prev => [u, ...prev]);
  const updateUser = (u: MockUser) => setUsers(prev => prev.map(x => (x.id === u.id ? u : x)));
  const removeUser = (id: string) => setUsers(prev => prev.filter(x => x.id !== id));
  const reset = (next?: MockUser[]) => setUsers(next ?? seed);

  return (
    <MockUsersContext.Provider value={{ users, addUser, updateUser, removeUser, reset }}>
      {children}
    </MockUsersContext.Provider>
  );
};

export const useMockUsers = () => {
  const ctx = React.useContext(MockUsersContext);
  if (!ctx) throw new Error("useMockUsers must be used within <MockUsersProvider>");
  return ctx;
};
