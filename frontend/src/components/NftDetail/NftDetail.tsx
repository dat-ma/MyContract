import './NftDetail.css'

export default function NftDetail({ nftDetail }:{nftDetail: any}) {
    return (
        <div>
            <div>
                <h1 className='font-bold text-4xl'>
                    NFT Details
                </h1>
                <span>Average Price ?</span>
            </div>
            <div>
                <div>
                    <h1 className='font-bold text-xl uppercase'>
                        description
                    </h1>
                    <p>{nftDetail.description}</p>
                </div>
                <div>
                    <h1 className='font-bold text-xl uppercase'>
                        traits
                    </h1>
                </div>
                <div>
                    <h1 className='font-bold text-xl uppercase'>
                        details
                    </h1>
                </div>
            </div>
        </div>
    )
}