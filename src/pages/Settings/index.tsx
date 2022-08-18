import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export default function Settings() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
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

  async function handleRegister(data: FormData) {
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

    const registeredWithSuccess = true; //await signUp(data.email, data.password);

    if (registeredWithSuccess) {
      toast({
        title: "Dados salvos",
        description: "Dados cadastrados com sucesso",
        isClosable: true,
        status: "success",
      });
    } else {
      toast({
        title: "Erro ao tentar salvar dados",
        description:
          "Por favor, verifique os dados e tente novamente mais tarde",
        isClosable: true,
        status: "warning",
        variant: "left-accent",
        position: "bottom-right",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <VStack width={"100%"} alignItems={"flex-start"} padding={"20px"}>
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          width={"30%"}
          height={"350px"}
          bg={"#E8E8E8"}
          padding={"10px"}
          boxShadow={"2xl"}
          borderRadius={"15px"}
          justifyContent={"space-evenly"}
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
            width={"95%"}
            gap={65}
          >
            <VStack gap={0.7} width={"80%"}>
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
                  Cadastrar
                </Text>
              </Button>
            </VStack>
          </VStack>
        </Flex>
      </VStack>
    </form>
  );
}
