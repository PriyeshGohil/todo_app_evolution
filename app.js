 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCqwkCYQRUrpgS-jHKUQpnW4h2d4QaeIJA",
    authDomain: "todo-app-evolution.firebaseapp.com",
    databaseURL: "https://todo-app-evolution.firebaseio.com",
    projectId: "todo-app-evolution",
    storageBucket: "todo-app-evolution.appspot.com",
    messagingSenderId: "93834775394"
  };

  firebase.initializeApp(config);

const todoApp = function() {

  const database = firebase.database();
  const dbRef = database.ref('todos');

  function addItem(nme) {
    const todoObj = createTodoObj(nme);
    saveToDatabase(todoObj);
  };


  function getItem(todoId) {
    return JSON.parse(localStorage.getItem(todoId));
  }

  function getAllItems() {
    const allItems = [];

    Object.keys(localStorage).forEach(function(key, index) {
      allItems.push(getItem(key));
    })

    return allItems;
  }

  function removeItem(todoId) {
    localStorage.removeItem(todoId);
  };


  function editItem(todoId, nme) {
    const todoObj = getItem(todoId);
    todoObj.name = nme;
    saveToDatabase(todoObj);
  }


  function saveToDatabase(todoObj) {
    dbRef.child(todoObj.id).set(todoObj);
    localStorage.setItem(todoObj.id, JSON.stringify(todoObj));
  }

  function createTodoObj(nme) {
    const obj = {};
    const date = new Date();
    const todoId = date.getDate() + date.getTime();

    obj.id = todoId;
    obj.name = nme;
    obj.completed = false;

    return obj;
  }

  return {
    addItem,
    getItem,
    getAllItems,
    removeItem,
    editItem
  }

};


const todoUI = (function() {

  const todos = todoApp();
  const formElements = document.querySelector('#form').elements;
  const todoWrapperEl = document.querySelector('#todo-wrapper');

  function displayAll() {
    const allTodoObjs = todos.getAllItems();

    // remove any todos
    todoWrapperEl.innerHTML = '';

    allTodoObjs.forEach(function(obj, index) {
      renderHTML(obj.id, obj.name);
    });
  }

  function addTodoHandler() {
    const submitBtn = formElements['todo-sumbit-btn'];

    submitBtn.addEventListener('click', function() {
      let inputValue = formElements['todo-title'].value;

      if(inputValue.length >  0) {
        todos.addItem(inputValue);
        displayAll();
      }
    });
  }

  function removeTodo(deleteTodoEl) {
    // warning! this will break if todo html structure is changed;
    const liParent =  deleteTodoEl.parentNode.parentNode;
    const confirmAction = confirm('do you really want to remove this item?');

    if(confirmAction) {
       todos.removeItem(liParent.getAttribute('id'));
       displayAll();
    }
  }

  function editTodo(editTodoEl) {
    const liParent = editTodoEl.parentNode.parentNode;
    const editValue = window.prompt('enter new todo title:', liParent.querySelector('.todo__title').innerText);

    if(editValue !== null && editValue !== '') {
      todos.editItem(liParent.getAttribute('id'), editValue);
      displayAll();
    }
  }

  function renderHTML(id, title) {
    const li = document.createElement('LI');
    const h3 = document.createElement('H3');
    const div = document.createElement('DIV');
    const iEdit = document.createElement('I');
    const iDelete = document.createElement('I');

    li.classList.add('todo');
    h3.classList.add('todo__title');
    div.classList.add('todo__icons');
    iEdit.classList.add('fa','fa-pencil', 'editTodo');
    iDelete.classList.add('fa','fa-times', 'deleteTodo');

    // data attribute
    li.setAttribute('id', id);

    h3.innerHTML = title;

    li.append(h3,div);
    div.append(iEdit, iDelete);

    todoWrapperEl.append(li);
  }

  function events() {
    todoWrapperEl.addEventListener('click', function(e) {

      if(e.target.nodeName !== 'I') return;


      if(e.target.matches("I.deleteTodo")) {
        removeTodo(e.target);
      }

      if(e.target.matches("I.editTodo")) {
        editTodo(e.target);
      }

    })
  }

  function setup() {
    displayAll();
    addTodoHandler();
    events();
  }

  return {
    setup
  }

})();


todoUI.setup();


//                                    issues:

/**
  displayAll() gets called each time a crud action is performed :O
  which removes all todo Items (el.innerHTML === '') then added the updated lists again
 current its fine because we are only displaying minimal data but will fix in the future.
**/
