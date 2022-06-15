import axios from "axios";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";

const login_button = document.getElementById("login");

const logout = document.getElementById("logout");

if (login_button) {
    login_button.addEventListener("click", Login);
}
if (logout) {
    logout.addEventListener("click", Logout);
}
const API = "https://sendigram.herokuapp.com/v1/extension"

const req = axios.create({
    baseURL: API,
    adapter: fetchAdapter

});
function Login() {
    login_extension();
}
const getUserId = () => {
    return new Promise((resolve,reject) => {
        chrome.storage.sync.get('userid',async function (items) {

            resolve(items?.userid)
        })
    })
}

const setUserId = (userid) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({userid: userid}, function () {
            resolve(userid)
        });
    })
}


async function login_extension() {
    let userId = await getUserId()
    if (!userId){
        userId = getRandomToken();
        await setUserId(userId)
    }
    await useToken(userId);

}

async function useToken(userid) {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value

    if (!email || !password) return alert("Incorrect Password or Email")
    const user = await extension_login(userid, email, password)
    if (!user)  return alert("Incorrect Password or Email")
    await setUserId(userid)
    alert("Successfully Logged")
    chrome.storage.sync.set({logged_in: true});
    chrome.browserAction.setPopup({popup: "logged_in.html"});
    window.close()

}

const extension_login = async (userId,email,password) => {
    try {
        const {data} = await req.post(`${API}/auth`,{"email":email,
            "password":password,
            "browserId":userId})

        return data
    }catch (e) {
        return null
    }

}

const extension_logout = async (userId,) => {
     await req.delete(`${API}/auth`,{data:{"browserId":userId}})
}


async function Logout() {

    chrome.storage.sync.get('userid', async function (items) {
        await extension_logout(items.userid)
        chrome.storage.local.set({logged_in: false});
        chrome.browserAction.setPopup({popup: "popup.html"});
        window.close();
    })

}


function getRandomToken() {
    const randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    let hex = '';
    for (let i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
}

const getMe = async (userId) =>{
    try {
        const {status,data} = await req.get(`/${userId}`, {adapter: fetchAdapter})
        if (status === 204){
            return null
        }else{
            return data
        }
    }catch (e) {
        return null
    }

}
const deleteUserId = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.clear()
        resolve()
    })
}

const APIERRORHandler = (e) => {
    if (e.response.data.code === 401 ||e.response.data.code === 400 || e.response.data.code === 404 || e.response.data.code === 302) {
        alert(e.response.data.message)
        return {success:false}
    }
    alert("Something went error while handle this request")
    return {success:false}

}


export {
    Logout,
    getUserId,
    getMe,
    deleteUserId,
    APIERRORHandler

}