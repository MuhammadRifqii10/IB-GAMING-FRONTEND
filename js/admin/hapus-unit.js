/**
 * hapus-unit.js
 * JavaScript untuk halaman popup Hapus Unit PlayStation.
 * Hanya menangani navigasi UI — tanpa backend.
 */

(function () {
    'use strict';

    var KELOLA_UNIT_URL = 'kelola-unit.html';

    /* --------------------------------------------------------
       Kembali ke Kelola Unit PS
    -------------------------------------------------------- */
    function kembali() {
        window.location.href = KELOLA_UNIT_URL;
    }

    /* --------------------------------------------------------
       Klik overlay di luar popup → tutup
    -------------------------------------------------------- */
    function handleOverlayClick(event) {
        if (event.target === event.currentTarget) {
            kembali();
        }
    }

    /* --------------------------------------------------------
       Init
    -------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {

        // Tombol Close (X)
        var closeBtn = document.getElementById('hapusUnitClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', kembali);
        }

        // Tombol Batal
        var batalBtn = document.getElementById('hapusUnitBatal');
        if (batalBtn) {
            batalBtn.addEventListener('click', function (e) {
                e.preventDefault();
                kembali();
            });
        }

        // Tombol Hapus → kembali ke kelola-unit (simulasi berhasil hapus)
        var hapusBtn = document.getElementById('hapusUnitHapus');
        if (hapusBtn) {
            hapusBtn.addEventListener('click', function (e) {
                e.preventDefault();
                kembali();
            });
        }

        // Klik overlay di luar popup → tutup
        var overlay = document.getElementById('hapusUnitOverlay');
        if (overlay) {
            overlay.addEventListener('click', handleOverlayClick);
        }

        // Keyboard: Escape → tutup
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                kembali();
            }
        });

    });

})();

