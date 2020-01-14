import axios from "axios";

class App {
    constructor() {
        this.buttonLogin = document.getElementById("btn_login");
        this.buttonCreate = document.getElementById("btn_create");
        this.buttonEdit = document.getElementById("btn_edit");

        this.title = document.getElementById("input_title");
        this.content = document.getElementById("input_content");

        this.cardEditing = null;

        this.url = process.env.API_URL;

        this.getCards();
        this.registerEvents();
    }

    registerEvents() {
        this.buttonLogin.onclick = (event) => this.login(event);
        this.buttonCreate.onclick = (event) => this.createCard(event);
        this.buttonEdit.onclick = (event) => this.editCard(event);
    }

    async login() {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const response = await axios.post(`${this.url}/login`, {
          email: email,
          password: password
        });
        
        if(response.data.token) {
          sessionStorage.setItem('token', response.data.token);

          alert('Login Efetuado com sucesso');
          $("#loginModal").modal('hide');
          this.getCards()
        }  else {
          alert("Login inválido!");
        }
      } catch (error) {
        console.log(error);
        alert("Login inválido!");
        $("#loginModal").modal('show');
      }
    }

    getConfigHeader() {
      return {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    }

    async getCards() {
      try {
        const response = await axios.get(`${this.url}/cards`, this.getConfigHeader());
        if(response.data) {
          this.recoveryCards(response.data);
        } 
      } catch (error) {
        console.log(error);
        $("#loginModal").modal('show');
      }
    }

    recoveryCards(data) {
        data.forEach(item => {
            const html = this.cardLayout(item.id, item.title, item.content);
            this.insertHtml(html);
        });

        this.registerButtons();
    }

    registerButtons() {
        document.querySelectorAll('.delete-card').forEach(item => {
            item.onclick = event => this.deleteCard(event);
        });

        document.querySelectorAll('.edit-card').forEach(item => {
            item.onclick = event => this.openEditCard(event);
        });
    }

    createCard(event) {
        event.preventDefault();

        if(this.title.value && this.content.value) {
            this.sendToServer();
        } else {
            alert("Preencha os campos!");
        }
    }

    async sendToServer() {
      try {
        const response = await axios.post(`${this.url}/cards`, {
                  title: this.title.value,
                  content: this.content.value
              }, this.getConfigHeader());

        if(response.data) {
          const {id, title, content} = response.data;
          let html = this.cardLayout(id, title, content);
    
          this.insertHtml(html);
    
          this.clearForm();
    
          this.registerButtons();
        } else {
          alert("Ops! Tente novamente mais tarde.");
        }
      } catch (error) {
        alert("Ops! Tente novamente mais tarde.");
      }
    }

    cardLayout(id, title, content) {
      const html = `
          <div class="col mt-5" scrap="${id}">
              <div class="card">
                  <div class="card-body">
                  <h5 class="card-title">${title}</h5>
                  <p class="card-text">${content}</p>
                  <button type="button" class="btn btn-primary edit-card" data-toggle="modal" data-target="#editModal">
                      Editar
                  </button>
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
      
      axios.delete(`${this.url}/cards/${id}`, this.getConfigHeader())
          .then(function (response) {
              event.path[3].remove();
          })
          .catch(function (error) {
              console.log(error);
          })
          .finally(function () {
          });
    };

    openEditCard = (event) => {
        const id = event.path[3].getAttribute('scrap');
        const title = event.path[1].children[0].innerHTML;
        const content = event.path[1].children[1].innerHTML;
        
        document.getElementById("edit-title").value = title;
        document.getElementById("edit-content").value = content;
        document.getElementById("edit-id").value = id;

        this.cardEditing = event.path[1];
        this.cardEditing.editId = id;
    };

    editCard = (event) => {
        const id = this.cardEditing.editId;
        const title = document.getElementById("edit-title").value;
        const content = document.getElementById("edit-content").value

        axios.put(`${this.url}/cards/${id}`, {
            title: title,
            content: content
        }, this.getConfigHeader())
        .then( (response) => {
            this.cardEditing.children[0].innerHTML = title;
            this.cardEditing.children[1].innerHTML = content;
        })
        .catch(function (error) {
            console.log(error);
            alert("Ops! Tente novamente mais tarde.");
        })
        .finally(function () {
        }); 
    }
}

new App();