import Header from "./Components/Header";

interface MainlLayoutProps {
  page: JSX.Element;
}

export default function MainLayout({ page }: MainlLayoutProps) {
  return (
    <div>
      <Header />
      {page}
    </div>
  );
}
