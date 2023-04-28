import 'jquery';
import 'jquery-ui/dist/jquery-ui.min';
import 'jquery-ui/dist/themes/base/jquery-ui.min.css';
import 'chart.js';
import {Router} from "./router.js";




class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    handleRouteChanging() {
        this.router.openRoute();
    }
}

(new App());