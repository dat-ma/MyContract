// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library ArrayUtils {
    function removeNumberFromArray(
        uint256 num,
        uint256[] storage arr
    ) internal returns (uint256[] memory) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (num == arr[i]) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
            }
        }
        return arr;
    }

    function removeIdxFromArray(
        uint256 idx,
        uint256[] storage arr
    ) internal returns (uint256[] memory) {
        arr[idx] = arr[arr.length - 1];
        arr.pop();
        return arr;
    }

    function mergeStrArr(
        string[] memory arr
    ) internal pure returns (string memory) {
        bytes memory output;

        for (uint256 i = 0; i < arr.length; i++) {
            string memory str;
            if (i == 0) {
                str = arr[i];
            } else {
                str = string(abi.encodePacked("_", arr[i]));
            }
            output = abi.encodePacked(output, str);
        }

        return string(output);
    }

    function mergeMultidimensionalIntArr(
        uint[][] memory arr
    ) internal pure returns (string memory) {
        bytes memory output;

        for (uint256 i = 0; i < arr.length; i++) {
            for (uint256 j = 0; j < arr[i].length; j++) {
                string memory el = uint2str(arr[i][j]);
                string memory str;
                if (i == 0 && j == 0) {
                    str = el;
                } else {
                    str = string(abi.encodePacked("_", el));
                }
                output = abi.encodePacked(output, str);
            }
        }

        return string(output);
    }

    function mergeIntArr(
        uint[] memory arr
    ) internal pure returns (string memory) {
        bytes memory output;

        for (uint256 i = 0; i < arr.length; i++) {
            string memory el = uint2str(arr[i]);
            string memory str;
            if (i == 0) {
                str = el;
            } else {
                str = string(abi.encodePacked("_", el));
            }
            output = abi.encodePacked(output, str);
        }

        return string(output);
    }

    function uint2str(
        uint256 _i
    ) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function bracketRound(
        uint256 bracketType,
        uint256 round
    ) internal pure returns (uint256) {
        uint256 count = 0;
        while (round != 0) {
            round = round / 10;
            ++count;
        }
        return bracketType * (10 ** count) + round;
    }
}
