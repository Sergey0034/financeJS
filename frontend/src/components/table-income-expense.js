import {Main} from "./main";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {UpdateProfile} from "../services/update-profile";
import {handlersButtons} from "../services/handlers-button";


export class TableIncomeExpense {
    constructor() {

        this.operations = null;
        this.buttonFilters();

        handlersButtons.handlersButtonsSideBar();
        this.init();

    }

    async init() {

        this.active = document.getElementById('today');
        this.active.classList.add('active-buttons');

        let today = new Date().toLocaleDateString('en-ca');


        this.path = '/operations?period=interval&dateFrom=' + today + '&dateTo=' + today;
        await this.buildTable();

        this.userBalance = document.getElementById('user-balance');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('full-name-user');

        UpdateProfile.profileCheck(this.profileElement, this.profileFullNameElement);
        UpdateProfile.activeMenu();
        await UpdateProfile.getUpdateBalanceUser(this.userBalance);

    }

    async buildTable() {
        try {
            const result = await CustomHttp.request(config.host + this.path);
            if (result) {
                if (!result) {
                    throw new Error(result.message);
                }

                this.operations = result;
                this.operationsGet();
            }
        } catch (error) {
            console.log(error);
        }
    }

    operationsGet() {
        const table = document.getElementById('table');

        let count = 1;

        // this.operations.sort(function (a, b) {
        //     return a.id > b.id ? 1 : -1;
        // })

        this.operations.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'tr-element'

            const id = document.createElement('td');
            id.className = 'id';
            id.innerText = count++;

            const type = document.createElement('td');
            type.className = 'type';
            const itemType = item.type;
            if (itemType === 'income') {
                type.style.color = 'green';
                type.innerText = 'доход';
            } else if (itemType === 'expense') {
                type.style.color = 'red';
                type.innerText = 'расход';
            }

            const category = document.createElement('td');
            category.className = 'category';
            if (item.category) {
                category.innerText = item.category;
            } else {
                category.innerText = 'удалена пользователем';
            }


            const amount = document.createElement('td');
            amount.className = 'amount';
            amount.innerText = item.amount + '$';

            const date = document.createElement('td');
            date.className = 'date';
            const dateFormat = item.date.split('-');
            const dateFormatNew = `${dateFormat[2]}.${dateFormat[1]}.${dateFormat[0]}`;
            date.innerText = dateFormatNew;

            const comment = document.createElement('td');
            comment.className = 'comment';
            comment.innerText = item.comment;

            const editing = document.createElement('td');
            editing.className = 'editing';
            editing.innerHTML = '<svg class="button-delete" width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '                            <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z" fill="black"/>\n' +
                '                            <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z" fill="black"/>\n' +
                '                            <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z" fill="black"/>\n' +
                '                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z" fill="black"/>\n' +
                '                        </svg>\n' +
                '                        <svg class="button-edit" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '                            <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z" fill="black"/>\n' +
                '                        </svg>'
            editing.setAttribute('id', item.id)

            tr.appendChild(id);
            tr.appendChild(type);
            tr.appendChild(category);
            tr.appendChild(amount);
            tr.appendChild(date);
            tr.appendChild(comment);
            tr.appendChild(editing);

            table.appendChild(tr);

        })
        this.handlers();
    }

    async operationClear() {
        let element = document.getElementsByClassName('tr-element');
        for (let i = 0; i < element.length; i++) {
            element[i].innerHTML = '';
        }
    }

    handlers() {

        const buttonDelete = document.getElementsByClassName('button-delete');
        const deleteBlock = document.getElementById('popup-delete-block');
        const deletePopup = document.getElementById('popup-delete');
        const buttonYes = document.getElementById('button-yes');
        const buttonNo = document.getElementById('button-no');
        const buttonEdit = document.getElementsByClassName('button-edit');
        const createIncome = document.getElementById('create-income');
        const createExpense = document.getElementById('create-expense');
        let id = null;

        for (let i = 0; i < buttonDelete.length; i++) {
            buttonDelete[i].onclick = function () {
                deleteBlock.style.display = 'block';
                deletePopup.style.display = 'block';
                id = buttonDelete[i].parentElement.id;
            }
        }

        buttonNo.onclick = function () {
            deleteBlock.style.display = 'none';
            deletePopup.style.display = 'none';
        }

        const that = this;
        buttonYes.onclick = async function () {

            try {
                const result = await CustomHttp.request(config.host + '/operations/' + id, "DELETE");
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

        for (let i = 0; i < buttonEdit.length; i++) {
            buttonEdit[i].onclick = function () {
                id = buttonDelete[i].parentElement.id;

                location.href = '#/editing-income-expense?id=' + id;

            }
        }

        createIncome.onclick = function () {
            location.href = '#/creating-income-expense?create-type=income';
        }

        createExpense.onclick = function () {
            location.href = '#/creating-income-expense?create-type=expense';
        }

    }

    buttonFilters() {
        const that = this;

        const todayFilter = document.getElementById('today');
        todayFilter.addEventListener('click', async function () {

            that.operationClear();
            this.active = document.getElementById('today');

            const items = document.getElementsByClassName('period-item');
            for (let i = 0; i < items.length; i++) {
                if (items[i].classList.contains('active-buttons')) {
                    items[i].classList.remove('active-buttons')
                }
            }


            this.active.classList.add('active-buttons');
            let today = new Date().toLocaleDateString('en-ca');

            this.path = '/operations?period=interval&dateFrom=' + today + '&dateTo=' + today;
            try {
                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    that.operations = result;

                    that.operationsGet();

                }
            } catch (error) {
                console.log(error);
            }
        });

        const weekFilter = document.getElementById('week');
        weekFilter.addEventListener('click', async function () {

            await that.operationClear();
            this.active = document.getElementById('week');

            const items = document.getElementsByClassName('period-item');
            for (let i = 0; i < items.length; i++) {
                if (items[i].classList.contains('active-buttons')) {
                    items[i].classList.remove('active-buttons')
                }
            }

            this.active.classList.add('active-buttons');
            const dateTo = new Date().toLocaleDateString('en-ca');

            const dateFrom = new Date(new Date().getTime() - (3600 * 168 * 1000)).toLocaleDateString('en-ca');

            this.path = '/operations?period=interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo;


            try {
                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    that.operations = result;

                    that.operationsGet();
                }
            } catch (error) {
                console.log(error);
            }
        });

        const monthFilter = document.getElementById('month');
        monthFilter.addEventListener('click', async function () {
            await that.operationClear();
            this.active = document.getElementById('month');

            const items = document.getElementsByClassName('period-item');
            for (let i = 0; i < items.length; i++) {
                if (items[i].classList.contains('active-buttons')) {
                    items[i].classList.remove('active-buttons')
                }
            }

            this.active.classList.add('active-buttons');

            const dateTo = new Date().toLocaleDateString('en-ca');

            const date = new Date();

            const changeDate = date.getMonth() - 1;

            date.setMonth(changeDate);

            const dateFrom = date.toLocaleDateString('en-ca');

            this.path = '/operations?period=interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo;

            try {
                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    that.operations = result;
                    that.operationsGet();

                }
            } catch (error) {
                console.log(error);
            }
        });

        const yearFilter = document.getElementById('year');
        yearFilter.addEventListener('click', async function () {
            that.operationClear();
            this.active = document.getElementById('year');

            const items = document.getElementsByClassName('period-item');
            for (let i = 0; i < items.length; i++) {
                if (items[i].classList.contains('active-buttons')) {
                    items[i].classList.remove('active-buttons')
                }
            }


            this.active.classList.add('active-buttons');

            const dateTo = new Date().toLocaleDateString('en-ca');

            const date = new Date();

            const changeDate = date.getFullYear() - 1;

            date.setFullYear(changeDate);

            const dateFrom = date.toLocaleDateString('en-ca');

            this.path = '/operations?period=interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo;

            try {
                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    that.operations = result;

                    that.operationsGet();

                }
            } catch (error) {
                console.log(error);
            }
        });

        const allFilter = document.getElementById('all-date');
        allFilter.addEventListener('click', async function () {
            that.operationClear();
            this.active = document.getElementById('all-date');

            const items = document.getElementsByClassName('period-item');
            for (let i = 0; i < items.length; i++) {
                if (items[i].classList.contains('active-buttons')) {
                    items[i].classList.remove('active-buttons')
                }
            }

            this.active.classList.add('active-buttons');
            this.path = '/operations?period=all';

            try {
                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    that.operations = result;

                    that.operationsGet();

                }
            } catch (error) {
                console.log(error);
            }
        });

        let dateFrom = document.getElementById('datepicker-from');
        let dateTo = document.getElementById('datepicker-to');
        const items = document.getElementsByClassName('period-item');

        const intervalFilter = document.getElementById('interval');
        intervalFilter.addEventListener('click', async function (e) {

            that.operationClear();

            for (let i = 0; i < items.length; i++) {
                if (items[i].classList.contains('active-buttons')) {
                    items[i].classList.remove('active-buttons')
                }
            }

            intervalFilter.classList.add('active-buttons');

            let dateFrom = document.getElementById('datepicker-from');
            let dateTo = document.getElementById('datepicker-to');

            this.path = '/operations?period=interval&dateFrom=' + (dateFrom.value ? dateFrom.value : dateFrom.value = new Date().toLocaleDateString('en-ca')) + '&dateTo=' + (dateTo.value ? dateTo.value : dateTo.value = new Date().toLocaleDateString('en-ca'));
            try {
                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    that.operations = result;

                    that.operationsGet();

                }
            } catch (error) {
                console.log(error);
            }
        });

        dateFrom.onchange = async function () {
            for (let i = 0; i < items.length; i++) {
                if (items[i].classList.contains('active-buttons')) {
                    items[i].classList.remove('active-buttons')
                }
            }

            intervalFilter.classList.add('active-buttons');

            that.operationClear();

            let dateFrom = document.getElementById('datepicker-from');
            let dateTo = document.getElementById('datepicker-to');

            this.path = '/operations?period=interval&dateFrom=' + (dateFrom.value ? dateFrom.value : dateFrom.value = new Date().toLocaleDateString('en-ca')) + '&dateTo=' + (dateTo.value ? dateTo.value : dateTo.value = new Date().toLocaleDateString('en-ca'));
            try {
                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    that.operations = result;

                    that.operationsGet();

                }
            } catch (error) {
                console.log(error);
            }
        }

        dateTo.onchange = async function () {

            const items = document.getElementsByClassName('period-item');
            for (let i = 0; i < items.length; i++) {
                if (items[i].classList.contains('active-buttons')) {
                    items[i].classList.remove('active-buttons')
                }
            }

            intervalFilter.classList.add('active-buttons');

            that.operationClear();

            let dateFrom = document.getElementById('datepicker-from');
            let dateTo = document.getElementById('datepicker-to');

            this.path = '/operations?period=interval&dateFrom=' + (dateFrom.value ? dateFrom.value : dateFrom.value = new Date().toLocaleDateString('en-ca')) + '&dateTo=' + (dateTo.value ? dateTo.value : dateTo.value = new Date().toLocaleDateString('en-ca'));
            try {
                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    that.operations = result;

                    that.operationsGet();

                }
            } catch (error) {
                console.log(error);
            }
        }


        this.handlers()
    }
}