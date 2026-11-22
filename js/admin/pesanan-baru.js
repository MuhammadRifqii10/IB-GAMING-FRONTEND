/**
 * pesanan-baru.js
 * JavaScript untuk halaman Detail Pesanan Baru F & B.
 * Hanya navigasi UI — tanpa backend.
 */

(function () {
    'use strict';

    var PESANAN_FNB_URL = 'pesanan-fnb.html';

    document.addEventListener('DOMContentLoaded', function () {

        // Tombol Kembali (header kanan)
        var btnKembali = document.getElementById('btnKembali');
        if (btnKembali) {
            btnKembali.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = PESANAN_FNB_URL;
            });
        }

        // Tombol Konfirmasi Pesanan → kembali ke daftar pesanan (simulasi)
        var btnKonfirmasi = document.getElementById('btnKonfirmasi');
        if (btnKonfirmasi) {
            btnKonfirmasi.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = PESANAN_FNB_URL;
            });
        }

        // Tombol Tolak Pesanan → kembali ke daftar pesanan (simulasi)
        var btnTolak = document.getElementById('btnTolak');
        if (btnTolak) {
            btnTolak.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = PESANAN_FNB_URL;
            });
        }

    });

})();

