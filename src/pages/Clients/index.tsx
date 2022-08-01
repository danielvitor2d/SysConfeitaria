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

export type Client = {
  clientCode: string;
  clientName: string;
  clientEmail: string | null;
  contact: string;
  actions?: string;
};

export default function Clients() {
  const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

  const navigate = useNavigate();

  const { signed } = useContext(AuthContext);

  const [data, setData] = useState<Array<Client>>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);

  const columns = useMemo(
    () =>
      [
        {
          Header: "Código".toUpperCase(),
          Footer: "Código".toUpperCase(),
          accessor: "clientCode",
          disableResizing: false,
          width: 100,
        },
        {
          Header: "Cliente".toUpperCase(),
          Footer: "Cliente".toUpperCase(),
          accessor: "clientName",
          disableResizing: false,
          width: isLargerThan1440 ? 600 : 400,
        },
        {
          Header: "E-mail".toUpperCase(),
          Footer: "E-mail".toUpperCase(),
          accessor: "clientEmail",
          disableResizing: false,
          width: 320,
        },
        {
          Header: "Celular".toUpperCase(),
          Footer: "Celular".toUpperCase(),
          accessor: "contact",
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
      ] as Array<Column<Client>>,
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
            {"Clientes".toUpperCase()}
          </Text>
          <Text
            fontFamily={"Inter"}
            textColor={"#63342B"}
            fontStyle={"normal"}
            fontWeight={"600"}
            fontSize={"18px"}
            noOfLines={[3, 2, 1]}
          >
            {"Aqui você pode gerenciar seus clientes com facilidade"}
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
