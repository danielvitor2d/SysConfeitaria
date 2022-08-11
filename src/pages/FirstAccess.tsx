import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { ReactComponent as Logo } from "../assets/first_access.svg";
import AuthContext from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface FormData {
  email: string;
  password: string;
  confirm_password: string;
}

export default function FirstAccess() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showPass, setShowPass] = useState<boolean>(false);

  const handleClickEye = () => {
    setShowPass(!showPass);
  };

  const navigate = useNavigate();

  const toast = useToast();

  const { signed, signUp } = useContext(AuthContext);

  async function handleRegister(data: FormData) {
    if (data.password !== data.confirm_password) {
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

    const registered = await signUp(data.email, data.password);

    if (registered) {
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

  useEffect(() => {
    if (signed) {
      navigate("/");
    }
  }, [signed]);

  return (
    <Box
      backgroundColor={"white"}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      borderWidth={"1px"}
      borderColor={"#C4C4CC"}
      borderRadius={"20px"}
      margin={"auto"}
      height={"auto"}
      paddingBottom={"20px"}
      width={["90vw", "405px"]}
    >
      <VStack>
        <Logo width={"60%"} />
        <Text
          fontSize={"26px"}
          fontFamily={"Montserrat, sans-serif"}
          fontWeight={"700"}
        >
          Primeiro acesso
        </Text>
        <Text
          fontSize={"14px"}
          fontFamily={"Montserrat, sans-serif"}
          fontWeight={"500"}
          textColor={"#323238"}
          textAlign={"center"}
          width={"60%"}
        >
          Seja bem-vindo! Cadastre e-mail e senha para acessar o sistema
        </Text>
        <form onSubmit={handleSubmit(handleRegister)}>
          <VStack gap={2}>
            <VStack gap={0.7}>
              <Input
                {...register("email", { required: true })}
                width={"full"}
                type={"email"}
                borderRadius={"8px"}
                focusBorderColor={"#623329"}
                borderColor={!errors.email ? "#C4C4C4" : "red"}
                borderWidth={"1px"}
                placeholder={"E-mail"}
                fontFamily={"Montserrat, sans-serif"}
                fontWeight={"500"}
                fontSize={"15px"}
                textColor={"black"}
              />
              {errors.email ? (
                <Text fontSize={"10px"} textColor={"red"} alignSelf={"start"}>
                  Campo e-mail é obrigatório
                </Text>
              ) : (
                <></>
              )}
              <InputGroup>
                <Input
                  {...register("password", { required: true })}
                  width={"full"}
                  type={showPass ? "text" : "password"}
                  borderRadius={"8px"}
                  focusBorderColor={"#623329"}
                  borderColor={!errors.password ? "#C4C4C4" : "red"}
                  borderWidth={"1px"}
                  placeholder={"Senha"}
                  fontFamily={"Montserrat, sans-serif"}
                  fontWeight={"500"}
                  fontSize={"15px"}
                  textColor={"black"}
                />
                <InputRightElement
                  children={
                    <FontAwesomeIcon
                      icon={showPass ? faEye : faEyeSlash}
                      cursor={"pointer"}
                      onClick={handleClickEye}
                    />
                  }
                />
              </InputGroup>
              {errors.password ? (
                <Text fontSize={"10px"} textColor={"red"} alignSelf={"start"}>
                  Campo senha é obrigatório
                </Text>
              ) : (
                <></>
              )}
              <InputGroup>
                <Input
                  {...register("confirm_password", { required: true })}
                  width={"full"}
                  type={showPass ? "text" : "password"}
                  borderRadius={"8px"}
                  focusBorderColor={"#623329"}
                  borderColor={!errors.confirm_password ? "#C4C4C4" : "red"}
                  borderWidth={"1px"}
                  placeholder={"Confirmar senha"}
                  fontFamily={"Montserrat, sans-serif"}
                  fontWeight={"500"}
                  fontSize={"15px"}
                  textColor={"black"}
                />
                <InputRightElement
                  children={
                    <FontAwesomeIcon
                      icon={showPass ? faEye : faEyeSlash}
                      cursor={"pointer"}
                      onClick={handleClickEye}
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
              width={"full"}
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
        </form>
      </VStack>
    </Box>
  );
}
