import { Clinica } from "./clinica/Clinica";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider >
      <Clinica />
    </ChakraProvider>
  )
}

export default App;
