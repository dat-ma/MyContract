import env from '#start/env';
import {Web3} from 'web3';
import fs from 'fs';
import app from '@adonisjs/core/services/app';
const contractAddress = env.get('CONTRACT_ADDRESS');
const contractErc20Address = env.get('CONTRACT_ERC20_ADDRESS'); // Đặt địa chỉ của smart contract ở đây

const web3 = new Web3('https://sepolia.infura.io/v3/8bac6a4a34a44553b0045c6cbcd9ab46');
const contractABI = await JSON.parse(fs.readFileSync(app.configPath('fusion-abi.json'), 'utf8')).abi;

// Tạo đối tượng hợp đồng thông minh
export const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

const web3v2 = new Web3('https://sepolia.infura.io/v3/8bac6a4a34a44553b0045c6cbcd9ab46');
const contractERC20ABI = await JSON.parse(fs.readFileSync(app.configPath('fusion-abi.json'), 'utf8')).abi;
export const contractErc20Instance = new web3v2.eth.Contract(contractERC20ABI, contractErc20Address);