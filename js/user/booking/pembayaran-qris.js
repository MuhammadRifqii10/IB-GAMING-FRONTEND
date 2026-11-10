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

    const BOOKING_STORAGE_KEY =
        "ibGamingBooking";

    const PAYMENT_METHOD_STORAGE_KEY =
        "ibGamingPaymentMethod";

    const BOOKING_ORDER_NUMBER_KEY =
        "ibGamingBookingOrderNumber";


    /* =====================================================
       VARIABLE
    ====================================================== */

    let bookingData = null;

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

        const date =
            new Date(dateValue + "T00:00:00");

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
       FORMAT TIME
    ====================================================== */

    function formatTime(timeValue) {

        if (!timeValue) {
            return "-";
        }

        const parts =
            timeValue.split(":");

        if (parts.length < 2) {
            return timeValue;
        }

        return (
            parts[0] +
            ":" +
            parts[1]
        );

    }


    /* =====================================================
       LOAD BOOKING DATA
    ====================================================== */

    function loadBookingData() {

        const savedBooking =
            localStorage.getItem(
                BOOKING_STORAGE_KEY
            );


        if (!savedBooking) {

            bookingData = null;

            return;

        }


        try {

            bookingData =
                JSON.parse(savedBooking);

        } catch (error) {

            console.error(
                "Gagal membaca data booking:",
                error
            );

            bookingData = null;

        }

    }


    /* =====================================================
       GET PLAYSTATION
    ====================================================== */

    function getPlayStationName() {

        if (!bookingData) {
            return "Belum dipilih";
        }

        return (
            bookingData.playStation ||
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
            bookingData.playStationPrice ||
            bookingData.playstationPrice ||
            bookingData.psPrice ||
            0
        );

    }


    /* =====================================================
       GET TV
    ====================================================== */

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
       GET SCHEDULE
    ====================================================== */

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
    ====================================================== */

    function getTotal() {

        if (!bookingData) {
            return 0;
        }


        if (
            bookingData.total !== undefined &&
            bookingData.total !== null
        ) {

            return Number(
                bookingData.total
            );

        }


        if (
            bookingData.totalPrice !== undefined &&
            bookingData.totalPrice !== null
        ) {

            return Number(
                bookingData.totalPrice
            );

        }


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
       CREATE SUMMARY ITEM
    ====================================================== */

    function createSummaryItem(
        label,
        value,
        detail = ""
    ) {

        if (!qrisSummaryItems) {
            return;
        }


        const item =
            document.createElement("div");

        item.className =
            "qris-summary-item";


        const info =
            document.createElement("div");

        info.className =
            "qris-summary-item-info";


        const labelElement =
            document.createElement("span");

        labelElement.className =
            "qris-summary-item-label";

        labelElement.textContent =
            label;


        const valueElement =
            document.createElement("strong");

        valueElement.className =
            "qris-summary-item-name";

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
                "qris-summary-item-price";

            detailElement.textContent =
                detail;

            info.appendChild(
                detailElement
            );

        }


        item.appendChild(
            info
        );


        qrisSummaryItems.appendChild(
            item
        );

    }


    /* =====================================================
       RENDER BOOKING SUMMARY
    ====================================================== */

    function renderBookingSummary() {

        if (!qrisSummaryItems) {
            return;
        }


        qrisSummaryItems.innerHTML =
            "";


        if (!bookingData) {

            if (qrisSummaryEmpty) {

                qrisSummaryEmpty.classList.add(
                    "active"
                );

            }

            updateSummaryTotal(0);

            return;

        }


        if (qrisSummaryEmpty) {

            qrisSummaryEmpty.classList.remove(
                "active"
            );

        }


        /* ================================================
           PLAYSTATION
        ================================================= */

        createSummaryItem(
            "PlayStation",
            getPlayStationName(),
            getPlayStationPrice() > 0
                ? formatPrice(
                    getPlayStationPrice()
                ) + " / hari"
                : ""
        );


        /* ================================================
           TV
        ================================================= */

        createSummaryItem(
            "TV",
            getTVName(),
            getTVPrice() > 0
                ? formatPrice(
                    getTVPrice()
                ) + " / hari"
                : ""
        );


        /* ================================================
           TANGGAL PENGAMBILAN
        ================================================= */

        createSummaryItem(
            "Tanggal Pengambilan",
            formatDate(
                getPickupDate()
            )
        );


        /* ================================================
           JAM PENGAMBILAN
        ================================================= */

        createSummaryItem(
            "Jam Pengambilan",
            formatTime(
                getPickupTime()
            )
        );


        /* ================================================
           TANGGAL PENGEMBALIAN
        ================================================= */

        createSummaryItem(
            "Tanggal Pengembalian",
            formatDate(
                getReturnDate()
            )
        );


        /* ================================================
           DURASI
        ================================================= */

        createSummaryItem(
            "Durasi",
            getDuration() > 0
                ? getDuration() + " Hari"
                : "-"
        );


        /* ================================================
           TOTAL
        ================================================= */

        updateSummaryTotal(
            getTotal()
        );

    }


    /* =====================================================
       UPDATE SUMMARY TOTAL
    ====================================================== */

    function updateSummaryTotal(total) {

        if (qrisSummarySubtotal) {

            qrisSummarySubtotal.textContent =
                formatPrice(total);

        }


        if (qrisSummaryTotal) {

            qrisSummaryTotal.textContent =
                formatPrice(total);

        }


        if (paymentAmount) {

            paymentAmount.textContent =
                formatPrice(total);

        }

    }


    /* =====================================================
       GENERATE BOOKING ORDER NUMBER
    ====================================================== */

    function generateBookingOrderNumber() {

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
            "IBG-PS-" +
            year +
            month +
            day +
            "-" +
            randomNumber
        );

    }


    /* =====================================================
       GET BOOKING ORDER NUMBER
    ====================================================== */

    function getBookingOrderNumber() {

        if (
            bookingData &&
            bookingData.orderNumber
        ) {

            return bookingData.orderNumber;

        }


        const existingOrderNumber =
            localStorage.getItem(
                BOOKING_ORDER_NUMBER_KEY
            );


        if (existingOrderNumber) {

            return existingOrderNumber;

        }


        const newOrderNumber =
            generateBookingOrderNumber();


        localStorage.setItem(
            BOOKING_ORDER_NUMBER_KEY,
            newOrderNumber
        );


        return newOrderNumber;

    }


    /* =====================================================
       RENDER PAYMENT INFORMATION
    ====================================================== */

    function renderPaymentInformation() {

        const total =
            getTotal();


        /* ================================================
           AMOUNT
        ================================================= */

        if (paymentAmount) {

            paymentAmount.textContent =
                formatPrice(total);

        }


        /* ================================================
           ORDER NUMBER
        ================================================= */

        if (paymentOrderNumber) {

            paymentOrderNumber.textContent =
                getBookingOrderNumber();

        }


        /* ================================================
           PICKUP DATE
        ================================================= */

        if (paymentPickupDate) {

            paymentPickupDate.textContent =
                formatDate(
                    getPickupDate()
                );

        }


        /* ================================================
           PICKUP TIME
        ================================================= */

        if (paymentPickupTime) {

            paymentPickupTime.textContent =
                formatTime(
                    getPickupTime()
                );

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


        paymentStatus.innerHTML = `
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


        console.log(
            "Waktu pembayaran QRIS Booking PS telah habis."
        );

    }


    /* =====================================================
       START COUNTDOWN
    ====================================================== */

    function startCountdown() {

        clearInterval(
            countdownInterval
        );


        remainingSeconds =
            5 * 60;


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
       CHECK PAYMENT METHOD
    ====================================================== */

    function checkPaymentMethod() {

        const paymentMethod =
            localStorage.getItem(
                PAYMENT_METHOD_STORAGE_KEY
            );


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
       PREPARE BOOKING DATA
    ====================================================== */

    function prepareBookingData() {

        if (!bookingData) {
            return;
        }


        const total =
            getTotal();


        bookingData.paymentMethod =
            "qris";


        bookingData.total =
            total;


        bookingData.orderNumber =
            getBookingOrderNumber();


        localStorage.setItem(
            BOOKING_STORAGE_KEY,
            JSON.stringify(
                bookingData
            )
        );

    }


    /* =====================================================
       INITIALIZE
    ====================================================== */

    loadBookingData();

    checkPaymentMethod();

    prepareBookingData();

    renderBookingSummary();

    renderPaymentInformation();

    setPaymentStatus(
        "pending",
        "Menunggu Pembayaran"
    );

    startCountdown();

});