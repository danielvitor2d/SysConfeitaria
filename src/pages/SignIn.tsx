import { useNavigate } from "react-router-dom";

import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Input, Text, useToast, VStack } from "@chakra-ui/react";

import { ReactComponent as Logo } from "../assets/login.svg";
import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import AuthContext from "../contexts/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface FormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const toast = useToast();

  const { signed, login } = useContext(AuthContext);

  async function handleSignIn(data: FormData) {
    const logged = await login(data.email, data.password);

    if (logged) {
      toast({
        title: "Dados corretos",
        description: "Usuário logado com sucesso",
        isClosable: true,
        status: "success",
        variant: "left-accent",
        position: "bottom-right",
      });
      // navigate("/home");
    } else {
      toast({
        title: "Erro ao tentar fazer login",
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
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Já tá logado")
        if (signed) {
          navigate('/home')
        } else {
          navigate('/')
        }
      }
    });
  }, [signed])

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
          Login
        </Text>
        <Text
          fontSize={"14px"}
          fontFamily={"Montserrat, sans-serif"}
          fontWeight={"500"}
          textColor={"#323238"}
          textAlign={"center"}
          width={"60%"}
        >
          Seja bem-vindo! Faça login para ter acesso ao sistema
        </Text>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <VStack gap={2}>
            <VStack gap={0.7}>
              <Input
                {...register("email", { required: true })}
                width={"full"}
                type={"email"}
                borderRadius={"8px"}
                focusBorderColor={"#623329"}
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
              <Box>
                <Input
                  {...register("password", { required: true })}
                  width={"full"}
                  type={"password"}
                  borderRadius={"8px"}
                  focusBorderColor={"#623329"}
                  borderWidth={"1px"}
                  placeholder={"Senha"}
                  fontFamily={"Montserrat, sans-serif"}
                  fontWeight={"500"}
                  fontSize={"15px"}
                  textColor={"black"}
                />
                {errors.password ? (
                  <Text fontSize={"10px"} textColor={"red"} alignSelf={"start"}>
                    Campo senha é obrigatório
                  </Text>
                ) : (
                  <></>
                )}
                <Text
                  mt={"3px"}
                  cursor={"pointer"}
                  textAlign={"end"}
                  fontSize={"12px"}
                  textColor={"#323238"}
                  textDecorationLine={"underline"}
                >
                  Esqueceu sua senha?
                </Text>
              </Box>
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
                Entrar
              </Text>
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}
