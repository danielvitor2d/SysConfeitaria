import "regenerator-runtime/runtime";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Badge,
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
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
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
  SaleRow,
  saleStatus,
  PaymentMethod,
  SaleStatus,
  bagdeColor,
} from "../../../../types";
import { matchSorter } from "match-sorter";

interface SalesTableProps {
  columns: Column<SaleRow>[];
  data: SaleRow[];
  onOpenDrawerAddSale: () => void;
}

export default function Table({
  columns,
  data,
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
    "createdAt",
    "client",
  ]);
  const [paymentMethodsFilter, setPaymentMethodsFilter] = useState<
    PaymentMethod[]
  >([]);
  const [saleStatusFilter, setSaleStatusFilter] = useState<SaleStatus[]>([]);

  const globalFilterFunction = useCallback(
    (rows: Row<SaleRow>[], _ids: IdType<SaleRow>[], query: string) => {
      if (filters.length === 0) return rows;
      const newRows = rows.filter((row) => {
        return (
          filters.some((filter) => {
            if (filter === "client") {
              return (
                matchSorter([row.values[filter].clientName], query).length === 1
              );
            }
            return matchSorter([row.values[filter]], query).length === 1;
          }) &&
          (paymentMethodsFilter.length === 0 ||
            paymentMethodsFilter.includes(
              row.values["paymentMethod"] as PaymentMethod
            )) &&
          (saleStatusFilter.length === 0 ||
            saleStatusFilter.includes(row.values["saleStatus"] as SaleStatus))
        );
      });
      return newRows;
    },
    [filters, paymentMethodsFilter, saleStatusFilter]
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
        <GridItem colSpan={[1, 1, 1, 1, 1]}>
          <HStack>
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
                  fontWeight={"500"}
                  fontFamily={"Montserrat"}
                >
                  Pagamento
                </Text>
              </MenuButton>
              <MenuList minWidth="240px">
                <MenuOptionGroup
                  title="Meios de pagamento"
                  type="checkbox"
                  onChange={(value) =>
                    setPaymentMethodsFilter([...value] as PaymentMethod[])
                  }
                >
                  {Object.entries(paymentMethod).map((value: string[]) => (
                    <MenuItemOption key={value[0]} value={value[0]}>
                      {value[1]}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
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
                  fontWeight={"500"}
                  fontFamily={"Montserrat"}
                >
                  Status
                </Text>
              </MenuButton>
              <MenuList minWidth="240px">
                <MenuOptionGroup
                  title="Status da venda"
                  type="checkbox"
                  onChange={(value) =>
                    setSaleStatusFilter([...value] as SaleStatus[])
                  }
                >
                  {Object.entries(saleStatus).map((value: string[]) => (
                    <MenuItemOption key={value[0]} value={value[0]}>
                      <Badge colorScheme={bagdeColor[value[0] as SaleStatus]}>
                        {value[1]}
                      </Badge>
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
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
                  fontWeight={"500"}
                  fontFamily={"Montserrat"}
                >
                  Filtrar por
                </Text>
              </MenuButton>
              <MenuList minWidth="240px">
                <MenuOptionGroup
                  title="Filtros"
                  type="checkbox"
                  defaultValue={["saleCode", "createdAt", "client"]}
                  onChange={(value) => setFilters([...value])}
                >
                  <MenuItemOption value="saleCode">Código</MenuItemOption>
                  <MenuItemOption value="createdAt">Data</MenuItemOption>
                  <MenuItemOption value="client">Cliente</MenuItemOption>
                  <MenuItemOption value="fullValue">Total</MenuItemOption>
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
            {page.map((row, _i) => {
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
