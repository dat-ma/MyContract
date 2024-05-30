import * as React from 'react'
import { 
  type BaseError,
  useWaitForTransactionReceipt, 
  useWriteContract,
  useAccount 
} from 'wagmi'
import { contract } from '../../providers/utils'
import './PlaceBid.css';


export default function PlaceBid() {
  const { isConnected } = useAccount();
  const { 
    data: hash,
    error,
    isPending, 
    writeContract 
  } = useWriteContract();

   function submit(e: React.FormEvent<HTMLFormElement>) { 
    if (isConnected) {
      e.preventDefault() 
    const formData = new FormData(e.target as HTMLFormElement) 
    const tokenId = formData.get('value') as string 
    writeContract({
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi: contract,
      functionName: 'placeBid',
      args: [BigInt(tokenId)],
    })
    } else {
      alert('bạn cần kết nối ví điện tử trước khi đặt cược !')
    }
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } =  useWaitForTransactionReceipt({ hash }) ;
  var modal: HTMLElement = document.getElementById("placeBid")!;

  window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }
  return (
    <div id='placeBid' className='place-bid'>
      <form onSubmit={submit} className='bid-form'>
      <input name="value" className='text-black' placeholder="0.05" required />
      <button 
        disabled={isPending} 
        type="submit"
        className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2 ms-4 rounded-md' 
      >
        {isPending ? 'Confirming...' : 'Bid'} 
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
    </div>
  )
}
