document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("add-task-btn");
  const input = document.getElementById("input-task");
  const orderedTasks = document.querySelector(".ordered-tasks");
  const completedList = document.querySelector(".completed-list");
  const clearCompletedBtn = document.getElementById("clear-completed-btn");
  const charCountDisplay = document.createElement("span");
  const MAX_TASK_LENGTH = 50; // Extensión máxima de caracteres

  charCountDisplay.className = "char-count";
  charCountDisplay.textContent = `${MAX_TASK_LENGTH} remaining characters`;
  addTaskBtn.after(charCountDisplay);

  let taskId = 1;

  const saveTasksToLocalStorage = () => {
      const tasks = [...orderedTasks.querySelectorAll("li"), ...completedList.querySelectorAll("li")]
          .map(taskElement => ({
              id: taskElement.id,
              text: taskElement.querySelector(".task-text").textContent.trim(),
              completed: taskElement.classList.contains("completed-task")
          }))
          .filter(task => task.text !== "");
      localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTasksFromLocalStorage = () => {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.forEach(task => {
          const taskElement = createTaskElement(task.text, task.id, task.completed);
          (task.completed ? completedList : orderedTasks).appendChild(taskElement);
          setTimeout(() => taskElement.classList.add("visible"), 10);
      });
      taskId = tasks.length ? Math.max(...tasks.map(task => parseInt(task.id.split('-')[1]))) + 1 : 1;
      updateClearCompletedBtnVisibility();
  };

  const updateClearCompletedBtnVisibility = () => {
      clearCompletedBtn.style.display = completedList.children.length >= 1 ? "block" : "none";
  };

  const createTaskElement = (text, id, completed = false) => {
      const taskElement = document.createElement("li");
      taskElement.id = id || `task-${taskId++}`;
      taskElement.className = completed ? "completed-task" : "";

      const taskContent = document.createElement("div");
      taskContent.className = "task-content";

      const completeIcon = document.createElement("i");
      completeIcon.className = completed ? "fas fa-circle-check" : "far fa-circle-check";
      completeIcon.addEventListener("click", toggleTaskCompletion);

      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash-alt delete-icon";
      deleteIcon.addEventListener("click", deleteTask);

      const taskText = document.createElement("span");
      taskText.className = "task-text";
      taskText.textContent = text.charAt(0).toUpperCase() + text.slice(1);
      taskText.addEventListener("click", editTaskText);

      taskContent.append(completeIcon, deleteIcon, taskText);
      taskElement.appendChild(taskContent);

      return taskElement;
  };

  const addTask = () => {
      const inputData = input.value.trim();
      if (inputData.length > MAX_TASK_LENGTH) {
          alert(`Task cannot have more than ${MAX_TASK_LENGTH} characters.`);
          return;
      }
      if (inputData) {
          const taskElement = createTaskElement(inputData);
          orderedTasks.appendChild(taskElement);
          setTimeout(() => taskElement.classList.add("visible"), 10);
          input.value = "";
          saveTasksToLocalStorage();
          updateClearCompletedBtnVisibility();
          updateCharCount();
      }
  };

  const toggleTaskCompletion = (e) => {
      const taskElement = e.target.closest("li");
      taskElement.classList.toggle("completed-task");
      e.target.classList.toggle("fas");
      e.target.classList.toggle("far");
      (taskElement.classList.contains("completed-task") ? completedList : orderedTasks).appendChild(taskElement);
      saveTasksToLocalStorage();
      updateClearCompletedBtnVisibility();
  };

  const deleteTask = (e) => {
      e.target.closest("li").remove();
      saveTasksToLocalStorage();
      updateClearCompletedBtnVisibility();
      updateCharCount();
  };

  const editTaskText = (e) => {
      const taskText = e.target;
      const taskElement = taskText.closest("li");
      if (!taskElement.classList.contains("completed-task")) {
          taskText.contentEditable = true;
          taskText.focus();
          taskText.addEventListener("input", () => {
              if (taskText.textContent.length > MAX_TASK_LENGTH) {
                  taskText.textContent = taskText.textContent.slice(0, MAX_TASK_LENGTH);
                  alert(`Task cannot have more than ${MAX_TASK_LENGTH} characters.`);
              }
          });
          taskText.addEventListener("keydown", (e) => {
              if (e.key === "Enter") {
                  e.preventDefault();
                  taskText.blur();
              }
          });
          taskText.addEventListener("blur", () => {
              taskText.contentEditable = false;
              saveTasksToLocalStorage();
              updateCharCount();
          });
      }
  };

  const updateCharCount = () => {
      const remainingChars = MAX_TASK_LENGTH - input.value.length;
      charCountDisplay.textContent = `${remainingChars} remaining characters`;
      charCountDisplay.style.color = remainingChars < 0 ? 'red' : 'white';
  };

  addTaskBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addTask();
  });

  input.addEventListener("input", updateCharCount);
  input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
          e.preventDefault();
          addTask();
      }
  });

  clearCompletedBtn.addEventListener("click", () => {
      completedList.innerHTML = "";
      saveTasksToLocalStorage();
      updateClearCompletedBtnVisibility();
      updateCharCount();
  });

  loadTasksFromLocalStorage();

  // Delegación de eventos para mejorar el rendimiento
  document.addEventListener("mouseover", (e) => {
      if (e.target.matches(".fa-circle-check, .fa-trash-alt")) {
          e.target.style.cursor = "pointer";
      }
  });

  document.addEventListener("mouseout", (e) => {
      if (e.target.matches(".fa-circle-check, .fa-trash-alt")) {
          e.target.style.cursor = "default";
      }
  });
});
