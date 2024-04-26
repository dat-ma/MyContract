// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract AuctionContractD is ERC721, Ownable {
    string private _contractMetadata = "contract.json";
    string private _URIMetadata;
    IERC20 private _ercInstance;
    Bidder private _bidder;
    uint256 private _refundMoney;
    uint256 private _bidMoney;

    uint256 public _nextTokenId;
    uint48 public _startTime;
    uint48 public _endTime;
    uint256 public _fromPrice;
    uint256 public _toPrice;
    // cho trường hợp dùng BE
    uint256 public _finalPrice;
    uint256 public _finalTime;
    bool public _claimable;

    mapping(address => bool) public _winnerMapping;

    mapping(address => Bidder) public _bidderMap;
    address[] public _bidderList;

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
    function setFinal(uint256 finalPrice, uint256 finalTime, address[] memory addressWinners) external onlyOwner {
        require(!isAuctionEffective(), "Already exist another auction !");
        _finalPrice = finalPrice;
        _finalTime = finalTime;
        _claimable = true;
        for (uint256 i = 0; i < addressWinners.length; i++) {
            _winnerMapping[addressWinners[i]] = true;
        }
        _bidderList = addressWinners;
    }
    // get all winner
    function _winners() public view returns (address[] memory) {
        return _bidderList;
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
    function submitBid(address erc20Address, uint256 bidAmount) external {
        _bidder = _bidderMap[msg.sender];// Get data from mapping
        require(isAuctionEffective(), "Already exist another auction !");
        require(_fromPrice < bidAmount && bidAmount < _toPrice , "Must be in range of bid !");
        require(bidAmount > _bidder._lastBid, "Must be highter your last bid !");
        // Transfer
        _bidMoney = bidAmount - _bidder._lastBid;
        transferCustom(erc20Address, msg.sender, address(this), _bidMoney);
        // If not exist. add to list
        if (_bidder._lastBid == 0) {
            _bidderList.push(msg.sender);
        }
        // update bidder
        _bidderMap[msg.sender]._lastBid = bidAmount;
        _bidderMap[msg.sender]._lastTime = block.timestamp;
        _bidderMap[msg.sender]._isClaim = false;
        // sort list bidder by mapping
        sort();
        // emit BiddingEvent(msg.sender, bidAmount, _bidder._lastTime);
    }

    function sort() internal {
        if (_bidderList.length <= 1) {
            return ;
        }
        _bidderList = mergeSort(_bidderList);
    }

    function mergeSort(address[] memory arr) private returns (address[] memory) {
        if (arr.length <= 1) {
            return arr;
        }

        uint256 mid = arr.length / 2;
        address[] memory left = new address[](mid);
        address[] memory right = new address[](arr.length - mid);

        for (uint256 i = 0; i < mid; i++) {
            left[i] = arr[i];
        }

        for (uint256 i = mid; i < arr.length; i++) {
            right[i - mid] = arr[i];
        }

        left = mergeSort(left);
        right = mergeSort(right);

        return merge(left, right);
    }

    function merge(address[] memory left, address[] memory right) private view returns (address[] memory) {
        address[] memory merged = new address[](left.length + right.length);
        uint256 i = 0;
        uint256 j = 0;
        uint256 k = 0;

        while (i < left.length && j < right.length) {
            if (_bidderMap[left[i]]._lastBid < _bidderMap[right[j]]._lastBid) {
                merged[k] = left[i];
                i++;
            } else if (_bidderMap[left[i]]._lastBid > _bidderMap[right[j]]._lastBid) {
                merged[k] = right[j];
                j++;
            } else {
                if (_bidderMap[left[i]]._lastTime > _bidderMap[right[j]]._lastTime) {
                    merged[k] = left[i];
                    i++;
                }
            }
            k++;
        }

        while (i < left.length) {
            merged[k] = left[i];
            i++;
            k++;
        }

        while (j < right.length) {
            merged[k] = right[j];
            j++;
            k++;
        }

        return merged;
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
        _bidder = _bidderMap[msg.sender];
        require(!_bidder._isClaim, "You was claiming !");
        if (_winnerMapping[msg.sender] != true) { // Loser claim
            _refundMoney = _bidder._lastBid;
            transferCustom(erc20Address, address(this), msg.sender, _refundMoney);
            _bidder._isClaim = true;
            emit ClaimAndMintEvent(msg.sender, _refundMoney, 0, block.timestamp, true);
        } else { // Winner mint
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
            if (_bidder._lastBid > _finalPrice) {
                _refundMoney = _bidder._lastBid - _finalPrice;
                transferCustom(erc20Address, address(this), msg.sender, _refundMoney);
            }
            _bidder._isClaim = true;
            emit ClaimAndMintEvent(msg.sender, _refundMoney, tokenId, block.timestamp, true);
        }
    }
    // For not using BE
    function mintAndClaimV2(address erc20Address) external {
        require(!isAuctionEffective(), "Auction not ended !");
        _bidder = _bidderMap[msg.sender];
        require(!_bidder._isClaim, "You was claiming !");
        address lastWinner = getLastWinner();
        if (!isWinner(lastWinner)) { // Loser claim
            _refundMoney = _bidder._lastBid;
            transferCustom(erc20Address, address(this), msg.sender, _refundMoney);
            _bidderMap[msg.sender]._isClaim = true;
            emit ClaimAndMintEvent(msg.sender, _refundMoney, 0, block.timestamp, true);
        } else { // Winner mint
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
            if (_bidder._lastBid > _bidderMap[lastWinner]._lastBid) {
                _refundMoney = _bidder._lastBid - _bidderMap[lastWinner]._lastBid;
                transferCustom(erc20Address, address(this), msg.sender, _refundMoney);
            }
            _bidderMap[msg.sender]._isClaim = true;
            emit ClaimAndMintEvent(msg.sender, _refundMoney, tokenId, block.timestamp, true);
        }
    }

    function isWinner(address lastWinner) private view returns (bool) {
        if (_bidderMap[lastWinner]._lastBid > _bidderMap[msg.sender]._lastBid) {
            return false;
        } else if (_bidderMap[lastWinner]._lastBid < _bidderMap[msg.sender]._lastBid)  {
            return  true;
        } else {
            if (_bidderMap[lastWinner]._lastTime < _bidderMap[msg.sender]._lastTime) {
                return false;
            }
            return true;
        }
    }

    function getLastWinner() private view returns (address) {
        uint256 tempIndex = _bidderList.length - 9999;
        if (tempIndex < 0) {
            return _bidderList[0];
        } else {
            return _bidderList[tempIndex];
        }
    }

    function transferCustom(address erc20Address ,address from, address to,  uint256 amount) internal {
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
