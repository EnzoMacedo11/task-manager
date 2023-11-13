import { useContext, useEffect, useState } from "react";
import Header from "../../components/header";
import UserContext from "../../components/context";
import styled from "styled-components";
import axios from "axios";
import { Form, useNavigate } from "react-router-dom";

export default function User() {
  const { userData, setUserData } = useContext(UserContext);
  const Navigate = useNavigate();
  const [companyGroupsVisible,setCompanyGroupsVisible]=useState(null)
  const [userComapanyCode, setUserCompanyCode] = useState("");
  const [company, setCompany] = useState(null);
  const [userSelected, setUserSelected] = useState(null);
  const [user, setUser] = useState(null);
  console.log("comapany", company);
  console.log("userSel", userSelected);
  console.log("user", user);

  useEffect(() => {
    if (!userData) {
      Navigate("/login");
    }
  }, [userData]);

  useEffect(() => {
    getUser();
  }, [userSelected]);

  async function getUser() {
    await axios
      .get("http://192.168.0.14:4001/user/getuser", {
        headers: { id: userSelected },
      })
      .then((response) => {
        //console.log("getuser",response.data)
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function GetUsersbyCompany() {
    await axios
      .get("http://192.168.0.14:4001/user/getusersbycompanycode", {
        headers: { code: userComapanyCode },
      })
      .then((response) => {
        //console.log(response.data)
        setCompany(response.data);
      })
      .catch((error) => {
        console.log(error);
        setCompany(null);
        setUser(null);
        alert("Empresa não encontrada");
      });
  }

  function CompanyGroupsVisible(){
    if(companyGroupsVisible === true){
        setCompanyGroupsVisible(false)
    }else{
        setCompanyGroupsVisible(true)
    }
  }

  return (
    <>
      <Header />
      <Container>
        <Main>
          <TopBox>
            {" "}
            <DataBox>
              <CompanyTitle>Digite o codigo da empresa</CompanyTitle>
              <InputStyle
                placeholder="Digite o código da empresa"
                type="number"
                value={userComapanyCode}
                onChange={(e) => setUserCompanyCode(e.target.value)}
              />
              <FormButton onClick={GetUsersbyCompany}>Buscar</FormButton>
            </DataBox>
            {company !== null && (
              <SelectBox>
                <CompanyTitle>Empresa: {company.companyName}</CompanyTitle>
                <Select
                  value={userSelected}
                  onChange={(e) => setUserSelected(e.target.value)}
                >
                  <option>Selecione um usuário</option>
                  {company.users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} - Matrícula:{user.enrolment}
                    </option>
                  ))}
                </Select>
              </SelectBox>
            )}
          </TopBox>
                    {user !== null && (
                        <UserContainer>
            <UserBox>
              <UserText>Nome: {user.name}</UserText>
              <UserText>Matrícula: {user.enrolment}</UserText>
              <UserText>Ativo: {user.active ? "Ativado" : "Desativado"}</UserText>
              
              
            <UserGroups onClick={CompanyGroupsVisible}>
            <UserText>Grupos</UserText>
            {user.groups.map((g) => (
                    <UserText>{g.name}</UserText>
))}
            </UserGroups>
            <UserLinks>
            <UserText>Links</UserText>
            {user.groups.map((g) => (
                    <UserText>{g.name}</UserText>
))}
            </UserLinks>
             
            </UserBox>
            <CompanyGroups visible={companyGroupsVisible}>
                {company.companyGroups.map((g)=>(
                    <UserText>{g.name}</UserText>
                ))}
                </CompanyGroups></UserContainer>
          )}
         
         
          
        </Main>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 92vh;
  flex-direction: column;
  background: grey;
  align-items: center;
  justify-content: center;
`;
const Main = styled.div`
  display: flex;
  flex-direction: column;
  //align-items:center;
  //justify-content: center;

  width: 90%;
  height: 97%;
  background-color: green;
  border-radius: 15px;
`;

const DataBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 85%;
  border-radius: 20px;
  background-color: grey;
  margin: 10px;
`;

const CompanyTitle = styled.text`
  font-size: 22px;
  margin-bottom: 5px;
  color: whitesmoke;
`;
const InputStyle = styled.input`
  width: 70%;
  height: 20%;
  margin-top: 2%;
  margin-left: 2%;
  border-radius: 15px;
  padding-left: 5%;
`;

const FormButton = styled.button`
  margin-top: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35%;
  height: 20%;
  border-radius: 15px;
  font-size: 14px;
  background: #3498db;
  color: whitesmoke;
`;

const SelectBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 85%;
  border-radius: 20px;
  background-color: grey;
  margin: 10px;
`;

const Select = styled.select`
  width: 70%;
  height: 30%;
  margin-top: 2%;
  margin-left: 3%;
  margin-bottom:6%;
  border-radius: 15px;
  padding-left: 5%;
`;

const UserBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 85%;
  border-radius: 20px;
  background-color: grey;
  margin: 10px;
`;
const UserText = styled.text`
  font-size: 18px;
  color: whitesmoke;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 15%;
  background-color: purple;
`;
const UserGroups = styled.div`
margin-top:15px;
display:flex;
background-color:purple;
flex-direction:column;
//justify-content:center;
align-items:center;
width:95%;
height:30%;
border-radius:15px;
`
const UserLinks = styled.div`
margin-top:15px;
display:flex;
background-color:purple;
flex-direction:column;
//justify-content:center;
align-items:center;
width:95%;
height:45%;
border-radius:15px;
`
const CompanyGroups = styled.div`
 display: ${({ visible }) => (visible ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 85%;
  border-radius: 20px;
  background-color: grey;
  margin: 10px;
`;

const UserContainer = styled.div`
background-color:black;
display:flex;
width:100%;
height:85%;

`