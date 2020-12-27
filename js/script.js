function login(){
    email = document.querySelector('#email').value;
    password = document.querySelector('#password').value;
    text_button = document.querySelector('.login-text');
    loading_button = document.querySelector('.loading-button');
    text_button.style.display = 'none';
    loading_button.style.display = 'block';
    axios.post('https://reqres.in/api/login', {
        email: email,
        password: password
    },
    {
        "headers": {"Content-Type": "application/json"}
    })
    .then(function (response) {
        sessionStorage.setItem('login', response.data.token);
        window.location.href = "lista-usuarios.html";
    })
    .catch(error => {
        console.log(error);
        text_button.style.display = 'block';
        loading_button.style.display = 'none';
    });
}

function validateAuthenticated(){
    if(sessionStorage.getItem('login') != null){
        window.location.href = "lista-usuarios.html";
    }
}

function validateUnauthenticated(){
    if(sessionStorage.getItem('login') == null){
        window.location.href = "index.html";
    }
}

function getUsers(page = 1){
    window.scrollTo(0, 0);
    let list_user = document.querySelector(".list-user");
    let grid_user = document.querySelector("#grid-user");
    let number_pages = document.querySelector("#number-pages");
    let pagination = document.querySelector("#pagination");
    let loading_page = document.querySelector('.loading-page');

    grid_user.innerHTML = "";
    number_pages.innerHTML = "";
    pagination.innerHTML = "";
    
    list_user.style.display = 'none';
    loading_page.style.display = 'flex'
    setTimeout(function(){
        axios.get('https://reqres.in/api/users?page=' + page)
        .then(response => {
            let data = response.data
            let user_data = data.data;
            user_data.forEach(user => {
                let card = `<div class='card-user'>
                        <div class='card-body'>
                            <div class='row'>
                                <div class='card-edit'>
                                    <a href='#'>
                                        <img src="../assets/icon-edit.svg" alt="edit">
                                    </a>
                                </div>
                            </div>
                            <div class='row avatar'>
                                    <img src='${user.avatar}'>
                            </div>
                            <div class='row username'>
                                <span class='primary-title-font'>${user.first_name} ${user.last_name}</span>
                            </div>
                            <div class='row email'>
                                <span class='content-gray-font dark-font'>${user.email}</span>
                            </div>
                        </div>
                    </div>`;
                let div_element = document.createElement('div');
                div_element.innerHTML = card;
                grid_user.appendChild(div_element.firstChild);
            });
            
            let page = data.page;
            let total_pages = data.total_pages;
            let qty_users = data.data.length;
            let total_users = data.total;
            number_pages.innerHTML = `
                <span class='content-gray-font dark-font'>Mostrando ${qty_users * page} de ${total_users}`;
    
            for (let index = 1; index <= total_pages; index++) {
                let number_pagination = 
                    `<div class="pagination-number ${page == index ? 'active' : '' }"
                            ${page != index ? 'onclick="getUsers(' + index + ')"' : '' }>
                        <span>${index}</span>
                    </div>`;
                let pag_element = document.createElement('div');
                pag_element.innerHTML = number_pagination;
                pagination.appendChild(pag_element.firstChild);
            }
        })
        .catch(error => {
            console.log(error)
        });
        list_user.style.display = 'block';
        loading_page.style.display = 'none';
    }, 1000);
}

function logout(){
    if(sessionStorage.getItem('login') != null){
        sessionStorage.removeItem('login');
        window.location.href = "index.html";
    }
}