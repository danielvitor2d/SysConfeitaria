import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useContext, useState } from "react";

import ChapeuChef from "../../../assets/chapeu-de-chef-96.png";
import Left from "../../../assets/left-96.png";
import Right from "../../../assets/right-96.png";
import { ReactComponent as LogoHome } from "../../../assets/logo_home.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCake,
  faCartArrowDown,
  faGear,
  faPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../../contexts/AuthContext";

interface SidebarStateProp {
  mode: "open" | "close";
}

interface SidebarProps {
  
}

export default function Sidebar({ }: SidebarProps) {
  const [sidebarState, setSidebarState] = useState<SidebarStateProp>({
    mode: "open",
  });

  const { logout } = useContext(AuthContext)

  return (
    <Box
      left={0}
      top={0}
      height={"full"}
      width={sidebarState.mode == "open" ? "450px" : "70px"}
      backgroundColor={"#63342B"}
    >
      <VStack>
        <HStack height={"86px"} gap={10}>
          {sidebarState.mode == "open" && (
            <HStack gap={5}>
              <Image
                src={ChapeuChef}
                alt="Chapéu de Chef"
                height={"48px"}
                width={"48px"}
              />
              <Text
                fontFamily={"Inter"}
                fontWeight={"700"}
                fontStyle={"normal"}
                fontSize={"20px"}
                textColor={"white"}
              >
                SysConfeitaria
              </Text>
            </HStack>
          )}
          <Image
            src={sidebarState.mode == "close" ? Right : Left}
            alt="Seta"
            cursor={"pointer"}
            height={"30px"}
            width={"30px"}
            onClick={() => {
              setSidebarState(() => {
                const newSidebarState = {
                  mode: sidebarState.mode == "close" ? "open" : "close",
                } as SidebarStateProp;
                return newSidebarState;
              });
            }}
          />
        </HStack>
        <VStack 
          gap={5}
          width={'100%'}
        >
          {sidebarState.mode == "open" && (
            <VStack textAlign={"center"}>
              <LogoHome width={"60%"} style={{ margin: "0 auto" }} />
              <Text
                fontFamily={"Montserrat"}
                fontWeight={"500"}
                fontSize={"17px"}
                textColor={"#240F0B"}
              >
                {"Administrador".toUpperCase()}
              </Text>
              <Text
                width={"60%"}
                fontFamily={"Montserrat"}
                fontWeight={"500"}
                fontSize={"17px"}
                textColor={"#FFFFFF"}
              >
                {"Francina Barros Confeitaria".toUpperCase()}
              </Text>
            </VStack>
          )}
          <VStack width={"80%"}>
            <Button
              backgroundColor={"#EAC3AE"}
              borderRadius={sidebarState.mode == "open" ? "15px" : "full"}
              width={"80%"}
            >
              <HStack alignItems={"center"}>
                {sidebarState.mode == "open" && (
                  <Text
                    fontFamily={"Montserrat"}
                    fontWeight={"500"}
                    textColor={"#63342B"}
                    marginTop={"2px"}
                  >
                    {"Nova venda".toUpperCase()}
                  </Text>
                )}
                <Box height={"25px"} width={"25px"} textAlign={"center"}>
                  <FontAwesomeIcon
                    color={"#63342B"}
                    icon={faPlus}
                    fontSize={"25px"}
                  />
                </Box>
              </HStack>
            </Button>
          </VStack>
          <VStack
            width={"100%"}
            alignItems={sidebarState.mode == "open" ? "flex-start" : "center"}
          >
            <Flex
              width={'100%'}
              cursor={'pointer'}
              _hover={{
                backgroundColor: 'rgba(217, 217, 217, 0.19)',
              }}
              paddingY={'10px'}
              alignItems={'center'}
            >
              <HStack
                gap={4}
                justifyContent={sidebarState.mode == 'close' ? 'center' : undefined}
                alignItems={'center'}
                cursor={'pointer'}
                margin={'auto'}
                width={'80%'}
              >
                <Box height={"30px"} width={"30px"} textAlign={"center"}>
                  <FontAwesomeIcon
                    color={"#EAC3AE"}
                    icon={faCartArrowDown}
                    fontSize={"28px"}
                  />
                </Box>
                {sidebarState.mode == "open" && (
                  <Text
                    fontFamily={"Montserrat"}
                    fontStyle={"normal"}
                    fontWeight={"500"}
                    fontSize={"14px"}
                    textColor={"#FFFFFF"}
                  >
                    {"Vendas".toUpperCase()}
                  </Text>
                )}
              </HStack>
            </Flex>
            <Flex
              width={'100%'}
              cursor={'pointer'}
              _hover={{
                backgroundColor: 'rgba(217, 217, 217, 0.19)',
              }}
              paddingY={'10px'}
              alignItems={'center'}
            >
              <HStack
                gap={4}
                justifyContent={sidebarState.mode == 'close' ? 'center' : undefined}
                alignItems={'center'}
                cursor={'pointer'}
                margin={'auto'}
                width={'80%'}
              >
                <Box height={"30px"} width={"30px"} textAlign={"center"}>
                  <FontAwesomeIcon
                    color={"#EAC3AE"}
                    icon={faUsers}
                    fontSize={"28px"}
                  />
                </Box>
                {sidebarState.mode == "open" && (
                  <Text
                    fontFamily={"Montserrat"}
                    fontStyle={"normal"}
                    fontWeight={"500"}
                    fontSize={"14px"}
                    textColor={"#FFFFFF"}
                  >
                    {"Clientes".toUpperCase()}
                  </Text>
                )}
              </HStack>
            </Flex>
            <Flex
              width={'100%'}
              cursor={'pointer'}
              _hover={{
                backgroundColor: 'rgba(217, 217, 217, 0.19)',
              }}
              paddingY={'10px'}
              alignItems={'center'}
            >
              <HStack
                gap={4}
                justifyContent={sidebarState.mode == 'close' ? 'center' : undefined}
                alignItems={'center'}
                cursor={'pointer'}
                margin={'auto'}
                width={'80%'}
              >
                <Box height={"30px"} width={"30px"} textAlign={"center"}>
                  <FontAwesomeIcon
                    color={"#EAC3AE"}
                    icon={faCake}
                    fontSize={"28px"}
                  />
                </Box>
                {sidebarState.mode == "open" && (
                  <Text
                    fontFamily={"Montserrat"}
                    fontStyle={"normal"}
                    fontWeight={"500"}
                    fontSize={"14px"}
                    textColor={"#FFFFFF"}
                  >
                    {"Produtos".toUpperCase()}
                  </Text>
                )}
              </HStack>
            </Flex>
            <Flex
              width={'100%'}
              cursor={'pointer'}
              _hover={{
                backgroundColor: 'rgba(217, 217, 217, 0.19)',
              }}
              paddingY={'10px'}
              alignItems={'center'}
            >
              <HStack
                gap={4}
                justifyContent={sidebarState.mode == 'close' ? 'center' : undefined}
                alignItems={'center'}
                cursor={'pointer'}
                margin={'auto'}
                width={'80%'}
              >
                <Box height={"30px"} width={"30px"} textAlign={"center"}>
                  <FontAwesomeIcon
                    color={"#EAC3AE"}
                    icon={faGear}
                    fontSize={"28px"}
                  />
                </Box>
                {sidebarState.mode == "open" && (
                  <Text
                    fontFamily={"Montserrat"}
                    fontStyle={"normal"}
                    fontWeight={"500"}
                    fontSize={"14px"}
                    textColor={"#FFFFFF"}
                  >
                    {"Configurações".toUpperCase()}
                  </Text>
                )}
              </HStack>
            </Flex>
            <Divider width={'80%'} alignSelf={'center'} />
            <Flex
              width={'100%'}
              cursor={'pointer'}
              _hover={{
                backgroundColor: 'rgba(217, 217, 217, 0.19)',
              }}
              onClick={logout}
              paddingY={'10px'}
              alignItems={'center'}
            >
              <HStack
                gap={4}
                justifyContent={sidebarState.mode == 'close' ? 'center' : undefined}
                alignItems={'center'}
                cursor={'pointer'}
                margin={'auto'}
                width={'80%'}
              >
                <Box height={"30px"} width={"30px"} textAlign={"center"}>
                  <FontAwesomeIcon
                    color={"#EAC3AE"}
                    icon={faArrowRightFromBracket}
                    fontSize={"28px"}
                  />
                </Box>
                {sidebarState.mode == "open" && (
                  <Text
                    fontFamily={"Montserrat"}
                    fontStyle={"normal"}
                    fontWeight={"500"}
                    fontSize={"14px"}
                    textColor={"#FFFFFF"}
                  >
                    {"Sair".toUpperCase()}
                  </Text>
                )}
              </HStack>
            </Flex>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
}
