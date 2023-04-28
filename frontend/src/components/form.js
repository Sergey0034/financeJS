import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";
import {Auth} from "../services/auth";

export class Form {
    constructor(page) {
        this.page = page;
        this.rememberMe = document.getElementById('rememberMe');
        this.rememberMeCheck = false;

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {
            const fields = this.fields;
            fields.unshift({
                name: 'fullName',
                id: 'fullName',
                element: null,
                regex: /^([А-Я][а-я]+\s?)([А-Я][а-я]+\s?)([А-Я][а-я]+\s?)?$/,
                valid: false,
            });
            fields.push({
                name: 'passwordRepeat',
                id: 'passwordRepeat',
                element: null,
                regex: /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            });
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this)
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }
    }


    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            element.style.boxShadow = '0 0 10px red'
            field.valid = false;
        } else {
            element.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    validateForm() {
        if (this.page === 'signup') {
            if ((this.fields.find(item => item.name === 'password').element.value) !== (this.fields.find(item => item.name === 'passwordRepeat').element.value)) {
                this.fields.find(item => item.name === 'passwordRepeat').element.style.borderColor = 'red';
                this.fields.find(item => item.name === 'passwordRepeat').element.style.boxShadow = '0 0 10px red'
                this.fields.valid = false;
            } else {
                this.fields.find(item => item.name === 'passwordRepeat').element.removeAttribute('style');
                this.fields.valid = true;
            }
        }


        const isValid = this.fields.every(item => item.valid);
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }

    async processForm() {
        if (this.validateForm()) {

            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;


            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', "POST", {
                        name: this.fields.find(item => item.name === 'fullName').element.value.split(' ')[1],
                        lastName: this.fields.find(item => item.name === 'fullName').element.value.split(' ')[0],
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'passwordRepeat').element.value,
                    });
                    if (result) {
                        if (!result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            if (this.page === 'login') {

                if (this.rememberMe.checked) {
                    this.rememberMeCheck = true;
                }
            }

            try {

                const result = await CustomHttp.request(config.host + '/login', "POST", {
                    email: email,
                    password: password,
                    rememberMe: this.rememberMeCheck
                });

                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user) {
                        throw new Error(result.message)
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,

                    })
                    location.href = '#/main';
                }
            } catch (error) {
                console.log(error);
                const email = this.fields.find(item => item.name === 'email').element;
                const password = this.fields.find(item => item.name === 'password').element;
                email.style.borderColor = 'red';
                email.style.boxShadow = '0 0 10px red';
                password.style.borderColor = 'red';
                password.style.boxShadow = '0 0 10px red';
            }
        }
    }
}