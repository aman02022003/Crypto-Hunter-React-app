import { Box, Spinner, VStack } from '@chakra-ui/react'
import React from 'react'

function Loader() {
  return (
    <div>
    <VStack h={"90vh"} justifyContent={"center"}>
      <Box transform={"scale(3)"}>
         <Spinner size={"xl"}/>
      </Box>
    </VStack>
    </div>
  )
}

export default Loader
