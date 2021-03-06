main_table_area = document.getElementById("main-table-area")
add_table_button = document.getElementById("add-table-button")
reset_data_button = document.getElementById("reset-data-button")
tableCounter = 0

add_table_button.addEventListener('click', (e) => {
    createNewTable()
})

reset_data_button.addEventListener('click', (e) => {
    resetLocalData()
    render()
})

function resetLocalData() {
    mainTables = defaultValues
    console.log("clicking remoce data");
    localStorage.removeItem("data")
    setStateToLocal()
}

createNewTable = () => {
    tableName = prompt('Enter New Table Name')
    if (tableName) {
        addNewMainTable(tableName)
    }
}

addNewMainTable = (tableName) => {
    mainTables.push(new MainTable(tableName, newTableId(), []))
    render()
}

function newTableId() {
    tableCounter += 1
    return tableCounter
}

class MainTable {
    constructor(name = "noName", id = newTableId(), tasks = []) {
        this.name = name
        this.id = id
        this.tasks = tasks
    }

    setProperty(property, value) {
        if (this.property) {
            this.property = value
        }
    }
}

mainTables = []

// mainTables.push(new MainTable("todo", newTableId(), [{
//     desc: "Hi"
// }]))

// mainTables.push(new MainTable("Done", newTableId(), [{
//     desc: "Hello"
// }]))

// mainTables.push(new MainTable("grooming"))

defaultValues = [{ "name": "todo", "id": 1, "tasks": [{ "desc": "Hi" }] }, { "name": "Done", "id": 2, "tasks": [{ "desc": "Hello" }] }, { "name": "grooming", "id": 3, "tasks": [] }]

function getStateFromLocal() {
    if (localStorage.getItem("data")) {
        mainTables = JSON.parse(localStorage.getItem("data"))
        tableCounter = mainTables.length
        console.log("currentTableCounter ", tableCounter);
    } else {
        mainTables = defaultValues
    }
    console.log("getData from local being called", mainTables);
}

getStateFromLocal()

function setStateToLocal() {
    localStorage.setItem("data", JSON.stringify(mainTables))
}

function render() {
    setStateToLocal()
    console.log("render being called", mainTables);
    main_table_area.innerHTML = ""
    mainTables.forEach((element, tableIndex) => {
        table = document.createElement("DIV")
        table.innerHTML = createTableInnerHTML(element, tableIndex)
        table.dataset.tableNumber = element.id
        main_table_area.append(table)
    });
}


main_table_area.addEventListener("click", (e) => {
    // console.log(e.target.parentNode.dataset);
    if (e.target.dataset.type == "add-task-button") {
        newTodo = prompt("Enter Todo")
        if (newTodo) {
            addTaskToTable(e.target.parentNode.dataset.tableId, { desc: newTodo })
        }
    }

    if (e.target.dataset.type == "edit-task-button") {
        // console.log(e.target.parentNode.dataset);
        editTaskInTable(e.target.parentNode.dataset.tableId, e.target.parentNode.dataset.taskIndex)
    }

    if (e.target.dataset.type == "del-task-button") {
        delTaskInTable(e.target.parentNode.dataset.tableId, e.target.parentNode.dataset.taskIndex)
    }

    if (e.target.dataset.type == "edit-table-button") {
        editTable(e.target.parentNode.dataset.tableId)
        // editTable(e.target.parentNode)
    }

    if (e.target.dataset.type == "delete-table-button") {
        deleteMainTable(e.target.parentNode.dataset.tableId)
        // editTable(e.target.parentNode)
    }
})

function deleteMainTable(tableID) {
    // console.log("tableid =", tableID);
    mainTables.forEach((table, index) => {
        if (table.id == tableID) {
            mainTables.splice(index, 1)
            render()
        }
    });
}

function editTable(tableID) {
    console.log("reaached editTable", tableID);
    mainTables.forEach(table => {
        if (table.id == tableID) {
            tableName = prompt("Edit table name", table.name)
            if (tableName) {
                table.name = tableName
                render()
            }
        }
    });
}

function delTaskInTable(tableID, taskID) {
    console.log(tableID, taskID);
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
    console.log("recived tableid and taskId as ", tableID, " ", taskID);
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

function addTaskToTable(tableID, newTodo) {
    console.log(tableID);
    mainTables.forEach(table => {
        if (table.id == tableID) {
            table.tasks.push(newTodo)
            // table.tasks = [...table.tasks, { desc: newTodo }]
        }
    });
    render()
    // maintabl
}

function shuffleTables(table1, table2) {
    console.log(table1, table2, "tables that need to swap");
    tmp = mainTables[table1]
    mainTables[table1] = mainTables[table2]
    mainTables[table2] = tmp
    render()
}

function createTableInnerHTML(table, tableIndex) {

    tasks = ""
    table.tasks.forEach((element, index) => {
        tasks += `
        <div data-type="task" 
        data-table-ID="${table.id}" 
        data-task-index="${index}" 
        data-table-number="${tableIndex}" 
        draggable="true" class="task">
             <span class="desc">${element.desc}</span>
             <span class="options" data-table-ID="${table.id}" data-table-number="${tableIndex}" data-task-index="${index}">
                <button
                    data-type="edit-task-button">Edit
                </button> 

                <button 
                    data-type="del-task-button">Delete
                </button>
             </span>
         </div>`
    })
    table_inner_HTML = `<div class="task-table" 
    data-table-ID="${table.id}" data-type="table" 
    draggable="true" data-table-number="${tableIndex}" 
    ondragstart="drag(event)" touchstart="drag(event)" 
    ondrop="drop(event)" ondragover="allowDrop(event)">

        <div data-table-ID="${table.id}" data-table-number="${tableIndex}" class="heading">
        
            <h1 class="title">${table.name}</h1> 

            <button data-type="edit-table-button">Edit Name</button> 

            <button data-type="delete-table-button">Delete Table</button> 

            <button data-type="add-task-button">+</button>

        </div> 
            ${tasks}
    </div>`

    return table_inner_HTML
}

render()

function allowDrop(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    data = JSON.parse(e.dataTransfer.getData("text"))
    console.log(e.target.dataset);
    current_data = e.target.dataset.tableId != null ? e.target.dataset : e.target.parentNode.dataset
    console.log(data, current_data.tableId, "data");

    if (data.type === "table") {
        shuffleTables(data.tableNumber, current_data.tableNumber)
    } else if (data.type === "task") {
        dropTask(data, current_data.tableId)
    }

}

function dropTask(data, currentTableNumber) {
    transferData = null
    mainTables.forEach(table => {
        if (table.id == data.tableID) {
            table.tasks.forEach((task, index) => {
                if (index == data.taskIndex) {
                    transferData = task
                    delTaskInTable(data.tableID, data.taskIndex)
                }
            });
        }
    });
    addTaskToTable(currentTableNumber, transferData)
}


function drag(e) {
    data = e.target.dataset
    console.log(data)
    e.dataTransfer.setData("text", JSON.stringify({ taskIndex: data.taskIndex, tableNumber: data.tableNumber, type: data.type, tableID: data.tableId }));
}

