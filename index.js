const validateUser = async (email) => {
  try {
    const response = await fetch(
      `https://mp-wallet-app-api.herokuapp.com/users?email=${email}`
    );
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error validating user:", error);
    return { error: "Falha ao validar e-mail." };
  }
};

const onClickLogin = async () => {
  const emailInput = document.getElementById("input-email");
  const email = emailInput.value.trim();

  if (email.length < 5 || !email.includes("@")) {
    alert("Email inválido!");
    return;
  }

  try {
    const result = await validateUser(email);

    if (result.error) {
      alert(result.error);
      return;
    }

    const { email: userEmail, name: userName, id: userId } = result;

    localStorage.setItem("@WalletApp:userEmail", userEmail);
    localStorage.setItem("@WalletApp:userName", userName);
    localStorage.setItem("@WalletApp:userId", userId);

    window.open("./src/pages/home/index.html", "_self");
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.");
  }
};
