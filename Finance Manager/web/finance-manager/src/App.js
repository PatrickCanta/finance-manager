import React,{Component} from 'react';
import axios from "axios";



class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            history: [],
            amount: "",
            type: "",
            details: "",
            filter: "ALL"
        };
    }


    loadTransactions=() => {
        axios.get("http://localhost:8080/transactions").then(response => {
            this.setState({
                history: response.data
            });
        });
    };

    createTransaction=(amount,type,details,date) => {
        return axios.post("http://localhost:8080/transactions",{
            amount: amount,
            type: type,
            details: details,
            date: date
        });
    };

    setFilter=filter => {
        this.setState({
            filter: filter
        });
    };

    componentDidMount() {
        this.loadTransactions();
    }

    onKeyPress=async event => {
        if(event.key==="Enter") {
            const amount=this.state.amount;
            const type=this.state.type;
            const details=this.state.details;




            this.setState({amount: ""})

            this.createTransaction(amount,type,details).then(() => this.loadTransactions());

        };
    };

    onAmountChange=event => {
        const amount=event.currentTarget.value;
        this.setState({
            amount: amount,

        });
    };

    onTypeChange=event => {
        const type=event.currentTarget.value;
        this.setState({
            type: type,

        });
    };

    onDetailsChange=event => {
        const details=event.currentTarget.value;
        this.setState({
            details: details,

        });
    };


    filterTransactions=() => {
        if(this.state.filter==="ALL") {
            return this.state.history;
        }

        if(this.state.filter==="INCOMES") {
            return this.state.history.filter(transaction => {
                return transaction.type==="income";
            });
        }

        if(this.state.filter==="EXPENSES") {
            return this.state.history.filter(transaction => {
                return transaction.type==="expense";
            });
        }
    }


    render() {
        // eslint-disable-next-line
        const balance=this.state.history.reduce((accumulator,transaction) => {
            if(transaction.type==='income') return accumulator+transaction.amount;
            if(transaction.type==='expense') return accumulator-transaction.amount;
        },0);

        const filteredTransactions=this.filterTransactions();


        return (


            <div className="container">
                <div className="title">Welcome to your wallet!</div>
                <label>
                    <input
                        className="input"
                        type="number"
                        placeholder="Please state your amount.."
                        value={this.state.amount}
                        onKeyPress={this.onKeyPress}
                        onChange={this.onAmountChange}
                        required>
                    </input>
                </label>
                <select className="type" onChange={this.onTypeChange} required >
                    <option>Amount type..</option>
                    <option value="expense" >Expense</option>
                    <option value="income" >Income</option>
                </select>

                <label>
                    <input
                        className="details"
                        onChange={this.onDetailsChange}
                        type="text"
                        placeholder="Enter transaction details.."
                        value={this.state.details}
                        required
                        maxLength="100">
                    </input>

                </label>



                <div className="historyTitle">Transactions history</div>

                <div className="history" value={this.state.history}>
                    {filteredTransactions.map(transaction => {
                        return (
                            <div className={`transaction ${transaction.type}`} key={transaction.id}>
                                <span className="space">{transaction.amount}</span>
                                <span>{transaction.type}</span>
                                <p>{transaction.details}</p>
                            </div>
                        );
                    })}
                </div>


                <div className="balance">Balance: {balance}</div>



                <div className="filters">
                    <button className="filter" onClick={() => this.setFilter("ALL")}>All</button>
                    <button className="filter" onClick={() => this.setFilter("INCOMES")}>Incomes</button>
                    <button className="filter" onClick={() => this.setFilter("EXPENSES")}>Expenses</button>
                </div>


            </div>






        );
    };
};

export default App;