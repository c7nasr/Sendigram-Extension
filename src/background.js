// Handle requests for passwords

import "crx-hotreload"
import fetchAdapter from "@vespaiach/axios-fetch-adapter";
import axios from "axios";
import {APIERRORHandler, deleteUserId, getMe, getUserId, Logout} from "./auth";

const API = "https://sendigram.herokuapp.com/v1/extension"
const req = axios.create({
    baseURL: API,
    adapter: fetchAdapter

});
chrome.storage.sync.get("logged_in", function(data) {
    if(data.logged_in)
      chrome.browserAction.setPopup({popup: "logged_in.html"});
     
  });



const SendPhoto = async (e) => {
    const userId = await getUserId()
    if (!userId){
        await Logout()
        await deleteUserId()
        return alert("You're Logged out. Please Login")
    }
    const isStillConnected = await getMe(userId)
    const imageURL = e.srcUrl

    if (!isStillConnected){
        await Logout()
        await deleteUserId()
        return alert("You're Logged out. Please ReLogin")
    }
    try{
       await req.post("/send/file",{link:imageURL,browserId:userId})

    }catch (e) {
        return APIERRORHandler(e)
    }


}

const SendAsText = async (text) => {
    const userId = await getUserId()
    if (!userId){
        await Logout()
        await deleteUserId()
        return alert("You're Logged out. Please Login")
    }

    const isStillConnected = await getMe(userId)

    if (!isStillConnected){
        await Logout()
        await deleteUserId()
        return alert("You're Logged out. Please ReLogin")
    }
    try{
        await req.post("/send/notify",{text,browserId:userId})

    }catch (e) {
        return APIERRORHandler(e)
    }

}


chrome.contextMenus.create({
    title: "Send Image: Sendigram",
    contexts: ["image"],
    onclick: (e) => SendPhoto(e)
});

chrome.contextMenus.create({
    title: "Send Selection: Sendigram",
    contexts: ["selection"],
    onclick: (e) => SendAsText(e.selectionText)
});

chrome.contextMenus.create({
    title: "Send Link: Sendigram",
    contexts: ["link"],
    onclick: (e) => SendAsText(e.linkUrl)
});

chrome.contextMenus.create({
    title: "Send Page Link: Sendigram",
    contexts: ["page"],
    onclick: (e) => SendAsText(e.pageUrl)
});

