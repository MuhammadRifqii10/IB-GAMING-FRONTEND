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

    const BOOKING_STORAGE_KEY =
        "ibGamingBooking";

    const PAYMENT_METHOD_STORAGE_KEY =
        "ibGamingPaymentMethod";


    /* =====================================================
       DATA
    ===================================================== */

    let bookingData = null;
    let selectedPaymentMethod = "";


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(price) {

        return "Rp " +
            Number(price || 0).toLocaleString("id-ID");

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(dateString) {

        if (!dateString) {
            return "-";
        }

        const date = new Date(dateString + "T00:00:00");

        if (isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

    }


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(timeString) {

        if (!timeString) {
            return "-";
        }

        const parts = timeString.split(":");

        if (parts.length < 2) {
            return timeString;
        }

        return parts[0] + ":" + parts[1];

    }


    /* =====================================================
       LOAD BOOKING DATA
    ===================================================== */

    function loadBookingData() {

        const savedBooking =
            localStorage.getItem(BOOKING_STORAGE_KEY);


        if (!savedBooking) {

            bookingData = null;

            return;

        }


        try {

            const parsedBooking =
                JSON.parse(savedBooking);


            if (parsedBooking) {

                bookingData = parsedBooking;

            } else {

                bookingData = null;

            }

        } catch (error) {

            console.error(
                "Gagal membaca data booking:",
                error
            );

            bookingData = null;

        }

    }


    /* =====================================================
       GET PLAYSTATION DATA
    ===================================================== */

    function getPlayStationName() {

        if (!bookingData) {
            return "Belum dipilih";
        }

        return (
            bookingData.playstation ||
            bookingData.ps ||
            "Belum dipilih"
        );

    }


    function getPlayStationPrice() {

        if (!bookingData) {
            return 0;
        }

        return Number(
            bookingData.playstationPrice ||
            bookingData.psPrice ||
            0
        );

    }


    /* =====================================================
       GET TV DATA
    ===================================================== */

    function getTVName() {

        if (!bookingData) {
            return "Tidak digunakan";
        }

        const tv =
            bookingData.tv || "none";


        if (
            tv === "none" ||
            tv === "" ||
            tv === "Tidak menggunakan TV"
        ) {

            return "Tidak digunakan";

        }


        return tv;

    }


    function getTVPrice() {

        if (!bookingData) {
            return 0;
        }

        return Number(
            bookingData.tvPrice || 0
        );

    }


    /* =====================================================
       GET SCHEDULE DATA
    ===================================================== */

    function getPickupDate() {

        if (!bookingData) {
            return "";
        }

        return (
            bookingData.pickupDate ||
            bookingData.tanggalPengambilan ||
            ""
        );

    }


    function getPickupTime() {

        if (!bookingData) {
            return "";
        }

        return (
            bookingData.pickupTime ||
            bookingData.jamPengambilan ||
            ""
        );

    }


    function getReturnDate() {

        if (!bookingData) {
            return "";
        }

        return (
            bookingData.returnDate ||
            bookingData.tanggalPengembalian ||
            ""
        );

    }


    function getDuration() {

        if (!bookingData) {
            return 0;
        }

        return Number(
            bookingData.duration ||
            bookingData.durasi ||
            0
        );

    }


    /* =====================================================
       GET TOTAL
    ===================================================== */

    function getTotal() {

        if (!bookingData) {
            return 0;
        }

        /*
         * Jika total sudah disimpan dari booking-form,
         * gunakan total tersebut.
         */

        if (
            bookingData.total !== undefined &&
            bookingData.total !== null
        ) {

            return Number(bookingData.total);

        }


        if (
            bookingData.totalPrice !== undefined &&
            bookingData.totalPrice !== null
        ) {

            return Number(bookingData.totalPrice);

        }


        /*
         * Fallback:
         * (Harga PS + Harga TV) × Durasi
         */

        const psPrice =
            getPlayStationPrice();

        const tvPrice =
            getTVPrice();

        const duration =
            getDuration();


        return (
            (psPrice + tvPrice) *
            duration
        );

    }


    /* =====================================================
       RENDER BOOKING SUMMARY
    ===================================================== */

    function renderBookingSummary() {

        if (!paymentSummaryItems) {
            return;
        }


        paymentSummaryItems.innerHTML = "";


        /* ================================================
           EMPTY STATE
        ================================================ */

        if (!bookingData) {

            if (paymentSummaryEmpty) {

                paymentSummaryEmpty.classList.add("active");

            }

            updateTotal(0);

            return;

        }


        if (paymentSummaryEmpty) {

            paymentSummaryEmpty.classList.remove("active");

        }


        /* ================================================
           PLAYSTATION
        ================================================ */

        createSummaryItem(
            "PlayStation",
            getPlayStationName(),
            formatPrice(getPlayStationPrice()) + " / hari"
        );


        /* ================================================
           TV
        ================================================ */

        createSummaryItem(
            "TV",
            getTVName(),
            getTVPrice() > 0
                ? formatPrice(getTVPrice()) + " / hari"
                : "Gratis / Tidak digunakan"
        );


        /* ================================================
           TANGGAL PENGAMBILAN
        ================================================ */

        createSummaryItem(
            "Tanggal Pengambilan",
            formatDate(getPickupDate()),
            ""
        );


        /* ================================================
           JAM PENGAMBILAN
        ================================================ */

        createSummaryItem(
            "Jam Pengambilan",
            formatTime(getPickupTime()),
            ""
        );


        /* ================================================
           TANGGAL PENGEMBALIAN
        ================================================ */

        createSummaryItem(
            "Tanggal Pengembalian",
            formatDate(getReturnDate()),
            ""
        );


        /* ================================================
           DURASI
        ================================================ */

        const duration =
            getDuration();

        createSummaryItem(
            "Durasi",
            duration > 0
                ? duration + " Hari"
                : "-",
            ""
        );


        /* ================================================
           TOTAL
        ================================================ */

        updateTotal(
            getTotal()
        );

    }


    /* =====================================================
       CREATE SUMMARY ITEM
    ===================================================== */

    function createSummaryItem(
        label,
        value,
        detail
    ) {

        if (!paymentSummaryItems) {
            return;
        }


        const item =
            document.createElement("div");

        item.className =
            "payment-summary-item booking-summary-item";


        const info =
            document.createElement("div");

        info.className =
            "payment-summary-item-info";


        const labelElement =
            document.createElement("span");

        labelElement.className =
            "payment-summary-item-label";

        labelElement.textContent =
            label;


        const valueElement =
            document.createElement("strong");

        valueElement.className =
            "payment-summary-item-name";

        valueElement.textContent =
            value;


        info.appendChild(
            labelElement
        );

        info.appendChild(
            valueElement
        );


        if (detail) {

            const detailElement =
                document.createElement("small");

            detailElement.className =
                "payment-summary-item-price";

            detailElement.textContent =
                detail;

            info.appendChild(
                detailElement
            );

        }


        item.appendChild(
            info
        );


        paymentSummaryItems.appendChild(
            item
        );

    }


    /* =====================================================
       UPDATE TOTAL
    ===================================================== */

    function updateTotal(total) {

        if (!paymentSummarySubtotal) {
            return;
        }

        paymentSummarySubtotal.textContent =
            formatPrice(total);

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

            selectedPaymentMethod =
                "qris";


            if (paymentQris) {

                paymentQris.checked =
                    true;

            }

        }

        else if (savedMethod === "cash") {

            selectedPaymentMethod =
                "cash";


            if (paymentCash) {

                paymentCash.checked =
                    true;

            }

        }

        else {

            selectedPaymentMethod =
                "";


            if (paymentQris) {

                paymentQris.checked =
                    false;

            }


            if (paymentCash) {

                paymentCash.checked =
                    false;

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


                selectedPaymentMethod =
                    "qris";


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


                selectedPaymentMethod =
                    "cash";


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
                   CEK BOOKING
                ======================================== */

                if (!bookingData) {

                    alert(
                        "Data booking tidak ditemukan. Silakan kembali ke halaman booking."
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
                   UPDATE DATA BOOKING
                ======================================== */

                bookingData.paymentMethod =
                    selectedPaymentMethod;

                bookingData.total =
                    getTotal();


                localStorage.setItem(
                    BOOKING_STORAGE_KEY,
                    JSON.stringify(bookingData)
                );


                /* ========================================
                   REDIRECT
                ======================================== */

                if (
                    selectedPaymentMethod ===
                    "qris"
                ) {

                    window.location.href =
                        "pembayaran-qris.html";

                    return;

                }


                if (
                    selectedPaymentMethod ===
                    "cash"
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

    loadBookingData();

    loadSelectedPaymentMethod();

    renderBookingSummary();

});