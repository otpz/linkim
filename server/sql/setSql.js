const sql = require('mssql/msnodesqlv8')

const editUser = async (user, email) => {

    const query = `UPDATE Users SET Name = '${user.name}', Surname = '${user.surname}', UserName = '${user.username}', Biography = '${user.biography}', Email = '${user.email}' WHERE Email = '${email}'`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log("request error ->", error)
        return error
    }
}

const editPassword = async (email, password) => {
    const query = `UPDATE Users Set Password = '${password}' WHERE Email = '${email}'`

    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

module.exports = {editUser, editPassword}