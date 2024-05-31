import { 
    type BaseError,
    useWaitForTransactionReceipt, 
    useWriteContract,
    useAccount 
  } from 'wagmi'
  import { contract, erc20abi } from './utils'; 
import '../components/PlaceBid/PlaceBid.css';

  const contractAddress = '0xF768A934E199F05DC17e2ca7b26f71Ab1208A8f1';
  const erc20Address = '0x926EE9e6eD2853E6ebDaEc85228859A81857A937'

  export function PlaceBid() {
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
        address: contractAddress,
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

  export function InitAuction() {
    const { isConnected } = useAccount();
    const { 
      data: hash,
      error,
      isPending,
      writeContract 
    } = useWriteContract();

    function submit() { 
      if (isConnected) {
      writeContract({
        address: contractAddress,
        abi: contract,
        functionName: '__FusionContract_init',
        args: ['0x926EE9e6eD2853E6ebDaEc85228859A81857A937', BigInt(1717142108), BigInt(1717833308), BigInt(1000), BigInt(100000)],
      })
      } else {
        alert('bạn cần kết nối ví điện tử trước khi đặt cược !')
      }
    } 
  
    const { isLoading: isConfirming, isSuccess: isConfirmed } =  useWaitForTransactionReceipt({ hash }) ;
    
    return (
      <div >
        <button 
          disabled={isPending} 
          onClick={submit}
          className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2 ms-4 rounded-md' 
        >
          {isPending ? 'Confirming...' : 'Mint'} 
        </button>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>} 
        {isConfirmed && <div>Transaction confirmed.</div>} 
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
        
      </div>
    )
  }