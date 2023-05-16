import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";
import axios from "axios";
const provider = new ethers.providers.Web3Provider(window.ethereum);


function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }
    const getData = async () => {
      const a = await axios
        .get("http://localhost:3500/getContracts")
        .then((res1) => {
          setEscrows(res1.data);
        });
    };

    getAccounts();
    getData();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    // const value = ethers.BigNumber.from(document.getElementById("wei").value);
    const etherValue = parseFloat(document.getElementById("wei").value);

// Convert Ether value to Wei
    const weiValue = ethers.utils.parseEther(etherValue.toString());
    const escrowContract = await deploy(signer, arbiter, beneficiary, weiValue);
    console.log('escrowContract', escrowContract)
    const db = await axios
      .post("http://localhost:3500/postContract", {
        address: escrowContract.address,
        approved: false,
        arbiter: arbiter,
        value: document.getElementById("wei").value,
        beneficiary,
      })
      .then((res) => {
        console.log("res", res);
      })
      .catch((er) => {
        console.log("er", er);
      });

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value:weiValue.toString(),
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input
            type="text"
            id="arbiter"
            value="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
          />
        </label>

        <label>
          Beneficiary Address
          <input
            type="text"
            id="beneficiary"
            value="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
          />
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="text" id="wei" defaultValue="1" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow}  signer={signer}/>;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
