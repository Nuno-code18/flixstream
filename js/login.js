function validatePhoneNumber() {
    let phoneInput = document.getElementById("phoneNumber");
    let phoneNumber = phoneInput.value.replace(/\D/g, ''); // Mantém apenas números
    phoneInput.value = phoneNumber;

    let getCodeLink = document.getElementById("getCodeLink");

    if (phoneNumber.length === 9) {
        phoneInput.style.border = "2px solid #00FF00"; // Borda verde
        getCodeLink.classList.add("active");
        getCodeLink.style.cursor = "pointer";
    } else {
        phoneInput.style.border = "2px solid #FF0000"; // Borda vermelha
        getCodeLink.classList.remove("active");
        getCodeLink.style.cursor = "not-allowed";
    }
}

let codeRequested = false; // Controle para saber se o código foi solicitado
let validCode = "123456"; // Simulação do código correto para validação

function getCode() {
    let getCodeLink = document.getElementById("getCodeLink");
    if (!getCodeLink.classList.contains("active")) return;

    // Remove funcionalidade do link
    getCodeLink.classList.remove("active");
    getCodeLink.style.cursor = "not-allowed";

    // Inicia a contagem regressiva
    let seconds = 90;
    getCodeLink.innerText = `Expira em ${seconds} segundos`;
    codeRequested = true; // Código foi solicitado

    let countdown = setInterval(() => {
        seconds--;
        getCodeLink.innerText = `Expira em ${seconds} segundos`;

        if (seconds <= 0) {
            clearInterval(countdown);
            getCodeLink.innerText = "Reenviar";
            getCodeLink.classList.add("active");
            getCodeLink.style.cursor = "pointer";

            // 🔹 Remover mensagem de erro ao expirar
            let errorMessage = document.getElementById("errorMessage");
            if (errorMessage) {
                errorMessage.style.display = "none";
            }

            // 🔹 Remover mensagem de sucesso ao expirar
            let successMessage = document.getElementById("successMessage");
            if (successMessage) {
                successMessage.style.display = "none";
            }
        }
    }, 1000);

    // Exibir mensagem de sucesso
    let successMessage = document.getElementById("successMessage");
    if (!successMessage) {
        successMessage = document.createElement("div");
        successMessage.id = "successMessage";
        successMessage.className = "success-message";
        document.querySelector(".validation-container").after(successMessage);
    }

    successMessage.innerHTML = `<img src="../assets/check-icon.png" alt="Check"> O código de validação foi enviado por SMS!`;
    successMessage.style.display = "flex";
    successMessage.style.opacity = "1"; 

    // 🔹 Remover mensagem de atenção ao clicar em "Obter Código"
    let warningMessage = document.getElementById("errorMessage");
    if (warningMessage) {
        warningMessage.style.display = "none";
    }
}

// 🔹 Esconder mensagem de sucesso ao começar a digitar o código
document.getElementById("validationCode").addEventListener("input", function() {
    let successMessage = document.getElementById("successMessage");
    if (successMessage) {
        successMessage.style.display = "none";
    }
});

function updateNextButtonState() {
    let phoneInput = document.getElementById("phoneNumber").value;
    let validationCode = document.getElementById("validationCode").value;
    let nextButton = document.getElementById("nextButton");

    // Ativar o botão apenas se o número e o código forem válidos
    if (phoneInput.length === 9 && validationCode.length === 6) {
        nextButton.style.opacity = "1";
        nextButton.style.cursor = "pointer";
        nextButton.disabled = false;
    } else {
        nextButton.style.opacity = "0.5";
        nextButton.style.cursor = "not-allowed";
        nextButton.disabled = true;
    }
}

// Atualiza o botão quando o usuário digita
document.getElementById("phoneNumber").addEventListener("input", updateNextButtonState);
document.getElementById("validationCode").addEventListener("input", updateNextButtonState);

function showErrorMessage(type) {
    let errorMessage = document.getElementById("errorMessage");

    if (!errorMessage) {
        errorMessage = document.createElement("div");
        errorMessage.id = "errorMessage";
        errorMessage.className = "error-message";
        document.querySelector(".validation-container").after(errorMessage);
    }

    if (type === "noCode") {
        errorMessage.innerHTML = `<img src="../assets/atenção.png" alt="Atenção"> Por favor, clique em Obter código para enviarmos por SMS!`;
        errorMessage.className = "warning-message";
    } else if (type === "invalid") {
        errorMessage.innerHTML = `<img src="../assets/erro.png" alt="Erro"> Número de telefone ou código de validação errado!`;
        errorMessage.className = "error-message";
    }

    errorMessage.style.display = "flex";
}

// 🔹 Esconde mensagens ao alterar os campos
document.getElementById("phoneNumber").addEventListener("input", function() {
    let errorMessage = document.getElementById("errorMessage");
    if (errorMessage) {
        errorMessage.style.display = "none";
    }
});
document.getElementById("validationCode").addEventListener("input", function() {
    let errorMessage = document.getElementById("errorMessage");
    if (errorMessage) {
        errorMessage.style.display = "none";
    }
});

// 🔹 Lógica do botão "Próximo"
document.getElementById("nextButton").addEventListener("click", function() {
    let phoneInput = document.getElementById("phoneNumber").value;
    let validationCode = document.getElementById("validationCode").value;
    let getCodeLink = document.getElementById("getCodeLink").innerText.trim();

    // Se o código não foi solicitado antes, exibe mensagem de atenção
    if (!codeRequested) {
        showErrorMessage("noCode");
        return;
    }

    // Se o código for incorreto, exibe mensagem de erro
    if (validationCode !== validCode) {
        showErrorMessage("invalid");
        return;
    }

    // 🔹 Se tudo estiver certo, redireciona para a próxima página
    window.location.href = "proxima_pagina.html"; // Altere para a página correta
});
document.addEventListener("DOMContentLoaded", function() {
    let phoneInput = document.getElementById("phoneNumber");
    let validationCodeInput = document.getElementById("validationCode");
    let getCodeLink = document.getElementById("getCodeLink");
    let nextButton = document.getElementById("nextButton");

    // Pressionar Enter no campo de telefone -> Aciona "Obter Código"
    phoneInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && phoneInput.value.length === 9) {
            getCode();
        }
    });

    // Pressionar Enter no campo de código de validação -> Aciona "Próximo"
    validationCodeInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && validationCodeInput.value.length === 6) {
            nextButton.click();
        }
    });

    // Garantir foco correto ao usar "Tab"
    phoneInput.setAttribute("tabindex", "1");
    validationCodeInput.setAttribute("tabindex", "2");
    nextButton.setAttribute("tabindex", "3");
    getCodeLink.setAttribute("tabindex", "4");
});
// Permitir pressionar "Enter" para abrir os links
document.getElementById("termsLink").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        window.location.href = "termos.html"; // Redireciona para os Termos
    }
});

document.getElementById("registerLink").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        window.location.href = "cadastro.html"; // Redireciona para Criar Conta
    }
});
