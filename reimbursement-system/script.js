// seleciona os elementos do formulário
const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');

//seleciona os elementos da lista 
const expenseList = document.querySelector('ul');
const expenseTotal = document.querySelector("aside header h2");
const expenseQuantity = document.querySelector("aside header p span");  


// captura o evento de input para formatar o valor do campo de entrada
amount.oninput = function() {
    let value = amount.value.replace(/\D/g, ""); // remove qualquer caractere que não seja número

    value = Number(value) / 100; // converte o valor para centavos

    amount.value = formatCurrencyBRL(value); // formata o valor como moeda brasileira
}

function formatCurrencyBRL(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

    // captura o evento do submit do formulario para obter os valores 
    form.onsubmit = (event) => {
    // impede o comportamento padrão do formulário
     event.preventDefault();

    // cria um objeto com os valores da nova despesa
     const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date().toISOString()
        }

        // chama a função para adicionar a nova despesa
        expenseAdd(newExpense); 
    }

    // adiciona um novo intem na lista 
    function expenseAdd(newExpense) {
        try {
        //cria o elemento de li para adicionar o item na lista (ul).
        const expenseItem = document.createElement('li');
        expenseItem.classList.add("expense");

        //cria o icon da categoria 
        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", newExpense.category_name);

        // cria a info da despesa
        const expenseInfo = document.createElement('div');
        expenseInfo.classList.add("expense-info");

        const expenseName = document.createElement("strong");
        expenseName.textContent = newExpense.expense;

        //cria a categoria da despesa 
        const expenseCategory = document.createElement("span");
        expenseCategory.textContent = newExpense.category_name;

        // adiociona nome e categoria na div de informacoes da despesa
        expenseInfo.append(expenseName, expenseCategory);
        
        // cria o valor da despesa
        const expenseAmount = document.createElement("span");
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount
            .toUpperCase()
            .replace("R$", "")}`

        // cria o botão de remover despesa
        const removeIcon = document.createElement("img");
        removeIcon.classList.add("remove-icon");
        removeIcon.setAttribute("src", "img/remove.svg");
        removeIcon.setAttribute("alt", "Remover");

        // adiciona as informacoes no item 
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

        // adiciona o item da lista
        expenseList.append(expenseItem);

        // limpa o formulario para add outro intem 
        formClear()

        // atualiza os totais 
        updateTotal();

        } catch   (error) {    
        alert('não foi possível adicionar a despesa: ' + error.message);
        }
    }

    // atualiza o valor total das despesas
    function updateTotal() {
        try {
        // recupera todos os intens (li) da lista (ul)
        const items = expenseList.children;

        // atualiza quantidade de itens na lista 
        expenseQuantity.textContent = `${items.length} ${items.length 
            > 1 ? 'despesas' : 'despesa'
        }`

        // variavel para incrementar o total. 
        let total = 0;

        //percorre cada (li) da lista (ul
        for( let item = 0; item < items.length; item++) {
          const itemAmount = items[item].querySelector(".expense-amount")

          // remover caracteres nao numericos e substitui a virgula por ponto.
          let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

          // converter o valor para float
          value = parseFloat(value)

          // verificar se e um numero valido 
          if (isNaN(value)){
            return alert(
                "Nao foi possivel calcular o total. O valor nao parecer ser um numero"
            )
          }

          // incrementar um valor total 
          total += Number (value) 
        }

        // cria a span para cria o R$ formatado.
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // formata o valor e remove o R$ que sera exibido com um estilo costumizado.
        total = formatCurrencyBRL(total).toUpperCase().replace("R$","") 

        expenseTotal.innerHTML = ""

        expenseTotal.append(symbolBRL,total) 
            
        }catch (error) {
            alert('não foi possível atualizar o valor total: ' + error.message);
        }

    }

        // evento que captura o clique nos intens da lista 
        expenseList.addEventListener("click", function (event) {
        // verefica se o elemento clicado e o icone remover
            if (event.target.classList.contains("remove-icon")){
        // obtem a (li) pai do elemento clicado
        const item = event.target.closest(".expense")
    

        // remove o item da lista 
        item.remove()

            }
        
        // atualiza os totais 
        updateTotal()
        })

        // limpa os inputs
        function formClear(){
          expense.value = ""
          category.value = ""
          amount.value = ""

          // coloca o foco no inputs de amount.
          expense.focus() 
        }

        
