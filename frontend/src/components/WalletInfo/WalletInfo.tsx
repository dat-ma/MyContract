import './walletinfo.css'
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useBalance, useDisconnect } from "wagmi";

export default function WalletInfo() {
    const { address, chain } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: balance } = useBalance({ address: address });
    const { open } = useWeb3Modal();

    var modal: HTMLElement = document.getElementById("myWalletInfo")!;
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    return (
    <div id="myWalletInfo" className="modalWInfo">

        {/* <!-- Modal content --> */}
        <div className="modalWInfo-content">
            <div className="modalWInfo-header">
                <h2>Address: {address}</h2>
                <span onClick={()=> {
                    modal.style.display = "none";
                }} className="modalWInfo-close">&times;</span>
            </div>
            <div className="modalWInfo-body">
                <p>Balance: {balance?.formatted} {balance?.symbol}</p>
                <p >
                    <span >Network: </span>
                    <button className='inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                        onClick={() => open({ view: "Networks" })}
                    >
                    {chain?.name}

                    <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                    </button>
                </p>
            </div>
            <div className="modalWInfo-footer">
                <button className='btn-con-wall font-bold text-sm outline outline-offset-2 outline-pink-500' onClick={()=> {disconnect();modal.style.display = "none";}}>
                    Disconnect
                </button>
            </div>
        </div>

    </div>
    )
}