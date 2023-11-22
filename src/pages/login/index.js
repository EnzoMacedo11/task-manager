import styled from "styled-components";
import Header from "../../components/header";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../../components/context/index.js";

export default function Login() {
  const { userData, setUserData } = useContext(UserContext);
  console.log(userData);
  const Navigate = useNavigate();
  const [code, setCode] = useState("");
  const [enrolment, setEnrolment] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (userData) {
      Navigate("/");
    }
  }, [userData]);

  async function SendForm() {
    const data = {
      companyCode:code,
      enrolment,
      password,
    };
    console.log(data)
    try {
      const response = await axios.post("http://192.168.0.14:4001/user/login", data);
      console.log(response.data);
      setUserData({
        id: response.data.id,
        name: response.data.name,
        enrolment: response.data.enrolment,
        active: response.data.active,
        admin: response.data.admin,
      });
      Navigate("/");
    } catch (error) {
      console.log(error.response);
      alert(error.response)
    }
  }

  function EnterKeyPress(event) {
    if (event.key === "Enter") {
      SendForm();
    }
  }

  return (
    <>
      <Header />
      <Container>
        <FormBox>
          <FormTitle>Login</FormTitle>
          <InputBox>
            <InputText>Empresa</InputText>
            <InputStyle
              placeholder="Digite o código da empresa"
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </InputBox>

          <InputBox>
            <InputText>Matrícula</InputText>
            <InputStyle
              placeholder="Digite sua matrícula"
              value={enrolment}
              onChange={(e) => setEnrolment(e.target.value)}
            />
          </InputBox>
          <InputBox>
            <InputText>Senha</InputText>
            <InputStyle
              onKeyDown={EnterKeyPress}
              placeholder="Digite sua senha"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputBox>
          <FormButton onClick={SendForm}>Login</FormButton>
          
        </FormBox>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 92vh;
  flex-direction: column;
  background: linear-gradient(to bottom,#1f5884, #3498db);
  align-items: center;
  justify-content: center;
`;
const FormBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 75%;
  border-radius: 15px;

  @media (min-width: 600px) {
    width: 580px;
  }
  @media (min-height: 800px) {
    height: 700px;
  }
`;
const FormTitle = styled.text`
  margin-bottom: 2%;
  font-size: 22px;
  color: whitesmoke;
`;
const InputBox = styled.div`
  display: flex;
  margin-top: 5%;
  flex-direction: column;

  width: 85%;
  height: 15%;
  justify-content: center;
  border-radius: 20px;
`;
const InputStyle = styled.input`
  width: 85%;
  height: 35%;
  margin-left: 2%;
  border-radius: 15px;
  padding-left: 5%;
`;
const InputText = styled.text`
  margin-left: 5%;
  margin-bottom: 2%;
  font-size: 16px;
  color: whitesmoke;
`;

const FormButton = styled.button`
  margin-top: 5%;
  margin-bottom: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35%;
  height: 6%;
  border-radius: 15px;
  font-size: 14px;
  background: #1f5884;
  color: whitesmoke;
`;
