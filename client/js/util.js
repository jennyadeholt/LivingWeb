function isEmpty(str) {
    return (!str || 0 === str.length);
}

function hasContent(str) {
    console.log("HasContent " + str);
    return (str && str.length != 0);
}

function itemClicked(listing, $filter) {
    $updateProfitInfoWindow(listing, $filter);
}

