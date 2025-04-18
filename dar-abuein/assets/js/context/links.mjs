"use strict";

const links = {
    portal: [
        {
            label: "Dashboard",
            path: "/v1/portal/dashboard",
        },
        {
            label: "Posts",
            path: "/v1/portal/posts",
        },
        {
            label: "Settings",
            path: "/v1/portal/settings",
        },
    ],
    settings: [
        {
            label: "Billing information",
            path: "/v1/portal/settings/billing",
        },
        {
            label: "Personal information",
            path: "/v1/portal/settings/edit",
        },
        {
            label: "Privacy settings",
            path: "/v1/portal/settings/privacy",
        },
        {
            label: "Profile",
            path: "/v1/portal/settings/profile",
        },
    ],
    nav: [
        {
            label: " Home",
            path: "/v1/",
            isPublic: true,
        },
        {
            label: "About",
            path: "/v1/about",
            isPublic: true,
        },
        {
            label: "Projects",
            path: "/v1/projects",
            isPublic: true,
            subMenu: [
                {
                    label: "Game",
                    path: "/v1/projects/game",
                    isPublic: true,
                },
                {
                    label: "Location",
                    path: "/v1/projects/location",
                    isPublic: true,
                },
                {
                    label: "Map",
                    path: "/v1/projects/map",
                    isPublic: true,
                },
                {
                    label: "Jazzaz",
                    path: "/v1/projects/jazzaz",
                    isPublic: true,
                },
                {
                    label: "Kartate",
                    path: "/v1/projects/kartate",
                    isPublic: true,
                },
                {
                    label: "Kutbi",
                    path: "/v1/projects/kutbi",
                    isPublic: true,
                },
                {
                    label: "Palestine Riders",
                    path: "/v1/projects/palestine-riders",
                    isPublic: true,
                },
                {
                    label: "Playdate",
                    path: "/v1/projects/playdate",
                    isPublic: true,
                },
                {
                    label: "prjctX",
                    path: "/v1/projects/prjctx",
                    isPublic: true,
                },
                {
                    label: "Sowar",
                    path: "/v1/projects/sowar",
                    isPublic: true,
                },
                {
                    label: "Beladi",
                    path: "/v1/projects/beladi",
                    isPublic: true,
                },
            ],
        },
        {
            label: "Money",
            path: "/v1/money",
            isPublic: true,
            subMenu: [
                {
                    label: "Donation",
                    path: "/v1/money/donation",
                    isPublic: true,
                },
                {
                    label: "Payment",
                    path: "/v1/money/payment",
                    isPublic: true,
                },
                {
                    label: "Checkout",
                    path: "/v1/money/checkout",
                    isPublic: true,
                },
            ],
        },
        {
            label: "Feeds",
            path: "/v1/feeds",
            isPublic: true,
            subMenu: [
                {
                    label: "Read",
                    path: "/v1/feeds/read",
                    isPublic: true,
                },
                {
                    label: "Listen",
                    path: "/v1/feeds/listen",
                    isPublic: true,
                },
                {
                    label: "Watch",
                    path: "/v1/feeds/watch",
                    isPublic: true,
                },
                {
                    label: "See",
                    path: "/v1/feeds/see",
                    isPublic: true,
                },
            ],
        },
        {
            label: "Portal",
            path: "/v1/portal",
            isPublic: false,
            roles: ["user", "admin", "superadmin"],
            subMenu: [
                {
                    label: "Dashboard",
                    path: "/v1/portal/dashboard",
                    isPublic: false,
                },
                {
                    label: "Posts",
                    path: "/v1/portal/posts",
                    isPublic: false,
                },
                {
                    label: "Settings",
                    path: "/v1/portal/settings",
                    isPublic: false,
                },
                {
                    label: "Upload",
                    path: "/v1/portal/upload",
                    isPublic: true,
                },
                {
                    label: "Messaging",
                    path: "/v1/portal/messaging",
                    isPublic: true,
                },
                {
                    label: "Notifications",
                    path: "/v1/portal/notifications",
                    isPublic: true,
                },
                {
                    label: "Password",
                    path: "/v1/portal/password",
                    isPublic: true,
                },
                {
                    label: "Push",
                    path: "/v1/portal/push",
                    isPublic: true,
                },
                {
                    label: "Subscribe",
                    path: "/v1/portal/subscribe",
                    isPublic: true,
                },
                {
                    label: "Synchronize",
                    path: "/v1/portal/sync",
                    isPublic: true,
                },
            ],
        },
        {
            label: "Admin Panel",
            path: "/v1/admin",
            isPublic: false,
            roles: ["superadmin"],
        },
        {
            label: "Sign in",
            path: "/v1/portal/signin",
            isPublic: true,
            requiresGuest: true,
        },
        {
            label: "Sign out",
            path: "/v1/portal/signout",
            isPublic: false,
        },
    ],
};

export default links;