const MAIN_URL = 'http://192.168.1.102:8000';

const queryParams = new URLSearchParams(window.location.search);
const productId = queryParams.get('id');
let offset = 0;
const slide = document.querySelector('.slide');
const slideWidth = 300; 
let totalImages = 0; 


document.querySelector('.slider-nex').addEventListener('click', function() {
    offset += slideWidth;
    if (offset > slideWidth * (totalImages - 1)) {
        offset = 0;
    }
    slide.style.left = -offset + 'px';
});

document.querySelector('.slider-prev').addEventListener('click', function() {
    offset -= slideWidth;
    if (offset < 0) {
        offset = slideWidth * (totalImages - 1);
    }   
    slide.style.left = -offset + 'px';
});

document.addEventListener("DOMContentLoaded", function() {
    const addBtn = document.querySelector(".buyBtn");
    const modal = document.getElementById("myModal");
    const closeBtn = document.querySelector(".close");
    const firstNameInput = document.getElementById("firstNameInput")
    const phoneInput = document.getElementById("phoneInput");
    const addressInput = document.getElementById("addressInput");
    const submitBtn = document.querySelector(".submitBtn"); 


    addBtn.addEventListener("click", function() {
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

        submitBtn.addEventListener("click", function() {
            const url = `${MAIN_URL}/order/click/${productId}/create/`;
        
            const data = {
                "first_name": firstNameInput.value,
                "phone_number": phoneInput.value,
                "address": addressInput.value
            };
        
        fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (response.status === 201) {
                    const successMessage = document.createElement("div");
                    successMessage.textContent = "Мы получили ваш заказ!";
                    successMessage.classList.add("success-message");
                    
                    const modalContent = document.querySelector(".massege");
                    modalContent.appendChild(successMessage);
                } else if (response.status === 400) {
                    const errorMessage = document.createElement("div");
                    errorMessage.textContent = "Пожалуйста, заполните все поля корректно !";
                    errorMessage.classList.add("error-message");
                    
                    const modalContent = document.querySelector(".massege");
                    modalContent.appendChild(errorMessage);
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        });
    });

const fetchProductDetail = async () => {
    try {
        const response = await fetch(`${MAIN_URL}/product/${productId}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка при загрузке данных: ${response.status} ${response.statusText}`);
        }
        const product = await response.json();
        const files = await fetchFiles();
        renderProductDetail(product, files);
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

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
        return [];
    }
}

function renderProductDetail(product, files) {
    const productName = document.querySelector('.product-name');
    const productPrice = document.querySelector('.product-price');
    const productDescription = document.querySelector('.product-description');
    const productImage = document.querySelector('.product-image');
    const addBtn = document.querySelector('.addBtn');

    productName.textContent = product.name;

    const slider = document.querySelector('.slider'); 

    const mainProductFile = files.find(file => file.product === product.id && file.main_file);
    const additionalProductFiles = files.filter(file => file.product === product.id && !file.main_file);

    if (mainProductFile) {
        productImage.src = mainProductFile.file;
        productImage.alt = product.name;
    }

    if (additionalProductFiles.length > 0) {
        const slide = document.querySelector('.slide');
        slide.classList.add('slide');
        totalImages = additionalProductFiles.length + 1; // Обновляем количество изображений

        additionalProductFiles.forEach(file => {
            const img = document.createElement('img');
            img.src = file.file;
            img.alt = product.name;
            slide.appendChild(img);
        });

        slider.appendChild(slide);
    }

    productPrice.innerHTML = `${product.price} <span class="orange">сом</span>`;
    productDescription.textContent = product.description;
}

(async () => {
    await fetchProductDetail();
})();
