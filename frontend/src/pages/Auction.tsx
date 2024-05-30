import EventDetail from "../components/EventDetail/EventDetail"
import NftDetail from "../components/NftDetail/NftDetail"
import { auction } from "../providers/data"

export default function Auction() {
    return (
         <div className="auction mx-52 relative z-10 text-white">
            <EventDetail eventDetail={auction.event}/>
            <NftDetail nftDetail={auction.nftDetail}/>
         </div>
    )
}
