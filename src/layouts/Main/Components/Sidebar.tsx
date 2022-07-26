import { Box, Button, Flex, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import ChapeuChef from "../../../assets/chapeu-de-chef-96.png";
import Left from "../../../assets/left-96.png";
import Right from "../../../assets/right-96.png";
import Produtos from "../../../assets/produtos.png"
import { ReactComponent as Clients } from "../../../assets/clientes.svg"
import { ReactComponent as Settings } from "../../../assets/settings.svg"
import { ReactComponent as Vendas } from "../../../assets/vendas.svg"
import { ReactComponent as Logout } from "../../../assets/logout.svg"
import { ReactComponent as IconPlus } from "../../../assets/icon_plus.svg"
import { ReactComponent as LogoHome } from "../../../assets/logo_home.svg"

interface SidebarStateProp {
  mode: "open" | "close";
}

export default function Sidebar() {
  const [sidebarState, setSidebarState] = useState<SidebarStateProp>({
    mode: "open",
  });

  return (
    <Box
      left={0}
      top={0}
      height={"full"}
      width={sidebarState.mode == "open" ? "450px" : "70px"}
      backgroundColor={"#63342B"}
    >
      <VStack>
        <HStack height={'86px'} gap={10}>
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
            src={sidebarState.mode == 'close' ? Right : Left}
            alt="Seta"
            cursor={'pointer'}
            height={"30px"}
            width={"30px"}
            onClick={() => {
              setSidebarState(() => {
                const newSidebarState = {
                  mode: sidebarState.mode == "close" ? "open" : "close",
                } as SidebarStateProp
                return newSidebarState
              })
            }}
          />
        </HStack>
        <VStack gap={5}>
          <VStack textAlign={'center'} >
            <LogoHome
              width={'60%'}
              style={{ margin: '0 auto' }}
            />
            <Text
              fontFamily={'Montserrat'}
              fontWeight={'500'}
              fontSize={'17px'}
              textColor={'#240F0B'}
            >
              {'Administrador'.toUpperCase()}
            </Text>
            <Text
              width={'60%'}
              fontFamily={'Montserrat'}
              fontWeight={'500'}
              fontSize={'17px'}
              textColor={'#FFFFFF'}
            >
              {'Francina Barros Confeitaria'.toUpperCase()}
            </Text>
          </VStack>
          <Flex
            width={'100%'}
          >
            <Button
              backgroundColor={'#EAC3AE'}
              borderRadius={'15px'}
              margin={'auto'}
              width={'65%'}
            >
              <HStack
                alignItems={'center'}
              >
                <Text
                  fontFamily={'Montserrat'}
                  fontWeight={'500'}
                  textColor={'#63342B'}
                  marginTop={'2px'}
                >
                  {'Nova venda'.toUpperCase()}
                </Text>
                <IconPlus />
              </HStack>
            </Button>
          </Flex>
          <VStack
            gap={3}
            width={'80%'}
            alignItems={'flex-start'}
          >
            <HStack gap={4}>
              <Vendas />
              <Text
                fontFamily={'Montserrat'}
                fontStyle={'normal'}
                fontWeight={'500'}
                fontSize={'14px'}
                textColor={'#FFFFFF'}
              >
                {'Vendas'.toUpperCase()}
              </Text>
            </HStack>
            <HStack gap={4}>
              <Clients />
              <Text
                fontFamily={'Montserrat'}
                fontStyle={'normal'}
                fontWeight={'500'}
                fontSize={'14px'}
                textColor={'#FFFFFF'}
              >
                {'Clientes'.toUpperCase()}
              </Text>
            </HStack>
            <HStack gap={4}>
              <Image 
                src={Produtos}
                width={'30px'}
                alt={"Imagem de um bolo"}
              />
              <Text
                fontFamily={'Montserrat'}
                fontStyle={'normal'}
                fontWeight={'500'}
                fontSize={'14px'}
                textColor={'#FFFFFF'}
              >
                {'Produtos'.toUpperCase()}
              </Text>
            </HStack>
            <HStack gap={4}>
              <Settings />
              <Text
                fontFamily={'Montserrat'}
                fontStyle={'normal'}
                fontWeight={'500'}
                fontSize={'14px'}
                textColor={'#FFFFFF'}
              >
                {'Produtos'.toUpperCase()}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
      <HStack 
        gap={4}
        marginTop={'220px'}
        marginX={'15%'}
        bottom={0}
      >
        <Logout
          width={'26px'}
          height={'26px'}
        />
        <Text
          fontFamily={'Montserrat'}
          fontStyle={'normal'}
          fontWeight={'500'}
          fontSize={'14px'}
          textColor={'#FFFFFF'}
        >
          {'Sair'.toUpperCase()}
        </Text>
      </HStack>
    </Box>
  )
}
