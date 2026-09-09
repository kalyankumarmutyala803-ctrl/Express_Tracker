// ===============================
// GET HTML ELEMENTS
// ===============================

const form = document.getElementById("expenseForm");

const description = document.getElementById("description");

const amount = document.getElementById("amount");

const type = document.getElementById("type");

const category = document.getElementById("category");

const date = document.getElementById("date");

const transactionsContainer =
    document.getElementById("transactions");

const filter =
    document.getElementById("filter");

const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expenseElement =
    document.getElementById("expense");

const countElement =
    document.getElementById("count");

const clearAllButton =
    document.getElementById("clearAll");


// ===============================
// SET TODAY'S DATE
// ===============================

date.value = new Date()
    .toISOString()
    .split("T")[0];


// ===============================
// LOAD DATA FROM LOCAL STORAGE
// ===============================

let transactions =
    JSON.parse(
        localStorage.getItem("expenseTrackerData")
    ) || [];


// ===============================
// FORMAT MONEY
// ===============================

function formatMoney(value) {

    return "₹" +
        Number(value).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


// ===============================
// SAVE DATA
// ===============================

function saveTransactions() {

    localStorage.setItem(
        "expenseTrackerData",
        JSON.stringify(transactions)
    );
}


// ===============================
// PREVENT HTML INJECTION
// ===============================

function escapeHTML(text) {

    return text.replace(
        /[&<>"']/g,

        function (character) {

            const entities = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };

            return entities[character];

        }
    );
}


// ===============================
// DISPLAY TRANSACTIONS
// ===============================

function displayTransactions() {

    // Calculate income

    const totalIncome =
        transactions

            .filter(transaction =>
                transaction.type === "income"
            )

            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );


    // Calculate expenses

    const totalExpense =
        transactions

            .filter(transaction =>
                transaction.type === "expense"
            )

            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );


    // Calculate balance

    const balance =
        totalIncome - totalExpense;


    // Update dashboard

    balanceElement.textContent =
        formatMoney(balance);

    incomeElement.textContent =
        formatMoney(totalIncome);

    expenseElement.textContent =
        formatMoney(totalExpense);


    // Filter transactions

    let filteredTransactions =
        transactions;


    if (filter.value !== "all") {

        filteredTransactions =
            transactions.filter(
                transaction =>
                    transaction.type === filter.value
            );

    }


    // Update transaction count

    countElement.textContent =
        filteredTransactions.length +
        " transaction" +
        (filteredTransactions.length === 1
            ? ""
            : "s");


    // No transactions

    if (filteredTransactions.length === 0) {

        transactionsContainer.innerHTML = `
            <div class="empty">
                No transactions found.
                <br>
                Add your first transaction.
            </div>
        `;

        return;

    }


    // Display transactions

    transactionsContainer.innerHTML =
        filteredTransactions.map(
            transaction => {

                const isIncome =
                    transaction.type === "income";


                return `

                    <div class="transaction">

                        <div class="transaction-left">

                            <div class="transaction-icon">
                                ${isIncome ? "↗" : "↘"}
                            </div>

                            <div>

                                <div class="transaction-title">
                                    ${escapeHTML(
                                        transaction.description
                                    )}
                                </div>

                                <div class="transaction-meta">
                                    ${escapeHTML(
                                        transaction.category
                                    )}
                                    •
                                    ${transaction.date}
                                </div>

                            </div>

                        </div>


                        <div>

                            <span class="amount
                                ${isIncome
                                    ? "income-amount"
                                    : "expense-amount"}">

                                ${isIncome ? "+" : "-"}

                                ${formatMoney(
                                    transaction.amount
                                )}

                            </span>


                            <button
                                class="delete-btn"
                                onclick="deleteTransaction(
                                    ${transaction.id}
                                )">

                                ×

                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


// ===============================
// ADD TRANSACTION
// ===============================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const newTransaction = {

            id: Date.now(),

            description:
                description.value.trim(),

            amount:
                Number(amount.value),

            type:
                type.value,

            category:
                category.value,

            date:
                date.value

        };


        transactions.unshift(
            newTransaction
        );


        saveTransactions();


        displayTransactions();


        // Reset form

        form.reset();


        // Set today's date again

        date.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }
);


// ===============================
// DELETE TRANSACTION
// ===============================

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveTransactions();

    displayTransactions();

}


// ===============================
// FILTER
// ===============================

filter.addEventListener(
    "change",
    displayTransactions
);


// ===============================
// CLEAR ALL
// ===============================

clearAllButton.addEventListener(
    "click",
    function () {

        if (transactions.length === 0) {

            alert("There are no transactions.");

            return;

        }


        const confirmation =
            confirm(
                "Are you sure you want to delete all transactions?"
            );


        if (confirmation) {

            transactions = [];

            saveTransactions();

            displayTransactions();

        }

    }
);


// ===============================
// INITIAL DISPLAY
// ===============================

displayTransactions();