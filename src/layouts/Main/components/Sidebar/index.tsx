import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Image,
  Kbd,
  Text,
  Tooltip,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";

import { useContext, useEffect, useState } from "react";

import ChapeuChef from "../../../../assets/chapeu-de-chef-96.png";
import { ReactComponent as LogoHome } from "../../../../assets/logo_home.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCake,
  faCartArrowDown,
  faChevronLeft,
  faChevronRight,
  faGear,
  faPlus,
  faUsers,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SidebarStateProp {
  mode: "open" | "close";
}

type SidebarType = {
  key: string;
  route: string;
  title: string;
  icon: IconDefinition;
  onClick?: () => void;
  precedesDivider?: boolean;
  shortcut?: string[];
};

export default function Sidebar() {
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown, true);
    return () => document.removeEventListener("keydown", detectKeyDown);
  }, []);

  const detectKeyDown = (ev: KeyboardEvent) => {
    // console.log("Clicked key: " + ev.key);
    // console.log("Clicked key: " + ev.ctrlKey);
    if (ev.key === "!" && ev.shiftKey) {
      navigate("/sales");
    }
    if (ev.key === "@" && ev.shiftKey) {
      navigate("/clients");
    }
    if (ev.key === "#" && ev.shiftKey) {
      navigate("/products");
    }
    if (ev.key === "$" && ev.shiftKey) {
      navigate("/settings");
    }
    if (ev.key === "%" && ev.shiftKey) {
      signOut();
    }
  };

  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const [sidebarState, setSidebarState] = useState<SidebarStateProp>(() => {
    return { mode: isLargerThan1440 ? "open" : "close" };
  });

  const { signOut } = useContext(AuthContext);

  const MENUS_SIDEBAR: Array<SidebarType> = [
    {
      key: "sales",
      title: "Vendas",
      route: "/sales",
      icon: faCartArrowDown,
      shortcut: ["shift", "1"],
    },
    {
      key: "clients",
      title: "Clientes",
      route: "/clients",
      icon: faUsers,
      shortcut: ["shift", "2"],
    },
    {
      key: "products",
      title: "Produtos",
      route: "/products",
      icon: faCake,
      shortcut: ["shift", "3"],
    },
    {
      key: "settings",
      title: "Configurações",
      route: "/settings",
      icon: faGear,
      precedesDivider: true,
      shortcut: ["shift", "4"],
    },
    {
      key: "logout",
      title: "Sair",
      route: "",
      icon: faArrowRightFromBracket,
      onClick: () => {
        signOut();
        navigate("/login");
      },
      shortcut: ["shift", "5"],
    },
  ];

  useEffect(() => {
    setSidebarState({
      mode: isLargerThan1440 ? "open" : "close",
    });
  }, [isLargerThan1440]);

  return (
    <Box
      left={0}
      top={0}
      height={"100%"}
      width={sidebarState.mode == "open" ? "20rem" : "4rem"}
      minWidth={sidebarState.mode == "open" ? "20rem" : "4rem"}
      transition={"0.5s"}
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
                fontSize={["12px", "20px"]}
                textColor={"white"}
              >
                {"SysConfeitaria"}
              </Text>
            </HStack>
          )}
          <IconButton
            aria-label={"Abrir/Fechar sidebar"}
            backgroundColor={"transparent"}
            cursor={"pointer"}
            _hover={{
              backgroundColor: "rgba(217, 217, 217, 0.19)",
            }}
            onClick={() => {
              setSidebarState({
                mode: sidebarState.mode == "close" ? "open" : "close",
              });
            }}
          >
            {sidebarState.mode === "close" ? (
              <FontAwesomeIcon
                color={"#FFFFFF"}
                icon={faChevronRight}
                fontSize={"28px"}
              />
            ) : (
              <FontAwesomeIcon
                color={"#FFFFFF"}
                icon={faChevronLeft}
                fontSize={"28px"}
              />
            )}
          </IconButton>
        </HStack>
        <VStack gap={5} width={"100%"}>
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
              _hover={{
                backgroundColor: "#eac3aeb2",
              }}
              _active={{
                backgroundColor: "#eac3ae83",
              }}
              borderRadius={sidebarState.mode == "open" ? "15px" : "full"}
              width={"70%"}
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
            {MENUS_SIDEBAR.map((menu_sidebar, index) => {
              return (
                <VStack key={index} width={"100%"}>
                  <Tooltip
                    borderRadius={"10px"}
                    placement="bottom"
                    bg={"#2D3748"}
                    textColor={"#2D3748"}
                    label={
                      <HStack py={"2px"} px={"2px"}>
                        <Kbd>{menu_sidebar?.shortcut?.[0]}</Kbd>{" "}
                        <Text textColor={"#FFFFFF"}>+</Text>{" "}
                        <Kbd>{menu_sidebar?.shortcut?.[1]}</Kbd>
                      </HStack>
                    }
                  >
                    <Flex
                      width={"100%"}
                      cursor={"pointer"}
                      _hover={{
                        backgroundColor: "rgba(217, 217, 217, 0.19)",
                      }}
                      paddingY={"10px"}
                      alignItems={"center"}
                      onClick={
                        menu_sidebar.onClick !== undefined
                          ? () => {
                              menu_sidebar.onClick?.();
                            }
                          : () => {
                              navigate(menu_sidebar.route);
                            }
                      }
                    >
                      <HStack
                        gap={4}
                        justifyContent={
                          sidebarState.mode == "close" ? "center" : undefined
                        }
                        alignItems={"center"}
                        cursor={"pointer"}
                        margin={"auto"}
                        width={"80%"}
                      >
                        <Box
                          height={"30px"}
                          width={"30px"}
                          textAlign={"center"}
                        >
                          <FontAwesomeIcon
                            color={"#EAC3AE"}
                            icon={menu_sidebar.icon}
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
                            {menu_sidebar.title.toUpperCase()}
                          </Text>
                        )}
                      </HStack>
                    </Flex>
                  </Tooltip>
                  {menu_sidebar.precedesDivider && (
                    <Divider width={"80%"} margin={"auto"} />
                  )}
                </VStack>
              );
            })}
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
}
