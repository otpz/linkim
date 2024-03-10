const sql = require('mssql/msnodesqlv8')

const editUser = async (user, email) => {

    const query = `UPDATE Users SET Name = '${user.name}', Surname = '${user.surname}', UserName = '${user.username}', Biography = '${user.biography}', Email = '${user.email}' WHERE Email = '${email}'`
    try {
        const result = await sql.query(query)
        console.log(result)
        return result
    } catch (error) {
        console.log(error)
        return error
    }
}

module.exports = editUser