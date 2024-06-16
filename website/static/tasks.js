const taskBtn = document.querySelector(".task-btn");
const taskList = document.querySelector(".task-list");

document.addEventListener("DOMContentLoaded", fetchTasks);
taskBtn.addEventListener("click", addTasks);
taskList.addEventListener("click", checkBtn);

function addTasks(event){
    event.preventDefault();
    const taskInput = document.getElementById('task-input').value;
    fetch('/add-tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'data': taskInput })
    })
    .then(response => response.json())
    .then(info => {
        console.log('Task added:', info);
        document.getElementById('task-input').value = '';
        fetchTasks(); // Fetch updated tasks after adding a new one
    })
    .catch(error => console.error('Error adding task:', error));
}

function fetchTasks() {
    taskList.innerHTML = "";
    fetch('/get-tasks')
    .then(response => response.json())
    .then(info => {
        if (info.length == 0){
            console.log('No tasks found!');
        }
        else{
            console.log('Tasks:', info);
            info.forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task");
            taskDiv.setAttribute("id", task.id);
            const new_task = document.createElement("li");
            new_task.innerText = task.data;
            new_task.classList.add("task-item");
            taskDiv.appendChild(new_task);

            const completionBtn = document.createElement("button");
            completionBtn.innerHTML = '<i class="fas fa-check-circle"></li>';
            completionBtn.classList.add("complete-btn");
            taskDiv.appendChild(completionBtn);

            const trashBtn = document.createElement("button");
            trashBtn.innerHTML = '<i class="fas fa-trash"></li>';
            trashBtn.classList.add("trash-btn");
            taskDiv.appendChild(trashBtn);

            taskList.appendChild(taskDiv);
            });
        }
    })
}

function checkBtn(event){
    target = event.target;
    if(target.classList.contains('complete-btn')){
        if(target.parentNode.classList.contains('completed')){
            target.parentNode.classList.remove("completed");
        }
        else {
            target.parentNode.classList.add("completed");
        }
    }
    else if(target.classList.contains('trash-btn')){
        if(target.classList.contains('task-list')){
            return;
        }
        target.parentNode.classList.add("slide");
        target.parentNode.addEventListener("transitionend", function() {
            target.parentNode.remove();
            deleteTasks(target.parentNode.id);
        });
    }
}

function deleteTasks(taskId){
        fetch('/delete-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({taskId: taskId})
        }).then((_res) => {

        })
}