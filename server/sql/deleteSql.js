
const sql = require('mssql/msnodesqlv8')

const deleteUserLink = async (id) => {
    const query = `delete from Links where Id = ${id}`
    try {
        const result = await sql.query(query)
        console.log("sql result:", result)
        return result
    } catch (error) {
        return error
    }
}

module.exports = deleteUserLink