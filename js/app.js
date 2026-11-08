'use strict';
// 1. Catalog: array filtering, sorting, DOM creation and delegated click events.
const money = value => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}).format(value);
const selected = new Set();
const search = document.getElementById('search');
const brand = document.getElementById('brand');
const sort = document.getElementById('sort');
const list = document.getElementById('car-list');
const onInventory = !!document.getElementById('comparison');
function renderCars() {
  const query = search.value.trim().toLowerCase();
  const results = cars.filter(car => `${car.brand} ${car.model} ${car.edition}`.toLowerCase().includes(query) && (!brand.value || car.brand === brand.value));
  if (sort.value !== 'featured') results.sort((a,b) => sort.value === 'low' ? a.price-b.price : b.price-a.price);
  list.replaceChildren();
  for (const car of results) {
    const card = document.createElement('article');
    card.className = 'listing'; card.id = car.id;
    // All interpolated values below come from our fixed catalog, never user input.
    card.innerHTML = `<img src="images/${car.image}" alt="${car.brand} ${car.model}, representative model photo" loading="lazy"><div class="listing-body"><p class="eyebrow">${car.brand} / ${car.edition}</p><h3>${car.model}</h3><p>${car.power} hp · Demonstration listing</p><strong>${money(car.price)}</strong><div class="listing-actions"><a class="btn main-button" href="inventory.html?car=${car.id}#buy-car">Request this car</a>${onInventory ? `<button type="button" class="btn compare-button" data-compare="${car.id}" aria-pressed="${selected.has(car.id)}">${selected.has(car.id) ? 'Remove comparison' : 'Compare'}</button>` : '<a class="text-button" href="inventory.html#compare">Compare cars →</a>'}</div></div>`;
    list.append(card);
  }
  document.getElementById('result-count').textContent = `${results.length} of ${cars.length} listings`;
  document.getElementById('empty').hidden = results.length !== 0;
}
search.addEventListener('input',renderCars);
brand.addEventListener('change',renderCars);
sort.addEventListener('change',renderCars);
function clearFilters() { search.value=''; brand.value=''; sort.value='featured'; renderCars(); }
document.getElementById('clear-filters').addEventListener('click',clearFilters);
search.addEventListener('keydown',event => { if(event.key==='Escape') {clearFilters(); search.focus();} });
renderCars();

// 2. Comparison garage: selection limit, calculated average and accessible feedback.
function renderComparison() {
  const picks = cars.filter(car => selected.has(car.id));
  const area = document.getElementById('comparison');
  if(!picks.length) { area.innerHTML='<p>Your garage is empty. Add a car above to begin.</p>'; return; }
  const average = picks.reduce((total,car) => total+car.price,0)/picks.length;
  area.innerHTML=`<table class="table"><caption>${picks.length} selected · Average price ${money(average)}</caption><thead><tr><th scope="col">Vehicle</th><th scope="col">Edition</th><th scope="col">Price</th><th scope="col">Power</th></tr></thead><tbody>${picks.map(car=>`<tr><th scope="row">${car.brand} ${car.model}</th><td>${car.edition}</td><td>${money(car.price)}</td><td>${car.power} hp</td></tr>`).join('')}</tbody></table>`;
}
if(onInventory) {
  renderComparison();
  list.addEventListener('click',event=>{
    const button=event.target.closest('[data-compare]'); if(!button) return;
    const id=button.dataset.compare;
    const status=document.getElementById('compare-status');
    if(selected.has(id)) selected.delete(id);
    else if(selected.size===3) { status.textContent='Your garage holds three cars. Remove one before adding another.'; return; }
    else selected.add(id);
    button.setAttribute('aria-pressed',String(selected.has(id)));
    button.textContent=selected.has(id)?'Remove comparison':'Compare';
    status.textContent=`${selected.size} of 3 comparison spaces used.`;
    renderComparison();
  });
  document.getElementById('clear-compare').addEventListener('click',()=>{selected.clear(); renderCars(); renderComparison(); document.getElementById('compare-status').textContent='Comparison cleared.';});
}

// 3. Bootstrap form with inline validation. No personal data leaves the browser.
const form=document.getElementById('request-form');
if(form) {
  const carSelect=document.getElementById('carModel');
  for(const car of cars) carSelect.add(new Option(`${car.brand} ${car.model} — ${car.edition} — ${money(car.price)}`,car.id));
  const requested=new URLSearchParams(location.search).get('car');
  if(cars.some(car=>car.id===requested)) carSelect.value=requested;
  const fields=[...form.querySelectorAll('input,select,textarea')];
  const touched=new Set();
  const today=()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  document.getElementById('preferredDate').min=today();
  function errorFor(field) {
    const value=field.value.trim();
    if(field.required && (field.type==='checkbox' ? !field.checked : !value)) return field.type==='checkbox'?'Please confirm that your information is correct.':'Please complete this field.';
    if(field.id==='email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter an email such as name@example.com.';
    if(field.id==='phone' && value && (!/^\+?[\d\s()-]+$/.test(value) || value.replace(/\D/g,'').length<7 || value.replace(/\D/g,'').length>15)) return 'Use 7–15 digits, with an optional +, spaces or brackets.';
    if(field.id==='fullName' && value.length<2) return 'Enter at least two characters for your name.';
    if(field.id==='budget' && (field.validity.badInput || (value && (!Number.isFinite(Number(value)) || Number(value)<=0)))) return 'Enter a budget greater than zero.';
    if(field.id==='preferredDate') {
      if(document.getElementById('requestType').value==='test-drive' && !value) return 'Choose a date for your test drive.';
      if(value && (value<today() || !/^\d{4}-\d{2}-\d{2}$/.test(value))) return 'Choose today or a future date.';
    }
    return '';
  }
  function validate(field) {
    const error=errorFor(field);
    document.getElementById(`${field.id}-error`).textContent=error;
    field.classList.toggle('is-invalid',!!error);
    field.setAttribute('aria-invalid',String(!!error));
    return !error;
  }
  for(const field of fields) {
    const error=document.createElement('div'); error.id=`${field.id}-error`; error.className='invalid-feedback';
    field.insertAdjacentElement('afterend',error); field.setAttribute('aria-describedby',error.id);
    field.addEventListener('blur',()=>{touched.add(field.id);validate(field);});
    for(const event of ['input','change']) field.addEventListener(event,()=>{
      document.getElementById('form-success').style.display='none';
      if(touched.has(field.id)) validate(field);
      if(field.id==='requestType' && touched.has('preferredDate')) validate(document.getElementById('preferredDate'));
    });
  }
  form.addEventListener('submit',event=>{
    event.preventDefault(); fields.forEach(field=>touched.add(field.id));
    const validity=fields.map(validate);
    if(validity.includes(false)) { fields[validity.indexOf(false)].focus(); return; }
    const chosen=cars.find(car=>car.id===carSelect.value);
    const message=document.getElementById('form-success');
    message.textContent=`Demo request complete for ${chosen.brand} ${chosen.model}. No booking or payment was made, and your information was not sent or saved.`;
    form.reset(); touched.clear();
    fields.forEach(field=>{field.classList.remove('is-invalid');field.removeAttribute('aria-invalid');});
    if(window.jQuery) jQuery(message).stop(true,true).hide().fadeIn(220,()=>message.focus());
    else {message.style.display='block';message.focus();}
  });
}

// 4. jQuery effects: slideToggle FAQ, animate scrolling, fadeIn form success.
// stop(true,true) clears queued animations when visitors click repeatedly.
if(window.jQuery) {
  const $=jQuery;
  $.fx.off=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('.accordion-button').each(function(){
    const target=this.getAttribute('data-faq-target') || this.getAttribute('data-bs-target');
    if(!target) return;
    this.removeAttribute('data-bs-toggle');
    const panel=$(target); const open=panel.hasClass('show');
    panel.removeClass('collapse show').toggle(open);
    $(this).attr({'aria-controls':target.slice(1),'aria-expanded':String(open)});
    $(this).on('click',function(){const expanded=this.getAttribute('aria-expanded')==='true';$(this).attr('aria-expanded',String(!expanded)).toggleClass('collapsed',expanded);panel.stop(true,true).slideToggle(180);});
  });
  $('a[href^="#"]').on('click',function(event){
    const target=document.getElementById(this.hash.slice(1)); if(!target) return;
    event.preventDefault();
    $('html,body').stop(true,true).animate({scrollTop:Math.max(0,$(target).offset().top-90)},250);
    history.replaceState(null,'',this.hash);
    if(!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
  });
}
