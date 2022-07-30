import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, {
  useEffect,
  useState,
} from "react";
import {
  Column,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { Product } from "../..";
import Paginate from "../Paginate";

interface ProductTableProps {
  columns: Column<Product>[];
  data: Product[];
  fetchData: ({
    pageSize,
    pageIndex,
  }: {
    pageSize: number;
    pageIndex: number;
  }) => void;
  loading: boolean;
  pageCount: number;
}

export default function ProductTable({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
}: ProductTableProps) {
  const [filterInput, setFilterInput] = useState<string>("");

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
      autoResetPage: false
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || "";
    setFilterInput(value);
    setFilter("productName", value);
  };

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
    console.log("pageIndex: " + pageIndex);
    console.log("pageSize: " + pageSize);
  }, [pageIndex, pageSize]);

  return (
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
                <Th {...column.getFooterProps()}>{column.render("Footer")}</Th>
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
  );
}
