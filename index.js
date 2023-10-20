const global = {
    currentPage: window.location.pathname,
    form: document.getElementById('form'),
    product: document.getElementById('product'),
    amount: document.getElementById('amount'),
    submit: document.getElementById('submit'),
    content: document.getElementById('content'),
    priceBox: document.getElementById('priceBox'),
    resetStorage: document.getElementById('resetLocalStorage'),
    viewTotal: document.getElementById('viewTotal'),
    viewByProduct: document.getElementById('viewByProduct'),
    search: ''
}

const onSubmit = (e) => {
    e.preventDefault();
    
    const product = global.product.value.toLowerCase();
    const amount = global.amount.value;
    const date = new Date().toDateString();

    // Check fields are not ''
    if (product === '' || amount === '') {
        alert('You fill out all required fields');
        return;
    }

    // Maybe create Obj here to pass in
    const entry = {
        product: product,
        amount: amount,
        date: date
    }

    // Add items to storage
    addItemToStorage(entry, product);

    // render the content
    render();

    // Clear form value
    form.reset();
}

const addItemToStorage = (entry) => {
    const addItemsToStorage = getFromStorage();

    // Add new item to array
    addItemsToStorage.push(entry);

    // Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(addItemsToStorage));
}

const getFromStorage = () => {
    let itemsFromStorage;
  
    if (localStorage.getItem('items') === null) {
      itemsFromStorage = [];
    } else {
      itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
  
    return itemsFromStorage;
}

const displayProductByItemNameForm = () => {
    global.content.innerHTML = '';
    global.priceBox.innerHTML = '';

    const div = document.createElement('div');
    div.innerHTML = `
        <form class="searchForm">
            <label for="product">Enter Product:</label>
            <input type="text" id="productSearch" />

            <button type="submit" id="search">Search</button>
        </form>
    `;

    global.content.appendChild(div);

    document.getElementById('search').addEventListener('click', formByProduct);
}

const formByProduct = (e) => {
    e.preventDefault();
    
    global.search = document.getElementById('productSearch').value.toLowerCase();

    console.log(global.search);
    // getProductByNameAndCalcTotalValue(global.search);
    getProductByItemName(global.search);
}

const getProductByItemName = () => {

    const getAllProducts = getFromStorage();

    const getProduct = getAllProducts.filter((items) => items.product == global.search);

    displayProductByItemName(getProduct);
}

const displayProductByItemName = (search) => {
    global.content.innerHTML = '';

    const amount = getProductByNameAndCalcTotalValue();
    const getProduct = search;

    // console.log(typeof getProduct);
    if (Object.keys(getProduct).length === 0) {
        alert(`You have no products by the name of ${global.search}`);
      }

    const h1 = document.createElement('h1');
    h1.classList.add('h1-products');
    h1.innerHTML = `Below show your expenditure on <span style="color: green;">${getProduct[0].product}</span>`;
    global.content.appendChild(h1);

    getProduct.forEach((item) => {
        const div = document.createElement('div');
        div.classList.add('displayByItem');
        div.innerHTML = `
            <li>Product: ${item.product} Amount: £${item.amount} date: ${item.date}</li>
        `;

        global.content.appendChild(div);
    });

    const priceBox = document.createElement('div');
    priceBox.classList.add('priceBox');
    priceBox.innerHTML = `The total you spent this month is <span style="color: red; font-size:1.2em;">£${amount}.00</span>`; 
    global.priceBox.appendChild(priceBox);

    
}

const getProductAndCalc = () => {
    const productTotal = getFromStorage();

    // Getting the price of all products and use parseInt to turn amount to an intaget so without '',''
    const getPrice = Object.values(productTotal).map((price) => {
        return parseInt([price.amount]);
    });

    // Using reduce to add all the values of get price together
    const tot = getPrice.reduce((accumilator, current) => {
        return accumilator + current;
    }, 0);

    return tot;
}

const getProductByNameAndCalcTotalValue = () => {
    const productTotal = getFromStorage();

    const getTotal = productTotal.filter((product) => product.product === global.search);

    // Getting the price of all products and use parseInt to turn amount to an intaget so without '',''
    const getPrice = Object.values(getTotal).map((price) => {
        return parseInt([price.amount]);
    });

    // Using reduce to add all the values of get price together
    const tot = getPrice.reduce((accumilator, current) => {
        return accumilator + current;
    }, 0);

    return tot;
}

const getProductsByDate = () => {
    const products = getFromStorage();

    inputDate = 'Fri Oct 20 2023';

    const result = products.filter((product) => product.date === inputDate);

    console.log(result);
}

const viewTotal = () => {
    global.content.innerHTML = '';
    global.priceBox.innerHTML = '';

    const getProduct = getFromStorage();
    const getPrAndCalc = getProductAndCalc();

    const h1 = document.createElement('h1');
    h1.classList.add('h1-products');
    h1.innerHTML = `Below is list of all your expenditures`;
    global.content.appendChild(h1);

    getProduct.forEach((item) => {
        const div = document.createElement('div');
        div.classList.add('products');
        div.innerHTML = `
            <ul>
                <li>${item.product}: £${item.amount} on <span style="font-size: 1em;color: grey;">${item.date}</span></li>
            </ul>
        `;

        global.content.appendChild(div);
    });

    const priceBox = document.createElement('div');
    priceBox.classList.add('priceBox');
    priceBox.innerHTML = `The total you spent this month is <span style="color: red; font-size:1.2em;">£${getPrAndCalc}.00</span>`; 
    global.priceBox.appendChild(priceBox);
}

const render = () => {
    if (global.viewTotal) {
        viewTotal();
    }  else if (global.viewByProduct) {
        displayProductByItemName();
    }
}

const resetStorage = () => {
    localStorage.removeItem('items');
    alert('Your local storage has been reset');
    global.content.innerHTML = '';
    global.priceBox.innerHTML = '';
}

const eventListeners = () => {
    global.submit.addEventListener('click', onSubmit);
    global.resetStorage.addEventListener('click', resetStorage);
    global.viewTotal.addEventListener('click', viewTotal);
    global.viewByProduct.addEventListener('click', displayProductByItemNameForm);
}

const init = () => {
    eventListeners();

    getProductsByDate();
}

init();

