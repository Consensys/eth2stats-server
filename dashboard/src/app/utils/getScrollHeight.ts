const NavbarHeight = 96;
const BottomBarHeight = 60;
const MobileNavbarHeight = 128 - 50;
const MobileThreshold = 640;
const TabsHeight = 48;

export const getScrollHeight = (tabsVisible = false) => {
    let fixedElementsHeight = MobileNavbarHeight;

    if (window.innerWidth >= MobileThreshold) {
        fixedElementsHeight = NavbarHeight + BottomBarHeight;
    }

    if (tabsVisible) {
        fixedElementsHeight += TabsHeight;
    }

    return window.innerHeight - fixedElementsHeight;
};
