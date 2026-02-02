import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)]">{children}</div>
    </>
  );
};
