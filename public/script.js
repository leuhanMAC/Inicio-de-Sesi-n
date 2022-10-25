const socket = io();

const isCorrectUrl = (url) => {
    const patternURL = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|webp)/;
    return patternURL.test(url)
}

const isCorrectPrice = (price) => {
    const patternPrice = /^(?=.*[1-9])[0-9]*[.]?[0-9]{1,2}$/;
    return patternPrice.test(price)

}

const addProduct = (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const price = e.target.price.value;
    const thumbnail = e.target.thumbnail.value;


    if (!isCorrectUrl(thumbnail)) {
        const urlElement = document.querySelector('.form-thumbnail');

        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger alert-thumbnail';
        errorMsg.textContent = 'La URL no está en un formato válido (Debe empezar con el protocolo HTTP y terminar en jpg/gif/png/jpeg/webp)';
        urlElement.prepend(errorMsg);
        return;
    }

    document.querySelector('.alert-thumbnail')?.remove();

    if (!isCorrectPrice(price)) {
        const priceElement = document.querySelector('.form-price');

        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger alert-price';
        errorMsg.textContent = 'El precio no está en un formato válido (Debe ser un número con máximo dos decimales)';
        priceElement.prepend(errorMsg);
        return;
    }

    document.querySelector('.alert-price')?.remove();

    socket.emit("add-product-server", {
        title,
        price,
        thumbnail
    });
}

socket.on("add-product-client", ({ title, price, thumbnail }) => {
    const tbody = document.querySelector('tbody');
    const tr = document.createElement('tr');

    const tdTitle = document.createElement('td');
    tdTitle.textContent = title;

    const tdPrice = document.createElement('td');
    tdPrice.textContent = price;

    const tdThumbnail = document.createElement('td');
    const imgThumbnail = document.createElement('img');
    imgThumbnail.setAttribute('src', thumbnail);
    imgThumbnail.setAttribute('width', "200");

    tdThumbnail.appendChild(imgThumbnail);

    tr.appendChild(tdTitle);
    tr.appendChild(tdPrice);
    tr.appendChild(tdThumbnail);

    tbody.appendChild(tr);

});

const sendMessage = () => {
    const email = document.querySelector('.email-input').value;
    const message = document.querySelector('.message-input').value;

    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email || !emailPattern.test(email)) {
        const emailContainer = document.querySelector('.email-container');

        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger alert-email col-md-12';
        errorMsg.textContent = 'El email está vacío o no tiene un formato válido';
        emailContainer.prepend(errorMsg);
        return;
    }

    document.querySelector('.alert-email')?.remove();

    if (!message.trim()) {
        const messageContainer = document.querySelector('.message-container');

        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger col-md-12 alert-message';
        errorMsg.textContent = 'No puedes enviar un mensaje vacío ';
        messageContainer.appendChild(errorMsg);
        return;
    }

    document.querySelector('.alert-message')?.remove();

    const dateRaw = new Date();
    const date = `(${dateRaw.toLocaleDateString('ES')} ${dateRaw.toLocaleTimeString('ES')})`;

    socket.emit("add-message-server", {
        email,
        message,
        date
    });

    document.querySelector('.message-input').value = "";
}

socket.on("add-message-client", ({ email, message, date }) => {
    const chat = document.querySelector(".chat");
    const p = document.createElement("p");

    const spanEmail = document.createElement("span");
    spanEmail.classList = "email";
    spanEmail.textContent = email;

    const spanDate = document.createElement("span");
    spanDate.classList = "date";
    spanDate.textContent = date;

    const spanMessage = document.createElement("span");
    spanMessage.classList = "message";
    spanMessage.textContent = message;

    p.appendChild(spanEmail);
    p.appendChild(document.createTextNode(" "));
    p.appendChild(spanDate);
    p.appendChild(document.createTextNode(": "));
    p.appendChild(spanMessage);

    chat.appendChild(p);

    chat.scrollTop = chat.scrollHeight;

});