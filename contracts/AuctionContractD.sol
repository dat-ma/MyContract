// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuctionContractD is ERC721, Ownable {
    string private _contractMetadata = "contract.json";
    string private _URIMetadata;
    IERC20 private _ercInstance;
    Bidder private _bidder;
    uint256 private _refundMoney;

    uint256 public _nextTokenId;
    uint48 public _startTime;
    uint48 public _endTime;
    uint256 public _fromPrice;
    uint256 public _toPrice;
    uint256 public _finalPrice;
    uint256 public _finalTime;
    bool public _claimable;

    mapping(address => Bidder) public _bidders;

    struct Bidder {
        uint256 _lastBid;
        uint256 _lastTime;
        bool _isClaim;
    }

    // Event
    event BiddingEvent(address bidder, uint256 amount, uint256 bidTime);
    event ClaimAndMintEvent(address claimer, uint256 amount, uint256 tokenId, uint256 time, bool isClaim);
    
    // create a new auction
    function createAuction(
        uint48 startTime,
        uint48 endTime,
        uint256 fromPrice,
        uint256 toPrice
    ) external onlyOwner {
        require(!isAuctionEffective(), "Already exist another auction !");
        _startTime = startTime;
        _endTime = endTime;
        _fromPrice = fromPrice;
        _toPrice = toPrice;
    }
    // set finalPrice when auction ended !
    function setFinal(uint256 finalPrice, uint256 finalTime) external onlyOwner {
        require(!isAuctionEffective(), "Already exist another auction !");
        _finalPrice = finalPrice;
        _finalTime = finalTime;
        _claimable = true;
    }
    // check the auction is active
    function isAuctionEffective() internal view returns (bool isEffective) {
        if (_startTime < block.timestamp && block.timestamp < _endTime) {
            return true;
        } else if (_startTime == 0 && _endTime == 0) {
            return false;
        }
    }
    /** 
        bidding require auction active and amount bid in range define and hight than your last bid
    **/
    function bid(address erc20Address, uint256 bidAmount) external {
        _bidder = _bidders[msg.sender];
        require(isAuctionEffective(), "Already exist another auction !");
        require(_fromPrice < bidAmount && bidAmount < _toPrice , "Must be in range of bid !");
        require(bidAmount > _bidder._lastBid, "Must be highter your last bid !");
        _ercInstance = IERC20(erc20Address);
        _ercInstance.transferFrom(msg.sender, address(this), bidAmount - _bidder._lastBid);
        _bidder._lastBid = bidAmount;
        _bidder._lastTime = block.timestamp;
        _bidder._isClaim = false;
        emit BiddingEvent(msg.sender, bidAmount, _bidder._lastTime);
    }
    /**
        claim for loser: will receive a the bided money
        mint nft for winner: will be mint nft 
            when last bid of winner is highger than _finalPrice(win price)
            winner will receive a extant money
     **/
    function mintAndClaim(address erc20Address) external {
        require(!isAuctionEffective(), "Auction not ended !");
        require(_claimable, "Admin has not revealed the final price !");
        _bidder = _bidders[msg.sender];
        require(!_bidder._isClaim, "You was claiming !");
        if (_bidder._lastBid < _finalPrice || _bidder._lastTime < _finalTime) { // Loser claim
            _refundMoney = _bidder._lastBid;
            transerCustom(erc20Address, address(this), msg.sender, _refundMoney);
            _bidder._isClaim = true;
            emit ClaimAndMintEvent(msg.sender, _refundMoney, 0, block.timestamp, true);
        } else { // Winner mint
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
            if (_bidder._lastBid > _finalPrice) {
                _refundMoney = _bidder._lastBid - _finalPrice;
                transerCustom(erc20Address, address(this), msg.sender, _refundMoney);
            }
            _bidder._isClaim = true;
            emit ClaimAndMintEvent(msg.sender, _refundMoney, tokenId, block.timestamp, true);
        }
    }

    function transerCustom(address erc20Address ,address from, address to,  uint256 amount) internal {
        _ercInstance = IERC20(erc20Address);
        _ercInstance.transferFrom(from, to, amount);
    }

    constructor() ERC721("MTDTest", "WE3") Ownable (msg.sender) {
        _URIMetadata = "https://bafybeidowazkapcu27hfuivke33a6jb26ejspiixmgfinexfmk5jbplj6u.ipfs.cf-ipfs.com/";
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _URIMetadata;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return string.concat(_baseURI(), Strings.toString(_tokenId), ".json");
    }

    function contractURI() public view virtual returns (string memory) {
        return string.concat(_baseURI(), _contractMetadata);
    }
}
