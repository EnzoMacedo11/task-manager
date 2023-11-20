import styled from "styled-components";

import { useContext, useState } from "react";
import {
  IoLogOutOutline,
  IoMenu,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import Sidebar from "../sidebar/index.js";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/index.js";

export default function Header() {
  const { userData, setUserData } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const Navigate = useNavigate();

  function SidebarToogle() {
    if (visible === true) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }

  if (userData) {
    if (userData.admin === true) {
      return (
        <>
          <Sidebar visible={visible} />
          <Container>
            <Left>
              <IoMenu size={22} onClick={SidebarToogle} />
              <LeftText> Categorias </LeftText>
              {/* <StyleSelect></StyleSelect> */}
             
            </Left>
            <div
              onClick={() => {
                Navigate("/");
              }}
            >
              Task-Manager
            </div>

            <IoShieldCheckmarkOutline size={18} style={{ marginLeft: "5px" }} />
            <Right >
                <RightText style={{ marginRight: "25px" }}  >Buscar</RightText>
            {/* <StyleInput/> */}
              <IoLogOutOutline onClick={() => setUserData(null)} size={22} />
            </Right>
          </Container>
        </>
      );
    } else {
      return (
        <>
        <Sidebar visible={visible} />
        <Container>
          <Left>
            <IoMenu size={22} onClick={SidebarToogle} />
            <LeftText> Categorias: </LeftText>
            <StyleSelect></StyleSelect>
           
          </Left>
          <div
            onClick={() => {
              Navigate("/");
            }}
          >
            Task-Manager
          </div>
          <Right>
              <RightText>Buscar: </RightText>
          <StyleInput/>
            <IoLogOutOutline onClick={() => setUserData(null)} size={22} />
          </Right>
        </Container>
      </>
      );
    }
  } else {
    return <Container> Task-Manager</Container>;
  }
}

const Container = styled.div`
  display: flex;
  top: 0;
  width: 100%;
  height: 8vh;

  background-color: #1f5884;
  align-items: center;
  justify-content: center;
  color: whitesmoke;
  font-size: 16px;

  @media (min-width: 600px) {
    font-size: 26px;
  }
`;

const Right = styled.div`
  position: absolute;
  display:flex;
  justify-content:right;
  width:20%;
  height:5%;

  align-items:center;
  right: 3%;
`;

const RightText = styled.text`
font-size:20px;
color:whitesmoke;

margin-right:1%;
`

const Left = styled.div`
  position: absolute;
  display:flex;
  width:25%;
  height:5%;

  align-items:center;
  left: 3%;
`;
const LeftText = styled.text`
font-size:20px;
color:whitesmoke;
margin-left:15%;
margin-right:1%;
`

const StyleSelect = styled.select`
width:65%;
height:50%;
border-radius:5px;
`
const StyleInput = styled.input`
width:65%;
margin-right:7%;
border-radius:5px;
height:50%;
`
