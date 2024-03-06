const sql = require('mssql/msnodesqlv8')

const insertUser = async (name, surname, username, email, password) => {
    const query = `insert into Users (Email, Password, UserName, Name, Surname) values ('${email}', '${password}', '${username}', '${name}', '${surname}')`
    
    try {
        const result = await sql.query(query)

        return result

    } catch (error) {
        return error
    }
}

module.exports = insertUser