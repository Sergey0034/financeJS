import {UpdateProfile} from "../services/update-profile.js";
import {Main} from "./main";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {handlersButtons} from "../services/handlers-button";


export class Categories {
    constructor() {

        this.categories = null;

        this.init();
        handlersButtons.handlersButtonsSideBar();

    }

    async init() {
        if (location.hash === '#/categories-income') {
            this.path = '/categories/income';
        } else if (location.hash === '#/categories-expense') {
            this.path = '/categories/expense';
        }
        try {
            const result = await CustomHttp.request(config.host +  this.path);
            if (result) {
                if (!result) {
                    throw new Error(result.message);
                }

                this.categories = result;
                this.categoriesGet();
                this.handlers();
            }
        } catch (error) {
            console.log(error);
        }
        this.userBalance = document.getElementById('user-balance');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('full-name-user');
        UpdateProfile.profileCheck(this.profileElement,this.profileFullNameElement);
        UpdateProfile.getUpdateBalanceUser(this.userBalance);
        UpdateProfile.activeMenu();
    }

    categoriesGet() {

        const itemsCategory = document.getElementById('main-content-items');

        this.categories.forEach(item => {

            const itemCategory = document.createElement('div');
            itemCategory.className = 'item';

            const itemCategoryTitle = document.createElement('h2');
            itemCategoryTitle.className = 'item-title';
            itemCategoryTitle.innerText = item.title;


            const itemCategoryButtons = document.createElement('div');
            itemCategoryButtons.className = 'item-buttons';

            const itemCategoryButtonEdit = document.createElement('button');
            itemCategoryButtonEdit.setAttribute('type', 'button');
            itemCategoryButtonEdit.className = 'item-button button-blue button-edit';
            itemCategoryButtonEdit.innerText = 'Редактировать';
            itemCategoryButtonEdit.setAttribute('id', item.id);

            const itemCategoryButtonDelete = document.createElement('button');
            itemCategoryButtonDelete.setAttribute('type', 'button');
            itemCategoryButtonDelete.className = 'item-button button-red button-delete';
            itemCategoryButtonDelete.innerText = 'Удалить';
            itemCategoryButtonDelete.setAttribute('id', item.id);

            itemCategoryButtons.appendChild(itemCategoryButtonEdit);
            itemCategoryButtons.appendChild(itemCategoryButtonDelete);

            itemCategory.appendChild(itemCategoryTitle);
            itemCategory.appendChild(itemCategoryButtons);

            itemsCategory.appendChild(itemCategory);
        })

        const itemCreate = document.createElement('div');
        itemCreate.className = 'item create-item-card';
        itemCreate.setAttribute('id', 'createItem')

        const itemCreateContent = document.createElement('div');
        itemCreateContent.className = 'create-item';
        itemCreateContent.innerText = '+';


        itemCreate.appendChild(itemCreateContent);
        itemsCategory.appendChild(itemCreate);
    }

    handlers() {
        const buttonDelete = document.getElementsByClassName('button-delete');
        const deleteBlock = document.getElementById('popup-delete-block');
        const deletePopup = document.getElementById('popup-delete');
        const buttonYes = document.getElementById('button-yes');
        const buttonNo = document.getElementById('button-no');
        const buttonEdit = document.getElementsByClassName('button-edit');
        const createCategory = document.getElementById('createItem')
        let id = null;

        for (let i = 0; i < buttonDelete.length; i++) {
            buttonDelete[i].onclick = function () {
                deleteBlock.style.display = 'block';
                deletePopup.style.display = 'block';
                id = buttonDelete[i].id;
            }
        }

        buttonNo.onclick = function () {
            deleteBlock.style.display = 'none';
            deletePopup.style.display = 'none';
        }

        buttonYes.onclick = async function () {
            if (location.hash === '#/categories-income') {
                this.path = '/categories/income/';
                this.output = '#/categories-income';
            } else if (location.hash === '#/categories-expense') {
                this.path = '/categories/expense/';
                this.output = '#/categories-expense';
            }

            try {
                const result = await CustomHttp.request(config.host + this.path + id, "DELETE");
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

        for (let i = 0; i < buttonEdit.length; i++) {
            buttonEdit[i].onclick = function () {
                if (location.hash === '#/categories-income') {
                    this.editCategoriesId = '#/editing-income-category?id=';
                } else if (location.hash === '#/categories-expense') {
                    this.editCategoriesId = '#/editing-expense-category?id=';
                }
                id = buttonDelete[i].id;

                location.href = this.editCategoriesId + id;
            }
        }

        createCategory.onclick = function () {
            if (location.hash === '#/categories-income') {
                location.href = '#/creating-income-category';
            } else if (location.hash === '#/categories-expense') {
                location.href = '#/creating-expense-category';
            }
        }
    }
}