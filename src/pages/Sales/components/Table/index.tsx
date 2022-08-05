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
  faCircleXmark,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  Column,
  useAsyncDebounce,
  useBlockLayout,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";
import Paginate from "../Paginate";
import { SaleRow } from "../../../../types";

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
      defaultColumn,
    },
    useBlockLayout,
    useResizeColumns,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const [filter, setFilter] = useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

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
        <GridItem colSpan={[1, 1, 2, 2, 2]} colStart={[1, 1, 1, 5, 5]}>
          <InputGroup>
            <Input
              borderColor={"#63342B"}
              focusBorderColor={"#482017"}
              _hover={{
                borderColor: "#482017",
              }}
              placeholder={"Ex. Pedaço de bolo"}
              backgroundColor={"#E8E8E8"}
              value={filter || ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChange(event.target.value);
                setFilter(event.target.value);
              }}
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
