// DEBUG: remove userDataConsent
// chrome.storage.sync.remove(["userDataConsent"]);

const routes = [
  {
    path: "/popup",
    component: async () => {
      const data = await chrome.storage.sync.get();
      if (!data.userDataConsent || data.userDataConsent !== true) {
        return (await import("pages/ConsentPage.vue")).default;
      } else {
        return (await import("pages/PopupPage.vue")).default;
      }
    },
  },
  {
    path: "/options",
    component: () => import("layouts/OptionsLayout.vue"),
    children: [{ path: "", component: () => import("pages/OptionsPage.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
