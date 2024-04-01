const calculateTimeElapsed = (currentDate, postDateObj) => {

    const timeDifference = currentDate.getTime() - postDateObj.getTime() + 3600000 * 3
    const seconds = Math.floor(timeDifference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) {
        return `${years} yıl önce`
    } else if (months > 0) {
        return `${months} ay önce`
    } else if (days > 0) {
        return `${days} gün önce`
    } else if (hours > 0) {
        return `${hours} saat önce`
    } else if (minutes > 0) {
        return `${minutes} dakika önce`
    } else {
        return `${seconds} saniye önce`
    }
}

module.exports = calculateTimeElapsed