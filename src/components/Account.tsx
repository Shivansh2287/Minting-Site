import { Button, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount, useEnsName } from "wagmi";
import { useContractWrite } from "wagmi";
import { contract } from "./Contract";
import Link from "next/link";
import axios from "axios";

import useStore from "../zustand";
const contractAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "_maxPerWallet", type: "uint256" },
      { internalType: "uint256", name: "_publicPrice", type: "uint256" },
      { internalType: "uint256", name: "_prePrice", type: "uint256" },
      { internalType: "uint256", name: "_maxSupply", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ApprovalCallerNotOwnerNorApproved", type: "error" },
  { inputs: [], name: "ApprovalQueryForNonexistentToken", type: "error" },
  { inputs: [], name: "ApprovalToCurrentOwner", type: "error" },
  { inputs: [], name: "ApproveToCaller", type: "error" },
  { inputs: [], name: "BalanceQueryForZeroAddress", type: "error" },
  { inputs: [], name: "MintToZeroAddress", type: "error" },
  { inputs: [], name: "MintZeroQuantity", type: "error" },
  { inputs: [], name: "MintedQueryForZeroAddress", type: "error" },
  { inputs: [], name: "OwnerQueryForNonexistentToken", type: "error" },
  { inputs: [], name: "TransferCallerNotOwnerNorApproved", type: "error" },
  { inputs: [], name: "TransferFromIncorrectOwner", type: "error" },
  { inputs: [], name: "TransferToNonERC721ReceiverImplementer", type: "error" },
  { inputs: [], name: "TransferToZeroAddress", type: "error" },
  { inputs: [], name: "URIQueryForNonexistentToken", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "quantity", type: "uint256" },
    ],
    name: "adminMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "total", type: "uint256" }],
    name: "decreaseMaxSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32[]", name: "proof", type: "bytes32[]" },
      { internalType: "bytes32", name: "leaf", type: "bytes32" },
    ],
    name: "isValid",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxPerWallet",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "mintingRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "prePrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "preSale",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32[]", name: "proof", type: "bytes32[]" },
      { internalType: "uint256", name: "quantity", type: "uint256" },
    ],
    name: "presaleMint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
    name: "publicMint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "publicPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "publicSale",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "root",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "newBaseURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_merkleRoot", type: "bytes32" }],
    name: "setMerkleRootForWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "StakingContract", type: "address" },
    ],
    name: "setStakingContractAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "togglePreSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "togglePublicSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "payout", type: "address" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
export function Account() {
  const { setArrayProof } = useStore();
  const toast = useToast();
  const { address } = useAccount();
  const { data: ensNameData } = useEnsName({ address });
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string | null>(null);
  const [whitelisted, setWhitelisted] = useState<boolean>(false);

  const { data, isError, isLoading, write } = useContractWrite({
    addressOrName: "0xC8458c807849Dd5aFa414466163AE89b2D14C99b",
    contractInterface: contractAbi,
    functionName: "publicMint",
    args: [quantity],
    overrides: {
      gasLimit: "1000000",
    },

    onSuccess(data) {
      console.log(data);
      setTransactionHash(data.hash);
    },
  });

  useEffect(() => {
    checkBalance();
  }, []);

  const [balance, setBalance] = useState(0);
  const [maxPerWallet, setMaxPerWallet] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [perPrice, setPerPrice] = useState(0);
  const [publicPrice, setPublicPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0.1);

  const checkBalance = async () => {
    var balance = await contract.balanceOf(address);
    var maxPerWallet = await contract.maxPerWallet();
    var maxSupply = await contract.maxSupply();
    var perPrice = await contract.prePrice();
    var publicPrice = await contract.publicPrice();
    var totalSupply = await contract.totalSupply();
    setBalance(parseInt(balance._hex));
    setMaxPerWallet(parseInt(maxPerWallet._hex));
    setMaxSupply(parseInt(maxSupply._hex));
    setPerPrice(parseInt(perPrice._hex));
    setPublicPrice(parseInt(publicPrice._hex));
    setTotalSupply(parseInt(totalSupply._hex));
  };
  const checkWhiteList = async () => {
    const data = await axios.get(`http://localhost:8080/getproof/${address}`);
    if (!data.status) {
      return console.log("not white list");
    }
    const array = data.data.proof;
    if (data.data.status) {
      setWhitelisted(true);
      setArrayProof(array);
      toast({
        title: "You are whitelisted",
        description: "You can now buy tokens",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
    console.log(data);
  };

  return (
    <Stack>
      {ensNameData ?? address}
      {ensNameData ? ` (${address})` : null}
      <Stack>
        <Text>Balance: {balance}</Text>
        <Text>Max Per Wallet: {maxPerWallet}</Text>
        <Text>Max Supply: {maxSupply}</Text>
        <Text>Per Price: {perPrice}</Text>
        <Text>Public Price: {publicPrice}</Text>
        <Text>Total Supply: {totalSupply}</Text>
      </Stack>

      <Input
        placeholder="Enter quantity"
        onChange={(e: any) => setQuantity(e.target.value)}
      />

      <Button onClick={() => write()}>Public Mint</Button>
      <Button onClick={() => checkWhiteList()}>Check White List</Button>

      {transactionHash ? (
        <Button>
          Transaction Hash:{" "}
          <a href={`https://etherscan.io/tx/${transactionHash}`}>
            {transactionHash}
          </a>
        </Button>
      ) : null}
      {whitelisted ? (
        <Link href="/whitelist">
          <Button>Buy Tokens</Button>
        </Link>
      ) : null}
    </Stack>
  );
}
