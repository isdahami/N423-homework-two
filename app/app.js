/* Importing the model.js file. */
import * as MODEL from "./model.js";

function route() {
    /* Getting the hash tag from the URL. */
    let hashTag = window.location.hash;
    /* Removing the hash tag from the URL. */
    let pageID = hashTag.replace("#", "");

    /* This is a conditional statement. If the pageID is empty, then the page will be changed to the home page. If the pageID is not empty, then the page will be changed to the pageID. */
    if(pageID == "") {
        MODEL.changePage("home");
    } else {
        MODEL.changePage(pageID);
    }   
}

function initListeners() {
    /* Listening for a change in the hash tag. */
    $(window).on("hashchange", route)
    /* Calling the route function. */
    route();   
}
 
$(document).ready(function () {
    initListeners();
});