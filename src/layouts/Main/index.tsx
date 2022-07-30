import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";

interface MainlLayoutProps {
  page: ReactNode;
}

export default function MainLayout({ page }: MainlLayoutProps) {
  return (
    <Flex
      height={"100vh"}
      width={"100%"}
      overflow={"auto"}
      backgroundColor={"#C9A795"}
    >
      <Sidebar />
      <Flex width={"100%"} flexDirection={"column"}>
        <Header />
        {page}
      </Flex>
    </Flex>
  );
}
