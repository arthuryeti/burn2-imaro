"use client";

import { useRef, useMemo, useEffect } from "react";
import { useCountUp } from "react-countup";
import { Flex, Text, VStack, Box, HStack, Link } from "@chakra-ui/react";
import { SiTelegram } from "react-icons/si";
import { FaSquareXTwitter } from "react-icons/fa6";

import { NumberFormats, formatNumber } from "@/utils/helpers";
import { usePrice, useBalance } from "@/hooks";
import { DexScreenerIcon } from "@/components";

export function HomePage() {
  const countUpRef = useRef(null);
  const totalSupply = 666594890.37;
  const balance = useBalance();
  const price = usePrice();
  const value = useMemo(() => {
    return (balance || 0) * (price || 0);
  }, [balance, price]);
  const burnSupply = useMemo(() => {
    return ((balance || 0) * 100) / totalSupply;
  }, [balance, totalSupply]);

  const { start } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: balance,
    duration: 2.5,
  });

  useEffect(() => {
    if (balance > 0) {
      start();
    }
  }, [balance]);

  return (
    <Box
      w="100vw"
      h="100vh"
      bgSize="cover"
      bgRepeat="no-repeat"
      bgImage="url(./burn.jpg)"
      bgPosition="center"
    >
      <Flex
        w="100vw"
        h="100vh"
        justify="center"
        align="center"
        bg="rgba(0,0,0,0.3)"
      >
        {balance > 0 && (
          <VStack>
            <Text fontSize={{ base: "1rem", md: "2rem" }} fontWeight="bold">
              {formatNumber(burnSupply, NumberFormats.token)}% BURNT
            </Text>
            <Text
              ref={countUpRef}
              fontSize={{ base: "4rem", sm: "6rem", lg: "12rem" }}
              lineHeight="1"
              fontWeight="bold"
            />
            {/* <Text
            ref={countUpRef}
            fontSize={{ base: "4rem", sm: "6rem", lg: "12rem" }}
            lineHeight="1"
            fontWeight="bold"
          >
            {formatNumber(balance)}
          </Text> */}
            <Text fontSize={{ base: "1rem", md: "2rem" }}>
              ({formatNumber(value, NumberFormats.fiat)})
            </Text>
          </VStack>
        )}
      </Flex>
      <Flex
        pos="fixed"
        bottom="0"
        left="0"
        right="0"
        align="center"
        justify="center"
        pb="8"
      >
        <VStack>
          <HStack>
            <Link href="https://t.me/imarocoin" isExternal>
              <SiTelegram size="2rem" />
            </Link>
            <Link href="https://twitter.com/imarocoin" isExternal>
              <FaSquareXTwitter size="2rem" />
            </Link>
            <Link
              href="https://dexscreener.com/solana/4hzg7rz1ulkupdx5t6fnqhirjcyqdze5hrjqbfvcyd3h"
              isExternal
            >
              <DexScreenerIcon boxSize="2rem" />
            </Link>
          </HStack>
          <Text textAlign="center">
            This is a community-initiated IMARO token burning event lasting
            until August 30th. First BURN event:{" "}
            <Link href="https://burn.imaro.meme" isExternal>
              https://burn.imaro.meme
            </Link>
          </Text>
        </VStack>
      </Flex>
      <Flex
        pos="fixed"
        top="0"
        left="0"
        right="0"
        align="center"
        justify="center"
        pt="8"
      >
        <VStack>
          <Text fontSize={{ base: "0.9rem", md: "1.5rem" }} textAlign="center">
            <Text as="span" fontWeight="bold">
              BURN ADDRESS
            </Text>
            : 2KEJdenGheqtbxtDsohok58BhoDxE2oo5xVHMKvRrmvx
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}
