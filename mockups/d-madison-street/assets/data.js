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

  // The store's wall clock, wherever the visitor is. Every "open now",
  // cutoff and rotation decision uses this — a family checking from
  // Germany must see Clarksville truth, not their own 3am.
  function storeNow() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  }

  // Local flavor image helper. Files live in assets/img/ as
  // flavor-{slug}-{480|960}.webp; BASE makes it work from any page depth.
  const BASE = (document.currentScript?.src || '').replace(/assets\/data\.js.*$/, '');
  function img(slugName, w) {
    return BASE + 'assets/img/flavor-' + slugName + '-' + (w >= 960 ? 960 : 480) + '.webp';
  }

  // 12 signature cupcakes — real Smallcakes lineup (images are illustrative).
  const SIGNATURE = [
    { name: 'Pink Vanilla', desc: 'Vanilla cake frosted with our signature pink buttercream.', img: 'pink-vanilla' },
    { name: 'Pink Chocolate', desc: 'Chocolate cake frosted with our signature pink buttercream.', img: 'pink-chocolate' },
    { name: 'Chocoholic', desc: 'Chocolate cake, chocolate buttercream, chocolate shavings.', img: 'chocoholic' },
    { name: 'Vanilla-N-Chocolate', desc: 'Vanilla cake frosted with our signature chocolate buttercream.', img: 'vanilla-n-chocolate' },
    { name: 'Cookies-N-Cream', desc: 'Chocolate cake, cookie buttercream, chocolate cookie crumbles.', img: 'cookies-n-cream' },
    { name: 'Lemon Drop', desc: 'Vanilla cake, tangy lemon filling, lemon buttercream, a dollop of lemon.', img: 'lemon-drop' },
    { name: '“Famous” Red Velvet', desc: 'Grandma’s red velvet frosted with cream cheese, red velvet crumbles.', img: 'famous-red-velvet' },
    { name: 'Wedding Cake', desc: 'Almond cake, almond buttercream, sugar pearls.', img: 'wedding-cake' },
    { name: 'Hot Fudge Sundae', desc: 'Chocolate cake filled with fudge, buttercream, peanuts, fudge drizzle, a cherry.', img: 'hot-fudge-sundae' },
    { name: 'Peanut Butter Cup', desc: 'Chocolate cake, peanut butter cream cheese, crumbled peanut butter cups.', img: 'peanut-butter-cup' },
    { name: 'Chocolate Cream', desc: 'Chocolate cake filled with buttercream, signature fudge, a buttercream swirl.', img: 'chocolate-cream' },
    { name: 'Birthday Cake', desc: 'Vanilla cake, buttercream, rainbow sprinkles.', img: 'birthday-cake' }
  ];


  // Rotating specialty/seasonal pool — the "new ones drop monthly" set.
  const SEASONAL = [
    { name: 'Maple Bacon', desc: 'Maple cake, maple buttercream, candied bacon.', img: 'maple-bacon' },
    { name: 'Caramel Crunch', desc: 'Vanilla cake, caramel, toffee crunch.', img: 'caramel-crunch' },
    { name: 'Cannoli', desc: 'Vanilla cake, sweet ricotta cream, mini chocolate chips.', img: 'cannoli' },
    { name: 'Strawberries N’ Crème', desc: 'Vanilla cake, strawberry filling, cream frosting.', img: 'strawberries-n-creme' },
    { name: 'Tiramisu', desc: 'Espresso-soaked cake, mascarpone cream, cocoa dusting.', img: 'tiramisu' },
    { name: 'French Toast', desc: 'Cinnamon cake, maple buttercream, a syrup drizzle.', img: 'french-toast' },
    { name: 'Pumpkin', desc: 'Spiced pumpkin cake, cream cheese frosting.', img: 'pumpkin' },
    { name: 'Orange Creamsicle Marble', desc: 'Orange-vanilla marble cake, creamsicle buttercream.', img: 'orange-creamsicle-marble' }
  ];


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



  return { STORE, SIGNATURE, SEASONAL, CATEGORIES, ALLERGEN, FAQ, REVIEWS, img, storeNow };
})();
