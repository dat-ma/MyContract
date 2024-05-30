// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface FusionEvents {
    event PlaceBid(
        address user,
        uint256 amount,
        uint256 bidTime,
        uint256 nonce
    );
    event ClaimAndMint(
        address user,
        uint256 amount,
        uint256 claimTime,
        uint256 tokenId
    );
}
