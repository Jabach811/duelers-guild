(async () => {
  const core = window.GuildStore;
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
  const read = (key,fallback) => {try{return JSON.parse(localStorage.getItem('dg-preview-'+key)) ?? fallback;}catch{return fallback;}};
  const toast = message => {const el=document.querySelector('.store-toast');if(!el)return;el.textContent=message;el.classList.add('is-visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('is-visible'),5000);};
  const save = (key,value) => {try{localStorage.setItem('dg-preview-'+key,JSON.stringify(value));return true;}catch{toast('Browser storage is unavailable. Changes will not persist after leaving this page.');return false;}};
  document.querySelectorAll('[data-list-filter]').forEach(input=>{
    const list=input.closest('aside') || input.closest('.page-space');
    const rows=[...list.querySelectorAll('[data-list-item]')];
    input.addEventListener('input',()=>{
      const query=input.value.trim().toLocaleLowerCase();let count=0;
      rows.forEach(row=>{row.hidden=!row.textContent.toLocaleLowerCase().includes(query);if(!row.hidden)count++;});
      const status=list.querySelector('[data-filter-status]');if(status)status.textContent=`${count} matching ${count===1?'page':'pages'}`;
    });
  });
  let data;
  try {const r=await fetch('/catalog-data.json');if(!r.ok)throw new Error();data=await r.json();}
  catch {document.querySelectorAll('[data-search-results],[data-cart],[data-checkout],[data-wishlist],[data-list-results]').forEach(el=>{el.innerHTML='<div class="empty-state"><h2>The sample catalog could not load.</h2><p>Reload the page to try again. No stock or order information has changed.</p></div>';});toast('The sample catalog could not load. Reload to try again.');return;}
  const products=data.products;
  let cart=core.normalizeCart(read('cart',[]),products);
  let wishlist=read('wishlist',[]);if(!Array.isArray(wishlist))wishlist=[];
  wishlist=[...new Set(wishlist.map(String).filter(id=>products.some(p=>p.id===id)))];
  function synchronize() {
    document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cart.reduce((n,l)=>n+l.quantity,0));
    document.querySelectorAll('[data-save]').forEach(button=>{const yes=wishlist.includes(button.dataset.save);button.setAttribute('aria-pressed',String(yes));button.textContent=yes?'Saved':'Save product';});
  }
  const card=p=>`<article class="product-card"><a class="product-photo" href="${p.path}">${p.image?`<img src="${p.image}" alt="${esc(p.name)}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async">`:'<span class="photo-unavailable">Product photo unavailable</span>'}</a><div class="product-meta"><p class="product-category">${esc(p.category)}</p><h3><a href="${p.path}">${esc(p.name)}</a></h3><p class="price">${p.price!=null?money(p.price):'Price not captured'} <span>Sample price</span></p><div class="product-actions"><a class="button button-small button-outline" href="${p.path}">View product</a><button class="save-product" data-save="${p.id}" type="button" aria-pressed="false">Save product</button></div></div></article>`;
  const grid=list=>`<div class="product-grid">${list.map(card).join('')}</div>`;
  const empty=(heading,text)=>`<div class="empty-state"><h2>${esc(heading)}</h2><p>${esc(text)}</p><a class="button button-outline" href="/shop/">Find your game</a></div>`;
  function renderWishlist(){const el=document.querySelector('[data-wishlist]');if(el){const list=products.filter(p=>wishlist.includes(p.id));el.innerHTML=list.length?grid(list):empty('Nothing saved yet.','Save a product from a product page or search result to find it here.');synchronize();}}
  function renderCart() {
    const lines=cart.map(l=>{const p=products.find(x=>x.id===l.id);return `<article class="cart-line">${p.image?`<img src="${p.image}" alt="${esc(p.name)}" width="90" height="110">`:'<span class="photo-unavailable">No photo</span>'}<div><h2><a href="${p.path}">${esc(p.name)}</a></h2><p class="price">${p.price==null?'Price not captured':money(p.price*l.quantity)} <span>Sample subtotal</span></p><div class="cart-controls"><label for="cart-qty-${p.id}">Quantity<input id="cart-qty-${p.id}" type="number" min="1" max="99" inputmode="numeric" value="${l.quantity}" data-cart-quantity="${p.id}"></label><button type="button" data-remove-cart="${p.id}">Remove product</button></div></div></article>`;}).join('');
    const summary=`<aside class="text-panel"><h2>Review total</h2><p class="summary-total">${money(core.cartTotal(cart,products))}</p><p>Captured sample prices only. Shipping, taxes, variant pricing and discounts are not calculated.</p><a class="button" href="/checkout/">Review checkout</a><a class="text-link" href="/shop/">Continue browsing</a></aside>`;
    const el=document.querySelector('[data-cart]');if(el)el.innerHTML=cart.length?`<div class="cart-layout"><div>${lines}</div>${summary}</div>`:empty('Your review cart is empty.','Add a product sample to explore the cart and checkout pages. This preview does not accept orders.');
    const checkout=document.querySelector('[data-checkout]');if(checkout)checkout.innerHTML=cart.length?`<section class="text-panel"><h2>Order review</h2>${cart.map(l=>{const p=products.find(x=>x.id===l.id);return `<div class="cart-estimate"><a href="${p.path}">${l.quantity} × ${esc(p.name)}</a><span>${p.price==null?'Unpriced':money(p.price*l.quantity)}</span></div>`;}).join('')}<p class="summary-total">${money(core.cartTotal(cart,products))}</p><p>Review estimate only; not a final payable total.</p></section>`:empty('No products to review.','Add product samples to your review cart first.');
  }
  synchronize();renderWishlist();renderCart();
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-save]');
    if(button){const id=button.dataset.save;const was=wishlist.includes(id);wishlist=was?wishlist.filter(x=>x!==id):[...wishlist,id];save('wishlist',wishlist);synchronize();renderWishlist();toast(was?'Removed from saved products.':'Saved on this device.');}
    const remove=event.target.closest('[data-remove-cart]');
    if(remove){const id=remove.dataset.removeCart;if(!window.confirm('Remove this product from your device-local review cart?'))return;cart=cart.filter(l=>l.id!==id);save('cart',cart);renderCart();synchronize();toast('Removed from the review cart.');}
  });
  document.addEventListener('change',event=>{
    const input=event.target.closest('[data-cart-quantity]');if(!input)return;
    if(!input.checkValidity()){input.reportValidity();return;}
    cart=cart.map(l=>l.id===input.dataset.cartQuantity?{...l,quantity:Number(input.value)}:l);
    cart=core.normalizeCart(cart,products);save('cart',cart);renderCart();synchronize();toast('Review quantity updated.');
  });
  document.querySelectorAll('[data-add-cart]').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();const quantity=Number(form.elements.quantity.value);if(!form.reportValidity())return;
    cart=core.normalizeCart([...cart,{id:form.dataset.addCart,quantity}],products);save('cart',cart);synchronize();toast('Added to review cart on this device. No stock reserved.');
  }));
  const search=document.querySelector('[data-search]');
  if(search) {
    const query=new URLSearchParams(location.search);
    ['q','min','max','category','sort'].forEach(name=>{if(search.elements[name] && query.has(name))search.elements[name].value=query.get(name);});
    function runSearch(update=false) {
      const filters=Object.fromEntries(new FormData(search));
      if(filters.min && filters.max && Number(filters.min)>Number(filters.max)){search.elements.max.setCustomValidity('Maximum price must be at least the minimum price.');search.elements.max.reportValidity();search.elements.max.focus();return;}
      if(search.elements.max)search.elements.max.setCustomValidity('');
      const results=core.searchProducts(products,filters);
      document.querySelector('[data-search-status]').textContent=`${results.length} ${results.length===1?'product sample':'product samples'}${filters.q?` matching “${filters.q}”`:''}. Live availability is not connected.`;
      document.querySelector('[data-search-results]').innerHTML=results.length?grid(results):empty('No captured matches.','Try a different name or fewer filters. This sample catalog is not the Guild’s complete inventory.');
      if(update){const params=new URLSearchParams();Object.entries(filters).forEach(([k,v])=>{if(v)params.set(k,v);});history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));}
      synchronize();
    }
    search.addEventListener('input',()=>{if(search.elements.max)search.elements.max.setCustomValidity('');});
    search.addEventListener('submit',event=>{event.preventDefault();runSearch(true);});
    runSearch();
  }
  const listForm=document.querySelector('[data-list-tool]');
  const listKey=listForm?.dataset.listTool==='buylist'?'sell-list':'deck-list';
  function listMarkup(rows,mode) {
    return rows.map(row=>{
      if(row.error)return `<article class="list-line error-line"><h2>${esc(row.name)}</h2><p>Use a whole-number quantity from 1 to 999. This line has not been added to your list.</p></article>`;
      const matches=products.filter(p=>p.name.toLocaleLowerCase()===row.name.toLocaleLowerCase() || p.name.toLocaleLowerCase().startsWith(row.name.toLocaleLowerCase()+' -'));
      return `<article class="list-line"><h2>${row.quantity} × ${esc(row.name)}</h2>${mode==='buylist'?'<p>Offer and buying quantity need the live buylist connection. No sale submitted.</p>':`<p>${matches.length} captured ${matches.length===1?'match':'matches'}. ${matches.length?'Confirm the exact printing and stock with the Guild.':'Try a different spelling, or check with the Guild—missing sample records do not mean out of stock.'}</p>${matches.length?grid(matches):''}`}</article>`;
    }).join('');
  }
  if(listForm){
    const textarea=listForm.elements.cards;textarea.value=read(listKey,'');
    textarea.addEventListener('input',()=>save(listKey,textarea.value));
    const render=()=>{
      const rows=core.parseList(textarea.value);save(listKey,textarea.value);
      document.querySelector('[data-list-results]').innerHTML=listMarkup(rows,listForm.dataset.listTool);synchronize();
      listForm.querySelector('[data-list-feedback]').textContent=`${rows.filter(r=>!r.error).length} valid lines saved on this device.${rows.some(r=>r.error)?' Correct the quantities marked below.':''}`;
    };
    listForm.addEventListener('submit',event=>{event.preventDefault();render();});
    listForm.querySelector('[data-export-list]').addEventListener('click',()=>{
      const rows=core.parseList(textarea.value);
      if(!rows.length || rows.some(r=>r.error)){listForm.querySelector('[data-list-feedback]').textContent='Add card names and correct invalid quantities before downloading.';textarea.focus();return;}
      const blob=new Blob([rows.map(r=>`${r.quantity} ${r.name}`).join('\n')],{type:'text/plain;charset=utf-8'});
      const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=listForm.dataset.listTool==='buylist'?'duelers-guild-sell-list.txt':'duelers-guild-decklist.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Card list downloaded. Nothing was submitted to the Guild.');
    });
    if(textarea.value)render();
  }
  const sellReview=document.querySelector('[data-sell-review]');
  if(sellReview){const rows=core.parseList(read('sell-list',''));sellReview.innerHTML=rows.length?listMarkup(rows,'buylist')+'<a class="button button-outline" href="/buylist/">Edit sell list</a>':empty('No sell list on this device.','Use the buylist builder to organize your card names and quantities.')+'<a class="text-link" href="/buylist/">Open buylist builder</a>';}
})();
