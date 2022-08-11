// import 'regenerator-runtime/runtime';
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  chakra,
  filter,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
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
  useAsyncDebounce,
  useBlockLayout,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";
import Paginate from "../Paginate";
import { ProductRow } from "../../../../types";
import { handleInputChange } from "react-select/dist/declarations/src/utils";
import { matchSorter } from "match-sorter";

interface ProductTableProps {
  columns: Column<ProductRow>[];
  data: ProductRow[];
  onOpenDrawerAddProduct: () => void;
}

export default function Table({
  columns,
  data,
  onOpenDrawerAddProduct,
}: ProductTableProps) {
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
      "z-index": "1",
      "touch-action": "none",
      "&.isResizing": {
        background: "#482017",
      },
    },
  };

  const [filter, setFilter] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([
    "productCode",
    "productName",
  ]);

  const globalFilterFunction = useCallback(
    (rows: Row<ProductRow>[], _ids: IdType<ProductRow>[], query: string) => {
      if (filters.length === 0) return rows;
      const newRows = rows.filter((row) => {
        return filters.some((filter) => {
          return matchSorter([row.values[filter]], query).length === 1;
        });
      });
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
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      autoResetPage: false,
      autoResetFilters: false,
      autoResetExpanded: false,
      autoResetSortBy: false,
      globalFilter: globalFilterFunction,
      defaultColumn,
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
        columns={[1, 1, 1, 2, 2]}
      >
        <GridItem colSpan={[1, 1, 1, 1, 1]}>
          <Button
            alignSelf={"flex-start"}
            backgroundColor={"#EAC3AE"}
            _hover={{
              backgroundColor: "#eac3aeb2",
            }}
            _active={{
              backgroundColor: "#eac3ae83",
            }}
            borderRadius={"6px"}
            borderWidth={"1px"}
            borderColor={"#63342B"}
            onClick={onOpenDrawerAddProduct}
          >
            <HStack alignItems={"center"}>
              <Text
                fontFamily={"Montserrat"}
                fontWeight={"600"}
                textColor={"#63342B"}
                marginTop={"2px"}
                textAlign={"center"}
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
        <GridItem colSpan={[1, 1, 1, 1, 1]}>
          <HStack justifyContent={"flex-end"}>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={Button}
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
                  fontWeight={"600"}
                  fontFamily={"Montserrat"}
                >
                  {"Filtrar por"}
                </Text>
              </MenuButton>
              <MenuList minWidth="240px">
                <MenuOptionGroup
                  title="Filtros"
                  type="checkbox"
                  defaultValue={["productCode", "productName"]}
                  onChange={(value) => setFilters([...value])}
                >
                  <MenuItemOption value="productCode">Código</MenuItemOption>
                  <MenuItemOption value="productName">
                    {'Nome do Produto'}
                  </MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            <InputGroup minWidth={"250px"} maxWidth={"250px"}>
              <Input
                borderColor={"#63342B"}
                focusBorderColor={"#482017"}
                _hover={{
                  borderColor: "#482017",
                }}
                placeholder={"Ex. Pedaço de bolo"}
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
