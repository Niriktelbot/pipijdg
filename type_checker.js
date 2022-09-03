import axios from 'axios'

async function checkUsername(username){
    if(username.slice(-3).toLowerCase() == 'bot') return 'bot'
    let res = await axios.get(`https://t.me/${username.replace('@', '')}`)
    if(res.data.includes('subscribers')) return 'channel'
    if(res.data.includes('you can contact')) return 'user'
}

async function checkLink(link){
    if(link.slice(-3).toLowerCase() == 'bot' || link.slice(-4).toLowerCase() == 'bot/') return 'bot'
    let res = await axios.get(link)
    if(res.data.includes('subscribers')) return 'channel'
    if(res.data.includes('you can contact')) return 'user'
}

export default {checkUsername, checkLink}