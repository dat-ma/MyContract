// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface FusionInterfaces {
    struct BidInfo {
        address user;
        uint256 amount;
        uint256 bidTime;
        uint256 claimTime;
        uint256 claimAmount;
        uint256 tokenId;
    }
}
