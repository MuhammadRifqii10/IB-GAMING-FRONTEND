document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENT
    ====================================================== */

    const qrisSummaryItems =
        document.getElementById("qrisSummaryItems");

    const qrisSummaryEmpty =
        document.getElementById("qrisSummaryEmpty");

    const qrisSummarySubtotal =
        document.getElementById("qrisSummarySubtotal");

    const qrisSummaryTotal =
        document.getElementById("qrisSummaryTotal");

    const paymentAmount =
        document.getElementById("paymentAmount");

    const paymentOrderNumber =
        document.getElementById("paymentOrderNumber");

    const paymentPickupDate =
        document.getElementById("paymentPickupDate");

    const paymentPickupTime =
        document.getElementById("paymentPickupTime");

    const paymentStatus =
        document.getElementById("paymentStatus");

    const paymentTimer =
        document.getElementById("paymentTimer");


    /* =====================================================
       STORAGE KEY
    ====================================================== */

    const CHECKOUT_STORAGE_KEY =
        "ibGamingFnbCheckout";

    const TABLE_NUMBER_STORAGE_KEY =
        "ibGamingTableNumber";

    const PAYMENT_METHOD_STORAGE_KEY =
        "ibGamingPaymentMethod";


    /* =====================================================
       VARIABLE
    ====================================================== */

    let orders = [];

    let checkoutData = null;

    let countdownInterval = null;

    let remainingSeconds = 5 * 60;


    /* =====================================================
       FORMAT PRICE
    ====================================================== */

    function formatPrice(price) {

        return "Rp " +
            Number(price || 0).toLocaleString("id-ID");

    }


    /* =====================================================
       FORMAT DATE
    ====================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

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
       RENDER ORDER SUMMARY
    ====================================================== */

    function renderOrders() {

        if (!qrisSummaryItems) {
            return;
        }


        qrisSummaryItems.innerHTML = "";


        /* -----------------------------------------------
           EMPTY
        ------------------------------------------------ */

        if (orders.length === 0) {

            if (qrisSummaryEmpty) {

                qrisSummaryEmpty.classList.add(
                    "active"
                );

            }

            updateSummaryTotal();

            return;

        }


        if (qrisSummaryEmpty) {

            qrisSummaryEmpty.classList.remove(
                "active"
            );

        }


        /* -----------------------------------------------
           ORDERS
        ------------------------------------------------ */

        orders.forEach(
            function (order) {

                const orderItem =
                    document.createElement("div");

                orderItem.className =
                    "qris-summary-item";


                /* IMAGE */

                const image =
                    document.createElement("img");

                image.className =
                    "qris-summary-item-image";

                image.src =
                    order.image;

                image.alt =
                    order.name;


                /* INFO */

                const info =
                    document.createElement("div");

                info.className =
                    "qris-summary-item-info";


                /* NAME */

                const name =
                    document.createElement("p");

                name.className =
                    "qris-summary-item-name";

                name.textContent =
                    order.name;


                /* PRICE */

                const price =
                    document.createElement("p");

                price.className =
                    "qris-summary-item-price";

                price.textContent =
                    formatPrice(order.price);


                info.appendChild(name);

                info.appendChild(price);


                /* QUANTITY */

                const quantity =
                    document.createElement("span");

                quantity.className =
                    "qris-summary-item-quantity";

                quantity.textContent =
                    "× " + order.quantity;


                /* APPEND */

                orderItem.appendChild(image);

                orderItem.appendChild(info);

                orderItem.appendChild(quantity);

                qrisSummaryItems.appendChild(
                    orderItem
                );

            }
        );


        updateSummaryTotal();

    }


    /* =====================================================
       UPDATE SUMMARY TOTAL
    ====================================================== */

    function updateSummaryTotal() {

        const subtotal =
            getSubtotal();


        if (qrisSummarySubtotal) {

            qrisSummarySubtotal.textContent =
                formatPrice(subtotal);

        }


        if (qrisSummaryTotal) {

            qrisSummaryTotal.textContent =
                formatPrice(subtotal);

        }


        if (paymentAmount) {

            paymentAmount.textContent =
                formatPrice(subtotal);

        }

    }


    /* =====================================================
       GENERATE TEMPORARY ORDER NUMBER
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

        if (
            checkoutData &&
            checkoutData.orderNumber
        ) {

            return checkoutData.orderNumber;

        }


        const existingOrderNumber =
            localStorage.getItem(
                "ibGamingQrisOrderNumber"
            );


        if (existingOrderNumber) {

            return existingOrderNumber;

        }


        const newOrderNumber =
            generateOrderNumber();


        localStorage.setItem(
            "ibGamingQrisOrderNumber",
            newOrderNumber
        );


        return newOrderNumber;

    }


    /* =====================================================
       RENDER PAYMENT INFORMATION
    ====================================================== */

    function renderPaymentInformation() {

        const subtotal =
            getSubtotal();


        /* -----------------------------------------------
           AMOUNT
        ------------------------------------------------ */

        if (paymentAmount) {

            paymentAmount.textContent =
                formatPrice(subtotal);

        }


        /* -----------------------------------------------
           ORDER NUMBER
        ------------------------------------------------ */

        if (paymentOrderNumber) {

            paymentOrderNumber.textContent =
                getOrderNumber();

        }


        /* -----------------------------------------------
           PICKUP DATE
        ------------------------------------------------ */

        if (paymentPickupDate) {

            if (
                checkoutData &&
                checkoutData.pickupDate
            ) {

                paymentPickupDate.textContent =
                    formatDate(
                        checkoutData.pickupDate
                    );

            } else {

                paymentPickupDate.textContent =
                    "-";

            }

        }


        /* -----------------------------------------------
           PICKUP TIME
        ------------------------------------------------ */

        if (paymentPickupTime) {

            if (
                checkoutData &&
                checkoutData.pickupTime
            ) {

                paymentPickupTime.textContent =
                    checkoutData.pickupTime;

            } else {

                paymentPickupTime.textContent =
                    "-";

            }

        }

    }


    /* =====================================================
       SET PAYMENT STATUS
    ====================================================== */

    function setPaymentStatus(
        status,
        text
    ) {

        if (!paymentStatus) {
            return;
        }


        paymentStatus.className =
            "payment-status " + status;


        paymentStatus.innerHTML =
            `
                <span class="payment-status-dot"></span>
                ${text}
            `;

    }


    /* =====================================================
       TIMER FORMAT
    ====================================================== */

    function formatTimer(seconds) {

        const minutes =
            Math.floor(
                seconds / 60
            );


        const remaining =
            seconds % 60;


        return (
            String(minutes).padStart(2, "0") +
            " : " +
            String(remaining).padStart(2, "0")
        );

    }


    /* =====================================================
       UPDATE TIMER DISPLAY
    ====================================================== */

    function updateTimerDisplay() {

        if (!paymentTimer) {
            return;
        }


        paymentTimer.textContent =
            formatTimer(
                remainingSeconds
            );

    }


    /* =====================================================
       TIMER EXPIRED
    ====================================================== */

    function handleTimerExpired() {

        clearInterval(
            countdownInterval
        );


        remainingSeconds = 0;


        updateTimerDisplay();


        setPaymentStatus(
            "expired",
            "Pembayaran Kedaluwarsa"
        );


        /*
         * Untuk tahap frontend:
         * timer hanya mengubah status visual.
         *
         * Nanti ketika Midtrans sudah terhubung,
         * status transaksi sebenarnya akan berasal
         * dari backend / notification Midtrans.
         */

        console.log(
            "Waktu pembayaran QRIS telah habis."
        );

    }


    /* =====================================================
       START COUNTDOWN
    ====================================================== */

    function startCountdown() {

        clearInterval(
            countdownInterval
        );


        remainingSeconds = 5 * 60;


        updateTimerDisplay();


        countdownInterval =
            setInterval(
                function () {

                    remainingSeconds--;


                    updateTimerDisplay();


                    if (
                        remainingSeconds <= 0
                    ) {

                        handleTimerExpired();

                    }

                },
                1000
            );

    }


    /* =====================================================
       RESTORE PAYMENT METHOD
    ====================================================== */

    function checkPaymentMethod() {

        const paymentMethod =
            localStorage.getItem(
                PAYMENT_METHOD_STORAGE_KEY
            );


        /*
         * Halaman ini khusus QRIS.
         *
         * Jika user masuk langsung tanpa memilih QRIS,
         * kita tetap biarkan halaman tampil pada tahap
         * frontend.
         *
         * Validasi sebenarnya nanti dilakukan backend.
         */

        if (
            paymentMethod &&
            paymentMethod !== "qris"
        ) {

            console.warn(
                "Metode pembayaran bukan QRIS."
            );

        }

    }


    /* =====================================================
       PREPARE CHECKOUT DATA
    ====================================================== */

    function prepareCheckoutData() {

        if (!checkoutData) {
            return;
        }


        const subtotal =
            getSubtotal();


        checkoutData.paymentMethod =
            "qris";


        checkoutData.subtotal =
            subtotal;


        checkoutData.orderNumber =
            getOrderNumber();


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

    checkPaymentMethod();

    prepareCheckoutData();

    renderOrders();

    renderPaymentInformation();

    setPaymentStatus(
        "pending",
        "Menunggu Pembayaran"
    );

    startCountdown();


});