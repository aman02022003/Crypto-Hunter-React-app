import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {server} from '../index';
import { Container, HStack,  Button, RadioGroup, Radio } from '@chakra-ui/react';
import Loader from './Loader';
import Error from './Error';
import CoinCard from './CoinCard';
const Coins = () => { 


    const [coins,setcoins] = useState([]);
    const [loading,setloading] = useState(true);
    const [error,seterror] = useState(false);
    const [page,setpage] = useState(1);
    const [currecncy,setcurrency] = useState("inr");
    const currencySymbol=currecncy==="inr" ? "₹" : currecncy==="eur" ? "€" : "$";

const changepage =(page)=>{
    setpage(page);
    setloading(true);

}

const btns = new Array(132).fill(1)

   useEffect(()=>{
         const fetchcoin = async()=>{
           try {
            const {data}=await axios.get(`${server}/coins/markets?vs_currency=${currecncy}&page=${page}`);
            setcoins(data)
            setloading(false);
           } catch (error) {
               seterror(true);
              setloading(false)
           }
          
         }
         fetchcoin();

   },[currecncy,page])

if(error){
    return <Error message={'error while fetching data'}/>
}

  return (
    <Container maxW={"container.xl"}>
      {loading? ( <Loader/>):(
        
        <>
        <RadioGroup value={currecncy} onChange={setcurrency} p={'8'}>
          <HStack spacing={'4'}>
            <Radio value={'inr'}>₹ INR</Radio>
            <Radio value={'usd'}>$ USD</Radio>
            <Radio value={'eur'}>€ EUR</Radio>
           
          </HStack>
        </RadioGroup>
        <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
            {
                coins.map((i)=>(
                      <CoinCard id={i.id}  key={i.id} name={i.name} price={i.current_price} img={i.image} symbol={i.symbol}currencySymbol={currencySymbol}/>
                ))
            }
        </HStack>
        <HStack w={'full'} overflowX={'auto'} p={"8"}>
         {
          btns.map((item,index)=>(
            <Button key={index} bgColor={'blackAlpha.900'} color={'white'} onClick={()=>changepage(index+1)}>{index+1}</Button>
          ))
         }
        </HStack>
        </>
      
     ) }
    </Container>
  )
}




export default Coins
