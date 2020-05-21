/**
 * Estado da aplicação (state)
 */
let tabUsers = null;
let tabEstatistics = null;

let allUsers = [];
let filteredUsers = [];

let countUsersMale = [];
let countUsersFemale = [];

let sumUsersAge = 0;
let medUsersAge = 0;
let numberFormat = null;
let inputBusca = null;
let btnBuscar = null;

window.addEventListener('load', function () {
  console.info('Aplicação inicializada.');
  tabUsers = document.querySelector('#list-users');
  tabEstatistics = document.querySelector('#estatisticas');
  inputBusca = document.querySelector('#busca');
  btnBuscar = document.querySelector('#btnBuscar');
  numberFormat = Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

  inputBusca.addEventListener('keyup', handleTyping);
  btnBuscar.addEventListener('click', sendEnter);
  preventSubmit();
  fetchUsers();
});
function sendEnter() {
  const ke = new KeyboardEvent('keyup', {
    bubbles: true,
    cancelable: true,
    charCode: 13,
    code: 'Enter',
    composed: true,
    isTrusted: true,
    key: 'Enter',
    keyCode: 13,
    which: 13,
  });
  inputBusca.dispatchEvent(ke);
}
function handleTyping(event) {
  function filtrar(valor) {
    filteredUsers = allUsers.filter((user) => {
      return user.name.toLowerCase().includes(valor.toLowerCase());
      // return user.name.toLowerCase() === valor.toLowerCase();
    });
  }

  let hasText = !!event.target.value && event.target.value.trim() !== '';

  if (!hasText) {
    clearInput();
    return;
  }

  if (event.key === 'Enter') {
    filtrar(event.target.value);
    render();
  }
}

const clearInput = () => {
  inputBusca.value = '';
  inputBusca.focus();
  // filteredUsers = []; // se ativar as duas linhas, quando em branco, a busca é zerada e renderizada novamente a pagina
  // render();
};

async function fetchUsers() {
  console.log('async fetch...');
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();

  // id, name, population e flag
  allUsers = json.results.map((user) => {
    const { name, gender, dob, picture } = user;
    return {
      name: name.first + ' ' + name.last,
      gender,
      age: dob.age,
      foto: picture.thumbnail,
    };
  });
  render();
}

function render() {
  renderEstatistics();
  renderUserList();
  inputBusca.focus();
}

function renderUserList() {
  console.log('rendering UserList...');
  let usersHTML = '<div class="user-list">';
  if (filteredUsers.length !== 0) {
    usersHTML +=
      '<h2>(' + filteredUsers.length + ') usuário(s) encontrado(s)</h2>';

    filteredUsers.forEach((user) => {
      const { name, gender, age, foto } = user;

      const userHMTL = `
        <div class="user">
          <div>
            <img src="${foto}" alt="${name}" />
          </div>
          <div>
            ${name}, ${age} anos
          </div>
        </div>
      `;
      usersHTML += userHMTL;
    });
  } else {
    usersHTML += '<h2>Nenhum usuário filtrado</h2>';
  }
  usersHTML += '</div>';
  tabUsers.innerHTML = usersHTML;
}

function renderEstatistics() {
  console.log('rendering Estatistics...');
  let statisticsHTML = '<div class="user-list">';

  if (filteredUsers.length !== 0) {
    statisticsHTML += '<h2>Estatísticas</h2>';
    countUsersMale = filteredUsers.filter((user) => user.gender === 'male');
    countUsersFemale = filteredUsers.filter((user) => user.gender === 'female');
    const todosFiltrados = [...countUsersMale, ...countUsersFemale];
    sumUsersAge = todosFiltrados.reduce((acc, cur) => acc + cur.age, 0);
    medUsersAge = formatNumber(sumUsersAge / todosFiltrados.length);

    let sumaryHTML = `
      Sexo masculino: <span class="forte"> ${countUsersMale.length}</span> <br />
      Sexo feminino:  <span class="forte">${countUsersFemale.length}</span> <br />
      Soma das idades: <span class="forte">${sumUsersAge}</span> <br />
      Média das idades:<span class="forte">${medUsersAge}</span> 
    `;
    statisticsHTML += sumaryHTML;
  } else {
    statisticsHTML += '<h2>Nada a ser exibido</h2>';
  }
  statisticsHTML += '</div><br />';
  tabEstatistics.innerHTML = statisticsHTML;
}

function formatNumber(number) {
  return numberFormat.format(number);
}
function preventSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }
  let form = document.querySelector('form');
  form.addEventListener('submit', handleFormSubmit);
}
