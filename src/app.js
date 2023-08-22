const closeAddTask = document.getElementById('close-add-a-task-btn');
const saveTask = document.getElementById('save-task');
const body = document.querySelector('body');

body.style.backgroundImage = `url('../img/backdrop${randomNumberGenerator(
  2,
)}.jpg')`;

let flag = 1;
let taskNumber;

if (localStorage.getItem('0') === null) {
  taskNumber = 0;
} else {
  taskNumber = localStorage.getItem('0');
  const localStorageArray = Object.entries(localStorage);
  localStorageArray.forEach(([key, value]) => {
    if (key !== '0') {
      const taskObj = JSON.parse(value);
      createTask(taskObj.taskName, taskObj.taskDeadline, key);
    }
  });
}

function randomNumberGenerator(max) {
  return Math.floor(Math.random() * max + 1);
}

function getTime(h, m) {
  let timeSuffix = 'am';

  if (h > 12) {
    h -= 12;
    timeSuffix = 'pm';
  } else if (h === 0) {
    h = 12;
  }

  return `${h}:${m}${timeSuffix}`;
}

function getMonthName(month) {
  const date = new Date(null, month - 1);

  return date.toLocaleString('default', { month: 'long' });
}

function createDeadlineString(taskDeadline) {
  let daySuffix = 'th';
  let arr = taskDeadline.split('T');
  let ymd = arr[0].split('-');
  let hm = arr[1].split(':');
  let day = parseInt(ymd[2]);
  let month = parseInt(ymd[1]);
  month = getMonthName(month);

  if (day === 1) {
    daySuffix = 'st';
  } else if (day === 2) {
    daySuffix = 'nd';
  } else if (day === 3) {
    daySuffix = 'rd';
  }

  return `${month} ${day}${daySuffix} at ` + getTime(parseInt(hm[0]), hm[1]);
}

function createTask(taskName, taskDeadline, taskNumb) {
  const main = document.querySelector('.main');
  const noTaskMsg = main.querySelector('#no-task-msg');

  if (noTaskMsg) {
    main.removeChild(noTaskMsg);
  }

  const div = document.createElement('div');
  div.classList.add('task');
  div.setAttribute('data-id', taskNumb);

  const taskDescription = document.createElement('h5');
  taskDescription.textContent = taskName;

  const closeButton = document.createElement('i');
  closeButton.classList.add('fa-solid', 'fa-xmark', 'delete-task-btn');
  closeButton.addEventListener('click', () => {
    localStorage.removeItem(closeButton.parentElement.getAttribute('data-id'));
    closeButton.parentElement.remove();
    if (main.childElementCount === 0) {
      const noTaskMsg = document.createElement('p');
      noTaskMsg.setAttribute('id', 'no-task-msg');
      noTaskMsg.textContent = 'Add a task to show here';
      main.append(noTaskMsg);
    }
  });

  const taskDeadlineTime = document.createElement('p');
  taskDeadlineTime.textContent = createDeadlineString(taskDeadline);

  div.append(taskDescription, closeButton, taskDeadlineTime);
  main.appendChild(div);
}

function validateField(taskName, taskDeadline) {
  //   add to validate the form fields
}

closeAddTask.addEventListener('click', () => {
  const taskSet = document.querySelector('.task-set');

  if (flag === 1) {
    taskSet.style.display = 'none';
    closeAddTask.textContent = 'Add a Task';
    flag = 0;
  } else {
    taskSet.style.removeProperty('display');
    closeAddTask.textContent = 'Close';
    flag = 1;
  }
});

saveTask.addEventListener('click', () => {
  const taskNameInput = document.getElementById('task-name');
  const taskDeadlineInput = document.getElementById('task-deadline');
  const taskName = taskNameInput.value.trim();
  const taskDeadline = taskDeadlineInput.value.trim();

  if (taskName !== '' && taskDeadline !== '') {
    taskNumber++;
    localStorage.setItem('0', taskNumber.toString());
    createTask(taskName, taskDeadline, taskNumber);
    localStorage.setItem(
      taskNumber.toString(),
      JSON.stringify({
        taskName: taskName,
        taskDeadline: taskDeadline,
      }),
    );
  } else {
    validateField(taskName, taskDeadline);
  }

  taskNameInput.value = '';
  taskDeadlineInput.value = '';
});
