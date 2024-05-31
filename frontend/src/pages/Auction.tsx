import EventDetail from "../components/EventDetail/EventDetail"
import NftDetail from "../components/NftDetail/NftDetail"
import { auction } from "../providers/data"
import { useState ,useEffect } from 'react';
import { getTotalBid } from "../services/ContractService";
import { 
  useAccount 
} from 'wagmi'
export default function Auction() {
    const { address, isConnected } = useAccount();
    const [auctionInf, setAuctionInf] = useState(auction.event);
    useEffect( ()  => {
        const userAddress = isConnected? address : 'INVALID';
        const fetchData = async () => {
              const response = await getTotalBid(userAddress);
              console.log(response);
              setAuctionInf({
                timeZone: null,
                img: 'https://i.seadn.io/s/raw/files/93e2dd0a9fd852949598acf8f5c15c71.png?auto=format&dpr=1&w=1000',
                name: "Fushion Box",
                endTime: response.endTime ,
                startTime: response.startTime ,
                minBid: response.minBid,
                maxBid: response.maxBid,
                yourBid: response.bidInfo.amount,
                bidders: response.totalBid,
            })
          };
       fetchData();
    } , [])
    return (
         <div className="auction mx-52 relative z-10 text-white">
            <EventDetail eventDetail={auctionInf}/>
            <NftDetail nftDetail={auction.nftDetail}/>
         </div>
    )
}
