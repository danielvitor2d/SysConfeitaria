// import 'regenerator-runtime/runtime';
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
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
  useRadioGroup,
  UseRadioGroupProps,
  VStack,
} from "@chakra-ui/react";
import {
  faAngleDown,
  faCircleXmark,
  faFilePdf,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { PaymentRow } from "../../../../types";
import { matchSorter } from "match-sorter";
import RadioCard from "../../../Sales/components/Table/RadioCard";
import PaymentContext from "../../../../contexts/PaymentContext";
import { compareDate } from "../../../../util/compareDate";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fromNumberToStringFormatted } from "../../../../util/formatCurrency";
import {
  getDateMinusDays,
  getDateMinusMonth,
  fromDatetimeToLocalFormatted,
} from "../../../../util/getDate";
import { cssResizer } from "../../../../theme";
import Paginate from "../../../../components/Paginate";

interface PaymentTableProps {
  columns: Column<PaymentRow>[];
  data: PaymentRow[];
  onOpenDrawerAddPayment: () => void;
}

export default function Table({
  columns,
  data,
  onOpenDrawerAddPayment,
}: PaymentTableProps) {
  const { payments } = useContext(PaymentContext);

  const create = async (type: "daily" | "weekly" | "monthly") => {
    const img = new Image();
    img.src = "./src/assets/logo_confeitaria.png";

    const head = [["Código", "Título", "Valor", "Data do pagamento"]];

    const initDay =
      type === "daily"
        ? getDateMinusDays(0)
        : type === "weekly"
        ? getDateMinusDays(6)
        : getDateMinusMonth(1);
    const lastDay = new Date(Date.now()).toLocaleDateString("pt-BR");

    let paymentsToReport = payments.filter((payment) => {
      return compareDate(
        initDay,
        fromDatetimeToLocalFormatted(payment.createdAt)
      );
    });

    let total = 0;

    let data = paymentsToReport.map((payment) => {
      total += payment.paymentValue as number;
      return [
        payment.paymentCode,
        payment.paymentTitle,
        "R$ " + fromNumberToStringFormatted(payment.paymentValue as number),
        fromDatetimeToLocalFormatted(payment.createdAt),
      ];
    });

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Relatório de Pagamentos", 15, 17);

    doc.setFontSize(14);
    doc.text("Total pago: ", 15, 26);
    doc.setFontSize(12);
    doc.text(`R$ ${fromNumberToStringFormatted(total)}`, 60, 26);

    doc.setFontSize(14);
    doc.text("Período: ", 15, 32);
    doc.setFontSize(12);
    doc.text(`${initDay} - ${lastDay}`, 60, 32);

    doc.addImage(img, "png", 140, 5, 60, 20);

    autoTable(doc, {
      head: head,
      body: data,
      didDrawCell: (data) => {
        // console.log(data.column.index);
      },
      pageBreak: "auto",
      startY: 40,
      theme: "striped",
      alternateRowStyles: {
        fillColor: "#BEBEBE",
        // fillColor: '#ac7e73',
      },
      headStyles: {
        fillColor: "#FFF",
        textColor: "#353535",
      },
      bodyStyles: {
        textColor: "#353535",
      },
    });

    doc.output("dataurlnewwindow", { filename: "my-report.pdf" });
  };

  const [filter, setFilter] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([
    "paymentCode",
    "paymentTitle",
  ]);

  const globalFilterFunction = useCallback(
    (rows: Row<PaymentRow>[], _ids: IdType<PaymentRow>[], query: string) => {
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

  const options = ["Último dia", "Última semana", "Último mês"];

  const [radioValue, setRadioValue] = useState<
    "Último dia" | "Última semana" | "Último mês"
  >("Último dia");

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "reportsType",
    defaultValue: "Último dia",
    onChange: (nextValue: string) => {
      if (nextValue === "Último dia") {
        setRadioValue("Último dia");
      } else if (nextValue === "Última semana") {
        setRadioValue("Última semana");
      } else {
        setRadioValue("Último mês");
      }
    },
  } as UseRadioGroupProps);

  const group = getRootProps();

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
          <HStack>
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
              onClick={onOpenDrawerAddPayment}
            >
              <HStack alignItems={"center"}>
                <Text
                  fontFamily={"Montserrat"}
                  fontWeight={"600"}
                  textColor={"#63342B"}
                  marginTop={"2px"}
                  textAlign={"center"}
                >
                  {"Novo pagamento".toUpperCase()}
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
            <Popover placement="bottom">
              <PopoverTrigger>
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
                >
                  <HStack alignItems={"center"}>
                    <Text
                      fontFamily={"Montserrat"}
                      fontWeight={"600"}
                      textColor={"#63342B"}
                      marginTop={"2px"}
                      textAlign={"center"}
                    >
                      {"Relatórios".toUpperCase()}
                    </Text>
                    <Box height={"25px"} width={"25px"} textAlign={"center"}>
                      <FontAwesomeIcon
                        color={"#63342B"}
                        icon={faFilePdf}
                        fontSize={"25px"}
                      />
                    </Box>
                  </HStack>
                </Button>
              </PopoverTrigger>
              <PopoverContent color="white" bg="#70453c" borderColor="#63342A">
                <PopoverHeader pt={4} fontWeight="bold" border="0">
                  {"Gerar relatórios"}
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <HStack {...group} width={"100%"} alignItems={"flex-start"}>
                    {options.map((value) => {
                      const radio = getRadioProps({ value });
                      return (
                        <RadioCard
                          key={value}
                          {...radio}
                          alignSelf={"flex-start"}
                        >
                          {value}
                        </RadioCard>
                      );
                    })}
                  </HStack>
                </PopoverBody>
                <PopoverFooter
                  border="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  pb={4}
                >
                  <ButtonGroup size="sm">
                    <Button
                      color={"#63342A"}
                      bg={"#EAC3AE"}
                      _hover={{
                        backgroundColor: "#eac3aeb2",
                      }}
                      _active={{
                        backgroundColor: "#eac3ae83",
                      }}
                      onClick={async () => {
                        if (radioValue === "Último dia") {
                          await create("daily");
                        } else if (radioValue === "Última semana") {
                          await create("weekly");
                        } else {
                          await create("monthly");
                        }
                      }}
                    >
                      {"Gerar"}
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </HStack>
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
                  defaultValue={["paymentCode", "paymentTitle"]}
                  onChange={(value) => setFilters([...value])}
                >
                  <MenuItemOption value="paymentCode">Código</MenuItemOption>
                  <MenuItemOption value="paymentTitle">
                    {"Título do pagamento"}
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
                placeholder={"Ex. Garrafão de água"}
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
