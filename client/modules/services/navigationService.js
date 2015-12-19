angular.module('ContactAgenda').service('navigationService', NavigationService);

function NavigationService() {

    var navigationItems = [
        {
            icon: "contacts",
            action: "contactsClicked()",
            title: "Contactes",
            url: "/contactes"
        },
        {
            icon: "book",
            action: "agendasClicked()",
            title: "Agendes",
            url: "/agendes"
        }
    ];

    var sideItems = [
        {
            icon: "reply",
            action: "logoutClicked()",
            title: "Surt"
        }
    ];

    function getNavigationItems() {
        return navigationItems;
    }

    function getSideItems() {
        return sideItems;
    }

    function titleFromRoute(route) {
        for (var i = 0; i < navigationItems.length; ++i) {
            if (navigationItems[i].url === route) return navigationItems[i].title;
        }
        return "";
    }

    return {
        getNavigationItems: getNavigationItems,
        getSideItems: getSideItems,
        titleFromRoute: titleFromRoute
    }
}