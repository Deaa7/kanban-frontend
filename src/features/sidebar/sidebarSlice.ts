
import {createSlice } from "@reduxjs/toolkit";
import type { StoreState} from "@/types/types";

type initialStateType = {
    theme: string;
    showSidebar: boolean;
};

let CurrentTheme = localStorage.getItem("theme");

if (!CurrentTheme) {
  CurrentTheme = window.matchMedia("(prefers-color-scheme:dark)").matches
    ? "dark"
    : "light";
  localStorage.setItem("theme", CurrentTheme);
}

let temp: string | null = localStorage.getItem("showSidebar");

let CurrentSidebarState: boolean = true;

if (!temp) {
  CurrentSidebarState = true;
  localStorage.setItem("showSidebar", "true");
} else {
  CurrentSidebarState = temp === "true";
}

const initialState: initialStateType = {
  theme: CurrentTheme,
  showSidebar: CurrentSidebarState,
};



const SidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
  
    toggleTheme: (state) => {
      let oldTheme = state.theme;
      state.theme = oldTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    changeSidebarState: (state) => {
      state.showSidebar = !state.showSidebar;

      localStorage.setItem("showSidebar", state.showSidebar.toString());
    },
  },
});

export default SidebarSlice.reducer;

export const {
  toggleTheme,
  changeSidebarState,
} = SidebarSlice.actions;



export const getTheme = (state: StoreState) :string => state.sidebar.theme;

export const getSidebarState = (state: StoreState) :boolean => state.sidebar.showSidebar;

