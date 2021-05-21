import forge from "node-forge";
import CryptoJS  from "crypto-js"

// const encodeURL = text => text.replace(/\+/g, "-").replace(/\//g, "_");
const decodeURL = text => text.replace(/-/g, "+").replace(/_/g, "/");

export const encryptRSA = (plainText, key) => {
    const publicKey = forge.pki.publicKeyFromPem(key);
    let encrypted = publicKey.encrypt(plainText, "RSA-OAEP", {
        md: forge.md.sha1.create(),
        mgf1: forge.mgf1.create()
    });
    let base64 = forge.util.encode64(encrypted);
    return base64
};

export const decryptRSA = (cipherText, key) => {
    const privateKey = forge.pki.privateKeyFromPem(key);
    return privateKey.decrypt(
        forge.util.decode64(decodeURL(cipherText)),
        "RSA-OAEP",
        {
            md: forge.md.sha1.create(),
            mgf1: {
                md: forge.md.sha1.create()
            }
        }
    );
};
// export const encryptionAES = (raw, password) => {
// 	var salt = "fa402db659644c9c881cde92013b2901";
// 	var iterations = 128;
// 	var bytes = CryptoJS.PBKDF2(password, salt, { keySize: 48, iterations: iterations });
// 	var iv = CryptoJS.enc.Hex.parse(bytes.toString().slice(0, 32));
// 	var key = CryptoJS.enc.Hex.parse(bytes.toString().slice(32, 96));
// 	var ciphertext = CryptoJS.AES.encrypt(raw, key, { iv: iv });
//     console.log(ciphertext)
//     console.log("byte:",bytes)
//     console.log("iv: ",iv)
//     console.log("key: ",key)
// 	return ciphertext.toString();
// }
export const aes_encryption = (raw, password)=>{
	var salt = "fa402db659644c9c881cde92013b2901";
	var keySize = 256;
    var ivSize = 128;
    var iterations = 1000;	 
   var key = CryptoJS.PBKDF2(password, salt, {
      keySize: keySize / 32,
      iterations: iterations
    });
  var iv = CryptoJS.lib.WordArray.random(ivSize/8);
  var encrypted = CryptoJS.AES.encrypt(raw, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC

  });
  return  iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}