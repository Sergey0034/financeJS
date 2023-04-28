import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {Main} from "./main";
import {UpdateProfile} from "../services/update-profile";
import {handlersButtons} from "../services/handlers-button";


export class CreateIncomeExpense {
    constructor() {

        this.buttonCancel = document.getElementById('button-cancel');
        this.buttonCreate = document.getElementById('button-create');
        this.select = null;

        handlersButtons.handlersButtonsSideBar();
        this.init();

    }

    async init() {

        // const balance = document.getElementById('user-balance');
        // balance.parentElement.style.display = 'none';

        const typeButtonClick = location.hash.split('=')[1];
        const optionIncome = document.getElementById('income-option');
        const optionExpense = document.getElementById('expense-option');
        const type = document.getElementById('type');

        if (typeButtonClick === 'income') {
            optionIncome.selected = 'Доход';
            // optionIncome.parentElement.setAttribute('disabled', 'disabled')

            try {
                const result = await CustomHttp.request(config.host + '/categories/income');
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    this.select = result;
                    this.getSelect(this.select);

                }
            } catch (error) {
                console.log(error);
            }

        } else if (typeButtonClick === 'expense') {
            optionExpense.selected = 'Расход';
            // optionExpense.parentElement.setAttribute('disabled', 'disabled')
            try {
                const result = await CustomHttp.request(config.host + '/categories/expense');
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    this.select = result;
                    this.getSelect(this.select);
                }
            } catch (error) {
                console.log(error);
            }
        }
        const that = this;

        type.onchange = async function () {

            if (type.value === 'income') {

                // optionIncome.parentElement.setAttribute('disabled', 'disabled')

                try {

                    const result = await CustomHttp.request(config.host + '/categories/income');
                    if (result) {
                        if (!result) {
                            throw new Error(result.message);
                        }

                        this.select = result;
                        that.getSelect(this.select);

                    }
                } catch (error) {
                    console.log(error);
                }

            } else if (optionExpense.value === 'expense') {

                // optionExpense.parentElement.setAttribute('disabled', 'disabled')
                try {
                    const result = await CustomHttp.request(config.host + '/categories/expense');
                    if (result) {
                        if (!result) {
                            throw new Error(result.message);
                        }

                        this.select = result;
                        that.getSelect(this.select);

                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        await this.handlers();
        this.userBalance = document.getElementById('user-balance');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('full-name-user');
        UpdateProfile.profileCheck(this.profileElement, this.profileFullNameElement);
        UpdateProfile.activeMenu();
        await UpdateProfile.getUpdateBalanceUser(this.userBalance);
    }

    getSelect(select) {
        const selectElement = document.getElementById('category-select');
        selectElement.innerText = '';

        select.forEach(item => {
            const option = document.createElement('option');
            option.innerText = item.title;
            option.setAttribute('value', item.title)

            selectElement.appendChild(option);
        })
    }

    handlers() {

        this.buttonCancel.onclick = function () {
            location.href = '#/table-expense-income';
        }

        const id = location.hash.split('=')[1];

        this.buttonCreate.onclick = async function () {

            const typeCategory = location.hash.split('=')[1];
            const type = document.getElementById('type');
            const path = null;
            if (type.value === 'income') {
                this.path = '/categories/income';
            } else if (type.value === 'expense') {
                this.path = '/categories/expense';
            }
            try {
                const category = document.getElementById('category-select').value;

                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    const element = result.find(item => {
                        return category === item.title
                    })
                    this.category_id = element.id;
                }
            } catch (error) {
                console.log(error);
            }

            const typeButtonClick = location.hash.split('=')[1];
            this.amount = document.getElementById('amount');
            this.date = document.getElementById('date').value;
            this.comment = document.getElementById('comment');
            if (!this.comment.value) {
                this.comment.value = ' ';
            }
            try {
                const result = await CustomHttp.request(config.host + '/operations/', "POST", {
                    type: type.value,
                    amount: parseInt(this.amount.value),
                    date: this.date,
                    comment: this.comment.value,
                    category_id: this.category_id,


                });
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    location.href = '#/table-expense-income';

                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}