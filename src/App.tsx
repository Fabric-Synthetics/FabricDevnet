import './App.css';
import { WalletKitProvider } from "@gokiprotocol/walletkit";
import { ToastContainer } from 'react-toastify';
import { Dapp } from './Dapp';
import { Logger } from '@fabric-foundation/sdk';
import { solana } from '@saberhq/use-solana';
const rpcNetwork = process.env.REACT_APP_NETWORK;
console.log("rpcNetwork", rpcNetwork);

const network: solana.Network = rpcNetwork === 'localnet' ? 'localnet' : rpcNetwork === 'mainnet' ? 'mainnet-beta' : 'devnet';

export interface IAppProps {
  children?: React.ReactNode;
}

Logger.setLogLevel("sdk/tx-builder", "DEBUG");
Logger.setLogLevel("sdk/synths", "DEBUG");
Logger.setLogLevel("ui/dapp", "OFF");

export default function App({
  children,
}: IAppProps) {
  return (
    <WalletKitProvider
      defaultNetwork={network}
      app={{
        name: "Fabric Synthetics dApp",
      }}
      networkConfigs={{
        "devnet": {
          name: 'devnet',
          endpoint: 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899',
        },
        "mainnet-beta": {
          name: "mainnet-beta",
          endpoint: "https://ssc-dao.genesysgo.net",
        }
      }}
    >
      <ToastContainer
        position='bottom-left'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
      />
        <Dapp 
          children={children}
        />
    </WalletKitProvider>
  );
}
