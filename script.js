$(document).ready(retrieveStorage);
$(window).on('keydown', enterKey);
$('.article-container').on('click', '#delete-btn', removeTask)
                       .on('click', '#downvote-btn', downvoteBtn)
                       .on('click', '#upvote-btn', upvoteBtn);
$('.article-container').on('focusout', '.description', replaceEditedDescription)
                       .on('focusout', 'h2', replaceEditedTitle);
$('#search-input').on('input', filterTasks);
$('#submit-btn').on('click', submitNewTask)
                .on('click', clearInputs);
$('#body-input, #title-input').on('input', toggleSaveDisable);
$('.article-container').on('keydown', 'h2', saveTitleOnEnter)
                       .on('keydown', '.description', saveBodyOnEnter);

/*---------------------------------------
>>>>>>>>  FUNCTIONS WE'VE REFACTORED <<<<<<<<
----------------------------------------*/
function taskObject(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.index = 2;
  this.qualities = ['None', 'Low', 'Normal', 'High', 'Critical'];
  this.quality = this.qualities[this.index];
}

function prependNewTask(newTask) {
  $('.article-container').prepend(`
    <article id='${newTask.id}'>
    <div class="description-container">
    <h2 contentEditable>${newTask.title}</h2>
    <button class="icons" id="delete-btn"></button>
    <p class="description" contentEditable>${newTask.body}</p>
    </div>
    <div class="voting-container">
    <button class="icons" id="upvote-btn"></button>
    <button class="icons" id="downvote-btn"></button>
    <p class="quality">quality: <span class="quality-level">${newTask.quality}</span></p>
    </div>
    </article>`);
  }

function submitNewTask() {
  event.preventDefault();
  var titleInput = $('#title-input').val();
  var bodyInput = $('#body-input').val();
  var newTask = new taskObject(titleInput, bodyInput);
  toggleSaveDisable();
  prependNewTask(newTask);
  saveStorage(newTask);
}

function clearInputs() {
  $('#title-input, #body-input').val('');
  $('#title-input').focus();
}

function toggleSaveDisable() {
  if ($('#title-input').val() === '' || $('#body-input').val() === '') {
    $('#submit-btn').prop('disabled', true);
  } else {
    $('#submit-btn').prop('disabled', false);
  }
}

function retrieveStorage() {
  for (var i = 0; i < localStorage.length; i++) {
    prependNewTask(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
}

function saveStorage(task) {
  localStorage.setItem(task.id, JSON.stringify(task));
}

function updateStorage(id, newVal) {
  localStorage.setItem(id, JSON.stringify(newVal));
}

function getFromLocalStorage(id) {
  var parsedObject = JSON.parse(localStorage.getItem(id));
  return [parsedObject, parsedObject.qualities, parsedObject.index, parsedObject.quality];
}

function removeStorage(id) {
  localStorage.removeItem(id);
}

function removeTask () {
  var taskID = $(this).closest('article').attr('id');
  removeStorage(taskID);
  $(this).closest('article').remove();
}

function upvoteBtn() {
  var taskID = $(this).closest('article').attr('id');
  var task = getFromLocalStorage(taskID);
  if (task[2] === task[1].length - 1) {return;}
  task[2]++;
  task[0].quality= task[1][task[2]];
  task[0].index = task[2];
  updateStorage(taskID, task[0]);
  $(this).siblings('.quality').text("quality: " + task[1][task[2]]);
}

function downvoteBtn() {
  var taskID = $(this).closest('article').attr('id');
  var task = getFromLocalStorage(taskID);
  if (task[2]=== 0) {return;}
  task[2]--;
  task[0].quality= task[1][task[2]];
  task[0].index= task[2];
  updateStorage(taskID, task[0]);
  $(this).siblings('.quality').text("quality: " + task[1][task[2]]);
}

function filterTasks() {
    var userInput = $(this).val().toLowerCase();
    $('article').each(function() {
      var taskText = $(this).text().toLowerCase();
      if (taskText.indexOf(userInput)!== -1 ) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

function replaceEditedDescription() {
  var taskID = $(this).closest('article').attr('id');
  var editedObject = getFromLocalStorage(taskID);
  editedObject[0].body = $(this).text();
  updateStorage(taskID, editedObject[0]);
}

function replaceEditedTitle() {
  var taskID = $(this).closest('article').attr('id');
  var editedObject = getFromLocalStorage(taskID);
  editedObject[0].title = $(this).text();
  updateStorage(taskID, editedObject[0]);

}

function enterKey(e) {
  if(e.keyCode === 13 && ($('#title-input').val() !== '') && ($('#body-input').val() !== '')){
    $('#submit-btn').trigger('click');
  }
}

function saveTitleOnEnter () {
  var taskID = $(this).closest('article').attr('id');
  var editedObject = getFromLocalStorage(taskID);
  if(event.keyCode === 13) {
    event.preventDefault();
    editedObject[0].title = $(this).text();
    updateStorage(taskID, editedObject[0]);
    $('h2').blur()
  }
}

function saveBodyOnEnter () {
  var taskID = $(this).closest('article').attr('id');
  var editedObject = getFromLocalStorage(taskID);
  if(event.keyCode === 13) {
    event.preventDefault();
    editedObject[0].body = $(this).text();
    updateStorage(taskID, editedObject[0]);
    $('.description').blur()
  }
}
