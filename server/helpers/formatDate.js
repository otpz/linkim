
const formatDate = (date) => {
    const newDate = new Date(date)
    const options = {year: 'numeric', month: 'long'}
    return new Intl.DateTimeFormat('tr-TR', options).format(newDate);
}

module.exports = formatDate