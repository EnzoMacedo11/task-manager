import { useContext, useEffect, useState } from "react";
import Header from "../../components/header";
import UserContext from "../../components/context";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const {userData,setUserData} = useContext(UserContext)
    const Navigate = useNavigate();
    const [user,setUser] = useState(null)
    const data = [{id:"1",url:"a",descrição:"aa"},{id:"2",url:"a",descrição:"aa"},{id:"3",url:"a",descrição:"aa"},{id:"4",url:"a",descrição:"aa"},{id:"5",url:"a",descrição:"aa"},{id:"6",url:"a",descrição:"aa"},{id:"1",url:"a",descrição:"aa"},{id:"2",url:"a",descrição:"aa"},{id:"3",url:"a",descrição:"aa"},{id:"4",url:"a",descrição:"aa"},{id:"5",url:"a",descrição:"aa"},{id:"6",url:"a",descrição:"aa"}]
    console.log("user",user)
    console.log(userData)
    
    useEffect(() => {
        if (!userData) {
          Navigate("/login");
        }
      }, [userData]);

    useEffect(()=>{
        getUser()
    },[])

   async function getUser(){
        await axios.get("http://192.168.0.14:4001/user/getuser",{headers:{id:userData.id}})
        .then(response =>{
            console.log(response.data)
            setUser(response.data)
        })
        .catch(error=>{
            console.log(error)
        })
    }
    
    
    
    return(
        <>
        <Header/>
        <Container>  <Main>
            {/* <button onClick={()=>setUserData({admin:true})}></button>
        <button onClick={()=>setUserData({admin:false})}></button> */}
        
        {data.map(c=>(
            <DataBox>
               <text> {c.id}</text>
            </DataBox>
        ))}
        
        
        </Main></Container>
      
        </>
    )
}

const Container = styled.div`
display:flex;
width:100%;
height:92vh;
flex-direction:column;
background: grey;
align-items:center;
justify-content:center;

`
const Main = styled.div`
display:flex;
align-items:center;
justify-content:center;
flex-direction:row;
flex-wrap:wrap;
width:90%;
height:97%;
background-color:green;
border-radius:15px;
`

const DataBox = styled.div`
display:flex;
justify-content:center;
align-items:center;
width:350px;
height:250px;
border-radius:20px;
background-color:grey;
margin:10px


`