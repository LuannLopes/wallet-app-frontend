const renderFinancesList = (data) => {
  const table = document.getElementById("finances-table");

  data.map((item) => {
    const tableRow = document.createElement("tr");
    tableRow.className = "mt smaller";

    // title
    const titleTd = document.createElement("td");
    const titleText = document.createTextNode(item.title);
    titleTd.appendChild(titleText);
    tableRow.appendChild(titleTd);

    // category
    const categoryTd = document.createElement("td");
    const categoryText = document.createTextNode(item.name);
    categoryTd.appendChild(categoryText);
    tableRow.appendChild(categoryTd);

    // category
    const dateTd = document.createElement("td");
    const dateText = document.createTextNode(
      new Date(item.date).toLocaleDateString()
    );
    dateTd.appendChild(dateText);
    tableRow.appendChild(dateTd);

    // value
    const valueTd = document.createElement("td");
    valueTd.className = "center";
    const valueText = document.createTextNode(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.value)
    );
    valueTd.appendChild(valueText);
    tableRow.appendChild(valueTd);

    // delete
    const deleteTd = document.createElement("td");
    deleteTd.className = "right";
    const deleteText = document.createTextNode("Deletar");
    deleteTd.appendChild(deleteText);
    tableRow.appendChild(deleteTd);

    // table add tablerow
    table.appendChild(tableRow);
  });
};

const renderFinanceElements = (data) => {
  const totalItems = data.length;
  const revenues = data
    .filter((item) => Number(item.value) > 0)
    .reduce((acc, item) => acc + Number(item.value), 0);
  const expenses = data
    .filter((item) => Number(item.value) < 0)
    .reduce((acc, item) => acc + Number(item.value), 0);
  const totalValue = revenues + expenses;

  // render total items
  const financeCard1 = document.getElementById("finance-card-1");
  const totalText = document.createTextNode(totalItems);
  const totalElement = document.createElement("h1");
  totalElement.className = "mt smaller";
  totalElement.appendChild(totalText);
  financeCard1.appendChild(totalElement);

  // render revenue
  const financeCard2 = document.getElementById("finance-card-2");
  const revenueText = document.createTextNode(
    revenues.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    })
  );
  const revenueElement = document.createElement("h1");
  revenueElement.className = "mt smaller";
  revenueElement.appendChild(revenueText);
  financeCard2.appendChild(revenueElement);

  // render expenses
  const financeCard3 = document.getElementById("finance-card-3");
  const expensesText = document.createTextNode(
    expenses.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    })
  );
  const expensesElement = document.createElement("h1");
  expensesElement.className = "mt smaller";
  expensesElement.appendChild(expensesText);
  financeCard3.appendChild(expensesElement);

  // render balance
  const financeCard4 = document.getElementById("finance-card-4");
  const balanceText = document.createTextNode(
    totalValue.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    })
  );
  const balanceElement = document.createElement("h1");
  balanceElement.className = "mt smaller";
  balanceElement.style.color = "#5936CD";
  balanceElement.appendChild(balanceText);
  financeCard4.appendChild(balanceElement);
};

const onLoadFinancesData = async () => {
  try {
    const date = "2022-12-15";
    const email = localStorage.getItem("@WalletApp:userEmail");
    const result = await fetch(
      `https://mp-wallet-app-api.herokuapp.com/finances?date=${date}`,
      {
        method: "GET",
        headers: {
          email: email,
        },
      }
    );
    const data = await result.json();
    renderFinanceElements(data);
    renderFinancesList(data);
    return data;
  } catch (error) {
    return { error };
  }
};

const onLoadUserInfo = () => {
  const email = localStorage.getItem("@WalletApp:userEmail");
  const name = localStorage.getItem("@WalletApp:userName");

  const navbarUserInfo = document.getElementById("navbar-user-container");
  const navbarUserAvatar = document.getElementById("navbar-user-avatar");

  const emailElement = document.createElement("p");
  const emailText = document.createTextNode(email);
  emailElement.appendChild(emailText);
  navbarUserInfo.appendChild(emailElement);

  const logoutElement = document.createElement("a");
  const logoutText = document.createTextNode("sair");
  logoutElement.appendChild(logoutText);
  navbarUserInfo.appendChild(logoutElement);

  const nameElement = document.createElement("h3");
  const nameText = document.createTextNode(name.charAt(0));
  nameElement.appendChild(nameText);
  navbarUserAvatar.appendChild(nameElement);
};

const onLoadCategories = async () => {
  try {
    const categoriesSelect = document.getElementById("input-category");
    const response = await fetch(
      "https://mp-wallet-app-api.herokuapp.com/categories"
    );
    const categoriesResult = await response.json();
    categoriesResult.map((category) => {
      const option = document.createElement("option");
      const categoryText = document.createTextNode(category.name);
      option.id = `category_${category.id}`;
      option.value = category.id;
      option.appendChild(categoryText);
      categoriesSelect.append(option);
    });
  } catch (error) {
    alert("Error ao carregar categorias");
  }
};

const onOpenModal = () => {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
};

const onCloseModal = () => {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
};

window.onload = () => {
  onLoadUserInfo();
  onLoadFinancesData();
};
