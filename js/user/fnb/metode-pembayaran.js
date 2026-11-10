document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENT
    ===================================================== */

    const paymentSummaryItems =
        document.getElementById("paymentSummaryItems");

    const paymentSummaryEmpty =
        document.getElementById("paymentSummaryEmpty");

    const paymentSummarySubtotal =
        document.getElementById("paymentSummarySubtotal");

    const confirmPaymentButton =
        document.getElementById("confirmPaymentButton");

    const paymentQris =
        document.getElementById("paymentQris");

    const paymentCash =
        document.getElementById("paymentCash");


    /* =====================================================
       STORAGE KEY
    ===================================================== */

    const CHECKOUT_STORAGE_KEY =
        "ibGamingFnbCheckout";

    const PAYMENT_METHOD_STORAGE_KEY =
        "ibGamingPaymentMethod";


    /* =====================================================
       DATA
    ===================================================== */

    let orders = [];

    let selectedPaymentMethod = "";


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(price) {

        return "Rp " +
            Number(price).toLocaleString("id-ID");

    }


    /* =====================================================
       GET SUBTOTAL
    ===================================================== */

    function getSubtotal() {

        return orders.reduce(function (total, item) {

            return total +
                (Number(item.price) * Number(item.quantity));

        }, 0);

    }


    /* =====================================================
       LOAD CHECKOUT DATA
    ===================================================== */

    function loadCheckoutData() {

        const savedCheckout =
            localStorage.getItem(CHECKOUT_STORAGE_KEY);


        if (!savedCheckout) {

            orders = [];

            return;

        }


        try {

            const checkoutData =
                JSON.parse(savedCheckout);


            if (
                checkoutData &&
                Array.isArray(checkoutData.orders)
            ) {

                orders = checkoutData.orders.map(function (item) {

                    return {

                        name: item.name || "",

                        price: Number(item.price) || 0,

                        image: item.image || "",

                        quantity:
                            Number(item.quantity) || 1,

                        note: item.note || ""

                    };

                });

            } else {

                orders = [];

            }

        } catch (error) {

            console.error(
                "Gagal membaca data pesanan:",
                error
            );

            orders = [];

        }

    }


    /* =====================================================
       RENDER PESANAN SAYA
    ===================================================== */

    function renderOrders() {

        if (!paymentSummaryItems) {
            return;
        }


        paymentSummaryItems.innerHTML = "";


        /* ================================================
           EMPTY STATE
        ================================================ */

        if (orders.length === 0) {

            if (paymentSummaryEmpty) {

                paymentSummaryEmpty.classList.add("active");

            }

            updateSubtotal();

            return;

        }


        if (paymentSummaryEmpty) {

            paymentSummaryEmpty.classList.remove("active");

        }


        /* ================================================
           RENDER PRODUK
        ================================================ */

        orders.forEach(function (order) {

            const orderItem =
                document.createElement("div");

            orderItem.className =
                "payment-summary-item";


            /* ============================================
               IMAGE
            ============================================ */

            const image =
                document.createElement("img");

            image.className =
                "payment-summary-item-image";

            image.src = order.image;

            image.alt = order.name;


            /* ============================================
               PRODUCT INFO
            ============================================ */

            const info =
                document.createElement("div");

            info.className =
                "payment-summary-item-info";


            const name =
                document.createElement("p");

            name.className =
                "payment-summary-item-name";

            name.textContent =
                order.name;


            const price =
                document.createElement("p");

            price.className =
                "payment-summary-item-price";

            price.textContent =
                formatPrice(order.price);


            info.appendChild(name);
            info.appendChild(price);


            /* ============================================
               QUANTITY
            ============================================ */

            const quantity =
                document.createElement("span");

            quantity.className =
                "payment-summary-item-quantity-text";

            quantity.textContent =
                "× " + order.quantity;


            /* ============================================
               ASSEMBLE
            ============================================ */

            orderItem.appendChild(image);

            orderItem.appendChild(info);

            orderItem.appendChild(quantity);


            paymentSummaryItems.appendChild(orderItem);

        });


        updateSubtotal();

    }


    /* =====================================================
       UPDATE SUBTOTAL
    ===================================================== */

    function updateSubtotal() {

        const subtotal =
            getSubtotal();


        if (paymentSummarySubtotal) {

            paymentSummarySubtotal.textContent =
                formatPrice(subtotal);

        }

    }


    /* =====================================================
       LOAD SAVED PAYMENT METHOD
    ===================================================== */

    function loadSelectedPaymentMethod() {

        const savedMethod =
            localStorage.getItem(
                PAYMENT_METHOD_STORAGE_KEY
            );


        if (savedMethod === "qris") {

            selectedPaymentMethod = "qris";

            if (paymentQris) {
                paymentQris.checked = true;
            }

        } else if (savedMethod === "cash") {

            selectedPaymentMethod = "cash";

            if (paymentCash) {
                paymentCash.checked = true;
            }

        } else {

            selectedPaymentMethod = "";

            if (paymentQris) {
                paymentQris.checked = false;
            }

            if (paymentCash) {
                paymentCash.checked = false;
            }

        }

    }


    /* =====================================================
       PILIH QRIS
    ===================================================== */

    if (paymentQris) {

        paymentQris.addEventListener(
            "change",
            function () {

                if (!this.checked) {
                    return;
                }


                selectedPaymentMethod = "qris";


                localStorage.setItem(
                    PAYMENT_METHOD_STORAGE_KEY,
                    "qris"
                );

            }
        );

    }


    /* =====================================================
       PILIH CASH
    ===================================================== */

    if (paymentCash) {

        paymentCash.addEventListener(
            "change",
            function () {

                if (!this.checked) {
                    return;
                }


                selectedPaymentMethod = "cash";


                localStorage.setItem(
                    PAYMENT_METHOD_STORAGE_KEY,
                    "cash"
                );

            }
        );

    }


    /* =====================================================
       KONFIRMASI PEMBAYARAN
    ===================================================== */

    if (confirmPaymentButton) {

        confirmPaymentButton.addEventListener(
            "click",
            function () {

                /* ========================================
                   CEK PESANAN
                ======================================== */

                if (orders.length === 0) {

                    alert(
                        "Pesanan masih kosong. Silakan pilih menu terlebih dahulu."
                    );

                    return;

                }


                /* ========================================
                   CEK METODE PEMBAYARAN
                ======================================== */

                if (!selectedPaymentMethod) {

                    alert(
                        "Silakan pilih metode pembayaran terlebih dahulu."
                    );

                    return;

                }


                /* ========================================
                   SIMPAN METODE PEMBAYARAN
                ======================================== */

                localStorage.setItem(
                    PAYMENT_METHOD_STORAGE_KEY,
                    selectedPaymentMethod
                );


                /* ========================================
                   UPDATE CHECKOUT DATA
                ======================================== */

                const savedCheckout =
                    localStorage.getItem(
                        CHECKOUT_STORAGE_KEY
                    );


                if (savedCheckout) {

                    try {

                        const checkoutData =
                            JSON.parse(savedCheckout);


                        checkoutData.paymentMethod =
                            selectedPaymentMethod;


                        checkoutData.subtotal =
                            getSubtotal();


                        localStorage.setItem(
                            CHECKOUT_STORAGE_KEY,
                            JSON.stringify(checkoutData)
                        );


                    } catch (error) {

                        console.error(
                            "Gagal menyimpan data checkout:",
                            error
                        );

                    }

                }


                /* ========================================
                   REDIRECT SESUAI METODE PEMBAYARAN
                ======================================== */

                if (
                    selectedPaymentMethod === "qris"
                ) {

                    window.location.href =
                        "pembayaran-qris.html";

                    return;

                }


                if (
                    selectedPaymentMethod === "cash"
                ) {

                    window.location.href =
                        "pesanan-berhasil.html";

                    return;

                }

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    loadCheckoutData();

    loadSelectedPaymentMethod();

    renderOrders();

});