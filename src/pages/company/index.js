import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/header";
import UserContext from "../../components/context";
import {
  IoPersonAdd,
  IoPersonRemoveOutline,
  IoShieldCheckmarkOutline,
  IoMenu,
  IoTrashSharp,
  IoPersonSharp,
} from "react-icons/io5";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Company() {
  const { userData, setUserData } = useContext(UserContext);
  const Navigate = useNavigate();
  const [companys, setCompanys] = useState(null);
  const [companysVisible, setCompanysVisible] = useState(true);
  const [groupsVisible, setGroupsVisible] = useState(true);
  const [linkvisible, setLinkVisible] = useState(true);
  const [usersVisible, setUsersVisible] = useState(true);
  const [companySelected, setCompanySelected] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");

  const [groupName, setGroupName] = useState("");

  const [userName, setUserName] = useState("");
  const [enrolment, setEnrolment] = useState("");
  const [cpf, setCpf] = useState("");

  const [groupSelected, setGroupSelected] = useState(null);
  const [groupSelectedName, setGroupSelectedName] = useState("");
  console.log("groupS", groupSelected);

  const [links, setLinks] = useState(null);
  console.log("links", links);
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  console.log(companyName);

  useEffect(() => {
    if (!userData) {
      Navigate("/login");
    }
  }, [userData, Navigate]);

  useEffect(() => {
    getCompany();
  }, []);

  useEffect(() => {
    setLinkVisible(true);
    setGroupsVisible(true);
    setUsersVisible(true);
    setGroupSelected(null);
  }, [companySelected]);

  useEffect(() => {
    GetLinks();
  }, [groupSelected]);

  async function getCompany() {
    try {
      const response = await axios.get(
        "http://192.168.0.14:4001/company/getall",
        { headers: { id: userData.id } }
      );
      console.log(response.data);
      setCompanys(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function CompanySelected(id) {
    const company = companys.find((c) => c.id === id);
    setCompanySelected(company);
    if (companySelected === company) {
      setCompanySelected(null);
    }
    console.log(company);
  }

  async function SendCompany() {
    if (companyCode.length < 3 || companyCode.length > 6) {
      alert("Insira um código de 3 até 6 digitos");
    } else if (companyName.length < 3 || companyName.length > 20) {
      alert("Insira um nome de 3 até 20 digitos");
    } else {
      const data = {
        name: companyName,
        code: companyCode,
        userId: userData.id,
      };

      try {
        const response = await axios.post(
          "http://192.168.0.14:4001/company/create",
          data
        );
        console.log("response", response.data);
        getCompany();
        setCompanyCode("");
        setCompanyName("");
        setCompanysVisible(true);
        setCompanySelected(null);
      } catch (error) {
        alert(error.response.data);
      }
    }
  }

  async function SendGroup() {
    if (groupName.length < 3 || groupName.length > 30) {
      alert("Insira um nome de 3 até 25 digitos");
    } else {
      const data = {
        name: groupName,
        companyId: companySelected.id,
      };

      try {
        const response = await axios.post(
          "http://192.168.0.14:4001/group/create",
          data
        );
        console.log("response", response.data);
        setCompanySelected({
          ...companySelected,
          Group: [...companySelected.Group, response.data],
        });
        getCompany();
        setGroupName("");
        setGroupsVisible(true);
      } catch (error) {
        console.log(error.response.data);
      }
    }
  }

  async function SendUser() {
    if (enrolment.length < 3 || enrolment.length > 8) {
      alert("Insira uma matrícula de 3 até 8 digitos");
    } else if (userName.length < 10 || userName.length > 40) {
      alert("Insira um nome de 10 até 40 digitos");
    } else if (cpf.length != 11) {
      alert("Insira um cpf de 11 digitos");
    } else {
      const data = {
        name: userName,
        enrolment,
        password: cpf,
        active: true,
        admin: false,
        companyCode: companySelected.code,
      };

      try {
        const response = await axios.post(
          "http://192.168.0.14:4001/user/create",
          data
        );
        console.log("response1111", response.data);
        setCompanySelected({
          ...companySelected,
          User: [...companySelected.User, response.data],
        });
        getCompany();
        setUserName("");
        setEnrolment("");
        setCpf("");
        setUsersVisible(true);
      } catch (error) {
        console.log(error.response.data);
      }
    }
  }

  async function AddLinktoGroup() {
    const data = {
      link,
      groupId: groupSelected,
      imageUrl,
      description,
    };

    try {
      const response = await axios.post(
        "http://192.168.0.14:4001/link/create",
        data
      );
      setLinks([...links, response.data]);
      console.log("response.data", response.data);
      setLinkVisible(true);
      setLink("");
      setImageUrl("");
      setDescription("");
    } catch (error) {
      alert(error.response.data);
    }
  }

  async function GetLinks() {
    try {
      const response = await axios.get("http://192.168.0.14:4001/link/getall", {
        headers: { id: groupSelected },
      });
      setLinks(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function UserActive(u){
    const data = {id: u.id}
    console.log(u)
    if(u.active){
      try{
        const response = await axios.post("http://192.168.0.14:4001/user/disable",data)
        console.log(response.data)
        const newArray = companySelected.User.map((u)=> u.id === response.data.id ? response.data : u)
        console.log(companySelected)
        console.log("aa",newArray)
        setCompanySelected({
          ...companySelected,
          User: newArray,
        });

        
      }catch(error){
        console.log(error)
      }
    }else{
      try{
        const response = await axios.post("http://192.168.0.14:4001/user/active",data)
        console.log(response.data)
        const newArray = companySelected.User.map((u)=> u.id === response.data.id ? response.data : u)
        console.log(companySelected)
        console.log("aa",newArray)
        setCompanySelected({
          ...companySelected,
          User: newArray,
        });
      }catch(error){
        console.log(error)
      }
    }

  }


  function SetGroupInfo(id, name) {
    if (groupSelected == id) {
      setGroupSelected(null);
    } else {
      setGroupSelected(id);
      setGroupSelectedName(name);
    }
  }

  function EnterKeyCompany(event) {
    if (event.key === "Enter") {
     SendCompany()
    }
  }

  function EnterKeyGroup(event) {
    if (event.key === "Enter") {
  SendGroup()
    }
  }

  function EnterKeyUser(event) {
    if (event.key === "Enter") {
     SendUser()
    }
  }
  function EnterKeyLink(event) {
    if (event.key === "Enter") {
      AddLinktoGroup()
    }
  }




  // Delete Functions

  async function DeleteLink(id) {
    const confirm = window.confirm(
      "Deseja realmente apagar o link? - Esta ação é irreversivel"
    );
    console.log(confirm);
    const data = {
      id,
    };
    if (confirm) {
      try {
        const response = await axios.post(
          "http://192.168.0.14:4001/link/remove",
          data
        );
        console.log(response.data);
        GetLinks();
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function DeleteUser(u) {
    const confirm = window.confirm(
      `Deseja realmente apagar o usuário ${u.name}? - Esta ação é irreversivel`
    );
    console.log(confirm);
    console.log(u)
    const data = {
      id: u.id,
    };
    if (confirm) {
      try {
        const response = await axios.post(
          "http://192.168.0.14:4001/user/remove",
          data
        );
        getCompany();
        setCompanySelected((prevCompany) => {
          const updatedUsers = prevCompany.User.filter(
            (user) => user.id !== u.id
          );
          return {
            ...prevCompany,
            User: updatedUsers,
          };
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function DeleteGroup(g) {
    const confirm = window.confirm(
      `Deseja realmente apagar o grupo ${g.name}? - \nEsta ação é irreversivel e irá deletar todos os links desse grupo`
    );
    console.log(confirm);
    const data = {
      id: g.id,
    };
    if (confirm) {
      try {
        const response = await axios.post(
          "http://192.168.0.14:4001/group/remove",
          data
        );
        console.log(response);
        getCompany()
        setCompanySelected((prevCompany) => {
          const updatedGroups = prevCompany.Group.filter(
            (group) => group.id !== g.id
          );

          return {
            ...prevCompany,
            Group: updatedGroups,
          };
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function DeleteCompany(c) {
    const confirm = window.confirm(
      `Deseja realmente apagar o grupo ${c.name}? - \nEsta ação é irreversivel e irá apagar todos os usuários, grupos e links dessa empresa `
    );
    console.log(confirm);
    const data = {
      id: c.id,
    };
    if (confirm) {
      try {
        const response = await axios.post(
          "http://192.168.0.14:4001/company/remove",
          data
        );
        setCompanys((prevCompanies) =>
          prevCompanies.filter((company) => company.id !== c.id)
        );
        setCompanySelected(null);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  }

    // Sort Items

  if(companys){
    companys.sort((a,b)=> a.name.localeCompare(b.name))
    console.log("!!!!!!!!!!!!!",companys)
  }

  if(companySelected){
  companySelected.User.sort((a,b)=>a.name.localeCompare(b.name))
    companySelected.Group.sort((a,b)=>a.name.localeCompare(b.name))
  }

  if(links){
    links.sort((a,b)=> a.description.localeCompare(b.description))
  }
 
  return (
    <>
      <Header />
      <Container>
        <Main>
          <CompanyInfo>
            <Companys visible={companysVisible}>
              <DataTitle>Empresas Registradas</DataTitle>
              <CompanyScroll>
                {companys
                  ? companys.map((c) => (
                      <CompanyBox
                        onClick={() => CompanySelected(c.id)}
                        key={c.id}
                      >
                        <BoxStyled style={{ width: "55%" }}>
                          {" "}
                          <CompanyBoxText>Nome: {c.name}</CompanyBoxText>
                        </BoxStyled>
                        <BoxStyled style={{ width: "35%" }}>
                          <CompanyBoxText>Código: {c.code}</CompanyBoxText>
                        </BoxStyled>
                        <BoxStyledIcon>
                          <IoTrashSharp
                            onClick={() => DeleteCompany(c)}
                            color="white"
                          />
                        </BoxStyledIcon>
                      </CompanyBox>
                    ))
                  : "null"}
              </CompanyScroll>
              <NewButton onClick={() => setCompanysVisible(false)}>
                Nova Empresa
              </NewButton>
            </Companys>

            <NewCompany visible={companysVisible}>
              <DataTitle>Nova Empresa</DataTitle>
              <InputBox>
                <CompanyTitle>Nome</CompanyTitle>
                <InputStyle
                onKeyDown={EnterKeyCompany}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Insira o nome da empresa"
                />
              </InputBox>

              <InputBox>
                <CompanyTitle>Código</CompanyTitle>
                <InputStyle
                  onKeyDown={EnterKeyCompany}
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  type="number"
                  placeholder="Insira o código da empresa"
                />
              </InputBox>
              <FormButton onClick={SendCompany}>Criar</FormButton>
              <FormButton
                style={{
                  marginTop: "10px",
                  width: "20%",
                  height: "30px",
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "12px",
                }}
                onClick={() => setCompanysVisible(true)}
              >
                Voltar
              </FormButton>
            </NewCompany>
          </CompanyInfo>

          {companySelected ? (
            <UserInfo>
              <Users visible={usersVisible}>
                <GroupBoxText>Empresa: {companySelected.name}</GroupBoxText>
                <GroupBoxText>Usuários Disponíveis</GroupBoxText>
                <UserScroll>
                  {companySelected.User.map((u) => (
                    <UserBox key={u}>
                      <BoxStyled style={{ width: "80%" ,display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
                        <GroupBoxText >Nome: {u.name}</GroupBoxText>
                        <GroupBoxText style={{marginTop:"15px",border:"solid black 2px"}}>Matricula: {u.enrolment}</GroupBoxText>
                      </BoxStyled>
                     
                    
                        {u.active ? ( <BoxStyledIcon>   <IoPersonSharp onClick={()=>UserActive(u)} />
                   
                      </BoxStyledIcon>):(<BoxStyledIcon>   <IoPersonSharp onClick={()=>UserActive(u)} color="white"/>
                   </BoxStyledIcon>)}

                     

                      <BoxStyledIcon>
                        {" "}
                        <IoTrashSharp
                          onClick={() => DeleteUser(u)}
                          color="white"
                        />
                      </BoxStyledIcon>
                    </UserBox>
                  ))}
                </UserScroll>
                <NewButton onClick={() => setUsersVisible(false)}>
                  Novo Usuário
                </NewButton>
              </Users>
              <NewUser visible={usersVisible}>
                <DataTitle>Novo Usuário</DataTitle>
                <InputBox>
                  <CompanyTitle>Nome</CompanyTitle>
                  <InputStyle
                  onKeyDown={EnterKeyUser}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Insira o nome do usuário"
                  />
                </InputBox>

                <InputBox>
                  <CompanyTitle>Matricula</CompanyTitle>
                  <InputStyle
                  onKeyDown={EnterKeyUser}
                    type="number"
                    value={enrolment}
                    onChange={(e) => setEnrolment(e.target.value)}
                    placeholder="Insira a matricula"
                  />
                </InputBox>

                <InputBox>
                  <CompanyTitle>CPF</CompanyTitle>
                  <InputStyle
                  onKeyDown={EnterKeyUser}
                    type="number"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="Insira o CPF do usuário"
                  />
                </InputBox>
                <FormButton onClick={SendUser}>Criar</FormButton>
                <FormButton
                  style={{
                    marginTop: "10px",
                    width: "20%",
                    height: "30px",
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "12px",
                  }}
                  onClick={() => setUsersVisible(true)}
                >
                  Voltar
                </FormButton>
              </NewUser>
            </UserInfo>
          ) : null}

          {companySelected ? (
            <GroupInfo>
              <Groups visible={groupsVisible}>
                <GroupBoxText>Empresa: {companySelected.name}</GroupBoxText>
                <GroupBoxText>Grupos Disponíveis</GroupBoxText>
                <GroupScroll>
                  {companySelected.Group.map((g) => (
                    <GroupBox
                      onClick={() => SetGroupInfo(g.id, g.name)}
                      key={g}
                    >
                      <BoxStyled style={{ width: "90%" }}>
                        <GroupBoxText>Grupo: {g.name}</GroupBoxText>
                      </BoxStyled>

                      <BoxStyledIcon>
                        <IoTrashSharp
                          onClick={() => DeleteGroup(g)}
                          color="white"
                        />
                      </BoxStyledIcon>
                    </GroupBox>
                  ))}
                </GroupScroll>
                <NewButton onClick={() => setGroupsVisible(false)}>
                  Novo Grupo
                </NewButton>
              </Groups>
              <NewGroup visible={groupsVisible}>
                <DataTitle>Novo Grupo</DataTitle>
                <InputBox>
                  <CompanyTitle>Nome</CompanyTitle>
                  <InputStyle
                  onKeyDown={EnterKeyGroup}
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Insira o nome do grupo"
                  />
                </InputBox>
                <FormButton onClick={SendGroup}>Criar</FormButton>
                <FormButton
                  style={{
                    marginTop: "10px",
                    width: "20%",
                    height: "30px",
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "12px",
                  }}
                  onClick={() => setGroupsVisible(true)}
                >
                  Voltar
                </FormButton>
              </NewGroup>
            </GroupInfo>
          ) : null}

          {groupSelected ? (
            <LinkInfo>
              <Links visible={linkvisible}>
                <LinkBoxText>Grupo: {groupSelectedName}</LinkBoxText>
                <LinkBoxText>Links Registrados</LinkBoxText>

                <LinkScroll>
                  {links
                    ? links.map((l) => (
                        <LinkBox key={l}>
                          <BoxStyled style={{ width: "90%" }}>
                            <LinkBoxText>
                              Descrição: {l.description}
                            </LinkBoxText>
                          </BoxStyled>
                          <BoxStyledIcon>
                            <IoTrashSharp
                              onClick={() => DeleteLink(l.id)}
                              color="white"
                            />
                          </BoxStyledIcon>
                        </LinkBox>
                      ))
                    : "null"}
                </LinkScroll>
                <NewButton onClick={() => setLinkVisible(false)}>
                  Novo Link
                </NewButton>
              </Links>
              <NewLinkBox visible={linkvisible}>
                <DataTitle>Novo Link</DataTitle>
                <InputBox>
                  <CompanyTitle>Link</CompanyTitle>
                  <InputStyle
                  onKeyDown={EnterKeyLink}
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Insira o Link da Página"
                  />
                </InputBox>

                <InputBox>
                  <CompanyTitle>Descrição</CompanyTitle>
                  <InputStyle
                      onKeyDown={EnterKeyLink}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Insira a descrição do item"
                  />
                </InputBox>

                <InputBox>
                  <CompanyTitle>ImageUrl</CompanyTitle>
                  <InputStyle
                      onKeyDown={EnterKeyLink}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Insira o url da imagem desejada"
                  />
                </InputBox>
                <FormButton onClick={AddLinktoGroup}>Criar</FormButton>
                <FormButton
                  style={{
                    marginTop: "10px",
                    width: "20%",
                    height: "30px",
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "12px",
                  }}
                  onClick={() => setLinkVisible(true)}
                >
                  Voltar
                </FormButton>
              </NewLinkBox>
            </LinkInfo>
          ) : null}
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
  flex-direction: row;
  align-items: center;
  width: 90%;
  height: 97%;
  background-color: black;
  border-radius: 15px;
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 24%;
  height: 95%;
  border-radius: 20px;
  background-color: grey;
  margin-left: 1%;
`;

const GroupInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 24%;
  height: 95%;
  border-radius: 20px;
  background-color: grey;
  margin-left: 1%;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 24%;
  height: 95%;
  border-radius: 20px;
  background-color: grey;
  margin-left: 1%;
`;
const CompanyBox = styled.div`
  display: flex;
  width: 100%;
  height: 15%;
  align-items: center;

  background-color: #1f5884;
  border-radius: 10px;
  margin-top: 10px;
`;

const BoxStyled = styled.div`
  display: flex;

  width: 45%;
  align-items: center;
`;
const BoxStyledIcon = styled.div`
  display: flex;
  width: 10%;
  align-items: center;
  justify-content: center;
`;

const CompanyScroll = styled.div`
  width: 95%;
  margin-top: 5px;
  height: 89%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
  }
  :hover {
    background-color: cyan;
    transition-duration: 0.5s;
  }
`;

const Companys = styled.div`
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  height: 98%;
  width: 95%;
  border-radius: 15px;
`;

const NewCompany = styled.div`
  display: ${({ visible }) => (visible ? "none" : "flex")};
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  width: 90%;
  height: 360px;
  border-radius: 20px;
  background-color: #1f5884;
  margin-top: 5px;
`;

const CompanyTitle = styled.text`
  font-size: 22px;
  margin-left: 15px;
  margin-bottom: 5px;
  color: whitesmoke;
`;

const CompanyBoxText = styled.text`
  margin-left: 7px;
  font-size: 18px;
  color: whitesmoke;
`;

const GroupBox = styled.div`
  display: flex;
  width: 100%;
  height: 15%;
  align-items: center;
  background-color: #1f5884;
  border-radius: 10px;
  margin-top: 10px;
`;

const UserBox = styled.div`
  display: flex;
  width: 100%;
  height: 15%;
  align-items: center;
  background-color: #1f5884;
  border-radius: 10px;
  margin-top: 10px;
`;
const UserScroll = styled.div`
  width: 100%;
  height: 89%;
  margin-top: 5px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
  }
  :hover {
    background-color: cyan;
    transition-duration: 0.5s;
  }
`;
const GroupScroll = styled.div`
  width: 95%;
  height: 89%;
  margin-top: 5px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
  }
  :hover {
    background-color: cyan;
    transition-duration: 0.5s;
  }
`;

const GroupBoxText = styled.text`
  margin-left: 7px;
  font-size: 18px;
  color: whitesmoke;
`;

const NewGroup = styled.div`
  display: ${({ visible }) => (visible ? "none" : "flex")};
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  width: 90%;
  height: 250px;
  border-radius: 20px;
  background-color: #1f5884;
  margin-top: 5px;
`;

const NewUser = styled.div`
  display: ${({ visible }) => (visible ? "none" : "flex")};
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  width: 90%;
  height: 465px;
  border-radius: 20px;
  background-color: #1f5884;
  margin-top: 5px;
`;

const NewButton = styled.button`
  position: relative;
  bottom: 0;
  margin-top: 10px;
  width: 35%;
  height: 7%;
  border-radius: 10px;
  :hover {
    background-color: cyan;
  }
`;

const DataTitle = styled.text`
  font-size: 22px;
  margin-top: 5px;
  margin-bottom: 5px;
  color: whitesmoke;
`;

const InputBox = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 95%;
  height: 95px;
  border: solid 1px;
  background-color: #1f5884;
  border-radius: 15px;
`;

const InputStyle = styled.input`
  width: 70%;
  height: 25px;
  margin-top: 2%;
  margin-left: 2%;
  border-radius: 10px;
  padding-left: 5%;
`;

const FormButton = styled.button`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35%;
  height: 40px;
  border-radius: 10px;
  font-size: 14px;
  background: #3498db;
  color: whitesmoke;
`;

const Groups = styled.div`
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  height: 98%;
  width: 95%;
  border-radius: 15px;
`;

const Users = styled.div`
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  height: 98%;
  width: 95%;
  border-radius: 15px;
`;

const LinkInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 23%;
  height: 95%;
  border-radius: 20px;
  background-color: grey;
  margin-left: 1%;
`;

const Links = styled.div`
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  align-items: center;

  height: 98%;
  width: 95%;
  border-radius: 15px;
`;

const LinkScroll = styled.div`
  width: 95%;
  height: 89%;
  margin-top: 5px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
  }
  :hover {
    background-color: cyan;
    transition-duration: 0.5s;
  }
`;

const LinkBox = styled.div`
  display: flex;
  width: 100%;
  height: 15%;
  align-items: center;
  background-color: #1f5884;
  border-radius: 10px;
  margin-top: 10px;
`;

const LinkBoxText = styled.text`
  margin-left: 7px;
  font-size: 18px;
  color: whitesmoke;
`;

const NewLinkBox = styled.div`
  display: ${({ visible }) => (visible ? "none" : "flex")};
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  width: 90%;
  height: 465px;
  border-radius: 20px;
  background-color: #1f5884;
  margin-top: 5px;
`;

const SelectBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 85%;
  border-radius: 20px;
  background-color: #1f5884;
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

const UserText = styled.text`
  font-size: 18px;
  color: whitesmoke;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 15%;
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

const UserContainer = styled.div`
  background-color: #1f5884;
  display: flex;
  width: 100%;
  height: 85%;
`;
