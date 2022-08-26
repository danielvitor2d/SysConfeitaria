import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth } from "firebase/auth";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../contexts/AuthContext";
import GlobalContext from "../../contexts/GlobalContext";
import { formatCellphone } from "../../util/formatCellphone";

interface FormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export default function Settings() {
  const { signIn, changePassword } = useContext(AuthContext);

  const { phone, ruaNumero, cidadeEstado, updatePhone, updateRuaNumero, updateCidadeEstado } = useContext(GlobalContext)

  const [newPhone, setNewPhone] = useState(phone)
  const [newRuaNumero, setNewRuaNumero] = useState(ruaNumero)
  const [newCidadeEstado, setNewCidadeEstado] = useState(cidadeEstado)

  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassOldPassword, setShowPassOldPassword] =
    useState<boolean>(false);
  const [showPassNewPassword, setShowPassNewPassword] =
    useState<boolean>(false);

  const handleClickEyeOld = () => {
    setShowPassOldPassword(!showPassOldPassword);
  };

  const handleClickEyeNew = () => {
    setShowPassNewPassword(!showPassNewPassword);
  };

  async function handleChangeInvoiceData() {
    const phoneToUpdate = newPhone.replace(/[\D]+/g, "").replace(/[^0-9]/, "")
    if (phoneToUpdate.length === 0) {
      toast({
        title: "Telefone não pode estar vazio",
        description: "Por favor, verifique",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
      return;
    }
    if (newRuaNumero.length === 0) {
      toast({
        title: "Campo Rua/Número não pode estar vazio",
        description: "Por favor, verifique",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
      return;
    }
    if (newCidadeEstado.length === 0) {
      toast({
        title: "Campo Cidade/Estado não pode estar vazio",
        description: "Por favor, verifique",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
      return;
    }
    const toastId = toast({
      title: "Verificando",
      description: "Salvando dados",
      isClosable: true,
      status: "loading",
      variant: "left-accent",
      position: "bottom-right",
    });
    await updatePhone(phoneToUpdate)
    await updateRuaNumero(newRuaNumero)
    await updateCidadeEstado(newCidadeEstado)
    toast.close(toastId)
    toast({
      title: "Dados salvos",
      description: "Dados atualizados",
      isClosable: true,
      status: "success",
      variant: "left-accent",
      position: "bottom-right",
    });
  }

  async function handleChangePassword(data: FormData) {
    if (data.new_password !== data.confirm_password) {
      toast({
        title: "Senhas diferentes",
        description: "Por favor, verifique as senhas",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
      return;
    }

    const auth = getAuth();

    const passwordIsCorrect = await signIn(
      auth?.currentUser?.email as string,
      data.old_password
    );

    if (passwordIsCorrect) {
      if (await changePassword(data.new_password)) {
        toast({
          title: "Dados atualizados",
          description: "Senha atualizada",
          isClosable: true,
          status: "success",
          variant: "left-accent",
          position: "bottom-right",
        });
        clearFields();
      } else {
        toast({
          title: "Erro no sistema",
          description: "Erro ao alterar senha. Tente novamente",
          isClosable: true,
          status: "warning",
          variant: "left-accent",
          position: "bottom-right",
        });
      }
    } else {
      toast({
        title: "Dados incorretos",
        description: "A senha informada está incorreta. Tente novamente",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
    }
  }

  const clearFields = () => {
    setValue("confirm_password", "");
    setValue("new_password", "");
    setValue("old_password", "");
  };

  return (
    <Box>
      <HStack>
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <Flex
            margin={"20px"}
            flexDirection={"column"}
            alignItems={"center"}
            width={"420px"}
            height={"auto"}
            paddingY={"40px"}
            paddingX={"50px"}
            bg={"#E8E8E8"}
            boxShadow={"2xl"}
            borderRadius={"15px"}
            justifyContent={"space-evenly"}
            gap={30}
          >
            <Text
              fontSize={"25px"}
              textAlign={"center"}
              fontWeight={"600"}
              fontFamily={"Montserrat"}
            >
              {"Trocar senha"}
            </Text>
            <VStack
              flexDirection={"column"}
              alignItems={"center"}
              width={"100%"}
              gap={5}
            >
              <VStack width={"100%"}>
                <Text
                  color={"#000"}
                  width={'100%'}
                  fontSize={"12px"}
                  fontWeight={"500"}
                  textAlign={'left'}
                  fontFamily={"Montserrat"}
                >
                  {"Senha antiga"}
                </Text>
                <InputGroup>
                  <Input
                    {...register("old_password", { required: true })}
                    width={"full"}
                    type={showPassOldPassword ? "text" : "password"}
                    borderRadius={"8px"}
                    focusBorderColor={"#623329"}
                    borderColor={!errors.old_password ? "#C4C4C4" : "red"}
                    borderWidth={"1px"}
                    placeholder={"Senha antiga"}
                    fontFamily={"Montserrat, sans-serif"}
                    fontWeight={"500"}
                    fontSize={"15px"}
                    textColor={"black"}
                  />
                  <InputRightElement
                    children={
                      <FontAwesomeIcon
                        icon={showPassOldPassword ? faEye : faEyeSlash}
                        cursor={"pointer"}
                        onClick={handleClickEyeOld}
                      />
                    }
                  />
                </InputGroup>
                {errors.old_password ? (
                  <Text fontSize={"10px"} textColor={"red"} alignSelf={"start"}>
                    Campo senha antiga é obrigatório
                  </Text>
                ) : (
                  <></>
                )}
              </VStack>
              <VStack width={"100%"}>
                <Text
                  color={"#000"}
                  width={'100%'}
                  fontSize={"12px"}
                  fontWeight={"500"}
                  textAlign={'left'}
                  fontFamily={"Montserrat"}
                >
                  {"Nova senha"}
                </Text>
                <InputGroup>
                  <Input
                    {...register("new_password", { required: true })}
                    width={"full"}
                    type={showPassNewPassword ? "text" : "password"}
                    borderRadius={"8px"}
                    focusBorderColor={"#623329"}
                    borderColor={!errors.new_password ? "#C4C4C4" : "red"}
                    borderWidth={"1px"}
                    placeholder={"Nova senha"}
                    fontFamily={"Montserrat, sans-serif"}
                    fontWeight={"500"}
                    fontSize={"15px"}
                    textColor={"black"}
                  />
                  <InputRightElement
                    children={
                      <FontAwesomeIcon
                        icon={showPassNewPassword ? faEye : faEyeSlash}
                        cursor={"pointer"}
                        onClick={handleClickEyeNew}
                      />
                    }
                  />
                </InputGroup>
                {errors.new_password ? (
                  <Text fontSize={"10px"} textColor={"red"} alignSelf={"start"}>
                    Campo nova senha é obrigatório
                  </Text>
                ) : (
                  <></>
                )}
              </VStack>
              <VStack width={"100%"}>
                <Text
                  color={"#000"}
                  width={'100%'}
                  fontSize={"12px"}
                  fontWeight={"500"}
                  textAlign={'left'}
                  fontFamily={"Montserrat"}
                >
                  {"Confirmar nova senha"}
                </Text>
                <InputGroup>
                  <Input
                    {...register("confirm_password", { required: true })}
                    width={"full"}
                    type={showPassNewPassword ? "text" : "password"}
                    borderRadius={"8px"}
                    focusBorderColor={"#623329"}
                    borderColor={!errors.confirm_password ? "#C4C4C4" : "red"}
                    borderWidth={"1px"}
                    placeholder={"Confirmar nova senha"}
                    fontFamily={"Montserrat, sans-serif"}
                    fontWeight={"500"}
                    fontSize={"15px"}
                    textColor={"black"}
                  />
                  <InputRightElement
                    children={
                      <FontAwesomeIcon
                        icon={showPassNewPassword ? faEye : faEyeSlash}
                        cursor={"pointer"}
                        onClick={handleClickEyeNew}
                      />
                    }
                  />
                </InputGroup>
                {errors.confirm_password ? (
                  <Text fontSize={"10px"} textColor={"red"} alignSelf={"start"}>
                    Campo confirmar senha é obrigatório
                  </Text>
                ) : (
                  <></>
                )}
              </VStack>
              <Button
                width={"100%"}
                type={"submit"}
                backgroundColor={"#63342B"}
                _hover={{ backgroundColor: "#502A22" }}
                _active={{ backgroundColor: "#482017" }}
                rightIcon={<ChevronRightIcon color={"white"} />}
              >
                <Text
                  color={"white"}
                  fontSize={"14px"}
                  fontWeight={"500"}
                  fontFamily={"Montserrat"}
                >
                  {"Salvar"}
                </Text>
              </Button>
            </VStack>
          </Flex>
        </form>
        <Flex
          margin={"20px"}
          flexDirection={"column"}
          alignItems={"center"}
          width={"420px"}
          height={"auto"}
          paddingY={"40px"}
          paddingX={"50px"}
          bg={"#E8E8E8"}
          boxShadow={"2xl"}
          borderRadius={"15px"}
          justifyContent={"space-evenly"}
          gap={30}
        >
          <Text
            fontSize={"25px"}
            textAlign={"center"}
            fontWeight={"600"}
            fontFamily={"Montserrat"}
          >
            {"Dados da Nota"}
          </Text>
          <VStack
            flexDirection={"column"}
            alignItems={"center"}
            width={"100%"}
            gap={5}
          >
            <VStack width={"100%"}>
              <Text
                color={"#000"}
                width={'100%'}
                fontSize={"12px"}
                fontWeight={"500"}
                textAlign={'left'}
                fontFamily={"Montserrat"}
              >
                {"Telefone na nota"}
              </Text>
              <Input
                width={"full"}
                type={"text"}
                borderRadius={"8px"}
                focusBorderColor={"#623329"}
                borderColor={"#C4C4C4"}
                borderWidth={"1px"}
                placeholder={"Novo telefone"}
                defaultValue={formatCellphone(phone)}
                onChange={(e: any) => {
                  setNewPhone(e.target.value)
                }}
                fontFamily={"Montserrat, sans-serif"}
                fontWeight={"500"}
                fontSize={"15px"}
                textColor={"black"}
              />
            </VStack>
            <VStack width={"100%"}>
              <Text
                color={"#000"}
                width={'100%'}
                fontSize={"12px"}
                fontWeight={"500"}
                textAlign={'left'}
                fontFamily={"Montserrat"}
              >
                {"Rua/Número"}
              </Text>
              <Input
                width={"full"}
                type={"text"}
                borderRadius={"8px"}
                focusBorderColor={"#623329"}
                borderColor={"#C4C4C4"}
                borderWidth={"1px"}
                placeholder={"Rua/Número"}
                defaultValue={ruaNumero}
                onChange={(e: any) => {
                  setNewRuaNumero(e.target.value)
                }}
                fontFamily={"Montserrat, sans-serif"}
                fontWeight={"500"}
                fontSize={"15px"}
                textColor={"black"}
              />
            </VStack>
            <VStack width={"100%"}>
              <Text
                color={"#000"}
                width={'100%'}
                fontSize={"12px"}
                fontWeight={"500"}
                textAlign={'left'}
                fontFamily={"Montserrat"}
              >
                {"Cidade/Estado"}
              </Text>
              <Input
                width={"full"}
                type={"text"}
                borderRadius={"8px"}
                focusBorderColor={"#623329"}
                borderColor={"#C4C4C4"}
                borderWidth={"1px"}
                placeholder={"Cidade/Estado"}
                defaultValue={cidadeEstado}
                onChange={(e: any) => {
                  setNewCidadeEstado(e.target.value)
                }}
                fontFamily={"Montserrat, sans-serif"}
                fontWeight={"500"}
                fontSize={"15px"}
                textColor={"black"}
              />
            </VStack>
            <Button
              width={"100%"}
              onClick={() => handleChangeInvoiceData()}
              backgroundColor={"#63342B"}
              _hover={{ backgroundColor: "#502A22" }}
              _active={{ backgroundColor: "#482017" }}
              rightIcon={<ChevronRightIcon color={"white"} />}
            >
              <Text
                color={"white"}
                fontSize={"14px"}
                fontWeight={"500"}
                fontFamily={"Montserrat"}
              >
                {"Salvar"}
              </Text>
            </Button>
          </VStack>
        </Flex>
      </HStack>
    </Box>
  );
}
