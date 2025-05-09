module.exports.config = {
    name: 'autodown',
    version: '1.1.1',
    hasPermssion: 3,
    credits: 'Dev',
    description: 'Tự động tải xuống khi phát hiện liên kết',
    commandCategory: 'Tiện ích',
    usages: '[]',
    cooldowns: 2,
    images: [],
};

const axios = require('axios');
const fse = require('fs-extra');
const fs = require('fs-extra');
const apidown = require("caliph-api");
const path = __dirname+'/data/autodown.json';
const cheerio = require('cheerio');

module.exports.onLoad = () => {
    if (!fse.existsSync(path)) {
        fse.writeFileSync(path, '{}');
    }
};

function convertSecondsToHMS(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const remainingSeconds = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
}

async function facebookv2(url) {
	try {
      const headers = {
	"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
	"accept-encoding": "gzip, deflate, br",
	"accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pl;q=0.6,fr;q=0.5",
	"content-type": "application/x-www-form-urlencoded",
  "cookie": "sb=FC1jZh6vChlrihrT5tMFPfP7;datr=FC1jZmZURo4KdHok14sZ-_9D;locale=vi_VN;ps_n=1;ps_l=1;c_user=1228817010;xs=45%3AJDCKcrPprJLLgQ%3A2%3A1717775698%3A-1%3A11986%3A%3AAcUGdYidmoA5hMR7gnLiVgcu6YG8eHwq8mcyzrLgm_U;presence=C%7B%22lm3%22%3A%22g.6834871869889629%22%2C%22t3%22%3A%5B%7B%22o%22%3A0%2C%22i%22%3A%22u.100082668132301%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.7121170377986740%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.6131104626980297%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.6622398961156028%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.2483133375127232%22%7D%2C%7B%22o%22%3A0%2C%22i%22%3A%22g.7699949520118613%22%7D%5D%2C%22utc3%22%3A1717907833805%2C%22v%22%3A1%7D;fr=1kUrj9MKZtEwYqk2b.AWXcCsd2zrmBM5PBlk4WOEVU9yg.BmZS_P..AAA.0.0.BmZUCR.AWUfFtRMW4I;wd=1280x473;",
  "origin": "https://www.getfvid.com",
	"referer": "https://www.getfvid.com/",
	"sec-ch-ua": `"Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"`,
	"user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Mobile Safari/537.36"
};     
		const payload = new URLSearchParams();
		payload.append('url', url);
		const response = await axios.post("https://www.getfvid.com/downloader", payload, {
			headers: headers
		});
		const $ = cheerio.load(response.data);
		return {
			title: $('div.page-content div.col-lg-10 div:nth-child(3) div.col-md-5.no-padd h5 a').text().trim(),
			HD: $('div.page-content div.col-lg-10 div:nth-child(3) div.col-md-4.btns-download p:nth-child(1) a').attr('href'),
 			audio: $('div.page-content div.col-lg-10 div:nth-child(3) div.col-md-4.btns-download p:nth-child(3) a').attr('href')
		};
	} catch (error) {
		console.error("Error:", error);
		return null;
	}
}

async function aiodl(url) {
  try {
    const response = await axios.post("https://aiovd.com/wp-json/aio-dl/video-data", {
      url: url
    }, 
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const res = response.data;
    const result = {
      data: res.medias
    };
    return result;
  } catch (error) {
    console.error("Lỗi khi gọi aiodl:", error);
    throw error;
  }
}

async function strfb(el) {
  const parseString = (string) => {
    try {
      return JSON.parse(`{"text": "${string}"}`).text;
    } catch (error) {
      return "";
    }
  };

  const cookiess = require('./../../acc.json');
  const headers = {
    "sec-fetch-user": "?1",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-site": "none",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "cache-control": "max-age=0",
    authority: "www.facebook.com",
    "upgrade-insecure-requests": "1",
    "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
    "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    cookie: cookiess.cookie,
  };

  try {
    if (!el || !el.trim()) {
      return "Thiếu url facebook";
    }

    if (!el.includes("facebook.com")) {
      return "Vui lòng nhập video facebook hợp lệ!";
    }

    const { data } = await axios.get(el, { headers });
    const formattedData = data.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const userDataMatch = formattedData.match(/"__isCameraPostBucketOwnerUnion":"User".*?"name":"(.*?)"/);
    const reactionCountMatch = formattedData.match(/"total_reaction_count":(\d+)/);
    const hdMatch = formattedData.match(/"browser_native_hd_url":"(.*?)"/);
    const titleMatch = formattedData.match(/<meta\sname="description"\scontent="(.*?)"/);

    if (hdMatch && hdMatch[1]) {
      const result = {
        title: titleMatch && titleMatch[1] ? parseString(titleMatch[1]) : (data.match(/<title>(.*?)<\/title>/)?.[1] ?? ""),
        link: parseString(hdMatch[1]),
        user: userDataMatch && userDataMatch[1] ? parseString(userDataMatch[1]) : "",
        reactionCount: reactionCountMatch && reactionCountMatch[1] ? parseInt(reactionCountMatch[1]) : 0
      };
      return result;
    } else {
      return "Không thể lấy thông tin video vào thời điểm này. Vui lòng thử lại";
    }
  } catch (error) {
    return "Lỗi khi thực hiện yêu cầu";
  }
};

async function scldown(url) {
    try {
        const response = await axios.post("https://www.klickaud.org/download.php", new URLSearchParams(Object.entries({
            'value': url,
            'afae4540b697beca72538dccafd46ea2ce84bec29b359a83751f62fc662d908a': '2106439ef3318091a603bfb1623e0774a6db38ca6579dae63bcbb57253d2199e'
        })), {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": "RizFurr UwU"
            }
        });

        const $ = cheerio.load(response.data);
        const title = $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(1)').text();
        const link = $('#dlMP3').attr('onclick').split(`downloadFile('`)[1].split(`',`)[0];

        const result = {
                title: title,
                link: link
        };

        return result;
    } catch (error) {
        throw error;
    }
}

const snapsave = async (url) => {
  try {
    const ig_regex = /((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|reels|tv|stories)\/([^/?#&]+)).*/g;
    if (!url.match(ig_regex)) {
      return "Link Url not valid";
    }
    const decodeSnapApp = ([h, u, n, t, e, r]) => {
      const decode = (d, e, f) => {
        const g = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
        const h = g.slice(0, e);
        const i = g.slice(0, f);
        let j = d.split("").reverse().reduce((a, b, c) => {
          if (h.indexOf(b) !== -1) {
            a += h.indexOf(b) * (Math.pow(e, c));
          }
          return a;
        }, 0);
        let k = "";
        while (j > 0) {
          k = i[j % f] + k;
          j = (j - (j % f)) / f;
        }
        return k || "0";
      };
      r = "";
      for (let i = 0, len = h.length; i < len; i++) {
        let s = "";
        while (h[i] !== n[e]) {
          s += h[i++];
        }
        for (let j = 0; j < n.length; j++) {
          s = s.replace(new RegExp(n[j], "g"), j.toString());
        }
        r += String.fromCharCode(decode(s, e, 10) - t);
      }
      return decodeURIComponent(encodeURIComponent(r));
    };
    const getEncodedSnapApp = (data) => data.split("decodeURIComponent(escape(r))}(")[1].split("))")[0].split(",").map(v => v.replace(/"/g, "").trim());
    const getDecodedSnapSave = (data) => data.split("getElementById(\"download-section\").innerHTML = \"")[1].split("\"; document.getElementById(\"inputData\").remove(); ")[0].replace(/\\(\\)?/g, "");
    const decryptSnapSave = (data) => getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)));
    const formData = new URLSearchParams();
    formData.append("url", url);
    const response = await axios.post("https://snapsave.app/action.php?lang=id", formData, {
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://snapsave.app",
        "referer": "https://snapsave.app/id",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
      }
    });
    const decode = decryptSnapSave(response.data);
    const $ = cheerio.load(decode);
    const results = [];
      $("div.download-items__btn").each((_, ol) => {
        let _url = $(ol).find("a").attr("href");
        if (!/https?:\/\//.test(_url || "")) _url = `https://snapsave.app${_url}`;
        results.push({ url: _url });
      });
    if (!results.length) {
      return "Blank data";
    }
    return results;
  } catch (e) {
    return `${e.message}`;
  }
};
module.exports.handleEvent = async function({ api, event }) {
    const s = JSON.parse(fse.readFileSync(path));
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || DD/MM/YYYY");
    const cookiess = require('./../../acc.json');
    let streamURL = (url, ext = 'jpg') => require('axios').get(url, {
    responseType: 'stream',
}).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);
              
    if (event.senderID == (global.botID || api.getCurrentUserID())) return;
    if ((typeof s[event.threadID] == 'boolean' && !s[event.threadID])) return;

    const send = (a, b, c, d) => api.sendMessage(a, b?b: event.threadID, c?c: null, d?d: event.messageID),
    arr = event.args,
    regEx_tiktok = /^https?:\/\/(?:vm\.|vt\.|www\.|v\.)?(?:tiktok|douyin)\.com\//,
    regEx_douyin =  /(?:https:\/\/(?:www\.)?(?:iesdouyin|douyin)\.com\/(?:share\/(?:video|photo|note)\/(\d+)|video\/(\d+))|(https:\/\/v\.douyin\.com\/[\w\d]+))/,
    regEx_youtube = /(^https:\/\/)((www)\.)?(youtube|youtu)(PP)*\.(com|be)\//,
    regEx_facebook = /(^https:\/\/)(\w+\.)?(facebook|fb)\.(com|watch)\/((story\.php|page\.\w+)(\?|\/))?(story_fbid=|\w+\/)/,
    regEx_stotyfb = /(^https:\/\/)(www\.)?facebook\.com\/stories\/\d+\/[A-Za-z0-9_-]+=/,
    regEx_fbdl = /^https:\/\/(?:www\.)?facebook\.com\/(?:share|reel)\/.*$/i,
    regEx_fbv2 = /^https:\/\/(?:fb\.watch|www\.facebook\.com\/(?:reel|share)\/\d+)(?:\/)?$/,
    regEx_instagram = /((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|reels|tv|stories)\/([^/?#&]+)).*/g,
    regEx_threads = /^https?:\/\/www\.threads\.net\//,
    regEx_capcut = /(^https:\/\/)((www)\.)?(capcut)\.(com)\//,
    regEx_imgur = /(^https:\/\/)((www|i)\.)?(imgur)\.(com)\//,
    regEx_soundcloud = /(https:\/\/(?:www\.|m\.|on\.)?soundcloud\.com\S*)/g,
    regEx_zingmp3 = /(^https:\/\/)((www|mp3)\.)?(zing)\.(vn)\//,
    regEx_spotify = /(^https:\/\/)((www|open|play)\.)?(spotify)\.(com)\//,
    regEx_twitter = /(^https:\/\/)((www|mobile|web)\.)?(twitter|x)\.(com)\//,
    regEx_mediafire = /(^https:\/\/)((www|download)\.)?(mediafire)\.(com)\//,
    regEx_imgbb = /(^https:\/\/)((i)\.)?(ibb)\.(co)\//,
    regEx_filecatbox = /(^https:\/\/)((files)\.)?(catbox)\.(moe)\//,
    regEx_pinterest = /(^https:\/\/)(pin)\.(it)\//,
    regEx_nhaccuatui = /(^https:\/\/)((www)\.)?(nhaccuatui)\.(com)\//

for (const el of arr) {
if (regEx_tiktok.test(el)) {
   const platform = el.includes("tiktok") ? "TIKTOK" : "DOUYIN";
   const data = (await axios.post(`https://www.tikwm.com/api/`, { url: el })).data.data;
   send({body: `[ ${platform} ] - Tự Động Tải\n👉 Thả cảm xúc "😆" nếu muốn tải nhạc`, attachment: (data.images?await Promise.all(data.images.map($=>streamURL($))):await streamURL(data.play, 'mp4')),}, '', (err, dataMsg) => global.client.handleReaction.push({
                    name: this.config.name,
                    messageID: dataMsg.messageID,
                    url: data.music
                }));
        };
        /* END */
if (regEx_facebook.test(el)) {
    const fbdl = require('./../../data_api/fbdlpost.js');
    const cookie = cookiess.cookie;
    const url = el;

    fbdl.fbflpost(url, cookie, (error, res) => {
      if (error) {
    } else {
            let vd = res.attachment.filter($ => $.__typename == 'Video');
            let pt = res.attachment.filter($ => $.__typename == 'Photo');

            let s = attachment => send({
                body: `[ FACEBOOK ] - Tự Động Tải\n\n📝 Tiêu đề: ${res.message}\n⏰ Time: ${time}\n\n────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link` + '',
                attachment,
            }, '', (err, dataMsg) => global.client.handleReaction.push({
                name: this.config.name,
                messageID: dataMsg.messageID,
                url_audio: null
            }));

            Promise.all(vd.map($ => streamURL($.browser_native_sd_url, 'mp4')))
                .then(r => r.filter($ => !!$).length > 0 ? s(r) : '');

            Promise.all(pt.map($ => streamURL(($.image || $.photo_image).uri, 'jpg')))
                .then(r => r.filter($ => !!$).length > 0 ? s(r) : '');
        }
    });
};

if (regEx_youtube.test(el)) {
    const ytdl = require('ytdl-core');
    const info = await ytdl.getInfo(el);
    const format = info.formats.find((f) => f.qualityLabel && f.qualityLabel.includes('1080p') && f.audioBitrate);
    const formatvd = ytdl.chooseFormat(info.formats, { quality: '137' });
   const formatmp3 = ytdl.chooseFormat(info.formats, { quality: '25' });

const formattedTime = convertSecondsToHMS(info.videoDetails.lengthSeconds);
  
const inputTime = info.videoDetails.uploadDate;
const outputTimeZone = 'Asia/Ho_Chi_Minh';
const convertedTime = moment(inputTime).tz(outputTimeZone).format('DD/MM/YYYY');
  
    if (format) {
        const response = await axios.get(formatvd.url, { responseType: 'stream' });
   const attachmentData = response.data;
      send({
            body: `[ YOUTUBE ] - Tự Động Tải\n${info.videoDetails.title}\n👉 Thả cảm xúc "😆" nếu muốn tải nhạc`,
            attachment: attachmentData,
        }, '', (err, dataMsg) => global.client.handleReaction.push({
            name: this.config.name,
            messageID: dataMsg.messageID,
            url: formatmp3.url,
        }));
    }
};

if (regEx_spotify.test(el)) {
  const res = await global.down.spotifydl(el);
   send({body: `[ SPOTIFY ] - Tự Động Tải\n\n🎶 Bài hát: ${res.name}\n🎤 Ca sĩ: ${res.artists}\n\n⏰ Time: ${time}\n──────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`, attachment: await streamURL(res.download_url, 'mp3')});
  };

if (regEx_fbdl.test(el)) {
  const result = await strfb(el);
  const res = result.link;
  send({
    body: `[ FACEBOOK ] - Tự Động Tải\n`,
    attachment: (await axios.get(res, { responseType: "stream" })).data
    });
};

/*if (regEx_fbv2.test(el)) {
  const url = el;
  const result = await facebookv2(url);
  const res = result.HD;
  const response = await axios.get(res, { responseType: 'stream' });
  send({
    body: `[ FACEBOOK ] - Tự Động Tải\n\n📝 Tiêu đề: ${result.title}\n⏰ Time: ${time}\n────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`,
    attachment: response.data
    });
};*/

/*if (regEx_fbdl.test(el)) {
  const url = el;
  const result = await aiodl(url);
  send({
    body: `[ FACEBOOK ] - Tự Động Tải\n\n⏰ Time: ${time}\n────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`,
  attachment: await streamURL(result.data[0].url, 'mp4')
    });
};*/

if (regEx_threads.test(el)) {
    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
        'Cookie': '_uafec=Mozilla%2F5.0%20(Linux%3B%20Android%2010%3B%20K)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F120.0.0.0%20Mobile%20Safari%2F537.36;',
        'Accept-Language': 'vi-VN, en-US'
    };

    axios.get(`https://api.threadsphotodownloader.com/v2/media?url=${el}`, { headers })
        .then(async (res) => {
            const data = res.data;

            const attachment = data.image_urls && data.image_urls.length > 0
                ? await Promise.all(data.image_urls.map(url => streamURL(url, 'jpg')))
                : (data.video_urls && data.video_urls.length > 0
                    ? await streamURL(data.video_urls[0].download_url, 'mp4')
                    : null);

            send({
                body: `[ THREADS ] - Tự Động Tải`,
                attachment
            });
      });
};

   if (regEx_mediafire.test(el)) {
            const res = (await axios.get(`${global.config.configApi.link[1]}/api/mediafireDL?url=${el}/file&apikey=${global.config.configApi.key[1]}`)).data.result;
            send({body: `[ MEDIAFIRE ] - Tự Động Tải\n\n📝 Title: ${res.title}\n🔁 Kích thước: ${res.size}\n📎 Link download: ${res.link}\n────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`
        })
      };

  if (regEx_pinterest.test(el)) {
    try {
      const res = (await axios.get(`https://apibot.sumiproject.io.vn/pin/download?link=${el}`)).data;
  
      if (res.success && res.data && res.data.url) {
        let attachment = [];

        const url = res.data.url;
        const extension = url.split('.').pop();
  
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
          attachment = await streamURL(url, 'jpg');
        } else if (extension === 'mp4') {
          attachment = await streamURL(url, 'mp4');
        } else if (extension === 'gif') {
          attachment = await streamURL(url, 'gif');
        }
  
        send({
          body: `[ PINTEREST ] - Tự Động Tải\n\n📝 Tiêu đề: ${res.data.title}\n😻 Url: ${url}\n`,
          attachment
        });
      } else {
        send({ body: `[ PINTEREST ] - Tự Động Tải\n` });
      }
    } catch (error) {
    //  console.error("Error downloading Pinterest content:", error);
      send({ body: `cac loi down kia` });
    }
  }
    /*const res = await axios.get(`https://api.imgbb.com/1/upload?key=588779c93c7187148b4fa9b7e9815da9&image=${el}`);
      send({body: `[ PINTEREST ] - Tự Động Tải\n\n📎 Link ảnh: ${res.data.data.image.url}\n────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`, attachment: await streamURL(res.data.data.image.url, 'jpeg')});
     };   */  

if (regEx_zingmp3.test(el)) {
  const matchResult = el.match(/\/([a-zA-Z0-9]+)\.html/) || el.match(/([a-zA-Z0-9]+)$/);
    const id = matchResult?.[1];
    const response = await axios.get(`http://api.mp3.zing.vn/api/streaming/audio/${id}/128`, {
      responseType: 'stream'
    });
  send({body: `[ ZINGMP3 ] - Tự Động Tải\n\n────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`,
      attachment: response.data
    });
};

if (regEx_capcut.test(el)) {
    const capcutdl = require('./../../data_api/capcut.js');
    const url = el;
    const result = await capcutdl(url);
    const videoURL = result[0].video; 
        send({
          body: `[ CAPCUT ] - Tự Động Tải\n\n📝 Tiêu đề: ${result[0].title}\n😻 Mô tả: ${result[0].description}\n🌸 Lượt dùng: ${result[0].usage}\n────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`, attachment: await streamURL(videoURL, 'mp4')});
   };

if (regEx_soundcloud.test(el)) {
    const url = el;
    const result = await scldown(url);
    send({
      body: `[ SOUNDCLOUD ] - Tự Động Tải\n\n📝 Tiêu đề: ${result.title}\n⏰ Time: ${time}\n────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`, attachment: await streamURL(result.link, 'mp3')
    });
};

if (regEx_twitter.test(el)) {
    const twdown = require('./../../data_api/twdown.js');
    const url = el;
    const options = { text: true };
    const res = await twdown(url, options);

    const mediaUrls = res.media.filter(mediaItem => mediaItem); // Lọc các phần tử không rỗng trong mảng media
    const convertedDate = moment(res.date, "ddd MMM DD HH:mm:ss Z YYYY").format("dddd, DD/MM/YYYY - HH:mm:ss");

    const s = attachment => send({ 
        body: `[ TWITTER ] - Tự Động Tải\n\n📝 Tiêu đề: ${res.title}\n❤️ Lượt thích: ${res.likes}\n💬 Lượt trả lời: ${res.replies}\n🔁 Lượt retweet: ${res.retweets}\n📅 Ngày đăng: ${convertedDate}\n👤 Tác giả: ${res.author} (@${res.username})\n────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`, 
        attachment,
    }, '', (err, dataMsg) => global.client.handleReaction.push({
        name: configCommand.name, messageID: dataMsg.messageID, url_audio: null
    }));

    const videoUrls = mediaUrls.filter(mediaItem => res.type === 'video');
    const imageUrls = mediaUrls.filter(mediaItem => res.type === 'image');

    Promise.all(videoUrls.map(url => streamURL(url, 'mp4'))).then(r => r.length > 0 ? s(r) : '');
    Promise.all(imageUrls.map(url => streamURL(url, 'jpg'))).then(r => r.length > 0 ? s(r) : '');

};

if (regEx_instagram.test(el)) {
  const url = el;
  const res = await global.down.igdl(url);
  let vd = res.attachments.filter($ => $.type === 'Video');
  let pt = res.attachments.filter($ => $.type === 'Photo');

  let s = attachment => send({ 
      body: `[ INSTAGRAM ] - Tự Động Tải\n\n⏰ Time: ${time}\n──────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`, 
      attachment,
  }, '', (err, dataMsg) => global.client.handleReaction.push({
      name: configCommand.name, messageID: dataMsg.messageID, url_audio: null
  }));
  
  Promise.all(vd.map($ => streamURL($.url, 'mp4')))
      .then(r => r.filter($ => !!$).length > 0 ? s(r) : '');

  Promise.all(pt.map($ => streamURL($.url, 'jpg')))
      .then(r => r.filter($ => !!$).length > 0 ? s(r) : '');
     }
  }
};

/*if (regEx_nhaccuatui.test(el)) {
  const url = el;
  const result = await global.down.nhaccuatui(url);
  send({
    body: `[ NHACCUATUI ] - Tự Động Tải\n\n📝 Tiêu đề: ${result.title}\n👤 Ca sĩ: ${result.artist}\n⏰ Time: ${time}\n──────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`, attachment: await streamURL(result.link128, 'mp3')
  });
};

if (regEx_douyin.test(el)) {
  const url = el;
  const res = await global.down.downall(el);

  let vd = res.attachments.filter($ => $.type === 'Video');
  let pt = res.attachments.filter($ => $.type === 'Photo');

  let s = attachment => send({ 
      body: `[ DOUYIN ] - Tự Động Tải\n\n📝 Tiêu đề: ${res.title}\n\n⏰ Time: ${time}\n──────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`, 
      attachment,
  }, '', (err, dataMsg) => global.client.handleReaction.push({
      name: configCommand.name, 
      messageID: dataMsg.messageID,
      url: res.audio
  }));
  
  Promise.all(vd.map($ => streamURL($.url, 'mp4')))
      .then(r => r.filter($ => !!$).length > 0 ? s(r) : '');

  Promise.all(pt.map($ => streamURL($.url, 'jpg')))
      .then(r => r.filter($ => !!$).length > 0 ? s(r) : '');

};*/

/* END */
module.exports.handleReaction = async ({ api, event, handleReaction }) => {
  if(event.reaction == '😆'){
    const send = (a, b, c, d) => api.sendMessage(a, b?b: event.threadID, c?c: null, d),
    _ = handleReaction;
    let streamURL = (url, ext = 'jpg') => require('axios').get(url, {
    responseType: 'stream',
}).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);
    if ('url'in _) send({
        body: `[ MP3 DOWNLOAD ] - Down mp3 từ video\n\n🎶 Âm thanh từ video mà bạn yêu cầu nè\n✏️ Đây là tính năng tự động down mp3 khi bạn thả cảm xúc ( 😆 ) vào video`, attachment: await streamURL(_.url, 'mp3')}, '', '', _.messageID);
     }
};
module.exports.run = async ({ api, event }) => {
    const send = (a, b, c, d) => api.sendMessage(a, b?b: event.threadID, c?c: null, d?d: event.messageID);
    const data = JSON.parse(fse.readFileSync(path));
    s = data[event.threadID] = typeof data[event.threadID] != 'boolean'||!!data[event.threadID]?false: true;
    fse.writeFileSync(path, JSON.stringify(data, 0, 4));
    send((s?'Bật': 'Tắt')+' '+ this.config.name);
};