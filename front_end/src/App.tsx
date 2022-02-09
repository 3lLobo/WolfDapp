import React from "react";
import "./App.css";
import {
    DAppProvider,
    ChainId,
    useEtherBalance,
    useEthers,
    Config,
} from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { Header } from "./components/Header";
import { Container } from "@material-ui/core";
import { Main } from "./components/Main";

function App() {
    return (
        <DAppProvider
            config={{
                supportedChains: [ChainId.Kovan, ChainId.Rinkeby],
            }}
        >
            <Container maxWidth="md">
                <div>AloHa</div>
            </Container>
            <Header></Header>
            <Container maxWidth="md">
                <Main />
            </Container>
        </DAppProvider>
    );
}

export default App;
