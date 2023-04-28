import {Auth} from "./auth.js";
import {CustomHttp} from "./custom-http.js";
import config from "../config/config.js";
import {Router} from "../router";

export class UpdateProfile {

    static profileCheck(profileElement, profileFullNameElement) {
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            profileElement.style.display = 'flex';
            profileFullNameElement.innerText = `${userInfo.name} ${userInfo.lastName}`;
        } else {
            profileElement.style.display = 'none';
        }
    }


    static async getUpdateBalanceUser(userBalance) {
        try {
            let token = localStorage.getItem(Auth.accessTokenKey);
            if (token) {
                // const result = await CustomHttp.request(config.host + '/balance');
                const response = await fetch(config.host + '/balance', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'x-auth-token': token
                    },
                });

                if (response && response.status === 200) {
                    const result = await response.json();
                    if (result && !result.balance || result.balance < 0) {
                        userBalance.innerText = '0';
                        return true;
                    }
                    userBalance.innerText = result.balance + ' $';
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    static activeMenu() {
        const route = window.location.hash

        if (route === '#/main') {
            const activeMenu = document.getElementById('menu');
            activeMenu.classList.add('active');
        } else if (route === '#/table-expense-income') {
            const activeIncomeExpense = document.getElementById('income-expense');
            activeIncomeExpense.classList.add('active');
        } else {
            const activeMenuCat = document.getElementById('categories');
            activeMenuCat.classList.add('active');
        }


        // if (route === '#/categories-income' || route === '#/editing-income-category' || route === '#/creating-income-category') {
        //     const activeMenuCat = document.getElementById('categories');
        //     const activeIncome = document.getElementById('income');
        //     activeMenuCat.classList.add('active');
        //     activeIncome.classList.add('active');
        // }
    }
}

