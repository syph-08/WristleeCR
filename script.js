const form = document.getElementById('productForm');
const productList = document.getElementById('productList');
const totalPriceDisplay = document.getElementById('totalPrice');
const expectedPriceDisplay = document.getElementById('expectedPrice');

let products = JSON.parse(localStorage.getItem('products')) || [];

// Formatter: adds dot as thousands separator
const formatter = new Intl.NumberFormat('de-DE');

function saveToLocalStorage() {
  localStorage.setItem('products', JSON.stringify(products));
}

function renderProducts() {
  productList.innerHTML = '';
  let total = 0;

  products.forEach((item, index) => {
    const li = document.createElement('li');

    const infoDiv = document.createElement('div');
    infoDiv.className = 'item-info';
    infoDiv.innerHTML = `<strong>${item.name}</strong> - ₡${formatter.format(item.price)}`;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'item-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.onclick = () => {
      products.splice(index, 1);
      saveToLocalStorage();
      renderProducts();
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.onclick = () => {
      const newName = prompt('Remplazar nombre:', item.name);
      const newPrice = prompt('Remplazar precio:', item.price);
      if (newName && !isNaN(newPrice)) {
        products[index] = {
          name: newName.trim(),
          price: parseFloat(newPrice)
        };
        saveToLocalStorage();
        renderProducts();
      }
    };

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(infoDiv);
    li.appendChild(actionsDiv);
    productList.appendChild(li);

    total += item.price;
  });

  const expectedTotal = total + (products.length * 100);

  totalPriceDisplay.textContent = `Total: ₡${formatter.format(total)}`;
  expectedPriceDisplay.textContent = `Expectado: ₡${formatter.format(expectedTotal)}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('product').value.trim();
  const price = parseFloat(document.getElementById('price').value);

  if (!name || isNaN(price)) return;

  products.push({ name, price });
  saveToLocalStorage();
  renderProducts();

  form.reset();
});

function clearData() {
  if (confirm('¿De verdad quieres eliminar todos los productos?')) {
    products = [];
    saveToLocalStorage();
    renderProducts();
  }
}

// Initial render
renderProducts();
