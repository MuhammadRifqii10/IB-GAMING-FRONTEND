/* =========================================================
   DETAIL VERIFIKASI BOOKING — Booking PS
   Placeholder interaksi frontend (tanpa backend)
========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    const tolakBtn = document.getElementById('verifikasiBookingTolak');
    const setujuiBtn = document.getElementById('verifikasiBookingSetujui');

    if (tolakBtn) {
        tolakBtn.addEventListener('click', function () {
            window.location.href = 'verifikasi-booking.html';
        });
    }

    if (setujuiBtn) {
        setujuiBtn.addEventListener('click', function () {
            window.location.href = 'verifikasi-booking.html';
        });
    }
});

