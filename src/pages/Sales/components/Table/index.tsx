import "regenerator-runtime/runtime";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Badge,
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
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
import {
  paymentMethod,
  SaleRow,
  saleStatus,
  PaymentMethod,
  SaleStatus,
  bagdeColor,
  Sale,
} from "../../../../types";
import { matchSorter } from "match-sorter";

import { getStorage, ref, getDownloadURL } from "firebase/storage";

import SaleContext from "../../../../contexts/SalesContext";
import RadioCard from "./RadioCard";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fromNumberToStringFormatted } from "../../../../util/formatCurrency";
import {
  fromDatetimeToLocalFormatted,
  getDateMinusDays,
  getDateMinusMonth,
} from "../../../../util/getDate";
import { compareDate } from "../../../../util/compareDate";
import { cssResizer } from "../../../../theme";
import Paginate from "../../../../components/Paginate";

interface SalesTableProps {
  columns: Column<SaleRow>[];
  data: SaleRow[];
  onOpenDrawerAddSale: () => void;
}

// export const getBase64ImageFromURL = (url: any) => {
//   return new Promise((resolve, reject) => {
//     var img = new Image();
//     img.setAttribute("crossOrigin", "anonymous");

//     img.onload = () => {
//       var canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;

//       var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
//       ctx.drawImage(img, 0, 0);

//       var dataURL = canvas.toDataURL("image/png");

//       resolve(dataURL);
//     };

//     img.onerror = (error) => {
//       reject(error);
//     };

//     img.src = url;
//   });
// };

export default function Table({
  columns,
  data,
  onOpenDrawerAddSale,
}: SalesTableProps) {
  const { sales } = useContext(SaleContext);

  const [buttonGenerateLoading, setButtonGenerateLoading] = useState(false)

  const create = async (type: "daily" | "weekly" | "monthly") => {
    setButtonGenerateLoading(true)

    const storage = getStorage();
    const pathReference = ref(storage, "logo_confeitaria.png");
    const urlImage = await getDownloadURL(pathReference);

    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open("GET", urlImage);
    xhr.send();

    const img = new Image();
    img.src = urlImage; //"./src/assets/logo_confeitaria.png";

    const head = [["Código", "Cliente", "Valor", "Forma de pagamento"]];

    const initDay =
      type === "daily"
        ? getDateMinusDays(0)
        : type === "weekly"
        ? getDateMinusDays(6)
        : getDateMinusMonth(1);
    const lastDay = new Date(Date.now()).toLocaleDateString("pt-BR");

    let salesToReport = sales.filter((sale) => {
      return sale.saleStatus === 'done' && compareDate(initDay, fromDatetimeToLocalFormatted(sale.createdAt));
    });

    let total = 0;

    let data = salesToReport.map((sale) => {
      total += sale.fullValue as number;
      return [
        sale.saleCode,
        sale.client.clientName,
        "R$ " + fromNumberToStringFormatted(sale.fullValue as number),
        sale.paymentMethods.reduce(
          (
            previousValue: string,
            currentValue: any,
            _currentIndex: number,
            _array: any[]
          ) => {
            if (!previousValue || previousValue.length === 0)
              return paymentMethod[currentValue as PaymentMethod];
            return (
              previousValue +
              ", " +
              paymentMethod[currentValue as PaymentMethod]
            );
          },
          ""
        ),
      ];
    });

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Relatório de Vendas", 15, 17);

    doc.setFontSize(14);
    doc.text("Total arrecadado: ", 15, 26);
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
        console.log(data.column.index);
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

    // doc.output("dataurlnewwindow", { filename: "Relatorio.pdf" });
    // doc.save("Relatorio.pdf")
    window.open(URL.createObjectURL(doc.output("blob")))

    setButtonGenerateLoading(false)
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
      // console.log("filters: " + JSON.stringify(filters, null, 2))
      // console.log("paymentMethodsFilter: " + JSON.stringify(paymentMethodsFilter, null, 2))
      // console.log("saleStatusFilter: " + JSON.stringify(saleStatusFilter, null, 2))
      // if (filters.length === 0) return rows;
      const newRows = rows.filter((row) => {
        // console.log(row);
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
            row.original.paymentMethods.some((row) =>
              paymentMethodsFilter.includes(row)
            )) &&
          (saleStatusFilter.length === 0 ||
            saleStatusFilter.includes(row.original.saleStatus))
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
      initialState: {
        pageIndex: 0,
        sortBy: [
          {
            id: "createdAt",
            desc: true,
          },
        ],
      },
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
  }, [filter, setGlobalFilter, paymentMethodsFilter, saleStatusFilter]);

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
    <>
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
                onClick={onOpenDrawerAddSale}
              >
                <HStack alignItems={"center"}>
                  <Text
                    fontFamily={"Montserrat"}
                    fontWeight={"600"}
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
                <PopoverContent
                  color="white"
                  bg="#70453c"
                  borderColor="#63342A"
                >
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
                        isLoading={buttonGenerateLoading}
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
                    {"Pagamento"}
                  </Text>
                </MenuButton>
                <MenuList minWidth="240px">
                  <MenuOptionGroup
                    title="Meios de pagamento"
                    type="checkbox"
                    onChange={(value) => {
                      // console.log("Selecionou: " + JSON.stringify(value, null, 2))
                      const newValue = [...value] as PaymentMethod[];
                      setPaymentMethodsFilter([...newValue]);
                    }}
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
                    {"Status"}
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
    </>
  );
}
