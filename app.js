const novoProduto = {
    title: 'Produto de Teste',
    price: 13.5,
    description: 'Uma descrição para o novo produto.',
    image: 'https://i.pravatar.cc',
    category: 'electronic'
};

fetch('https://fakestoreapi.com/products', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(novoProduto)
})
.then(res => res.json())
.then(json => console.log('Produto Cadastrado:', json));
const dadosParaAtualizar = {
    title: 'Novo Título Atualizado'
};

fetch('https://fakestoreapi.com/products/7', { 
    method: "PUT", 
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(dadosParaAtualizar)
})
.then(res => res.json())
.then(json => console.log('Produto Atualizado:', json));
fetch('https://fakestoreapi.com/products/6', { 
    method: "DELETE"
})
.then(res => res.json())
.then(json => console.log('Produto Excluído:', json));
document.addEventListener("DOMContentLoaded", () => {
    const listaProdutosContainer = document.getElementById("listaProdutos");
    const formProduto = document.getElementById("formProduto");
    const submitButton = document.getElementById("submitButton");
    const produtoIdInput = document.getElementById("produtoId");

    
    async function carregarProdutos() {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            const produtos = await response.json();

            listaProdutosContainer.innerHTML = '';

            produtos.forEach((prod) => {
                const item = document.createElement("div");
                item.classList.add("produto");
                
                
                item.innerHTML = `
                    <img src="${prod.image}" alt="${prod.title}">
                    <h3>${prod.title}</h3>
                    <p><strong>Preço:</strong> $${prod.price.toFixed(2)}</p>
                    <p>${prod.description.substring(0, 80)}...</p>
                    <div class="actions">
                        <button class="edit-btn" data-id="${prod.id}">Editar</button>
                        <button class="delete-btn" data-id="${prod.id}">Excluir</button>
                    </div>
                `;

                listaProdutosContainer.appendChild(item);
            });
            
            adicionarListenersAcoes(); 

        } catch (erro) {
            console.error("Erro ao carregar produtos:", erro);
            listaProdutosContainer.innerHTML = "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
        }
    }

    
    formProduto.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const produtoId = produtoIdInput.value;
        
        const produtoData = {
            title: document.getElementById('title').value,
            price: parseFloat(document.getElementById('price').value),
            description: document.getElementById('description').value,
            image: document.getElementById('image').value,
            category: document.getElementById('category').value,
        };
        
        if (produtoId) {
            await atualizarProduto(produtoId, produtoData);
        } else {
            await cadastrarProduto(produtoData);
        }
        
        
        formProduto.reset();
        produtoIdInput.value = '';
        submitButton.textContent = 'Cadastrar Produto';
        await carregarProdutos(); 
    });

    
    async function cadastrarProduto(dados) {
        try {
            const response = await fetch('https://fakestoreapi.com/products', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            const json = await response.json();
            alert(`Produto cadastrado com sucesso (ID de Teste: ${json.id})!`);
        } catch (erro) {
            console.error("Erro ao cadastrar produto:", erro);
        }
    }

    
    async function atualizarProduto(id, dados) {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            const json = await response.json();
            alert(`Produto ID ${id} atualizado com sucesso!`);
        } catch (erro) {
            console.error("Erro ao atualizar produto:", erro);
        }
    }
    
    
    async function excluirProduto(id) {
        if (!confirm(`Tem certeza que deseja excluir o produto ID ${id}?`)) {
            return;
        }
        
        try {
            await fetch(`https://fakestoreapi.com/products/${id}`, {
                method: "DELETE"
            });
            alert(`Produto ID ${id} excluído com sucesso!`);
            await carregarProdutos(); 
        } catch (erro) {
            console.error("Erro ao excluir produto:", erro);
        }
    }
    
    
    
    function preencherFormulario(produto) {
        produtoIdInput.value = produto.id;
        document.getElementById('title').value = produto.title;
        document.getElementById('price').value = produto.price;
        document.getElementById('description').value = produto.description;
        document.getElementById('image').value = produto.image;
        document.getElementById('category').value = produto.category;
        submitButton.textContent = `Salvar Alterações (ID: ${produto.id})`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    
    function adicionarListenersAcoes() {
        
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                const produto = await response.json();
                preencherFormulario(produto);
            });
        });

        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                excluirProduto(id);
            });
        });
    }

    
    carregarProdutos();
});



