import moment from "moment";
import {getMe, getUserId, Logout} from "./auth";

const user_name = document.getElementById("user")
const isTelegrammer = document.getElementById("isTelegrammer")
const notify = document.getElementById("notify")
const files = document.getElementById("files")


const newUsername = async () => {
    const userId = await getUserId()
    if (!userId) return await Logout()
    const data = await getMe(userId)
    if (!data) {
        return await Logout()
    }
    chrome.storage.sync.set({logged_in: true});
    user_name.innerHTML = userId;
    date.innerHTML = moment(data.createdAt).format("MMMM DD, YYYY @ hh:mm A")
    email.innerHTML = data.user.email
    isTelegrammer.innerHTML = data.user.isTelegramer ? "Connected to Sendigram Bot" : "Not Connected to our Bot"
    isTelegrammer.className = data.user.isTelegramer ? "bg-green-900 text-white my-2 w-fit rounded-lg py-1 px-2 mx-auto" : "bg-red-900 text-white my-2 w-fit rounded-lg py-1 px-2 mx-auto"
    notify.innerHTML = data.notifies.length
    files.innerHTML = data.files.length

}
newUsername()



