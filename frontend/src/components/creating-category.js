import {UpdateProfile} from "../services/update-profile.js";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {handlersButtons} from "../services/handlers-button";


export class CategoriesCreate {
    constructor() {

        // const balance = document.getElementById('user-balance');
        // balance.parentElement.style.display = 'none';


        handlersButtons.handlersButtonsSideBar();
        this.init()
    }

    async init() {
        this.userBalance = document.getElementById('user-balance');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('full-name-user');
        this.buttonCancel = document.getElementById('button-cancel');
        this.buttonCreate = document.getElementById('button-create');

        UpdateProfile.activeMenu();
        UpdateProfile.profileCheck(this.profileElement, this.profileFullNameElement);
        UpdateProfile.getUpdateBalanceUser(this.userBalance);
        this.handlers();
    }


    handlers() {
        this.buttonCancel.onclick = function () {
            if (location.hash === '#/creating-income-category') {
                location.href = '#/categories-income';
            } else if (location.hash === '#/creating-expense-category') {
                location.href = '#/categories-expense';
            }
        }


        this.buttonCreate.onclick = async function () {
            if (document.getElementById('main-create-category-input').value) {
                if (location.hash === '#/creating-income-category') {
                    this.path = '/categories/income';
                    this.output = '#/categories-income';
                } else if (location.hash === '#/creating-expense-category') {
                    this.path = '/categories/expense';
                    this.output = '#/categories-expense';
                }

                try {
                    const result = await CustomHttp.request(config.host + this.path, "POST", {
                        title: document.getElementById('main-create-category-input').value
                    });
                    if (result) {
                        if (!result) {
                            throw new Error(result.message);
                        }

                        location.href = this.output;

                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                alert('Укажите название категории');
            }
        }
    }
}