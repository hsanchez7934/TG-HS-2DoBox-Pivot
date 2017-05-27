
var filteredIdeas = [];
var ideaList = getFromLocalStorage() || [];
var indexOfOriginalObject;
loadIdeasFromStorage();

$('.article-container').on('click', '#delete-btn', removeIdea);
$('.article-container').on('click', '#downvote-btn', changeDownvoteQuality);
$('.article-container').on('click', '#upvote-btn', changeUpvoteQuality);
$('.article-container').on('focusout', '.description', replaceEditedDescription);
$('.article-container').on('focusout', 'h2', replaceEditedTitle);
$('#search-input').on('input', filterIdeas);
$('#submit-btn').on('click', submitNewIdea)
                .on('click', toggleSaveDisable);
$('#body-input').on('input', toggleSaveDisable);


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

function submitNewIdea(e) {
  e.preventDefault();
  var titleInput = $('#title-input').val();
  var bodyInput = $('#body-input').val();
  var newTask = new taskObject(titleInput, bodyInput);
  prependNewTask(newTask);
  saveLocalStorage(newTask);
  clearInputs();
}

$('#body-input').on('keydown', function(e) {
  if(e.keyCode === 13) {
    e.preventDefault();
  }
});


$('#title-input').on('input', function() {
  toggleSaveDisable();
});

$(window).on('keyup', function(e) {
  if(e.keyCode === 13 && ($('#title-input').val() !== '') && ($('#body-input').val() !== '')){
    toggleSaveDisable();
    $('#submit-btn').trigger('click');
  }
});

$(window).on('load', function() {
  $('#title-input').focus();
});

function changeDownvoteQuality(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  localStorage.clear();
  switchDownvote(editedObject);
  ideaList.splice(indexOfOriginalObject, 1, editedObject);
  setInLocalStorage();
  filterIdeas();
}

function changeUpvoteQuality(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  localStorage.clear();
  switchUpvote(editedObject);
  ideaList.splice(indexOfOriginalObject, 1, editedObject);
  setInLocalStorage();
  filterIdeas();
}

function clearInputs() {
  $('#title-input, #body-input').val('');
  $('#title-input').focus();
}

function displayFilteredList() {
  $('.article-container').children().remove();
  filteredIdeas.forEach(function(idea) {
    prependExistingIdeas(idea);
  });
}

function findIndexIdeaList(id) {
  var list = getFromLocalStorage();
  var mapIdea = list.map(function(idea) {
    return idea.id;
  })
  var specificID = mapIdea.filter(function(number) {
    if (parseInt(id) === number) {
      return number;
    }
  })
  var idAsNumber = specificID[0];
  var foundObject;
  list.forEach(function(object, index) {
    if (parseInt(object.id) === idAsNumber) {
      foundObject = object;
      indexOfOriginalObject = index;
      return object;
    }
  })
  return foundObject;
}

function filterIdeas() {
  var searchInput = $('#search-input').val().toUpperCase();
  ideaList = getFromLocalStorage() || [];
  if(searchInput === '') {
    filteredIdeas = [];
    displayFilteredList();
    loadIdeasFromStorage();
  } else {
      filteredIdeas = ideaList.filter(function(ideaObject) {
      return ((ideaObject.title.toUpperCase().indexOf(searchInput) > -1) || (ideaObject.body.toUpperCase().indexOf(searchInput) > -1) || (ideaObject.quality.toUpperCase().indexOf(searchInput) > -1))
    })
    displayFilteredList();
  }
}

function getFromLocalStorage() {
  var parseIdeaList = JSON.parse(localStorage.getItem('ideas'));
  return parseIdeaList;
}


function loadIdeasFromStorage() {
  if (localStorage.getItem('ideas')) {
    ideaList = getFromLocalStorage();
    ideaList.forEach(function(idea) {
      prependExistingIdeas(idea);
    });
  } else {
  }
}


function removeIdea(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  ideaList.splice(indexOfOriginalObject, 1);
  localStorage.clear();
  setInLocalStorage();
  $(this).parents('article').remove();
}

function replaceEditedDescription(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  editedObject.body = $(this).text();
  replaceIdeaInLocalStorage(editedObject);
}

function replaceEditedTitle(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  editedObject.title = $(this).text();
  replaceIdeaInLocalStorage(editedObject);
}

function replaceIdeaInLocalStorage(editedObject) {
  localStorage.clear();
  ideaList.splice(indexOfOriginalObject, 1, editedObject);
  setInLocalStorage();
  filterIdeas();
}

function saveLocalStorage(task) {
  localStorage.setItem(task.id, JSON.stringify(task));
}


function switchDownvote(editedObject) {
  switch (editedObject.quality) {
    case 'genius':
      editedObject.quality = 'plausible'
      $(this).parent().find('.quality-level').text('plausible')
      break;
    case 'plausible':
      editedObject.quality = 'swill'
      $(this).parent().find('.quality-level').text('swill')
      break;
    default:
      break;
  }
}

function switchUpvote(editedObject) {
  switch (editedObject.quality) {
    case 'swill':
      editedObject.quality = 'plausible'
      $(this).parent().find('.quality-level').text('plausible')
      break;
    case 'plausible':
      editedObject.quality = 'genius'
      $(this).parent().find('.quality-level').text('genius')
      break;
    default:
      break;
  }
}

function toggleSaveDisable() {
  if ($('#title-input').val() === '' || $('#body-input').val() === '') {
    $('#submit-btn').prop('disabled', true);
  } else {
    $('#submit-btn').prop('disabled', false);
  }
}
