import './EventDetail.css';
import {formatDateTime} from '../../providers/utils';
import CountdownTimer from '../Countdown/CountdownTimer.tsx';
export default function EventDetail({eventDetail}:{eventDetail: any}) {
    const timeZoneDefault =  -420; //default 
    return (
        <div className='w-full flex'>
            <div className='img-nft w-1/2 p-9 flex justify-center'>
                <img className='h-full rounded-lg ' src={eventDetail.img} alt="" />
            </div>
            <div className='w-1/2 event-content'>
                <div className="event-content p-9">
                    <h1 className='font-bold text-5xl'>
                        {eventDetail.name}
                    </h1>
                    <p className='text-sm'>
                        {eventDetail.endTime > 0? 
                            'Sale closes ' + new Date((eventDetail.endTime * 1000)) 
                            :'Dont have Sale' }
                    </p>
                </div>
                <div className="event-content p-4">
                    <CountdownTimer fromDate={eventDetail.startTime} targetDate={eventDetail.endTime}/>
                </div>
                <div className=" px-8 py-10 flex">
                     <div className='w-3/5 flex flex-col'>
                        <span>Range bid</span>
                        <span className=' font-bold custom-text'>{eventDetail.minBid} - {eventDetail.maxBid} USDT</span>
                        <button 
                            onClick={()=> {
                                const modal = document.getElementById('placeBid')!;
                                modal.style.display = "block";
                            }}
                         className='btn-bid font-bold text-xl leading-3 text-black absolute bottom-10'>Place Bid</button>
                     </div>
                     <div className='w-2/5 flex flex-col items-end'>
                        <span>Your bid</span>
                        <span className=' font-bold custom-text'>{eventDetail.yourBid} USDT</span>
                        <span className='absolute bottom-10'>Bidders: <span className=' font-bold custom-text '>{eventDetail.bidders}</span></span>
                     </div>
                </div>
            </div>
        </div>
    )
}