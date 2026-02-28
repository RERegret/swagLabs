## Swag Labs Playwright testing
In this project I'm practising Playwright techniques I've learned, aiming to cover as many web-site functions as possible.
# Repo structuring
The project first starts out with seperate tests that are not connected via page-object-models, into which I'm going to refactor every test.

While there are specific html attributes on many components which I can use to freely select said elements, I plan on using them only as a backup, to practise other selector methods.

There are users, which simulate broken UI-s with elements going out of places, in these scenarios I'm validating wether the user can log in, wether some elements are loaded at all, and then using visual testing to validate the differences.