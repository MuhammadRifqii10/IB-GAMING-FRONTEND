/**
 * edit-menu.js
 * Popup Edit Menu F & B — hanya interaksi UI, tanpa backend.
 */

(function () {
    'use strict';

    var KELOLA_MENU_URL = 'kelola-menu.html';
    var MAX_SIZE = 2 * 1024 * 1024; // 2MB

    function kembali() {
        window.location.href = KELOLA_MENU_URL;
    }

    document.addEventListener('DOMContentLoaded', function () {

        var closeBtn = document.getElementById('editMenuClose');
        var batalBtn = document.getElementById('editMenuBatal');
        var overlay  = document.getElementById('editMenuOverlay');
        var form     = document.getElementById('editMenuForm');
        var upload   = document.getElementById('editMenuUpload');
        var fileIn   = document.getElementById('editMenuGambar');
        var preview  = document.getElementById('editMenuPreview');

        if (closeBtn) closeBtn.addEventListener('click', kembali);

        if (batalBtn) {
            batalBtn.addEventListener('click', function (e) {
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

        // Ganti preview dengan gambar yang dipilih
        function showPreview(file) {
            if (!file) return;

            if (!/^image\/(png|jpeg)$/.test(file.type)) {
                alert('Format file harus JPG atau PNG.');
                fileIn.value = '';
                return;
            }
            if (file.size > MAX_SIZE) {
                alert('Ukuran file maksimal 2MB.');
                fileIn.value = '';
                return;
            }

            var reader = new FileReader();
            reader.onload = function (ev) {
                preview.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        }

        if (fileIn) {
            fileIn.addEventListener('change', function () {
                showPreview(fileIn.files[0]);
            });
        }

        // Drag & drop
        if (upload) {
            ['dragenter', 'dragover'].forEach(function (evt) {
                upload.addEventListener(evt, function (e) {
                    e.preventDefault();
                    upload.classList.add('is-dragover');
                });
            });

            ['dragleave', 'drop'].forEach(function (evt) {
                upload.addEventListener(evt, function (e) {
                    e.preventDefault();
                    upload.classList.remove('is-dragover');
                });
            });

            upload.addEventListener('drop', function (e) {
                var file = e.dataTransfer && e.dataTransfer.files[0];
                if (file) {
                    try {
                        var dt = new DataTransfer();
                        dt.items.add(file);
                        fileIn.files = dt.files;
                    } catch (err) { /* browser lama: abaikan */ }
                    showPreview(file);
                }
            });
        }

        // Simpan Perubahan -> simulasi, kembali ke Kelola Menu
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                kembali();
            });
        }

    });

})();

