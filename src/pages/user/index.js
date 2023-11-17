import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/header";
import UserContext from "../../components/context";
import {
  IoPersonAdd,
  IoPersonRemoveOutline,
  IoShieldCheckmarkOutline,
  IoMenu
} from "react-icons/io5";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function User() {
  const { userData, setUserData } = useContext(UserContext);
  const Navigate = useNavigate();
  const [companyGroupsVisible, setCompanyGroupsVisible] = useState(null);
  const [userComapanyCode, setUserCompanyCode] = useState("");
  const [commumGroups, setComumGroups] = useState([]);
  const [company, setCompany] = useState(null);
  const [userSelected, setUserSelected] = useState(null);
  const [user, setUser] = useState(null);
  console.log(user)

  const [groupsLinksVisible,setGroupsLinksVisible] = useState(false)
  const [groupSelected,setGroupSelected]=useState("")
  console.log(groupSelected)

  const [links,setLinks] = useState()
  const [comumLinks, setComumLinks] = useState([]);

  useEffect(() => {
    if (!userData) {
      Navigate("/login");
    }
  }, [userData, Navigate]);

  useEffect(() => {
    if (userSelected) {
      getUser();
      setCompanyGroupsVisible(false);
      setGroupsLinksVisible(false)
    }
  }, [userSelected]);

  useEffect(() => {
    ComumGroups();
  }, [user, company]);

  useEffect(() => {
    ComumLinks();
  }, [user, links]);
  

  async function getUser() {
    try {
      const response = await axios.get("http://192.168.0.14:4001/user/getuser", {
        headers: { id: userSelected },
      });
      setUser(response.data);
      ComumGroups();
    } catch (error) {
      console.log(error);
    }
  }

  async function GetUsersbyCompany() {
    try {
      const response = await axios.get("http://192.168.0.14:4001/user/getusersbycompanycode", {
        headers: { code: userComapanyCode },
      });
      setCompany(response.data);
    } catch (error) {
      console.log(error);
      setCompany(null);
      setUser(null);
      alert("Empresa não encontrada");
    }
  }

  function CompanyGroupsVisible() {
    setCompanyGroupsVisible((prevVisible) => !prevVisible);
    setGroupsLinksVisible(false)
  }

  function ComumGroups() {
    if (user && company) {
      const GroupUser = user.groups;
      const CompanyUser = company.companyGroups;
      const ComumGroups = [];

      for (let i = 0; i < CompanyUser.length; i++) {
        for (let j = 0; j < GroupUser.length; j++) {
          if (CompanyUser[i].id === GroupUser[j].id) {
            //console.log(`O id:${CompanyUser[i].id} pertence a ambos`);
            ComumGroups.push(CompanyUser[i].id);
          }
        }
      }
      setComumGroups(ComumGroups);
      //console.log("comum", commumGroups);
    }
  }

  function ComumLinks() {
    if (user && links) {
      
      const userLinksIds = user.links.map((link) => link.id);
     
      const LinksId = links.map((link) => link.id);
     

      const ComumLinks = userLinksIds.filter((id) => LinksId.includes(id));
      setComumLinks(ComumLinks)
      console.log("Links em comum:", ComumLinks);
    }
}

  async function AddGroup(groupId) {
    const data = {
      userId: userSelected,
      groupId
    };

    try {
      await axios.post("http://192.168.0.14:4001/user/addusertogroup", data);
      
      getUser();
    } catch (error) {
      console.log(error.response.data);
    }
  }


  async function RemoveGroup(groupId) {
    const data = {
      userId: userSelected,
      groupId
    };

    try {
      await axios.post("http://192.168.0.14:4001/user/removeusertogroup", data);
      getUser();
    } catch (error) {
      console.log(error.response.data);
    }
  }
  
async function LinkToGroup(id){
  console.log("id",id)
  setGroupSelected(id)
  setGroupsLinksVisible((prevVisible) => !prevVisible);

  try{
    const response = await axios.get("http://192.168.0.14:4001/link/getall",{headers:{id}})
    setLinks(response.data)
    console.log(response.data)
  }catch(error){
    console.log(error)
  }


}

async function AddLinkToUser(id) {
  const data = {
    userId: user.id,
    id,
  };

  try {
    const response = await axios.post("http://192.168.0.14:4001/link/addlinktouser", data);
    console.log(response);
    setUser((prevUser) => ({
      ...prevUser,
      links: [...prevUser.links, response.data],
    }));

  } catch (error) {
    console.log(error);
  }
}

async function RemoveLinkToUser(id) {
  const data = {
    userId: user.id,
    id,
  };

  try {
    const response = await axios.post("http://192.168.0.14:4001/link/removelinktouser", data);
    console.log(response);
    getUser()
    setUser((prevUser) => ({
      ...prevUser,
      links: [...prevUser.links, response.data],
    }));

  } catch (error) {
    console.log(error);
  }
}




  return (
    <>
      <Header />
      <Container>
        <Main>
          <TopBox>
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
                <UserText>
                  Ativo: {user.active ? "Ativado" : "Desativado"}
                </UserText>

                <UserGroups onClick={CompanyGroupsVisible}>
                  <UserText>Grupos</UserText>
                  {user.groups.map((g) => (
                    <UserText key={g.id}>{g.name}</UserText>
                  ))}
                </UserGroups>
                <UserLinks>
                  <UserText>Links</UserText>
                  {user.links.map((g) => (
                    <UserText key={g.id}>{g.link}</UserText>
                  ))}
                </UserLinks>
              </UserBox>
              <CompanyGroups visible={companyGroupsVisible}>
                <UserText>Grupos Disponíveis</UserText>
                <GroupScroll>
                  {" "}
                  {company.companyGroups.map((g) => (
                    <GroupBox key={g.id}>
                      {commumGroups.includes(g.id) ? (
                        <IoPersonRemoveOutline onClick={() => RemoveGroup(g.id)} size={20} style={{ marginLeft: "15px" }} />
                      ) : (
                        <IoPersonAdd
                          onClick={() => AddGroup(g.id)}
                          size={20}
                          style={{ marginLeft: "15px" }}
                        />
                      )}
                      <UserText>{g.name}</UserText>
                      {commumGroups.includes(g.id) ? (
                        <IoMenu onClick={()=>LinkToGroup(g.id)}  style={{ marginRight: "10px" }} />
                      ) : (
                        <IoMenu onClick={()=>alert("Adicione ao grupo para poder dar acesso aos links")}  style={{ marginRight: "10px" }} />
                      )}
                    
                    </GroupBox>
                  ))}
                </GroupScroll>
              </CompanyGroups>
             
              <CompanyGroups visible={groupsLinksVisible}>
                <UserText>Links Disponíveis</UserText>
                <UserText>Grupo:</UserText>
                <GroupScroll>
                  {" "}
                  {links? (links.map((l) => (
                    <GroupBox key={l.id}>
                       {comumLinks.includes(l.id) ? (
                        <IoPersonRemoveOutline onClick={() => RemoveLinkToUser(l.id)} size={20} style={{ marginLeft: "15px" }} />
                      ) : (
                        <IoPersonAdd
                          onClick={()=>AddLinkToUser(l.id)}
                          size={20}
                          style={{ marginLeft: "15px" }}
                        />
                      )} 
                      <UserText>{l.link}</UserText>
                    </GroupBox>
                  ))):(null)}
                  
                </GroupScroll>
              </CompanyGroups>
            </UserContainer>
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
  width: 90%;
  height: 97%;
  background-color: black;
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
  margin-bottom: 6%;
  border-radius: 15px;
  padding-left: 5%;
`;

const UserBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 32%;
  height: 95%;
  border-radius: 20px;
  background-color: grey;
  margin-top: 1%;
  margin-left: 1%;
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
  border-top-right-radius:15px;
  border-top-left-radius:15px;
  background-color: #1f5884;
`;
const UserGroups = styled.div`
  margin-top: 15px;
  display: flex;
  background-color: #1f5884;
  flex-direction: column;
  align-items: center;
  width: 95%;
  height: 30%;
  border-radius: 15px;
`;
const UserLinks = styled.div`
  margin-top: 15px;
  display: flex;
  background-color: #1f5884;
  flex-direction: column;
  align-items: center;
  width: 95%;
  height: 45%;
  border-radius: 15px;
`;
const CompanyGroups = styled.div`
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 32%;
  height: 95%;
  border-radius: 20px;
  background-color: grey;
  margin-top: 1%;
  margin-left: 1%;
`;

const UserContainer = styled.div`
  background-color: black;
  display: flex;
  width: 100%;
  height: 85%;
`;

const GroupBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1f5884;
  width: 100%;
  height: 15%;
  margin-bottom: 10px;
  border-radius: 20px;
`;
const GroupScroll = styled.div`
  margin-top: 15px;
  width: 95%;
  height: 98%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
  }
`;
