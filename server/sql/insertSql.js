const sql = require('mssql/msnodesqlv8')

const insertUser = async (name, surname, username, email, password) => {
    const query = `insert into Users (Email, Password, UserName, Name, Surname, JoinDate) values ('${email}', '${password}', '${username}', '${name}', '${surname}', GETDATE())`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return {error: error}
    }
}

const insertLink = async (userId, title, link) => {
    const query = `insert into Links (UserId, Title, LinkUrl, CreatedDate) values ('${userId}', '${title}', '${link}', GETDATE())`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return {error: error}
    }
}

const insertStyle = async (userId, bgColor, borderStyle, linkBgColor) => {
    const query = `insert into UserStyles (UserId, BackgroundColor, LinkBorderRadius, LinkBackgroundColor) values ('${userId}', '${bgColor}', '${borderStyle}', '${linkBgColor}')`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return {error: error}
    }
}

const insertQuestion = async (userId, questionerId, question) => {
    const query = `insert into UserQuestions (UserId, QuestionerId, Question, Answer, AnsweredDate) values ('${userId}', ${questionerId}, '${question}', null, null)`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return {error: error}
    }
}

const insertResetPassToken = async (token) => {
    const query = `insert into ResetPassTokens (Token, ExpireStart, ExpireEnd) values ('${token}', GETDATE(), DATEADD(MINUTE, 1, GETDATE()))`;
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return {error: error}
    }
}

const insertQuestionLike = async (questionId, userId) => {
    const query = `insert into Likes (QuestionId, UserId, LikedDate) values ('${questionId}', '${userId}', GETDATE())`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return {error: error}
    }
}

const insertQuestionReport = async (questionId, reportMessage) => {
    const query = `insert into QuestionReports (QuestionId, ReportMessage, CreatedDate) values ('${questionId}', '${reportMessage}', GETDATE())`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return {error: error}
    }
}

module.exports = {insertUser, insertLink, insertStyle, insertQuestion, insertResetPassToken, insertQuestionLike, insertQuestionReport}