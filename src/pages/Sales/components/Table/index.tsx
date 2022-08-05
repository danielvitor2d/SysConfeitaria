import "regenerator-runtime/runtime";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  Skeleton,
  Table as ChakraUITable,
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
  faAngleDown,
  faCircleXmark,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import {
  Column,
  IdType,
  Row,
  useBlockLayout,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";
import Paginate from "../Paginate";
import {
  paymentMethod,
  PaymentMethod,
  SaleRow,
  saleStatus,
  SaleStatus,
} from "../../../../types";
import { matchSorter } from "match-sorter";

interface SalesTableProps {
  columns: Column<SaleRow>[];
  data: SaleRow[];
  loading: boolean;
  onOpenDrawerAddSale: () => void;
}

export default function Table({
  columns,
  data,
  loading,
  onOpenDrawerAddSale,
}: SalesTableProps) {
  const cssResizer = {
    _hover: {
      ".resizer": {
        background: "#482017",
      },
    },
    ".resizer": {
      display: "inline-block",
      position: "absolute",
      width: "1px",
      height: "90%",
      right: "0",
      top: "0",
      transform: "translateX(50%)",
      zIndex: "1",
      touchAction: "none",
      "&.isResizing": {
        background: "#482017",
      },
    },
  };

  const [filter, setFilter] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([
    "saleCode",
    "client",
    "saleStatus",
  ]);

  const globalFilterFunction = useCallback(
    (rows: Row<SaleRow>[], _ids: IdType<SaleRow>[], query: string) => {
      if (filters.length === 0) return rows;
      console.log("oldRows: ", rows);
      // const newRows = matchSorter<Row<SaleRow>>(rows, query, {
      //   keys: filters.map((columnName) => `values.${columnName}`),
      // });
      const newRows = rows.filter((row) => {
        return filters.some((filter) => {
          if (filter === "client") {
            return (
              matchSorter([row.values[filter].clientName], query).length === 1
            );
          }
          if (filter === "saleStatus") {
            console.log("saleStatus[row.values[filter] as SaleStatus]: ", saleStatus[row.values[filter] as SaleStatus])
            return (
              matchSorter([saleStatus[row.values[filter] as SaleStatus]], query)
                .length === 1
            );
          }
          if (filter === "paymentMethod") {
            return (
              matchSorter(
                [paymentMethod[row.values[filter] as PaymentMethod]],
                query
              ).length === 1
            );
          }
          return matchSorter([row.values[filter]], query).length === 1;
        });
      });
      console.log("newRows: ", newRows);
      return newRows;
    },
    [filters]
  );

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 80,
      width: 150,
      maxWidth: 2000,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      autoResetPage: false,
      autoResetFilters: false,
      autoResetExpanded: false,
      autoResetSortBy: false,
      defaultColumn,
      globalFilter: globalFilterFunction,
    },
    useBlockLayout,
    useResizeColumns,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setGlobalFilter(filter);
  }, [filter, setGlobalFilter]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <VStack gap={1}>
      <SimpleGrid
        width={"100%"}
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        gap={7}
        flex={1}
        columns={[4, 4, 4, 6, 6]}
      >
        <GridItem colSpan={[1, 1, 1, 2, 1]}>
          <Button
            backgroundColor={"#EAC3AE"}
            borderRadius={"6px"}
            borderWidth={"1px"}
            borderColor={"#63342B"}
            width={"100%"}
            onClick={onOpenDrawerAddSale}
          >
            <HStack alignItems={"center"}>
              <Text
                fontFamily={"Montserrat"}
                fontWeight={"500"}
                textColor={"#63342B"}
                marginTop={"2px"}
                textAlign={"center"}
              >
                {"Nova venda".toUpperCase()}
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
        <GridItem colSpan={[1, 1, 2, 3, 3]} colStart={[1, 1, 1, 4, 4]}>
          <HStack>
            <InputGroup>
              <Input
                borderColor={"#63342B"}
                focusBorderColor={"#482017"}
                _hover={{
                  borderColor: "#482017",
                }}
                placeholder={"Ex. Fulano de tal"}
                backgroundColor={"#E8E8E8"}
                value={filter}
                onChange={handleInputChange}
              />
              <InputRightElement
                children={
                  <FontAwesomeIcon
                    icon={filter?.length > 0 ? faCircleXmark : faSearch}
                    cursor={filter?.length > 0 ? "pointer" : undefined}
                    onClick={() => {
                      if (filter?.length > 0) {
                        setGlobalFilter("");
                        setFilter("");
                      }
                    }}
                    color={"#63342B"}
                  />
                }
              />
            </InputGroup>
            <Menu closeOnSelect={false}>
              <MenuButton width={"25%"}>
                <Button
                  width={"full"}
                  type={"submit"}
                  backgroundColor={"#63342B"}
                  _hover={{ backgroundColor: "#502A22" }}
                  _active={{ backgroundColor: "#482017" }}
                  rightIcon={
                    <FontAwesomeIcon icon={faAngleDown} color={"white"} />
                  }
                >
                  <Text
                    color={"white"}
                    fontSize={"15px"}
                    fontWeight={"500"}
                    fontFamily={"Montserrat"}
                  >
                    Filtrar por
                  </Text>
                </Button>
              </MenuButton>
              <MenuList minWidth="240px">
                <MenuDivider />
                <MenuOptionGroup
                  title="Filtros"
                  type="checkbox"
                  defaultValue={["saleCode", "client", "saleStatus"]}
                  onChange={(value) => setFilters([...value])}
                >
                  <MenuItemOption value="saleCode">Código</MenuItemOption>
                  <MenuItemOption value="createdAt">Data</MenuItemOption>
                  <MenuItemOption value="client">Cliente</MenuItemOption>
                  <MenuItemOption value="fullValue">Total</MenuItemOption>
                  <MenuItemOption value="paymentMethod">
                    Pagamento
                  </MenuItemOption>
                  <MenuItemOption value="saleStatus">Status</MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </HStack>
        </GridItem>
      </SimpleGrid>
      <TableContainer
        width={"auto"}
        borderRadius={"10px"}
        borderWidth={"1px"}
        borderColor={"#7C7C8A"}
        padding={"12px"}
        backgroundColor={"#E8E8E8"}
      >
        <ChakraUITable {...getTableProps()} variant={"mytable"}>
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
                    sx={cssResizer}
                  >
                    {column.render("Header")}
                    <chakra.span pl={"4"}>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                    {column.canResize ? (
                      <Box
                        {...column.getResizerProps()}
                        className={`resizer ${
                          column.isResizing ? "isResizing" : ""
                        }`}
                      />
                    ) : null}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {loading ? (
              <Tr>
                {Array(pageSize)
                  .fill("")
                  .map((_, i) => (
                    <Skeleton
                      startColor={"#63342B"}
                      endColor={i % 2 == 0 ? "#EAC3AE" : "white"}
                      height={"52px"}
                    />
                  ))}
              </Tr>
            ) : (
              page.map((row, i) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    ))}
                  </Tr>
                );
              })
            )}
          </Tbody>
          <Tfoot>
            {footerGroups.map((footerGroup) => (
              <Tr {...footerGroup.getFooterGroupProps()}>
                {footerGroup.headers.map((column) => (
                  <Th
                    {...column.getFooterProps(column.getSortByToggleProps())}
                    sx={cssResizer}
                  >
                    {column.render("Footer")}
                    <chakra.span pl={"4"}>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Tfoot>
        </ChakraUITable>
      </TableContainer>
    </VStack>
  );
}
