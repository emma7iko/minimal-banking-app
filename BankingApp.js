const transactions = document.querySelector("#enter_transaction");
const transactionsSavings = document.querySelector("#enter_transaction_savings");
const transactionType = document.querySelector("#transaction_type");
const transactionTypeSavings = document.querySelector("#transaction_type_savings");
const transAmount = document.querySelector("#transaction_amount");
const transAmountSavings = document.querySelector("#transaction_amount_savings");
const transDescription = document.querySelector("#transaction_description");
const table = document.querySelector("#trans_table tbody");
const tableSavings = document.querySelector("#trans_table_savings tbody");
const checkingStartingBalance = document.querySelector("#checking_balance");
const savingsStartingBalance = document.querySelector("#savings_balance");

let checkingAccount = {
    balance: 0,
    transactions: [],
    deposit(amount) {
        this.balance += amount;
        this.transactions.push({ type: "Deposit", amount });
    },
    withdraw(amount) {
        this.balance -= amount;
        this.transactions.push({ type: "Withdraw", amount });
    },
    transfer(amount, toAccount) {
        this.withdraw(amount);
        toAccount.deposit(amount);
        this.transactions.push({ type: "Transfer", amount });
    }
};

let savingsAccount = {
    balance: 0,
    transactions: [],
    deposit(amount) {
        this.balance += amount;
        this.transactions.push({ type: "Deposit", amount });
    },
    withdraw(amount) {
        this.balance -= amount;
        this.transactions.push({ type: "Withdraw", amount });
    },
    transfer(amount, toAccount) {
        this.withdraw(amount);
        toAccount.deposit(amount);
        this.transactions.push({ type: "Transfer", amount });
    }
};

document.getElementById("submit_balance").addEventListener("click", getStartingBalance);
document.getElementById("submit_transaction").addEventListener("click", processTransaction);
document.getElementById("submit_transaction_savings").addEventListener("click", processTransactionSavings);
transactionType.addEventListener("change", toggleDescription);
transactionTypeSavings.addEventListener("change", toggleDescriptionSavings);

function getStartingBalance() {
    const checkStart = parseFloat(checkingStartingBalance.value);
    const saveStart = parseFloat(savingsStartingBalance.value);
    
    if (isNaN(checkStart) || isNaN(saveStart)) {
        alert("Please enter valid starting balances.");
        return;
    }
    
    checkingAccount.balance = checkStart;
    savingsAccount.balance = saveStart;
    updateBalances();
    toggleSections();
}

function updateBalances() {
    document.querySelector("#current_checking_balance").textContent = `Current Balance: Tsh${checkingAccount.balance.toFixed(2)}`;
    document.querySelector("#current_savings_balance").textContent = `Current Balance: Tsh${savingsAccount.balance.toFixed(2)}`;
}

function toggleSections() {
    document.getElementById("checking_info").style.display = "block";
    document.getElementById("savings_info").style.display = "block";
}

function processTransaction() {
    const amount = parseFloat(transAmount.value);
    const type = transactionType.value;
    const description = transDescription.value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    switch (type) {
        case "Deposit":
            checkingAccount.deposit(amount);
            break;
        case "Withdraw":
            if (checkingAccount.balance < amount) {
                alert("Insufficient funds.");
                return;
            }
            checkingAccount.withdraw(amount);
            break;
        case "Transfer":
            if (checkingAccount.balance < amount) {
                alert("Insufficient funds.");
                return;
            }
            checkingAccount.transfer(amount, savingsAccount);
            break;
    }

    updateBalances();
    printTransaction(table, checkingAccount, type, description); // Pass description
    transAmount.value = "";
    transDescription.value = ""; // Clear the description input
}

function processTransactionSavings() {
    const amount = parseFloat(transAmountSavings.value);
    const type = transactionTypeSavings.value;
    const description = document.querySelector("#transaction_description_savings").value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    switch (type) {
        case "Deposit":
            savingsAccount.deposit(amount);
            break;
        case "Withdraw":
            if (savingsAccount.balance < amount) {
                alert("Insufficient funds.");
                return;
            }
            savingsAccount.withdraw(amount);
            break;
        case "Transfer":
            if (savingsAccount.balance < amount) {
                alert("Insufficient funds.");
                return;
            }
            savingsAccount.transfer(amount, checkingAccount);
            break;
    }

    updateBalances();
    printTransaction(tableSavings, savingsAccount, type, description);
    transAmountSavings.value = "";
    document.querySelector("#transaction_description_savings").value = ""; // Clear the description input
}

function printTransaction(tableBody, account, type, description) {
    const newRow = tableBody.insertRow();
    newRow.insertCell(0).textContent = type;
    newRow.insertCell(1).textContent = description || ""; // Use the description parameter
    newRow.insertCell(2).textContent = account.transactions[account.transactions.length - 1].amount;
    newRow.insertCell(3).textContent = account.balance.toFixed(2);
}

function toggleDescription() {
    document.getElementById("desc").style.display = transactionType.value === "Debit" ? "block" : "none";
}

function toggleDescriptionSavings() {
    // Savings doesn't require description for all types
}
