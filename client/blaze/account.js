
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

// Apart from USERNAME_AND_EMAIL, there’s also the USERNAME_AND_OPTIONAL_EMAIL, USERNAME_ONLY and EMAIL_ONLY options. EMAIL_ONLY is the default.


// The accounts-ui package provides the login form, as well as calling methods to register/login our users. But for production applications, you might want to create your own UI and set your own account management logic. To do that, you must call the Accounts API and Passwords API yourself. For example, you’d manually call Accounts.createUser() to create the user, and customize the creation logic with Accounts.onCreateUser()