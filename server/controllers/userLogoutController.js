
const userLogoutController = (req, res) => {
    res.clearCookie('sessionid')
    req.session.destroy((err) => {
      if (err) {
          console.log(err)
      }
      const interval = setInterval(() => {
        res.redirect('/')
        clearInterval(interval)
      }, 500)
    })
}

module.exports = userLogoutController