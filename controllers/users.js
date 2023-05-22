const User = require("../models/user");


module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to yelpcamp");
            res.redirect("/yelpcamp");
        })

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

module.exports.login = (req, res) => {
    req.flash("success", "weclome back");
    const redirectUrl = res.locals.returnTo || "/yelpcamp";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/yelpcamp');
    });
};