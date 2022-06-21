const db = require('./connection');
const inquirer = require('inquirer');


function promptUser() {
    inquirer.prompt({
        type: 'list',
        name: 'task',
        message: 'What Would You like to do?',
        choices: ['View All Employees',
            'View Department',
            'View Roles',
            'Add Employee',
            'Add Department',
            'Update Employee Role',
            'Exit Application'
        ]
    }).then(function ({ task }) {
        switch (task) {
            case "View All Employees":
                viewEmployee();
                break;
            case "View Department":
                viewDepartment();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "Add Employee":
                addEmployee()
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Update Employee Role":
                updateRole();
                break;
            case "Exit Application":
                exitApp()
                break;
        }

    })
}
// create a function to display all users
function viewEmployee() {
    const params = `SELECT * FROM employee`
    db.query(params, (err, rows) => {
        console.table(rows)
        promptUser()
    })

}
// create a function to display all users by department
function viewDepartment() {
    const params = `SELECT * FROM department`
    db.query(params, (err, rows) => {
        console.table(rows)
        promptUser()
    })
}
// create a function to view all the roles
function viewRoles() {
    const params = `SELECT * FROM role`
    db.query(params, (err, rows) => {
        console.table(rows)
        promptUser()
    })


}
// create a function to add a department
function addDepartment() {
    inquirer.prompt({
        name: 'department',
        message: 'Enter the name of your Department'
    }).then(data => {
        const params = `INSERT INTO department SET ?`
        db.query(params, { name: data.department }, () => { promptUser() })
    })
}
//create a function to add an employee
function addEmployee() {
    roleParams = ` SELECT title, id FROM ROLE`
    db.query(roleParams, (err, roleRows) => {
        const roleArray = roleRows.map(role => ({ name: role.title, value: role.id }))
        inquirer.prompt([
            {
                name: 'first_name',
                message: 'what is your employees first name?'
            },
            {
                name: 'last_name',
                message: 'what is your employees last name?'
            },
            {
                type: 'list',
                name: 'role',
                message: 'Please select the employees department',
                choices: roleArray
            }
        ]).then(data => {
            const insertParams = `INSERT INTO employee SET ?`
            db.query(insertParams, ({ first_name: data.first_name, last_name: data.last_name, role_id: data.role }), () => { promptUser() })
        })
    })

}
//create a function to update employee role
function updateRole() {
    const roleParams = `SELECT title, id FROM ROLE `
    const employeeParams = `SELECT id, first_name, last_name FROM employee `
    db.query(roleParams, (err, roleRows) => {
        db.query(employeeParams, (err, employeeRows) => {
            const roleArray = roleRows.map(role => ({ name: role.title, value: role.id }))
            const employeeArray = employeeRows.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }))
            inquirer.prompt([{

                type: 'list',
                name: 'employee',
                message: 'What is the name of the Employee?',
                choices: employeeArray

            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the role your updating the employee to?',
                choices: roleArray
            }]).then(data => {
                const updateParams = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ? `
                db.query(updateParams, [data.role, data.employee], () => { promptUser() })
            })

        })
    })

}

function exitApp() {
    process.exit()
}
promptUser();