import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Table,
  TableCaption,
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
import {
  faCircleXmark,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
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
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import AuthContext from "../../contexts/AuthContext";
import Paginate from "./components/Paginate";

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

  const [filterInput, setFilterInput] = useState<string>("");

  const [data, setData] = useState<Array<Product>>([]);
  const [loading, setLoading] = useState(false);
  const [controlledPageCount, setControlledPageCount] = useState(0);
  const fetchIdRef = useRef(0);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || "";
    setFilterInput(value);
    setFilter("productName", value);
  };

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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    setFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  async function handleRemoveRow() {}

  async function handleUpdateRow() {}

  const fetchData = useCallback(
    ({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) => {
      const fetchId = ++fetchIdRef.current;

      setLoading(true);

      setTimeout(() => {
        if (fetchId === fetchIdRef.current) {
          const startRow = pageSize * pageIndex;
          const endRow = startRow + pageSize;
          setData(serverData.slice(startRow, endRow));

          setControlledPageCount(Math.ceil(serverData.length / pageSize));

          setLoading(false);
        }
      }, 1000);
    },
    []
  );

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

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
                onChange={handleFilterChange}
                value={filterInput}
              />
              <InputRightElement
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
              />
            </InputGroup>
          </GridItem>
        </SimpleGrid>
        <TableContainer
          width={"100%"}
          borderRadius={"10px"}
          borderWidth={"1px"}
          borderColor={"#7C7C8A"}
          padding={"12px"}
          backgroundColor={"#E8E8E8"}
        >
          <Table {...getTableProps()} variant={"mytable"}>
            <TableCaption>
              <Paginate
                page={page}
                canPreviousPage={canPreviousPage}
                canNextPage={canNextPage}
                pageOptions={pageOptions}
                pageCount={pageCount}
                gotoPage={gotoPage}
                nextPage={nextPage}
                previousPage={previousPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                pageIndex={pageIndex}
              />
            </TableCaption>
            <Thead>
              {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={
                        column.isSorted
                          ? column.isSortedDesc
                            ? "sort-desc"
                            : "sort-asc"
                          : ""
                      }
                    >
                      {column.render("Header")}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
            <Tfoot>
              {footerGroups.map((footerGroup) => (
                <Tr {...footerGroup.getFooterGroupProps()}>
                  {footerGroup.headers.map((column) => (
                    <Th {...column.getFooterProps()}>
                      {column.render("Footer")}
                    </Th>
                  ))}
                </Tr>
              ))}
              <Tr>
                {loading ? (
                  <Th>Loading...</Th>
                ) : (
                  <Th>
                    Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                    results
                  </Th>
                )}
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  );
}
