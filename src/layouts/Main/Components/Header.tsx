import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

interface HeaderProps {
  page: React.ReactNode
}

export default function Header({ page }: HeaderProps) {
  return (
    <Flex
      height={'100vh'}
      width={'100vw'}
      backgroundColor={'#C9A795'}
    >
      <Sidebar />
      <Box
        left={0}
        width={'100%'}
      >
        <Box
          top={0}
          width={'100%'}
          height={"86px"}
          backgroundColor={"#482017"}
        />
        {page}
      </Box>
    </Flex>
  )
}
