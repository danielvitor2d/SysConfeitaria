import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Input,
  ModalFooter,
  Button,
  Text,
  Table as ChakraUITable,
  Select as ChakraUISelect,
  Badge,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Divider,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import Select, {
  components,
  OptionProps,
  StylesConfig,
  MultiValueProps,
  MultiValueGenericProps,
  ControlProps,
  SingleValueProps,
} from "react-select";
import AsyncSelect from "react-select/async";

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  bagdeColor,
  Client,
  ClientOption,
  colorScheme,
  PaymentMethod,
  paymentMethod,
  SaleStatus,
  saleStatus,
} from "../../../../types";
import { getDatetimeLocalFormatted } from "../../../../util/getDate";
import makeData from "../../../Clients/makeData";
import SelectPaymentMethod from "./components/SelectPaymentMethod";
import SelectSaleStatus from "./components/SelectSaleStatus";
import SelectClient from "./components/SelectClient";

interface MakeSaleProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function MakeSale({ isOpen, onOpen, onClose }: MakeSaleProps) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"6xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>Cadastrar venda</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <HStack gap={20}>
              <VStack alignItems={"flex-start"}>
                <HStack>
                  <Text minWidth={"120px"} maxWidth={"120px"}>
                    Data
                  </Text>
                  <Input
                    defaultValue={getDatetimeLocalFormatted(
                      new Date(Date.now())
                    )}
                    type={"datetime-local"}
                  />
                </HStack>
                <SelectClient />
              </VStack>
              <VStack alignItems={"flex-start"}>
                <SelectPaymentMethod />
                <SelectSaleStatus />
              </VStack>
            </HStack>
            <ChakraUITable />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            backgroundColor={"#63342B"}
            _hover={{ backgroundColor: "#502A22" }}
            _active={{ backgroundColor: "#482017" }}
            marginRight={3}
          >
            <Text
              color={"white"}
              fontSize={"15px"}
              fontWeight={"500"}
              fontFamily={"Montserrat"}
            >
              Salvar
            </Text>
          </Button>
          <Button onClick={onClose}>
            <Text
              color={"black"}
              fontSize={"15px"}
              fontWeight={"500"}
              fontFamily={"Montserrat"}
            >
              Cancelar
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
