import axios from "axios";
import contractABI from "./artifacts/contracts/Escrow.sol/Escrow.json";
import { ethers } from "ethers";

export default function Escrow({
  signer,
  address,
  arbiter,
  beneficiary,
  value,
  approved,
}) {
  async function approve(address, signer) {
    // const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    // const approveTxn = await escrowContract.connect(signer).approve();
    // await approveTxn.wait();
    const contractAddress = address;
    const contractabi = contractABI.abi; // Replace with the actual ABI of your contract
    const contract = new ethers.Contract(contractAddress, contractabi, signer);

    const transaction = await contract.approve();
    console.log("transaction", transaction);
    const s = await transaction.wait();
    console.log("s", s);
    const db = await axios
      .post("http://localhost:3500/changeApproved", {
        address: address,
      })
      .then((res) => {
        console.log("res", res);
        document.getElementById(address).className =
        'complete';
      document.getElementById(address).innerText =
        "✓ It's been approved!";
      });
  }

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        <div
          id={address}
          className={approved ? "complete" : "button"}
          onClick={(e) => {
            e.preventDefault();

            approve(address, signer);
          }}
        >
          {approved ? "✓ It's been approved!" : "Approve"}
        </div>
      </ul>
    </div>
  );
}
