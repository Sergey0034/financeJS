import {Form} from "./components/form.js";
import {Main} from "./components/main.js";
import {Auth} from "./services/auth.js";
import {Categories} from "./components/categories.js";
import {CategoriesEditing} from "./components/editing-category";
import {CategoriesCreate} from "./components/creating-category";
import {TableIncomeExpense} from "./components/table-income-expense";
import {CategoriesCommonEditing} from "./components/editing-category-income-expense";
import {CreateIncomeExpense} from "./components/creating-category-income-expense";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Router {

    constructor() {
        this.contentElement = document.getElementById('content');
        this.titleElement = document.getElementById('page-title');

        this.routes = [
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: [
                    'styles/common.css',
                    'styles/form.css'
                ],
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: [
                    'styles/common.css',
                    'styles/form.css'
                ],
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                styles: [
                    'styles/common.css',
                    'styles/common-main.css',
                    'styles/main.css',
                    'styles/table-expense-income.css',
                ],
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/categories-income',
                title: 'Доходы',
                template: 'templates/income/categories-income.html',
                styles: [
                    'styles/common.css',
                    'styles/common-main.css',
                    'styles/categories-income.css',

                ],
                load: () => {
                    new Categories();
                }
            },
            {
                route: '#/categories-expense',
                title: 'Расходы',
                template: 'templates/expense/categories-expense.html',
                styles: [
                    'styles/common.css',
                    'styles/common-main.css',
                    'styles/categories-income.css',

                ],
                load: () => {
                    new Categories();
                }
            },
            {
                route: '#/editing-income-category',
                title: 'Редактирование категории доходов',
                template: 'templates/income/editing-income-category.html',
                styles: [
                    'styles/common.css',
                    'styles/common-main.css',
                    'styles/creating-category.css',

                ],
                load: () => {
                    new CategoriesEditing();
                }
            },
            {
                route: '#/creating-income-category',
                title: 'Создание категории доходов',
                template: 'templates/income/creating-income-category.html',
                styles: [
                    'styles/common.css',
                    'styles/common-main.css',
                    'styles/creating-category.css',

                ],
                load: () => {
                    new CategoriesCreate();
                }
            },
            {
                route: '#/editing-expense-category',
                title: 'Редактирование категории расходов',
                template: 'templates/expense/editing-expense-category.html',
                styles: [
                    'styles/common.css',
                    'styles/common-main.css',
                    'styles/creating-category.css',

                ],
                load: () => {
                    new CategoriesEditing();
                }
            },
            {
                route: '#/creating-expense-category',
                title: 'Создание категории расходов',
                template: 'templates/expense/creating-expense-category.html',
                styles: [
                    'styles/common.css',
                    'styles/common-main.css',
                    'styles/creating-category.css',

                ],
                load: () => {
                    new CategoriesCreate();
                }
            },
            {
                route: '#/table-expense-income',
                title: 'Доходы и расходы',
                template: 'templates/table-expense-income.html',
                styles: [
                    'styles/common.css',
                    'styles/common-main.css',
                    'styles/table-expense-income.css',

                ],
                load: () => {
                    new TableIncomeExpense();
                }
            },
            {
                route: '#/editing-income-expense',
                title: 'Редактирование дохода/расхода',
                template: 'templates/editing-income-expense.html',
                styles: [
                    'styles/common.css',
                    'styles/common-main.css',
                    'styles/table-expense-income.css',
                    'styles/creating-income-expense.css',
                ],
                load: () => {
                    new CategoriesCommonEditing();
                }
            },
            {
                route: '#/creating-income-expense',
                title: 'Создание дохода/расхода',
                template: 'templates/creating-income-expense.html',
                styles: [
                    'styles/common.css',
                    'styles/common-main.css',
                    'styles/creating-income-expense.css',
                ],
                load: () => {
                    new CreateIncomeExpense();
                }
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());

        const head = document.getElementsByTagName('head')[0];
        newRoute.styles.forEach(item => {
            const stylesElement = document.createElement('link');
            stylesElement.setAttribute('rel', 'stylesheet');
            stylesElement.setAttribute('href', item);
            head.appendChild(stylesElement);
        })
        this.titleElement.innerText = newRoute.title;

        newRoute.load();
    }
}