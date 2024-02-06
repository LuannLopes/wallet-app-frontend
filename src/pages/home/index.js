const onLogout = () => {
  localStorage.clear();
  window.open("../../../index.html", "_self");
};

const onDeleteItem = async (id) => {
  try {
    const email = localStorage.getItem("@WalletApp:userEmail");

    await fetch(`https://mp-wallet-app-api.herokuapp.com/finances/${id}`, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        email: email,
      },
    });
    onLoadFinancesData();
  } catch (error) {
    alert("Error ao deletar o item.");
  }
};

const createTableHeaderCell = (text, className = "") => {
  const cell = document.createElement("th");
  cell.appendChild(document.createTextNode(text));
  cell.className = className;
  return cell;
};

const createTableCell = (text, className = "") => {
  const cell = document.createElement("td");
  cell.appendChild(document.createTextNode(text));
  cell.className = className;
  return cell;
};

const renderFinancesList = (data) => {
  const table = document.getElementById("finances-table");
  table.innerHTML = "";

  const tableHeader = document.createElement("tr");
  tableHeader.appendChild(createTableHeaderCell("Título"));
  tableHeader.appendChild(createTableHeaderCell("Categoria"));
  tableHeader.appendChild(createTableHeaderCell("Data"));
  tableHeader.appendChild(createTableHeaderCell("Valor", "center"));
  tableHeader.appendChild(createTableHeaderCell("Ação", "right"));

  table.appendChild(tableHeader);

  data.forEach((item) => {
    const tableRow = document.createElement("tr");

    // title
    tableRow.appendChild(createTableCell(item.title));

    // category
    tableRow.appendChild(createTableCell(item.name));

    // date
    const formattedDate = new Date(item.date).toLocaleString("pt-BR", {
      timezone: "UTC",
    });
    tableRow.appendChild(createTableCell(formattedDate));

    // value
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(item.value);
    tableRow.appendChild(createTableCell(formattedValue, "center"));

    // delete
    const deleteCell = createTableCell("Deletar", "right");
    deleteCell.style.cursor = "pointer";
    deleteCell.onclick = () => onDeleteItem(item.id);
    tableRow.appendChild(deleteCell);

    // table add tableRow
    table.appendChild(tableRow);
  });
};

const renderFinanceElement = (parentId, subtext, value, elementId) => {
  const financeCard = document.getElementById(parentId);
  financeCard.innerHTML = "";

  const subtextElement = document.createElement("h3");
  subtextElement.appendChild(document.createTextNode(subtext));
  financeCard.appendChild(subtextElement);

  const valueText = document.createTextNode(
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  );

  const valueElement = document.createElement("h1");
  valueElement.id = elementId;
  valueElement.className = "mt smaller";
  valueElement.appendChild(valueText);
  financeCard.appendChild(valueElement);
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

  renderFinanceElement(
    "finance-card-1",
    "Total de lançamentos",
    totalItems,
    "total-element"
  );
  renderFinanceElement(
    "finance-card-2",
    "Receitas",
    revenues,
    "revenue-element"
  );
  renderFinanceElement(
    "finance-card-3",
    "Despesas",
    expenses,
    "expenses-element"
  );

  const financeCard4 = document.getElementById("finance-card-4");
  financeCard4.innerHTML = "";

  renderFinanceElement(
    "finance-card-4",
    "Balanço",
    totalValue,
    "balance-element"
  );
  document.getElementById("balance-element").style.color = "#5936CD";
};

const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    return { error };
  }
};

const renderElement = (container, elementType, text) => {
  const element = document.createElement(elementType);
  element.appendChild(document.createTextNode(text));
  container.appendChild(element);
};

const addLogoutLink = () => {
  const logoutElement = document.createElement("a");
  logoutElement.textContent = "sair";
  logoutElement.style.cursor = "pointer";
  logoutElement.onclick = () => onLogout();
  return logoutElement;
};

const addInitialsToAvatar = (container, text) => {
  const initialsElement = document.createElement("h3");
  initialsElement.appendChild(document.createTextNode(text));
  container.appendChild(initialsElement);
};

const onLoadFinancesData = async () => {
  try {
    const dateInputValue = document.getElementById("select-date").value;
    const email = localStorage.getItem("@WalletApp:userEmail");

    const options = {
      method: "GET",
      headers: { email },
    };

    const data = await fetchData(
      `https://mp-wallet-app-api.herokuapp.com/finances?date=${dateInputValue}`,
      options
    );

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

  renderElement(navbarUserInfo, "p", email);
  navbarUserInfo.appendChild(addLogoutLink());

  addInitialsToAvatar(navbarUserAvatar, name.charAt(0));
};

const onLoadCategories = async () => {
  try {
    const categoriesSelect = document.getElementById("input-category");
    const categoriesResult = await fetchData(
      "https://mp-wallet-app-api.herokuapp.com/categories"
    );

    categoriesResult.forEach((category) => {
      const option = document.createElement("option");
      option.id = `category_${category.id}`;
      option.value = category.id;
      option.appendChild(document.createTextNode(category.name));
      categoriesSelect.append(option);
    });
  } catch (error) {
    alert("Error ao carregar categorias");
  }
};

const toggleModalDisplay = (displayStyle) => {
  const modal = document.getElementById("modal");
  modal.style.display = displayStyle;
};

const onOpenModal = () => {
  toggleModalDisplay("flex");
};

const onCloseModal = () => {
  toggleModalDisplay("none");
};

const onCallAddFinance = async (data) => {
  try {
    const email = localStorage.getItem("@WalletApp:userEmail");
    const options = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        email,
      },
      body: JSON.stringify(data),
    };

    const result = await fetchData(
      "https://mp-wallet-app-api.herokuapp.com/finances",
      options
    );

    return result;
  } catch (error) {
    return { error };
  }
};

const onCreateFinanceRelease = async (target) => {
  try {
    const title = target[0].value;
    const value = Number(target[1].value);
    const date = target[2].value;
    const category = Number(target[3].value);

    const result = await onCallAddFinance({
      title,
      value,
      date,
      category_id: category,
    });

    if (result.error) {
      alert("Error ao adicionar novo dado financeiro");
      return;
    }
    onCloseModal();
    onLoadFinancesData();
  } catch (error) {
    alert("Error ao adicionar novo dado financeiro");
  }
};

const setInitialDate = () => {
  const dateInput = document.getElementById("select-date");
  const newDate = new Date().toISOString().split("T")[0];
  dateInput.value = newDate;
  dateInput.addEventListener("change", onLoadFinancesData);
};

window.onload = () => {
  setInitialDate();
  onLoadUserInfo();
  onLoadFinancesData();
  onLoadCategories();

  const form = document.getElementById("form-finance-release");
  form.onsubmit = (event) => {
    event.preventDefault();
    onCreateFinanceRelease(event.target);
  };
};
