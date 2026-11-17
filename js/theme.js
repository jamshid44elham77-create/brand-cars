// Apply the saved theme before the page appears.
(() => {
    const key = 'brandCarsTheme';
    let mode = 'dark';

    try {
        const saved = localStorage.getItem(key);

        if (saved === 'light' || saved === 'dark') {
            mode = saved;
        }
    } catch (error) {
        // The toggle still works if storage is unavailable.
    }

    function applyTheme(value) {
        mode = value;

        document.documentElement.dataset.theme = mode;
        document.documentElement.dataset.bsTheme = mode;

        const button = document.getElementById('theme-toggle');

        if (button) {
            const nextMode = mode === 'dark' ? 'light' : 'dark';

            button.textContent =
                nextMode === 'light' ? 'Light mode' : 'Dark mode';

            button.setAttribute(
                'aria-label',
                `Switch to ${nextMode} mode`
            );
        }
    }

    applyTheme(mode);

    document.addEventListener('DOMContentLoaded', () => {
        const menu = document.querySelector(
            '.brand-navbar .navbar-nav'
        );

        if (!menu || document.getElementById('theme-toggle')) {
            return;
        }

        const item = document.createElement('li');
        item.className = 'nav-item theme-menu-item';

        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.type = 'button';
        button.className = 'theme-toggle';

        item.append(button);
        menu.append(item);

        applyTheme(mode);

        button.addEventListener('click', () => {
            applyTheme(mode === 'dark' ? 'light' : 'dark');

            try {
                localStorage.setItem(key, mode);
            } catch (error) {
                // Continue using the selected theme on this page.
            }
        });
    });

    // Update other open tabs when the saved theme changes.
    window.addEventListener('storage', event => {
        if (event.key === key || event.key === null) {
            applyTheme(
                event.newValue === 'light' ? 'light' : 'dark'
            );
        }
    });
})();