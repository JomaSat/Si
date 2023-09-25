
const MAIN_URL = 'http://192.168.1.102:8000';


// Search

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const productontainer = document.querySelector('.product-no');
const productContainer = document.querySelector('.product-container');


searchButton.addEventListener('click', async () => {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
      productontainer.innerHTML = '';
      await fetchDetailList();
      return;
  }

  try {
      const response = await fetch(`${MAIN_URL}/product/search/?search=${searchTerm}`);

      if (!response.ok) {
          throw new Error(`Ошибка при загрузке данных: ${response.status} ${response.statusText}`);
      }

      const searchData = await response.json();
      const searchResults = searchData.data; // Обновленная структура данных
      renderSearchResults(searchResults);
  } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
  }
});

function renderSearchResults(results) {
  productontainer.innerHTML = '';
  // productContainer.innerHTML = '';

  if (results.length === 0) {
      productontainer.textContent = 'Ничего не найдено';
      productContainer.textContent = '';
      return;
  }

  fetchFiles().then(files => {
      results.forEach(result => {
          const productCard = getProduct(result, files);
          productontainer.appendChild(productCard);
          productContainer.innerHTML = '';
      });
  }).catch(error => {
      console.error('Ошибка при загрузке данных:', error);
  });
}

// Bascet 

const openModalBtn = document.getElementById('openModalBtn');
const closeModalBasket = document.getElementById('closeModalBasket');
const cartModal = document.getElementById('cartModal');

closeModalBasket.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

openModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});


cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// render product

const fetchDetailList = async () => {
  try {
    const response = await fetch(`${MAIN_URL}/product`);

    if (!response.ok) {
      throw new Error(`Ошибка при загрузке данных: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const files = await fetchFiles();
    renderProducts(data, files);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
}

//render file

const fetchFiles = async () => {
  try {
    const response = await fetch(`${MAIN_URL}/file/`);
    
    if (!response.ok) {
      throw new Error(`Ошибка при загрузке данных: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
}

const addToCart = (product) => {
  // Здесь можно добавить логику для добавления товара в корзину.
};

function renderProducts(products, files) {
  const productContainer = document.querySelector('.product-container');

  products.forEach(product => {
    const productCard = getProduct(product, files);
    productContainer.appendChild(productCard);
  });
}

function getProduct(data, files) {
  const { id, name, price, description } = data;
  const div = document.createElement('div');
  div.classList.add('product-card');

  const mainProductFile = files.find(file => file.product === id && file.main_file);

  if (mainProductFile) {
    const img = document.createElement('img');
    img.classList.add('images_card')
    img.src = mainProductFile.file;
    img.alt = name;
    img.classList.add('product-image');
    div.appendChild(img);
  }

  const productName = document.createElement('div');
  productName.classList.add('product-name');
  productName.textContent = name;
  div.appendChild(productName);

  const productPrice = document.createElement('div');
  productPrice.classList.add('product-price');
  productPrice.innerHTML = `${price} <span class="orange">сом</span>`;
  div.appendChild(productPrice);

  const productBtn = document.createElement('button');
  productBtn.classList.add('product_btn')
  productBtn.innerHTML = 'Купить'
  div.appendChild(productBtn);

  div.onclick = () => {
    window.location.href = `product_detail.html?id=${id}`;
  };

  return div;
}



(async () => {
  await fetchDetailList();
})();