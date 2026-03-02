import type { AppComponent } from "../types/builder";

export interface SuggestedScreen {
  title: string;
  components: AppComponent[];
}

export interface AiGenerationResult {
  name: string;
  description: string;
  suggestedScreens: SuggestedScreen[];
  chatResponse: string;
}

function makeButton(label: string): AppComponent {
  return { id: crypto.randomUUID(), type: "button", label };
}
function makeText(label: string): AppComponent {
  return { id: crypto.randomUUID(), type: "text", label };
}
function makeInput(label: string, placeholder: string): AppComponent {
  return { id: crypto.randomUUID(), type: "input", label, placeholder };
}
function makeList(label: string, items: string[]): AppComponent {
  return { id: crypto.randomUUID(), type: "list", label, items };
}

function formatScreenCount(n: number): string {
  return `${n} screen${n !== 1 ? "s" : ""}`;
}

export function generateAppFromDescription(input: string): AiGenerationResult {
  const lower = input.toLowerCase();

  // ── Todo / Task ────────────────────────────────────────────────────────────
  if (/\b(todo|task|checklist|to-do|to do)\b/.test(lower)) {
    const screens: SuggestedScreen[] = [
      {
        title: "Home",
        components: [
          makeText("My Tasks"),
          makeList("Tasks", ["Buy groceries", "Call dentist", "Finish report"]),
          makeButton("Add New Task"),
        ],
      },
      {
        title: "Add Task",
        components: [
          makeText("New Task"),
          makeInput("Task name", "Enter task name..."),
          makeInput("Due date", "Select a date..."),
          makeButton("Save Task"),
        ],
      },
      {
        title: "Done",
        components: [
          makeText("Completed Tasks"),
          makeList("Completed", ["Bought groceries", "Paid bills"]),
          makeButton("Clear All"),
        ],
      },
    ];
    return {
      name: "TaskFlow",
      description:
        "A simple app to manage your tasks and stay organized throughout your day.",
      suggestedScreens: screens,
      chatResponse: `Got it! I've set up your app as **TaskFlow** — a task manager with ${formatScreenCount(screens.length)}. You can customize everything in the screen designer!`,
    };
  }

  // ── Shopping / Store ───────────────────────────────────────────────────────
  if (
    /\b(shop|store|buy|cart|product|ecommerce|e-commerce|purchase)\b/.test(
      lower,
    )
  ) {
    const screens: SuggestedScreen[] = [
      {
        title: "Browse",
        components: [
          makeText("Featured Products"),
          makeList("Products", [
            "Running Shoes",
            "Wireless Headphones",
            "Coffee Maker",
          ]),
          makeButton("View All Products"),
        ],
      },
      {
        title: "Cart",
        components: [
          makeText("Your Cart"),
          makeList("Cart Items", ["Running Shoes × 1", "Headphones × 2"]),
          makeButton("Proceed to Checkout"),
        ],
      },
      {
        title: "Checkout",
        components: [
          makeText("Complete Your Order"),
          makeInput("Email", "Enter your email..."),
          makeInput("Shipping address", "Enter your address..."),
          makeButton("Place Order"),
        ],
      },
    ];
    return {
      name: "ShopCart",
      description:
        "Browse products and manage your shopping cart with a smooth, intuitive experience.",
      suggestedScreens: screens,
      chatResponse: `Nice! I've set up **ShopCart** — a shopping app with ${formatScreenCount(screens.length)}: Browse, Cart, and Checkout. Customize the product list in the designer!`,
    };
  }

  // ── Notes / Journal / Diary ────────────────────────────────────────────────
  if (/\b(note|notes|journal|diary|memo|write|writing|thought)\b/.test(lower)) {
    const screens: SuggestedScreen[] = [
      {
        title: "Notes",
        components: [
          makeText("My Notes"),
          makeList("Recent Notes", [
            "Meeting summary",
            "Book recommendations",
            "Weekend plans",
          ]),
          makeButton("New Note"),
        ],
      },
      {
        title: "New Note",
        components: [
          makeInput("Title", "Note title..."),
          makeInput("Content", "Start writing..."),
          makeButton("Save Note"),
        ],
      },
    ];
    return {
      name: "QuickNotes",
      description:
        "Capture your thoughts and ideas instantly, wherever you are.",
      suggestedScreens: screens,
      chatResponse: `I've created **QuickNotes** for you — a clean note-taking app with ${formatScreenCount(screens.length)}. Add more screens like Tags or Search in the designer!`,
    };
  }

  // ── Quiz / Trivia / Game ───────────────────────────────────────────────────
  if (/\b(quiz|trivia|game|question|test|challenge|brain)\b/.test(lower)) {
    const screens: SuggestedScreen[] = [
      {
        title: "Home",
        components: [
          makeText("QuizMaster"),
          makeText("Test your knowledge with fun interactive quizzes!"),
          makeButton("Start Quiz"),
        ],
      },
      {
        title: "Question",
        components: [
          makeText("Question 1 of 10"),
          makeText("What is the capital of France?"),
          makeList("Answers", ["Paris", "London", "Berlin", "Madrid"]),
        ],
      },
      {
        title: "Results",
        components: [
          makeText("Quiz Complete!"),
          makeText("You scored 8 out of 10"),
          makeButton("Play Again"),
          makeButton("Share Score"),
        ],
      },
    ];
    return {
      name: "QuizMaster",
      description:
        "Test your knowledge with fun interactive quizzes on any topic.",
      suggestedScreens: screens,
      chatResponse: `Great idea! **QuizMaster** is set up with ${formatScreenCount(screens.length)}: a home screen, question view, and results page. Perfect for trivia nights!`,
    };
  }

  // ── Fitness / Workout / Exercise ───────────────────────────────────────────
  if (
    /\b(fit|fitness|workout|exercise|gym|health|run|running|sport|track|weight)\b/.test(
      lower,
    )
  ) {
    const screens: SuggestedScreen[] = [
      {
        title: "Dashboard",
        components: [
          makeText("Today's Summary"),
          makeList("Stats", [
            "Steps: 6,200",
            "Calories: 420",
            "Active minutes: 45",
          ]),
          makeButton("Log Workout"),
        ],
      },
      {
        title: "Log Workout",
        components: [
          makeText("New Workout"),
          makeInput("Exercise type", "e.g. Running, Cycling..."),
          makeInput("Duration (minutes)", "Enter duration..."),
          makeButton("Save Workout"),
        ],
      },
      {
        title: "History",
        components: [
          makeText("Workout History"),
          makeList("Past Workouts", [
            "Mon: Running 30min",
            "Wed: Cycling 45min",
            "Fri: Yoga 60min",
          ]),
          makeButton("View All"),
        ],
      },
    ];
    return {
      name: "FitTrack",
      description:
        "Track your workouts and reach your fitness goals with daily motivation.",
      suggestedScreens: screens,
      chatResponse: `Awesome! **FitTrack** is ready — a fitness tracker with ${formatScreenCount(screens.length)}: Dashboard, Log Workout, and History. Start adding your own exercises!`,
    };
  }

  // ── Recipe / Food / Cook ───────────────────────────────────────────────────
  if (
    /\b(recipe|food|cook|cooking|meal|kitchen|ingredient|dish|dinner|lunch)\b/.test(
      lower,
    )
  ) {
    const screens: SuggestedScreen[] = [
      {
        title: "Recipes",
        components: [
          makeText("My Cookbook"),
          makeList("Recipes", [
            "Pasta Carbonara",
            "Chicken Tikka",
            "Banana Bread",
          ]),
          makeButton("Add Recipe"),
        ],
      },
      {
        title: "Add Recipe",
        components: [
          makeInput("Recipe name", "Enter recipe name..."),
          makeInput("Ingredients", "List ingredients..."),
          makeInput("Instructions", "Step-by-step instructions..."),
          makeButton("Save Recipe"),
        ],
      },
    ];
    return {
      name: "MyCookbook",
      description:
        "Save your favorite recipes and discover new meals to cook at home.",
      suggestedScreens: screens,
      chatResponse: `Delicious idea! I've set up **MyCookbook** with ${formatScreenCount(screens.length)}: a recipe list and a form to add your own dishes. Bon appétit!`,
    };
  }

  // ── Finance / Budget / Money ───────────────────────────────────────────────
  if (
    /\b(finance|budget|money|expense|income|spend|spending|saving|bank|wallet)\b/.test(
      lower,
    )
  ) {
    const screens: SuggestedScreen[] = [
      {
        title: "Overview",
        components: [
          makeText("This Month"),
          makeList("Summary", [
            "Income: $3,200",
            "Expenses: $1,840",
            "Savings: $1,360",
          ]),
          makeButton("Add Transaction"),
        ],
      },
      {
        title: "Add Transaction",
        components: [
          makeInput("Amount", "Enter amount..."),
          makeInput("Category", "e.g. Food, Transport..."),
          makeButton("Save Transaction"),
        ],
      },
      {
        title: "History",
        components: [
          makeText("Transactions"),
          makeList("Recent", [
            "Groceries -$42",
            "Salary +$3,200",
            "Netflix -$15",
          ]),
        ],
      },
    ];
    return {
      name: "BudgetWise",
      description:
        "Track your income and expenses to stay on top of your personal finances.",
      suggestedScreens: screens,
      chatResponse: `Smart thinking! **BudgetWise** is ready with ${formatScreenCount(screens.length)}: an overview dashboard, transaction entry, and history. Take control of your money!`,
    };
  }

  // ── Social / Chat / Messaging ──────────────────────────────────────────────
  if (
    /\b(social|chat|message|friend|connect|community|network|post|share)\b/.test(
      lower,
    )
  ) {
    const screens: SuggestedScreen[] = [
      {
        title: "Feed",
        components: [
          makeText("What's happening?"),
          makeList("Posts", [
            "Alex shared a photo",
            "Jamie posted an update",
            "You have 3 new likes",
          ]),
          makeButton("Create Post"),
        ],
      },
      {
        title: "New Post",
        components: [
          makeInput("What's on your mind?", "Share something..."),
          makeButton("Post"),
        ],
      },
      {
        title: "Profile",
        components: [
          makeText("Your Profile"),
          makeList("Stats", ["Posts: 24", "Followers: 128", "Following: 63"]),
          makeButton("Edit Profile"),
        ],
      },
    ];
    return {
      name: "ConnectHub",
      description:
        "Share updates and connect with friends in your personal social space.",
      suggestedScreens: screens,
      chatResponse: `Love it! **ConnectHub** is set up with ${formatScreenCount(screens.length)}: a feed, post creator, and profile page. Build your community!`,
    };
  }

  // ── Default fallback ───────────────────────────────────────────────────────
  const words = input.trim().split(/\s+/).filter(Boolean);
  const nameWords = words
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const appName = nameWords.join("") || "MyApp";

  const screens: SuggestedScreen[] = [
    {
      title: "Home",
      components: [
        makeText(`Welcome to ${appName}`),
        makeList("Features", ["Feature 1", "Feature 2", "Feature 3"]),
        makeButton("Get Started"),
      ],
    },
    {
      title: "Settings",
      components: [
        makeText("Settings"),
        makeInput("Your name", "Enter your name..."),
        makeButton("Save Changes"),
      ],
    },
  ];

  return {
    name: appName,
    description: `${input.charAt(0).toUpperCase() + input.slice(1).trim()}.`,
    suggestedScreens: screens,
    chatResponse: `Got it! I've created **${appName}** with ${formatScreenCount(screens.length)} to get you started. Open the screen designer to customize everything — add buttons, lists, and more!`,
  };
}
