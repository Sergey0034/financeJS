import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {Auth} from "../services/auth";
import {UpdateProfile} from "../services/update-profile.js";
import Chart from 'chart.js/auto';
import {handlersButtons} from "../services/handlers-button";

export class Main {

    constructor() {

        this.buttonFilterGet();
        this.init();
        handlersButtons.handlersButtonsSideBar();

    }

    async init() {

        const that = this;
        this.active = document.getElementById('today');
        this.active.classList.add('active-buttons');

        let today = new Date().toLocaleDateString('en-ca');


        this.path = '/operations?period=interval&dateFrom=' + today + '&dateTo=' + today;

        try {
            const result = await CustomHttp.request(config.host + this.path);
            if (result) {
                if (!result) {
                    throw new Error(result.message);
                }

                this.operations = result;
                that.chartIncome(this.operations);
                that.chartExpense(this.operations);
            }
        } catch (error) {
            console.log(error);
        }

        this.userBalance = document.getElementById('user-balance');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('full-name-user');


        UpdateProfile.profileCheck(this.profileElement, this.profileFullNameElement);
        UpdateProfile.activeMenu();
        UpdateProfile.getUpdateBalanceUser(this.userBalance);
    }

    buttonFilterGet() {
        const that = this;

        const todayFilter = document.getElementById('today');
        todayFilter.addEventListener('click', async function () {

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

                    this.operations = result;
                    that.chartIncome(this.operations);
                    that.chartExpense(this.operations);


                }
            } catch (error) {
                console.log(error);
            }
        });

        const weekFilter = document.getElementById('week');
        weekFilter.addEventListener('click', async function () {

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
                    this.operations = result;
                    that.chartIncome(this.operations);
                    that.chartExpense(this.operations);
                }
            } catch (error) {
                console.log(error);
            }
        });

        const monthFilter = document.getElementById('month');
        monthFilter.addEventListener('click', async function () {

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

                    this.operations = result;
                    that.chartIncome(this.operations);
                    that.chartExpense(this.operations);

                }
            } catch (error) {
                console.log(error);
            }
        });

        const yearFilter = document.getElementById('year');
        yearFilter.addEventListener('click', async function () {

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

                    this.operations = result;
                    that.chartIncome(this.operations);
                    that.chartExpense(this.operations);

                }
            } catch (error) {
                console.log(error);
            }
        });

        const allFilter = document.getElementById('all-date');
        allFilter.addEventListener('click', async function () {

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

                    this.operations = result;
                    that.chartIncome(this.operations);
                    that.chartExpense(this.operations);

                }
            } catch (error) {
                console.log(error);
            }
        });

        // const intervalFilter = document.getElementById('interval');
        // intervalFilter.addEventListener('click', async function () {
        //
        //     this.active = document.getElementById('interval');
        //
        //     const items = document.getElementsByClassName('period-item');
        //     for (let i = 0; i < items.length; i++) {
        //         if (items[i].classList.contains('active-buttons')) {
        //             items[i].classList.remove('active-buttons')
        //         }
        //     }
        //
        //     this.active.classList.add('active-buttons');
        //
        //
        //     const dateTo = document.getElementById('datepicker-to').value;
        //
        //     const dateFrom = document.getElementById('datepicker-from').value;
        //
        //     this.path = '/operations?period=interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
        //
        //     try {
        //         const result = await CustomHttp.request(config.host + this.path);
        //         if (result) {
        //             if (!result) {
        //                 throw new Error(result.message);
        //             }
        //
        //             this.operations = result;
        //             that.chartIncome(this.operations);
        //             that.chartExpense(this.operations);
        //
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // });


        let dateFrom = document.getElementById('datepicker-from');
        let dateTo = document.getElementById('datepicker-to');
        const items = document.getElementsByClassName('period-item');

        const intervalFilter = document.getElementById('interval');
        intervalFilter.addEventListener('click', async function (e) {

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

                    this.operations = result;

                    that.chartIncome(this.operations);
                    that.chartExpense(this.operations);

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

            let dateFrom = document.getElementById('datepicker-from');
            let dateTo = document.getElementById('datepicker-to');

            this.path = '/operations?period=interval&dateFrom=' + (dateFrom.value ? dateFrom.value : dateFrom.value = new Date().toLocaleDateString('en-ca')) + '&dateTo=' + (dateTo.value ? dateTo.value : dateTo.value = new Date().toLocaleDateString('en-ca'));
            try {
                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    this.operations = result;

                    that.chartIncome(this.operations);
                    that.chartExpense(this.operations);

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

            let dateFrom = document.getElementById('datepicker-from');
            let dateTo = document.getElementById('datepicker-to');

            this.path = '/operations?period=interval&dateFrom=' + (dateFrom.value ? dateFrom.value : dateFrom.value = new Date().toLocaleDateString('en-ca')) + '&dateTo=' + (dateTo.value ? dateTo.value : dateTo.value = new Date().toLocaleDateString('en-ca'));
            try {
                const result = await CustomHttp.request(config.host + this.path);
                if (result) {
                    if (!result) {
                        throw new Error(result.message);
                    }

                    this.operations = result;

                    that.chartIncome(this.operations);
                    that.chartExpense(this.operations);

                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    chartIncome(operations) {

        const oldChartIncome = document.getElementById('myChart-income');
        const lineElement = document.getElementById('line');
        if (oldChartIncome) {
            oldChartIncome.parentElement.remove();
            if (lineElement) {
                lineElement.remove()
            }
        }

        const income = [];
        operations.forEach(operations => {
            if (operations.type === 'income') {
                income.push(operations);
            }
        });

        if (income.length) {
            const chartBlock = document.getElementById('chart-block');

            const chartIncome = document.createElement('div');
            chartIncome.className = 'chart chart-income';

            const canvasIncome = document.createElement('canvas');
            canvasIncome.setAttribute('id', 'myChart-income');

            const line = document.createElement('div');
            line.setAttribute('id', 'line');

            chartIncome.appendChild(canvasIncome);
            chartBlock.appendChild(chartIncome);
            chartBlock.appendChild(line);
        } else if (!income.length && lineElement) {
            lineElement.remove()
        }


        if (income.length) {

            const ctx = document.getElementById('myChart-income');

            const labels = [];
            income.forEach(income => {
                if (!labels.includes(income.category)) {
                    labels.push(income.category);
                }
            })

            const amount = [];

            for (let i = 0; i < labels.length; i++) {
                let sum = 0;
                for (let j = 0; j < income.length; j++) {

                    if (labels[i] === income[j].category) {

                        sum += income[j].amount;
                    }

                }
                amount.push(sum);
            }


            let randomColors = function () {
                return '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase()
            }

            let colors = [];
            for (let i = 0; i < labels.length; i++) {
                colors.push(randomColors());
            }


            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Доходы',
                        data: amount,
                        backgroundColor: colors,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Доходы'
                        }
                    }
                },
            });
        } else {
            return;
        }


    }

    chartExpense(operations) {

        const oldChartExpense = document.getElementById('myChart-expense');
        const lineElement = document.getElementById('line');

        if (oldChartExpense) {
            oldChartExpense.parentElement.remove();
        }

        const expense = [];
        operations.forEach(operations => {
            if (operations.type === 'expense') {
                expense.push(operations);
            }
        });

        if (expense.length) {
            const chartBlock = document.getElementById('chart-block');

            const chartExpense = document.createElement('div');
            chartExpense.className = 'chart chart-expense';

            const canvasExpense = document.createElement('canvas');
            canvasExpense.setAttribute('id', 'myChart-expense');

            chartExpense.appendChild(canvasExpense);
            chartBlock.appendChild(chartExpense);
        } else if (!expense.length && lineElement) {
            lineElement.remove()
        }

        if (expense.length) {
            const ctx = document.getElementById('myChart-expense');

            const labels = [];
            expense.forEach(expense => {
                if (!labels.includes(expense.category)) {
                    labels.push(expense.category);
                }
            })

            const amount = [];

            for (let i = 0; i < labels.length; i++) {
                let sum = 0;
                for (let j = 0; j < expense.length; j++) {

                    if (labels[i] === expense[j].category) {

                        sum += expense[j].amount;
                    }

                }
                amount.push(sum);
            }


            let randomColors = function () {
                return '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase()
            }

            let colors = [];
            for (let i = 0; i < labels.length; i++) {
                colors.push(randomColors());
            }


            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Расходы',
                        data: amount,
                        backgroundColor: colors,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Расходы'
                        }
                    }
                },
            });
        } else {
            return;
        }
    }
}
