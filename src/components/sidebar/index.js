import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context";


export default function Sidebar(props) {
  const { userData } = useContext(UserContext);
  const { visible } = props;
  const Navigate = useNavigate();

  if (userData.admin === true) {
    return (
      <Container visible={visible}>
         <Box onClick={() => Navigate("/vehicles")}>
         
         <Title>Links</Title>
       </Box>

       <Box onClick={() => Navigate("/scanner")}>
          {" "}
          <Title>Usuários</Title>
        </Box>

        <Box onClick={() => Navigate("/search")}>
          
          <Title>Criar Usuário</Title>
        </Box>


        <Box onClick={() => Navigate("/vehicles")}>
         
          <Title>Grupos</Title>
        </Box>

        <Box onClick={() => Navigate("/history")}>
          <Title> Gerenciar Links</Title>
        </Box>

            </Container>
    );
  }
  return (
    <Container visible={visible}>
      <Box onClick={() => Navigate("/vehicles")}>
        
        <Title>Links</Title>
      </Box>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  align-items: center;
  display: flex;
  flex-direction: column;
  z-index: 3;
  width: 60%;
  margin-top: 8vh;
  height: 90%;
  background-color: #1f5884;
  border-bottom-right-radius: 20px;
  transition: transform 0.6s ease;
  transform: translateX(${(props) => (props.visible ? "0" : "-110%")});
  @media (min-width: 650px) {
    width: 15%;
    height: 90%;
  }
`;

const Box = styled.div`
  display: flex;

  width: 80%;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
`;

const Title = styled.text`
  font-size: 20px;
  margin-left: 3px;

  color: whitesmoke;
`;
