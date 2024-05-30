// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import {FusionInterfaces} from "./interfaces/FusionInterfaces.sol";

contract FusionContract is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721BurnableUpgradeable,
    AccessControlUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    FusionInterfaces
{
    // user address => ordinal
    mapping(address => uint256) public bidOrdinal;
    // ordinal => bid info
    mapping(uint256 => BidInfo) public bidInfo;
    // user address => totalClaim
    mapping(uint256 => uint256) public claimOrdinal;
    uint256 public minOrdinal;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public totalUser;
    uint256 public totalBid;
    uint256 public totalClaim;
    address public acceptedCurrency;
    uint256 public minBid;
    uint256 public maxBid;
    uint256 public tokenIds;

    mapping(address => bool) public isAdmin;

    function __FusionContract_init(
        address _acceptedCurrency,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _minBid,
        uint256 _maxBid
    ) public initializer {
        __Ownable_init();
        acceptedCurrency = _acceptedCurrency;
        startTime = _startTime;
        endTime = _endTime;
        minBid = _minBid;
        maxBid = _maxBid;
    }

    function placeBid(uint256 _amount) public payable nonReentrant {
        require(
            block.timestamp >= startTime && block.timestamp <= endTime,
            "Not in bid time"
        );
        BidInfo memory bid = bidInfo[bidOrdinal[msg.sender]];

        require(
            _amount >= minBid && _amount <= maxBid && _amount > bid.amount,
            "Amount invalid"
        );

        if (bidOrdinal[msg.sender] == 0) {
            totalUser += 1;
        }
        totalBid += 1;
        bidOrdinal[msg.sender] = totalBid;
        BidInfo storage newBid = bidInfo[bidOrdinal[msg.sender]];

        newBid.user = msg.sender;
        newBid.amount = _amount;
        newBid.bidTime = block.timestamp;

        transferFund(
            _amount - bid.amount,
            acceptedCurrency,
            msg.sender,
            address(this)
        );
    }

    function claimAndMint() public nonReentrant {
        require(block.timestamp >= endTime, "Can not claim now");
        require(bidOrdinal[msg.sender] > 0, "Not bidder");
        BidInfo storage bid = bidInfo[bidOrdinal[msg.sender]];
        BidInfo memory minBidInfo = bidInfo[minOrdinal];
        require(bid.claimTime == 0, "User claimed");
        require(minBidInfo.amount > 0, "Min amount not set");
        uint256 surplusAmount;
        uint256 tokenId;
        if (
            bid.amount > minBidInfo.amount ||
            (bid.amount == minBidInfo.amount &&
                bid.bidTime <= minBidInfo.bidTime)
        ) {
            // win bid => claim surplus => mint NFT
            surplusAmount = bid.amount - minBidInfo.amount;
            // mint NFT
            tokenIds += 1;
            tokenId = tokenIds;
            _safeMint(msg.sender, tokenIds);
        } else {
            // lose bid => claim initiated
            surplusAmount = bid.amount;
        }
        if (surplusAmount > 0) {
            // transfer fund if needed
            transferFund(
                surplusAmount,
                acceptedCurrency,
                address(this),
                msg.sender
            );
        }
        totalClaim += 1;
        claimOrdinal[totalClaim] = bidOrdinal[msg.sender];
        bid.claimTime = block.timestamp;
        bid.claimAmount = surplusAmount;
        bid.tokenId = tokenId;
    }

    function getBidderInfo(address _user) public view returns (BidInfo memory) {
        return bidInfo[bidOrdinal[_user]];
    }

    function getMinBidInfo() public view returns (BidInfo memory) {
        return bidInfo[minOrdinal];
    }
    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }
    function getBidderByOrdinal(
        uint256 _from,
        uint256 _to
    ) public view returns (BidInfo[] memory) {
        BidInfo[] memory bids = new BidInfo[](_to - _from);
        for (uint256 i = 0; i < _to - _from; i++) {
            bids[i] = bidInfo[_from + i];
        }
        return bids;
    }

    function setBiddingInfo(
        uint256 _from,
        uint256 _to,
        uint256 _fromPrice,
        uint256 _toPrice
    ) public onlyOwner {
        startTime = _from;
        endTime = _to;
        minBid = _fromPrice;
        maxBid = _toPrice;
    }

    function setAdmin(address _admin) public onlyOwner {
        isAdmin[_admin] = true;
    }

    function setFeeAddress(address _currency) public onlyOwner {
        acceptedCurrency = _currency;
    }

    function setMinAmount(uint256 _minOrdinal) public {
        require(isAdmin[msg.sender], "Not admin");
        minOrdinal = _minOrdinal;
    }

    function transferFund(
        uint256 _amount,
        address _token,
        address _from,
        address _to
    ) internal {
        if (_from == address(this)) {
            IERC20(_token).transfer(_to, _amount);
        } else {
            IERC20(_token).transferFrom(_from, _to, _amount);
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        // if (from != address(0) && to != address(0)) {
        //     require(cardOpened[tokenId] == true, "Nft not opened");
        // }

        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            AccessControlUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
