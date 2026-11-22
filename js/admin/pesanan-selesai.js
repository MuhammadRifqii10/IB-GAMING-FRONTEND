/**
 * pesanan-selesai.js
 * Halaman Detail Pesanan Selesai F & B — hanya navigasi UI.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        var btnKembali = document.getElementById('btnKembali');
        if (btnKembali) {
            btnKembali.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'pesanan-fnb.html';
            });
        }

    });

})();

