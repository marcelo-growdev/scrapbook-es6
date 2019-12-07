const axios = require("axios");

class App {
    constructor() {
        this.buttonCreate = document.getElementById("btn_create");
        this.title = document.getElementById("input_title");
        this.content = document.getElementById("input_content");

        this.getScraps(this);
        this.registerEvents();
    }

    registerEvents() {
        this.buttonCreate.onclick = (event) => this.createCard(event);
    }

    getScraps(app) {
        axios.get('http://localhost:3333/scraps')
            .then(function (response) {
                app.recoveryScraps(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
            });
    }

    recoveryScraps(data) {
        for(item of data) {
            const html = this.cardLayout(item.id, item.title, item.content);

            this.insertHtml(html);

            document.querySelectorAll('.delete-card').forEach(item => {
                item.onclick = event => this.deleteCard(event);
            });
        }
    }

    createCard(event) {
        event.preventDefault();

        if(this.title.value && this.content.value) {
            this.sendToServer(this);
        } else {
            alert("Preencha os campos!");
        }
    }

    sendToServer(app) {
        axios.post(`http://localhost:3333/scraps`, {
                title: this.title.value,
                content: this.content.value
            })
            .then(function (response) {
                const {id, title, content} = response.data;
                let html = app.cardLayout(id, title, content);

                app.insertHtml(html);

                app.clearForm();

                document.querySelectorAll('.delete-card').forEach(item => {
                    item.onclick = event => app.deleteCard(event);
                });

            })
            .catch(function (error) {
                console.log(error);
                alert("Ops! Tente novamente mais tarde.");
            })
            .finally(function () {
            });
    }

    cardLayout(id, title, content) {
        const html = `
            <div class="col mt-5" scrap="${id}">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${content}</p>
                    <button type="button" class="btn btn-danger delete-card">Excluir</button>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    insertHtml(html) {
        document.getElementById("row_cards").innerHTML += html;
    }

    clearForm() {
        this.title.value = "";
        this.content.value = "";
    }

    deleteCard = (event) => {
        const id = event.path[3].getAttribute('scrap');
        
        axios.delete(`http://localhost:3333/scraps/${id}`)
            .then(function (response) {
                event.path[3].remove();
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
            });
    };

}

new App();