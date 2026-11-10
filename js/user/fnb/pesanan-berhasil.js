document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENT
    ====================================================== */

    const successOrderNumber =
        document.getElementById("successOrderNumber");

    const successTableNumber =
        document.getElementById("successTableNumber");

    const successSummaryItems =
        document.getElementById("successSummaryItems");

    const successSummaryEmpty =
        document.getElementById("successSummaryEmpty");

    const successSummarySubtotal =
        document.getElementById("successSummarySubtotal");

    const successSummaryTotal =
        document.getElementById("successSummaryTotal");


    /* =====================================================
       STORAGE KEY
    ====================================================== */

    const CHECKOUT_STORAGE_KEY =
        "ibGamingFnbCheckout";

    const TABLE_NUMBER_STORAGE_KEY =
        "ibGamingTableNumber";

    const PAYMENT_METHOD_STORAGE_KEY =
        "ibGamingPaymentMethod";

    const ORDER_NUMBER_STORAGE_KEY =
        "ibGamingQrisOrderNumber";


    /* =====================================================
       VARIABLE
    ====================================================== */

    let orders = [];

    let checkoutData = null;


    /* =====================================================
       FORMAT PRICE
    ====================================================== */

    function formatPrice(price) {

        return "Rp " +
            Number(price || 0).toLocaleString("id-ID");

    }


    /* =====================================================
       LOAD CHECKOUT DATA
    ====================================================== */

    function loadCheckoutData() {

        const savedCheckout =
            localStorage.getItem(
                CHECKOUT_STORAGE_KEY
            );


        if (!savedCheckout) {

            orders = [];

            checkoutData = null;

            return;

        }


        try {

            checkoutData =
                JSON.parse(savedCheckout);


            if (
                checkoutData &&
                Array.isArray(checkoutData.orders)
            ) {

                orders =
                    checkoutData.orders.map(
                        function (item) {

                            return {

                                name:
                                    item.name || "",

                                price:
                                    Number(item.price) || 0,

                                image:
                                    item.image || "",

                                quantity:
                                    Number(item.quantity) || 1,

                                note:
                                    item.note || ""

                            };

                        }
                    );

            } else {

                orders = [];

            }

        } catch (error) {

            console.error(
                "Gagal membaca data checkout:",
                error
            );

            orders = [];

            checkoutData = null;

        }

    }


    /* =====================================================
       GET TABLE NUMBER
    ====================================================== */

    function getTableNumber() {

        /*
         * Prioritas:
         * 1. Data dari checkout
         * 2. LocalStorage nomor meja
         */

        if (
            checkoutData &&
            checkoutData.tableNumber
        ) {

            return checkoutData.tableNumber;

        }


        const savedTableNumber =
            localStorage.getItem(
                TABLE_NUMBER_STORAGE_KEY
            );


        if (savedTableNumber) {

            return savedTableNumber;

        }


        return "-";

    }


    /* =====================================================
       GENERATE ORDER NUMBER
    ====================================================== */

    function generateOrderNumber() {

        const now =
            new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                now.getDate()
            ).padStart(2, "0");


        const randomNumber =
            String(
                Math.floor(
                    Math.random() * 1000
                )
            ).padStart(3, "0");


        return (
            "IBG-" +
            year +
            month +
            day +
            "-" +
            randomNumber
        );

    }


    /* =====================================================
       GET ORDER NUMBER
    ====================================================== */

    function getOrderNumber() {

        /*
         * Jika checkout sudah mempunyai nomor order,
         * gunakan nomor tersebut.
         */

        if (
            checkoutData &&
            checkoutData.orderNumber
        ) {

            return checkoutData.orderNumber;

        }


        /*
         * Gunakan nomor order yang sebelumnya
         * dibuat pada halaman QRIS jika ada.
         */

        const savedOrderNumber =
            localStorage.getItem(
                ORDER_NUMBER_STORAGE_KEY
            );


        if (savedOrderNumber) {

            return savedOrderNumber;

        }


        /*
         * Jika belum ada, buat nomor order sementara.
         */

        const newOrderNumber =
            generateOrderNumber();


        localStorage.setItem(
            ORDER_NUMBER_STORAGE_KEY,
            newOrderNumber
        );


        return newOrderNumber;

    }


    /* =====================================================
       GET SUBTOTAL
    ====================================================== */

    function getSubtotal() {

        return orders.reduce(
            function (total, item) {

                return total +
                    (
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                    );

            },
            0
        );

    }


    /* =====================================================
       RENDER ORDER SUMMARY
    ====================================================== */

    function renderOrders() {

        if (!successSummaryItems) {
            return;
        }


        successSummaryItems.innerHTML = "";


        /* -----------------------------------------------
           EMPTY ORDER
        ------------------------------------------------ */

        if (orders.length === 0) {

            if (successSummaryEmpty) {

                successSummaryEmpty.classList.add(
                    "active"
                );

            }

            updateTotal();

            return;

        }


        if (successSummaryEmpty) {

            successSummaryEmpty.classList.remove(
                "active"
            );

        }


        /* -----------------------------------------------
           RENDER EACH ORDER
        ------------------------------------------------ */

        orders.forEach(
            function (order) {

                const orderItem =
                    document.createElement("div");

                orderItem.className =
                    "success-summary-item";


                /* IMAGE */

                const image =
                    document.createElement("img");

                image.className =
                    "success-summary-item-image";

                image.src =
                    order.image;

                image.alt =
                    order.name;


                /* INFO */

                const info =
                    document.createElement("div");

                info.className =
                    "success-summary-item-info";


                /* NAME */

                const name =
                    document.createElement("p");

                name.className =
                    "success-summary-item-name";

                name.textContent =
                    order.name;


                /* PRICE */

                const price =
                    document.createElement("p");

                price.className =
                    "success-summary-item-price";

                price.textContent =
                    formatPrice(order.price);


                info.appendChild(name);

                info.appendChild(price);


                /* QUANTITY */

                const quantity =
                    document.createElement("span");

                quantity.className =
                    "success-summary-item-quantity";

                quantity.textContent =
                    "× " + order.quantity;


                /* APPEND */

                orderItem.appendChild(image);

                orderItem.appendChild(info);

                orderItem.appendChild(quantity);


                successSummaryItems.appendChild(
                    orderItem
                );

            }
        );


        updateTotal();

    }


    /* =====================================================
       UPDATE TOTAL
    ====================================================== */

    function updateTotal() {

        const subtotal =
            getSubtotal();


        if (successSummarySubtotal) {

            successSummarySubtotal.textContent =
                formatPrice(subtotal);

        }


        if (successSummaryTotal) {

            successSummaryTotal.textContent =
                formatPrice(subtotal);

        }

    }


    /* =====================================================
       RENDER ORDER INFORMATION
    ====================================================== */

    function renderOrderInformation() {

        /* -----------------------------------------------
           ORDER NUMBER
        ------------------------------------------------ */

        if (successOrderNumber) {

            successOrderNumber.textContent =
                getOrderNumber();

        }


        /* -----------------------------------------------
           TABLE NUMBER
        ------------------------------------------------ */

        if (successTableNumber) {

            successTableNumber.textContent =
                getTableNumber();

        }

    }


    /* =====================================================
       SAVE FINAL CHECKOUT DATA
    ====================================================== */

    function saveFinalCheckoutData() {

        const subtotal =
            getSubtotal();


        /*
         * Pastikan metode pembayaran adalah cash.
         */

        localStorage.setItem(
            PAYMENT_METHOD_STORAGE_KEY,
            "cash"
        );


        /*
         * Jika tidak ada data checkout,
         * tidak perlu menyimpan ulang.
         */

        if (!checkoutData) {
            return;
        }


        checkoutData.paymentMethod =
            "cash";

        checkoutData.subtotal =
            subtotal;

        checkoutData.tableNumber =
            getTableNumber();

        checkoutData.orderNumber =
            getOrderNumber();

        checkoutData.paymentStatus =
            "pending";


        localStorage.setItem(
            CHECKOUT_STORAGE_KEY,
            JSON.stringify(
                checkoutData
            )
        );

    }


    /* =====================================================
       INITIALIZE
    ====================================================== */

    loadCheckoutData();

    saveFinalCheckoutData();

    renderOrderInformation();

    renderOrders();

});