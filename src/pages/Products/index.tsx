import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, HStack, Text, useMediaQuery, VStack } from "@chakra-ui/react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import AuthContext from "../../contexts/AuthContext";
import Table from "./components/Table";

import makeData from "./makeData";

const serverData = makeData(25);

export type Product = {
  productCode: string;
  productName: string;
  unitaryValue: string;
  actions?: string;
};

export default function Products() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

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
          disableResizing: false,
          width: 100,
        },
        {
          Header: "Nome do Produto".toUpperCase(),
          Footer: "Nome do Produto".toUpperCase(),
          accessor: "productName",
          disableResizing: false,
          width: isLargerThan1440 ? 900 : 500,
        },
        {
          Header: "Valor Unitário/Kg/L".toUpperCase(),
          Footer: "Valor Unitário/Kg/L".toUpperCase(),
          accessor: "unitaryValue",
          disableResizing: false,
          isNumeric: true,
          width: 250,
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
          disableResizing: true,
          disableSortBy: true,
          width: 100,
        },
      ] as Array<Column<Product>>,
    [isLargerThan1440]
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
      <VStack gap={2} paddingTop={"20px"} alignItems={"flex-start"}>
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
        <Table
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
