import { Badge, Box, Container, Img, Progress, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, VStack } from '@chakra-ui/react'
import {  HStack,  Button, RadioGroup, Radio } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import {useParams} from "react-router-dom"
import {server} from "../index";
import axios from 'axios';
import Error from './Error';
import Chartt from './Chartt';


import Loader from "./Loader"
import { Chart } from 'chart.js';
const CoinDetails = () => {
  const [coin,setcoin] = useState({});
  const [loading,setloading] = useState(true);
    const [error,seterror] = useState(false);
    const [currecncy,setcurrency] = useState("inr");
    const [days,setDays] = useState("24h");
    const [chartArray,setChartArray] = useState();
    const currencySymbol=currecncy==="inr" ? "₹" : currecncy==="eur" ? "€" : "$";

    const params = useParams();
    const btns=["24h", "7d", "14d" , "30d","60d","200d","365d","max"];
 
const swithChartStats = (key)=>{
         switch (key) {
          case "24h":
            setDays("24h");
          
            break;
            case "7d":
              setDays("7d");
             
              break;
              case "14d":
                setDays("14d");
                
                break;
                case "30d":
                  setDays("30d");
                
                  break;
                  case "60d":
                    setDays("60d");
                 
                    break;
                    case "200d":
                      setDays("200d");
                   
                      break;
                      case "365d":
                        setDays("365d");
                      
                        break;
                        case "max":
                          setDays("max");
                          
                          break;
         
          default:
            setDays("24h");
           
            break;
         }
}
    useEffect(()=>{
      const fetchCoin = async()=>{
        try {
         const {data}=await axios.get(`${server}/coins/${params.id}`);
         const {data:chartData} = await axios.get(`${server}/coins/${params.id}/market_chart?vs_currency=${currecncy}&days=${days}`);
         setcoin(data)
         setChartArray(chartData.prices)
         setloading(false);
        } catch (error) {
            seterror(true);
           setloading(false)
        }
       
      }
      fetchCoin();

},[params.id,currecncy,days])

if(error){
  return <Error message={'error while fetching data'}/>
}

  return (
  <Container maxW={'container.xl'}>
      {
        loading? <Loader/>: (
          <>
          
          <Box width={'full'} borderWidth={1}>
             <Chartt arr={chartArray}currecncy={currencySymbol} days={days}/>
          </Box>
        
          <HStack p={'4'} wrap={"wrap"}>
           {
            btns.map((i)=>(
              <Button  disabled={days === i} key={i} onClick={()=>swithChartStats(i)}>{i}</Button>
            ))
           }
          </HStack>

          <RadioGroup value={currecncy} onChange={setcurrency} p={'8'}>
          <HStack spacing={'4'}>
            <Radio value={'inr'}>₹ INR</Radio>
            <Radio value={'usd'}>$ USD</Radio>
            <Radio value={'eur'}>€ EUR</Radio>
           
          </HStack>
        </RadioGroup>

        <VStack spacing={'4'} p={'16'} alignItems={'flex-start'}>
             <Text fontSize={'small'} alignSelf={'center'} opacity={0.7}>
                Last Updated on {Date(coin.market_data.last_updated).split('G')[0]}
             </Text>
             <Img src={coin.image.large} w={'16'} h={'16'} objectFit={'contain'}/>
             <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>{currencySymbol}{coin.market_data.current_price[currecncy]}</StatNumber>
              <StatHelpText>
                <StatArrow type={coin.market_data.price_change_percentage_24h > 0 ? "increase" : "decrease"} />
                {coin.market_data.price_change_percentage_24h}%
              </StatHelpText>
             </Stat>
             <Badge fontSize={'2xl'} bgColor={'yellow.500'}>
              { `#${coin.market_cap_rank}`}
             </Badge>
             <CustomBar high={`${currencySymbol}${coin.market_data.low_24h[currecncy]}`} low={`${currencySymbol}${coin.market_data.high_24h[currecncy]}`}/>

             <Box w={'full'} p={'4'}>
                   <Item title={"Max Supply"} value={coin.market_data.max_supply} />
                   <Item title={"Circulating Supply"} value={coin.market_data.circulating_supply} />
                   <Item title={"Market cap"} value={`${currencySymbol}${coin.market_data.market_cap[currecncy]}`} />
                   <Item title={"All Time Low"} value={`${currencySymbol}${coin.market_data.atl[currecncy]}`} />
                   <Item title={"All Time High"} value={`${currencySymbol}${coin.market_data.ath[currecncy]}`} />
             </Box>
        </VStack>
          </>
        )
      }
  </Container>
  )
}

const Item=({title,value})=>(
    <HStack justifyContent={"space-between"} w={'full'} my={'4'}>
      <Text fontFamily={'Bebas Neue'} letterSpacing={'widest'}>{title}</Text>
      <Text>{value}</Text>
    </HStack>
)

const CustomBar = ({high,low})=>(
      <VStack w={"full"}>
        <Progress value={50} colorScheme={'teal'} w={"full"} />
        <HStack justifyContent={"space-between"} w={'full'}>
            <Badge children={low} colorScheme={'red'} />
             <Text fontSize={"sm"}>24H Range</Text>
            <Badge children={high} colorScheme={'green'} />

        </HStack>
      </VStack>
)

export default CoinDetails
