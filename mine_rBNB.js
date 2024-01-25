const { ethers } = require('ethers');
const {readFileSync} = require('fs');

const file = './wallets/wallet.json';
const data = JSON.parse(readFileSync(file));
// console.log(data);
const account = data.account;
const privateKey = data.privateKey;
console.log(account);


const rpcServer = "https://rpc.ankr.com/bsc";

const connection = {
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br",
        "Accept-Language":"zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "Origin":"https://bnb.reth.cc",
        "Referer":"https://bnb.reth.cc/",
        "Sec-Ch-Ua":"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120",
        "Sec-Ch-Ua-Mobile":"?0",
        "Sec-Ch-Ua-Platform":"macOS",
        "Sec-Fetch-Dest":"empty",
        "Sec-Fetch-Mode":"cors",
        "Sec-Fetch-Site":"cross-site",
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
    },
        
    url: rpcServer
};

const provider = new ethers.providers.JsonRpcProvider(connection);

const wallet = new ethers.Wallet(privateKey, provider);
const currentChallenge = ethers.utils.formatBytes32String('rBNB'); //0x7245544800000000000000000000000000000000000000000000000000000000
console.log("Challenge", currentChallenge)

let solution;

while (1) {
    const random_value = ethers.utils.randomBytes(32);
    const potential_solution = ethers.utils.hexlify(random_value);
    const hashed_solution = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes32", "bytes32"], [potential_solution, currentChallenge]))
    if (hashed_solution.startsWith('0x99999')) {
        console.log(hashed_solution)
        solution = potential_solution;
        break
    }
}

const jsonData = {
    "p": "rBNB-20",
    "op": "mint",
    "tick": "rBNB",
    // "id": solution,
    "solution": solution,
    'amt': "1"
}

const dataHex = ethers.utils.hexlify(ethers.utils.toUtf8Bytes('data:application/json,' + JSON.stringify(jsonData)));

async function mine_rBNB() {
    const nonce = await provider.getTransactionCount(account);
    const gasPrice = await provider.getGasPrice();

    const tx = {
        from: account,
        to: account, // Self-transfer
        nonce: nonce,
        chainId: 56,
        gasPrice: gasPrice,
        data: dataHex,
    };

    const signedTx = await wallet.signTransaction(tx);
    const receipt = await provider.sendTransaction(signedTx);
    console.log('Transaction Receipt:', receipt);
}

mine_rBNB();


/*
Network Name: BSC
New RPC URL: https://binance.llamarpc.com
Chain ID: 56
Symbol: BNB
Explore: https://bscscan.com
*/

const config1 = {
    id: 56,
    name: "BNB Smart Chain",
    network: "bsc",
    nativeCurrency: { decimals: 18, name: "BNB", symbol: "BNB" },
    rpcUrls: {
        default: {
            http: ["https://rpc.ankr.com/bsc"]
        },
        public: {
            http: ["https://rpc.ankr.com/bsc"]
        }
    },
    blockExplorers: {
        etherscan: { name: "BscScan", url: "https://bscscan.com" },
        default: { name: "BscScan", url: "https://bscscan.com" }
    },
    contracts: { multicall3: { address: "0xca11bde05977b3631167028862be2a173976ca11", blockCreated: 15921452 } }
}

const config2 = {
    id: 1,
    network: "homestead",
    name: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        alchemy: {
            http: ["https://eth-mainnet.g.alchemy.com/v2"],
            webSocket: ["wss://eth-mainnet.g.alchemy.com/v2"]
        },
        infura: {
            http: ["https://mainnet.infura.io/v3"],
            webSocket: ["wss://mainnet.infura.io/ws/v3"]
        },
        default: { http: ["https://cloudflare-eth.com"] },
        public: { http: ["https://cloudflare-eth.com"] }
    },
    blockExplorers: {
        etherscan: { name: "Etherscan", url: "https://etherscan.io" },
        default: { name: "Etherscan", url: "https://etherscan.io" }
    },
    contracts: {
        ensRegistry: { address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" },
        ensUniversalResolver: { address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62", blockCreated: 16966585 },
        multicall3: { address: "0xca11bde05977b3631167028862be2a173976ca11", blockCreated: 14353601 }
    }
}