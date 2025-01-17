import React, {Component} from "react";
import Web3 from "web3";
import "./App.css";
import Marketplace from "../abis/Marketplace.json";
import Navbar from "./Navbar";
import Main from "./Main";
import {mintNFT} from "./NFTFunctions";

class App extends Component {
    async componentWillMount() {
        let validBrowser = await this.loadWeb3();
        if (!validBrowser)
            return;
        await this.loadBlockchainData();
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
            return false;
        }
        return true;
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        // Load account
        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]});
        const networkId = await web3.eth.net.getId();
        const networkData = Marketplace.networks[networkId];
        if (networkData) {
            const marketplace = web3.eth.Contract(
                Marketplace.abi,
                networkData.address
            );
            this.setState({marketplace});
            const productCount = await marketplace.methods.productCount().call();
            this.setState({productCount});
            // Load products
            for (var i = 1; i <= productCount; i++) {
                const product = await marketplace.methods.products(i).call();
                this.setState({
                    products: [...this.state.products, product],
                });
            }
            this.setState({loading: false});
        } else {
            window.alert("Marketplace contract not deployed to detected network.");
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            account: "",
            productCount: 0,
            products: [],
            loading: true,
        };

        this.createProduct = this.createProduct.bind(this);
        this.purchaseProduct = this.purchaseProduct.bind(this);
    }

    createProduct(name, price) {
        this.setState({loading: true});
        this.state.marketplace.methods
            .createProduct(name, price)
            .send({from: this.state.account})
            .on("confirmation", (confirmation) => {
                this.setState({loading: false});
            })
            .on("error", (error) => {
                console.log("Error", error);
                this.setState({loading: false});
            });
    }

    purchaseProduct(id, price) {
        this.setState({loading: true});
        this.state.marketplace.methods
            .purchaseProduct(id)
            .send({from: this.state.account, value: price})
            .on("confirmation", (confirmation) => {
                this.setState({loading: false});
            })
            .on("error", (error) => {
                console.log("Error", error);
                this.setState({loading: false});
            });
    }

    render() {
        return (
            <div>
                <Navbar account={this.state.account}/>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex">
                            {this.state.loading ? (
                                <div id="loader" className="text-center">
                                    <p className="text-center">Loading...</p>
                                </div>
                            ) : (
                                <>
                                    <button onSubmit={() => mintNFT(this.state.account,
                                        "https://images.squarespace-cdn.com/content/v1/5b905ce9f93fd4ad8db28b8f/1599529299673-GZPXQUPV6F39726LETJI/ke17ZwdGBToddI8pDm48kDHPSfPanjkWqhH6pl6g5ph7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0mwONMR1ELp49Lyc52iWr5dNb1QJw9casjKdtTg1_-y4jz4ptJBmI9gQmbjSQnNGng/Dog+Training+in+Honolulu+HI-min.jpg?format=2500w")}>
                                        Mint
                                    </button>
                                    <Main
                                        account={this.state.account}
                                        products={this.state.products}
                                        createProduct={this.createProduct}
                                        purchaseProduct={this.purchaseProduct}
                                    />
                                </>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
