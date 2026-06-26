const iconsMapping = {
    "Backpack": icons.backpack,
    "City Hall": icons.bank2,
    "Dirty Greg's": icons.carFrontFill,
    "Dirt Road": icons.carFrontFill,
    "Food": icons.forkKnife,
    "Personal Hitlist": icons.target,
    "Piggy Bank": icons.cash,
    "Rats": icons.rat,
    "University": icons.mortarboardFill,
    "Living Area": icons.house,
    "MailBox": icons.envelope,
    "Explore City": icons.compass,
    "Matching Game": icons.casino,
    "Gang": icons.people,
    "Casino": icons.casino,
    "WalMart": icons.basket,
    "Bus Station": icons.busFront,
    "Wellness Clinic": icons.lotos,
    "Soup Kitchen": icons.soupKitchen,
    "Arena": icons.crossedSwords,
    "Liquor Store": icons.liquor,
    "Dive Bar": icons.drink,
    "Skill Shop": icons.star,
    "Jungle": icons.jungle,
    "Technicolor Jungle": icons.jungle2,
    "Mines": icons.pickaxe,
    "Dumpster 2.0": icons.trash,
    "Beach": icons.beach,
    "River": icons.sail,
    "The Hoburbs": icons.hoburbs,
    "Recycling Bin": icons.recycle,
    "Candy Store": icons.candy,
    "Parking Garage": icons.parking,
    "Pawn": icons.ring,
    "Bernard": icons.neckTie
};

const navigationSidebarGroups = [
    {
        title: "AWAKE DUMP",
        descriptors: [
            "The Hoburbs",
            "River",
            "Mines",
            "Technicolor Jungle",
            "Matching Game",
        ],
    },
    {
        title: "DAILIES",
        descriptors: [
            "Beach",
            "Jungle",
            "Soup Kitchen",
            "Pawn Shop",
            "Recycling Bin",
            "Explore City",
            "Wellness Clinic",
        ],
    },
    {
        title: "SHOPS",
        descriptors: [
            "Candy Store",
            "Liquor Store",
            "Dive Bar",
            "Skill Shop",
        ],
    },
];

const rightPanelSections = [
    {
        title: "AREAS",
        descriptors: [
            "Northern Fence",
            "City",
            "Bernard's Mansion",
            "Second City",
            "Hoburbia",
            "Canbodia",
            "Carnival",
            "Chocolate Factory",
            "Fort Slugworth",
        ],
    },
    {
        title: "INFO",
        descriptors: ["Gang", "Lotto Land", "Message Boards"],
    },
];

const rightPanelShortcuts = [
    {
        href: "game.php?sr=197&cmd=gathering&do=board&board=13",
        label: "Gang Boards",
    },
    {
        href: "game.php?sr=115&cmd=active",
        label: "Players Online",
    },
];
