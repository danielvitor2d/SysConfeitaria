import { Flex } from "@chakra-ui/react";

import full_background from "../../assets/full_background.svg";

interface MinimalLayoutProps {
  page: JSX.Element;
}

export default function MinimalLayout({ page }: MinimalLayoutProps) {
  return (
    <Flex
      backgroundImage={`url(${full_background})`}
      backgroundRepeat={"no-repeat"}
      backgroundSize={"cover"}
      width={"100vw"}
      height={"100vh"}
    >
      {page}
    </Flex>
  );
}
