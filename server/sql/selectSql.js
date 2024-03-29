const sql = require('mssql/msnodesqlv8')

// strEmail = "Email"
const selectUser = async (email, strEmail) => {
    const query = `select * from Users where ${strEmail} = '${email}'`
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

// queryParam = "UserId"
const selectExistLinks = async (userId, queryParam, id, Id) => {

    const query = `select count (*) from Links where ${queryParam} = '${userId}' and ${Id} = ${id}`
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

const selectExistQuestion = async (userId, questionId) => {
    const query = `select count(*) as question from UserQuestions where UserId = '${userId}' and Id = '${questionId}'`
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

// queryParam = "UserId" - Kullanıcı daha önce style kaydetmiş mi
const selectExistStyles = async (userId, queryParam) => {
    const query = `select count(*) as existStyle from UserStyles where ${queryParam} = '${userId}'`
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

// queryParam = "UserId"
const selectUserLinks = async (userId, queryParam) => {
    const query = `select * from Links where ${queryParam} = ${userId}`
    try {
        const result = await sql.query(query)
        return result.recordset
    } catch (error) {
        return error
    }
}

const selectUserQuestions = async (userId) => {
    
    const query = `select ul.Id as UserLiked, uq.Id, u.Id as QuestionerId, u.Name as QuestionerName, u.Surname as QuestionerSurname, u.UserName as QuestionerUserName, uq.Question,
    u2.Id as UserId, u2.Name as UserName, u2.Surname as UserSurname, u2.UserName as UserUserName, uq.Answer, uq.AnsweredDate  ,count(l.Id) as Likes from UserQuestions uq
    inner join Users u on uq.QuestionerId = u.Id
    left join Likes l on l.QuestionId = uq.Id
    left join Likes ul on ul.QuestionId = uq.Id and ul.UserId = ${userId}
    inner join Users u2 on uq.UserId = u2.Id
    where u2.Id = ${userId}
    group by uq.Id, Question, u.Name, u2.Id, u.Id, u2.Name, u.Surname, u.UserName, u2.Surname, u2.UserName, uq.Answer, uq.AnsweredDate, ul.Id
    order by uq.AnsweredDate desc`

    try {
        const result = await sql.query(query)
        return result.recordset
    } catch (error) {
        return error
    }
}

//keşfet için cevaplanmış sorular
const selectUserAnsweredQuestions = async (userId) => {
    
    const query = `select ul.Id as UserLiked, uq.Id, u.Id as QuestionerId, u.Name as QuestionerName, u.Surname as QuestionerSurname, u.UserName as QuestionerUserName, uq.Question,
    u2.Id as UserId, u2.Name as UserName, u2.Surname as UserSurname, u2.UserName as UserUserName, uq.Answer, uq.AnsweredDate  ,count(l.Id) as Likes from UserQuestions uq
    inner join Users u on uq.QuestionerId = u.Id
    left join Likes l on l.QuestionId = uq.Id
	left join Likes ul on ul.QuestionId = uq.Id and ul.UserId = ${userId}
    inner join Users u2 on uq.UserId = u2.Id
    where uq.AnsweredDate is not null
    group by uq.Id, Question, u.Name, u2.Id, u.Id, u2.Name, u.Surname, u.UserName, u2.Surname, u2.UserName, uq.Answer, uq.AnsweredDate, ul.Id
    order by uq.AnsweredDate desc`

    try {
        const result = await sql.query(query)
        return result.recordset
    } catch (error) {
        return error
    }
}

// queryParam = "UserId"
const selectUserStyles = async (userId, queryParam) => {
    const query = `select * from UserStyles where ${queryParam} = ${userId}`
    try {
        const result = await sql.query(query)
        return result.recordset
    } catch (error) {
        return error
    }
}

const selectPages = async (pageSlug) => {
    const query = `select * from Pages where Slug = '${pageSlug}'` 
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

const selectLinksLastMinutes = async () => {
    // 1 dakika içerisinde eklenen link sayısı
    const query = `select count(*) as counter from Links where CreatedDate >= dateadd(minute, -1, getdate())`
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

const selectResetPassToken = async (token) => {
    const query = `select * from ResetPassTokens where Token = '${token}'`
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

const selectExistLike = async (questionId, userId) => {
    const query = `select count(*) as questionLike from Likes where QuestionId = '${questionId}' and userId = '${userId}'` 
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        console.log("error sql:", error)
        return error
    }
}

const selectQuestionLikes = async (questionId) => {
    const query = `select * from Likes where QuestionId = '${questionId}'` 
    try {
        const result = await sql.query(query)
        return result.recordset
    } catch (error) {
        return error
    }
}

const selectLikedQuestion = async (questionId) => {
    const query = `select * from UserQuestions where Id = '${questionId}'`
    try {
        const result = await sql.query(query)
        return result.recordset
    } catch (error) {
        return error
    }
}

const selectPopularUsers = async () => {
    const query = `SELECT UserId, u.Name, u.Surname, u.UserName, COUNT(*) AS QuestionCount
    FROM UserQuestions
    INNER JOIN Users u on u.Id = UserId
    WHERE AnsweredDate >= DATEADD(HOUR, -24, GETDATE())
    GROUP BY UserId, u.Name, u.Surname, u.UserName
    ORDER BY COUNT(*) DESC`
    try {
        const result = await sql.query(query)
        return result.recordset
    } catch (error) {
        return error
    }
}

module.exports = {selectPopularUsers, selectLikedQuestion, selectExistLike, selectQuestionLikes, selectResetPassToken, selectUser, selectUserLinks, selectPages, selectExistLinks, selectLinksLastMinutes, selectUserStyles, selectExistStyles, selectUserQuestions, selectExistQuestion, selectUserAnsweredQuestions}