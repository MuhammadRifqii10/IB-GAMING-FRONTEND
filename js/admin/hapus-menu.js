/**
 * hapus-menu.js
 * Popup konfirmasi Hapus Menu F & B — simulasi frontend, tanpa backend.
 */

(function () {
    'use strict';

    var KELOLA_MENU_URL = 'kelola-menu.html';

    function kembali() {
        window.location.href = KELOLA_MENU_URL;
    }

    document.addEventListener('DOMContentLoaded', function () {

        var closeBtn = document.getElementById('hapusMenuClose');
        var batalBtn = document.getElementById('hapusMenuBatal');
        var hapusBtn = document.getElementById('hapusMenuHapus');
        var overlay  = document.getElementById('hapusMenuOverlay');

        if (closeBtn) closeBtn.addEventListener('click', kembali);

        if (batalBtn) {
            batalBtn.addEventListener('click', function (e) {
                e.preventDefault();
                kembali();
            });
        }

        // Hapus -> simulasi penghapusan, kembali ke Kelola Menu
        if (hapusBtn) {
            hapusBtn.addEventListener('click', function (e) {
                e.preventDefault();
                kembali();
            });
        }

        // Klik di luar popup -> tutup
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) kembali();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') kembali();
        });

    });

})();

