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
} from "@chakra-ui/react";
import Select, { StylesConfig } from 'react-select'
import AsyncSelect from 'react-select/async'
import makeAnimated from 'react-select/animated'

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  bagdeColor,
  Client,
  colorScheme,
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
  const [clients, setClients] = useState(() => {
    const data = makeData(50)
    console.log(data)
    return data.map((client: Client) => {
      Object.assign(client, {
        value: client.clientCode,
        label: client.clientName
      })
      // console.log(client)
      return { ...client }
    })
  })

  const filterClients = (inputValue: string) => {
    return clients.filter((client: Client) => true
      // client.clientName.toLowerCase().includes(inputValue.toLowerCase())
    )
  }

  const promiseOptions = (inputValue: string) => {
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterClients(inputValue))
      }, 500)
    })
  }

  const clientStyles: StylesConfig = {
    control: (styles) => ({ 
      ...styles,
      boxShadow: 'unset',
      width: '250px',
      backgroundColor: 'white',
      ':focus': {
        ...styles[':focus'],
        borderColor: '#63342B',
        // backgroundColor: 'blue'
      },
      ':hover': {
        ...styles[':hover'],
        borderColor: '#b9b9b9',
        // backgroundColor: 'red'
      },
      ':active': {
        ...styles[':active'],
        borderColor: '#63342B',
        // backgroundColor: 'blue'
      },
      ':focus-visible': {
        ...styles[':focus-visible'],
        borderColor: '#63342B',
      },
      ':focus-within': {
        ...styles[':focus-within'],
        borderColor: '#63342B',
      },
      cursor: 'pointer'
    }),
    option: (styles) => ({
      ...styles,
      cursor: 'pointer'
    })
  }

  const [newSalePaymentMethod, setNewSalePaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [newSaleStatus, setNewSaleStatus] = useState<SaleStatus | null>(null);

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
                  <Text minWidth={"120px"} maxWidth={"120px"}>Data</Text>
                  <Input
                    defaultValue={getDatetimeLocalFormatted(
                      new Date(Date.now())
                    )}
                    type={"datetime-local"}
                  />
                </HStack>
                <HStack>
                  <Text minWidth={"120px"} maxWidth={"120px"}>Cliente</Text>
                  <Select
                    placeholder={
                      <Text
                        color={"black"}
                        fontSize={"15px"}
                        fontWeight={"500"}
                        fontFamily={"Montserrat"}
                      >
                        Selecione
                      </Text>
                    }
                    blurInputOnSelect={true}
                    autoFocus={false}
                    styles={clientStyles}
                    // cacheOptions
                    // defaultOptions
                    // components={animatedComponents}
                    options={clients}
                  />
                </HStack>
              </VStack>
              <VStack alignItems={"flex-start"}>
                <HStack>
                  <Text minWidth={"120px"} maxWidth={"120px"}>Pagamento</Text>
                  <Menu closeOnSelect={true}>
                    <MenuButton
                      as={Button}
                      type={"submit"}
                      _hover={{
                        borderColor: '#b9b9b9',
                      }}
                      _active={{
                        borderColor: '#63342B',
                        borderWidth: '2px',
                        '.font-awesome-icon': {
                          color: '#525252'
                        },
                      }}
                      backgroundColor={"white"}
                      borderColor={'#CCCCCC'}
                      borderWidth={"2px"}
                      borderRadius={'4px'}
                      width={'220px'}
                      textAlign={'start'}
                      sx={{
                        '.font-awesome-icon:hover': {
                          color: '#929292'
                        },
                      }}
                      rightIcon={
                        <Flex 
                          gap={2}
                          alignItems={'center'}
                        >
                          <Divider
                            height={'20px'}
                            marginRight={1}
                            borderColor={'#CCCCCC'}
                            orientation={'vertical'} 
                          />
                          <FontAwesomeIcon
                            className="font-awesome-icon"
                            icon={faAngleDown}
                            color={"#CCCCCC"}
                          />
                        </Flex>
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
                  <Text minWidth={"120px"} maxWidth={"120px"}>Status</Text>
                  <Menu closeOnSelect={true}>
                    <MenuButton
                      as={Button}
                      type={"submit"}
                      _hover={{
                        borderColor: '#b9b9b9',
                      }}
                      _active={{
                        borderColor: '#63342B',
                        borderWidth: '2px',
                        '.font-awesome-icon': {
                          color: '#525252'
                        },
                      }}
                      backgroundColor={"white"}
                      borderColor={'#CCCCCC'}
                      borderWidth={"2px"}
                      borderRadius={'4px'}
                      width={'220px'}
                      textAlign={'start'}
                      sx={{
                        '.font-awesome-icon:hover': {
                          color: '#929292'
                        },
                      }}
                      rightIcon={
                        <Flex 
                          gap={2}
                          alignItems={'center'}
                        >
                          <Divider
                            height={'20px'}
                            marginRight={1}
                            borderColor={'#CCCCCC'}
                            orientation={'vertical'} 
                          />
                          <FontAwesomeIcon
                            className="font-awesome-icon"
                            icon={faAngleDown}
                            color={"#CCCCCC"}
                          />
                        </Flex>
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
