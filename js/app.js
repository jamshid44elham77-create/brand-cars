'use strict';

// ==================================================
// 1. CAR CATALOG
// ==================================================

const money = value => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
}).format(value);

const selected = new Set();

const search = document.getElementById('search');
const brand = document.getElementById('brand');
const sort = document.getElementById('sort');
const list = document.getElementById('car-list');
const onInventory = !!document.getElementById('comparison');

function renderCars() {
    const query = search.value.trim().toLowerCase();

    const results = cars.filter(car => {
        const text =
            `${car.brand} ${car.model} ${car.edition}`.toLowerCase();

        return text.includes(query) &&
            (!brand.value || car.brand === brand.value);
    });

    if (sort.value !== 'featured') {
        results.sort((a, b) =>
            sort.value === 'low'
                ? a.price - b.price
                : b.price - a.price
        );
    }

    list.replaceChildren();

    for (const car of results) {
        const card = document.createElement('article');

        card.className = 'listing';
        card.id = car.id;

        // Values come from the fixed catalog, not user input.
        card.innerHTML = `
            <img
                src="images/${car.image}"
                alt="${car.brand} ${car.model}, representative model photo"
                loading="lazy"
            >

            <div class="listing-body">
                <p class="eyebrow">
                    ${car.brand} / ${car.edition}
                </p>

                <h3>${car.model}</h3>

                <p>${car.power} hp · Demonstration listing</p>

                <strong>${money(car.price)}</strong>

                <div class="listing-actions">
                    <a
                        class="btn main-button"
                        href="inventory.html?car=${car.id}#buy-car"
                    >
                        Request this car
                    </a>

                    ${onInventory ? `
                        <button
                            type="button"
                            class="btn compare-button"
                            data-compare="${car.id}"
                            aria-pressed="${selected.has(car.id)}"
                        >
                            ${selected.has(car.id)
                                ? 'Remove comparison'
                                : 'Compare'}
                        </button>
                    ` : `
                        <a
                            class="text-button"
                            href="inventory.html#compare"
                        >
                            Compare cars →
                        </a>
                    `}
                </div>
            </div>
        `;

        list.append(card);
    }

    document.getElementById('result-count').textContent =
        `${results.length} of ${cars.length} listings`;

    document.getElementById('empty').hidden =
        results.length !== 0;
}

function clearFilters() {
    search.value = '';
    brand.value = '';
    sort.value = 'featured';

    renderCars();
}

search.addEventListener('input', renderCars);
brand.addEventListener('change', renderCars);
sort.addEventListener('change', renderCars);

document.getElementById('clear-filters')
    .addEventListener('click', clearFilters);

search.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        clearFilters();
        search.focus();
    }
});

renderCars();

// ==================================================
// 2. COMPARISON GARAGE
// ==================================================

function renderComparison() {
    const picks = cars.filter(car => selected.has(car.id));
    const area = document.getElementById('comparison');

    if (!picks.length) {
        area.innerHTML =
            '<p>Your garage is empty. Add a car above to begin.</p>';

        return;
    }

    const average = picks.reduce(
        (total, car) => total + car.price,
        0
    ) / picks.length;

    area.innerHTML = `
        <table class="table">
            <caption>
                ${picks.length} selected ·
                Average price ${money(average)}
            </caption>

            <thead>
                <tr>
                    <th scope="col">Vehicle</th>
                    <th scope="col">Edition</th>
                    <th scope="col">Price</th>
                    <th scope="col">Power</th>
                </tr>
            </thead>

            <tbody>
                ${picks.map(car => `
                    <tr>
                        <th scope="row">
                            ${car.brand} ${car.model}
                        </th>
                        <td>${car.edition}</td>
                        <td>${money(car.price)}</td>
                        <td>${car.power} hp</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

if (onInventory) {
    renderComparison();

    list.addEventListener('click', event => {
        const button = event.target.closest('[data-compare]');

        if (!button) return;

        const id = button.dataset.compare;
        const status = document.getElementById('compare-status');

        if (selected.has(id)) {
            selected.delete(id);
            hideComparisonNotice();
        } else if (selected.size >= 3) {
            const message =
                'You can compare only 3 cars. ' +
                'Remove one before adding another.';

            status.textContent = message;
            showComparisonNotice(message);

            return;
        } else {
            selected.add(id);
        }

        button.setAttribute(
            'aria-pressed',
            String(selected.has(id))
        );

        button.textContent = selected.has(id)
            ? 'Remove comparison'
            : 'Compare';

        status.textContent =
            `${selected.size} of 3 comparison spaces used.`;

        renderComparison();
    });

    document.getElementById('clear-compare')
        .addEventListener('click', () => {
            selected.clear();
            hideComparisonNotice();

            renderCars();
            renderComparison();

            document.getElementById('compare-status').textContent =
                'Comparison cleared.';
        });
}

// ==================================================
// 3. FORM VALIDATION
// ==================================================

const form = document.getElementById('request-form');

if (form) {
    const carSelect = document.getElementById('carModel');

    for (const car of cars) {
        carSelect.add(new Option(
            `${car.brand} ${car.model} — ` +
            `${car.edition} — ${money(car.price)}`,
            car.id
        ));
    }

    const requested =
        new URLSearchParams(location.search).get('car');

    if (cars.some(car => car.id === requested)) {
        carSelect.value = requested;
    }

    const fields = [
        ...form.querySelectorAll('input, select, textarea')
    ];

    const touched = new Set();

    function today() {
        const date = new Date();

        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0')
        ].join('-');
    }

    document.getElementById('preferredDate').min = today();

    function errorFor(field) {
        const value = field.value.trim();

        if (
            field.required &&
            (field.type === 'checkbox' ? !field.checked : !value)
        ) {
            return field.type === 'checkbox'
                ? 'Please confirm that your information is correct.'
                : 'Please complete this field.';
        }

        if (
            field.id === 'email' &&
            value &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
            return 'Enter an email such as name@example.com.';
        }

        if (field.id === 'phone' && value) {
            const digits = value.replace(/\D/g, '');

            if (
                !/^\+?[\d\s()-]+$/.test(value) ||
                digits.length < 7 ||
                digits.length > 15
            ) {
                return 'Use 7–15 digits, with an optional +, ' +
                    'spaces or brackets.';
            }
        }

     if (field.id === 'fullName') {
    const letters = value.match(/\p{L}/gu) || [];

    if (letters.length < 2) {
        return 'Enter a name containing at least two letters.';
    }

    if (!/^[\p{L}\p{M}\s'’.-]+$/u.test(value)) {
        return 'Use letters, spaces, hyphens, apostrophes or periods. Numbers are not allowed.';
    }
}
        if (
            field.id === 'budget' &&
            (
                field.validity.badInput ||
                (
                    value &&
                    (
                        !Number.isFinite(Number(value)) ||
                        Number(value) <= 0
                    )
                )
            )
        ) {
            return 'Enter a budget greater than zero.';
        }

        if (field.id === 'preferredDate') {
            const requestType =
                document.getElementById('requestType').value;

            if (requestType === 'test-drive' && !value) {
                return 'Choose a date for your test drive.';
            }

            if (
                value &&
                (
                    value < today() ||
                    !/^\d{4}-\d{2}-\d{2}$/.test(value)
                )
            ) {
                return 'Choose today or a future date.';
            }
        }

        return '';
    }

    function validate(field) {
        const error = errorFor(field);

        document.getElementById(
            `${field.id}-error`
        ).textContent = error;

        field.classList.toggle('is-invalid', !!error);

        field.setAttribute(
            'aria-invalid',
            String(!!error)
        );

        return !error;
    }

    for (const field of fields) {
        const error = document.createElement('div');

        error.id = `${field.id}-error`;
        error.className = 'invalid-feedback';

        field.insertAdjacentElement('afterend', error);
        field.setAttribute('aria-describedby', error.id);

        field.addEventListener('blur', () => {
            touched.add(field.id);
            validate(field);
        });

        for (const event of ['input', 'change']) {
            field.addEventListener(event, () => {
                document.getElementById(
                    'form-success'
                ).style.display = 'none';

                if (touched.has(field.id)) {
                    validate(field);
                }

                if (
                    field.id === 'requestType' &&
                    touched.has('preferredDate')
                ) {
                    validate(
                        document.getElementById('preferredDate')
                    );
                }
            });
        }
    }

    form.addEventListener('submit', event => {
        event.preventDefault();

        fields.forEach(field => touched.add(field.id));

        const validity = fields.map(validate);

        if (validity.includes(false)) {
            fields[validity.indexOf(false)].focus();
            return;
        }

        const chosen = cars.find(
            car => car.id === carSelect.value
        );

        const message = document.getElementById('form-success');

        message.textContent =
            `Demo request complete for ${chosen.brand} ` +
            `${chosen.model}. No booking or payment was made, ` +
            'and your information was not sent or saved.';

        form.reset();
        touched.clear();

        fields.forEach(field => {
            field.classList.remove('is-invalid');
            field.removeAttribute('aria-invalid');
        });

        if (window.jQuery) {
            jQuery(message)
                .stop(true, true)
                .hide()
                .fadeIn(220, () => message.focus());
        } else {
            message.style.display = 'block';
            message.focus();
        }
    });
}

// ==================================================
// 4. JQUERY EFFECTS
// ==================================================

if (window.jQuery) {
    const $ = jQuery;

    $.fx.off = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // FAQ animation.
    $('.accordion-button').each(function () {
        const target =
            this.getAttribute('data-faq-target') ||
            this.getAttribute('data-bs-target');

        if (!target) return;

        this.removeAttribute('data-bs-toggle');

        const panel = $(target);
        const open = panel.hasClass('show');

        panel.removeClass('collapse show').toggle(open);

        $(this).attr({
            'aria-controls': target.slice(1),
            'aria-expanded': String(open)
        });

        $(this).on('click', function () {
            const expanded =
                this.getAttribute('aria-expanded') === 'true';

            $(this)
                .attr('aria-expanded', String(!expanded))
                .toggleClass('collapsed', expanded);

            panel.stop(true, true).slideToggle(180);
        });
    });

    // Smooth scrolling to sections on the current page.
    $('a[href^="#"]').on('click', function (event) {
        const target =
            document.getElementById(this.hash.slice(1));

        if (!target) return;

        event.preventDefault();

        const menu = document.getElementById('mainNavbar');

        if (
            this.closest('.brand-navbar') &&
            menu &&
            window.bootstrap
        ) {
            const collapse =
                bootstrap.Collapse.getOrCreateInstance(
                    menu,
                    { toggle: false }
                );

            if (menu.classList.contains('collapsing')) {
                menu.addEventListener(
                    'shown.bs.collapse',
                    () => collapse.hide(),
                    { once: true }
                );
            } else {
                collapse.hide();
            }
        }

        $('html, body')
            .stop(true, true)
            .animate({
                scrollTop: Math.max(
                    0,
                    $(target).offset().top - 90
                )
            }, 250)
            .promise()
            .done(function () {
                window.scrollTo({
                    top: Math.max(
                        0,
                        target.getBoundingClientRect().top +
                        window.scrollY - 90
                    ),
                    behavior: 'instant'
                });

                updateActiveNavigation();
            });

        history.replaceState(null, '', this.hash);

        if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1');
        }

        target.focus({ preventScroll: true });
    });
}

// ==================================================
// 5. NAVIGATION UNDERLINE WHILE SCROLLING
// ==================================================

function updateActiveNavigation() {
    const links = [
        ...document.querySelectorAll('.brand-navbar .nav-link')
    ];

    if (!links.length) return;

    const navbar = document.querySelector('.brand-navbar');
    const logo = navbar.querySelector('.navbar-brand');

    const headerHeight = logo ? logo.offsetHeight + 34 : 80;
    const marker = headerHeight + 60;

    const hasInventory =
        !!document.getElementById('inventory');

    let activeName = hasInventory ? 'collection' : 'home';

    const sections = [
        {
            element:
                document.getElementById('collection') ||
                document.getElementById('inventory'),
            name: 'collection'
        },
        {
            element: document.getElementById('compare'),
            name: 'compare'
        },
        {
            element: document.getElementById('buy-car'),
            name: 'buy'
        }
    ].filter(section => section.element);

    for (const section of sections) {
        if (
            section.element.getBoundingClientRect().top <= marker
        ) {
            activeName = section.name;
        }
    }

    for (const link of links) {
        const url = new URL(link.href, location.href);

        const page =
            url.pathname.split('/').pop() || 'index.html';

        let name = page === 'index.html'
            ? 'home'
            : 'collection';

        if (url.hash === '#home') {
            name = 'home';
        }

        if (
            url.hash === '#collection' ||
            url.hash === '#inventory'
        ) {
            name = 'collection';
        }

        if (url.hash === '#compare') {
            name = 'compare';
        }

        if (url.hash === '#buy-car') {
            name = 'buy';
        }

        const active = name === activeName;

        link.classList.toggle('active', active);

        if (active) {
            link.setAttribute(
                'aria-current',
                activeName === 'home' ? 'page' : 'location'
            );
        } else {
            link.removeAttribute('aria-current');
        }
    }
}

let navigationUpdatePending = false;

function scheduleNavigationUpdate() {
    if (navigationUpdatePending) return;

    navigationUpdatePending = true;

    window.requestAnimationFrame(() => {
        navigationUpdatePending = false;
        updateActiveNavigation();
    });
}

window.addEventListener(
    'scroll',
    scheduleNavigationUpdate,
    { passive: true }
);

for (const event of [
    'resize',
    'load',
    'pageshow',
    'hashchange',
    'popstate'
]) {
    window.addEventListener(
        event,
        scheduleNavigationUpdate
    );
}

if ('ResizeObserver' in window) {
    const navigationObserver = new ResizeObserver(
        scheduleNavigationUpdate
    );

    navigationObserver.observe(document.body);
}

updateActiveNavigation();

// ==================================================
// 6. ON-SCREEN COMPARISON NOTIFICATION
// ==================================================

const comparisonNotice = document.createElement('div');

comparisonNotice.className = 'comparison-notice';
comparisonNotice.hidden = true;

const comparisonNoticeText = document.createElement('span');

comparisonNoticeText.setAttribute('role', 'status');
comparisonNoticeText.setAttribute('aria-live', 'polite');
comparisonNoticeText.setAttribute('aria-atomic', 'true');

const comparisonNoticeClose = document.createElement('button');

comparisonNoticeClose.type = 'button';
comparisonNoticeClose.className = 'comparison-notice-close';

comparisonNoticeClose.setAttribute(
    'aria-label',
    'Dismiss notification'
);

comparisonNoticeClose.textContent = '×';

comparisonNotice.append(
    comparisonNoticeText,
    comparisonNoticeClose
);

document.body.append(comparisonNotice);

let comparisonNoticeTimer;
let comparisonNoticeTrigger;

function hideComparisonNotice() {
    clearTimeout(comparisonNoticeTimer);

    if (comparisonNotice.contains(document.activeElement)) {
        comparisonNoticeTrigger?.focus({
            preventScroll: true
        });
    }

    comparisonNotice.hidden = true;
    comparisonNoticeText.textContent = '';
}

function showComparisonNotice(message) {
    clearTimeout(comparisonNoticeTimer);

    comparisonNoticeTrigger = document.activeElement;
    comparisonNotice.hidden = false;
    comparisonNoticeText.textContent = message;

    // Repeated clicks restart the timer.
    comparisonNoticeTimer = setTimeout(
        hideComparisonNotice,
        6000
    );
}

comparisonNoticeClose.addEventListener(
    'click',
    hideComparisonNotice
);

document.addEventListener('keydown', function (event) {
    if (
        event.key === 'Escape' &&
        !comparisonNotice.hidden
    ) {
        hideComparisonNotice();
    }
});

// ==================================================
// 7. SAVE AND RESTORE WEBSITE DATA
// ==================================================

const savedStateKey = 'brandCarsStateV1';

// Read saved data safely.
function readSavedState() {
    try {
        const text = localStorage.getItem(savedStateKey);

        if (!text) return {};

        const data = JSON.parse(text);

        return data && typeof data === 'object'
            && !Array.isArray(data)
            ? data
            : {};
    } catch (error) {
        // The website still works if storage is unavailable.
        return {};
    }
}

// Update only the supplied parts of the saved data.
function saveState(changes) {
    try {
        const current = readSavedState();

        localStorage.setItem(
            savedStateKey,
            JSON.stringify({
                ...current,
                ...changes
            })
        );
    } catch (error) {
        // Storage may be disabled or full.
        // Do not interrupt normal website functionality.
    }
}

const savedState = readSavedState();

// --------------------------------------------------
// A. Restore search, brand and sorting
// --------------------------------------------------

if (search && brand && sort) {
    const filters = savedState.filters;

    if (filters && typeof filters === 'object') {
        if (typeof filters.search === 'string') {
            search.value = filters.search;
        }

        if (
            typeof filters.brand === 'string' &&
            [...brand.options].some(
                option => option.value === filters.brand
            )
        ) {
            brand.value = filters.brand;
        }

        if (
            typeof filters.sort === 'string' &&
            [...sort.options].some(
                option => option.value === filters.sort
            )
        ) {
            sort.value = filters.sort;
        }
    }

    function saveFilters() {
        saveState({
            filters: {
                search: search.value,
                brand: brand.value,
                sort: sort.value
            }
        });
    }

    search.addEventListener('input', saveFilters);
    brand.addEventListener('change', saveFilters);
    sort.addEventListener('change', saveFilters);

    document.getElementById('clear-filters')
        ?.addEventListener('click', saveFilters);

    search.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            saveFilters();
        }
    });
}

// --------------------------------------------------
// B. Restore selected comparison cars
// --------------------------------------------------

if (Array.isArray(savedState.comparison)) {
    selected.clear();

    for (const id of savedState.comparison) {
        const exists = cars.some(car => car.id === id);

        if (exists && selected.size < 3) {
            selected.add(id);
        }
    }
}

// Rebuild cards after restoring filters and selections.
if (list && search && brand && sort) {
    renderCars();
}

if (onInventory) {
    renderComparison();

    document.getElementById('compare-status').textContent =
        `${selected.size} of 3 comparison spaces used.`;

    // Existing click handlers update the selection first.
    // This handler then saves the updated selection.
    list.addEventListener('click', function (event) {
        if (!event.target.closest('[data-compare]')) return;

        saveState({
            comparison: [...selected]
        });
    });

    document.getElementById('clear-compare')
        .addEventListener('click', function () {
            saveState({
                comparison: []
            });
        });
}

// --------------------------------------------------
// C. Restore and save an unfinished form
// --------------------------------------------------

if (form) {
    const draftFields = [
        ...form.querySelectorAll('input, select, textarea')
    ].filter(field =>
        field.id &&
        field.id !== 'agreement' &&
        field.type !== 'password' &&
        field.type !== 'file'
    );

    const draft = savedState.formDraft;

    // A car explicitly chosen through "Request this car"
    // takes priority over the previously saved car.
    const requestedCar =
        new URLSearchParams(location.search).get('car');

    const hasRequestedCar = cars.some(
        car => car.id === requestedCar
    );

    if (
        draft &&
        typeof draft === 'object' &&
        !Array.isArray(draft)
    ) {
        for (const field of draftFields) {
            if (field.id === 'carModel' && hasRequestedCar) {
                continue;
            }

            const value = draft[field.id];

            if (typeof value !== 'string') continue;

            // Ignore saved options that no longer exist.
            if (
                field.tagName === 'SELECT' &&
                ![...field.options].some(
                    option => option.value === value
                )
            ) {
                continue;
            }

            field.value = value;
        }
    }

    function saveFormDraft() {
        const values = {};

        for (const field of draftFields) {
            values[field.id] = field.value;
        }

        saveState({
            formDraft: values
        });
    }

    form.addEventListener('input', saveFormDraft);
    form.addEventListener('change', saveFormDraft);

    // Your existing successful submission calls form.reset().
    // Remove the saved draft when that happens.
    form.addEventListener('reset', function () {
        saveState({
            formDraft: {}
        });
    });

    // Explain the feature and let the visitor erase the draft.
    const draftControls = document.createElement('div');
    draftControls.className = 'mt-3';

    const draftNote = document.createElement('p');
    draftNote.className = 'form-disclaimer';
    draftNote.textContent =
        'Your unfinished form is saved in this browser on this ' +
        'device. It is not sent to us. A successful submission ' +
        'clears the saved draft.';

    const forgetDraftButton = document.createElement('button');
    forgetDraftButton.type = 'button';
    forgetDraftButton.className = 'btn compare-button';
    forgetDraftButton.textContent = 'Clear saved form';

    const draftStatus = document.createElement('p');
    draftStatus.className = 'form-disclaimer mt-2';
    draftStatus.setAttribute('role', 'status');

    forgetDraftButton.addEventListener('click', function () {
        form.reset();

        form.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });

        form.querySelectorAll('[aria-invalid]').forEach(field => {
            field.removeAttribute('aria-invalid');
        });

        form.querySelectorAll('.invalid-feedback').forEach(error => {
            error.textContent = '';
        });

        const successMessage =
            document.getElementById('form-success');

        if (successMessage) {
            successMessage.style.display = 'none';
        }

        draftStatus.textContent =
            'The form and its saved draft have been cleared.';
    });

    draftControls.append(
        draftNote,
        forgetDraftButton,
        draftStatus
    );

    form.append(draftControls);
}

// Recheck the navigation after restoring content.
scheduleNavigationUpdate();