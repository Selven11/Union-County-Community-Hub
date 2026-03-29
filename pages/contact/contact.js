document.addEventListener('DOMContentLoaded', function () {

    const submitBtn = document.querySelector('.btn-submit-green');
    const modal = document.getElementById('thank-you-modal');
    const closeBtn = document.getElementById('modal-close');
    const banner = document.getElementById('validation-banner');

    const form = document.querySelector('.signup-form');

    submitBtn.addEventListener('click', function () {

        const firstName = form.querySelectorAll('input[type="text"]')[0].value.trim();
        const lastName = form.querySelectorAll('input[type="text"]')[1].value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const phone = form.querySelector('input[type="tel"]').value.trim();
        const recommendation = form.querySelector('textarea').value.trim();

        const namesFilled = firstName !== '' && lastName !== '';
        const contactFilled = email !== '' || phone !== '';
        const recommendationFilled = recommendation !== '';

        if (!namesFilled || !contactFilled || !recommendationFilled) {
            banner.classList.add('active');
            // scroll to top so user sees the banner
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // if validation passes, hide banner
        banner.classList.remove('active');

        // clear all fields
        form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
            input.value = '';
        });
        form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        form.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });
        form.querySelectorAll('textarea').forEach(textarea => {
            textarea.value = '';
        });

        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', function () {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.remove('active');
    });

    // hide banner as soon as user starts correcting fields
    form.addEventListener('input', function () {
        banner.classList.remove('active');
    });

});