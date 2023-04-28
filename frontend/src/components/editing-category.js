import {UpdateProfile} from "../services/update-profile.js";
import {Main} from "./main";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {CategoriesCreate} from "./creating-category";
import {handlersButtons} from "../services/handlers-button";


export class CategoriesEditing extends CategoriesCreate {
    constructor(props) {
        super(props);

        handlersButtons.handlersButtonsSideBar();

        this.init();



    }


    async init() {

        // const balance = document.getElementById('user-balance');
        // balance.parentElement.style.display = 'none';

        this.nameCategories = document.getElementById('main-create-category-input');
        const categoryId = location.hash.split('=')[1];
        if (location.hash.split('?')[0] === '#/editing-income-category') {
            this.path = '/categories/income/';
        } else if (location.hash.split('?')[0] === '#/editing-expense-category') {
            this.path = '/categories/expense/';
        }
        try {
            const result = await CustomHttp.request(config.host + this.path + categoryId);
            if (result) {
                if (!result) {
                    throw new Error(result.message);
                }

                this.nameCategories.value = result.title;
            }
        } catch (error) {
            console.log(error);
        }

        this.handlers();
        this.userBalance = document.getElementById('user-balance');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('full-name-user');
        UpdateProfile.profileCheck(this.profileElement,this.profileFullNameElement);
        UpdateProfile.activeMenu();
        UpdateProfile.getUpdateBalanceUser(this.userBalance);
    }

    handlers() {
        this.buttonCancel.onclick = function () {
            if (location.hash.split('?')[0] === '#/editing-income-category') {
                location.href = '#/categories-income';
            } else if (location.hash.split('?')[0] === '#/editing-expense-category') {
                location.href = '#/categories-expense';
            }
        }

        const categoryId = location.hash.split('=')[1];


        this.buttonCreate.onclick = async function () {
            if (location.hash.split('?')[0] === '#/editing-income-category') {
                this.path = '/categories/income/';
                this.output = '#/categories-income';
            } else if (location.hash.split('?')[0] === '#/editing-expense-category') {
                this.path = '/categories/expense/';
                this.output = '#/categories-expense';
            }
            try {
                const result = await CustomHttp.request(config.host + this.path + categoryId, "PUT", {
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
        }
    }
}