import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, HStack, IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text, Tooltip } from "@chakra-ui/react";
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
    <Flex flex={1} justifyContent={"space-between"} alignItems={'center'}>
      <Flex>
        <Tooltip label={"Primeira página"}>
          <IconButton 
            aria-label="first-page"
            backgroundColor={"#63342B"}
            textColor={"#E8E8E8"}
            isDisabled={!canPreviousPage}
            onClick={() => gotoPage(0)}
            borderRadius={"full"}
            cursor={"pointer"}
            _hover={{
              backgroundColor: '#63342b7b'
            }}
            icon={<ArrowLeftIcon w={3} h={3} />}
            mr={2}
          />
        </Tooltip>
        <Tooltip label={"Página anterior"}>
          <IconButton
            aria-label="previous-page"
            backgroundColor={"#63342B"}
            textColor={"#E8E8E8"}
            isDisabled={!canPreviousPage}
            onClick={previousPage}
            borderRadius={"full"}
            cursor={"pointer"}
            _hover={{
              backgroundColor: '#63342b7b'
            }}
            icon={<ChevronLeftIcon w={6} h={6} />}
          />
        </Tooltip>
      </Flex>
      <Flex alignItems={'center'}>
        <Text 
          flexShrink={'0'}
          fontFamily={"Inter"}
          textColor={"#3d3d3d"}
          fontStyle={"normal"}
          fontSize={"16px"}
          mr={1}
        >
          Página{" "}
        </Text>
        <Text 
          fontWeight={'bold'}
          as={'span'}
          flexShrink={'0'}
          fontFamily={"Inter"}
          textColor={"#3d3d3d"}
          fontStyle={"normal"}
          fontSize={"16px"}
          mr={1}
        >
          {pageIndex + 1}
        </Text>
        <Text
          flexShrink={'0'}
          fontFamily={"Inter"}
          textColor={"#3d3d3d"}
          fontStyle={"normal"}
          fontSize={"16px"}
          mr={1}
        >
          {" "}de{" "}
        </Text>
        <Text 
          mr={8}
          fontWeight={'bold'}
          as={'span'}
          flexShrink={'0'}
          fontFamily={"Inter"}
          textColor={"#3d3d3d"}
          fontStyle={"normal"}
          fontSize={"16px"}
        >
          {pageOptions.length}
        </Text>
        <Text 
          flexShrink={'0'}
          fontFamily={"Inter"}
          textColor={"#3d3d3d"}
          fontStyle={"normal"}
          fontSize={"16px"}
        >
          {'Ir para página'}
        </Text>
        <NumberInput
          ml={2}
          mr={8}
          w={28}
          min={1}
          max={pageOptions.length}
          onChange={(_, valueAsNumber: number) => {
            const page = valueAsNumber ? valueAsNumber - 1 : 0
            gotoPage(page)
          }}
          value={pageIndex + 1}
          borderWidth={"2px"}
          borderRadius={'8px'}
          _hover={{
            borderColor: "#7C7C8A",
          }}
          focusBorderColor={"#63342B"}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Select
          w={20}
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
      </Flex>
      <Flex>
        <Tooltip label={"Próxima página"}>
          <IconButton 
            aria-label="next-page"
            backgroundColor={"#63342B"}
            textColor={"#E8E8E8"}
            isDisabled={!canNextPage}
            onClick={nextPage}
            borderRadius={"full"}
            cursor={"pointer"}
            _hover={{
              backgroundColor: '#63342b7b'
            }}
            icon={<ChevronRightIcon w={6} h={6} />}
            mr={2}
          />
        </Tooltip>
        <Tooltip label={"Última página"}>
          <IconButton
            aria-label="last-page"
            backgroundColor={"#63342B"}
            textColor={"#E8E8E8"}
            isDisabled={!canNextPage}
            onClick={() => gotoPage(pageCount - 1)}
            borderRadius={"full"}
            cursor={"pointer"}
            _hover={{
              backgroundColor: '#63342b7b'
            }}
            icon={<ArrowRightIcon w={3} h={3} />}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}
