/* Direction D content layer (forked from the shared demo assets —
   this copy is the production one; A/B/C keep theirs).
   Classic script (no modules) so the demos also work opened via file://.
   Exposes one global: window.SC
   Flavor names/descriptions + allergen text are the real Smallcakes public
   content (illustrative here). Hours, prices, reviews are DEMO placeholders. */
window.SC = (function () {
  const STORE = {
    name: 'Smallcakes Cupcakery & Creamery',
    city: 'Clarksville',
    state: 'TN',
    address: '1803 Madison St., Suite A',
    cityLine: 'Clarksville, TN 37043',
    phone: '931-547-8361',
    phoneHref: 'tel:+19315478361',
    email: 'clarksville@smallcakes-demo.com',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=1803+Madison+St+Clarksville+TN+37043',
    taglines: ['Make every occasion Sweet with Smallcakes!', 'Maybe a cupcake will help!'],
    // DEMO hours — real hours pending owner verification.
    hours: [
      { d: 'Mon', h: '10am – 8pm' },
      { d: 'Tue', h: '10am – 8pm' },
      { d: 'Wed', h: '10am – 8pm' },
      { d: 'Thu', h: '10am – 8pm' },
      { d: 'Fri', h: '10am – 9pm' },
      { d: 'Sat', h: '10am – 9pm' },
      { d: 'Sun', h: '12pm – 6pm' }
    ],
    // Open ranges by weekday index (0=Sun) for the live status pill, in 24h.
    openRanges: [[12, 18], [10, 20], [10, 20], [10, 20], [10, 20], [10, 21], [10, 21]]
  };

  // Unsplash image helper (free license, hotlinked CDN). id = "photo-…".
  // DEMO imagery — not the store's real products; for concept presentation only.
  function img(id, w, h) {
    let u = 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&q=80&w=' + (w || 800);
    if (h) u += '&h=' + h;
    return u;
  }

  // 12 signature cupcakes — real Smallcakes lineup (images are illustrative).
  const SIGNATURE = [
    { name: 'Pink Vanilla', desc: 'Vanilla cake frosted with our signature pink buttercream.', img: 'photo-1614707267537-b85aaf00c4b7' },
    { name: 'Pink Chocolate', desc: 'Chocolate cake frosted with our signature pink buttercream.', img: 'photo-1563729784474-d77dbb933a9e' },
    { name: 'Chocoholic', desc: 'Chocolate cake, chocolate buttercream, chocolate shavings.', img: 'photo-1603532648955-039310d9ed75' },
    { name: 'Vanilla-N-Chocolate', desc: 'Vanilla cake frosted with our signature chocolate buttercream.', img: 'photo-1599785209796-786432b228bc' },
    { name: 'Cookies-N-Cream', desc: 'Chocolate cake, cookie buttercream, chocolate cookie crumbles.', img: 'photo-1576618148400-f54bed99fcfd' },
    { name: 'Lemon Drop', desc: 'Vanilla cake, tangy lemon filling, lemon buttercream, a dollop of lemon.', img: 'photo-1486427944299-d1955d23e34d' },
    { name: '“Famous” Red Velvet', desc: 'Grandma’s red velvet frosted with cream cheese, red velvet crumbles.', img: 'photo-1587668178277-295251f900ce' },
    { name: 'Wedding Cake', desc: 'Almond cake, almond buttercream, sugar pearls.', img: 'photo-1495147466023-ac5c588e2e94' },
    { name: 'Hot Fudge Sundae', desc: 'Chocolate cake filled with fudge, buttercream, peanuts, fudge drizzle, a cherry.', img: 'photo-1607478900766-efe13248b125' },
    { name: 'Peanut Butter Cup', desc: 'Chocolate cake, peanut butter cream cheese, crumbled peanut butter cups.', img: 'photo-1550617931-e17a7b70dce2' },
    { name: 'Chocolate Cream', desc: 'Chocolate cake filled with buttercream, signature fudge, a buttercream swirl.', img: 'photo-1621303837174-89787a7d4729' },
    { name: 'Birthday Cake', desc: 'Vanilla cake, buttercream, rainbow sprinkles.', img: 'photo-1519869325930-281384150729' }
  ];


  // Rotating specialty/seasonal pool — the "new ones drop monthly" set.
  const SEASONAL = [
    { name: 'Maple Bacon', desc: 'Maple cake, maple buttercream, candied bacon.', img: 'photo-1606890737304-57a1ca8a5b62' },
    { name: 'Caramel Crunch', desc: 'Vanilla cake, caramel, toffee crunch.', img: 'photo-1551879403-6adb554966fd' },
    { name: 'Cannoli', desc: 'Vanilla cake, sweet ricotta cream, mini chocolate chips.', img: 'photo-1553135422-400ee5852b27' },
    { name: 'Strawberries N’ Crème', desc: 'Vanilla cake, strawberry filling, cream frosting.', img: 'photo-1606983340126-99ab4feaa64a' },
    { name: 'Tiramisu', desc: 'Espresso-soaked cake, mascarpone cream, cocoa dusting.', img: 'photo-1578922864601-79dcc7cbcea9' },
    { name: 'French Toast', desc: 'Cinnamon cake, maple buttercream, a syrup drizzle.', img: 'photo-1588195538326-c5b1e9f80a1b' },
    { name: 'Pumpkin', desc: 'Spiced pumpkin cake, cream cheese frosting.', img: 'photo-1545696563-af8f6ec2295a' },
    { name: 'Orange Creamsicle Marble', desc: 'Orange-vanilla marble cake, creamsicle buttercream.', img: 'photo-1558301211-0d8c8ddee6ec' }
  ];

  // Named scene images (illustrative, Unsplash). Use SC.img(id, w, h) for URLs.
  const IMAGES = {
    heroCupcakes: 'photo-1614707267537-b85aaf00c4b7',
    heroWide:     'photo-1486427944299-d1955d23e34d',
    storefront:   'photo-1568254183919-78a4f43a2877',
    interior:     'photo-1587241321921-91a834d6d191',
    counter:      'photo-1511018556340-d16986a1c194',
    baker:        'photo-1546237769-6f84ec1a512a',
    custom:       'photo-1558301211-0d8c8ddee6ec',
    wedding:      'photo-1551879403-6adb554966fd',
    catering:     'photo-1624353365286-3f8d62daad51',
    icecream:     'photo-1497034825429-c343d7c6a68f',
    // gallery pool for portfolio/occasion sections
    gallery: [
      'photo-1558301211-0d8c8ddee6ec', 'photo-1545696563-af8f6ec2295a',
      'photo-1606983340126-99ab4feaa64a', 'photo-1624353365286-3f8d62daad51',
      'photo-1561940329-7382e6704231', 'photo-1508349307373-ab2edc239589',
      'photo-1551879403-6adb554966fd', 'photo-1614707267537-b85aaf00c4b7'
    ]
  };

  const CATEGORIES = [
    { key: 'cupcakes', label: 'Cupcakes', note: 'Single · half-dozen · dozen · minis' },
    { key: 'cakes', label: 'Celebration Cakes', note: '6" · 8" · smash cakes · towers' },
    { key: 'treats', label: 'Minis, Macarons & More', note: 'Mini cupcakes · macarons · cake pops' },
    { key: 'seasonal', label: 'Specialty & Seasonal', note: 'New flavors drop monthly' }
  ];

  // Exact approved allergen / cross-contact wording — use verbatim.
  const ALLERGEN =
    'While we offer gourmet cupcakes without nuts and/or gluten, all of our desserts are made ' +
    'fresh every day in the same kitchen. Though safety and sanitation are of the utmost importance ' +
    'to us, the potential for cross-contamination does exist. Our kitchen regularly prepares items ' +
    'with peanuts, tree nuts, nut oils and butters, and gluten, and therefore, cannot be certified ' +
    'as a nut-free or gluten-free product. Please speak with a Smallcakes employee for further questions.';

  const FAQ = [
    { q: 'What are today’s flavors?', a: 'We bake 12 signature flavors fresh every morning, plus a rotating specialty flavor. The live ordering page always confirms current availability.' },
    { q: 'How much notice do custom orders need?', a: 'Custom cupcakes and celebration cakes need 48–72 hours; cupcake towers and large orders need about a week. Start a custom request and we’ll confirm availability for your date.' },
    { q: 'How do I order for pickup?', a: 'Tap Order for Pickup — it continues to our official Smallcakes Clarksville ordering page (Square), where you choose your items and a pickup time.' },
    { q: 'Do you deliver?', a: 'Pickup is always available. Local delivery and catering delivery are handled case by case — ask on your custom or catering request.' },
    { q: 'Can you do allergy-friendly orders?', a: 'We share a kitchen with peanuts, tree nuts and gluten and cannot certify any item nut-free or gluten-free. Please tell us your concern and speak with a team member so we can help you decide.' },
    { q: 'Do you cater events? What about wedding cakes?', a: 'We cater — office treats, parties, corporate boxes and dessert tables. We don’t make tiered wedding cakes, but cupcake towers and celebration cakes are our specialty. Request a quote with your date, headcount and idea.' },
    { q: 'Where do I park?', a: 'We’re at 1803 Madison St., Suite A, with storefront parking right out front. Get Directions opens the map to the exact pin.' }
  ];

  // DEMO reviews — illustrative; a real build quotes with source, date and permission.
  const REVIEWS = [
    { name: 'Brittany M.', rating: 5, date: 'Jun 2026', text: 'Best cupcakes in Clarksville, hands down. The Red Velvet tastes like my grandma made it. Ordered a dozen for a birthday and pickup was instant.' },
    { name: 'Marcus T.', rating: 5, date: 'May 2026', text: 'Did a custom smash cake for our daughter’s first birthday. They nailed the colors and it was ready right on time. So easy.' },
    { name: 'Dana & Cole', rating: 5, date: 'Apr 2026', text: 'Ordered dessert boxes for our office and everyone raved. The minis and macarons disappeared before lunch.' }
  ];

  const NAV = [
    { label: 'Menu & Flavors', href: 'menu.html' },
    { label: 'Custom Orders', href: 'custom.html' },
    { label: 'Catering', href: 'index.html#catering' },
    { label: 'About', href: 'index.html#about' },
    { label: 'Visit', href: 'index.html#visit' }
  ];

  const LOGO = '../../assets/smallcakes-logo-circle.png';

  return { STORE, SIGNATURE, SEASONAL, CATEGORIES, ALLERGEN, FAQ, REVIEWS, NAV, IMAGES, LOGO, img };
})();
