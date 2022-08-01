import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, HStack, IconButton, Select, Text } from "@chakra-ui/react";
import React from "react";
import { Row } from "react-table";
import { Product } from "../..";

type PaginateProps = {
  page: Row<Product>[];
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: number[];
  pageCount: number;
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (pageSize: number) => void;
  pageSize: number;
  pageIndex: number;
};

export default function Paginate({
  page,
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageSize,
  pageIndex,
}: PaginateProps) {
  return (
    <Flex flex={1} justifyContent={"space-between"}>
      <Text>{`Página ${pageIndex + 1} de ${pageOptions.length}`}</Text>
      <HStack>
        <Text>Quantidade por página</Text>
        <Select
          value={pageSize}
          variant={"outline"}
          borderWidth={"2px"}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setPageSize(Number(event.target.value));
          }}
          _hover={{
            borderColor: "#7C7C8A",
          }}
          focusBorderColor={"#63342B"}
        >
          {Array(4)
            .fill("")
            .map((_, i) => (
              <option key={(i + 1) * 5} value={(i + 1) * 5}>
                {(i + 1) * 5}
              </option>
            ))}
        </Select>
      </HStack>
      <HStack>
        <IconButton
          aria-label="previous-page"
          backgroundColor={"#E8E8E8"}
          isDisabled={!canPreviousPage}
          onClick={previousPage}
        >
          <ChevronLeftIcon
            backgroundColor={"#63342B"}
            textColor={"#E8E8E8"}
            borderRadius={"full"}
            cursor={"pointer"}
            boxSize={"33px"}
          />
        </IconButton>
        <IconButton
          aria-label="next-page"
          backgroundColor={"#E8E8E8"}
          isDisabled={!canNextPage}
          onClick={nextPage}
        >
          <ChevronRightIcon
            backgroundColor={"#63342B"}
            textColor={"#E8E8E8"}
            borderRadius={"full"}
            cursor={"pointer"}
            boxSize={"33px"}
          />
        </IconButton>
      </HStack>
    </Flex>
  );
}
