
const sql = require('mssql/msnodesqlv8')

const deleteUserLink = async (id) => {
    const query = `delete from Links where Id = ${id}`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        return error
    }
}

module.exports = deleteUserLink