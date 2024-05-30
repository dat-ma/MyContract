import './header.css';
import { NavLink } from 'react-router-dom';
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import WalletInfo from '../WalletInfo/WalletInfo';
import PlaceBid from '../PlaceBid/PlaceBid.tsx';


export default function Header({navItem, logo}: {navItem:any, logo: any}) {
    const { open } = useWeb3Modal();
    const { address, isConnected } = useAccount();
    function openModal() {
        var modal: HTMLElement = document.getElementById("myWalletInfo")!;
        modal.style.display = "block";
    }
    return (
        <div className="header relative h-24 z-11 flex flex-nowrap justify-between items-center">
            <WalletInfo />
            <PlaceBid />
            <div className="flex flex-nowrap items-center gap-8">
                <img className="w-40" srcSet={logo} alt="" />
                <div className="flex flex-nowrap text-white gap-4 text-base font-normal">
                    {navItem.map((item:any) => (
                        <NavLink
                            key={item.value}
                            to={item.url}
                            className={({isActive}) => {
                                return isActive? "nav-active nav-item":"nav-item "
                            }}
                        >
                            {item.value}
                        </NavLink>
                    ))}  
                </div>
            </div>
            {
                isConnected ?
                <button onClick={openModal} className="btn-con-wall font-bold text-sm">
                    {address?.slice(0, 8)}...
                </button> : 
                <button onClick={()=> {open();}} className="btn-con-wall font-bold text-sm">Connect Wallet</button>
            }
        </div>
    )
}