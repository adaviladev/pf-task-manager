document.addEventListener("DOMContentLoaded", () => {
    let addTaskBtn = document.getElementById("add-task-btn");
    let input = document.getElementById("input-task");
    let orderedTasks = document.querySelector(".ordered-tasks");
    let completedList = document.querySelector(".completed-list");
    let clearCompletedBtn = document.getElementById("clear-completed-btn");
  
    let taskId = 1;
  
    const saveTasksToLocalStorage = () => {
      const tasks = [];
      orderedTasks.querySelectorAll("li").forEach(taskElement => {
        const taskText = taskElement.querySelector(".task-text").textContent.trim();
        const completed = taskElement.classList.contains("completed-task");
        if (taskText !== "") {
          tasks.push({ id: taskElement.id, text: taskText, completed });
        } else {
          taskElement.remove(); // Eliminar elementos vacíos del DOM
        }
      });
      completedList.querySelectorAll("li").forEach(taskElement => {
        const taskText = taskElement.querySelector(".task-text").textContent.trim();
        if (taskText !== "") {
          tasks.push({ id: taskElement.id, text: taskText, completed: true });
        } else {
          taskElement.remove(); // Eliminar elementos vacíos del DOM
        }
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    };
  
    const loadTasksFromLocalStorage = () => {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.forEach(task => {
        if (task.text.trim() !== "") {
          const taskElement = createTaskElement(task.text, task.id, task.completed);
          if (task.completed) {
            completedList.appendChild(taskElement);
          } else {
            orderedTasks.appendChild(taskElement);
          }
  
          // Asegurarse de que la transición se active al agregar la clase "visible"
          setTimeout(() => {
            taskElement.classList.add("visible");
          }, 10); // Añadir un pequeño retraso para activar la transición correctamente
        }
      });
      taskId = tasks.length ? Math.max(...tasks.map(task => parseInt(task.id.split('-')[1]))) + 1 : 1;
      updateClearCompletedBtnVisibility();
    };
  
    const updateClearCompletedBtnVisibility = () => {
      if (completedList.children.length > 0) {
        clearCompletedBtn.style.display = "block";
      } else {
        clearCompletedBtn.style.display = "none";
      }
    };
  
    const createTaskElement = (inputData, id, completed = false) => {
      // Convertir la primera letra a mayúscula
      const capitalizedInput = inputData.charAt(0).toUpperCase() + inputData.slice(1);
  
      // Crear elemento <li> para la tarea
      const taskElement = document.createElement("li");
      taskElement.setAttribute("id", id || `task-${taskId}`);
      if (!id) taskId++;
  
      // Crear contenedor para el ícono y el texto de la tarea
      const taskContent = document.createElement("div");
      taskContent.className = "task-content";
  
      // Crear elemento <i> para el ícono de completar tarea de Font Awesome
      const completeIconElement = document.createElement("i");
      completeIconElement.className = completed ? "fas fa-circle-check" : "far fa-circle-check"; // Ícono lleno si está completado, vacío si no
  
      // Añadir evento de clic para marcar como completada o no completada
      completeIconElement.addEventListener("click", () => {
        taskElement.classList.toggle("completed-task");
        completeIconElement.classList.toggle("fas"); // Alternar entre ícono lleno y vacío
        saveTasksToLocalStorage();
        updateClearCompletedBtnVisibility();
  
        if (taskElement.classList.contains("completed-task")) {
          // Mover la tarea completada a la lista de tareas completadas
          completedList.appendChild(taskElement);
        } else {
          // Devolver la tarea a la lista de tareas ordenadas
          orderedTasks.appendChild(taskElement);
        }
      });
  
      // Añadir el ícono de completar tarea al contenedor de la tarea
      taskContent.appendChild(completeIconElement);
  
      // Crear elemento <i> para el ícono de eliminar tarea de Font Awesome
      const deleteIconElement = document.createElement("i");
      deleteIconElement.className = "fas fa-trash-alt delete-icon"; // Ícono de eliminar tarea
  
      // Añadir evento de clic para eliminar la tarea
      deleteIconElement.addEventListener("click", () => {
        taskElement.remove();
        saveTasksToLocalStorage();
        updateClearCompletedBtnVisibility();
      });
  
      // Añadir el ícono de eliminar tarea al contenedor de la tarea
      taskContent.appendChild(deleteIconElement);
  
      // Crear elemento <span> para el texto de la tarea
      const taskText = document.createElement("span");
      taskText.textContent = capitalizedInput; // Usar la versión capitalizada
      taskText.className = "task-text";
  
      // Añadir evento de clic para editar el texto
      taskText.addEventListener("click", () => {
        if (!taskElement.classList.contains("completed-task")) {
          taskText.contentEditable = true;
          taskText.focus();
          taskText.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              taskText.blur();
            }
          });
          taskText.addEventListener("blur", () => {
            taskText.contentEditable = false;
            saveTasksToLocalStorage();
          });
        }
      });
  
      // Añadir el texto al contenedor de la tarea
      taskContent.appendChild(taskText);
  
      // Añadir el contenedor de la tarea al elemento de tarea
      taskElement.appendChild(taskContent);
  
      // Si la tarea está completada, aplicar estilo
      if (completed) {
        taskElement.classList.add("completed-task");
      }
  
      return taskElement;
    };
  
    const addTask = () => {
      const inputData = input.value.trim();
  
      if (inputData !== "") {
        const taskElement = createTaskElement(inputData);
  
        // Añadir tarea como un <li> al <ol> de tareas ordenadas
        orderedTasks.appendChild(taskElement);
  
        // Activar la transición suave
        setTimeout(() => {
          taskElement.classList.add("visible");
        }, 10); // Espera breve para asegurar que se active la transición correctamente
  
        // Limpiar el input después de añadir la tarea
        input.value = "";
  
        saveTasksToLocalStorage();
      }
    };
  
    addTaskBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addTask();
    });
  
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTask();
      }
    });
  
    clearCompletedBtn.addEventListener("click", () => {
      // Eliminar todas las tareas completadas
      while (completedList.firstChild) {
        completedList.removeChild(completedList.firstChild);
      }
      saveTasksToLocalStorage();
      updateClearCompletedBtnVisibility();
    });
  
    // Cargar tareas desde localStorage al cargar la página
    loadTasksFromLocalStorage();
  
    // Cambiar cursor al pasar sobre los íconos de completar y eliminar
    orderedTasks.addEventListener("mouseover", (e) => {
      if (e.target && e.target.matches(".fa-circle-check, .fa-trash-alt")) {
        e.target.style.cursor = "pointer";
      }
    });
  
    // Restaurar cursor al salir de los íconos de completar y eliminar
    orderedTasks.addEventListener("mouseout", (e) => {
      if (e.target && e.target.matches(".fa-circle-check, .fa-trash-alt")) {
        e.target.style.cursor = "default";
      }
    });
  });
  