import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  TableContainer,
  TableCaption,
  Thead,
  Tr,
  Th,
  chakra,
  Tbody,
  Td,
  Tfoot,
  Table as ChakraUITable,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Column,
  useBlockLayout,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { ItemRow } from "../../../../../../types";
import makeData from "../../makeData";
import Paginate from "./Paginate";

interface ItemTableProps {
  readonly columns: Column<ItemRow>[];
  data: ItemRow[];
}

export default function Table({ columns, data }: ItemTableProps) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
      autoResetPage: false,
      autoResetFilters: false,
      autoResetExpanded: false,
      autoResetSortBy: false,
    },
    useBlockLayout,
    useSortBy,
    usePagination
  );

  return (
    <TableContainer
      width={"auto"}
      borderRadius={"10px"}
      borderWidth={"1px"}
      borderColor={"#7C7C8A"}
      padding={"12px"}
      backgroundColor={"#f1f1f1"}
    >
      <ChakraUITable {...getTableProps()} variant={"mytable2"}>
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
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
        {/* <Tfoot>
          {footerGroups.map((footerGroup) => (
            <Tr {...footerGroup.getFooterGroupProps()}>
              {footerGroup.headers.map((column) => (
                <Th {...column.getFooterProps(column.getSortByToggleProps())}>
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
        </Tfoot> */}
      </ChakraUITable>
    </TableContainer>
  );
}
