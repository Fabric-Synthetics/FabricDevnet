import './Diagnostics.css';
import {
    TaskAltRounded,
    HighlightOffRounded
} from '@mui/icons-material';
import React from 'react';
import { useSolana } from '@saberhq/use-solana';

export default function Diagnostics() {
    const { network, connection } = useSolana();

    const [open, setOpen] = React.useState(false);
    const [ip, setIp] = React.useState('-');
    const [dns, setDns] = React.useState('-');
    const [userInfoResponse, setUserInfoResponse] = React.useState('-');

    const [rpcEpochData, setRpcEpochData] = React.useState('-');
    const [rpcConnected, setRpcConnected] = React.useState(false);
    const [apiConnected, setApiConnected] = React.useState(true);
    const [rpcResponseTime, setResponseTime] = React.useState(0);
    const [triedRequest, setTriedRequest] = React.useState(false);

    async function getIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            setIp(data.ip);
        } catch {}
    }

    async function getDNS() {
        try {
            const response = await fetch('https://edns.ip-api.com/json');
            const data = await response.json();
            setDns(data.dns.ip);
        } catch {}
    }

    async function getRawData() {
        const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
        const data = await response.text();
        setUserInfoResponse(data);
    }

    async function getRpcData() {
        var time1 = performance.now();
        try {
            var epochInfo = await connection.getEpochInfo();
            var time2 = performance.now();
            setResponseTime(time2 - time1);
            setRpcEpochData(JSON.stringify(epochInfo, null, 2));
            setRpcConnected(true);
        } catch {
            setResponseTime(0);
            setRpcEpochData('Error');
            setRpcConnected(false);
        }
    }

    async function fetchData() {
        setTriedRequest(true);

        await Promise.all([
            getIP(), 
            getDNS(), 
            getRawData(), 
            getRpcData(),
        ]);
    }


    return (
        <main>
            <div className="diagnostic-section wf-section">
                <div className="diagnostics-wrap">
                <div className="_12-col">
                <h1 className="heading">Help us diagnose your issue</h1>
                    <p className="text-16">If the Fabric app has trouble loading, please screenshot this page and send the images to our team.</p>
                    <h2 className="heading-2">Details</h2>
                    <div className="roadmap-list-item">
                        <div className="diagnostics-header">Your IP</div>
                        <p className="text-20">{ip}</p>
                    </div>
                    <div className="roadmap-list-item">
                    <div className="diagnostics-header">Your DNS</div>
                    <p className="text-20">{dns}</p>
                    </div>
                    <div className="btn-gradient w-inline-block">
                        <div className="btn-gradient-inner">
                            <div 
                                className="gradient-btn-label"
                                onClick={() => {
                                    setOpen(!open);
                                    fetchData();
                                }}>
                                    Query network config
                            </div>
                        </div>
                    </div>
                    <div 
                        className="query-network-response" 
                        style={{display: open ? "block" : "none"}}
                    >
                    <div className="rpc-response">
                        <p className="code-block"><pre>{userInfoResponse}</pre></p>
                    </div>
                    </div>
                    <div className="roadmap-list-item">
                        <div className="diagnostics-header">API connectivity</div>
                        <p className="text-20 w-clearfix">
                            {!apiConnected 
                                ? <span className="icon red"><HighlightOffRounded /></span>
                                : <span className="icon green"><TaskAltRounded /></span>}
                        </p>
                    </div>
                    <div className="roadmap-list-item">
                        <div className="diagnostics-header">RPC connectivity</div>
                        <p className="text-20 w-clearfix">
                            {!rpcConnected 
                                ? <span className="icon red"><HighlightOffRounded /></span>
                                : <span className="icon green"><TaskAltRounded /></span>}
                        </p>
                    </div>
                    <div className="roadmap-list-item">
                        <div className="diagnostics-header">RPC network</div>
                        <p className="text-20">{network.toUpperCase()}</p>
                    </div>
                    <h2 className="heading-2">RPC check</h2>
                    <div className="roadmap-list-item">
                        <p className="text-16">
                            {!rpcConnected 
                                ? <span className="icon red"><HighlightOffRounded /></span>
                                : <span className="icon green"><TaskAltRounded /></span>}
                            {triedRequest 
                                ? rpcConnected
                                    ? "200 "
                                    : "500 "
                                : "N/A"}
                            {` ${connection.rpcEndpoint} `} 
                            {triedRequest
                                ? rpcResponseTime.toFixed(0) + " ms"
                                : <></>}</p>
                    </div>
                    <div className="landing-card green">
                    <div className="rpc-response">
                        <p className="code-block"><pre>{rpcEpochData}</pre></p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </main>
    )
}