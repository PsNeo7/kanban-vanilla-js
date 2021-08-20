main_table_area = document.getElementById("main-table-area")

mainTables = [
    {
        name: "Todo",
        id: 1,
        tasks: [
            {
                desc: "Hi"
            }
        ]
    },
    {
        name: "Done",
        id: 2,
        tasks: [
            {
                desc: "Hello"
            }
        ]
    }
]

// .forEach(element => {
//     // class="task-table" 
// });

function render() {
    console.log("render being called", mainTables);
    main_table_area.innerHTML = ""
    mainTables.forEach(element => {
        table = document.createElement("DIV")
        table.innerHTML = createTableInnerHTML(element)
        main_table_area.append(table)
    });
}


main_table_area.addEventListener("click", (e) => {
    // console.log(e.target.parentNode.dataset);
    if (e.target.dataset.type == "add-task-button") {
        addTaskToTable(e.target.dataset.tableNumber)
    }

    if (e.target.dataset.type == "edit-task-button") {
        // console.log(e.target.parentNode.dataset);
        editTaskInTable(e.target.parentNode.dataset.tableNumber, e.target.parentNode.dataset.taskIndex)
    }

    if (e.target.dataset.type == "del-task-button") {
        delTaskInTable(e.target.parentNode.dataset.tableNumber, e.target.parentNode.dataset.taskIndex)
    }
})

function delTaskInTable(tableID, taskID) {
    mainTables.forEach(table => {
        if (table.id == tableID) {
            table.tasks.forEach((task, index) => {
                if (index == taskID) {
                    table.tasks.splice(index, 1)
                }
            });
        }
    });
    render()
}

function editTaskInTable(tableID, taskID) {
    mainTables.forEach(table => {
        if (table.id == tableID) {
            table.tasks.forEach((task, index) => {
                if (index == taskID) {
                    taskEdit = prompt("Edit task", task.desc)
                    if (taskEdit) {
                        task.desc = taskEdit
                        render()
                    }
                }
            });
        }
    });
}

function addTaskToTable(tableID) {
    // console.log(tableID);
    newTodo = prompt("Enter Todo")
    if (newTodo) {
        mainTables.forEach(table => {
            if (table.id == tableID) {
                table.tasks.push({
                    desc: newTodo
                })
                // table.tasks = [...table.tasks, { desc: newTodo }]
            }
        });
    }
    render()
    // maintabl
}


function createTableInnerHTML(table) {
    table_inner_HTML = `<div class="task-table" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)">
    <div class="heading"><span>${table.name}</span> <button data-type="add-task-button" data-table-number="${table.id}">+</button></div>
    `
    tasks = ""
    table.tasks.forEach((element, index) => {
        tasks += `
        <div data-task-index="${index}" data-table-number="${table.id}" draggable="true" class="task">
             <span class="desc">${element.desc}</span>
             <button data-type="edit-task-button">Edit</button> <button data-type="del-task-button">Delete</button>
         </div>`
    })
    table_inner_HTML += tasks + "</div>"
    return table_inner_HTML
    // +
    //     <div class="task">
    //         <span class="desc">${desc}</span>
    //         <button>Edit</button> <button>Delete</button>
    //     </div>
    // </div>`
}

render()

function allowDrop(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    data = JSON.parse(e.dataTransfer.getData("text"))
    current_data = e.target.dataset
    console.log(data, current_data.tableNumber);
    transferData = null
    mainTables.forEach(table => {
        if (table.id == data.tableNumber) {
            table.tasks.forEach((task, index) => {
                if (index == data.taskIndex) {
                    transferData = task
                    // console.log(task, index);
                    table.tasks.splice(index, 1)
                    // console.log(table.tasks);
                    render()
                }
            });
        }
    });

    mainTables.forEach(table => {
        if (table.id == current_data.tableNumber) {
            // table.tasks.forEach((task, index) => {
            //     if (index == taskIndex) {
            //         transferData = 
            //         table.tasks.split(index, 1)
            //     }
            // });
            table.tasks.push(transferData)
            render()
        }
    });


    // JSON.stringify
    // render()
}

function drag(e) {
    data = e.target.dataset
    console.log(data)

    e.dataTransfer.setData("text", JSON.stringify({ taskIndex: data.taskIndex, tableNumber: data.tableNumber }));
}

