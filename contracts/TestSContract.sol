// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTTOKEN is ERC721, ERC721Enumerable, ERC721Pausable, Ownable {
    string private _contractMetadata = "contract.json";
    string private _URIMetadata;
    uint256 private _nextTokenId;
    uint256 public _now;
    bool public _publicMintOpent = false;
    uint256 public _maxSupply;
    Auction public auction;
    IERC20 private ercInstance;

    struct Bidder {
        address _bidderAddress;
        uint256 _lastBid;
        bool _isRefund;
    }

    struct Auction {
        uint256 _tokenId;
        uint256 _highestBidding;
        uint256 _fromPrice;
        uint256 _toPrice;
        uint48 _startTime;
        uint48 _effectTime;
        address _winner;
        mapping(address => Bidder) _bidder;
    }

    function createAuction(
        uint256 tokenId,
        uint256 highestBidding,
        uint256 fromPrice,
        uint256 toPrice,
        uint48 startTime,
        uint48 effectTime
    ) external onlyOwner {
        if (auction._startTime != 0) {
            require(
                !isInTimeActive() && auction._winner != address(0),
                "Already exist another auction event !"
            );
        }
        auction._tokenId = tokenId;
        auction._highestBidding = highestBidding;
        auction._fromPrice = fromPrice;
        auction._toPrice = toPrice;
        auction._startTime = startTime;
        auction._effectTime = effectTime;
        auction._winner = address(0);
        auction._bidder[address(0)] = Bidder({
            _bidderAddress: address(0),
            _lastBid: 0,
            _isRefund: false
        });
    }

    function setSupply(uint256 maxSupply) external {
        _maxSupply = maxSupply;
    }

    function setContractURI(string memory contractMetadata) external {
        _contractMetadata = contractMetadata;
    }

    function clearAuction() external onlyOwner {
        delete auction;
    }

    function isInTimeActive() private returns (bool) {
        _now = block.timestamp;
        uint48 endTime = auction._startTime + auction._effectTime;
        return (auction._startTime < _now && _now < endTime);
    }

    function bid(address erc20Address, uint256 amount) external whenNotPaused {
        require(isInTimeActive(), "Auction was ended !");
        require(
            auction._fromPrice < amount && amount < auction._toPrice,
            "Bid value must be in range bid of auction !"
        );
        require(
            amount > auction._bidder[msg.sender]._lastBid,
            "Bid value must be highger your last bid !"
        );
        require(
            amount > auction._highestBidding,
            "Bid value must be highger than highest bidding !"
        );
        ercInstance = IERC20(erc20Address);
        ercInstance.transferFrom(msg.sender, address(this), amount - auction._bidder[msg.sender]._lastBid);
        auction._highestBidding = amount;
        auction._bidder[msg.sender] = Bidder({
            _bidderAddress: msg.sender,
            _lastBid: amount,
            _isRefund: false
        });
    }

    function withDrawWhenLose(address erc20Address) external whenNotPaused {
        require(!isInTimeActive() && auction._winner != address(0), "Auction not ended !");
        require(msg.sender != auction._winner, "You was winner !");
        require(!auction._bidder[msg.sender]._isRefund, "You was withdraw !");
        ercInstance = IERC20(erc20Address);
        ercInstance.transferFrom(address(this), msg.sender, auction._bidder[msg.sender]._lastBid);
        auction._bidder[msg.sender]._isRefund = true;
    }

    function winClaim(address winnerAddress) external onlyOwner {
        require(!isInTimeActive(), "Auction not ended !");
        _transfer(owner(), winnerAddress, auction._tokenId);
        auction._winner = winnerAddress;
    }

    constructor()
        ERC721("MTDTest", "WE3")
        Ownable(msg.sender)
    {
        _maxSupply = 3;
        _URIMetadata = "https://bafybeidowazkapcu27hfuivke33a6jb26ejspiixmgfinexfmk5jbplj6u.ipfs.cf-ipfs.com/";
    }

    function _baseURI() override internal view virtual returns (string memory) {
        // https://bafybeidowazkapcu27hfuivke33a6jb26ejspiixmgfinexfmk5jbplj6u.ipfs.cf-ipfs.com/
        return _URIMetadata;
    }
    /**
     * @dev Returns the metadata URI for a given token ID.
     */
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

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function withdraw(address _addr) external onlyOwner {
        uint256 balance = address(this).balance;
        payable(_addr).transfer(balance);
    }

    function withdrawERC20(address erc20Address, address addr) external onlyOwner {
        ercInstance = IERC20(erc20Address);
        uint256 balance = ercInstance.balanceOf(address(this));
        ercInstance.transferFrom(address(this), addr, balance);
    }

    /**
     * @dev Returns the metadata URI for a given token ID.
     */

    // add payment
    // add limiting of suply
    function publicMint() external payable onlyOwner {
        require(_publicMintOpent, "Public mint closed");
        require(msg.value > 0.0001 ether, "Not enough Funds !");
        require(totalSupply() < _maxSupply, "We Sold Out !");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    // Modify the mint windows
    function setPublicMintOpent(bool publicMintOpent) external onlyOwner {
        _publicMintOpent = publicMintOpent;
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
