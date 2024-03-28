import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, useToast } from "@chakra-ui/react";

const Index = () => {
  const [tradingData, setTradingData] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchTradingData = async () => {
      try {
        const response = await fetch("https://api.example.com/derivatives?topCoins=5");
        const data = await response.json();
        setTradingData(data);
      } catch (error) {
        console.error("Error fetching trading data:", error);
      }
    };

    fetchTradingData();
    const interval = setInterval(fetchTradingData, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchTradingData = async () => {
      try {
        const response = await fetch("https://api.example.com/derivatives?topCoins=5");
        const data = await response.json();
        setTradingData(data);

        data.forEach((trader) => {
          trader.coins.forEach((coin) => {
            const previousRatio = tradingData.find((t) => t.id === trader.id)?.coins.find((c) => c.id === coin.id)?.longShortRatio;
            if (previousRatio && Math.abs(coin.longShortRatio - previousRatio) > 0.5) {
              toast({
                title: "Significant Change",
                description: `${trader.name}'s ${coin.symbol} Long/Short ratio changed significantly from ${previousRatio.toFixed(2)} to ${coin.longShortRatio.toFixed(2)}`,
                status: "warning",
                duration: 5000,
                isClosable: true,
              });
            }
          });
        });
      } catch (error) {
        console.error("Error fetching trading data:", error);
      }
    };

    fetchTradingData();
    const interval = setInterval(fetchTradingData, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [tradingData, toast]);

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Derivatives Trading Data
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Trader</Th>
            {tradingData[0]?.coins.map((coin) => (
              <Th key={coin.id}>{coin.symbol} Long/Short Ratio</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tradingData.map((trader) => (
            <Tr key={trader.id}>
              <Td>{trader.name}</Td>
              {trader.coins.map((coin) => (
                <Td key={coin.id}>{coin.longShortRatio.toFixed(2)}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Index;
