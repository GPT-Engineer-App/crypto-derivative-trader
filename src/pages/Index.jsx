import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, useToast } from "@chakra-ui/react";

const Index = () => {
  const [tradingData, setTradingData] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchTradingData = async () => {
      try {
        // Simulated API call to fetch trading data from exchanges
        const response = await fetch("https://api.example.com/derivatives");
        const data = await response.json();
        setTradingData(data);
      } catch (error) {
        console.error("Error fetching trading data:", error);
      }
    };

    fetchTradingData();
    const interval = setInterval(fetchTradingData, 60000); // Fetch data every 60 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const checkPositionRatioChange = () => {
      // Check for subtle changes in Long/Short position ratio
      tradingData.forEach((trader) => {
        const { name, longShortRatio, previousRatio } = trader;
        if (Math.abs(longShortRatio - previousRatio) > 0.1) {
          toast({
            title: "Position Ratio Change",
            description: `Trader ${name}'s Long/Short position ratio changed significantly.`,
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
      });
    };

    checkPositionRatioChange();
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
            <Th>Long/Short Ratio</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tradingData.map((trader) => (
            <Tr key={trader.id}>
              <Td>{trader.name}</Td>
              <Td>{trader.longShortRatio.toFixed(2)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Text mt={4}>Alerts will be shown when there is a significant change in a trader's Long/Short position ratio.</Text>
    </Box>
  );
};

export default Index;
