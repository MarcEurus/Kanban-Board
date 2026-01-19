const modal = document.getElementById('task-modal');
const openBtn = document.getElementById('open-modal-btn');
const closeBtn = document.querySelector('.close-modal');
const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const detailInput = document.getElementById('task-detail');
const dateInput = document.getElementById('task-deadline');
const columns = document.querySelectorAll('.task-list'); 

document.addEventListener('DOMContentLoaded', loadTasks);

openBtn.addEventListener('click', () => {
    modal.style.display = 'flex'; 
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = titleInput.value;
    const detail = detailInput.value;
    const date = dateInput.value;

    if (!title) return;

    const newTask = createTaskElement(title, detail, date);
    document.getElementById('todo').appendChild(newTask);
    
    form.reset();
    modal.style.display = 'none';
    saveTasks();
});

function createTaskElement(title, detail, date) {
    const div = document.createElement('div');
    div.classList.add('task');
    div.setAttribute('draggable', 'true');

    div.innerHTML = `
        <div class="task-content">
            <div class="task-title">${title}</div>
            <div class="task-detail">${detail}</div>
            <div class="task-meta">📅 ${date}</div>
        </div>
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = '✕';
    deleteBtn.classList.add('delete-btn');
    
    deleteBtn.addEventListener('click', () => {
        div.remove();
        saveTasks();
    });

    div.appendChild(deleteBtn);

    div.addEventListener('dragstart', () => {
        div.classList.add('dragging');
    });

    div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
        saveTasks();
    });

    return div;
}

columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
            column.appendChild(draggingTask);
        }
    });
});

function saveTasks() {
    const data = {
        todo: document.getElementById('todo').innerHTML,
        inprogress: document.getElementById('inprogress').innerHTML,
        done: document.getElementById('done').innerHTML
    };
    localStorage.setItem('kanbanData', JSON.stringify(data));
}

function loadTasks() {
    const data = JSON.parse(localStorage.getItem('kanbanData'));
    
    if (data) {
        document.getElementById('todo').innerHTML = data.todo;
        document.getElementById('inprogress').innerHTML = data.inprogress;
        document.getElementById('done').innerHTML = data.done;

        document.querySelectorAll('.task').forEach(task => {
            const deleteBtn = task.querySelector('.delete-btn');
            
            task.addEventListener('dragstart', () => {
                task.classList.add('dragging');
            });
            task.addEventListener('dragend', () => {
                task.classList.remove('dragging');
                saveTasks();
            });

            deleteBtn.addEventListener('click', () => {
                task.remove();
                saveTasks();
            });
        });
    }
}