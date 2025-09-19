import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // --- Translation data logic (copy from seed.ts) ---
    const prepareData = (data: Record<string, string>, lang: string) => {
      return Object.entries(data).map(([key, value]) => ({
        key,
        language: lang,
        value: value,
        type: "text", // default as text, can later update to "image" or "video"
      }));
    };

    // --- Copy your enSeeds and daSeeds logic here ---
    // (Copy lines 18-625 from your seed.ts)
    // For brevity, I'll show a placeholder:
    const enSeeds = prepareData(
      {
        welcomeMessage: "Welcome to Blommehuset",
        locationHeader: "Located in the heart of the beautiful Marielyst",
        descriptionText:
          "A relaxing and memorable stay for families, friends, and anyone looking for a break from the hustle and bustle of everyday life. Blommehuset is the ideal retreat, where modern comfort meets picturesque surroundings. With its charming atmosphere and convenient amenities, it lets you enjoy all that Marielyst has to offer.",
        luxuryExperience:
          "Inspired by Danish luxury and surrounded by scenic beauty, our holiday home is designed to offer an unforgettable experience. From relaxing moments in nature to exciting activities, our goal is to entertain and pamper you throughout your stay.",
        availableVia: "ALSO AVAILABLE VIA",
        headline: "Holiday Home by Marielyst",
        subheadline:
          "One step away from the stress of everyday life, one step into the summer house idyll",
        thoughtfulLayout: "A Thoughtful Layout",
        floorPlan: "Floor Plan",
        luxuryNatureTitle: "The Summer House Where Luxury Meets Nature",
        blommehusetDescription:
          "Blommehuset in Marielyst is the perfect place for a fantastic holiday experience, combining amenities and location to create the ideal setting. Situated in the beautiful Marielyst area, it offers comfort and style for all guests.",
        experienceMessage:
          "AN EXPERIENCE THAT WILL MAKE YOU COME BACK AGAIN AND AGAIN.",
        locationTitle: "Location",
        mapLocation: "Blommestien 3, 4872 Idestrup, Denmark",
        location: "Location",
        blommehuset: "Blommehuset",
        addressLine1: "Blommestien 3",
        addressLine2: "4872 Idestrup, Denmark",
        supermarket: "Supermarket",
        supermarketDistance: "500m to grocery shopping",
        restaurant: "Restaurant",
        restaurantDistance: "1500m to the nearest restaurant",
        beach: "Beach",
        beachDistance: "700m to the beach",
        golf: "Golf",
        golfDistance: "2800m to a golf course",
        copenhagen: "Copenhagen",
        copenhagenDistance: "1.5 hours / 141 KM",
        odense: "Odense",
        odenseDistance: "2 hours / 182 KM",
        berlin: "Berlin",
        berlinDistance: "4.5 hours / 303 KM",
        hamburg: "Hamburg",
        hamburgDistance: "3.5 hours / 227 KM",
        cityThatGivesMemories: "The city that gives memories",
        bestBeach: "Denmark's best bathing beach",
        marielystArea:
          "The area around Marielyst offers a wide range of experiences and activities.",
        surfCenterFalster: "Surfcenter Falster",
        surfCenterDescription:
          "Surfcenter Falster offers a wide range of activities including windsurfing, kitesurfing, SUP (stand-up paddleboarding), and kayaking. Whether you're a beginner or experienced, we have equipment and lessons tailored to your level.",
        discoverMore: "Discover More",
        marielystOldBathingTown: "Marielyst – The Old Seaside Town",
        marielystDescription:
          "Marielyst – The Old Seaside Town is a charming destination with over 100 years of history. Located on Falster, the town offers a wonderful sandy beach, cozy cafés, and exciting activities for the whole family. Perfect for a relaxing holiday by the sea!",
        bikeHikingTours: "Cycling and Hiking Tours",
        bikeHikingDescription:
          "Explore the beautiful nature around Marielyst with well-marked cycling and hiking routes through forests, fields, and along the coast.",
        guestExperienceTitle: "GUEST EXPERIENCES",
        guestReview:
          '"Nothing was missing. There were plenty of activities in the house, and it was great that it was so close to the water. / The handover and return went smoothly, and communication with the owner was good and friendly. / Super vacation!"',
        reviewerDetails:
          "Tina – Søborg (Family holiday with older children, February 2021)",
        summerHouseInspiration:
          "Inspired by Danish summer, surrounded by nature that evokes memories for many years to come.",
        summerHouseOffers: "The Summer House Offers",
        facilitiesTitle:
          "All the necessary facilities for a cozy and comfortable stay",
        pool: "Pool",
        poolDescription:
          "18m2 large pool with a slide for the little ones and a 6-person indoor spa.",
        caretaker: "Caretaker",
        caretakerDescription:
          "A caretaker is available to assist with any issues that may arise during your stay.",
        wifi: "Wi-Fi & Internet",
        wifiDescription: "Fast 100 / 100 connection for the whole family.",
        appliances: "All Necessary Appliances",
        appliancesDescription:
          "Dishwasher, washing machine, tumble dryer, refrigerator, and freezer are available in the house.",
        tvPackage: "TV Package",
        tvPackageDescription:
          "Offers a wide range of popular channels, including entertainment, sports, news, and children's programs – something for the whole family.",
        activities: "Billiards / Table Tennis, etc.",
        activitiesDescription:
          "Look forward to a wide variety of fun and exciting activities, tailored to entertain the whole family and ensure an unforgettable time together.",
        about_description: "Built in 2008 at Blommestien",
        about_title: "About Blommehuset",
        about_subtitle: "Silence and purity: Summer joys in Marielyst",
        about_resort_alt: "resort image",
        about_welcome_text: "Welcome to Blommehuset",
        about_title_location: "In the Heart of Marielyst",
        about_paragraph:
          "Near the beautiful Marielyst beach, this cozy Skanlux pool house is spacious enough for the whole family. With its location in the holiday paradise of Marielyst, close to restaurants, shopping, and the beach, it's the perfect base for a great vacation!",
        about_hero_second_image_alt: "hero second image",
        about_image_alt_1: "first image of the summer house",
        about_image_alt_2: "second image of the summer house",
        about_summer_house_info: "A little about the summer house",
        about_title_togetherness: "Togetherness and coziness",
        about_paragraph_1:
          "Indoors, you will also find a great environment for a lovely holiday. The house offers both comfort and coziness with a spacious kitchen-living area, its own pool section, and an activity room.",
        about_paragraph_2:
          "The house's beautiful pool section includes a pool with a water slide, a lovely 6-person hot tub, and a large sauna, where the holiday mood can truly spread.",
        about_paragraph_3:
          "In the activity room, there are also opportunities for great hours. There is no excuse for sitting still, as you can compete in table tennis/billiards and darts.",
        about_more_info: "And a little more...",
        about_kitchen_garden_title: "Kitchen, garden, and good nights",
        about_kitchen_paragraph_1:
          "The kitchen is open and well-equipped, so there can be many cooks and kitchen helpers without any problems during the shared cooking. Afterwards, the meal can be enjoyed at the long dining table, where the whole group can gather.",
        about_kitchen_paragraph_2:
          "The Danish summer can be enjoyed on the terrace with good garden furniture, where food can also be prepared on the grill. On the large plot surrounding the house, there is also consideration for the smallest guests with a sandbox, playtower, and large lawn.",
        about_kitchen_paragraph_3:
          "When it's time to sleep, everyone can do so in one of the two sleeping areas, each with 3 double rooms. The last 6 sleeping spaces can be found in one of the two lofts of the summer house.",
        about_image_alt_3: "first image of kitchen and garden",
        about_image_alt_4: "second image of kitchen and garden",
        "about_Swimming Pool": "Swimming Pool",
        "about_Washing Machine and Dryer": "Washing Machine and Dryer",
        "about_Dedicated Caretaker": "Dedicated Caretaker",
        "about_Coffee Machine": "Coffee Machine",
        "about_Wifi & Internet": "Wifi & Internet",
        "about_Large Parking Space": "Large Parking Space",
        "about_Outdoor Grill": "Outdoor Grill",
        about_Fireplace: "Fireplace",
        about_Dishwasher: "Dishwasher",
        "about_Streaming TV": "Streaming TV",
        "about_Hair Dryer": "Hair Dryer",
        "about_Floor Heating": "Floor Heating",
        about_indoor_furnishing: "Interior Design",
        about_indoor_facilities: "Indoor Facilities",
        about_facilities_and_services: "Facilities and Services",
        about_facilities_description:
          "The summer house offers a wide range of facilities for children, adults, and the elderly. Whether you wish to relax or be active, there is something for everyone. Indoors, you will find a pool, pool table, air hockey, children's pool table, foosball, and professional poker and blackjack games. There is also a large XL TV screen with the Xbox Ultimate package and 4 controllers, so the whole family can play together. Outdoors, you can enjoy the huge garden, which features Blommehuset's largest playground – perfect for fun and play. There are also plenty of opportunities for garden activities, including water fights and much more. The house also has a caretaker who will be available almost around the clock, as well as a pool attendant who checks the pool twice a week to ensure a safe and enjoyable experience for guests.",
        about_Technician: "Technician",
        "about_Caretaker & Pool Man": "Caretaker & Pool Man",
        about_Pool: "Pool",
        "about_Spa and Pool": "Spa and Pool",
        "about_XL Screen": "XL Screen",
        "about_Games and TV": "Games and TV",
        about_Playground: "Playground",
        "about_Garden and Outdoor Tools": "Garden and Outdoor Tools",
        about_blommehuset_description_1:
          "Blommehuset in Marielyst is an ideal place for a fantastic holiday experience, where the facilities and location combine to create the perfect setting. Located in the popular holiday area Marielyst, this summer house is close to restaurants, shopping, and the beach, providing all the necessary conveniences within reach.",
        about_blommehuset_description_2:
          "This spacious summer house offers a wide range of facilities suitable for all tastes and age groups. Indoors, you can enjoy a private pool area with a 22 m² pool, complete with a water slide for the children, a spacious 6-person hot tub, and a large sauna for ultimate relaxation. There are also two separate activity rooms where you can challenge each other in various games such as table tennis, billiards, and darts. The open and well-equipped kitchen-living area provides space for shared cooking and cozy meals around the long dining table.",
        about_blommehuset_description_3:
          "Outdoors, there is a large terrace with garden furniture and a grill where you can enjoy the Danish summer days and cook under the open sky. The surrounding plot of 2100 m² is perfect for the children, with a large lawn for play and ball games.",
        about_blommehuset_description_4:
          "The summer house contains a total of 6 double rooms and 2 lofts, providing space for up to 18 people. There are also facilities for the youngest, including a baby cot and a high chair.",
        about_blommehuset_description_5:
          "This summer house is suitable for various occasions, including family birthdays, confirmations, weddings, and company events.",
        about_activities: "Activities",
        about_included: "Included",
        about_distance_to_places: "Distance to Various Places",
        about_prices: "Prices",
        about_distance_to_restaurant: "1.5 km to restaurant",
        about_distance_to_beach: "700 m to the beach",
        about_distance_to_shopping: "500 m to shopping",
        about_distance_to_golf: "2800 m to a golf course",
        about_price_electricity: "Electricity: 3.40 DKK/kWh",
        about_price_water: "Water: 85.00 DKK/m³",
        about_price_heating: "Heating: 2.60 DKK/kWh",
        about_price_deposit: "Deposit: 6,000 DKK",
        "about_Outdoor and Indoor SPA": "Outdoor and Indoor SPA",
        "about_Indoor Swimming Pool": "Indoor Swimming Pool",
        about_Sauna: "Sauna",
        about_Billiard: "Billiard",
        about_Dart: "Dart",
        "about_Table Tennis": "Table Tennis",

        "about_Espresso / Coffee Machine": "Espresso / Coffee Machine",
        "about_Washing and Drying Machine": "Washing and Drying Machine",
        faq_perfect_hiking: "PERFECT HIKING",
        faq_title: "FAQ",
        faq_hiking_region_description:
          "The Andermatt region offers excellent hiking opportunities.",
        faq_amazing_experience: "The Amazing Experience",
        faq_diving_snorkelling: "Diving & Snorkelling",
        faq_diving_description_1:
          "Just a short boat ride from Nanuku’s beach is Beqa Lagoon, home to one of the world’s largest barrier reefs. Explore the clear, calm waters, where you’ll be able to see as far ahead as 100 feet. A spectacular underwater world awaits, with beautiful reef formations covered with soft corals in nearly every color imaginable, from bright purple and vivid orange to mellow olive green. Keep your eyes peeled for abundant marine life, including manta rays, hawksbill turtles and schools of tropical fish swimming by.",
        faq_diving_description_2:
          "Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tinci dunt. Cras dapibus. Vivamus elementum semper nisi.",
        faq_diving_description_3:
          "Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.",
        faq_frequently_asked_questions: "FREQUENTLY ASKED QUESTIONS",
        faq_hiking_tips: "HIKING TIPS & FAQ",
        faq_hiking_description:
          "Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.",
        blog_latest_news: "Latest News & Blog",
        blog_our_news: "Our News",
        select_check_out: "Select Check-out",
        please_wait: "Please wait...",
        select_check_in_date: "Select Check-in Date",
        room_price: "Price",
        check_availability: "Check Availability",
        nav_home: "Home",
        nav_ophold: "Stay",
        nav_about_hotel: "About the Hotel",
        nav_gallery: "Gallery",
        nav_faq: "FAQ",
        nav_news: "News",
        house_name: "Blommehuset",
        indoor_pool: "Indoor Pool",
        spa: "Indoor and Outdoor Spa",
        sauna: "Sauna",
        activity_room: "Activity Room",
        guests: "Guests",
        pets_allowed: "Pets Allowed",
        bathrooms: "Bathrooms",
        bedrooms: "Bedrooms",
        lofts: "Lofts",
        energy_friendly: "Energy Friendly",
        house_description_1:
          "Blommehuset in Marielyst is an ideal place for a fantastic holiday experience, where the facilities and location combine to create the perfect setting. Located in the popular holiday area Marielyst, this summer house is close to restaurants, shopping, and the beach, providing all the necessary conveniences within reach.",
        house_description_2:
          "This spacious summer house offers a wide range of facilities suitable for all tastes and age groups. Indoors, you can enjoy a private pool area with a 22 m² pool, complete with a water slide for the children, a spacious 6-person hot tub, and a large sauna for ultimate relaxation. There are also two separate activity rooms where you can challenge each other in various games such as table tennis, billiards, and darts. The open and well-equipped kitchen-living area provides space for shared cooking and cozy meals around the long dining table.",
        house_description_3:
          "Outdoors, there is a large terrace with garden furniture and a grill where you can enjoy the Danish summer days and cook under the open sky. The surrounding plot of 2100 m² is perfect for children, with a large lawn for play and ball games.",
        house_description_4:
          "The summer house contains a total of 6 double rooms and 2 lofts, providing space for up to 18 people. There are also facilities for the youngest, including a baby cot and a high chair.",
        house_description_5:
          "This summer house is suitable for various occasions, including family birthdays, confirmations, weddings, and company events.",
        distance_to_places: "Distance to Various Places",
        distance_to_restaurant: "1.5 km to restaurant",
        distance_to_beach: "700 m to the beach",
        distance_to_shopping: "500 m to shopping",
        distance_to_golf: "2800 m to a golf course",
        prices: "Prices",
        electricity_price: "Electricity: 3.40 DKK/kWh",
        water_price: "Water: 85.00 DKK/m³",
        heating_price: "Heating: 2.60 DKK/kWh",
        deposit_price: "Deposit: 6,000 DKK",
        missing_booking_title: "Missing Booking Information",
        missing_booking_description:
          "Please complete your booking selection before proceeding to checkout.",
        go_back_to_booking: "Go Back to Booking",
        order_summary: "Order Summary",
        total_base_price: "Total Base Price",
        discount: "Discount",
        extra_services_price: "Extra Services Price",
        cleaning: "Cleaning",
        total_price: "Total Price",
        coupon_code: "Coupon Code (optional)",
        enter_coupon_code: "Enter coupon code",
        apply_coupon: "Apply Coupon",
        contact_information: "Contact Information",
        contact_info_description:
          "We'll use this email to send you details and updates about your order.",
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email",
        phone: "Phone",
        mobile_optional: "Mobile (optional)",
        city: "City",
        address: "Address",
        postal_code: "Postal Code",
        country: "Country",
        company_name_optional: "Company Name (optional)",
        vat_number_optional: "VAT Number (optional)",
        currency_code: "Currency Code",
        comment_optional: "Comment (optional)",
        comment_placeholder: "Enter your comment here (optional)",
        checkout: "Checkout",
        extra_services: "Extra Services",
        cleaning_fees: "Cleaning Fees",
        linned_per_set: "Linnen (per set)",
        linned_sets: "Linnen Sets",
        total_cost: "Total Cost",
        activitiess: "Activities",
        included: "Included",
        activity_spa: "Outdoor and Indoor SPA",
        activity_indoor_pool: "Indoor Swimming Pool",
        activity_sauna: "Sauna",
        activity_billiard: "Billiard",
        activity_dart: "Dart",
        activity_table_tennis: "Table Tennis",
        included_floor_heating: "Floor Heating",
        included_streaming_tv: "Streaming TV",
        included_wifi_internet: "Wifi & Internet",
        included_hair_dryer: "Hair Dryer",
        included_coffee_machine: "Espresso / Coffee Machine",
        included_washing_dryer_machine: "Washing and Drying Machine",
        included_dishwasher: "Dishwasher",
        included_fireplace: "Fireplace",
        book_your_stay_now: "Book Your Stay Now",
        reserve: "Reserve",
        adults: "Adults",
        children: "Children",
        fantasticExperience: "Fantastic experience",
        tvTitle: '85" Samsung TV for every experience',
        tvDesc1:
          "Blommehuset, where comfort and entertainment go hand in hand. With an impressive 85″ screen in the living room, you get a cinema-like experience in your holiday paradise. This large screen ensures that all guests can enjoy crystal-clear images and an amazing visual experience, no matter where they sit.",
        tvDesc2:
          "Blommehuset not only offers a wealth of entertainment options with access to 28 channels, including German channels, but also Netflix and YouTube Premium Universe. Whether you are into movies, series, or videos, there is something for everyone.",
        tvDesc3:
          "Imagine how an evening of movies and streaming on the big screen can bring the family together and create unforgettable memories. Our summer house is designed to make your stay as comfortable and entertaining as possible. Blommehuset is designed to make your stay as comfortable and entertaining as possible.",
        userExperiences: "User Experiences",
        channels21: "21+ Waoe Channels",
        netflix: "Netflix",
        youtubePremium: "YouTube Premium",
        xboxUltimate: "Xbox Ultimate with 4 controllers",
        samsungChannels: "100+ Channels from Samsung",
        samsungAppStore: "Samsung App Store",
        bookNow: "Book Now",
        gatherFamily: "Gather the family, watch big",
        bigScreen: "Big screen, bigger experience.",
      },
      "en"
    );
    const daSeeds = prepareData(
      {
        welcomeMessage: "Welkommen til blommehuset",
        locationHeader: "Beliggende i hjertet af det smukkeste Marielyst",
        descriptionText:
          "En afslappende og mindeværdige ophold for familier, venner og alle, der søger en pause fra hverdagens travlhed. Blommehuset er det ideelle tilflugtssted, hvor moderne komfort møder naturskønne omgivelser. Med sin charmerende atmosfære og bekvemmelige faciliteter giver det dig mulighed for at nyde alt, hvad Marielyst har at byde på.",
        luxuryExperience:
          "Inspireret af dansk luksus og omgivet af naturskønne omgivelser, er vores sommerhus designet til at tilbyde en uforglemmelig oplevelse. Fra afslappende stunder i naturen til spændende aktiviteter, er vores mål at holde dig underholdt og forkælet under hele dit ophold.",
        availableVia: "AUCH ERHÄLTLICH ÜBER",
        headline: "Sommerhus ved Marielyst",
        subheadline:
          "Et skridt væk fra hverdagens stress, et skridt ind i sommerhusidyllen",
        thoughtfulLayout: "En Gennemtænkt rumfordeling",
        floorPlan: "Plantegning",
        luxuryNatureTitle: "Sommerhuset Hvor Luksus forenes med naturen",
        blommehusetDescription:
          "Blommehuset i Marielyst er et ideelt sted for en fantastisk ferieoplevelse, hvor faciliteterne og beliggenheden kombineres til at skabe den perfekte ramme. Placeret i det smukke Marielyst-område, tilbyder det komfort og stil for alle gæster.",
        experienceMessage:
          "EN OPLEVELSE, DER VIL FÅ DIG TIL AT KOMME TILBAGE IGEN OG IGEN.​",
        locationTitle: "Lokation",
        mapLocation: "Blommestien 3, 4872 Idestrup, Danmark",
        location: "Lokation",
        blommehuset: "Blommehuset",
        addressLine1: "Blommestien 3",
        addressLine2: "4872 Idestrup, Danmark",
        supermarket: "Supermarked",
        supermarketDistance: "500m til indkøb",
        restaurant: "Restaurant",
        restaurantDistance: "1500m til nærmeste restaurant",
        beach: "Strand",
        beachDistance: "700m til stranden",
        golf: "Golf",
        golfDistance: "2800m til en golfbane",
        copenhagen: "København",
        copenhagenDistance: "1,5 Timer / 141 KM",
        odense: "Odense",
        odenseDistance: "2 Timer / 182 KM",
        berlin: "Berlin",
        berlinDistance: "4,5 Time / 303 KM",
        hamburg: "Hamborg",
        hamburgDistance: "3,5 Time / 227 KM",
        cityThatGivesMemories: "Byen der giver minder",
        bestBeach: "Danmarks bedste badestrand",
        marielystArea:
          "Området omkring Marielyst byder på en væld af oplevelser og aktiviteter.",
        surfCenterFalster: "Surfcenter Falster",
        surfCenterDescription:
          "Surfcenter Falster tilbyder en bred vifte af aktiviteter, herunder windsurfing, kitesurfing, SUP (stand-up paddle) og kajakroning. Uanset om du er nybegynder eller erfaren, har vi udstyr og undervisning tilpasset dit niveau.",
        discoverMore: "Opdag Mere",
        marielystOldBathingTown: "Marielyst – Den gamle badeby",
        marielystDescription:
          "Marielyst – Den gamle badeby er en charmerende destination med mere end 100 års historie. Beliggende på Falster, byder byen på en vidunderlig sandstrand, hyggelige caféer og spændende aktiviteter for hele familien. Perfekt til en afslappende ferie ved havet!",
        bikeHikingTours: "Cykel- og vandreture",
        bikeHikingDescription:
          "Udforsk den smukke natur omkring Marielyst med velanlagte cykel- og vandreruter gennem skov, marker og langs kysten.",
        guestExperienceTitle: "GÆSTE OPLEVELSER",
        guestReview:
          '"Der manglede intet. Der var massere af aktiviteter i huset og lækkert at det var så tæt på vandet. / Overdragelsen og tilbageleveringen foregik problemfrit, om kommunikationen med ejeren for god og hyggelig. / Super ferie!."',
        reviewerDetails:
          "Tina – Søborg (Familieferie med større børn, februar 2021)",
        summerHouseInspiration:
          "Inspireret af dansk sommer, omgivet af naturen, der vækker minder mange år frem.",
        summerHouseOffers: "Sommerhuset Tilbyder",
        facilitiesTitle:
          "All de nødvendige faciliteter til et hyggeligt og behageligt ophold",
        pool: "Pool",
        poolDescription:
          "18m2 stor pool med rutchebane for de små og en 6 personer indendørs spa.",
        caretaker: "Vicevært",
        caretakerDescription:
          "En vicevært er tilknyttet sommerhuset og vil være behjælpelig med eventuelle problemer, der måtte opstå.",
        wifi: "Wifi & Internet",
        wifiDescription:
          "Lynhurtig 100 / 100 forbindelse til den store familie.",
        appliances: "Alle Fornødne Hvidevare",
        appliancesDescription:
          "Opvaskemaskine, vaskemaskine, tørretumbler, køleskab og fryser er tilgængelige i sommerhuset.",
        tvPackage: "TV Pakke",
        tvPackageDescription:
          "Tilbyder et bredt udvalg af populære kanaler, herunder underholdning, sport, nyheder og børneprogrammer, noget for hele familien.",
        activities: "Billiard / Bordtennis mm.",
        activitiesDescription:
          "Glæd dig til en bred vifte af sjove og spændende aktiviteter, der er skræddersyet til at underholde hele familien og sikre, at I får en uforglemmelig tid sammen.",
        about_description: "Bygget i 2008 Ved Blommestien",
        about_title: "Om Blommehuset",
        about_subtitle: "Stilhed og renhed: Sommerglæder i Marielyst",
        about_resort_alt: "resort billede",
        about_welcome_text: "Velkommen til Blommehuset",
        about_title_location: "I Hjertet af Marielyst",
        about_paragraph:
          "Nær Marielysts skønne strand ligger dette hyggelige Skanlux-poolhus med plads til hele familien. Med placering i ferieparadiset Marielyst – nær både restauranter, indkøb og strand – er udgangspunktet for en god ferie på plads!",
        about_hero_second_image_alt: "hero andet billede",
        about_image_alt_1: "første billede af sommerhuset",
        about_image_alt_2: "andet billede af sommerhuset",
        about_summer_house_info: "Lidt om Sommerhuset",
        about_title_togetherness: "Sammenhold og hygge",
        about_paragraph_1:
          "Indendørs finder i ligeledes gode rammer for en dejlig ferie. Huset byder på både komfort og hygge med rummeligt køkken-alrum, helt egen poolafdeling og aktivitetsrum.",
        about_paragraph_2:
          "Husets flotte poolafdeling indeholder pool med vandrutsjebane, et dejligt 6-personers spabad samt en stor sauna, hvor feriestemningen rigtigt kan sprede sig.",
        about_paragraph_3:
          "I aktivitetsrummet er der ligeledes lagt op til gode timer. Her er der ingen undskyldning for at sidde stille, når der både kan dystes i bordtennis/billard og dart.",
        about_more_info: "Og lidt mere...",
        about_kitchen_garden_title: "Køkken, have og gode nætter",
        about_kitchen_paragraph_1:
          "Køkkenet er åbent og velindrettet, så der uden problemer kan være mange kokke og køkkenskrivere om den fælles madlavning. Efterfølgende kan måltidet nydes ved det lange spisebord, hvor hele flokken kan samles.",
        about_kitchen_paragraph_2:
          "Den danske sommer kan nydes på terrassen i gode havemøbler, hvor også maden kan tilberedes på grill. På den store grund, der omkranser huset, er der også tænkt på de mindste gæster med sandkasse, legetårn og stor græsplæne.",
        about_kitchen_paragraph_3:
          "Når alle mand skal sove foregår dette i en af de to soveafdelinger med hver 3 dobbeltværelser. De sidste 6 sovepladser finder I på en af sommerhusets 2 hemse.",
        about_image_alt_3: "første billede af køkken og have",
        about_image_alt_4: "andet billede af køkken og have",
        "about_Swimming Pool": "Swimming Pool",
        "about_Washing Machine and Dryer": "Vaskemaskine og Tørretromler",
        "about_Dedicated Caretaker": "Dedikeret Vicevært",
        "about_Coffee Machine": "Kaffe Maskine",
        "about_Wifi & Internet": "Wifi & Internet",
        "about_Large Parking Space": "Stor parkerings plads",
        "about_Outdoor Grill": "Udendørs Gril",
        about_Fireplace: "Brændeovn",
        about_Dishwasher: "Opvaskemaskine",
        "about_Streaming TV": "Streaming TV",
        "about_Hair Dryer": "Hair Dryer",
        "about_Floor Heating": "Gulv Varme",
        about_indoor_furnishing: "Indretning",
        about_indoor_facilities: "Faciliteter indendørs",
        about_facilities_and_services: "Faciliteter og services​",
        about_facilities_description:
          "Sommerhuset tilbyder en bred vifte af faciliteter for både børn, voksne og ældre. Uanset om du ønsker at slappe af eller være aktiv, er der noget for alle. Indendørs finder du en pool, billardbord, airhockey, børnebillard, bordfodbold samt professionelle poker- og blackjack-spil. Der er også en stor XL-tv-skærm med Xbox Ultimate-pakken og 4 controllere, så hele familien kan spille sammen. Udendørs kan du nyde den enorme have, der rummer Blommehusets største legeplads – perfekt til sjov og leg. Der er også masser af muligheder for haveaktiviteter, herunder vandkamp og meget mere. Huset er også tilknyttet en vicevært som vil være til rådighed på næsten alle timer af døgnet, samt en pool mand som tjekker poolen 2 gange om ugen for at sikre sig en god og sikker oplevelse for gæsterne.",
        about_Technician: "Tekniker",
        "about_Caretaker & Pool Man": "Vicevært & Pool Mand",
        about_Pool: "Pool",
        "about_Spa and Pool": "Spa og Pool",
        "about_XL Screen": "XL Skærm",
        "about_Games and TV": "Spil og TV",
        about_Playground: "Legeplads",
        "about_Garden and Outdoor Tools": "Have og Ude redskaber",
        about_blommehuset_description_1:
          "Blommehuset i Marielyst er et ideelt sted for en fantastisk ferieoplevelse, hvor faciliteterne og beliggenheden kombineres til at skabe den perfekte ramme. Placeret i det populære ferieområde Marielyst, er dette sommerhus nær restauranter, indkøbsmuligheder og stranden, hvilket giver jer alle de nødvendige bekvemmeligheder inden for rækkevidde.",
        about_blommehuset_description_2:
          "Dette rummelige sommerhus tilbyder en bred vifte af faciliteter, der passer til enhver smag og aldersgruppe. Indendørs kan I nyde en privat poolafdeling med en 22 m² stor pool, komplet med vandrutsjebane til børnene, et rummeligt 6-personers spabad og en stor sauna til ultimativ afslapning. Der er også to separate aktivitetsrum, hvor I kan udfordre hinanden i forskellige spil som bordtennis, billard og dart. Det åbne og velindrettede køkken-alrum giver plads til fælles madlavning og hyggelige måltider rundt om det lange spisebord.",
        about_blommehuset_description_3:
          "Udendørs er der en stor terrasse med havemøbler og grill, hvor I kan nyde de danske sommerdage og lave mad under åben himmel. Den omkringliggende grund på 2100 m² er perfekt til børnene, stor græsplæne til leg og boldspil.",
        about_blommehuset_description_4:
          "Sommerhuset rummer i alt 6 dobbeltværelser og 2 hemse, hvilket giver plads til op til 18 personer. Der er også faciliteter til de mindste, herunder en barneseng og en høj stol.",
        about_blommehuset_description_5:
          "Dette sommerhus er velegnet til forskellige lejligheder, herunder familiefødselsdage, konfirmationer, bryllupper og firmaarrangementer.",
        about_activities: "Aktiviteter",
        about_included: "Inkluderet",
        about_distance_to_places: "Afstand til diverse steder",
        about_prices: "Priser",
        about_distance_to_restaurant: "1.5 km to restaurant",
        about_distance_to_beach: "700 m til stranden",
        about_distance_to_shopping: "500 m til indkøbsmuligheder",
        about_distance_to_golf: "2800 m til en golfbane",
        about_price_electricity: "Strøm: 3,40 DKK/kWh",
        about_price_water: "Vand: 85,00 DKK/m³",
        about_price_heating: "Varme: 2,60 DKK/kWh",
        about_price_deposit: "Depositum: 6.000 DKK",
        "about_Outdoor and Indoor SPA": "Ude og indendørs SPA",
        "about_Indoor Swimming Pool": "Indendørs Svømming pool",
        about_Sauna: "Sauna",
        about_Billiard: "Billiard",
        about_Dart: "Dart",
        "about_Table Tennis": "Bord Tennis",
        "about_Espresso / Coffee Machine": "Espresso / Kaffe Maskine",
        "about_Washing and Drying Machine": "Vaske og Tørre Maskine",
        faq_perfect_hiking: "PERFEKT VANDRETUR",
        faq_title: "FAQ",
        faq_hiking_region_description:
          "Andermatt-regionen tilbyder fremragende vandremuligheder.",
        faq_amazing_experience: "Den Fantastiske Oplevelse",
        faq_diving_snorkelling: "Dykning & Snorkling",
        faq_diving_description_1:
          "Kun en kort bådtur fra Nanuku's strand ligger Beqa Lagoon, hjemsted for et af verdens største barriererev. Udforsk de klare, rolige vand, hvor du kan se så langt som 30 meter frem. En spektakulær undervandsverden venter, med smukke revformationer dækket af bløde koraller i næsten enhver tænkelig farve, fra lys lilla og levende orange til mild olivengrøn. Hold øjnene åbne for rigeligt marineliv, herunder manta stråler, hawksbill skildpadder og skoler af tropiske fisk, der svømmer forbi.",
        faq_diving_description_2:
          "Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tinci dunt. Cras dapibus. Vivamus elementum semper nisi.",
        faq_diving_description_3:
          "Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.",
        faq_frequently_asked_questions: "OFTE STILLEDE SPØRGSMÅL",
        faq_hiking_tips: "VANDRETIPS & FAQ",
        faq_hiking_description:
          "Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.",
        blog_latest_news: "Seneste Nyheder & Blog",
        blog_our_news: "Vores Nyheder",
        select_check_out: "Vælg Check-out",
        please_wait: "Vent venligst...",
        select_check_in_date: "Vælg Check-in Dato",
        room_price: "Pris",
        check_availability: "Tjek tilgængelighed",
        nav_home: "Hjem",
        nav_ophold: "Ophold",
        nav_about_hotel: "Om Sommerhuset",
        nav_gallery: "Billeder",
        nav_faq: "FAQ",
        nav_news: "Nyheder",
        house_name: "Blommehuset",
        indoor_pool: "Indendørs Pool",
        spa: "Inde og ude spa",
        sauna: "Sauna",
        activity_room: "Aktivitetsrum",
        guests: "Gæster",
        pets_allowed: "Husdyr tilladt",
        bathrooms: "Badeværelser",
        bedrooms: "Værelser",
        lofts: "Hems",
        energy_friendly: "Energi Venlig",
        house_description_1:
          "Blommehuset i Marielyst er et ideelt sted for en fantastisk ferieoplevelse, hvor faciliteterne og beliggenheden kombineres til at skabe den perfekte ramme. Placeret i det populære ferieområde Marielyst, er dette sommerhus nær restauranter, indkøbsmuligheder og stranden, hvilket giver jer alle de nødvendige bekvemmeligheder inden for rækkevidde.",
        house_description_2:
          "Dette rummelige sommerhus tilbyder en bred vifte af faciliteter, der passer til enhver smag og aldersgruppe. Indendørs kan I nyde en privat poolafdeling med en 22 m² stor pool, komplet med vandrutsjebane til børnene, et rummeligt 6-personers spabad og en stor sauna til ultimativ afslapning. Der er også to separate aktivitetsrum, hvor I kan udfordre hinanden i forskellige spil som bordtennis, billard og dart. Det åbne og velindrettede køkken-alrum giver plads til fælles madlavning og hyggelige måltider rundt om det lange spisebord.",
        house_description_3:
          "Udendørs er der en stor terrasse med havemøbler og grill, hvor I kan nyde de danske sommerdage og lave mad under åben himmel. Den omkringliggende grund på 2100 m² er perfekt til børnene, stor græsplæne til leg og boldspil.",
        house_description_4:
          "Sommerhuset rummer i alt 6 dobbeltværelser og 2 hemse, hvilket giver plads til op til 18 personer. Der er også faciliteter til de mindste, herunder en barneseng og en høj stol.",
        house_description_5:
          "Dette sommerhus er velegnet til forskellige lejligheder, herunder familiefødselsdage, konfirmationer, bryllupper og firmaarrangementer.",
        distance_to_places: "Afstand til diverse steder",
        distance_to_restaurant: "1.5 km til restaurant",
        distance_to_beach: "700 m til stranden",
        distance_to_shopping: "500 m til indkøbsmuligheder",
        distance_to_golf: "2800 m til en golfbane",
        prices: "Priser",
        electricity_price: "Strøm: 3,40 DKK/kWh",
        water_price: "Vand: 85,00 DKK/m³",
        heating_price: "Varme: 2,60 DKK/kWh",
        deposit_price: "Depositum: 6.000 DKK",
        missing_booking_title: "Manglende Booking Information",
        missing_booking_description:
          "Venligst fuldfør din booking før du går videre til checkout.",
        go_back_to_booking: "Gå Tilbage til Booking",
        order_summary: "Ordreoversigt",
        total_base_price: "Total Basispris",
        discount: "Rabatt",
        extra_services_price: "Ekstra Tjenester Pris",
        cleaning: "Rengøring",
        total_price: "Total Pris",
        coupon_code: "Rabattkode (valgfri)",
        enter_coupon_code: "Indtast rabatkoden",
        apply_coupon: "Anvend Rabatkode",
        contact_information: "Kontaktinformation",
        contact_info_description:
          "Vi bruger denne e-mail til at sende dig detaljer og opdateringer om din bestilling.",
        first_name: "Fornavn",
        last_name: "Efternavn",
        email: "E-mail",
        phone: "Telefon",
        mobile_optional: "Mobil (valgfri)",
        city: "By",
        address: "Adresse",
        postal_code: "Postnummer",
        country: "Land",
        company_name_optional: "Firmanavn (valgfri)",
        vat_number_optional: "Momsnummer (valgfri)",
        currency_code: "Valutakode",
        comment_optional: "Kommentar (valgfri)",
        comment_placeholder: "Indtast din kommentar her (valgfri)",
        checkout: "Checkout",
        extra_services: "Ekstra Tjenester",
        cleaning_fees: "Rengøringsgebyrer",
        linned_per_set: "Linned (per sæt)",
        linned_sets: "Linned Sæt",
        total_cost: "Samlet Pris",
        activitiess: "Aktiviteter",
        included: "Inkluderet",
        activity_spa: "Ude og indendørs SPA",
        activity_indoor_pool: "Indendørs Svømming pool",
        activity_sauna: "Sauna",
        activity_billiard: "Billiard",
        activity_dart: "Dart",
        activity_table_tennis: "Bord Tennis",
        included_floor_heating: "Gulv Varme",
        included_streaming_tv: "Streaming TV",
        included_wifi_internet: "Wifi & Internet",
        included_hair_dryer: "Hår Tørre",
        included_coffee_machine: "Espresso / Kaffe Maskine",
        included_washing_dryer_machine: "Vaske og Tørre Maskine",
        included_dishwasher: "Opvaskemaskine",
        included_fireplace: "Brændeovn",
        book_your_stay_now: "Book Din Ophold Nu",
        reserve: "Reserver",
        adults: "Voksne",
        children: "Børn",
        fantasticExperience: "Fantastisk oplevelse",
        tvTitle: '85" Samsung TV til enhver oplevelse',
        tvDesc1:
          "Blommehuset, hvor komfort og underholdning går hånd i hånd. Med en imponerende 85″ skærm i stuen får du en biografoplevelse i dit ferieparadis. Denne store skærm sikrer, at alle gæster kan nyde krystalklare billeder og en fantastisk visuel oplevelse, uanset hvor de sidder.",
        tvDesc2:
          "Blommehuset tilbyder ikke kun et væld af underholdningsmuligheder med adgang til 28 kanaler, inklusive tyske kanaler, men også Netflix og YouTube Premium Univers. Uanset om du er til film, serier eller videoer, er der noget for enhver smag.",
        tvDesc3:
          "Forestil dig, hvordan en aften med film og streaming på den store skærm kan samle familien og skabe uforglemmelige minder. Vores sommerhus er designet til at gøre dit ophold så behageligt og underholdende som muligt. Blommehuset er designet til at gøre dit ophold så behageligt og underholdende som muligt.",
        userExperiences: "Bruger Oplevelser",
        channels21: "21+ Waoe Kanaler",
        netflix: "Netflix",
        youtubePremium: "YouTube Premium",
        xboxUltimate: "Xbox Ultimate med 4 kontroller",
        samsungChannels: "100+ Kanaler fra Samsung",
        samsungAppStore: "Samsung App Store",
        bookNow: "Book Nu",
        gatherFamily: "Saml familien, se stort",
        bigScreen: "Stor skærm, større oplevelse.",
      },
      "da"
    );

    await prisma.$transaction([
      prisma.translation.createMany({
        data: enSeeds,
        skipDuplicates: true,
      }),
      prisma.translation.createMany({
        data: daSeeds,
        skipDuplicates: true,
      }),
    ]);

    return NextResponse.json({ success: true, message: "Seeding complete!" });
  } catch (err) {
    console.error("❌ Error seeding translations:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
