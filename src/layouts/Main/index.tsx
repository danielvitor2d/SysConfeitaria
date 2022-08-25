import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

interface MainlLayoutProps {
  page: ReactNode;
}

export default function MainLayout({ page }: MainlLayoutProps) {
  return (
    <Flex height={"100vh"} width={"auto"} backgroundColor={"#C9A795"}>
      <Sidebar />
      <Flex
        height={"100vh"}
        width={"100%"}
        flexDirection={"column"}
        overflow={"auto"}
      >
        <Header />
        {page}
      </Flex>
    </Flex>
  );
}
