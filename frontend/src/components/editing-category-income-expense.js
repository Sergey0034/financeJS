import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {Main} from "./main";
import {handlersButtons} from "../services/handlers-button";
import {UpdateProfile} from "../services/update-profile";


export class CategoriesCommonEditing {
    constructor() {
        this.userBalance = document.getElementById('user-balance');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('full-name-user');

        UpdateProfile.profileCheck(this.profileElement,this.profileFullNameElement);
        this.operation = null;
        this.buttonCancel = document.getElementById('button-cancel');
        this.buttonSave = document.getElementById('button-save');

        this.init();
        handlersButtons.handlersButtonsSideBar();
        UpdateProfile.activeMenu();
        UpdateProfile.getUpdateBalanceUser(this.userBalance);
    }


    async init() {

        // const balance = document.getElementById('user-balance');
        // balance.parentElement.style.display = 'none';

        const id = location.hash.split('=')[1];
        try {
            const result = await CustomHttp.request(config.host + '/operations/' + id);
            if (result) {
                if (!result) {
                    throw new Error(result.message);
                }

                this.operation = result;
                this.getDataOperation();
            }
        } catch (error) {
            console.log(error);
        }

        this.handlers();
    }

    async getDataOperation() {
        this.type = document.getElementById('type');
        const optionIncome = document.getElementById('income-option');
        const optionExpense = document.getElementById('expense-option');
        this.category = document.getElementById('category-select');
        this.amount = document.getElementById('amount');
        this.date = document.getElementById('date');
        this.comment = document.getElementById('comment');

        const itemType = this.operation.type;
        if (itemType === 'income') {
            optionIncome.selected = 'Доход';
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
        } else if (itemType === 'expense') {
            optionExpense.selected = 'Расход';
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


        this.category.value = this.operation.category;

        this.amount.value = this.operation.amount;
        this.date.value = this.operation.date;
        if (this.operation.comment) {
            this.comment.value = this.operation.comment;
        }

    }

    getSelect(select) {
        const selectElement = document.getElementById('category-select');
        selectElement.innerText = '';

        select.forEach(item =>{
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

        this.buttonSave.onclick = async function () {

            const category_id = null;

            this.typeOfCategory = null;
            this.path = null;
            const elementType = document.getElementById('type').value;

            if (elementType === 'income') {
                this.typeOfCategory = 'income';
                this.path = '/categories/income';
            } else if (elementType === 'expense') {
                this.typeOfCategory = 'expense';
                this.path = '/categories/expense';
            }



            try {
                const category = document.getElementById('category-select');

                const result = await CustomHttp.request(config.host +  this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    const element = result.find(item => {
                        return category.value === item.title
                    })

                    this.category_id = element.id;


                }
            } catch (error) {
                console.log(error);
            }

            this.amount = document.getElementById('amount');
            this.date = document.getElementById('date');
            this.comment = document.getElementById('comment');
            if (!this.comment.value) {
                this.comment.value = ' ';
            }
            try {
                const result = await CustomHttp.request(config.host + '/operations/' + id, "PUT", {
                    type: this.typeOfCategory,
                    amount: parseInt(this.amount.value),
                    date:  this.date.value,
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