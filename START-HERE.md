# Brand Cars — Final Project

**Student:** Jamshid Elham  
**Course:** Web Technologies 1 — Front End  
**Project type:** Individual project  
**Pages:** Home and Collection

## Project overview

Brand Cars is a fictional premium-car dealership website developed through the midterm, endterm and final stages.

Visitors can search for cars, filter and sort listings, compare vehicles and complete a demonstration purchase or test-drive request. The website remembers selected cars, unfinished form details and the visitor’s preferred appearance.

This is a front-end demonstration. No real payment, booking or customer request is processed. Saved information stays in the visitor’s browser through localStorage.

## How to open the project

1. Open the `brand-cars` folder in VS Code.
2. Open `index.html`.
3. Start the website using Live Server.
4. Use the navigation menu to explore the sections.
5. Use **Shop All Cars** to open the separate Collection page.

Bootstrap and jQuery are included locally. Google Fonts requires an internet connection.

Use the same website address when testing saved data. `localhost`, `127.0.0.1` and GitHub Pages have separate browser storage.

## Pages

### Home — index.html

The Home page includes:

- Hero and introduction.
- Searchable vehicle collection.
- Comparison garage.
- Purchase and test-drive request form.
- Dealership benefits and process.
- Footer and project credits.

The navigation underline follows Home, Collection, Compare and Buy / Test Drive as the visitor scrolls through those sections.

### Collection — inventory.html

The dedicated Collection page includes:

- Vehicle listings and search controls.
- Car comparison.
- Customer-request form.
- Frequently asked questions.
- Navigation and theme controls.

The website retains two separate HTML pages to meet the individual-project page requirement.

## Development from midterm to final

### Midterm foundation

- Two-page website.
- Original black, cream and red visual identity.
- Vehicle images and informational sections.
- Responsive layouts using custom CSS and Bootstrap.
- Initial form and comparison content.

### Endterm functionality

- Eight vehicle-listing objects stored in `js/cars.js`.
- Cards generated through JavaScript DOM manipulation.
- Search, brand filtering and price sorting.
- Result count, empty-result message and reset controls.
- Comparison of up to three vehicles.
- Calculated average price.
- Inline form validation, success feedback and form reset.
- jQuery FAQ sliding, smooth scrolling and success-message fading.

### Later refinements and final-stage additions

- Light and dark modes on both pages.
- Persistent theme preference using localStorage.
- Saved comparison selections across pages and reloads.
- Saved unfinished form details and filter settings.
- A button to clear the saved form.
- Scrolling navigation highlighting.
- An on-screen notification when attempting to compare a fourth car.
- Improved comparison-table spacing, colors and hover states.
- More readable FAQ typography.
- Stronger full-name validation to reject numeric names.

The final-stage theme system extends the existing website. Features added during earlier refinements remain part of the final version rather than being presented as entirely new.

## Light and dark modes

The navigation contains a button for switching between light and dark modes.

- Both modes use CSS variables.
- The chosen mode remains after refreshing.
- The same preference applies when opening another page.
- The button works with the keyboard.
- Cards, forms, tables, FAQs and notifications adapt to the selected theme.

**Files:** `js/theme.js` and `css/final.css`  
**Storage key:** `brandCarsTheme`

## Saved user data

Website state is saved as JSON under the `brandCarsStateV1` localStorage key.

### Comparison selections

- Select up to three cars.
- Open the other page to view the saved selections.
- Refresh without losing the selected cars.
- Remove individual cars using their comparison buttons.
- Use **Clear comparison** to remove all selections.

The comparison displays the selection count and average price.

### Search settings

The website remembers the search text, selected brand and sorting option.

Use **Reset filters** to return to the complete collection.

### Form draft

Unfinished form values are saved while typing or changing fields.

- Refreshing restores the draft.
- The agreement checkbox must be confirmed again.
- A vehicle explicitly chosen through **Request this car** takes priority over a previously saved vehicle.
- Successful submission clears the form and saved draft.
- **Clear saved form** removes the draft manually.

This feature uses browser storage, not a server or database.

## Form validation

The customer-request form checks:

- Required fields.
- Full name containing letters rather than numbers.
- Email format.
- Phone format with 7–15 digits.
- Positive budget values.
- Current or future dates.
- A required date for test-drive requests.
- Confirmation of the agreement checkbox.

Errors appear beneath the relevant fields. Correcting the input updates the error state.

A valid submission displays a demonstration success message and clears the form.

## JavaScript and jQuery features

The website responds to `click`, `input`, `change`, `submit` and `keydown` events.

JavaScript handles the catalog, calculations, validation, navigation and saved data.

jQuery provides:

- `slideToggle()` for FAQ answers.
- `animate()` for section scrolling.
- `fadeIn()` for successful form feedback.

Animation queues are managed with `.stop(true, true)`, and reduced-motion preferences are respected.

## Folder structure

```text
brand-cars/
├── index.html
├── inventory.html
├── START-HERE.md
├── css/
│   ├── bootstrap.min.css
│   ├── style.css
│   ├── endterm.css
│   └── final.css
├── js/
│   ├── cars.js
│   ├── app.js
│   ├── theme.js
│   └── vendor/
│       ├── bootstrap.bundle.min.js
│       └── jquery.min.js
└── images/
    ├── hero-car.jpg
    ├── lamborghini.jpg
    ├── bmw.jpg
    ├── mercedes.jpg
    └── porsche.jpg
```

## Code map

| Feature | Where to look | Explanation |
|---|---|---|
| Original appearance | `css/style.css` | Colors, typography, hero overlays and base layouts. |
| Interactive-state styling | `css/endterm.css` | Cards, comparison table, FAQ typography, notifications and focus states. |
| Theme colors | `css/final.css` | CSS variables and component styles for both modes. |
| Theme toggle | `js/theme.js` | Changes the active theme and saves the preference. |
| Vehicle data | `js/cars.js` | Eight objects containing listing details. |
| Search and sorting | `renderCars()` in `js/app.js` | Filters and sorts the array, then creates cards. |
| Comparison | `renderComparison()` | Displays selected vehicles and calculates their average price. |
| Selection limit | Comparison click handler | Prevents adding more than three vehicles. |
| Notification | `showComparisonNotice()` | Displays the comparison-limit message on screen. |
| Validation | `errorFor()` and `validate()` | Checks input and displays field-specific feedback. |
| Navigation underline | `updateActiveNavigation()` | Highlights the section reached while scrolling. |
| Saved data | `readSavedState()` and `saveState()` | Reads and writes JSON through localStorage. |
| Form draft | `saveFormDraft()` | Saves unfinished field values. |

Use **Ctrl + P** to open a file and **Ctrl + F** to locate a function or selector.

## Final testing checklist

Complete these checks on the published version after uploading the latest files.

### Appearance and layout

- Check both pages at 375px, 768px and 1280px.
- Repeat the checks in light and dark modes.
- Check for overlapping or clipped content.
- Confirm that the page does not scroll horizontally.
- Confirm that the comparison table remains usable on mobile.

### Navigation and accessibility

- Test every navigation link and button.
- Check the active navigation underline.
- Open and close the mobile menu.
- Navigate using Tab and activate buttons with the keyboard.
- Check visible focus indicators.
- Check image alternative text and heading order.

### Saved data

- Change theme, refresh and open the other page.
- Select cars on Home and view them on Collection.
- Refresh and confirm that selections remain.
- Remove one selection and verify its removal after refreshing.
- Clear all selections.
- Enter an unfinished form draft and refresh.
- Confirm that successful submission clears the saved draft.

### Interactions and validation

- Search for a known model.
- Filter by brand and sort in both price directions.
- Search for `xyz123` and check the empty state.
- Reset filters and confirm that all eight listings return.
- Attempt to select a fourth car.
- Test empty fields and invalid names, emails, phone numbers, budgets and dates.
- Submit valid demonstration information.
- Test FAQ effects and repeated clicks.

### Release checks

- Inspect the browser Console for errors.
- Validate both HTML pages using the W3C validator.
- Check the deployed site for missing images, broken links and 404 pages.
- Review the accuracy of vehicle labels and imagery.
- Verify that project credits appear on the website and in the report.

## Content notes

The catalog contains eight demonstration listings based on four vehicle models. Prices and edition labels are fictional academic data.

“Signature” and “Touring selection” are demonstration labels, not verified manufacturer packages. Their names and prices should not be interpreted as evidence of different real-world equipment.

Vehicle artwork is illustrative. Review any image/model mismatches before presenting the website as a finished portfolio project.

## Teacher feedback

The earlier midterm feedback praised the visual style and presentation but identified a need for clearer CSS explanations and faster code navigation.

The organized files and code map support that improvement. Personal practice is still necessary to explain the project confidently.



## Two-minute defense practice

- **0:00–0:10:** Introduce Brand Cars and its two pages.
- **0:10–0:25:** Switch themes and demonstrate persistence.
- **0:25–0:45:** Select cars, open the other page and show saved comparison data.
- **0:45–1:05:** Demonstrate form errors, correction and successful submission.
- **1:05–1:20:** Show search, empty results and a jQuery effect.
- **1:20–1:30:** Show the mobile layout.
- **1:30–2:00:** Answer questions and explain the requested code.

Have the website and VS Code open before the defense.

## Repository 

**GitHub repository:**  
https://github.com/jamshid44elham77-create/brand-cars


Continue using the original repository and preserve its history. Make genuine commits as improvements are completed, before the submission deadline.

## Final submission

Submit through the LMS Final exam folder:

- `Final_Jamshid_Elham.zip`
- `Final_Jamshid_Elham.docx` or `Final_Jamshid_Elham.pdf`

The report must include:

- Student name and individual contribution.
- Changes since the endterm.
- Actual endterm feedback and corresponding fixes.
- Screenshots of the new features.
- Credits for external tools, code and assets.
- GitHub repository URL.
- Verified deployed website URL.

This guide does not replace the required report.

## Asset and library references

- **Vehicle artwork:** Khyzyl Saleem’s ArtStation portfolio, identified as the source by Jamshid Elham: https://www.artstation.com/khyzylsaleem
- **Bootstrap 5.3.3:** responsive layout, forms and navigation: https://getbootstrap.com/
- **jQuery 3.7.1:** interface effects: https://jquery.com/
- **Google Fonts:** Bebas Neue and Manrope: https://fonts.google.com/

Retain the license notices included with the distributed libraries.