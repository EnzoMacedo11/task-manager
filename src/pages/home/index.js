import { useContext, useEffect, useState } from "react";
import Header from "../../components/header";
import UserContext from "../../components/context";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const { userData, setUserData } = useContext(UserContext);
  const Navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userLinks, setUserLinks] = useState(null);
  const [groupSelected, setGroupSelected] = useState(null);
  const [userGroups, setUserGroups] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  console.log("user", user);
  console.log("userdata", userData);

  useEffect(() => {
    if (!userData ) {
      Navigate("/login");
    }
  }, [userData]);

  useEffect(() => {
    if(userData){
      if (userData.active === false) {
        setUserData(null)
        Navigate("/login");
      }
    }
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    GroupLinks(groupSelected);
  }, [groupSelected]);

  useEffect(() => {
    searchLinks();
  }, [searchTerm]);

  async function getUser() {
    try {
      const response = await axios.get(
        "https://task-manager-back-eu7e.onrender.com/user/getuser",
        { headers: { id: userData.id } }
      );
      console.log(response.data);
      setUser(response.data);
      setUserLinks(response.data.links);
      setUserGroups(response.data.groups);
    } catch (error) {
      console.log(error);
    }
  }

  function GroupLinks(groupId) {
    const id = Number(groupId);
    console.log("groupId", id);

    if (user) {
      const links = user.links;
      console.log("links1", links);

      if (!isNaN(id)) {
        const newLinks = links.filter((link) => link.groupId === id);
        setUserLinks(newLinks);
      } else {
        setUserLinks(links);
      }

      console.log("userLinks", userLinks);
      searchLinks();
    }
  }

  function searchLinks() {
    if (userLinks) {
      const results = userLinks.filter((link) =>
        link.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }

  return (
    <>
      <Header />
      <Container>
        {" "}
        <Main>
          <TopBox>
            {user ? (
              <>
                <TopDivisor>
                  <DivisorText>Grupos: </DivisorText>
                  <StyleSelect
                    value={groupSelected}
                    onChange={(e) => setGroupSelected(e.target.value)}
                  >
                    <option>Todos os grupos</option>
                    {userGroups.map((g) => (
                      <option key={g} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </StyleSelect>
                </TopDivisor>
                <TopDivisor style={{ justifyContent: "flex-end" }}>
                  <DivisorText>Buscar:</DivisorText>
                  <StyleInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </TopDivisor>
              </>
            ) : (
              "Carregando"
            )}
          </TopBox>
          <LinkScroll>
            <LinksContainer>
              {user
                ? searchTerm !== ""
                  ? searchResults.map((link) => (
                      <DataBox key={link.id}>
                        <a
                          href={`http://${link.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            textDecoration: "none",
                            width: "100%",
                          }}
                        >
                          <ImageUrl src={link.imageUrl} />
                          <Description>{link.description}</Description>
                        </a>
                      </DataBox>
                    ))
                  : userLinks && userLinks.length > 0
                  ? userLinks.map((c) => (
                      <DataBox key={c.id}>
                        <a
                          href={`http://${c.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            textDecoration: "none",
                            width: "100%",
                          }}
                        >
                          <ImageUrl
    src={c.imageUrl}
   
  />
                          <Description>{c.description}</Description>
                        </a>
                      </DataBox>
                    ))
                  : <DataBox><Description>Sem links cadastrados nesse grupo.</Description></DataBox>
                : "Carregando"}
            </LinksContainer>
          </LinkScroll>
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
  width: 95%;
  height: 850px;
  background-color: black;
  border-radius: 15px;
`;

const DataBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 330px;
  height: 230px;
  border-radius: 20px;
  background-color: grey;
  margin: 10px;
  :hover{
    background-color:cyan;
    border-radius: 20px;
  }
`;

const Description = styled.text`
  font-size: 16px;
  color: white;
`;
const ImageUrl = styled.img`
  width: 220px;
  height: 150px;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  background-color: #1f5884;
`;

const StyleSelect = styled.select`
  width: 
27%;
  height: 40%;
  border-radius: 7px;
`;
const StyleInput = styled.input`
  width: 27%;
  margin-right: 7%;
  border-radius: 7px;
  height: 35%;
`;

const DivisorText = styled.text`
  font-size: 20px;
  color: whitesmoke;
  margin-left:15px; 
  margin-right:15px;
`;
const TopDivisor = styled.div`
  display: flex;
  height: 100%;
  width: 50%;
  align-items: center;
`;
const LinksContainer = styled.div`
width:100%;
height:90%;
display:flex;
flex-direction: row;
flex-wrap: wrap;
justify-content:center;
align-items:center;

`

const LinkScroll = styled.div`
  margin-top: 4px;
  width: 100%;
  height: 90%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
  }
`;