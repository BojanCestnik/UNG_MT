"use strict";

const STORAGE_KEY = "notebook-study-planner-tasks";
const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#summary-text");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch (error) {
    console.warn("Could not load saved tasks:", error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
    alert("Your tasks could not be saved. Check your browser storage settings.");
  }
}

function addTask(event) {
  event.preventDefault();
  const formData = new FormData(taskForm);
  const title = formData.get("title").trim();
  const subject = formData.get("subject").trim();
  const type = formData.get("type");
  const dueDate = formData.get("dueDate");
  if (!title || !subject || !dueDate) return;

  tasks.push({
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title, subject, type, dueDate, completed: false
  });
  saveTasks();
  taskForm.reset();
  document.querySelector("#task-title").focus();
  renderTasks();
}

function renderTasks() {
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.length - activeCount;
  document.querySelector("#all-count").textContent = tasks.length;
  document.querySelector("#active-count").textContent = activeCount;
  document.querySelector("#completed-count").textContent = completedCount;
  taskCount.textContent = `You have ${activeCount} active tasks and ${completedCount} completed tasks.`;

  const visibleTasks = filterTasks();
  taskList.replaceChildren();

  if (visibleTasks.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    const icon = document.createElement("div");
    icon.className = "empty-icon";
    icon.textContent = currentFilter === "completed" ? "✓" : "✎";
    const message = document.createElement("strong");
    message.textContent = currentFilter === "completed" ? "No completed tasks yet" : "Your study list is clear";
    const hint = document.createElement("span");
    hint.textContent = currentFilter === "all" ? "Add your first task above and get started." : "Try another filter or add a new task.";
    emptyState.append(icon, message, hint);
    taskList.append(emptyState);
    return;
  }

  visibleTasks.forEach(task => {
    const taskElement = document.createElement("article");
    taskElement.className = `task ${task.type.toLowerCase()}${task.completed ? " completed" : ""}`;

    const symbol = document.createElement("div");
    symbol.className = "task-symbol";
    symbol.textContent = task.type === "Exam" ? "◆" : task.type === "Project" ? "▰" : "▤";
    symbol.setAttribute("aria-hidden", "true");

    const main = document.createElement("div");
    main.className = "task-main";
    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    const subject = document.createElement("span");
    subject.textContent = task.subject;
    const type = document.createElement("span");
    type.textContent = task.type;
    meta.append(subject, type);
    main.append(title, meta);

    const side = document.createElement("div");
    side.className = "task-side";
    const dueBlock = document.createElement("div");
    dueBlock.className = "due-block";
    const calendar = document.createElement("span");
    calendar.className = "calendar";
    calendar.textContent = "▦";
    const dueDate = document.createElement("span");
    dueDate.textContent = formatDate(task.dueDate);
    dueBlock.append(calendar, dueDate);

    const overdue = !task.completed && task.dueDate < getToday();
    if (overdue) dueBlock.classList.add("overdue");
    const status = document.createElement("span");
    status.className = `status-pill${task.completed ? " done" : overdue ? " overdue" : ""}`;
    status.textContent = task.completed ? "Completed" : overdue ? "Overdue!" : "Upcoming";
    side.append(dueBlock, status);

    const checkWrap = document.createElement("div");
    checkWrap.className = "check-wrap";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} as ${task.completed ? "active" : "completed"}`);
    checkbox.addEventListener("change", () => toggleTaskStatus(task.id));
    checkWrap.append(checkbox);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "▤";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    taskElement.append(symbol, main, side, checkWrap, deleteButton);
    taskList.append(taskElement);
  });
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function toggleTaskStatus(taskId) {
  tasks = tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
  saveTasks();
  renderTasks();
}

function filterTasks() {
  return tasks
    .filter(task => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    })
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate));
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "2-digit", year: "numeric" })
    .format(new Date(year, month - 1, day));
}

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

taskForm.addEventListener("submit", addTask);
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(filterButton => {
      const selected = filterButton === button;
      filterButton.setAttribute("aria-pressed", String(selected));
      filterButton.classList.toggle("selected", selected);
    });
    renderTasks();
  });
});

renderTasks();
