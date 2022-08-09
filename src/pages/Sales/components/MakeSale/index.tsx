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
} from "@chakra-ui/react";
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  bagdeColor,
  PaymentMethod,
  paymentMethod,
  SaleStatus,
  saleStatus,
} from "../../../../types";
import { getDatetimeLocalFormatted } from "../../../../util/getDate";
import makeData from "../../../Clients/makeData";

interface MakeSaleProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const animatedComponents = makeAnimated()

export default function MakeSale({ isOpen, onOpen, onClose }: MakeSaleProps) {
  const [clients, setClients] = useState(() => makeData(15))

  const [newSalePaymentMethod, setNewSalePaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [newSaleStatus, setNewSaleStatus] = useState<SaleStatus | null>(null);

  useEffect(() => {
    console.log(getDatetimeLocalFormatted(new Date(Date.now())));
  }, []);

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
                  <Text width={"120px"}>Data</Text>
                  <Input
                    defaultValue={getDatetimeLocalFormatted(
                      new Date(Date.now())
                    )}
                    type={"datetime-local"}
                  />
                </HStack>
                <HStack>
                  <Text width={"120px"}>Cliente</Text>
                  <Select
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    options={clients}
                  />
                </HStack>
              </VStack>
              <VStack alignItems={"flex-start"}>
                <HStack>
                  <Text width={"120px"}>Pagamento</Text>
                  <Menu closeOnSelect={false}>
                    <MenuButton 
                      as={Button}
                      type={"submit"}
                      backgroundColor={"white"}
                      borderWidth={"2px"}
                      rightIcon={
                        <FontAwesomeIcon icon={faAngleDown} color={"black"} />
                      }
                    >
                      <Text
                        color={"black"}
                        fontSize={"15px"}
                        fontWeight={"500"}
                        fontFamily={"Montserrat"}
                      >
                        {newSalePaymentMethod === null
                          ? "Selecione"
                          : paymentMethod[
                              newSalePaymentMethod as PaymentMethod
                            ]}
                      </Text>
                    </MenuButton>
                    <MenuList minWidth="240px">
                      <MenuOptionGroup
                        title="Meios de pagamento"
                        type="radio"
                        onChange={(value) => {
                          setNewSalePaymentMethod(value as PaymentMethod);
                        }}
                      >
                        {Object.entries(paymentMethod).map(
                          (value: string[]) => (
                            <MenuItemOption key={value[0]} value={value[0]}>
                              {value[1]}
                            </MenuItemOption>
                          )
                        )}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                </HStack>
                <HStack>
                  <Text width={"120px"}>Status</Text>
                  <Menu closeOnSelect={false}>
                    <MenuButton
                      as={Button}
                      type={"submit"}
                      backgroundColor={"white"}
                      borderWidth={"2px"}
                      rightIcon={
                        <FontAwesomeIcon icon={faAngleDown} color={"black"} />
                      }
                    >
                      <Text
                        color={"black"}
                        fontSize={"15px"}
                        fontWeight={"500"}
                        fontFamily={"Montserrat"}
                      >
                        {newSaleStatus === null ? (
                          "Selecione"
                        ) : (
                          <Badge colorScheme={bagdeColor[newSaleStatus]}>
                            {saleStatus[newSaleStatus as SaleStatus]}
                          </Badge>
                        )}
                      </Text>
                    </MenuButton>
                    <MenuList minWidth="240px">
                      <MenuOptionGroup
                        title="Status da venda"
                        type="radio"
                        onChange={(value) => {
                          setNewSaleStatus(value as SaleStatus);
                        }}
                      >
                        {Object.entries(saleStatus).map((value: string[]) => (
                          <MenuItemOption key={value[0]} value={value[0]}>
                            <Badge
                              colorScheme={bagdeColor[value[0] as SaleStatus]}
                            >
                              {value[1]}
                            </Badge>
                          </MenuItemOption>
                        ))}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                </HStack>
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
