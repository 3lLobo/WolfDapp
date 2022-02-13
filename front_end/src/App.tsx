import React from "react";
import "./App.css";
import {
    DAppProvider,
    ChainId,
    Kovan,
    Rinkeby,
    useEtherBalance,
    useEthers,
    Config,
} from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { Header } from "./components/Header";
import { Container } from "@material-ui/core";
import { Main } from "./components/Main";

const heart: string = "<3";
function App() {
    return (
        <DAppProvider
            config={{
                networks: [Kovan],
                notifications: {
                    expirationPeriod: 1000,
                    checkInterval: 1000,
                },
            }}
        >
            <Container maxWidth="md">
                <div> {heart} </div>
            </Container>
            <Header></Header>
            <Container maxWidth="md">
                <Main />
            </Container>
        </DAppProvider>
    );
}

export default App;
