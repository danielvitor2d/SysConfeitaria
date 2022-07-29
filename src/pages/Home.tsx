import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

export default function Home() {
  const navigate = useNavigate();

  const { signed } = useContext(AuthContext)

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/')
      }
    });
  }, [signed])

  return (
    <Box width={"100%"} padding={"15px"}>
      <VStack gap={5} paddingTop={"20px"} alignItems={"flex-start"}>
        <VStack alignItems={"flex-start"}>
          <Text
            fontFamily={"Inter"}
            textColor={"#63342B"}
            fontStyle={"normal"}
            fontWeight={"600"}
            fontSize={"32px"}
          >
            {"Produtos".toUpperCase()}
          </Text>
          <Text
            fontFamily={"Inter"}
            textColor={"#63342B"}
            fontStyle={"normal"}
            fontWeight={"600"}
            fontSize={"18px"}
          >
            {"Gerencie seus produtos aqui!"}
          </Text>
        </VStack>
        <Button
          backgroundColor={"#EAC3AE"}
          borderRadius={"6px"}
          borderWidth={"1px"}
          borderColor={"#63342B"}
          margin={"auto"}
          width={"190px"}
        >
          <HStack alignItems={"center"}>
            <Text
              fontFamily={"Montserrat"}
              fontWeight={"500"}
              textColor={"#63342B"}
              marginTop={"2px"}
            >
              {"Novo produto".toUpperCase()}
            </Text>
            <Box height={"25px"} width={"25px"} textAlign={"center"}>
              <FontAwesomeIcon
                color={"#63342B"}
                icon={faPlus}
                fontSize={"25px"}
              />
            </Box>
          </HStack>
        </Button>
        <TableContainer
          width={"100%"}
          borderRadius={"10px"}
          borderWidth={"1px"}
          borderColor={"#7C7C8A"}
          padding={"12px"}
          backgroundColor={"#E8E8E8"}
        >
          <Table variant={"mytable"}>
            <Thead>
              <Tr>
                <Th>{"Código".toUpperCase()}</Th>
                <Th>{"Nome do produto".toUpperCase()}</Th>
                <Th>{"Valor unitário/KG/L".toUpperCase()}</Th>
                <Th>{"Ações".toUpperCase()}</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>836481</Td>
                <Td>Rocambole de Doce de Leite</Td>
                <Td>R$ 15,00/unid</Td>
                <Td>
                  <HStack>
                    <EditIcon />
                    <DeleteIcon color={"red"} />
                  </HStack>
                </Td>
              </Tr>
              <Tr>
                <Td>526023</Td>
                <Td>Pedaço de Torta de Frango</Td>
                <Td>R$ 15,00/KG</Td>
                <Td>
                  <HStack>
                    <EditIcon />
                    <DeleteIcon color={"red"} />
                  </HStack>
                </Td>
              </Tr>
              <Tr>
                <Td>582649</Td>
                <Td>Pedaço de bolo de chocolate tradicional</Td>
                <Td>R$ 6,00/KG</Td>
                <Td>
                  <HStack>
                    <EditIcon />
                    <DeleteIcon color={"red"} />
                  </HStack>
                </Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>{"Código".toUpperCase()}</Th>
                <Th>{"Nome do produto".toUpperCase()}</Th>
                <Th>{"Valor unitário/KG/L".toUpperCase()}</Th>
                <Th>{"Ações".toUpperCase()}</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  );
}
