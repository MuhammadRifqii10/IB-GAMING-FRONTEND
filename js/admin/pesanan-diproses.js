/**
 * pesanan-diproses.js
 * JavaScript untuk halaman Detail Pesanan Diproses F & B.
 * Hanya navigasi UI — tanpa backend.
 */

(function () {
    'use strict';

    var PESANAN_FNB_URL = 'pesanan-fnb.html';

    document.addEventListener('DOMContentLoaded', function () {

        // Tombol Kembali
        var btnKembali = document.getElementById('btnKembali');
        if (btnKembali) {
            btnKembali.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = PESANAN_FNB_URL;
            });
        }

        // Tombol Selesaikan Pesanan → simulasi, kembali ke daftar
        var btnSelesaikan = document.getElementById('btnSelesaikan');
        if (btnSelesaikan) {
            btnSelesaikan.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = PESANAN_FNB_URL;
            });
        }

    });

})();

