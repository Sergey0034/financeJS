export class handlersButtons {
    static handlersButtonsSideBar() {
        $('.link-main').on('click', function () {
            $('.nav-item-categories').css("border", "0");
        })

        $('#categories').on('click', function () {
            let link_categories = $('.nav-item-categories');
            $('#svg-icons-transform').toggleClass('transform');
            link_categories.addClass('active');
            link_categories.css("border", "1px solid #0D6EFD");
        })

        $('.nav-link').on('click', function () {
            $('.nav-link').removeClass('active');
            $(this).toggleClass('active');
        })

        $('.link-categories').on('click', function () {
            $('#sidebar-categories').addClass('active');
        })

        $(function () {
            $("#datepicker-from").datepicker({
                dateFormat: 'yy-mm-dd'
            });
        });


        $(function () {
            $("#datepicker-to").datepicker({
                dateFormat: 'yy-mm-dd'
            });
        });

        $('#full-name-user').click(function (e) {
            $('#dropdown-menu').show();
        })

        $(document).mouseup(function (e) {
            let element = $("#dropdown-menu");
            if (!element.is(e.target) && element.has(e.target).length === 0) {
                element.hide();
            }
        });

    }
}