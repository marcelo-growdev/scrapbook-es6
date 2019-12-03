class App {
    constructor(){
        this.buttonCreate = document.getElementById("btn_create");
        this.title = document.getElementById("input_title");
        this.content = document.getElementById("input_content");

        this.registerEvents();
    }

    registerEvents() {
        this.buttonCreate.onclick = (event) => this.createCard(event);
    }

    createCard(event) {
        event.preventDefault();

        if(this.title.value && this.content.value) {
            const html = this.cardLayout(this.title.value, this.content.value);

            this.insertHtml(html);

            this.clearForm();

            document.querySelectorAll('.delete-card').forEach(item => {
                item.onclick = event => this.deleteCard(event);
            });

        } else {
            alert("Preencha os campos!");
        }
    }

    cardLayout(title, content) {
        const html = `
            <div class="col mt-5">
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

    deleteCard = (event) => event.path[3].remove();

}

new App();