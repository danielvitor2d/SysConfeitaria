import { ReactNode } from "react";
import Header from "./Components/Header";

interface MainlLayoutProps {
  page: ReactNode;
}

export default function MainLayout({ page }: MainlLayoutProps) {
  return (
    <div>
      <Header page={page} />
    </div>
  )
}
