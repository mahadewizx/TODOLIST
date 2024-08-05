document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskButton = document.getElementById('addTaskButton');
  const todoList = document.getElementById('todoList');
  const markAllCompleteButton = document.getElementById(
    'markAllCompleteButton'
  );
  const unmarkAllCompleteButton = document.getElementById(
    'unmarkAllCompleteButton'
  );
  const deleteAllButton = document.getElementById('deleteAllButton');

  // Muat tugas dari local storage saat halaman dimuat
  loadTasks();

  // Tambahkan tugas baru dengan klik tombol atau tekan Enter
  addTaskButton.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Tangani aksi tugas (selesai atau hapus)
  todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      deleteTask(e.target.dataset.id);
    } else if (e.target.classList.contains('complete-btn')) {
      handleCompleteTask(e.target.dataset.id);
    }
  });

  // Tangani aksi massal
  markAllCompleteButton.addEventListener('click', markAllTasksComplete);
  unmarkAllCompleteButton.addEventListener('click', unmarkAllTasksComplete);
  deleteAllButton.addEventListener('click', deleteAllTasks);

  // Muat tugas dari local storage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    todoList.innerHTML = ''; // Kosongkan daftar yang ada
    tasks.forEach(displayTask);
  }

  // Simpan tugas ke local storage
  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Tambahkan tugas baru
  function addTask() {
    const taskContent = taskInput.value.trim();
    if (taskContent) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const newTask = {
        id: Date.now().toString(),
        content: taskContent,
        completed: false,
        date: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
      };
      tasks.push(newTask);
      saveTasks(tasks);
      displayTask(newTask);
      taskInput.value = '';
    }
  }

  // Tampilkan tugas
  function displayTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = 'todo-item' + (task.completed ? ' completed' : '');

    li.innerHTML = `
            <span>${task.content}</span>
            <button class="complete-btn" data-id="${task.id}">Selesai</button>
            <button class="delete-btn" data-id="${task.id}">Hapus</button>
        `;
    todoList.appendChild(li);
  }

  // Tangani penyelesaian tugas (hanya satu tugas yang dapat ditandai selesai pada satu waktu)
  function handleCompleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const currentTask = tasks.find((task) => task.id === id);

    if (currentTask) {
      // Batalkan status selesai dari semua tugas
      tasks = tasks.map((task) => {
        if (task.completed && task.id !== id) {
          task.completed = false;
        }
        return task;
      });

      // Tandai tugas yang dipilih sebagai selesai
      currentTask.completed = !currentTask.completed;
      saveTasks(tasks);

      // Update UI
      document.querySelectorAll('.todo-item').forEach((item) => {
        if (item.dataset.id === id) {
          item.classList.toggle('completed', currentTask.completed);
        } else {
          item.classList.remove('completed');
        }
      });
    }
  }

  // Hapus tugas tertentu
  function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Hapus tugas dari array berdasarkan id
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks(tasks);

    // Hapus tugas dari UI
    const taskElement = document.querySelector(
      `[data-id="${id}"]`
    ).parentElement;
    if (taskElement) {
      taskElement.remove();
    }
  }

  // Tandai semua tugas sebagai selesai
  function markAllTasksComplete() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task) => (task.completed = true));
    saveTasks(tasks);
    document
      .querySelectorAll('.todo-item')
      .forEach((item) => item.classList.add('completed'));
  }

  // Batalkan tanda selesai dari semua tugas
  function unmarkAllTasksComplete() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task) => (task.completed = false));
    saveTasks(tasks);
    document
      .querySelectorAll('.todo-item')
      .forEach((item) => item.classList.remove('completed'));
  }

  // Hapus semua tugas
  function deleteAllTasks() {
    localStorage.removeItem('tasks');
    todoList.innerHTML = '';
  }

  // Opsional: Implementasikan penyaringan berdasarkan status dan tanggal di sini
});
