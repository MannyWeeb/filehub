/*Globals */

//File types
const fileTypes = {
    book     : ["pdf","epub","rtf","docx","odt"],
    image    : ["bmp","dib","jpg","jpeg","jpe","jfif","gif","tif","tiff","png","ico","heic","webp"],
    video    : ["mp4","avi","mkv","3gp","3g2","3gp","3gp2","3gpp","amv","asf","avi","bik","flv","gvi","gxf","m1v","m2v","m2t","m2ts","m4v","mkv","mov","mp2v","mp4","mp4v","mpe","mpeg","mpeg1","mpeg2","mpeg4","mpg"],
    music    : ["3ga","669","a52","aac","ac3","adt","adts","aif","aifc","aiff","amb","amr","aob","ape","au","awb","caf","dts","flac","m4a","m4b","m4p","m5p","mid","mka","mlp","mod","mpa","mp1","mp2","mp3","mpc","mpga","mus","oga","ogg","oma","qcp","ra","rmi","s3m","sid","spx","tak","tts"],
    archive  : ["rar","zip","7z","bin","iso"]
}

function bytesToSize(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}

function filterPath(path) {return path.replace(/[\u0020-\u002F\u005B-\u0060\u007B-\u007E\d]/g,"");}

function determineFileType(ext){
    for(const key of Object.keys(fileTypes)){
        if(fileTypes[key].indexOf(ext) !== -1)return key;
    }
    return "file";
}

function encodePath(type,path){
    return `/${type === "dir" ? "browse" : "preview"}?p=${encodeURIComponent(path)}`;
}


export { bytesToSize , filterPath , determineFileType , encodePath , fileTypes};