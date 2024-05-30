import env from '#start/env';
import {Web3} from 'web3';
import fs from 'fs';
const contractAddress = env.get('CONTRACT_ADDRESS'); // Đặt địa chỉ của smart contract ở đây

const web3 = new Web3('https://sepolia.infura.io/v3/8bac6a4a34a44553b0045c6cbcd9ab46');
const contractABI = await JSON.parse(fs.readFileSync('./config/fusion-abi.json', 'utf8')).abi;

// Tạo đối tượng hợp đồng thông minh
export const contractInstance = new web3.eth.Contract(contractABI, contractAddress);