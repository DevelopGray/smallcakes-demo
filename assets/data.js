/* Shared demo content for all three Smallcakes Clarksville concept sites.
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

  // 12 signature cupcakes — real Smallcakes lineup.
  const SIGNATURE = [
    { name: 'Pink Vanilla', desc: 'Vanilla cake frosted with our signature pink buttercream.' },
    { name: 'Pink Chocolate', desc: 'Chocolate cake frosted with our signature pink buttercream.' },
    { name: 'Chocoholic', desc: 'Chocolate cake, chocolate buttercream, chocolate shavings.' },
    { name: 'Vanilla-N-Chocolate', desc: 'Vanilla cake frosted with our signature chocolate buttercream.' },
    { name: 'Cookies-N-Cream', desc: 'Chocolate cake, cookie buttercream, chocolate cookie crumbles.' },
    { name: 'Lemon Drop', desc: 'Vanilla cake, tangy lemon filling, lemon buttercream, a dollop of lemon.' },
    { name: '“Famous” Red Velvet', desc: 'Grandma’s red velvet frosted with cream cheese, red velvet crumbles.' },
    { name: 'Wedding Cake', desc: 'Almond cake, almond buttercream, sugar pearls.' },
    { name: 'Hot Fudge Sundae', desc: 'Chocolate cake filled with fudge, buttercream, peanuts, fudge drizzle, a cherry.' },
    { name: 'Peanut Butter Cup', desc: 'Chocolate cake, peanut butter cream cheese, crumbled peanut butter cups.' },
    { name: 'Chocolate Cream', desc: 'Chocolate cake filled with buttercream, signature fudge, a buttercream swirl.' },
    { name: 'Birthday Cake', desc: 'Vanilla cake, buttercream, rainbow sprinkles.' }
  ];

  const ICE_CREAM = [
    { name: 'Birthday Cake', desc: 'Creamy vanilla ice cream layered with birthday sprinkles.' },
    { name: 'Peanut Butter Cup', desc: 'Creamy peanut butter ice cream, peanut butter crumbles.' },
    { name: 'Chocoholic', desc: 'Creamy chocolate ice cream, chocolate shavings and fudge.' },
    { name: 'Cookies-N-Cream', desc: 'Creamy cookie ice cream, chocolate cookie crumbles.' },
    { name: 'Salted Caramel', desc: 'Caramel ice cream infused with house-made caramel sauce.' },
    { name: 'Vanilla Bean', desc: 'Creamy Madagascar bourbon vanilla ice cream.' },
    { name: 'Blue Monster Cookie', desc: 'Blue vanilla ice cream, cookie crumbles and chocolate chip cookies.' }
  ];

  // Rotating specialty/seasonal pool — the "new ones drop monthly" set.
  const SEASONAL = [
    { name: 'Maple Bacon', desc: 'Maple cake, maple buttercream, candied bacon.' },
    { name: 'Caramel Crunch', desc: 'Vanilla cake, caramel, toffee crunch.' },
    { name: 'Cannoli', desc: 'Vanilla cake, sweet ricotta cream, mini chocolate chips.' },
    { name: 'Strawberries N’ Crème', desc: 'Vanilla cake, strawberry filling, cream frosting.' },
    { name: 'Tiramisu', desc: 'Espresso-soaked cake, mascarpone cream, cocoa dusting.' },
    { name: 'French Toast', desc: 'Cinnamon cake, maple buttercream, a syrup drizzle.' },
    { name: 'Pumpkin', desc: 'Spiced pumpkin cake, cream cheese frosting.' },
    { name: 'Orange Creamsicle Marble', desc: 'Orange-vanilla marble cake, creamsicle buttercream.' }
  ];

  const CATEGORIES = [
    { key: 'cupcakes', label: 'Cupcakes', note: 'Single · half-dozen · dozen · minis' },
    { key: 'cakes', label: 'Celebration Cakes', note: '6" · 8" · tiered · smash cakes' },
    { key: 'icecream', label: 'Creamery', note: 'Cups · cones · pints · cupcake-infused' },
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
    { q: 'How much notice do custom orders need?', a: 'Custom cupcakes and celebration cakes generally need 48–72 hours; larger or tiered orders need about a week. Start a custom request and we’ll confirm availability for your date.' },
    { q: 'How do I order for pickup?', a: 'Tap Order for Pickup — it continues to our official Smallcakes Clarksville ordering page (Square), where you choose your items and a pickup time.' },
    { q: 'Do you deliver?', a: 'Pickup is always available. Local delivery and catering delivery are handled case by case — ask on your custom or catering request.' },
    { q: 'Can you do allergy-friendly orders?', a: 'We share a kitchen with peanuts, tree nuts and gluten and cannot certify any item nut-free or gluten-free. Please tell us your concern and speak with a team member so we can help you decide.' },
    { q: 'Do you cater events and weddings?', a: 'Yes — office treats, parties, corporate boxes and wedding desserts. Request a quote with your date, headcount and idea and we’ll build a package.' },
    { q: 'Where do I park?', a: 'We’re at 1803 Madison St., Suite A, with storefront parking right out front. Get Directions opens the map to the exact pin.' }
  ];

  // DEMO reviews — illustrative; a real build quotes with source, date and permission.
  const REVIEWS = [
    { name: 'Brittany M.', rating: 5, date: 'Jun 2026', text: 'Best cupcakes in Clarksville, hands down. The Red Velvet tastes like my grandma made it. Ordered a dozen for a birthday and pickup was instant.' },
    { name: 'Marcus T.', rating: 5, date: 'May 2026', text: 'Did a custom smash cake for our daughter’s first birthday. They nailed the colors and it was ready right on time. So easy.' },
    { name: 'Dana & Cole', rating: 5, date: 'Apr 2026', text: 'Ordered dessert boxes for our office and everyone raved. The cupcake-infused ice cream is a whole event by itself.' }
  ];

  const NAV = [
    { label: 'Menu & Flavors', href: 'menu.html' },
    { label: 'Custom Orders', href: 'custom.html' },
    { label: 'Catering', href: 'index.html#catering' },
    { label: 'About', href: 'index.html#about' },
    { label: 'Visit', href: 'index.html#visit' }
  ];

  return { STORE, SIGNATURE, ICE_CREAM, SEASONAL, CATEGORIES, ALLERGEN, FAQ, REVIEWS, NAV };
})();
