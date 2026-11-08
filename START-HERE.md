# Brand Cars — Endterm upgrade

Student: Jamshid Elham. Individual project: two pages.

Open index.html in your browser, or open this folder in VS Code and use Live Server. Bootstrap and jQuery are included locally; Google Fonts requires internet access. This is a front-end demonstration: requests are validated but never sent, stored or booked.

## What changed

- Preserved the two midterm pages, original CSS, original photos and visual identity.
- Added eight fictional listings (two demonstration editions of each original model), generated from the array in js/cars.js.
- Added search, brand filtering, price sorting, result count, empty state and Escape-to-reset search on both pages.
- Added a three-car comparison garage with a calculated average price.
- Replaced the alert-only request form with inline validation, success feedback and reset. Checks include required fields, email, phone, name length, positive budget, and dates. A date is required for test drives.
- Added jQuery FAQ sliding, smooth scrolling and success-message fading, with animation-queue clearing and reduced-motion support.
- Added current-page navigation, skip navigation, keyboard focus styles and credit disclosure.

## Teacher feedback and code map

Feedback: the visual style and presentation were good, but CSS explanations and locating elements needed improvement. Preserve the design and practice locating these files:

| Feature | Where to look | Explain it this way |
| --- | --- | --- |
| Original visual design | css/style.css, labeled section comments | CSS variables keep the same red, black, fonts and spacing throughout the website. |
| Hero photograph | .hero-background and .hero-overlay | Absolute positioning fills the relative hero section. Gradients keep text readable over the photo. |
| Responsive headings | clamp() in css/style.css | The font grows with viewport width between minimum and maximum sizes. |
| New card grid | .endterm-grid in css/endterm.css | Grid gives two equal columns; the media query changes it to one on small screens. minmax(0,1fr) prevents content from forcing columns wider. |
| Eight listings | js/cars.js | An array holds objects with id, brand, model, edition, price, power and image. |
| Search and sort | renderCars() in js/app.js | filter keeps matching objects; sort orders prices; a loop creates DOM cards. |
| Comparison | renderComparison() | A Set avoids duplicate selections. A condition limits selection to three. reduce sums prices, divided by the count for the average. |
| Validation | errorFor() and validate() | errorFor returns a clear message. validate updates the field's message, Bootstrap class and accessibility state. |
| Form success | submit listener | preventDefault avoids reload; every field is checked before reset. No backend is connected. |
| jQuery effects | Section 4 in js/app.js | slideToggle, animate and fadeIn give three different effects. stop(true,true) clears queued animations. |

Use VS Code Ctrl+P to open a file, then Ctrl+F to find the function or CSS selector. Practice changing the card gap, the accent color, the comparison limit and one car's price yourself.

## Two-minute defense practice

0:00–0:20: show the original visual identity and explain the eight data-driven listings.
0:20–0:40: search, filter and sort; demonstrate an empty result.
0:40–0:55: compare cars and explain the calculated average.
0:55–1:15: submit an invalid form, correct it, then show success and reset.
1:15–1:30: show the FAQ effect and mobile layout.
1:30–2:00: open the requested code immediately and explain why it works.

## Checks performed

Browser checks in Microsoft Edge: both pages at 375, 768 and 1280 pixels; eight cards; no horizontal overflow; search empty state; BMW filter; three-car comparison limit; required validation; mandatory test-drive date; successful form and clearing; FAQ effect; jQuery loaded; no JavaScript page errors recorded. Deployment and live GitHub Pages checks have not been performed.

## Still required before submission

- Individual project confirmed: Jamshid Elham; the two-page minimum is met.
- Photo source supplied by Jamshid Elham: Khyzyl Saleem, https://www.artstation.com/khyzylsaleem. This portfolio attribution does not independently verify the exact artwork pages or usage rights.
- The accompanying PDF report includes the project details and feature screenshots. Confirm the deployed website address and update the report deployment status before submission.
- Repository found in the supplied ZIP: https://github.com/jamshid44elham77-create/brand-cars
- Deploy to the SAME repository and verify its actual GitHub Pages address. No deployment has been made by this upgrade.
- Name final deliverables Endterm_FullName1_FullName2.zip and Endterm_FullName1_FullName2.docx (or .pdf), using the actual names.
- Make genuine commits as you review and develop your work before the deadline. This package does not manufacture a contribution history.

## Credits to carry into the report

Original midterm source and supplied images: provided by the student; photo source identified by Jamshid Elham as Khyzyl Saleem, https://www.artstation.com/khyzylsaleem. Bootstrap 5.3.3 (https://getbootstrap.com): layout, forms and navigation; MIT license notice retained in distributed files. jQuery 3.7.1 (https://jquery.com): interface effects; license notice retained. Google Fonts (https://fonts.google.com): Bebas Neue and Manrope. Stock editions and prices are fictional academic content, not dealership offers.

The ZIP excludes the original .git directory. Copy the updated site files into your existing checkout so you retain your repository and real commit history. Keep your original ZIP as a backup.
