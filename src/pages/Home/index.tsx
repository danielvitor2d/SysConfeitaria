import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  GridItem,
  HStack,
  Input,
  InputGroup,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Column,
} from "react-table";
import AuthContext from "../../contexts/AuthContext";
import ProductTable from "./components/ProductTable";

import makeData from "./makeData";

const serverData = makeData(25);

export type Product = {
  productCode: string;
  productName: string;
  unitaryValue: string;
  actions?: string;
};

export default function Home() {
  const navigate = useNavigate();

  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<Array<Product>>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);

  const columns = useMemo(
    () =>
      [
        {
          Header: "Código".toUpperCase(),
          Footer: "Código".toUpperCase(),
          accessor: "productCode",
        },
        {
          Header: "Nome do Produto".toUpperCase(),
          Footer: "Nome do Produto".toUpperCase(),
          accessor: "productName",
        },
        {
          Header: "Valor Unitário/Kg/L".toUpperCase(),
          Footer: "Valor Unitário/Kg/L".toUpperCase(),
          accessor: "unitaryValue",
        },
        {
          Header: "Ações".toUpperCase(),
          Footer: "Ações".toUpperCase(),
          accessor: "actions",
          Cell: () => (
            <HStack>
              <EditIcon />
              <DeleteIcon color={"red"} />
            </HStack>
          ),
          disableSortBy: true,
        },
      ] as Array<Column<Product>>,
    []
  );

  async function handleRemoveRow() {}

  async function handleUpdateRow() {}

  const fetchData = useCallback(
    ({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) => {
      const fetchId = ++fetchIdRef.current

      setLoading(true);

      setTimeout(() => {
        if (fetchId === fetchIdRef.current) {
          const startRow = pageSize * pageIndex;
          const endRow = startRow + pageSize;
          setData(serverData.slice(startRow, endRow));

          setPageCount(Math.ceil(serverData.length / pageSize));

          setLoading(false);
        }
      }, 1000);
    },
    []
  );

  useEffect(() => {
    if (!signed) {
      navigate("/");
    }
  }, [signed]);

  return (
    <Box
      width={"100%"}
      paddingX={"1rem"}
      overflowY={"auto"}
      paddingBottom={"1rem"}
    >
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
            noOfLines={[3, 2, 1]}
          >
            {"Gerencie seus produtos aqui!"}
          </Text>
        </VStack>
        <SimpleGrid
          width={"100%"}
          alignItems={"flex-start"}
          justifyContent={"space-between"}
          gap={7}
          flex={1}
          columns={[1, 1, 5, 6, 6]}
        >
          <GridItem colSpan={[1, 1, 2, 2, 1]}>
            <Button
              backgroundColor={"#EAC3AE"}
              borderRadius={"6px"}
              borderWidth={"1px"}
              borderColor={"#63342B"}
              width={"100%"}
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
          </GridItem>
          <GridItem colSpan={[1, 1, 3, 2, 2]} colStart={[1, 1, 3, 5, 5]}>
            <InputGroup>
              <Input
                borderColor={"#63342B"}
                focusBorderColor={"#482017"}
                _hover={{
                  borderColor: "#482017",
                }}
                placeholder={"Ex. Pedaço de bolo"}
                backgroundColor={"#E8E8E8"}
                // onChange={handleFilterChange}
                // value={filterInput}
              />
              {/* <InputRightElement
                children={
                  <FontAwesomeIcon
                    icon={filterInput?.length > 0 ? faCircleXmark : faSearch}
                    cursor={filterInput?.length > 0 ? "pointer" : undefined}
                    onClick={() => {
                      if (filterInput?.length > 0) {
                        setFilterInput("");
                        setFilter("productName", "");
                      }
                    }}
                    color={"#63342B"}
                  />
                }
              /> */}
            </InputGroup>
          </GridItem>
        </SimpleGrid>
        <ProductTable 
          columns={columns}
          data={data}
          fetchData={fetchData}
          loading={loading}
          pageCount={pageCount}
        />
      </VStack>
    </Box>
  );
}
